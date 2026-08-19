<?php
/**
 * Privacy-first conversation history for the full-screen assistant Page.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Stores opt-in, account-scoped WordPress AI conversations.
 *
 * Runtype remains the canonical store for Runtype sessions. This class never
 * duplicates those transcripts in WordPress. Browser-only history is handled
 * by Persona's storage adapter in assets/js/persona-history.js.
 */
class Persona_Assistant_History {

	const SCHEMA_VERSION = '1';
	const SCHEMA_OPTION  = 'persona_assistant_history_schema';
	const CRON_HOOK      = 'persona_assistant_history_cleanup';
	const REST_NAMESPACE = 'persona-assistant/v1';

	/** Register hooks. */
	public function __construct() {
		add_action( 'init', array( $this, 'maybe_upgrade' ), 5 );
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		add_action( self::CRON_HOOK, array( $this, 'delete_expired' ) );
		add_action( 'delete_user', array( $this, 'delete_user_history' ) );
		add_action( 'update_option_' . PERSONA_ASSISTANT_SETTINGS_OPTION, array( $this, 'settings_updated' ), 10, 2 );
		add_filter( 'wp_privacy_personal_data_exporters', array( $this, 'register_exporter' ) );
		add_filter( 'wp_privacy_personal_data_erasers', array( $this, 'register_eraser' ) );
	}

	/** Create/update tables and schedule retention cleanup. */
	public static function activate() {
		self::install_schema();
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', self::CRON_HOOK );
		}
	}

	/** Unschedule recurring work without removing user data. */
	public static function deactivate() {
		$timestamp = wp_next_scheduled( self::CRON_HOOK );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, self::CRON_HOOK );
		}
	}

	/** Install schema after an in-place plugin update. */
	public function maybe_upgrade() {
		if ( self::SCHEMA_VERSION !== (string) get_option( self::SCHEMA_OPTION, '' ) ) {
			self::install_schema();
		}
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', self::CRON_HOOK );
		}
	}

	/** Create the conversation and message tables using WordPress's upgrader. */
	private static function install_schema() {
		global $wpdb;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$charset       = $wpdb->get_charset_collate();
		$conversations = self::conversations_table();
		$messages      = self::messages_table();

		dbDelta(
			"CREATE TABLE {$conversations} (
				id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
				public_id char(36) NOT NULL,
				user_id bigint(20) unsigned NOT NULL,
				provider varchar(32) NOT NULL DEFAULT 'wordpress_ai',
				title varchar(255) NOT NULL DEFAULT '',
				created_at datetime NOT NULL,
				updated_at datetime NOT NULL,
				expires_at datetime NULL,
				PRIMARY KEY  (id),
				UNIQUE KEY public_id (public_id),
				KEY user_updated (user_id, updated_at),
				KEY expires_at (expires_at)
			) {$charset};"
		);

		dbDelta(
			"CREATE TABLE {$messages} (
				id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
				conversation_id bigint(20) unsigned NOT NULL,
				role varchar(20) NOT NULL,
				content longtext NOT NULL,
				created_at datetime NOT NULL,
				PRIMARY KEY  (id),
				KEY conversation_created (conversation_id, created_at)
			) {$charset};"
		);

		update_option( self::SCHEMA_OPTION, self::SCHEMA_VERSION, false );
	}

	/** Register account-history routes. */
	public function register_routes() {
		register_rest_route(
			self::REST_NAMESPACE,
			'/conversations',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'list_conversations' ),
					'permission_callback' => array( $this, 'permission' ),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_conversation' ),
					'permission_callback' => array( $this, 'permission' ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_all_conversations' ),
					'permission_callback' => array( $this, 'permission' ),
				),
			)
		);

		register_rest_route(
			self::REST_NAMESPACE,
			'/conversations/(?P<id>[a-f0-9-]{36})',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_conversation' ),
					'permission_callback' => array( $this, 'permission' ),
				),
				array(
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_conversation' ),
					'permission_callback' => array( $this, 'permission' ),
				),
			)
		);
	}

	/** Require logged-in, opt-in WordPress AI history. */
	public function permission() {
		if ( ! self::account_history_available() ) {
			return new WP_Error( 'persona_assistant_history_disabled', __( 'Account conversation history is not available.', 'persona-assistant' ), array( 'status' => 403 ) );
		}
		return true;
	}

	/** Whether the current visitor may use account history. */
	public static function account_history_available() {
		return 'wordpress_ai' === persona_assistant_resolve_mode()
			&& ! empty( persona_assistant_get_setting( 'wp_ai_account_history', false ) )
			&& is_user_logged_in();
	}

	/** Data consumed by the browser history adapter and assistant sidebar. */
	public function localized_data( $context, $preview = false ) {
		$settings     = persona_assistant_get_settings();
		$browser_mode = in_array( (string) $settings['history_browser_mode'], array( 'off', 'session', 'device' ), true ) ? (string) $settings['history_browser_mode'] : 'session';
		$account      = ! $preview && 'fullscreen' === $context && self::account_history_available();
		$selected     = $account ? $this->selected_conversation_id() : '';
		// Scoped by the selected surface: switching assistants partitions local
		// history the same way re-minting rotates the server-side namespace.
		$scope        = substr( hash( 'sha256', home_url( '/' ) . '|' . persona_assistant_resolve_mode() . '|' . persona_assistant_selected_surface_id() ), 0, 16 );

		if ( $preview ) {
			$browser_mode = 'off';
		}

		return array(
			'browserMode'     => $browser_mode,
			'storageKey'      => 'persona-assistant-' . $scope,
			'sessionKey'      => 'persona-assistant-session-' . $scope,
			'accountEnabled'  => $account,
			'selectedId'      => $selected,
			'collectionUrl'   => esc_url_raw( rest_url( self::REST_NAMESPACE . '/conversations' ) ),
			'nonce'           => $account ? wp_create_nonce( 'wp_rest' ) : '',
			'assistantUrl'    => $account ? esc_url_raw( get_permalink( persona_assistant_get_assistant_page_id() ) ) : '',
			'retentionDays'   => absint( $settings['history_retention_days'] ),
			'conversationArg' => 'persona_conversation',
			'strings'         => array(
				'loading'              => __( 'Loading conversations…', 'persona-assistant' ),
				'unavailable'          => __( 'Conversation history is unavailable.', 'persona-assistant' ),
				'newConversation'      => __( 'New conversation', 'persona-assistant' ),
				'deleteConversation'   => __( 'Delete this conversation?', 'persona-assistant' ),
				'deleteAll'            => __( 'Delete all saved conversations? This cannot be undone.', 'persona-assistant' ),
				'requestFailed'        => __( 'Conversation history request failed.', 'persona-assistant' ),
			),
		);
	}

	/** Validate and return the selected URL conversation when it belongs to this user. */
	private function selected_conversation_id() {
		if ( empty( $_GET['persona_conversation'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only selection.
			return '';
		}
		$public_id = sanitize_text_field( wp_unslash( $_GET['persona_conversation'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only selection.
		return $this->get_owned_conversation( $public_id ) ? $public_id : '';
	}

	/**
	 * List current user's conversations.
	 *
	 * Only conversations with stored messages are listed (mirroring Persona's
	 * Runtype history semantics): a conversation created ahead of a first
	 * message that never arrived is invisible until it holds a transcript.
	 * Includes the preview/messageCount summary fields Persona's history view
	 * renders in the rail rows.
	 */
	public function list_conversations() {
		global $wpdb;
		$conversations = self::conversations_table();
		$messages      = self::messages_table();
		$rows          = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT c.public_id, c.title, c.created_at, c.updated_at, c.expires_at,
					COUNT(m.id) AS message_count,
					SUBSTRING(
						(SELECT lm.content FROM {$messages} lm WHERE lm.conversation_id = c.id ORDER BY lm.id DESC LIMIT 1),
						1, 300
					) AS last_message
				FROM {$conversations} c
				INNER JOIN {$messages} m ON m.conversation_id = c.id
				WHERE c.user_id = %d
				GROUP BY c.id
				ORDER BY c.updated_at DESC LIMIT 100", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- trusted table names.
				get_current_user_id()
			),
			ARRAY_A
		);

		return rest_ensure_response(
			array_map(
				static function ( $row ) {
					return array(
						'id'           => (string) $row['public_id'],
						'title'        => '' !== (string) $row['title'] ? (string) $row['title'] : __( 'New conversation', 'persona-assistant' ),
						'preview'      => self::preview_excerpt( (string) $row['last_message'] ),
						'messageCount' => (int) $row['message_count'],
						'createdAt'    => mysql_to_rfc3339( $row['created_at'] ),
						'updatedAt'    => mysql_to_rfc3339( $row['updated_at'] ),
						'expiresAt'    => $row['expires_at'] ? mysql_to_rfc3339( $row['expires_at'] ) : null,
					);
				},
				is_array( $rows ) ? $rows : array()
			)
		);
	}

	/** Bounded single-line preview derived from a stored message. */
	private static function preview_excerpt( $content ) {
		$text = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( $content ) ) );
		return '' !== $text ? wp_html_excerpt( $text, 140, '…' ) : null;
	}

	/** Create an empty account conversation. */
	public function create_conversation() {
		global $wpdb;
		/**
		 * Filter the maximum saved conversations per WordPress user.
		 *
		 * @param int $limit Maximum conversations, hard-capped to 20-500.
		 */
		$limit = (int) apply_filters( 'persona_assistant_history_max_conversations', 100 );
		$limit = min( 500, max( 20, $limit ) );
		$count = (int) $wpdb->get_var(
			$wpdb->prepare( 'SELECT COUNT(*) FROM ' . self::conversations_table() . ' WHERE user_id = %d', get_current_user_id() ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- trusted table name.
		);
		if ( $count >= $limit ) {
			return new WP_Error( 'persona_assistant_history_limit', __( 'You have reached the saved conversation limit. Delete an older conversation and try again.', 'persona-assistant' ), array( 'status' => 429 ) );
		}

		$now       = current_time( 'mysql', true );
		$public_id = wp_generate_uuid4();
		$inserted  = $wpdb->insert(
			self::conversations_table(),
			array(
				'public_id'  => $public_id,
				'user_id'    => get_current_user_id(),
				'provider'   => 'wordpress_ai',
				'title'      => '',
				'created_at' => $now,
				'updated_at' => $now,
				'expires_at' => $this->expiry_mysql(),
			),
			array( '%s', '%d', '%s', '%s', '%s', '%s', '%s' )
		);

		if ( false === $inserted ) {
			return new WP_Error( 'persona_assistant_history_create_failed', __( 'The conversation could not be created.', 'persona-assistant' ), array( 'status' => 500 ) );
		}

		return new WP_REST_Response(
			array(
				'id'        => $public_id,
				'title'     => __( 'New conversation', 'persona-assistant' ),
				'createdAt' => mysql_to_rfc3339( $now ),
				'updatedAt' => mysql_to_rfc3339( $now ),
			),
			201
		);
	}

	/** Return a Persona-compatible safe state for one conversation. */
	public function get_conversation( $request ) {
		global $wpdb;
		$conversation = $this->get_owned_conversation( (string) $request['id'] );
		if ( ! $conversation ) {
			return new WP_Error( 'persona_assistant_history_not_found', __( 'Conversation not found.', 'persona-assistant' ), array( 'status' => 404 ) );
		}

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT id, role, content, created_at FROM ' . self::messages_table() . ' WHERE conversation_id = %d ORDER BY id ASC', // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- trusted table name.
				$conversation['id']
			),
			ARRAY_A
		);
		$messages = array();
		foreach ( is_array( $rows ) ? $rows : array() as $row ) {
			$messages[] = array(
				'id'        => 'wp-history-' . absint( $row['id'] ),
				'role'      => 'assistant' === $row['role'] ? 'assistant' : 'user',
				'content'   => (string) $row['content'],
				'createdAt' => mysql_to_rfc3339( $row['created_at'] ),
			);
		}

		$last = end( $messages );
		return rest_ensure_response(
			array(
				'id'           => (string) $conversation['public_id'],
				'title'        => '' !== (string) $conversation['title'] ? (string) $conversation['title'] : __( 'New conversation', 'persona-assistant' ),
				'preview'      => $last ? self::preview_excerpt( $last['content'] ) : null,
				'messageCount' => count( $messages ),
				'createdAt'    => mysql_to_rfc3339( $conversation['created_at'] ),
				'updatedAt'    => mysql_to_rfc3339( $conversation['updated_at'] ),
				'state'        => array(
					'messages' => $messages,
					'metadata' => array(),
				),
			)
		);
	}

	/** Delete one owned conversation and its messages. */
	public function delete_conversation( $request ) {
		$deleted = $this->delete_owned_conversation( (string) $request['id'] );
		if ( ! $deleted ) {
			return new WP_Error( 'persona_assistant_history_not_found', __( 'Conversation not found.', 'persona-assistant' ), array( 'status' => 404 ) );
		}
		return new WP_REST_Response( null, 204 );
	}

	/** Delete all current-user conversations. */
	public function delete_all_conversations() {
		$count = $this->delete_user_history( get_current_user_id() );
		return rest_ensure_response( array( 'deleted' => $count ) );
	}

	/** Confirm a conversation belongs to the current visitor. */
	public function validate_for_chat( $public_id ) {
		if ( ! self::account_history_available() || ! $this->get_owned_conversation( $public_id ) ) {
			return new WP_Error( 'persona_assistant_history_not_found', __( 'Conversation not found.', 'persona-assistant' ), array( 'status' => 404 ) );
		}
		return true;
	}

	/**
	 * Replace a conversation's transcript after a successful WordPress AI turn.
	 *
	 * Only user/assistant text is retained. Attachments, inline data, reasoning,
	 * tool calls, tool results, artifacts, and execution metadata are omitted.
	 */
	public function store_turn( $public_id, array $messages, $reply ) {
		global $wpdb;
		$conversation = $this->get_owned_conversation( $public_id );
		if ( ! $conversation ) {
			return false;
		}

		$safe = array();
		foreach ( array_slice( $messages, -40 ) as $message ) {
			$text = array();
			foreach ( isset( $message['parts'] ) ? (array) $message['parts'] : array() as $part ) {
				if ( is_array( $part ) && 'text' === ( isset( $part['type'] ) ? $part['type'] : '' ) && isset( $part['text'] ) ) {
					$text[] = (string) $part['text'];
				}
			}
			$text = trim( implode( "\n", $text ) );
			if ( '' !== $text ) {
				$safe[] = array(
					'role'    => 'assistant' === $message['role'] ? 'assistant' : 'user',
					'content' => $text,
				);
			}
		}

		$reply_text = is_array( $reply ) && isset( $reply['text'] ) ? (string) $reply['text'] : (string) $reply;
		if ( '' !== trim( $reply_text ) ) {
			$safe[] = array( 'role' => 'assistant', 'content' => trim( $reply_text ) );
		}

		$wpdb->query( 'START TRANSACTION' ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
		$deleted = $wpdb->delete( self::messages_table(), array( 'conversation_id' => (int) $conversation['id'] ), array( '%d' ) );
		$ok      = false !== $deleted;
		$now     = current_time( 'mysql', true );
		foreach ( $safe as $message ) {
			if ( false === $wpdb->insert(
				self::messages_table(),
				array(
					'conversation_id' => (int) $conversation['id'],
					'role'            => $message['role'],
					'content'         => $message['content'],
					'created_at'      => $now,
				),
				array( '%d', '%s', '%s', '%s' )
			) ) {
				$ok = false;
				break;
			}
		}

		$title = (string) $conversation['title'];
		if ( '' === $title ) {
			foreach ( $safe as $message ) {
				if ( 'user' === $message['role'] ) {
					$title = wp_html_excerpt( wp_strip_all_tags( $message['content'] ), 60, '…' );
					break;
				}
			}
		}
		if ( $ok ) {
			$ok = false !== $wpdb->update(
				self::conversations_table(),
				array(
					'title'      => $title,
					'updated_at' => $now,
					'expires_at' => $this->expiry_mysql(),
				),
				array( 'id' => (int) $conversation['id'] ),
				array( '%s', '%s', '%s' ),
				array( '%d' )
			);
		}

		$wpdb->query( $ok ? 'COMMIT' : 'ROLLBACK' ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared -- fixed transaction statement.
		return $ok;
	}

	/** Daily retention cleanup. */
	public function delete_expired() {
		global $wpdb;
		$ids = $wpdb->get_col(
			$wpdb->prepare(
				'SELECT id FROM ' . self::conversations_table() . ' WHERE expires_at IS NOT NULL AND expires_at <= %s LIMIT 500', // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- trusted table name.
				current_time( 'mysql', true )
			)
		);
		if ( empty( $ids ) ) {
			return;
		}
		$ids          = array_map( 'absint', $ids );
		$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
		$wpdb->query( $wpdb->prepare( 'DELETE FROM ' . self::messages_table() . " WHERE conversation_id IN ({$placeholders})", $ids ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare -- $placeholders is a generated list of %d, and the table name is trusted.
		$wpdb->query( $wpdb->prepare( 'DELETE FROM ' . self::conversations_table() . " WHERE id IN ({$placeholders})", $ids ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare -- $placeholders is a generated list of %d, and the table name is trusted.
	}

	/** Apply a changed retention period to existing account conversations. */
	public function settings_updated( $old_value, $new_value ) {
		global $wpdb;
		$old_days = is_array( $old_value ) && isset( $old_value['history_retention_days'] ) ? absint( $old_value['history_retention_days'] ) : 30;
		$new_days = is_array( $new_value ) && isset( $new_value['history_retention_days'] ) ? absint( $new_value['history_retention_days'] ) : 30;
		if ( $old_days === $new_days ) {
			return;
		}
		if ( 0 === $new_days ) {
			$wpdb->query( 'UPDATE ' . self::conversations_table() . ' SET expires_at = NULL' ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.PreparedSQL.NotPrepared -- trusted table name.
			return;
		}
		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . self::conversations_table() . ' SET expires_at = DATE_ADD(updated_at, INTERVAL %d DAY)', // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- trusted table name.
				$new_days
			)
		);
	}

	/** Add this plugin to Tools > Export Personal Data. */
	public function register_exporter( $exporters ) {
		$exporters['persona-assistant-history'] = array(
			'exporter_friendly_name' => __( 'Persona Assistant conversation history', 'persona-assistant' ),
			'callback'               => array( $this, 'export_personal_data' ),
		);
		return $exporters;
	}

	/** Export account conversations for the user matching an email address. */
	public function export_personal_data( $email_address, $page = 1 ) {
		global $wpdb;
		$user = get_user_by( 'email', $email_address );
		if ( ! $user ) {
			return array( 'data' => array(), 'done' => true );
		}
		$limit  = 20;
		$offset = ( max( 1, absint( $page ) ) - 1 ) * $limit;
		$rows   = $wpdb->get_results(
			$wpdb->prepare(
				'SELECT id, public_id, title, created_at, updated_at, expires_at FROM ' . self::conversations_table() . ' WHERE user_id = %d ORDER BY id ASC LIMIT %d OFFSET %d', // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- trusted table name.
				$user->ID,
				$limit,
				$offset
			),
			ARRAY_A
		);
		$data = array();
		foreach ( is_array( $rows ) ? $rows : array() as $conversation ) {
			$messages = $wpdb->get_results(
				$wpdb->prepare( 'SELECT role, content, created_at FROM ' . self::messages_table() . ' WHERE conversation_id = %d ORDER BY id ASC', $conversation['id'] ), // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- trusted table name.
				ARRAY_A
			);
			$items = array(
				array( 'name' => __( 'Conversation ID', 'persona-assistant' ), 'value' => (string) $conversation['public_id'] ),
				array( 'name' => __( 'Title', 'persona-assistant' ), 'value' => (string) $conversation['title'] ),
				array( 'name' => __( 'Created', 'persona-assistant' ), 'value' => (string) $conversation['created_at'] . ' UTC' ),
				array( 'name' => __( 'Last updated', 'persona-assistant' ), 'value' => (string) $conversation['updated_at'] . ' UTC' ),
			);
			foreach ( is_array( $messages ) ? $messages : array() as $index => $message ) {
				$items[] = array(
					'name'  => sprintf( /* translators: 1: message number, 2: role. */ __( 'Message %1$d (%2$s)', 'persona-assistant' ), $index + 1, $message['role'] ),
					'value' => (string) $message['content'],
				);
			}
			$data[] = array(
				'group_id'    => 'persona-assistant-history',
				'group_label' => __( 'Persona Assistant conversation history', 'persona-assistant' ),
				'item_id'     => 'conversation-' . (string) $conversation['public_id'],
				'data'        => $items,
			);
		}
		return array( 'data' => $data, 'done' => count( $rows ) < $limit );
	}

	/** Add this plugin to Tools > Erase Personal Data. */
	public function register_eraser( $erasers ) {
		$erasers['persona-assistant-history'] = array(
			'eraser_friendly_name' => __( 'Persona Assistant conversation history', 'persona-assistant' ),
			'callback'             => array( $this, 'erase_personal_data' ),
		);
		return $erasers;
	}

	/** Erase account conversations for the user matching an email address. */
	public function erase_personal_data( $email_address ) {
		$user = get_user_by( 'email', $email_address );
		if ( ! $user ) {
			return array( 'items_removed' => false, 'items_retained' => false, 'messages' => array(), 'done' => true );
		}
		$count = $this->delete_user_history( $user->ID );
		return array(
			'items_removed'  => $count > 0,
			'items_retained' => false,
			'messages'       => array(),
			'done'           => true,
		);
	}

	/** Delete all history belonging to one WordPress user. */
	public function delete_user_history( $user_id ) {
		global $wpdb;
		$ids = $wpdb->get_col(
			$wpdb->prepare( 'SELECT id FROM ' . self::conversations_table() . ' WHERE user_id = %d', absint( $user_id ) ) // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- trusted table name.
		);
		if ( ! empty( $ids ) ) {
			$ids          = array_map( 'absint', $ids );
			$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
			$wpdb->query( $wpdb->prepare( 'DELETE FROM ' . self::messages_table() . " WHERE conversation_id IN ({$placeholders})", $ids ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.PreparedSQL.InterpolatedNotPrepared,WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare -- $placeholders is a generated list of %d, and the table name is trusted.
		}
		return (int) $wpdb->delete( self::conversations_table(), array( 'user_id' => absint( $user_id ) ), array( '%d' ) );
	}

	/** Find one conversation owned by the current user. */
	private function get_owned_conversation( $public_id ) {
		global $wpdb;
		if ( ! is_string( $public_id ) || ! preg_match( '/^[a-f0-9-]{36}$/i', $public_id ) ) {
			return null;
		}
		return $wpdb->get_row(
			$wpdb->prepare(
				'SELECT * FROM ' . self::conversations_table() . ' WHERE public_id = %s AND user_id = %d LIMIT 1', // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- trusted table name.
				strtolower( $public_id ),
				get_current_user_id()
			),
			ARRAY_A
		);
	}

	/** Delete one owned conversation. */
	private function delete_owned_conversation( $public_id ) {
		global $wpdb;
		$conversation = $this->get_owned_conversation( $public_id );
		if ( ! $conversation ) {
			return false;
		}
		$wpdb->delete( self::messages_table(), array( 'conversation_id' => (int) $conversation['id'] ), array( '%d' ) );
		return false !== $wpdb->delete( self::conversations_table(), array( 'id' => (int) $conversation['id'] ), array( '%d' ) );
	}

	/** Retention deadline in UTC MySQL format, or null for no automatic expiry. */
	private function expiry_mysql() {
		$days = absint( persona_assistant_get_setting( 'history_retention_days', 30 ) );
		return $days > 0 ? gmdate( 'Y-m-d H:i:s', time() + ( $days * DAY_IN_SECONDS ) ) : null;
	}

	/** @return string */
	public static function conversations_table() {
		global $wpdb;
		return $wpdb->prefix . 'persona_assistant_conversations';
	}

	/** @return string */
	public static function messages_table() {
		global $wpdb;
		return $wpdb->prefix . 'persona_assistant_messages';
	}
}
