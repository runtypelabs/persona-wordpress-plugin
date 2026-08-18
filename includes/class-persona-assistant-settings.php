<?php
/**
 * Admin settings: the credential UI, agent picker, mint reconciliation,
 * reconnect/disconnect actions, and the live status panel.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Settings controller.
 */
class Persona_Assistant_Settings {

	const PAGE_SLUG    = 'persona-assistant';
	const OPTION_GROUP = 'persona_assistant_settings_group';
	const SETUP_OPTION = 'persona_assistant_setup';

	/** Transient holding the in-flight PKCE verifier + state (10 min TTL). */
	const PKCE_TRANSIENT = 'persona_assistant_oauth_pkce';

	/** @var bool Prevent connection reconciliation during an intentional disconnect update. */
	private $suppress_reconcile = false;

	/**
	 * Register hooks.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
		add_action( 'admin_init', array( $this, 'register' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin' ) );

		add_action( 'add_option_' . PERSONA_ASSISTANT_SETTINGS_OPTION, array( $this, 'on_settings_saved' ) );
		add_action( 'update_option_' . PERSONA_ASSISTANT_SETTINGS_OPTION, array( $this, 'on_settings_saved' ) );

		add_action( 'wp_ajax_persona_assistant_list_targets', array( $this, 'ajax_list_targets' ) );
		add_action( 'wp_ajax_persona_assistant_preview_config', array( $this, 'ajax_preview_config' ) );
		add_action( 'admin_post_persona_assistant_remint', array( $this, 'handle_remint' ) );
		add_action( 'admin_post_persona_assistant_setup', array( $this, 'handle_setup_action' ) );

		// "Login with Runtype" (Authorization Code + PKCE, site-verified).
		add_action( 'admin_post_persona_assistant_oauth_connect', array( $this, 'handle_oauth_connect' ) );
		add_action( 'admin_post_persona_assistant_oauth_disconnect', array( $this, 'handle_oauth_disconnect' ) );
		add_action( 'load-settings_page_' . self::PAGE_SLUG, array( $this, 'maybe_handle_oauth_callback' ) );

		add_action( 'admin_notices', array( $this, 'admin_notice' ) );
	}

	/**
	 * Add the settings page under Settings.
	 *
	 * @return void
	 */
	public function add_menu() {
		add_options_page(
			__( 'Persona Assistant', 'persona-assistant' ),
			__( 'Persona Assistant', 'persona-assistant' ),
			'manage_options',
			self::PAGE_SLUG,
			array( $this, 'render_page' )
		);
	}

	/**
	 * Whether the one-time setup checklist has been completed or skipped.
	 *
	 * Sites that already saved settings before this onboarding flow existed are
	 * migrated to complete so an update never forces established installations
	 * back through first-run setup.
	 *
	 * @return bool
	 */
	private function setup_complete() {
		$state = get_option( self::SETUP_OPTION, null );
		if ( is_array( $state ) && array_key_exists( 'completed', $state ) ) {
			return (bool) $state['completed'];
		}

		$existing = get_option( PERSONA_ASSISTANT_SETTINGS_OPTION, null );
		if ( is_array( $existing ) ) {
			update_option(
				self::SETUP_OPTION,
				array(
					'completed'    => true,
					'completed_at' => time(),
					'migrated'     => true,
				),
				false
			);
			return true;
		}

		return false;
	}

	/**
	 * Current focused admin view.
	 *
	 * @return string
	 */
	private function current_view() {
		$allowed = array( 'setup', 'overview', 'connection', 'brand', 'launcher', 'assistant', 'advanced' );
		$view    = isset( $_GET['view'] ) ? sanitize_key( wp_unslash( $_GET['view'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( in_array( $view, $allowed, true ) ) {
			return $view;
		}
		return $this->setup_complete() ? 'overview' : 'setup';
	}

	/**
	 * Build a URL to a focused Persona Assistant admin view.
	 *
	 * @param string              $view View name.
	 * @param array<string,mixed> $args Additional query args.
	 * @return string
	 */
	private function view_url( $view, $args = array() ) {
		return add_query_arg(
			array_merge(
				array(
					'page' => self::PAGE_SLUG,
					'view' => $view,
				),
				$args
			),
			admin_url( 'options-general.php' )
		);
	}

	/**
	 * Register the single settings option.
	 *
	 * @return void
	 */
	public function register() {
		register_setting(
			self::OPTION_GROUP,
			PERSONA_ASSISTANT_SETTINGS_OPTION,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( $this, 'sanitize' ),
				'default'           => persona_assistant_default_settings(),
			)
		);
	}

	/**
	 * Enqueue admin assets on our page only.
	 *
	 * @param string $hook Current admin page hook suffix.
	 * @return void
	 */
	public function enqueue_admin( $hook ) {
		if ( 'settings_page_' . self::PAGE_SLUG !== $hook ) {
			return;
		}

		wp_enqueue_style(
			'persona-assistant-admin',
			PERSONA_ASSISTANT_URL . 'assets/css/admin.css',
			array(),
			persona_assistant_asset_version( 'assets/css/admin.css' )
		);

		// The chat-icon field offers a "Choose image" button backed by the WP
		// media library (wp.media frame in admin.js).
		wp_enqueue_media();

		// Generated copy of the widget's built-in lucide icon registry, used by
		// the "Choose icon" modal (see assets/js/admin-icons.js header).
		wp_enqueue_script(
			'persona-assistant-admin-icons',
			PERSONA_ASSISTANT_URL . 'assets/js/admin-icons.js',
			array(),
			persona_assistant_asset_version( 'assets/js/admin-icons.js' ),
			true
		);

		wp_enqueue_script(
			'persona-assistant-layouts',
			PERSONA_ASSISTANT_URL . 'assets/js/persona-layouts.js',
			array(),
			persona_assistant_asset_version( 'assets/js/persona-layouts.js' ),
			true
		);

		wp_enqueue_script(
			'persona-assistant-admin',
			PERSONA_ASSISTANT_URL . 'assets/js/admin.js',
			array( 'persona-assistant-admin-icons', 'persona-assistant-layouts' ),
			persona_assistant_asset_version( 'assets/js/admin.js' ),
			true
		);
		$settings = persona_assistant_get_settings();
		$mode     = persona_assistant_resolve_mode();
		$view     = $this->current_view();
		$has_preview = in_array( $view, array( 'brand', 'launcher', 'assistant' ), true );
		$surface  = 'assistant' === $view ? 'assistant' : 'chat';
		$preview  = array(
			'ready'       => false,
			'surface'     => $surface,
			'canChat'     => 'disabled' !== $mode,
			'stubReply'   => __( 'This is an appearance preview. Connect an AI to enable live responses.', 'persona-assistant' ),
			'appearance'  => persona_assistant_page_appearance( $settings ),
			'formDefaults' => array(
				'color'              => (string) $settings['theme_color'],
				'mode'               => (string) $settings['theme_mode'],
				'corner'             => (string) $settings['corner_style'],
				'position'           => (string) $settings['launcher_position'],
				'icon'               => (string) $settings['chat_icon'],
				'teaserText'         => (string) $settings['launcher_teaser_text'],
				'teaserDelay'        => absint( $settings['launcher_teaser_delay'] ),
				'teaserFrequency'    => (string) $settings['launcher_teaser_frequency'],
				'teaserDismissible'  => (bool) $settings['launcher_teaser_dismissible'],
				'launcherAttachments' => (bool) $settings['launcher_attachments'],
				'headerTitle'        => (string) $settings['header_title'],
				'headerSubtitle'     => (string) $settings['header_subtitle'],
				'title'              => (string) $settings['welcome_title'],
				'welcomeSubtitle'    => (string) $settings['welcome_subtitle'],
				'welcomeVariant'     => (string) $settings['welcome_variant'],
				'welcomeDismiss'     => (string) $settings['welcome_dismiss'],
				'welcomeMessage'     => (string) $settings['welcome_message'],
				'welcomeShowIcon'    => (bool) $settings['welcome_show_icon'],
				'placeholder'        => (string) $settings['input_placeholder'],
				'prompts'            => (string) $settings['suggested_prompts'],
				'suggestionVariant'  => (string) $settings['suggestion_variant'],
				'suggestionPlacement' => (string) $settings['suggestion_placement'],
				'suggestionBehavior' => (string) $settings['suggestion_behavior'],
				'suggestionOverflow' => (string) $settings['suggestion_overflow'],
				'suggestionMaxItems' => absint( $settings['suggestion_max_items'] ),
				'scrollbarPolicy'    => (string) $settings['scrollbar_policy'],
				'showActivity'       => (bool) $settings['show_ai_activity'],
				'assistantPreset'    => persona_assistant_normalize_assistant_preset( (string) $settings['assistant_style_preset'] ),
				'assistantWidth'     => (string) $settings['assistant_content_width'],
				'assistantHeader'    => (string) $settings['assistant_header_style'],
				'assistantMessages'  => (string) $settings['assistant_message_style'],
				'assistantComposer'  => (string) $settings['assistant_composer_style'],
				'assistantWelcome'   => (bool) $settings['assistant_show_welcome'],
				'assistantWelcomeVariant' => (string) $settings['assistant_welcome_variant'],
				'assistantWelcomeDismiss' => (string) $settings['assistant_welcome_dismiss'],
				'assistantSuggestionVariant' => (string) $settings['assistant_suggestion_variant'],
				'assistantSuggestionPlacement' => (string) $settings['assistant_suggestion_placement'],
				'assistantSuggestionBehavior' => (string) $settings['assistant_suggestion_behavior'],
				'assistantSuggestionOverflow' => (string) $settings['assistant_suggestion_overflow'],
				'assistantSuggestionMaxItems' => absint( $settings['assistant_suggestion_max_items'] ),
				'assistantAvatars'   => (bool) $settings['assistant_show_avatars'],
				'assistantTimestamps' => (bool) $settings['assistant_show_timestamps'],
				'assistantClear'     => (bool) $settings['assistant_show_clear_chat'],
				'assistantAttachments' => (bool) $settings['assistant_attachments'],
				'assistantVoice'     => (bool) $settings['assistant_voice'],
				'assistantDisclaimer' => (string) $settings['assistant_disclaimer'],
			),
		);

		if ( $has_preview && 'assistant' === $surface ) {
			$preview['ready']  = true;
			$preview['iframeUrl'] = $this->fullscreen_preview_url();
		} elseif ( $has_preview ) {
			$preview['config'] = array(
				'target'       => '#persona-assistant-preview-root',
				'version'      => 0 === strpos( PERSONA_ASSISTANT_INSTALL_URL, PERSONA_ASSISTANT_URL ) ? '' : persona_assistant_installer_version(),
				'useShadowDom' => true,
				'config'       => persona_assistant_widget_config( 'preview' ),
			);
			$preview['ready'] = true;
			if ( 'runtype' === $mode ) {
				$preview['config']['clientToken'] = persona_assistant_effective_client_token();
				$preview['config']['apiUrl']      = esc_url_raw( persona_assistant_get_api_base() );
				if ( '' !== persona_assistant_effective_agent_id() ) {
					$preview['config']['agentId'] = persona_assistant_effective_agent_id();
				}
			} elseif ( 'wordpress_ai' === $mode ) {
				$preview['config']['apiUrl'] = esc_url_raw( rest_url( Persona_Assistant_REST::NAMESPACE . Persona_Assistant_REST::ROUTE ) );
			} else {
				$preview['config']['apiUrl'] = esc_url_raw( persona_assistant_get_api_base() );
			}
		}

		// Auto-load agents when a mint credential (API key or OAuth token) exists.
		$can_list_agents = ! is_wp_error( Persona_Assistant_Credential::resolve_mint_credential() );

		wp_localize_script(
			'persona-assistant-admin',
			'PersonaAssistantAdmin',
			array(
				'ajaxUrl'       => admin_url( 'admin-ajax.php' ),
				'nonce'         => wp_create_nonce( 'persona_assistant_admin' ),
				'preview'       => $preview,
				'canListAgents' => $can_list_agents,
				// Fallback icon when the chat-icon field is blank: the Site Icon,
				// matching persona_assistant_widget_config()'s server-side fallback.
				'siteIconUrl'   => (string) get_site_icon_url(),
				'mediaTitle'    => __( 'Choose a chat icon', 'persona-assistant' ),
				'mediaButton'   => __( 'Use this image', 'persona-assistant' ),
				'strings' => array(
					'loading'   => __( 'Loading…', 'persona-assistant' ),
					'refresh'   => __( 'Refresh', 'persona-assistant' ),
					'noResults' => __( 'No agents were returned.', 'persona-assistant' ),
					'copied'    => __( 'Copied', 'persona-assistant' ),
					'error'     => __( 'Could not reach Runtype. Check the connection and try again.', 'persona-assistant' ),
					'choose'    => __( '— Select —', 'persona-assistant' ),
					'loaded'    => __( 'Agents loaded. Choose one below, then save.', 'persona-assistant' ),
					'clearChat' => __( 'Clear chat', 'persona-assistant' ),
					'dismissMessage' => __( 'Dismiss message', 'persona-assistant' ),
					'iconModalTitle'   => __( 'Choose a chat icon', 'persona-assistant' ),
					'iconSearch'       => __( 'Search icons…', 'persona-assistant' ),
					'iconNoMatches'    => __( 'No icons match your search.', 'persona-assistant' ),
					'iconModalClose'   => __( 'Close', 'persona-assistant' ),
					'iconTabIcons'     => __( 'Icons', 'persona-assistant' ),
					'iconTabImage'     => __( 'Media Library', 'persona-assistant' ),
					'iconTabText'      => __( 'Emoji or URL', 'persona-assistant' ),
					'iconImageHelp'    => __( 'Use any image from your Media Library.', 'persona-assistant' ),
					'iconBrowseMedia'  => __( 'Browse Media Library…', 'persona-assistant' ),
					'iconTextHelp'     => __( 'An emoji or short text, or the URL of an image.', 'persona-assistant' ),
					'iconApply'        => __( 'Apply', 'persona-assistant' ),
					/* translators: %s: built-in icon name. */
					'iconBuiltIn'      => __( '%s (built-in icon)', 'persona-assistant' ),
					'iconCustomImage'  => __( 'Custom image', 'persona-assistant' ),
					'iconEmojiText'    => __( 'Emoji or text', 'persona-assistant' ),
					'iconSiteDefault'  => __( 'Site Icon (default)', 'persona-assistant' ),
					'iconWidgetDefault' => __( 'Widget default', 'persona-assistant' ),
					// Mirror the widget's built-in defaults (defaults.ts) so the
					// static preview and blank-field copy match what really renders.
					'defaultTitle'           => __( 'Hello 👋', 'persona-assistant' ),
					'defaultWelcomeSubtitle' => __( 'Ask anything about your account or products.', 'persona-assistant' ),
					'defaultPlaceholder'     => __( 'How can I help...', 'persona-assistant' ),
					'defaultLauncherSubtitle' => __( 'Here to help you get answers fast', 'persona-assistant' ),
					'siteName'               => (string) get_bloginfo( 'name' ),
					/* translators: %s: contrast ratio. */
					'goodContrast'       => __( 'Good contrast with white text (%s:1).', 'persona-assistant' ),
					/* translators: %s: contrast ratio. */
					'lowContrast'        => __( 'Low contrast with white text (%s:1). Choose a darker accent.', 'persona-assistant' ),
				),
			)
		);

		if ( $has_preview && 'assistant' !== $surface ) {
			wp_enqueue_script(
				'persona-assistant-admin-preview',
				PERSONA_ASSISTANT_INSTALL_URL,
				array( 'persona-assistant-admin' ),
				PERSONA_ASSISTANT_PERSONA_VERSION,
				true
			);
		}
	}

	/**
	 * Authenticated front-end URL used by the full-screen iframe preview.
	 *
	 * @return string
	 */
	private function fullscreen_preview_url() {
		$url = add_query_arg( 'persona_assistant_preview', '1', home_url( '/' ) );
		return wp_nonce_url( $url, 'persona_assistant_fullscreen_preview' );
	}

	/**
	 * Compose a full-screen config from unsaved Assistant workspace values.
	 *
	 * Sanitizing through the same settings callback and composing through
	 * persona_assistant_widget_config() prevents the browser preview from becoming a
	 * second implementation of the public assistant Page.
	 *
	 * @return void
	 */
	public function ajax_preview_config() {
		check_ajax_referer( 'persona_assistant_preview_config', 'nonce' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Permission denied.', 'persona-assistant' ) ), 403 );
		}

		$raw   = isset( $_POST['settings'] ) ? sanitize_textarea_field( wp_unslash( $_POST['settings'] ) ) : '';
		$input = json_decode( (string) $raw, true );
		if ( ! is_array( $input ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid preview settings.', 'persona-assistant' ) ), 400 );
		}

		$input['_persona_assistant_scope'] = 'assistant';
		$settings                     = $this->sanitize( $input );
		$config                       = persona_assistant_widget_config( 'fullscreen', $settings, true );
		$config['autoFocusInput']     = false;

		wp_send_json_success(
			array(
				'config'     => $config,
				'appearance' => persona_assistant_page_appearance( $settings ),
			)
		);
	}

	/**
	 * Sanitize submitted settings. Pure: minting happens later in reconcile.
	 *
	 * @param mixed $input Raw submitted array.
	 * @return array<string,mixed>
	 */
	public function sanitize( $input ) {
		$existing = persona_assistant_get_settings();
		$defaults = persona_assistant_default_settings();
		$out      = $existing;

		if ( ! is_array( $input ) ) {
			$input = array();
		}
		$scope = isset( $input['_persona_assistant_scope'] ) ? sanitize_key( (string) $input['_persona_assistant_scope'] ) : 'all';
		if ( ! in_array( $scope, array( 'all', 'connection', 'brand', 'launcher', 'assistant', 'advanced' ), true ) ) {
			$scope = 'all';
		}

		if ( in_array( $scope, array( 'all', 'connection' ), true ) ) {
			$out['power_source'] = $this->whitelist(
				isset( $input['power_source'] ) ? $input['power_source'] : (string) $existing['power_source'],
				array( 'auto', 'runtype', 'wordpress_ai' ),
				$defaults['power_source']
			);
			$out['client_token'] = isset( $input['client_token'] ) ? sanitize_text_field( trim( (string) $input['client_token'] ) ) : $existing['client_token'];
			$out['agent_id'] = isset( $input['agent_id'] ) ? sanitize_text_field( trim( (string) $input['agent_id'] ) ) : (string) $existing['agent_id'];
			$out['wp_ai_system_prompt'] = isset( $input['wp_ai_system_prompt'] ) ? sanitize_textarea_field( (string) $input['wp_ai_system_prompt'] ) : (string) $existing['wp_ai_system_prompt'];
			$out['wp_ai_model'] = isset( $input['wp_ai_model'] ) ? sanitize_text_field( (string) $input['wp_ai_model'] ) : (string) $existing['wp_ai_model'];
			$out['wp_ai_access'] = $this->whitelist(
				isset( $input['wp_ai_access'] ) ? $input['wp_ai_access'] : (string) $existing['wp_ai_access'],
				array( 'public', 'logged_in' ),
				$defaults['wp_ai_access']
			);
		}

		if ( in_array( $scope, array( 'all', 'launcher' ), true ) ) {
			$out['placement_mode'] = $this->whitelist(
				isset( $input['placement_mode'] ) ? $input['placement_mode'] : (string) $existing['placement_mode'],
				array( 'off', 'sitewide', 'manual' ),
				$defaults['placement_mode']
			);
			$out['enabled'] = 'sitewide' === $out['placement_mode'];
			$out['launcher_position'] = $this->whitelist(
				isset( $input['launcher_position'] ) ? $input['launcher_position'] : (string) $existing['launcher_position'],
				array( 'bottom-right', 'bottom-left' ),
				$defaults['launcher_position']
			);
			$out['chat_icon'] = isset( $input['chat_icon'] ) ? sanitize_text_field( trim( (string) $input['chat_icon'] ) ) : (string) $existing['chat_icon'];
			$out['launcher_teaser_text'] = isset( $input['launcher_teaser_text'] )
				? sanitize_text_field( (string) $input['launcher_teaser_text'] )
				: (string) $existing['launcher_teaser_text'];
			$out['launcher_teaser_delay'] = isset( $input['launcher_teaser_delay'] )
				? max( 0, min( 60, absint( $input['launcher_teaser_delay'] ) ) )
				: absint( $existing['launcher_teaser_delay'] );
			$out['launcher_teaser_frequency'] = $this->whitelist(
				isset( $input['launcher_teaser_frequency'] ) ? $input['launcher_teaser_frequency'] : (string) $existing['launcher_teaser_frequency'],
				array( 'once', 'always' ),
				$defaults['launcher_teaser_frequency']
			);
			$out['launcher_teaser_dismissible'] = ! empty( $input['launcher_teaser_dismissible'] );
			$out['launcher_attachments'] = ! empty( $input['launcher_attachments'] );
		}

		if ( in_array( $scope, array( 'all', 'assistant' ), true ) ) {
			$page_id = isset( $input['assistant_page_id'] ) ? absint( $input['assistant_page_id'] ) : absint( $existing['assistant_page_id'] );
			if ( $page_id > 0 ) {
				$page = get_post( $page_id );
				if ( ! ( $page instanceof WP_Post ) || 'page' !== $page->post_type || 'trash' === $page->post_status ) {
					add_settings_error(
						PERSONA_ASSISTANT_SETTINGS_OPTION,
						'persona_assistant_invalid_assistant_page',
						__( 'Choose an existing WordPress Page for the full-screen assistant.', 'persona-assistant' ),
						'error'
					);
					$page_id = 0;
				}
			}
			$out['assistant_page_id'] = $page_id;
			// Legacy 'classic'/'minimal' inputs (old saved values round-tripping
			// through the form) normalize to the two canonical presets.
			$out['assistant_style_preset'] = persona_assistant_normalize_assistant_preset(
				(string) ( isset( $input['assistant_style_preset'] ) ? $input['assistant_style_preset'] : $existing['assistant_style_preset'] )
			);
			$out['assistant_content_width'] = $this->whitelist(
				isset( $input['assistant_content_width'] ) ? $input['assistant_content_width'] : (string) $existing['assistant_content_width'],
				array( 'narrow', 'standard', 'wide' ),
				$defaults['assistant_content_width']
			);
			$out['assistant_header_style'] = $this->whitelist(
				isset( $input['assistant_header_style'] ) ? $input['assistant_header_style'] : (string) $existing['assistant_header_style'],
				array( 'branded', 'minimal', 'hidden' ),
				$defaults['assistant_header_style']
			);
			$out['assistant_message_style'] = $this->whitelist(
				isset( $input['assistant_message_style'] ) ? $input['assistant_message_style'] : (string) $existing['assistant_message_style'],
				array( 'bubble', 'flat', 'minimal' ),
				$defaults['assistant_message_style']
			);
			$out['assistant_composer_style'] = $this->whitelist(
				isset( $input['assistant_composer_style'] ) ? $input['assistant_composer_style'] : (string) $existing['assistant_composer_style'],
				array( 'default', 'pill' ),
				$defaults['assistant_composer_style']
			);
			foreach ( array( 'welcome_title', 'welcome_subtitle', 'welcome_message', 'input_placeholder' ) as $key ) {
				$out[ $key ] = isset( $input[ $key ] ) ? sanitize_text_field( (string) $input[ $key ] ) : (string) $existing[ $key ];
			}
			$out['chat_icon']         = isset( $input['chat_icon'] ) ? sanitize_text_field( trim( (string) $input['chat_icon'] ) ) : (string) $existing['chat_icon'];
			$out['welcome_show_icon'] = ! empty( $input['welcome_show_icon'] );
			$out['suggested_prompts'] = isset( $input['suggested_prompts'] )
				? sanitize_textarea_field( (string) $input['suggested_prompts'] )
				: (string) $existing['suggested_prompts'];
			$out['assistant_welcome_variant'] = $this->whitelist(
				isset( $input['assistant_welcome_variant'] ) ? $input['assistant_welcome_variant'] : (string) $existing['assistant_welcome_variant'],
				array( 'inherit', 'card', 'hero', 'none' ),
				$defaults['assistant_welcome_variant']
			);
			$out['assistant_welcome_dismiss'] = $this->whitelist(
				isset( $input['assistant_welcome_dismiss'] ) ? $input['assistant_welcome_dismiss'] : (string) $existing['assistant_welcome_dismiss'],
				array( 'inherit', 'never', 'on-first-message' ),
				$defaults['assistant_welcome_dismiss']
			);
			$out['assistant_suggestion_variant'] = $this->whitelist(
				isset( $input['assistant_suggestion_variant'] ) ? $input['assistant_suggestion_variant'] : (string) $existing['assistant_suggestion_variant'],
				array( 'inherit', 'card', 'chip', 'list' ),
				$defaults['assistant_suggestion_variant']
			);
			$out['assistant_suggestion_placement'] = $this->whitelist(
				isset( $input['assistant_suggestion_placement'] ) ? $input['assistant_suggestion_placement'] : (string) $existing['assistant_suggestion_placement'],
				array( 'inherit', 'auto', 'welcome', 'composer' ),
				$defaults['assistant_suggestion_placement']
			);
			$out['assistant_suggestion_behavior'] = $this->whitelist(
				isset( $input['assistant_suggestion_behavior'] ) ? $input['assistant_suggestion_behavior'] : (string) $existing['assistant_suggestion_behavior'],
				array( 'inherit', 'send', 'fill' ),
				$defaults['assistant_suggestion_behavior']
			);
			$out['assistant_suggestion_overflow'] = $this->whitelist(
				isset( $input['assistant_suggestion_overflow'] ) ? $input['assistant_suggestion_overflow'] : (string) $existing['assistant_suggestion_overflow'],
				array( 'inherit', 'wrap', 'scroll' ),
				$defaults['assistant_suggestion_overflow']
			);
			$out['assistant_suggestion_max_items'] = isset( $input['assistant_suggestion_max_items'] )
				? max( 0, min( 8, absint( $input['assistant_suggestion_max_items'] ) ) )
				: absint( $existing['assistant_suggestion_max_items'] );
			$out['assistant_show_welcome']    = ! empty( $input['assistant_show_welcome'] );
			$out['assistant_show_avatars']    = ! empty( $input['assistant_show_avatars'] );
			$out['assistant_show_timestamps'] = ! empty( $input['assistant_show_timestamps'] );
			$out['assistant_show_clear_chat'] = ! empty( $input['assistant_show_clear_chat'] );
			$out['assistant_attachments']     = ! empty( $input['assistant_attachments'] );
			$out['assistant_voice']           = ! empty( $input['assistant_voice'] );
			$out['assistant_disclaimer']      = isset( $input['assistant_disclaimer'] )
				? sanitize_text_field( (string) $input['assistant_disclaimer'] )
				: (string) $existing['assistant_disclaimer'];
		}

		if ( in_array( $scope, array( 'all', 'brand' ), true ) ) {
			$color = isset( $input['theme_color'] ) ? sanitize_hex_color( (string) $input['theme_color'] ) : '';
			$out['theme_color'] = $color ? $color : (string) $existing['theme_color'];
			$out['theme_mode'] = $this->whitelist(
				isset( $input['theme_mode'] ) ? $input['theme_mode'] : (string) $existing['theme_mode'],
				array( 'light', 'dark', 'auto' ),
				$defaults['theme_mode']
			);
			$out['corner_style'] = $this->whitelist(
				isset( $input['corner_style'] ) ? $input['corner_style'] : (string) $existing['corner_style'],
				array( 'rounded', 'soft', 'square' ),
				$defaults['corner_style']
			);
			foreach ( array( 'header_title', 'header_subtitle', 'welcome_title', 'welcome_subtitle', 'welcome_message', 'input_placeholder' ) as $key ) {
				$out[ $key ] = isset( $input[ $key ] ) ? sanitize_text_field( (string) $input[ $key ] ) : (string) $existing[ $key ];
			}
			$out['welcome_variant'] = $this->whitelist(
				isset( $input['welcome_variant'] ) ? $input['welcome_variant'] : (string) $existing['welcome_variant'],
				array( 'card', 'hero', 'none' ),
				$defaults['welcome_variant']
			);
			$out['welcome_dismiss'] = $this->whitelist(
				isset( $input['welcome_dismiss'] ) ? $input['welcome_dismiss'] : (string) $existing['welcome_dismiss'],
				array( 'never', 'on-first-message' ),
				$defaults['welcome_dismiss']
			);
			$out['welcome_show_icon'] = ! empty( $input['welcome_show_icon'] );
			$out['suggested_prompts'] = isset( $input['suggested_prompts'] )
				? sanitize_textarea_field( (string) $input['suggested_prompts'] )
				: (string) $existing['suggested_prompts'];
			$out['suggestion_variant'] = $this->whitelist(
				isset( $input['suggestion_variant'] ) ? $input['suggestion_variant'] : (string) $existing['suggestion_variant'],
				array( 'card', 'chip', 'list' ),
				$defaults['suggestion_variant']
			);
			$out['suggestion_placement'] = $this->whitelist(
				isset( $input['suggestion_placement'] ) ? $input['suggestion_placement'] : (string) $existing['suggestion_placement'],
				array( 'auto', 'welcome', 'composer' ),
				$defaults['suggestion_placement']
			);
			$out['suggestion_behavior'] = $this->whitelist(
				isset( $input['suggestion_behavior'] ) ? $input['suggestion_behavior'] : (string) $existing['suggestion_behavior'],
				array( 'send', 'fill' ),
				$defaults['suggestion_behavior']
			);
			$out['suggestion_overflow'] = $this->whitelist(
				isset( $input['suggestion_overflow'] ) ? $input['suggestion_overflow'] : (string) $existing['suggestion_overflow'],
				array( 'wrap', 'scroll' ),
				$defaults['suggestion_overflow']
			);
			$out['suggestion_max_items'] = isset( $input['suggestion_max_items'] )
				? max( 1, min( 8, absint( $input['suggestion_max_items'] ) ) )
				: absint( $existing['suggestion_max_items'] );
			$out['scrollbar_policy'] = $this->whitelist(
				isset( $input['scrollbar_policy'] ) ? $input['scrollbar_policy'] : (string) $existing['scrollbar_policy'],
				array( 'on-scroll', 'auto', 'hidden' ),
				$defaults['scrollbar_policy']
			);
		}

		if ( in_array( $scope, array( 'all', 'advanced' ), true ) ) {
			$out['show_ai_activity'] = ! empty( $input['show_ai_activity'] );
			$out['history_browser_mode'] = $this->whitelist(
				isset( $input['history_browser_mode'] ) ? $input['history_browser_mode'] : (string) $existing['history_browser_mode'],
				array( 'off', 'session', 'device' ),
				$defaults['history_browser_mode']
			);
			$out['wp_ai_account_history'] = ! empty( $input['wp_ai_account_history'] );
			$out['history_retention_days'] = $this->whitelist(
				isset( $input['history_retention_days'] ) ? (string) $input['history_retention_days'] : (string) $existing['history_retention_days'],
				array( '0', '7', '30', '90', '365' ),
				(string) $defaults['history_retention_days']
			);
			$out['followup_suggestions'] = ! empty( $input['followup_suggestions'] );
			$out['webmcp_enabled']   = ! empty( $input['webmcp_enabled'] );
			$out['webmcp_abilities'] = ! empty( $input['webmcp_abilities'] );
			$out['attachment_images'] = ! empty( $input['attachment_images'] );
			$out['attachment_documents'] = ! empty( $input['attachment_documents'] );
			$out['attachment_max_files'] = isset( $input['attachment_max_files'] ) ? min( 4, max( 1, absint( $input['attachment_max_files'] ) ) ) : absint( $existing['attachment_max_files'] );
			$out['attachment_max_size_mb'] = isset( $input['attachment_max_size_mb'] ) ? min( 10, max( 1, absint( $input['attachment_max_size_mb'] ) ) ) : absint( $existing['attachment_max_size_mb'] );
			$out['wp_ai_tools_enabled'] = ! empty( $input['wp_ai_tools_enabled'] );
			$ability_input = isset( $input['wp_ai_abilities'] ) && is_array( $input['wp_ai_abilities'] ) ? array_map( 'sanitize_text_field', $input['wp_ai_abilities'] ) : array();
			$out['wp_ai_abilities'] = array_values( array_intersect( $ability_input, array_keys( persona_assistant_readonly_abilities() ) ) );
		}

		return $out;
	}

	/**
	 * After-save hook: reconcile the Runtype connection (mint/re-mint as needed).
	 *
	 * @return void
	 */
	public function on_settings_saved() {
		if ( $this->suppress_reconcile ) {
			return;
		}
		$this->reconcile_runtype();
	}

	/**
	 * Mint or re-mint a client token when the minting inputs changed.
	 *
	 * @return void
	 */
	public function reconcile_runtype() {
		$settings = persona_assistant_get_settings();
		if ( 'wordpress_ai' === $settings['power_source'] ) {
			return;
		}

		$source = Persona_Assistant_Credential::source();

		// Pasted-token source mints nothing.
		if ( Persona_Assistant_Credential::SOURCE_CLIENT_TOKEN === $source ) {
			if ( 'runtype' === $settings['power_source'] && '' === persona_assistant_effective_client_token() ) {
				$this->add_notice( 'persona_assistant_client_token', __( 'Enter a Runtype client token to finish connecting.', 'persona-assistant' ), 'warning' );
			}
			return;
		}
		if ( ! Persona_Assistant_Credential::source_mints() ) {
			return;
		}

		// In automatic mode, an untouched Runtype setup is an optional fallback,
		// not an error that should interrupt saving WordPress AI settings.
		if ( 'auto' === $settings['power_source'] && '' === persona_assistant_get_api_key() ) {
			return;
		}

		$credential = Persona_Assistant_Credential::resolve_mint_credential();
		if ( is_wp_error( $credential ) ) {
			$this->add_notice( 'persona_assistant_cred', $credential->get_error_message(), 'error' );
			return;
		}

		$agent = persona_assistant_effective_agent_id();
		if ( '' === $agent ) {
			$this->add_notice( 'persona_assistant_target', __( 'Choose an agent to connect Runtype.', 'persona-assistant' ), 'warning' );
			return;
		}

		$origin = persona_assistant_site_origin();
		$env    = persona_assistant_get_environment();
		$state  = persona_assistant_get_state();

		$needs_mint = empty( $state['client_token'] )
			|| ! isset( $state['origin'] ) || $state['origin'] !== $origin
			|| ! isset( $state['agent_id'] ) || $state['agent_id'] !== $agent
			|| ! isset( $state['environment'] ) || $state['environment'] !== $env;

		if ( ! $needs_mint ) {
			return;
		}

		$this->mint_and_store( $credential, $settings, $origin, $env );
	}

	/**
	 * Perform the mint and persist state (or surface the error).
	 *
	 * @param string              $credential Bearer credential.
	 * @param array<string,mixed> $settings   Current settings.
	 * @param string              $origin     Browser origin to scope to.
	 * @param string              $env        'live' | 'test'.
	 * @return void
	 */
	private function mint_and_store( $credential, $settings, $origin, $env ) {
		$host = wp_parse_url( home_url(), PHP_URL_HOST );
		$opts = array(
			'name'           => 'WordPress: ' . ( $host ? $host : 'site' ),
			'allowedOrigins' => array( $origin ),
			'environment'    => $env,
		);
		if ( '' !== persona_assistant_effective_agent_id() ) {
			$opts['agentIds'] = array( persona_assistant_effective_agent_id() );
		}

		$runtype = new Persona_Assistant_Runtype();
		$result  = $runtype->mint_client_token( $credential, $opts );

		if ( is_wp_error( $result ) ) {
			$this->add_notice(
				'persona_assistant_mint',
				/* translators: %s: error detail. */
				sprintf( __( 'Could not connect to Runtype: %s', 'persona-assistant' ), $result->get_error_message() ),
				'error'
			);
			return;
		}

		// Merge, never replace: a whole-array write here would clobber the
		// stored OAuth token pair and orphan the Login with Runtype session.
		persona_assistant_merge_state(
			array(
				'client_token'    => $result['token'],
				'client_token_id' => $result['id'],
				'origin'          => $origin,
				'agent_id'        => persona_assistant_effective_agent_id(),
				'environment'     => $env,
				'allowed_origins' => $result['allowedOrigins'],
				'minted_at'       => time(),
			)
		);

		$this->add_notice(
			'persona_assistant_connected',
			/* translators: %s: site origin. */
			sprintf( __( 'Connected to Runtype. Minted a client token scoped to %s.', 'persona-assistant' ), $origin ),
			'success'
		);
	}

	/**
	 * AJAX: list agents for the supplied (or stored) API key.
	 *
	 * @return void
	 */
	public function ajax_list_targets() {
		check_ajax_referer( 'persona_assistant_admin', 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Permission denied.', 'persona-assistant' ) ), 403 );
		}

		// Use the stored credential for the active source (an API key, or the
		// OAuth access token minted by Login with Runtype). There is no longer
		// an API-key form field to read from.
		$credential = Persona_Assistant_Credential::resolve_mint_credential();
		if ( is_wp_error( $credential ) ) {
			wp_send_json_error( array( 'message' => $credential->get_error_message() ) );
		}

		$runtype = new Persona_Assistant_Runtype();
		$agents  = $runtype->list_agents( $credential );

		if ( is_wp_error( $agents ) ) {
			wp_send_json_error( array( 'message' => $agents->get_error_message() ) );
		}

		persona_assistant_cache_agents( $agents );

		wp_send_json_success( array( 'agents' => $agents ) );
	}

	/**
	 * Handle the reconnect / disconnect actions (admin-post).
	 *
	 * @return void
	 */
	public function handle_remint() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'persona-assistant' ) );
		}
		check_admin_referer( 'persona_assistant_remint' );

		$action = isset( $_POST['persona_assistant_action'] ) ? sanitize_key( wp_unslash( $_POST['persona_assistant_action'] ) ) : 'remint';

		if ( 'disconnect' === $action ) {
			$state      = persona_assistant_get_state();
			$runtype    = new Persona_Assistant_Runtype();
			$credential = Persona_Assistant_Credential::resolve_mint_credential();
			if ( ! is_wp_error( $credential ) && ! empty( $state['client_token_id'] ) ) {
				$runtype->revoke( $credential, $state['client_token_id'] );
			}
			// Best-effort remote revocation of the OAuth pair too, since clearing state
			// below only forgets the tokens locally, it does not invalidate them.
			if ( ! empty( $state['oauth_refresh_token'] ) ) {
				$runtype->revoke_oauth_token( (string) $state['oauth_refresh_token'], 'refresh_token' );
			}
			if ( ! empty( $state['oauth_access_token'] ) ) {
				$runtype->revoke_oauth_token( (string) $state['oauth_access_token'], 'access_token' );
			}
			persona_assistant_clear_state();
			$settings                      = persona_assistant_get_settings();
			$settings['api_key']           = '';
			$settings['client_token']      = '';
			$settings['agent_id']          = '';
			// Require an explicit provider change before Runtype can reconnect,
			// including sites whose management key is defined in wp-config.php.
			$settings['power_source']      = 'wordpress_ai';
			$settings['placement_mode']    = 'off';
			$settings['enabled']           = false;
			$this->suppress_reconcile      = true;
			update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings );
			$this->suppress_reconcile      = false;
			delete_transient( 'persona_assistant_agents' );
			$this->add_notice( 'persona_assistant_disconnected', __( 'Disconnected from Runtype.', 'persona-assistant' ), 'success' );
		} else {
			// Force a fresh mint.
			persona_assistant_clear_state();
			$this->reconcile_runtype();
		}

		$this->redirect_back();
	}

	/**
	 * Complete, skip, or restart the guided setup checklist.
	 *
	 * @return void
	 */
	public function handle_setup_action() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'persona-assistant' ) );
		}
		check_admin_referer( 'persona_assistant_setup' );

		$setup_action = isset( $_POST['persona_assistant_setup_action'] )
			? sanitize_key( wp_unslash( $_POST['persona_assistant_setup_action'] ) )
			: 'finish';

		if ( 'restart' === $setup_action ) {
			update_option(
				self::SETUP_OPTION,
				array(
					'completed'  => false,
					'started_at' => time(),
				),
				false
			);
			wp_safe_redirect( $this->view_url( 'setup' ) );
			exit;
		}

		update_option(
			self::SETUP_OPTION,
			array(
				'completed'    => true,
				'completed_at' => time(),
				'skipped'      => 'skip' === $setup_action,
			),
			false
		);
		wp_safe_redirect( $this->view_url( 'overview', array( 'setup-complete' => '1' ) ) );
		exit;
	}

	/* ---------------------------------------------------------------------
	 * "Login with Runtype": Authorization Code + PKCE (site-verified)
	 * ------------------------------------------------------------------- */

	/**
	 * The wp-admin redirect URI the authorization code is returned to.
	 *
	 * Must be same-origin with persona_assistant_site_origin() and HTTPS.
	 *
	 * @return string
	 */
	private function oauth_redirect_uri() {
		return admin_url( 'options-general.php?page=' . self::PAGE_SLUG . '&persona_assistant_oauth=callback' );
	}

	/**
	 * Is the given URL same-origin with the site origin the API will verify?
	 *
	 * @param string $url URL to test.
	 * @return bool
	 */
	private function is_same_origin( $url ) {
		$site  = persona_assistant_site_origin();
		$parts = wp_parse_url( (string) $url );
		if ( empty( $parts['host'] ) ) {
			return false;
		}
		$scheme = isset( $parts['scheme'] ) ? $parts['scheme'] : '';
		$origin = $scheme . '://' . $parts['host'];
		if ( ! empty( $parts['port'] ) ) {
			$origin .= ':' . $parts['port'];
		}
		return $origin === $site;
	}

	/**
	 * Can "Login with Runtype" work on this site?
	 *
	 * The site-verified Authorization Code flow requires the wp-admin redirect
	 * URI to be same-origin with the verified site origin and served over HTTPS.
	 * The render path calls this to decide between the connect button and the
	 * manual client-token fallback; handle_oauth_connect() keeps its granular
	 * checks so it can surface a distinct message for each failure.
	 *
	 * @return bool
	 */
	private function oauth_can_work() {
		$redirect_uri = $this->oauth_redirect_uri();
		return $this->is_same_origin( $redirect_uri ) && 0 === strpos( $redirect_uri, 'https://' );
	}

	/**
	 * Start the OAuth flow: create + verify site ownership, then redirect the
	 * admin's browser to the Runtype consent/authorize page.
	 *
	 * @return void
	 */
	public function handle_oauth_connect() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'persona-assistant' ) );
		}
		check_admin_referer( 'persona_assistant_oauth_connect' );

		$origin       = persona_assistant_site_origin();
		$redirect_uri = $this->oauth_redirect_uri();

		// The redirect URI must be same-origin with the verified site origin and
		// HTTPS. If wp-admin lives on a different host (or the site is not HTTPS),
		// site verification cannot succeed, so fail with actionable guidance.
		if ( ! $this->is_same_origin( $redirect_uri ) ) {
			$this->add_notice(
				'persona_assistant_oauth_origin',
				__( 'Login with Runtype requires the WordPress admin to be on the same origin as your site address. Connect manually with a client token instead.', 'persona-assistant' ),
				'error'
			);
			$this->redirect_back();
			return;
		}
		if ( 0 !== strpos( $redirect_uri, 'https://' ) ) {
			$this->add_notice(
				'persona_assistant_oauth_https',
				__( 'Login with Runtype requires your site to be served over HTTPS. Connect manually with a client token instead.', 'persona-assistant' ),
				'error'
			);
			$this->redirect_back();
			return;
		}

		$runtype = new Persona_Assistant_Runtype();

		$verification = $runtype->create_site_verification( $origin, $redirect_uri );
		if ( is_wp_error( $verification ) ) {
			$this->add_notice(
				'persona_assistant_oauth_create',
				/* translators: %s: error detail. */
				sprintf( __( 'Could not start Login with Runtype: %s', 'persona-assistant' ), $verification->get_error_message() ),
				'error'
			);
			$this->redirect_back();
			return;
		}

		$verification_id = isset( $verification['verification_id'] ) ? (string) $verification['verification_id'] : '';
		$challenge_token = isset( $verification['challenge_token'] ) ? (string) $verification['challenge_token'] : '';
		if ( '' === $verification_id || '' === $challenge_token ) {
			$this->add_notice( 'persona_assistant_oauth_create', __( 'Runtype did not return a verification challenge.', 'persona-assistant' ), 'error' );
			$this->redirect_back();
			return;
		}

		// Publish the challenge so the API's fetch of /oauth-challenge succeeds.
		set_transient(
			Persona_Assistant_REST::CHALLENGE_TRANSIENT,
			array(
				'verification_id' => $verification_id,
				'token'           => $challenge_token,
			),
			10 * MINUTE_IN_SECONDS
		);

		$verified = $runtype->verify_site( $verification_id );
		if ( is_wp_error( $verified ) || ! ( isset( $verified['status'] ) && 'verified' === $verified['status'] ) ) {
			delete_transient( Persona_Assistant_REST::CHALLENGE_TRANSIENT );
			// Remember the failure so the manual client-token row appears on the
			// settings page; the notice below sends the user there.
			persona_assistant_merge_state( array( 'oauth_verify_failed' => 1 ) );
			$detail = is_wp_error( $verified ) ? $verified->get_error_message() : __( 'the site could not be verified.', 'persona-assistant' );
			$this->add_notice(
				'persona_assistant_oauth_verify',
				sprintf(
					/* translators: %s: error detail. */
					__( 'Site verification failed: %s Your site must be publicly reachable over HTTPS. If it is not, connect manually with a client token below instead.', 'persona-assistant' ),
					$detail
				),
				'error'
			);
			$this->redirect_back();
			return;
		}

		// Verified: the challenge has served its purpose, drop it immediately.
		// The site is provably reachable, so any remembered failure is stale.
		delete_transient( Persona_Assistant_REST::CHALLENGE_TRANSIENT );
		persona_assistant_merge_state( array( 'oauth_verify_failed' => 0 ) );

		// Generate PKCE + CSRF state; keep the secrets server-side only.
		$code_verifier  = self::base64url( random_bytes( 32 ) );
		$code_challenge = self::base64url( hash( 'sha256', $code_verifier, true ) );
		$state          = self::base64url( random_bytes( 16 ) );

		set_transient(
			self::PKCE_TRANSIENT,
			array(
				'code_verifier' => $code_verifier,
				'state'         => $state,
				'redirect_uri'  => $redirect_uri,
				'created'       => time(),
			),
			10 * MINUTE_IN_SECONDS
		);

		$authorize_url = persona_assistant_get_api_base() . '/v1/oauth/authorize?' . http_build_query(
			array(
				'response_type'         => 'code',
				'client_id'             => PERSONA_ASSISTANT_OAUTH_CLIENT_ID,
				'redirect_uri'          => $redirect_uri,
				'code_challenge'        => $code_challenge,
				'code_challenge_method' => 'S256',
				'state'                 => $state,
				'scope'                 => '',
			),
			'',
			'&',
			PHP_QUERY_RFC3986
		);

		// Allow only the configured Runtype host for this external OAuth hop.
		$authorize_host = wp_parse_url( $authorize_url, PHP_URL_HOST );
		$allow_host     = static function ( $hosts ) use ( $authorize_host ) {
			if ( is_string( $authorize_host ) && '' !== $authorize_host ) {
				$hosts[] = $authorize_host;
			}
			return array_values( array_unique( $hosts ) );
		};
		add_filter( 'allowed_redirect_hosts', $allow_host );
		wp_safe_redirect( $authorize_url );
		remove_filter( 'allowed_redirect_hosts', $allow_host );
		exit;
	}

	/**
	 * Handle the browser returning from the Runtype consent page with a code.
	 *
	 * Runs on the settings-page load. Validates state against the server-side
	 * PKCE transient, exchanges the code for tokens, stores them, and mints.
	 *
	 * @return void
	 */
	public function maybe_handle_oauth_callback() {
		$flow = isset( $_GET['persona_assistant_oauth'] ) ? sanitize_key( wp_unslash( $_GET['persona_assistant_oauth'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- OAuth state below is the CSRF control.
		if ( 'callback' !== $flow ) {
			return;
		}
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// The OAuth `state` parameter (bound to the server-side PKCE transient) is
		// the CSRF control for this leg; there is no WordPress nonce on the
		// external round-trip.
		$code  = isset( $_GET['code'] ) ? sanitize_text_field( wp_unslash( $_GET['code'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Validated against stored OAuth state.
		$state = isset( $_GET['state'] ) ? sanitize_text_field( wp_unslash( $_GET['state'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- OAuth CSRF token.

		$pkce = get_transient( self::PKCE_TRANSIENT );
		delete_transient( self::PKCE_TRANSIENT );

		if ( '' === $code || '' === $state ) {
			$this->add_notice( 'persona_assistant_oauth_cb', __( 'Login with Runtype did not complete. Please try connecting again.', 'persona-assistant' ), 'error' );
			$this->redirect_back();
			return;
		}
		if ( ! is_array( $pkce ) || empty( $pkce['state'] ) || empty( $pkce['code_verifier'] ) ) {
			$this->add_notice( 'persona_assistant_oauth_cb', __( 'Your Login with Runtype session expired. Please try connecting again.', 'persona-assistant' ), 'error' );
			$this->redirect_back();
			return;
		}
		if ( ! hash_equals( (string) $pkce['state'], $state ) ) {
			$this->add_notice( 'persona_assistant_oauth_cb', __( 'Login with Runtype could not be verified (state mismatch). Please try again.', 'persona-assistant' ), 'error' );
			$this->redirect_back();
			return;
		}

		$redirect_uri = isset( $pkce['redirect_uri'] ) ? (string) $pkce['redirect_uri'] : $this->oauth_redirect_uri();

		$runtype = new Persona_Assistant_Runtype();
		$tokens  = $runtype->exchange_code( $code, $redirect_uri, (string) $pkce['code_verifier'] );
		if ( is_wp_error( $tokens ) ) {
			$this->add_notice(
				'persona_assistant_oauth_exchange',
				/* translators: %s: error detail. */
				sprintf( __( 'Could not finish Login with Runtype: %s', 'persona-assistant' ), $tokens->get_error_message() ),
				'error'
			);
			$this->redirect_back();
			return;
		}

		$patch                          = Persona_Assistant_Credential::state_from_token_response( $tokens );
		$patch['oauth_connected_at']    = time();
		$patch['oauth_needs_reconnect'] = 0;

		// Best-effort human-readable identity: the organization name (the org
		// owns the agents and tokens, so it is what the UI shows). Failure
		// just leaves the generic "Connected" wording.
		if ( ! empty( $patch['oauth_access_token'] ) ) {
			$profile = $runtype->get_profile( (string) $patch['oauth_access_token'] );
			if ( ! is_wp_error( $profile ) ) {
				$patch['oauth_org_id']   = $profile['org_id'];
				$patch['oauth_org_name'] = $profile['org_name'];
			}
		}
		persona_assistant_merge_state( $patch );

		// Make Runtype the active provider and reconcile a client token now. The
		// stored OAuth tokens make Persona_Assistant_Credential::source() derive OAuth.
		$settings                 = persona_assistant_get_settings();
		$settings['power_source'] = 'runtype';
		$this->suppress_reconcile = true;
		update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings );
		$this->suppress_reconcile      = false;

		// Defensive: the challenge should already be gone.
		delete_transient( Persona_Assistant_REST::CHALLENGE_TRANSIENT );

		$org_name = isset( $patch['oauth_org_name'] ) ? (string) $patch['oauth_org_name'] : '';
		$this->add_notice(
			'persona_assistant_oauth_connected',
			'' !== $org_name
				/* translators: %s: Runtype organization name. */
				? sprintf( __( 'Connected to %s on Runtype.', 'persona-assistant' ), $org_name )
				: __( 'Connected to Runtype.', 'persona-assistant' ),
			'success'
		);

		// Mint (or re-mint) the client token from the fresh access token.
		$this->reconcile_runtype();

		$this->redirect_back();
	}

	/**
	 * Disconnect "Login with Runtype": best-effort revoke, then clear only the
	 * OAuth state keys. The minted client token and other state are preserved.
	 *
	 * @return void
	 */
	public function handle_oauth_disconnect() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'persona-assistant' ) );
		}
		check_admin_referer( 'persona_assistant_oauth_disconnect' );

		$state   = persona_assistant_get_state();
		$runtype = new Persona_Assistant_Runtype();
		if ( ! empty( $state['oauth_refresh_token'] ) ) {
			$runtype->revoke_oauth_token( (string) $state['oauth_refresh_token'], 'refresh_token' );
		}
		if ( ! empty( $state['oauth_access_token'] ) ) {
			$runtype->revoke_oauth_token( (string) $state['oauth_access_token'], 'access_token' );
		}

		persona_assistant_merge_state(
			array(
				'oauth_access_token'       => '',
				'oauth_refresh_token'      => '',
				'oauth_expires_at'         => 0,
				'oauth_refresh_expires_at' => 0,
				'oauth_user_id'            => '',
				'oauth_email'              => '',
				'oauth_org_id'             => '',
				'oauth_org_name'           => '',
				'oauth_connected_at'       => 0,
				'oauth_needs_reconnect'    => 0,
				'oauth_verify_failed'      => 0,
			)
		);

		$this->add_notice( 'persona_assistant_oauth_disconnected', __( 'Disconnected Login with Runtype.', 'persona-assistant' ), 'success' );
		$this->redirect_back();
	}

	/**
	 * URL-safe, unpadded base64 (RFC 7636 / base64url).
	 *
	 * @param string $bytes Raw bytes.
	 * @return string
	 */
	private static function base64url( $bytes ) {
		return rtrim( strtr( base64_encode( $bytes ), '+/', '-_' ), '=' );
	}

	/**
	 * Persist queued notices and redirect to the settings page.
	 *
	 * @return void
	 */
	private function redirect_back() {
		set_transient( 'settings_errors', get_settings_errors(), 30 );
		wp_safe_redirect( $this->view_url( 'connection', array( 'settings-updated' => 'true' ) ) );
		exit;
	}

	/**
	 * Queue a settings notice.
	 *
	 * @param string $code    Notice code.
	 * @param string $message Message.
	 * @param string $type    error|warning|success|info.
	 * @return void
	 */
	private function add_notice( $code, $message, $type ) {
		add_settings_error( PERSONA_ASSISTANT_SETTINGS_OPTION, $code, $message, $type );
	}

	/**
	 * Global notice when the widget is enabled but cannot run.
	 *
	 * @return void
	 */
	public function admin_notice() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		if ( get_transient( 'persona_assistant_just_activated' ) ) {
			delete_transient( 'persona_assistant_just_activated' );
			printf(
				'<div class="notice notice-success is-dismissible"><p><strong>%1$s</strong> %2$s <a class="button button-primary" href="%3$s">%4$s</a></p></div>',
				esc_html__( 'Persona Assistant is ready to set up.', 'persona-assistant' ),
				esc_html__( 'Connect an AI, customize the chat, and choose where to publish it.', 'persona-assistant' ),
				esc_url( admin_url( 'options-general.php?page=' . self::PAGE_SLUG ) ),
				esc_html__( 'Start setup', 'persona-assistant' )
			);
		}
		if ( 'off' === persona_assistant_get_setting( 'placement_mode', 'off' ) && ! persona_assistant_page_exists() ) {
			return;
		}

		$mode = persona_assistant_resolve_mode();
		$url  = admin_url( 'options-general.php?page=' . self::PAGE_SLUG );

		if ( 'demo' === $mode ) {
			printf(
				'<div class="notice notice-info"><p><strong>%1$s</strong> %2$s <a href="%3$s">%4$s</a></p></div>',
				esc_html__( 'Persona Assistant is in demo mode.', 'persona-assistant' ),
				esc_html__( 'Responses are simulated, and the assistant is only visible to administrators. Connect Runtype or configure WordPress AI to go live.', 'persona-assistant' ),
				esc_url( $url ),
				esc_html__( 'Configure Persona Assistant', 'persona-assistant' )
			);
			return;
		}

		if ( 'disabled' !== $mode ) {
			return;
		}

		printf(
			'<div class="notice notice-warning"><p>%1$s <a href="%2$s">%3$s</a></p></div>',
			esc_html__( 'Persona Assistant is configured to appear on the site, but no AI connection is ready. Connect Runtype or configure WordPress AI.', 'persona-assistant' ),
			esc_url( $url ),
			esc_html__( 'Configure Persona Assistant', 'persona-assistant' )
		);
	}

	/**
	 * Whitelist a value against allowed options.
	 *
	 * @param mixed         $value   Candidate.
	 * @param array<string> $allowed Allowed values.
	 * @param string        $default Fallback.
	 * @return string
	 */
	private function whitelist( $value, $allowed, $default ) {
		$value = is_string( $value ) ? $value : '';
		return in_array( $value, $allowed, true ) ? $value : $default;
	}

	/* ---------------------------------------------------------------------
	 * Rendering
	 * ------------------------------------------------------------------- */

	/**
	 * Render the settings page.
	 *
	 * @return void
	 */
	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$this->maybe_backfill_oauth_identity();

		$settings = persona_assistant_get_settings();
		$view     = $this->current_view();
		?>
		<div class="wrap persona-assistant-wrap">
			<div class="persona-assistant-page-heading">
				<div>
					<h1><?php esc_html_e( 'Persona Assistant', 'persona-assistant' ); ?></h1>
					<p class="description"><?php esc_html_e( 'Connect once, then manage each chat surface in its own focused workspace.', 'persona-assistant' ); ?></p>
				</div>
				<?php if ( 'setup' !== $view ) : ?>
					<a class="button" href="<?php echo esc_url( $this->view_url( 'setup' ) ); ?>"><?php esc_html_e( 'Setup checklist', 'persona-assistant' ); ?></a>
				<?php endif; ?>
			</div>

			<?php if ( 'setup' === $view ) : ?>
				<?php $this->render_setup_checklist( $settings ); ?>
			<?php else : ?>
				<?php $this->render_navigation( $view ); ?>
				<?php if ( isset( $_GET['setup'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
					<p class="persona-assistant-setup-return"><a href="<?php echo esc_url( $this->view_url( 'setup' ) ); ?>">← <?php esc_html_e( 'Back to setup checklist', 'persona-assistant' ); ?></a></p>
				<?php endif; ?>
				<?php $this->render_focused_view( $view, $settings ); ?>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Render the permanent navigation used after first-run setup.
	 *
	 * @param string $current Current view.
	 * @return void
	 */
	private function render_navigation( $current ) {
		$views = array(
			'overview'   => __( 'Overview', 'persona-assistant' ),
			'connection' => __( 'Connection', 'persona-assistant' ),
			'brand'      => __( 'Brand & Copy', 'persona-assistant' ),
			'launcher'   => __( 'Launcher', 'persona-assistant' ),
			'assistant'  => __( 'Assistant Page', 'persona-assistant' ),
			'advanced'   => __( 'Advanced', 'persona-assistant' ),
		);
		?>
		<nav class="nav-tab-wrapper persona-assistant-nav" aria-label="<?php echo esc_attr__( 'Persona Assistant settings', 'persona-assistant' ); ?>">
			<?php foreach ( $views as $view => $label ) : ?>
				<a class="nav-tab <?php echo $current === $view ? 'nav-tab-active' : ''; ?>" href="<?php echo esc_url( $this->view_url( $view ) ); ?>"><?php echo esc_html( $label ); ?></a>
			<?php endforeach; ?>
		</nav>
		<?php
	}

	/**
	 * Render one focused administration workspace.
	 *
	 * @param string              $view     Current view.
	 * @param array<string,mixed> $settings Settings.
	 * @return void
	 */
	private function render_focused_view( $view, $settings ) {
		if ( 'overview' === $view ) {
			$this->render_overview( $settings );
			return;
		}

		if ( 'assistant' === $view ) {
			?>
			<form id="persona-assistant-create-page-form" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
				<input type="hidden" name="action" value="persona_assistant_create_assistant_page" />
				<?php wp_nonce_field( 'persona_assistant_create_assistant_page' ); ?>
			</form>
			<?php
		}
		?>
		<form action="options.php" method="post" class="persona-assistant-form">
			<?php settings_fields( self::OPTION_GROUP ); ?>
			<input type="hidden" name="<?php echo esc_attr( PERSONA_ASSISTANT_SETTINGS_OPTION ); ?>[_persona_assistant_scope]" value="<?php echo esc_attr( $view ); ?>" />
			<section class="persona-assistant-card persona-assistant-workspace">
				<?php if ( 'connection' === $view ) : ?>
					<h2><?php esc_html_e( 'Connection', 'persona-assistant' ); ?></h2>
					<p class="description"><?php esc_html_e( 'Choose the AI service and assistant that should answer your visitors.', 'persona-assistant' ); ?></p>
					<?php $this->render_provider_choice( $settings ); ?>
					<div class="persona-assistant-provider-section" data-provider="runtype"><?php $this->render_runtype_section( $settings ); ?></div>
					<div class="persona-assistant-provider-section" data-provider="wordpress_ai"><?php $this->render_wp_ai_section( $settings ); ?></div>
				<?php elseif ( 'brand' === $view ) : ?>
					<h2><?php esc_html_e( 'Brand & Copy', 'persona-assistant' ); ?></h2>
					<p class="description"><?php esc_html_e( 'These shared colors and words are used by both the launcher and the assistant Page.', 'persona-assistant' ); ?></p>
					<?php $this->render_appearance_section( $settings, 'brand' ); ?>
				<?php elseif ( 'launcher' === $view ) : ?>
					<h2><?php esc_html_e( 'Launcher', 'persona-assistant' ); ?></h2>
					<p class="description"><?php esc_html_e( 'Control where the floating chat appears and how visitors open it.', 'persona-assistant' ); ?></p>
					<?php $this->render_power_section( $settings, 'launcher' ); ?>
					<?php $this->render_appearance_section( $settings, 'launcher' ); ?>
				<?php elseif ( 'assistant' === $view ) : ?>
					<h2><?php esc_html_e( 'Assistant Page', 'persona-assistant' ); ?></h2>
					<p class="description"><?php esc_html_e( 'Choose the WordPress Page and design its full-screen conversation experience.', 'persona-assistant' ); ?></p>
					<?php $this->render_power_section( $settings, 'assistant' ); ?>
					<?php $this->render_appearance_section( $settings, 'assistant' ); ?>
				<?php elseif ( 'advanced' === $view ) : ?>
					<h2><?php esc_html_e( 'Advanced', 'persona-assistant' ); ?></h2>
					<p class="description"><?php esc_html_e( 'Optional reasoning visibility and site tool integrations.', 'persona-assistant' ); ?></p>
					<?php $this->render_appearance_section( $settings, 'advanced' ); ?>
				<?php endif; ?>
			</section>
			<div class="persona-assistant-save-bar"><?php submit_button( __( 'Save changes', 'persona-assistant' ), 'primary', 'submit', false ); ?></div>
		</form>
		<?php
	}

	/**
	 * One-time, resumable setup checklist.
	 *
	 * @param array<string,mixed> $settings Settings.
	 * @return void
	 */
	private function render_setup_checklist( $settings ) {
		// Demo mode does not count as connected: the checklist tracks real
		// AI connections, and demo is exactly the state before one exists.
		$connected   = ! in_array( persona_assistant_resolve_mode(), array( 'disabled', 'demo' ), true );
		$has_page    = persona_assistant_page_exists();
		$has_surface = 'off' !== (string) $settings['placement_mode'] || $has_page;
		$completed   = $this->setup_complete();
		$done        = ( $connected ? 1 : 0 ) + ( $has_surface ? 1 : 0 );
		$percent     = (int) round( ( $done / 2 ) * 100 );
		?>
		<section class="persona-assistant-onboarding">
			<div class="persona-assistant-onboarding-hero">
				<span class="persona-assistant-eyebrow"><?php esc_html_e( 'Guided setup', 'persona-assistant' ); ?></span>
				<h2><?php echo esc_html( $completed ? __( 'Review your Persona Assistant setup', 'persona-assistant' ) : __( 'Set up Persona Assistant', 'persona-assistant' ) ); ?></h2>
				<p><?php esc_html_e( 'Complete the essentials first. Appearance controls stay out of the way until you choose a surface to customize.', 'persona-assistant' ); ?></p>
				<div class="persona-assistant-progress" aria-label="<?php /* translators: 1: completed setup tasks, 2: total setup tasks. */ echo esc_attr( sprintf( __( '%1$d of %2$d setup tasks complete', 'persona-assistant' ), $done, 2 ) ); ?>">
					<span style="width:<?php echo esc_attr( $percent ); ?>%"></span>
				</div>
				<p class="persona-assistant-progress-label"><?php /* translators: 1: completed essential tasks, 2: total essential tasks. */ echo esc_html( sprintf( __( '%1$d of %2$d essential tasks complete', 'persona-assistant' ), $done, 2 ) ); ?></p>
			</div>

			<div class="persona-assistant-task-list">
				<article class="persona-assistant-task <?php echo $connected ? 'is-complete' : ''; ?>">
					<span class="persona-assistant-task-state" aria-hidden="true"><?php echo $connected ? '✓' : '1'; ?></span>
					<div>
						<h3><?php esc_html_e( 'Connect an AI', 'persona-assistant' ); ?></h3>
						<p><?php echo esc_html( $connected ? __( 'Your assistant is connected and ready to answer.', 'persona-assistant' ) : __( 'Choose Runtype or your WordPress AI provider, then select an assistant.', 'persona-assistant' ) ); ?></p>
					</div>
					<a class="button <?php echo $connected ? '' : 'button-primary'; ?>" href="<?php echo esc_url( $this->view_url( 'connection', array( 'setup' => '1' ) ) ); ?>"><?php echo esc_html( $connected ? __( 'Review connection', 'persona-assistant' ) : __( 'Connect AI', 'persona-assistant' ) ); ?></a>
				</article>

				<article class="persona-assistant-task <?php echo $has_surface ? 'is-complete' : ''; ?>">
					<span class="persona-assistant-task-state" aria-hidden="true"><?php echo $has_surface ? '✓' : '2'; ?></span>
					<div>
						<h3><?php esc_html_e( 'Choose where chat appears', 'persona-assistant' ); ?></h3>
						<p><?php echo esc_html( $has_surface ? __( 'At least one visitor-facing surface is configured.', 'persona-assistant' ) : __( 'Enable a floating launcher, create an assistant Page, or use manual embeds.', 'persona-assistant' ) ); ?></p>
						<div class="persona-assistant-task-links">
							<a href="<?php echo esc_url( $this->view_url( 'launcher', array( 'setup' => '1' ) ) ); ?>"><?php esc_html_e( 'Configure launcher', 'persona-assistant' ); ?></a>
							<a href="<?php echo esc_url( $this->view_url( 'assistant', array( 'setup' => '1' ) ) ); ?>"><?php esc_html_e( 'Configure assistant Page', 'persona-assistant' ); ?></a>
						</div>
					</div>
				</article>

				<article class="persona-assistant-task persona-assistant-task--optional">
					<span class="persona-assistant-task-state" aria-hidden="true">3</span>
					<div>
						<h3><?php esc_html_e( 'Make it yours', 'persona-assistant' ); ?> <small><?php esc_html_e( 'Optional', 'persona-assistant' ); ?></small></h3>
						<p><?php esc_html_e( 'Adjust shared colors and copy now, or return to them whenever you want.', 'persona-assistant' ); ?></p>
					</div>
					<a class="button" href="<?php echo esc_url( $this->view_url( 'brand', array( 'setup' => '1' ) ) ); ?>"><?php esc_html_e( 'Edit brand & copy', 'persona-assistant' ); ?></a>
				</article>
			</div>

			<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="persona-assistant-setup-actions">
				<?php wp_nonce_field( 'persona_assistant_setup' ); ?>
				<input type="hidden" name="action" value="persona_assistant_setup" />
				<?php if ( $connected ) : ?>
					<button type="submit" class="button button-primary button-hero" name="persona_assistant_setup_action" value="finish"><?php esc_html_e( 'Finish setup', 'persona-assistant' ); ?></button>
				<?php else : ?>
					<button type="submit" class="button button-primary" name="persona_assistant_setup_action" value="skip"><?php esc_html_e( 'Skip guided setup', 'persona-assistant' ); ?></button>
				<?php endif; ?>
				<?php if ( $completed ) : ?>
					<a class="button-link" href="<?php echo esc_url( $this->view_url( 'overview' ) ); ?>"><?php esc_html_e( 'Return to overview', 'persona-assistant' ); ?></a>
				<?php endif; ?>
			</form>
		</section>
		<?php
	}

	/**
	 * Ongoing management overview.
	 *
	 * @param array<string,mixed> $settings Settings.
	 * @return void
	 */
	private function render_overview( $settings ) {
		$mode       = persona_assistant_resolve_mode();
		$connected  = 'disabled' !== $mode;
		$page_id    = absint( $settings['assistant_page_id'] );
		$page       = $page_id ? get_post( $page_id ) : null;
		$valid_page = $page instanceof WP_Post && 'page' === $page->post_type && 'trash' !== $page->post_status;
		$mode_label = 'runtype' === $mode ? __( 'Runtype', 'persona-assistant' ) : ( 'wordpress_ai' === $mode ? __( 'WordPress AI', 'persona-assistant' ) : ( 'demo' === $mode ? __( 'Demo mode', 'persona-assistant' ) : __( 'Not connected', 'persona-assistant' ) ) );
		?>
		<?php if ( isset( $_GET['setup-complete'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Setup complete. You can return to these workspaces whenever you need to make a change.', 'persona-assistant' ); ?></p></div>
		<?php endif; ?>
		<?php $this->render_status_panel( $settings ); ?>
		<div class="persona-assistant-overview-grid">
			<article class="persona-assistant-overview-card">
				<div class="persona-assistant-overview-card-head">
					<span class="dashicons dashicons-admin-links" aria-hidden="true"></span>
					<?php $this->badge( $connected ? __( 'Ready', 'persona-assistant' ) : __( 'Needs setup', 'persona-assistant' ), $connected ? 'ok' : 'warn' ); ?>
				</div>
				<h2><?php esc_html_e( 'Connection', 'persona-assistant' ); ?></h2>
				<p><?php echo esc_html( $mode_label ); ?></p>
				<a class="button" href="<?php echo esc_url( $this->view_url( 'connection' ) ); ?>"><?php esc_html_e( 'Manage connection', 'persona-assistant' ); ?></a>
			</article>

			<article class="persona-assistant-overview-card">
				<div class="persona-assistant-overview-card-head">
					<span class="dashicons dashicons-format-chat" aria-hidden="true"></span>
					<?php $this->badge( 'sitewide' === (string) $settings['placement_mode'] ? __( 'Live', 'persona-assistant' ) : __( 'Off', 'persona-assistant' ), 'sitewide' === (string) $settings['placement_mode'] ? 'ok' : 'off' ); ?>
				</div>
				<h2><?php esc_html_e( 'Launcher', 'persona-assistant' ); ?></h2>
				<p><?php echo esc_html( 'sitewide' === (string) $settings['placement_mode'] ? __( 'Floating chat is shown across the site.', 'persona-assistant' ) : __( 'The site-wide floating launcher is disabled.', 'persona-assistant' ) ); ?></p>
				<a class="button" href="<?php echo esc_url( $this->view_url( 'launcher' ) ); ?>"><?php esc_html_e( 'Customize launcher', 'persona-assistant' ); ?></a>
			</article>

			<article class="persona-assistant-overview-card">
				<div class="persona-assistant-overview-card-head">
					<span class="dashicons dashicons-welcome-widgets-menus" aria-hidden="true"></span>
					<?php $this->badge( $valid_page ? __( 'Configured', 'persona-assistant' ) : __( 'Off', 'persona-assistant' ), $valid_page ? 'ok' : 'off' ); ?>
				</div>
				<h2><?php esc_html_e( 'Assistant Page', 'persona-assistant' ); ?></h2>
				<p><?php echo esc_html( $valid_page ? $page->post_title : __( 'No full-screen assistant Page is selected.', 'persona-assistant' ) ); ?></p>
				<a class="button" href="<?php echo esc_url( $this->view_url( 'assistant' ) ); ?>"><?php esc_html_e( 'Customize assistant Page', 'persona-assistant' ); ?></a>
			</article>

			<article class="persona-assistant-overview-card">
				<div class="persona-assistant-overview-card-head">
					<span class="dashicons dashicons-art" aria-hidden="true"></span>
					<?php $this->badge( __( 'Shared', 'persona-assistant' ), 'info' ); ?>
				</div>
				<h2><?php esc_html_e( 'Brand & Copy', 'persona-assistant' ); ?></h2>
				<p><?php esc_html_e( 'Shared colors, greeting, placeholder, and suggested prompts.', 'persona-assistant' ); ?></p>
				<a class="button" href="<?php echo esc_url( $this->view_url( 'brand' ) ); ?>"><?php esc_html_e( 'Edit brand & copy', 'persona-assistant' ); ?></a>
			</article>
		</div>
		<div class="persona-assistant-overview-footer">
			<p><strong><?php esc_html_e( 'Manual embeds', 'persona-assistant' ); ?></strong> <code>[persona_assistant]</code> <?php esc_html_e( 'or the Persona Assistant block.', 'persona-assistant' ); ?></p>
			<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post">
				<?php wp_nonce_field( 'persona_assistant_setup' ); ?>
				<input type="hidden" name="action" value="persona_assistant_setup" />
				<button type="submit" class="button-link" name="persona_assistant_setup_action" value="restart"><?php esc_html_e( 'Run setup checklist again', 'persona-assistant' ); ?></button>
			</form>
		</div>
		<?php
	}

	/**
	 * Status panel with live badges.
	 *
	 * @param array<string,mixed> $settings Settings.
	 * @return void
	 */
	private function render_status_panel( $settings ) {
		$mode   = persona_assistant_resolve_mode();
		$source = Persona_Assistant_Credential::source();
		$token  = persona_assistant_effective_client_token();
		$state  = persona_assistant_get_state();
		$ai     = Persona_Assistant_AI::describe();
		$placement = (string) $settings['placement_mode'];
		$is_ready  = 'disabled' !== $mode;
		$assistant_page_id = absint( $settings['assistant_page_id'] );
		$assistant_page    = $assistant_page_id ? get_post( $assistant_page_id ) : null;
		$has_assistant_page = $assistant_page instanceof WP_Post
			&& 'page' === $assistant_page->post_type
			&& 'trash' !== $assistant_page->post_status;
		$assistant_page_live = $has_assistant_page && 'publish' === $assistant_page->post_status;

		if ( 'demo' === $mode ) {
			$headline = __( 'Demo mode is active: responses are simulated and only administrators see the assistant.', 'persona-assistant' );
			$tone     = 'info';
		} elseif ( ! $is_ready ) {
			$headline = __( 'Finish connecting an AI to preview or publish chat.', 'persona-assistant' );
			$tone     = 'warn';
		} elseif ( 'sitewide' === $placement && $has_assistant_page ) {
			$headline = __( 'Chat is live site-wide and the full-screen assistant Page is configured.', 'persona-assistant' );
			$tone     = 'ok';
		} elseif ( 'sitewide' === $placement ) {
			$headline = __( 'Chat is live site-wide.', 'persona-assistant' );
			$tone     = 'ok';
		} elseif ( 'manual' === $placement && $has_assistant_page ) {
			$headline = __( 'Chat is ready for embeds and the full-screen assistant Page is configured.', 'persona-assistant' );
			$tone     = 'ok';
		} elseif ( 'manual' === $placement ) {
			$headline = __( 'Chat is ready for a block or shortcode.', 'persona-assistant' );
			$tone     = 'ok';
		} elseif ( $has_assistant_page ) {
			$headline = $assistant_page_live
				? __( 'The full-screen assistant Page is live.', 'persona-assistant' )
				: __( 'The full-screen assistant Page is configured but not published.', 'persona-assistant' );
			$tone     = 'ok';
		} else {
			$headline = __( 'Chat is connected but not published.', 'persona-assistant' );
			$tone     = 'info';
		}

		$mode_labels = array(
			'runtype'      => __( 'Runtype', 'persona-assistant' ),
			'wordpress_ai' => __( 'WordPress built-in AI', 'persona-assistant' ),
			'demo'         => __( 'Demo (simulated responses)', 'persona-assistant' ),
			'disabled'     => __( 'Disabled', 'persona-assistant' ),
		);
		if ( 'disabled' === $mode ) {
			$power_summary = __( 'No AI connection is ready.', 'persona-assistant' );
		} elseif ( 'demo' === $mode ) {
			$power_summary = __( 'Trying the built-in demo. Connect Runtype or WordPress AI to go live.', 'persona-assistant' );
		} else {
			/* translators: %s: resolved AI provider name. */
			$power_summary = sprintf( __( 'Powered by %s.', 'persona-assistant' ), $mode_labels[ $mode ] );
		}
		?>
		<div class="persona-assistant-status persona-assistant-status--<?php echo esc_attr( $tone ); ?>">
			<div class="persona-assistant-status-summary">
				<div>
					<h2><?php echo esc_html( $headline ); ?></h2>
					<p><?php echo esc_html( $power_summary ); ?></p>
				</div>
				<div class="persona-assistant-status-actions">
					<a class="button" href="<?php echo esc_url( $this->view_url( 'assistant' ) ); ?>"><?php esc_html_e( 'Preview assistant', 'persona-assistant' ); ?></a>
					<?php if ( $has_assistant_page ) : ?>
						<a class="button" href="<?php echo esc_url( get_permalink( $assistant_page_id ) ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'View assistant', 'persona-assistant' ); ?><span class="screen-reader-text"> <?php esc_html_e( '(opens in a new tab)', 'persona-assistant' ); ?></span></a>
					<?php endif; ?>
					<a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'View site', 'persona-assistant' ); ?><span class="screen-reader-text"> <?php esc_html_e( '(opens in a new tab)', 'persona-assistant' ); ?></span></a>
				</div>
			</div>
			<details class="persona-assistant-details">
				<summary><?php esc_html_e( 'Connection details', 'persona-assistant' ); ?></summary>
			<ul class="persona-assistant-status-list">
				<li>
					<span class="persona-assistant-status-label"><?php esc_html_e( 'Resolved mode', 'persona-assistant' ); ?></span>
					<?php
					$mode_badge = ( 'disabled' === $mode ) ? 'off' : 'ok';
					$this->badge( isset( $mode_labels[ $mode ] ) ? $mode_labels[ $mode ] : $mode, $mode_badge );
					?>
				</li>
				<li>
					<span class="persona-assistant-status-label"><?php esc_html_e( 'Runtype client token', 'persona-assistant' ); ?></span>
					<?php
					if ( '' !== $token ) {
						$this->badge( $this->mask_token( $token ), 'ok' );
						if ( ! empty( $state['origin'] ) ) {
							echo ' <code class="persona-assistant-origin">' . esc_html( $state['origin'] ) . '</code>';
						}
					} else {
						$this->badge( __( 'None', 'persona-assistant' ), 'off' );
					}
					?>
				</li>
				<li>
					<span class="persona-assistant-status-label"><?php esc_html_e( 'Credential source', 'persona-assistant' ); ?></span>
					<?php $this->badge( $this->source_label( $source ), 'info' ); ?>
				</li>
				<?php if ( Persona_Assistant_Credential::SOURCE_OAUTH === $source ) : ?>
					<li>
						<span class="persona-assistant-status-label"><?php esc_html_e( 'Login with Runtype', 'persona-assistant' ); ?></span>
						<?php
						if ( ! empty( $state['oauth_needs_reconnect'] ) ) {
							$this->badge( __( 'Reconnect required', 'persona-assistant' ), 'warn' );
						} elseif ( ! empty( $state['oauth_access_token'] ) || ! empty( $state['oauth_refresh_token'] ) ) {
							$this->badge(
								! empty( $state['oauth_org_name'] ) ? (string) $state['oauth_org_name'] : __( 'Connected', 'persona-assistant' ),
								'ok'
							);
						} else {
							$this->badge( __( 'Not connected', 'persona-assistant' ), 'off' );
						}
						?>
					</li>
				<?php endif; ?>
				<li>
					<span class="persona-assistant-status-label"><?php esc_html_e( 'Built-in AI', 'persona-assistant' ); ?></span>
					<?php
					if ( ! empty( $ai['available'] ) ) {
						$this->badge( $ai['backend'] ? $ai['backend'] : __( 'Detected', 'persona-assistant' ), 'ok' );
					} else {
						$this->badge( __( 'Not detected', 'persona-assistant' ), 'off' );
					}
					?>
				</li>
			</ul>
			<?php $this->render_connection_actions( $source, $token ); ?>
			</details>
			<?php if ( persona_assistant_webmcp_active() ) : ?>
				<div class="notice notice-info inline persona-assistant-webmcp-notice">
					<p>
						<?php
						printf(
							/* translators: %s: the words "Surface → WebMCP" naming the Runtype dashboard tab. */
							esc_html__( 'Page tools (WebMCP) are on. For the assistant to use them, WebMCP must also be enabled on this chat surface in your Runtype dashboard (%s); otherwise Runtype rejects the tools.', 'persona-assistant' ),
							'<strong>' . esc_html__( 'Surface → WebMCP', 'persona-assistant' ) . '</strong>' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						);
						?>
					</p>
				</div>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Power-source section.
	 *
	 * @param array<string,mixed> $settings Settings.
	 * @param string              $part     all|launcher|assistant.
	 * @return void
	 */
	private function render_power_section( $settings, $part = 'all' ) {
		$opt               = PERSONA_ASSISTANT_SETTINGS_OPTION;
		$assistant_page_id = absint( $settings['assistant_page_id'] );
		$assistant_page    = $assistant_page_id ? get_post( $assistant_page_id ) : null;
		$valid_page        = $assistant_page instanceof WP_Post
			&& 'page' === $assistant_page->post_type
			&& 'trash' !== $assistant_page->post_status;
		$page_dropdown = wp_dropdown_pages(
			array(
				'name'              => esc_attr( $opt . '[assistant_page_id]' ),
				'id'                => 'persona-assistant-page-page-id',
				'selected'          => $valid_page ? absint( $assistant_page_id ) : 0,
				'show_option_none'  => esc_html__( '— No full-screen assistant Page —', 'persona-assistant' ),
				'option_none_value' => '0',
				'post_status'       => array( 'publish', 'draft', 'private', 'pending' ),
				'sort_column'       => 'post_title',
				'echo'              => 0,
			)
		);
		if ( '' === $page_dropdown ) {
			$page_dropdown = sprintf(
				'<select name="%1$s" id="persona-assistant-page-page-id"><option value="0">%2$s</option></select>',
				esc_attr( $opt . '[assistant_page_id]' ),
				esc_html__( '— No full-screen assistant Page —', 'persona-assistant' )
			);
		}
		?>
		<?php if ( 'all' === $part ) : ?>
			<h2><?php esc_html_e( 'Publish', 'persona-assistant' ); ?></h2>
		<?php endif; ?>
		<?php if ( in_array( $part, array( 'all', 'launcher' ), true ) ) : ?>
		<h3><?php esc_html_e( 'Publishing mode', 'persona-assistant' ); ?></h3>
		<div class="persona-assistant-choice-grid persona-assistant-choice-grid--placement">
			<?php $this->choice_radio( 'placement_mode', 'sitewide', __( 'Floating button on every page', 'persona-assistant' ), __( 'Publish a floating launcher site-wide.', 'persona-assistant' ), (string) $settings['placement_mode'] ); ?>
			<?php $this->choice_radio( 'placement_mode', 'manual', __( 'Block or shortcode only', 'persona-assistant' ), __( 'Place chat exactly where you want it.', 'persona-assistant' ), (string) $settings['placement_mode'] ); ?>
			<?php $this->choice_radio( 'placement_mode', 'off', __( 'No launcher or embeds', 'persona-assistant' ), __( 'Keep the connection without a site-wide launcher, block, or shortcode.', 'persona-assistant' ), (string) $settings['placement_mode'] ); ?>
		</div>
		<div class="persona-assistant-manual-help" data-placement="manual">
			<p><?php esc_html_e( 'Add the Persona Assistant block in the editor, or use:', 'persona-assistant' ); ?> <code>[persona_assistant]</code></p>
		</div>
		<?php endif; ?>

		<?php if ( in_array( $part, array( 'all', 'assistant' ), true ) ) : ?>
		<div class="persona-assistant-page-page">
			<h3><?php esc_html_e( 'WordPress Page', 'persona-assistant' ); ?></h3>
			<p class="description"><?php esc_html_e( 'Turn any WordPress Page into a full-height assistant. This remains independent of the launcher.', 'persona-assistant' ); ?></p>
			<p>
				<label for="persona-assistant-page-page-id" class="screen-reader-text"><?php esc_html_e( 'Assistant Page', 'persona-assistant' ); ?></label>
				<?php echo $page_dropdown; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Generated by wp_dropdown_pages() or escaped fallback. ?>
			</p>
			<?php if ( $valid_page ) : ?>
				<?php
				$status_object = get_post_status_object( $assistant_page->post_status );
				$status_label  = $status_object ? $status_object->label : $assistant_page->post_status;
				?>
				<p class="description">
					<?php
					printf(
						/* translators: %s: WordPress Page status. */
						esc_html__( 'Selected Page status: %s.', 'persona-assistant' ),
						esc_html( $status_label )
					);
					?>
					<a href="<?php echo esc_url( get_permalink( $assistant_page_id ) ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'View', 'persona-assistant' ); ?><span class="screen-reader-text"> <?php esc_html_e( '(opens in a new tab)', 'persona-assistant' ); ?></span></a>
					<?php $edit_link = get_edit_post_link( $assistant_page_id, '' ); ?>
					<?php if ( $edit_link ) : ?>
						<span aria-hidden="true"> · </span><a href="<?php echo esc_url( $edit_link ); ?>"><?php esc_html_e( 'Edit Page', 'persona-assistant' ); ?></a>
					<?php endif; ?>
				</p>
			<?php else : ?>
				<?php if ( $assistant_page_id > 0 ) : ?>
					<div class="notice notice-warning inline"><p><?php esc_html_e( 'The previously selected Page is missing or in the Trash. Choose another Page or create a new one.', 'persona-assistant' ); ?></p></div>
				<?php endif; ?>
				<p><button type="submit" class="button" form="persona-assistant-create-page-form"><?php esc_html_e( 'Create and publish assistant Page', 'persona-assistant' ); ?></button></p>
			<?php endif; ?>
			<p class="description"><?php esc_html_e( 'Selecting no Page disables this surface without deleting or changing the Page itself.', 'persona-assistant' ); ?></p>
		</div>
		<?php endif; ?>
		<?php
	}

	/**
	 * Primary provider choice: two cards (Runtype / WordPress AI).
	 *
	 * The cards are ordered by readiness, not by a fixed preference: when the
	 * site's built-in AI can already generate text, it leads: it is zero-setup
	 * and what a WordPress user expects to see first. Otherwise leading with it
	 * would open the screen on a "not configured" warning, so the one-click
	 * Runtype connect leads instead. A saved choice is a radio value, so
	 * reordering never changes what is selected.
	 *
	 * @param array<string,mixed> $settings Settings.
	 * @return void
	 */
	private function render_provider_choice( $settings ) {
		$power       = (string) $settings['power_source'];
		$wp_ai_ready = Persona_Assistant_AI::is_available();

		$runtype = array( 'runtype', __( 'Runtype', 'persona-assistant' ), __( 'Use an agent on Runtype, with over 200 built-in models and tools.', 'persona-assistant' ) );
		$wp_ai   = array(
			'wordpress_ai',
			__( 'WordPress AI', 'persona-assistant' ),
			$wp_ai_ready
				? __( 'Use your site\'s connected AI. Already set up, no extra account needed.', 'persona-assistant' )
				: __( 'Use a provider already connected to WordPress.', 'persona-assistant' ),
		);

		$cards = $wp_ai_ready ? array( $wp_ai, $runtype ) : array( $runtype, $wp_ai );
		?>
		<div class="persona-assistant-choice-grid">
			<?php foreach ( $cards as $card ) : ?>
				<?php $this->choice_radio( 'power_source', $card[0], $card[1], $card[2], $power ); ?>
			<?php endforeach; ?>
		</div>
		<?php
	}

	/**
	 * Runtype connection section: OAuth connect (primary), agent picker, and a
	 * manual client-token fallback.
	 *
	 * @param array<string,mixed> $settings Settings.
	 * @return void
	 */
	private function render_runtype_section( $settings ) {
		$source        = Persona_Assistant_Credential::source();
		$has_constant  = defined( 'PERSONA_ASSISTANT_API_KEY' ) && PERSONA_ASSISTANT_API_KEY;
		// A legacy key stored before the API-key UI was removed still mints; it
		// just can't be entered anymore. Treat it like the constant in the UI.
		$uses_api_key  = Persona_Assistant_Credential::SOURCE_API_KEY === $source;
		$opt           = esc_attr( PERSONA_ASSISTANT_SETTINGS_OPTION );
		$cached_agents = persona_assistant_get_cached_agents();
		$can_mint      = ! is_wp_error( Persona_Assistant_Credential::resolve_mint_credential() );
		$oauth_ok      = $this->oauth_can_work();

		$has_const_token = defined( 'PERSONA_ASSISTANT_CLIENT_TOKEN' ) && PERSONA_ASSISTANT_CLIENT_TOKEN;
		$has_const_agent = defined( 'PERSONA_ASSISTANT_AGENT_ID' ) && PERSONA_ASSISTANT_AGENT_ID;
		$opt_name        = PERSONA_ASSISTANT_SETTINGS_OPTION;

		// A developer who defines PERSONA_ASSISTANT_CLIENT_TOKEN has configured the
		// connection for this site: it outranks every other source, so none of
		// the connection UI (Login with Runtype, agent picker, manual token)
		// applies. Show a single confirmation instead of machinery the site
		// owner cannot use; anything more just creates support questions for
		// the developer. The hidden field preserves the stored agent on save.
		if ( $has_const_token ) {
			?>
			<h3><?php esc_html_e( 'Connect Runtype', 'persona-assistant' ); ?></h3>
			<p>
				<?php esc_html_e( 'Runtype is connected in code for this site (via wp-config.php), so there is nothing to configure here.', 'persona-assistant' ); ?>
				<?php if ( $has_const_agent ) : ?>
					<?php esc_html_e( 'The agent is also set in code.', 'persona-assistant' ); ?>
				<?php endif; ?>
			</p>
			<input type="hidden" name="<?php echo esc_attr( $opt_name ); ?>[agent_id]" id="persona-assistant-agent-id" value="<?php echo esc_attr( (string) $settings['agent_id'] ); ?>" />
			<?php
			return;
		}

		$has_pasted_token = '' !== trim( (string) $settings['client_token'] );
		// Manual connection is a fallback path, so its UI only appears when it
		// is genuinely the path in use: OAuth cannot work on this site, a
		// connect attempt failed site verification (the error notice points
		// here), or a pasted token is already connected. Everyone else sees
		// only Login + Agent (developers use the wp-config.php constants).
		$state_flags = persona_assistant_get_state();
		$show_manual = ( ! $oauth_ok || $has_pasted_token || ! empty( $state_flags['oauth_verify_failed'] ) );
		// The visible agent-ID field exists only for the manual path, where no
		// credential can list agents; with a working mint credential the select
		// (syncing into a hidden field) is the only agent input.
		$manual_agent_field = $show_manual && ! $can_mint && ! $has_const_agent;
		$origin             = persona_assistant_site_origin();
		?>
		<h3><?php esc_html_e( 'Connect Runtype', 'persona-assistant' ); ?></h3>
		<table class="form-table" role="presentation">
			<tr>
				<th scope="row"><?php esc_html_e( 'Connect with Runtype', 'persona-assistant' ); ?></th>
				<td>
					<?php if ( $uses_api_key ) : ?>
						<p><em>
							<?php
							echo esc_html(
								$has_constant
									? __( 'Using the Runtype API key defined in wp-config.php. Agents are loaded with that key below.', 'persona-assistant' )
									: __( 'Using the Runtype API key saved by an earlier version of this plugin. Agents are loaded with that key below. Disconnecting removes it.', 'persona-assistant' )
							);
							?>
						</em></p>
					<?php elseif ( ! $oauth_ok ) : ?>
						<div class="notice notice-warning inline">
							<p><?php esc_html_e( 'Login with Runtype needs your site to be publicly reachable over HTTPS, on the same origin as the WordPress admin, so Runtype can verify you control it. That is not the case here, so connect manually with a client token below instead.', 'persona-assistant' ); ?></p>
						</div>
					<?php else : ?>
						<?php $this->render_oauth_connection(); ?>
					<?php endif; ?>
				</td>
			</tr>

			<?php if ( $can_mint ) : ?>
				<tr>
					<th scope="row"><?php esc_html_e( 'Agent', 'persona-assistant' ); ?></th>
					<td>
						<?php if ( $has_const_agent ) : ?>
							<p><em><?php esc_html_e( 'The agent is set in code via the PERSONA_ASSISTANT_AGENT_ID constant in wp-config.php, which overrides any selection here.', 'persona-assistant' ); ?></em></p>
						<?php else : ?>
							<p>
								<button type="button" class="button" id="persona-assistant-load-targets"><?php esc_html_e( 'Refresh', 'persona-assistant' ); ?></button>
								<span id="persona-assistant-load-status" class="persona-assistant-inline-status" role="status" aria-live="polite"></span>
							</p>
							<p id="persona-assistant-agent-select-row">
								<label for="persona-assistant-agent-select" class="screen-reader-text"><?php esc_html_e( 'Agent', 'persona-assistant' ); ?></label>
								<select id="persona-assistant-agent-select" class="persona-assistant-target-select" data-target="agent" data-current="<?php echo esc_attr( (string) $settings['agent_id'] ); ?>">
									<option value=""><?php esc_html_e( '— None —', 'persona-assistant' ); ?></option>
									<?php foreach ( $cached_agents as $agent ) : ?>
										<?php if ( ! empty( $agent['id'] ) ) : ?>
											<option value="<?php echo esc_attr( (string) $agent['id'] ); ?>" <?php selected( (string) $settings['agent_id'], (string) $agent['id'] ); ?>><?php echo esc_html( ! empty( $agent['name'] ) ? (string) $agent['name'] : (string) $agent['id'] ); ?></option>
										<?php endif; ?>
									<?php endforeach; ?>
								</select>
							</p>
							<?php
							// First-run onboarding: revealed by admin.js only when the
							// agent fetch succeeds with zero agents, so a cold cache or
							// a failed request never shows it. The prompt is a literal
							// pasted into an AI assistant, so it is not translated.
							?>
							<div id="persona-assistant-agent-empty" class="persona-assistant-agent-empty" hidden>
								<p><?php esc_html_e( 'Your Runtype workspace has no agents yet. Create your first one and it will appear here.', 'persona-assistant' ); ?></p>
								<p class="persona-assistant-agent-empty-action">
									<a href="<?php echo esc_url( persona_assistant_dashboard_base() . '/agents/create' ); ?>" target="_blank" rel="noopener noreferrer" class="button button-primary"><?php esc_html_e( 'Create your first agent on Runtype', 'persona-assistant' ); ?></a>
								</p>
								<p class="description"><?php esc_html_e( 'Prefer to build it with AI? Paste this prompt into your assistant:', 'persona-assistant' ); ?></p>
								<p class="persona-assistant-agent-empty-prompt">
									<code id="persona-assistant-agent-prompt">fetch https://runtype.ai and help me build my first agent on Runtype</code>
									<button type="button" class="button" id="persona-assistant-agent-prompt-copy"><?php esc_html_e( 'Copy', 'persona-assistant' ); ?></button>
								</p>
								<p class="description"><?php esc_html_e( 'When your agent is ready, click Refresh above and it is selected automatically.', 'persona-assistant' ); ?></p>
							</div>
						<?php endif; ?>
					</td>
				</tr>
			<?php endif; ?>

			<?php if ( $show_manual ) : ?>
				<tr>
					<th scope="row"><?php esc_html_e( 'Manual connection', 'persona-assistant' ); ?></th>
					<td>
						<p class="description">
							<?php
							printf(
								/* translators: %s: the site's browser origin. */
								esc_html__( 'Create a client token in the Runtype dashboard, scoped to this site\'s origin (%s) and your agent, then paste it here. It is used as-is (no minting).', 'persona-assistant' ),
								'<code>' . esc_html( $origin ) . '</code>'
							);
							?>
						</p>
						<p>
							<label for="persona-assistant-client-token" class="screen-reader-text"><?php esc_html_e( 'Client token', 'persona-assistant' ); ?></label>
							<input type="text" id="persona-assistant-client-token" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[client_token]" value="<?php echo esc_attr( (string) $settings['client_token'] ); ?>" placeholder="ct_live_..." />
						</p>
						<?php if ( $manual_agent_field ) : ?>
							<p><label for="persona-assistant-agent-id"><?php esc_html_e( 'Agent ID', 'persona-assistant' ); ?></label><br />
							<input type="text" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[agent_id]" id="persona-assistant-agent-id" value="<?php echo esc_attr( (string) $settings['agent_id'] ); ?>" placeholder="agent_..." /></p>
						<?php elseif ( $has_const_agent && ! $can_mint ) : ?>
							<?php // Without a mint credential the Agent row above is absent, so surface the pin here. ?>
							<p><em><?php esc_html_e( 'The agent is set in code via the PERSONA_ASSISTANT_AGENT_ID constant in wp-config.php.', 'persona-assistant' ); ?></em></p>
						<?php endif; ?>
					</td>
				</tr>
			<?php endif; ?>
		</table>
		<?php if ( ! $manual_agent_field ) : ?>
			<?php // Always submit agent_id (the sanitizer treats an absent field as cleared): the agent select syncs into this, and it preserves the saved value everywhere else. ?>
			<input type="hidden" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[agent_id]" id="persona-assistant-agent-id" value="<?php echo esc_attr( (string) $settings['agent_id'] ); ?>" />
		<?php endif; ?>
		<?php
	}

	/**
	 * "Login with Runtype" connect / connected affordance.
	 *
	 * Rendered inside the settings form, so the Connect and Disconnect actions
	 * are nonce-protected admin-post links (a nested <form> would be invalid).
	 *
	 * @return void
	 */
	private function render_oauth_connection() {
		$state           = persona_assistant_get_state();
		$connected       = ! empty( $state['oauth_access_token'] ) || ! empty( $state['oauth_refresh_token'] );
		$needs_reconnect = ! empty( $state['oauth_needs_reconnect'] );

		if ( $connected && ! $needs_reconnect ) {
			// The organization owns the agents and tokens, so its name is the
			// identity shown, never the account email or an opaque user id.
			$org_name       = ! empty( $state['oauth_org_name'] ) ? (string) $state['oauth_org_name'] : '';
			$disconnect_url = wp_nonce_url(
				admin_url( 'admin-post.php?action=persona_assistant_oauth_disconnect' ),
				'persona_assistant_oauth_disconnect'
			);
			printf(
				'<p><strong>%1$s</strong></p>',
				esc_html(
					'' !== $org_name
						/* translators: %s: Runtype organization name. */
						? sprintf( __( 'Connected to %s.', 'persona-assistant' ), $org_name )
						: __( 'Connected to Runtype.', 'persona-assistant' )
				)
			);
			printf(
				'<p class="persona-assistant-oauth-action"><a href="%1$s" class="button button-link-delete" data-persona-confirm="%2$s">%3$s</a></p>',
				esc_url( $disconnect_url ),
				esc_attr__( 'Disconnect Login with Runtype? Your minted client token keeps working until replaced.', 'persona-assistant' ),
				esc_html__( 'Disconnect', 'persona-assistant' )
			);
			return;
		}

		$connect_url = wp_nonce_url(
			admin_url( 'admin-post.php?action=persona_assistant_oauth_connect' ),
			'persona_assistant_oauth_connect'
		);

		if ( $needs_reconnect ) {
			printf(
				'<div class="notice notice-warning inline"><p>%s</p></div>',
				esc_html__( 'Reconnect required. Your Runtype login expired or was revoked. The existing client token keeps working until you reconnect.', 'persona-assistant' )
			);
		}

		printf(
			'<p>%s</p>',
			esc_html__( 'Connect your Runtype account in one click. You approve on a Runtype consent page and land back here connected. No API keys to copy.', 'persona-assistant' )
		);
		// No reachability caveat here: if verification fails, the error notice
		// explains it and the manual client-token row appears.
		printf(
			'<p class="persona-assistant-oauth-action"><a href="%1$s" class="button button-primary">%2$s</a></p>',
			esc_url( $connect_url ),
			esc_html( $needs_reconnect ? __( 'Reconnect with Runtype', 'persona-assistant' ) : __( 'Connect with Runtype', 'persona-assistant' ) )
		);
	}

	/**
	 * WordPress built-in AI section.
	 *
	 * @param array<string,mixed> $settings Settings.
	 * @return void
	 */
	private function render_wp_ai_section( $settings ) {
		$opt = esc_attr( PERSONA_ASSISTANT_SETTINGS_OPTION );
		?>
		<h3><?php esc_html_e( 'Configure WordPress AI', 'persona-assistant' ); ?></h3>
		<?php $this->render_wp_ai_readiness(); ?>
		<table class="form-table" role="presentation">
			<tr>
				<th scope="row"><label for="persona-assistant-system-prompt"><?php esc_html_e( 'System prompt', 'persona-assistant' ); ?></label></th>
				<td>
					<textarea id="persona-assistant-system-prompt" class="large-text" rows="4" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_system_prompt]"><?php echo esc_textarea( (string) $settings['wp_ai_system_prompt'] ); ?></textarea>
					<p class="description"><?php esc_html_e( 'Prepended to each conversation when the widget is powered by your built-in AI.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Visitor access', 'persona-assistant' ); ?></th>
				<td>
					<?php $access = (string) $settings['wp_ai_access']; ?>
					<label>
						<input type="checkbox" id="persona-assistant-wp-ai-login" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_access]" value="logged_in" <?php checked( 'logged_in', $access ); ?> />
						<?php esc_html_e( 'Require visitors to be logged in to chat', 'persona-assistant' ); ?>
					</label>
					<div class="notice notice-warning inline persona-assistant-cost-warning" data-access="public"><p><?php esc_html_e( 'Public chat can create provider usage and cost. A per-visitor rate limit is still applied server-side.', 'persona-assistant' ); ?></p></div>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Advanced', 'persona-assistant' ); ?></th>
				<td>
					<details class="persona-assistant-details">
						<summary><?php esc_html_e( 'Model', 'persona-assistant' ); ?></summary>
						<p><label for="persona-assistant-wp-ai-model"><?php esc_html_e( 'Model (optional)', 'persona-assistant' ); ?></label></p>
						<?php
						$current = (string) $settings['wp_ai_model'];
						$groups  = Persona_Assistant_AI::list_models();
						if ( array() !== $groups ) :
							// The saved model may come from a provider that is no longer
							// connected, so keep it selectable and saving will not drop it.
							$known = array();
							foreach ( $groups as $models ) {
								$known = array_merge( $known, array_keys( $models ) );
							}
							?>
							<select id="persona-assistant-wp-ai-model" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_model]">
								<option value=""><?php esc_html_e( 'Provider default', 'persona-assistant' ); ?></option>
								<?php if ( '' !== $current && ! in_array( $current, $known, true ) ) : ?>
									<option value="<?php echo esc_attr( $current ); ?>" selected>
										<?php
										/* translators: %s: model id saved in settings. */
										echo esc_html( sprintf( __( '%s (saved)', 'persona-assistant' ), $current ) );
										?>
									</option>
								<?php endif; ?>
								<?php foreach ( $groups as $provider_label => $models ) : ?>
									<optgroup label="<?php echo esc_attr( $provider_label ); ?>">
										<?php foreach ( $models as $model_id => $model_name ) : ?>
											<option value="<?php echo esc_attr( $model_id ); ?>" <?php selected( $current, $model_id ); ?>><?php echo esc_html( $model_name ); ?></option>
										<?php endforeach; ?>
									</optgroup>
								<?php endforeach; ?>
							</select>
							<p class="description"><?php esc_html_e( 'Models offered by your connected AI providers. Choose "Provider default" to let the AI provider pick.', 'persona-assistant' ); ?></p>
						<?php else : ?>
							<input type="text" id="persona-assistant-wp-ai-model" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_model]" value="<?php echo esc_attr( $current ); ?>" />
							<p class="description"><?php esc_html_e( 'Leave blank to use your AI provider\'s default model. (Connect an AI provider to pick from a list.)', 'persona-assistant' ); ?></p>
						<?php endif; ?>
					</details>
				</td>
			</tr>
		</table>
		<?php
	}

	/**
	 * One-time identity backfill for sites that connected OAuth before the
	 * profile fetch existed: their state has only the opaque user id, so fetch
	 * the organization name once on a settings-page view. The transient stops
	 * a failing API from being retried on every page load.
	 *
	 * @return void
	 */
	private function maybe_backfill_oauth_identity() {
		$state = persona_assistant_get_state();
		if ( empty( $state['oauth_access_token'] ) || ! empty( $state['oauth_org_name'] ) ) {
			return;
		}
		if ( get_transient( 'persona_assistant_profile_backfill' ) ) {
			return;
		}
		set_transient( 'persona_assistant_profile_backfill', 1, HOUR_IN_SECONDS );

		$credential = Persona_Assistant_Credential::oauth_credential();
		if ( is_wp_error( $credential ) ) {
			return;
		}
		$runtype = new Persona_Assistant_Runtype();
		$profile = $runtype->get_profile( $credential );
		if ( is_wp_error( $profile ) || '' === $profile['org_name'] ) {
			return;
		}
		persona_assistant_merge_state(
			array(
				'oauth_org_id'   => $profile['org_id'],
				'oauth_org_name' => $profile['org_name'],
			)
		);
	}

	/**
	 * Readiness banner for the WordPress AI section.
	 *
	 * Three states: a provider is connected and ready; the AI stack exists but
	 * no provider is connected yet (deep-link to the screen where that
	 * happens); or this WordPress has no built-in AI at all (point at the
	 * upgrade / plugin-install paths). The plugin never collects provider
	 * credentials itself; it routes the user to the WordPress-native screen.
	 *
	 * @return void
	 */
	private function render_wp_ai_readiness() {
		$ai     = Persona_Assistant_AI::describe();
		$screen = Persona_Assistant_AI::settings_screen();

		if ( $ai['available'] ) {
			?>
			<div class="notice notice-success inline persona-assistant-wp-ai-readiness">
				<p>
					<?php
					/* translators: %s: AI backend name (e.g. "WordPress AI Client"). */
					echo esc_html( sprintf( __( 'WordPress AI is ready, using the %s.', 'persona-assistant' ), $ai['backend'] ) );
					if ( '' !== $screen['url'] ) {
						echo ' <a href="' . esc_url( $screen['url'] ) . '">' . esc_html__( 'Manage AI providers', 'persona-assistant' ) . '</a>';
					}
					?>
				</p>
			</div>
			<?php
			return;
		}

		if ( '' !== $ai['backend'] ) {
			?>
			<div class="notice notice-warning inline persona-assistant-wp-ai-readiness">
				<p>
					<?php
					/* translators: %s: AI backend name (e.g. "WordPress AI Client"). */
					echo esc_html( sprintf( __( 'The %s is installed, but no AI provider is connected yet. Chat cannot answer until one is.', 'persona-assistant' ), $ai['backend'] ) );
					?>
				</p>
				<?php if ( '' !== $screen['url'] ) : ?>
					<p><a class="button button-primary" href="<?php echo esc_url( $screen['url'] ); ?>"><?php echo esc_html( $screen['label'] ); ?></a></p>
				<?php else : ?>
					<p><?php esc_html_e( 'Connect a provider in your WordPress AI settings, then return here.', 'persona-assistant' ); ?></p>
				<?php endif; ?>
			</div>
			<?php
			return;
		}

		?>
		<div class="notice notice-warning inline persona-assistant-wp-ai-readiness">
			<p><?php esc_html_e( 'This WordPress site does not include a built-in AI yet. To use this option, either:', 'persona-assistant' ); ?></p>
			<ul class="persona-assistant-wp-ai-options">
				<?php if ( version_compare( get_bloginfo( 'version' ), '7.0', '<' ) ) : ?>
					<li>
						<?php esc_html_e( 'Update to WordPress 7.0 or newer, which includes the AI Client and a Settings → Connectors screen.', 'persona-assistant' ); ?>
						<?php if ( current_user_can( 'update_core' ) ) : ?>
							<a href="<?php echo esc_url( admin_url( 'update-core.php' ) ); ?>"><?php esc_html_e( 'Check for updates', 'persona-assistant' ); ?></a>
						<?php endif; ?>
					</li>
				<?php endif; ?>
				<li>
					<?php esc_html_e( 'Install the free AI Services plugin and connect a provider there.', 'persona-assistant' ); ?>
					<?php if ( current_user_can( 'install_plugins' ) ) : ?>
						<a href="<?php echo esc_url( admin_url( 'plugin-install.php?s=AI%20Services&tab=search&type=term' ) ); ?>"><?php esc_html_e( 'Find the plugin', 'persona-assistant' ); ?></a>
					<?php endif; ?>
				</li>
			</ul>
			<p><?php esc_html_e( 'Or choose Runtype above, which needs no local AI.', 'persona-assistant' ); ?></p>
		</div>
		<?php
	}

	/**
	 * Appearance section.
	 *
	 * @param array<string,mixed> $settings Settings.
	 * @param string              $section  all|brand|launcher|assistant|advanced.
	 * @return void
	 */
	private function render_appearance_section( $settings, $section = 'all' ) {
		$opt          = esc_attr( PERSONA_ASSISTANT_SETTINGS_OPTION );
		$site_name    = (string) get_bloginfo( 'name' );
		$default_wsub = __( 'Ask anything about your account or products.', 'persona-assistant' );
		$has_preview  = in_array( $section, array( 'all', 'brand', 'launcher', 'assistant' ), true );
		$grid_classes = 'persona-assistant-customize-grid';
		if ( ! $has_preview ) {
			$grid_classes .= ' persona-assistant-customize-grid--single';
		}
		if ( 'assistant' === $section ) {
			$grid_classes .= ' persona-assistant-customize-grid--assistant';
		}
		?>
		<div class="<?php echo esc_attr( $grid_classes ); ?>">
		<div>
		<h3 class="screen-reader-text"><?php esc_html_e( 'Appearance', 'persona-assistant' ); ?></h3>

		<?php if ( in_array( $section, array( 'all', 'assistant' ), true ) ) : ?>
		<h4 class="persona-assistant-subhead"><?php esc_html_e( 'Assistant page', 'persona-assistant' ); ?></h4>
		<p class="description"><?php esc_html_e( 'Choose a starting style for the full-screen Page, then fine-tune its layout. These controls do not change the floating launcher or shortcode.', 'persona-assistant' ); ?></p>
		<div class="persona-assistant-preset-grid">
			<?php
			$presets = array(
				'branded' => array(
					__( 'Branded', 'persona-assistant' ),
					__( 'Your accent color and header, with roomy bubble replies.', 'persona-assistant' ),
				),
				'chatgpt' => array(
					__( 'ChatGPT-like', 'persona-assistant' ),
					__( 'Neutral chrome, no header, flat replies, and a pill composer.', 'persona-assistant' ),
				),
			);
			$persona_assistant_selected_preset = persona_assistant_normalize_assistant_preset( (string) $settings['assistant_style_preset'] );
			foreach ( $presets as $value => $copy ) :
				?>
				<label class="persona-assistant-preset">
					<input type="radio" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[assistant_style_preset]" value="<?php echo esc_attr( $value ); ?>" <?php checked( $persona_assistant_selected_preset, $value ); ?> />
					<span>
						<strong><?php echo esc_html( $copy[0] ); ?></strong>
						<small><?php echo esc_html( $copy[1] ); ?></small>
					</span>
				</label>
			<?php endforeach; ?>
		</div>
		<?php if ( 'assistant' === $section ) : ?>
			<?php $this->render_assistant_welcome_section( $settings ); ?>
		<?php endif; ?>

		<details class="persona-assistant-details persona-assistant-page-tuning" <?php echo 'assistant' === $section ? '' : 'open'; ?>>
			<summary><?php echo esc_html( 'assistant' === $section ? __( 'Additional design settings', 'persona-assistant' ) : __( 'Fine-tune assistant page', 'persona-assistant' ) ); ?></summary>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e( 'Conversation width', 'persona-assistant' ); ?></th>
					<td>
						<?php
						$this->segmented(
							'assistant_content_width',
							array(
								'narrow'   => __( 'Narrow', 'persona-assistant' ),
								'standard' => __( 'Standard', 'persona-assistant' ),
								'wide'     => __( 'Wide', 'persona-assistant' ),
							),
							(string) $settings['assistant_content_width']
						);
						?>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Header', 'persona-assistant' ); ?></th>
					<td>
						<?php
						$this->segmented(
							'assistant_header_style',
							array(
								'branded' => __( 'Branded', 'persona-assistant' ),
								'minimal' => __( 'Minimal', 'persona-assistant' ),
								'hidden'  => __( 'Hidden', 'persona-assistant' ),
							),
							(string) $settings['assistant_header_style']
						);
						?>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Messages', 'persona-assistant' ); ?></th>
					<td>
						<?php
						$this->segmented(
							'assistant_message_style',
							array(
								'bubble'  => __( 'Bubbles', 'persona-assistant' ),
								'flat'    => __( 'Flat', 'persona-assistant' ),
								'minimal' => __( 'Minimal', 'persona-assistant' ),
							),
							(string) $settings['assistant_message_style']
						);
						?>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Composer', 'persona-assistant' ); ?></th>
					<td>
						<?php
						$this->segmented(
							'assistant_composer_style',
							array(
								'default' => __( 'Persona default', 'persona-assistant' ),
								'pill'    => __( 'Floating pill', 'persona-assistant' ),
							),
							(string) $settings['assistant_composer_style']
						);
						?>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Visible elements', 'persona-assistant' ); ?></th>
					<td class="persona-assistant-checkbox-stack">
						<label><input type="checkbox" id="persona-assistant-page-show-welcome" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[assistant_show_welcome]" value="1" <?php checked( ! empty( $settings['assistant_show_welcome'] ) ); ?> /> <?php esc_html_e( 'Welcome message', 'persona-assistant' ); ?></label>
						<label><input type="checkbox" id="persona-assistant-page-show-avatars" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[assistant_show_avatars]" value="1" <?php checked( ! empty( $settings['assistant_show_avatars'] ) ); ?> /> <?php esc_html_e( 'Message avatars', 'persona-assistant' ); ?></label>
						<label><input type="checkbox" id="persona-assistant-page-show-timestamps" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[assistant_show_timestamps]" value="1" <?php checked( ! empty( $settings['assistant_show_timestamps'] ) ); ?> /> <?php esc_html_e( 'Message timestamps', 'persona-assistant' ); ?></label>
						<label><input type="checkbox" id="persona-assistant-page-show-clear-chat" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[assistant_show_clear_chat]" value="1" <?php checked( ! empty( $settings['assistant_show_clear_chat'] ) ); ?> /> <?php esc_html_e( 'New chat / clear control', 'persona-assistant' ); ?></label>
						<label><input type="checkbox" id="persona-assistant-page-attachments" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[assistant_attachments]" value="1" <?php checked( ! empty( $settings['assistant_attachments'] ) ); ?> /> <?php esc_html_e( 'File attachment button', 'persona-assistant' ); ?></label>
						<label><input type="checkbox" id="persona-assistant-page-voice" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[assistant_voice]" value="1" <?php checked( ! empty( $settings['assistant_voice'] ) ); ?> /> <?php esc_html_e( 'Voice input button', 'persona-assistant' ); ?></label>
						<p class="description"><?php esc_html_e( 'Attachments and voice also require support from the selected assistant and visitor\'s browser.', 'persona-assistant' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="persona-assistant-page-disclaimer"><?php esc_html_e( 'AI disclaimer', 'persona-assistant' ); ?></label></th>
					<td>
						<input type="text" id="persona-assistant-page-disclaimer" class="large-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[assistant_disclaimer]" value="<?php echo esc_attr( (string) $settings['assistant_disclaimer'] ); ?>" placeholder="<?php echo esc_attr__( 'AI can make mistakes. Check important information.', 'persona-assistant' ); ?>" />
					</td>
				</tr>
			</table>
		</details>
		<?php endif; ?>

		<?php if ( in_array( $section, array( 'all', 'brand', 'launcher' ), true ) ) : ?>
		<h4 class="persona-assistant-subhead"><?php echo esc_html( 'launcher' === $section ? __( 'Launcher appearance', 'persona-assistant' ) : __( 'Brand', 'persona-assistant' ) ); ?></h4>
		<table class="form-table" role="presentation">
			<?php if ( in_array( $section, array( 'all', 'brand' ), true ) ) : ?>
			<tr>
				<th scope="row"><label for="persona-assistant-theme-color"><?php esc_html_e( 'Accent color', 'persona-assistant' ); ?></label></th>
				<td>
					<input type="color" id="persona-assistant-theme-color" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[theme_color]" value="<?php echo esc_attr( (string) $settings['theme_color'] ); ?>" />
					<code id="persona-assistant-color-value"><?php echo esc_html( (string) $settings['theme_color'] ); ?></code>
					<button type="button" class="button-link" id="persona-assistant-color-reset" data-color="#4f46e5"><?php esc_html_e( 'Reset', 'persona-assistant' ); ?></button>
					<p id="persona-assistant-color-contrast" class="description" role="status" aria-live="polite"></p>
					</td>
				</tr>
				<tr>
				<th scope="row"><?php esc_html_e( 'Theme mode', 'persona-assistant' ); ?></th>
				<td>
					<?php
					$this->segmented(
						'theme_mode',
						array(
							'light' => __( 'Light', 'persona-assistant' ),
							'dark'  => __( 'Dark', 'persona-assistant' ),
							'auto'  => __( 'Auto', 'persona-assistant' ),
						),
						(string) $settings['theme_mode']
					);
					?>
					<p class="description"><?php esc_html_e( 'Auto follows the visitor\'s system preference.', 'persona-assistant' ); ?></p>
					</td>
					</tr>
					<tr>
					<th scope="row"><?php esc_html_e( 'Corner style', 'persona-assistant' ); ?></th>
				<td>
					<?php
					$this->segmented(
						'corner_style',
						array(
							'rounded' => __( 'Rounded', 'persona-assistant' ),
							'soft'    => __( 'Soft', 'persona-assistant' ),
							'square'  => __( 'Square', 'persona-assistant' ),
						),
						(string) $settings['corner_style']
					);
					?>
				</td>
				</tr>
				<?php endif; ?>
				<?php if ( in_array( $section, array( 'all', 'launcher' ), true ) ) : ?>
				<tr>
				<th scope="row"><label for="persona-assistant-chat-icon"><?php esc_html_e( 'Chat icon', 'persona-assistant' ); ?></label></th>
				<td>
					<?php
					// Progressive enhancement: the raw value field renders as plain
					// text; admin.js swaps it for a swatch + summary + Change/Clear
					// backed by a tabbed picker modal (the `hidden` bits below).
					?>
					<span class="persona-assistant-icon-field" id="persona-assistant-icon-field">
						<span class="persona-assistant-icon-swatch" id="persona-assistant-icon-swatch" hidden></span>
						<input type="text" id="persona-assistant-chat-icon" class="regular-text persona-assistant-icon-raw" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[chat_icon]" value="<?php echo esc_attr( (string) $settings['chat_icon'] ); ?>" placeholder="🤖" />
						<button type="button" class="button" id="persona-assistant-icon-picker-button" hidden><?php esc_html_e( 'Change', 'persona-assistant' ); ?></button>
						<button type="button" class="button-link persona-assistant-icon-clear" id="persona-assistant-icon-clear" hidden><?php esc_html_e( 'Clear', 'persona-assistant' ); ?></button>
					</span>
					<p class="description"><?php esc_html_e( 'Shown in the chat header and launcher. Leave unset to use your Site Icon, or the widget default if none is set.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Launcher position', 'persona-assistant' ); ?></th>
				<td>
					<?php
					$this->segmented(
						'launcher_position',
						array(
							'bottom-right' => __( 'Bottom right', 'persona-assistant' ),
							'bottom-left'  => __( 'Bottom left', 'persona-assistant' ),
						),
						(string) $settings['launcher_position']
					);
					?>
					</td>
				</tr>
			<tr>
				<th scope="row"><label for="persona-assistant-launcher-teaser"><?php esc_html_e( 'Teaser message', 'persona-assistant' ); ?></label></th>
				<td>
					<input type="text" id="persona-assistant-launcher-teaser" class="large-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[launcher_teaser_text]" value="<?php echo esc_attr( (string) $settings['launcher_teaser_text'] ); ?>" placeholder="<?php echo esc_attr__( 'Questions about pricing?', 'persona-assistant' ); ?>" />
					<p class="description"><?php esc_html_e( 'Optional proactive message above the collapsed launcher. Clicking it opens chat.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Teaser behavior', 'persona-assistant' ); ?></th>
				<td>
					<p>
						<label for="persona-assistant-launcher-teaser-delay"><?php esc_html_e( 'Show after', 'persona-assistant' ); ?></label>
						<input type="number" id="persona-assistant-launcher-teaser-delay" class="small-text" min="0" max="60" step="1" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[launcher_teaser_delay]" value="<?php echo esc_attr( (string) absint( $settings['launcher_teaser_delay'] ) ); ?>" />
						<?php esc_html_e( 'seconds', 'persona-assistant' ); ?>
					</p>
					<?php
					$this->segmented(
						'launcher_teaser_frequency',
						array(
							'once'   => __( 'Once per visitor', 'persona-assistant' ),
							'always' => __( 'Every page load', 'persona-assistant' ),
						),
						(string) $settings['launcher_teaser_frequency']
					);
					?>
					<p><label><input type="checkbox" id="persona-assistant-launcher-teaser-dismissible" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[launcher_teaser_dismissible]" value="1" <?php checked( ! empty( $settings['launcher_teaser_dismissible'] ) ); ?> /> <?php esc_html_e( 'Let visitors dismiss the message without opening chat', 'persona-assistant' ); ?></label></p>
					<p class="description"><?php esc_html_e( '"Once per visitor" remembers dismissal in that browser. Use "Every page load" sparingly.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Attachments', 'persona-assistant' ); ?></th>
				<td>
					<label><input type="checkbox" id="persona-assistant-launcher-attachments" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[launcher_attachments]" value="1" <?php checked( ! empty( $settings['launcher_attachments'] ) ); ?> /> <?php esc_html_e( 'Let visitors attach files in launcher and embedded chats', 'persona-assistant' ); ?></label>
					<p class="description"><?php esc_html_e( 'Accepted types and size limits are configured in Advanced.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<?php endif; ?>
		</table>
		<?php endif; ?>

		<?php if ( in_array( $section, array( 'all', 'brand' ), true ) ) : ?>
		<h4 class="persona-assistant-subhead"><?php esc_html_e( 'Copy', 'persona-assistant' ); ?></h4>
		<table class="form-table" role="presentation">
			<tr>
				<th scope="row"><label for="persona-assistant-header-title"><?php esc_html_e( 'Header title', 'persona-assistant' ); ?></label></th>
				<td><input type="text" id="persona-assistant-header-title" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[header_title]" value="<?php echo esc_attr( (string) $settings['header_title'] ); ?>" placeholder="<?php echo esc_attr( $site_name ); ?>" /></td>
			</tr>
			<tr>
				<th scope="row"><label for="persona-assistant-header-subtitle"><?php esc_html_e( 'Header subtitle', 'persona-assistant' ); ?></label></th>
				<td><input type="text" id="persona-assistant-header-subtitle" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[header_subtitle]" value="<?php echo esc_attr( (string) $settings['header_subtitle'] ); ?>" placeholder="<?php echo esc_attr__( 'Here to help you get answers fast', 'persona-assistant' ); ?>" /></td>
			</tr>
			<tr>
				<th scope="row"><label for="persona-assistant-welcome-title"><?php esc_html_e( 'Welcome title', 'persona-assistant' ); ?></label></th>
				<td><input type="text" id="persona-assistant-welcome-title" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[welcome_title]" value="<?php echo esc_attr( (string) $settings['welcome_title'] ); ?>" placeholder="<?php echo esc_attr__( 'Hello 👋', 'persona-assistant' ); ?>" /></td>
			</tr>
			<tr>
				<th scope="row"><label for="persona-assistant-welcome-subtitle"><?php esc_html_e( 'Welcome subtitle', 'persona-assistant' ); ?></label></th>
				<td><input type="text" id="persona-assistant-welcome-subtitle" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[welcome_subtitle]" value="<?php echo esc_attr( (string) $settings['welcome_subtitle'] ); ?>" placeholder="<?php echo esc_attr( $default_wsub ); ?>" /></td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Welcome layout', 'persona-assistant' ); ?></th>
				<td>
					<?php
					$this->segmented(
						'welcome_variant',
						array(
							'card' => __( 'Card', 'persona-assistant' ),
							'hero' => __( 'Centered hero', 'persona-assistant' ),
							'none' => __( 'Hidden', 'persona-assistant' ),
						),
						(string) $settings['welcome_variant']
					);
					?>
					<p><label><input type="checkbox" id="persona-assistant-welcome-show-icon" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[welcome_show_icon]" value="1" <?php checked( ! empty( $settings['welcome_show_icon'] ) ); ?> /> <?php esc_html_e( 'Show the chat icon above the welcome title', 'persona-assistant' ); ?></label></p>
					<p class="description"><?php esc_html_e( 'The centered hero dismisses after the first message. Card can remain visible or dismiss using the option below.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Welcome dismissal', 'persona-assistant' ); ?></th>
				<td>
					<?php
					$this->segmented(
						'welcome_dismiss',
						array(
							'never'            => __( 'Keep visible', 'persona-assistant' ),
							'on-first-message' => __( 'After first message', 'persona-assistant' ),
						),
						(string) $settings['welcome_dismiss']
					);
					?>
				</td>
			</tr>
			<tr>
				<th scope="row"><label for="persona-assistant-welcome-message"><?php esc_html_e( 'Greeting bubble', 'persona-assistant' ); ?></label></th>
				<td>
					<input type="text" id="persona-assistant-welcome-message" class="large-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[welcome_message]" value="<?php echo esc_attr( (string) $settings['welcome_message'] ); ?>" placeholder="<?php echo esc_attr__( 'Hi! What can I help you with today?', 'persona-assistant' ); ?>" />
					<p class="description"><?php esc_html_e( 'Optional display-only assistant message. It is never sent to the model or saved in conversation history, and is ignored by the centered hero.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row"><label for="persona-assistant-input-placeholder"><?php esc_html_e( 'Input placeholder', 'persona-assistant' ); ?></label></th>
				<td><input type="text" id="persona-assistant-input-placeholder" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[input_placeholder]" value="<?php echo esc_attr( (string) $settings['input_placeholder'] ); ?>" placeholder="<?php echo esc_attr__( 'How can I help...', 'persona-assistant' ); ?>" /></td>
			</tr>
			<tr>
				<th scope="row"><label for="persona-assistant-suggested-prompts"><?php esc_html_e( 'Suggested prompts', 'persona-assistant' ); ?></label></th>
				<td>
					<textarea id="persona-assistant-suggested-prompts" class="large-text" rows="4" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[suggested_prompts]"><?php echo esc_textarea( (string) $settings['suggested_prompts'] ); ?></textarea>
					<p class="description"><?php esc_html_e( 'One prompt per line. These become starter actions before the visitor\'s first message. Leave blank for none.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Suggestion display', 'persona-assistant' ); ?></th>
				<td>
					<details class="persona-assistant-details">
						<summary><?php esc_html_e( 'Style and behavior', 'persona-assistant' ); ?></summary>
						<p><strong><?php esc_html_e( 'Style', 'persona-assistant' ); ?></strong></p>
						<?php
						$this->segmented(
							'suggestion_variant',
							array(
								'card' => __( 'Cards', 'persona-assistant' ),
								'chip' => __( 'Chips', 'persona-assistant' ),
								'list' => __( 'List', 'persona-assistant' ),
							),
							(string) $settings['suggestion_variant']
						);
						?>
						<p><strong><?php esc_html_e( 'Placement', 'persona-assistant' ); ?></strong></p>
						<?php
						$this->segmented(
							'suggestion_placement',
							array(
								'auto'     => __( 'Automatic', 'persona-assistant' ),
								'welcome'  => __( 'Welcome', 'persona-assistant' ),
								'composer' => __( 'Above input', 'persona-assistant' ),
							),
							(string) $settings['suggestion_placement']
						);
						?>
						<p><strong><?php esc_html_e( 'On click', 'persona-assistant' ); ?></strong></p>
						<?php
						$this->segmented(
							'suggestion_behavior',
							array(
								'send' => __( 'Send immediately', 'persona-assistant' ),
								'fill' => __( 'Fill the input', 'persona-assistant' ),
							),
							(string) $settings['suggestion_behavior']
						);
						?>
						<p>
							<label for="persona-assistant-suggestion-max"><?php esc_html_e( 'Maximum items', 'persona-assistant' ); ?></label>
							<input type="number" id="persona-assistant-suggestion-max" class="small-text" min="1" max="8" step="1" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[suggestion_max_items]" value="<?php echo esc_attr( (string) absint( $settings['suggestion_max_items'] ) ); ?>" />
						</p>
						<p><label><input type="radio" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[suggestion_overflow]" value="wrap" <?php checked( (string) $settings['suggestion_overflow'], 'wrap' ); ?> /> <?php esc_html_e( 'Wrap chip rows', 'persona-assistant' ); ?></label> &nbsp; <label><input type="radio" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[suggestion_overflow]" value="scroll" <?php checked( (string) $settings['suggestion_overflow'], 'scroll' ); ?> /> <?php esc_html_e( 'Scroll chip rows', 'persona-assistant' ); ?></label></p>
						<p class="description"><?php esc_html_e( 'Overflow only affects the chip style. Cards and lists manage their own stacking.', 'persona-assistant' ); ?></p>
					</details>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Scrollbars', 'persona-assistant' ); ?></th>
				<td>
					<?php
					$this->segmented(
						'scrollbar_policy',
						array(
							'on-scroll' => __( 'While scrolling', 'persona-assistant' ),
							'auto'      => __( 'Browser default', 'persona-assistant' ),
							'hidden'    => __( 'Hidden', 'persona-assistant' ),
						),
						(string) $settings['scrollbar_policy']
					);
					?>
					<p class="description"><?php esc_html_e( 'Controls the transcript, suggestion strips, and artifact scrollers.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
		</table>
		<?php endif; ?>

		<?php if ( in_array( $section, array( 'all', 'advanced' ), true ) ) : ?>
		<h4 class="persona-assistant-subhead"><?php esc_html_e( 'Advanced Behavior', 'persona-assistant' ); ?></h4>
		<?php
		$runtype_mode = ( 'runtype' === persona_assistant_resolve_mode() );
		$wp_ai_mode   = ( 'wordpress_ai' === persona_assistant_resolve_mode() );
		$abilities    = persona_assistant_readonly_abilities();
		?>
		<table class="form-table" role="presentation">
			<tr>
				<th scope="row"><?php esc_html_e( 'Conversation history', 'persona-assistant' ); ?></th>
				<td>
					<fieldset>
						<legend class="screen-reader-text"><?php esc_html_e( 'Browser history lifetime', 'persona-assistant' ); ?></legend>
						<p><strong><?php esc_html_e( 'On this browser', 'persona-assistant' ); ?></strong></p>
						<?php
						$this->segmented(
							'history_browser_mode',
							array(
								'session' => __( 'This tab session', 'persona-assistant' ),
								'device'  => __( 'This device', 'persona-assistant' ),
								'off'     => __( 'Do not remember', 'persona-assistant' ),
							),
							(string) $settings['history_browser_mode']
						);
						?>
						<p class="description"><?php esc_html_e( 'Persona stores only user and assistant text. Attachments, reasoning, tool activity, artifacts, and execution metadata are removed before browser storage. Runtype also resumes its opaque server session ID for the selected lifetime.', 'persona-assistant' ); ?></p>
					</fieldset>
					<hr />
					<?php if ( $wp_ai_mode ) : ?>
						<label><input type="checkbox" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_account_history]" value="1" <?php checked( ! empty( $settings['wp_ai_account_history'] ) ); ?> /> <?php esc_html_e( 'Let logged-in visitors save Assistant Page conversations to their WordPress account', 'persona-assistant' ); ?></label>
						<p>
							<label for="persona-assistant-history-retention"><?php esc_html_e( 'Delete saved conversations after', 'persona-assistant' ); ?></label>
							<select id="persona-assistant-history-retention" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[history_retention_days]">
								<option value="7" <?php selected( (string) $settings['history_retention_days'], '7' ); ?>><?php esc_html_e( '7 days', 'persona-assistant' ); ?></option>
								<option value="30" <?php selected( (string) $settings['history_retention_days'], '30' ); ?>><?php esc_html_e( '30 days', 'persona-assistant' ); ?></option>
								<option value="90" <?php selected( (string) $settings['history_retention_days'], '90' ); ?>><?php esc_html_e( '90 days', 'persona-assistant' ); ?></option>
								<option value="365" <?php selected( (string) $settings['history_retention_days'], '365' ); ?>><?php esc_html_e( '1 year', 'persona-assistant' ); ?></option>
								<option value="0" <?php selected( (string) $settings['history_retention_days'], '0' ); ?>><?php esc_html_e( 'Only when erased', 'persona-assistant' ); ?></option>
							</select>
						</p>
						<p class="description"><?php esc_html_e( 'Account history is opt-in, text-only, owner-scoped, and available on the full-screen Assistant Page. It participates in WordPress personal-data export and erasure. Anonymous visitors fall back to the browser policy above.', 'persona-assistant' ); ?></p>
					<?php else : ?>
						<input type="hidden" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_account_history]" value="<?php echo ! empty( $settings['wp_ai_account_history'] ) ? '1' : ''; ?>" />
						<input type="hidden" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[history_retention_days]" value="<?php echo esc_attr( (string) $settings['history_retention_days'] ); ?>" />
						<p class="description"><?php esc_html_e( 'Runtype keeps the remote session canonical, so this plugin does not duplicate its transcripts in WordPress. Retention for those sessions is managed in Runtype.', 'persona-assistant' ); ?></p>
					<?php endif; ?>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'AI activity', 'persona-assistant' ); ?></th>
				<td>
					<div>
						<label>
							<input type="checkbox" id="persona-assistant-show-ai-activity" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[show_ai_activity]" value="1" <?php checked( ! empty( $settings['show_ai_activity'] ) ); ?> />
							<?php esc_html_e( 'Show the AI\'s working steps (reasoning and tool activity)', 'persona-assistant' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'Runtype streams activity live. WordPress AI shows provider-returned reasoning and completed Ability calls when the connector supplies them.', 'persona-assistant' ); ?></p>
					</div>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'File policy', 'persona-assistant' ); ?></th>
				<td class="persona-assistant-checkbox-stack">
					<label><input type="checkbox" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[attachment_images]" value="1" <?php checked( ! empty( $settings['attachment_images'] ) ); ?> /> <?php esc_html_e( 'Images (JPEG, PNG, GIF, WebP)', 'persona-assistant' ); ?></label>
					<label><input type="checkbox" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[attachment_documents]" value="1" <?php checked( ! empty( $settings['attachment_documents'] ) ); ?> /> <?php esc_html_e( 'Documents (PDF, text, Markdown, CSV, JSON)', 'persona-assistant' ); ?></label>
					<p><label><?php esc_html_e( 'Maximum files', 'persona-assistant' ); ?> <input type="number" class="small-text" min="1" max="4" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[attachment_max_files]" value="<?php echo esc_attr( (string) absint( $settings['attachment_max_files'] ) ); ?>" /></label> &nbsp; <label><?php esc_html_e( 'Maximum size per file (MB)', 'persona-assistant' ); ?> <input type="number" class="small-text" min="1" max="10" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[attachment_max_size_mb]" value="<?php echo esc_attr( (string) absint( $settings['attachment_max_size_mb'] ) ); ?>" /></label></p>
					<p class="description"><?php esc_html_e( 'The plugin validates type and size before sending files. The selected AI connector may support fewer formats.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<?php if ( $wp_ai_mode ) : ?>
			<tr>
				<th scope="row"><?php esc_html_e( 'WordPress AI tools', 'persona-assistant' ); ?></th>
				<td class="persona-assistant-checkbox-stack">
					<label><input type="checkbox" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_tools_enabled]" value="1" <?php checked( ! empty( $settings['wp_ai_tools_enabled'] ) ); ?> /> <?php esc_html_e( 'Let WordPress AI use selected read-only Abilities', 'persona-assistant' ); ?></label>
					<?php if ( empty( $abilities ) ) : ?>
						<p class="description"><?php esc_html_e( 'No explicitly read-only Abilities are registered on this site.', 'persona-assistant' ); ?></p>
					<?php else : ?>
						<?php foreach ( $abilities as $ability_name => $ability ) : ?>
							<label><input type="checkbox" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_abilities][]" value="<?php echo esc_attr( $ability_name ); ?>" <?php checked( in_array( $ability_name, (array) $settings['wp_ai_abilities'], true ) ); ?> /> <strong><?php echo esc_html( $ability['label'] ); ?></strong> <code><?php echo esc_html( $ability_name ); ?></code><?php if ( '' !== $ability['description'] ) : ?>: <?php echo esc_html( $ability['description'] ); ?><?php endif; ?></label>
						<?php endforeach; ?>
					<?php endif; ?>
					<p class="description"><?php esc_html_e( 'Only Abilities marked read-only and non-destructive can appear here. WordPress permission callbacks still run for every call, and each response is capped at four tool turns.', 'persona-assistant' ); ?></p>
				</td>
			</tr>
			<?php else : ?>
			<tr hidden><td colspan="2">
				<input type="hidden" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_tools_enabled]" value="<?php echo ! empty( $settings['wp_ai_tools_enabled'] ) ? '1' : ''; ?>" />
				<?php foreach ( (array) $settings['wp_ai_abilities'] as $ability_name ) : ?><input type="hidden" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[wp_ai_abilities][]" value="<?php echo esc_attr( $ability_name ); ?>" /><?php endforeach; ?>
			</td></tr>
			<?php endif; ?>
			<tr>
				<th scope="row"><?php esc_html_e( 'Follow-up suggestions', 'persona-assistant' ); ?></th>
				<td class="<?php echo $runtype_mode ? '' : 'persona-assistant-needs-runtype'; ?>">
					<?php if ( ! $runtype_mode ) : ?>
						<input type="hidden" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[followup_suggestions]" value="<?php echo ! empty( $settings['followup_suggestions'] ) ? '1' : ''; ?>" />
						<p class="description persona-assistant-requires-note"><?php esc_html_e( 'Automatic follow-up suggestions require Runtype\'s streaming tool protocol.', 'persona-assistant' ); ?></p>
					<?php endif; ?>
					<div class="persona-assistant-gated-setting">
						<label>
							<input type="checkbox" id="persona-assistant-followup-suggestions" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[followup_suggestions]" value="1" <?php checked( ! empty( $settings['followup_suggestions'] ) ); ?> <?php disabled( ! $runtype_mode ); ?> />
							<?php esc_html_e( 'Ask the assistant to suggest useful next questions after each answer', 'persona-assistant' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'Persona advertises its built-in suggest_replies tool to the selected Runtype agent. Do not also declare a server-side tool with the same purpose.', 'persona-assistant' ); ?></p>
					</div>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Page tools (WebMCP)', 'persona-assistant' ); ?></th>
				<td class="<?php echo $runtype_mode ? '' : 'persona-assistant-needs-runtype'; ?>">
					<?php if ( ! $runtype_mode ) : ?>
						<?php // Disabled checkboxes don't submit; carry the stored values so an unrelated save can't wipe them. ?>
						<input type="hidden" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[webmcp_enabled]" value="<?php echo ! empty( $settings['webmcp_enabled'] ) ? '1' : ''; ?>" />
						<input type="hidden" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[webmcp_abilities]" value="<?php echo ! empty( $settings['webmcp_abilities'] ) ? '1' : ''; ?>" />
						<p class="description persona-assistant-requires-note"><?php esc_html_e( 'Page tools require Runtype. Connect with Runtype in the Connection workspace to enable them.', 'persona-assistant' ); ?></p>
					<?php endif; ?>
					<div class="persona-assistant-gated-setting">
						<label>
							<input type="checkbox" id="persona-assistant-webmcp-enabled" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[webmcp_enabled]" value="1" <?php checked( ! empty( $settings['webmcp_enabled'] ) ); ?> <?php disabled( ! $runtype_mode ); ?> />
							<?php esc_html_e( 'Let the assistant call tools on your site (search, content lookup, the current page)', 'persona-assistant' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'Each tool call shows the visitor an approval prompt before it runs. You must also enable WebMCP on the chat surface in your Runtype dashboard (Surface → WebMCP), or Runtype rejects the tools.', 'persona-assistant' ); ?></p>
					</div>
					<div class="persona-assistant-gated-setting">
						<label>
							<input type="checkbox" id="persona-assistant-webmcp-abilities" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[webmcp_abilities]" value="1" <?php checked( ! empty( $settings['webmcp_abilities'] ) ); ?> <?php disabled( ! $runtype_mode ); ?> />
							<?php esc_html_e( 'Automatically expose Abilities API tools', 'persona-assistant' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'When page tools are on, every ability registered on this site (WordPress 6.9+) that the visitor is allowed to use also becomes a tool. Turn this off to expose only the built-in read-only tools.', 'persona-assistant' ); ?></p>
					</div>
				</td>
			</tr>
		</table>
		<details class="persona-assistant-details persona-assistant-diagnostics">
			<summary><?php esc_html_e( 'System report', 'persona-assistant' ); ?></summary>
			<p class="description"><?php esc_html_e( 'Copy this secret-free report when asking for help.', 'persona-assistant' ); ?></p>
			<textarea id="persona-assistant-diagnostics-report" class="large-text code" rows="10" readonly><?php echo esc_textarea( persona_assistant_diagnostics_report() ); ?></textarea>
			<p><button type="button" class="button" id="persona-assistant-copy-diagnostics"><?php esc_html_e( 'Copy system report', 'persona-assistant' ); ?></button> <span id="persona-assistant-copy-diagnostics-status" role="status" aria-live="polite"></span></p>
		</details>
		<?php endif; ?>
		</div>
		<?php if ( $has_preview ) : ?>
		<div class="persona-assistant-preview-panel" id="persona-assistant-preview">
			<h3><?php echo esc_html( 'assistant' === $section ? __( 'Assistant Page preview', 'persona-assistant' ) : __( 'Chat preview', 'persona-assistant' ) ); ?></h3>
			<p class="description"><?php echo esc_html( 'assistant' === $section ? __( 'Page layout changes preview here instantly.', 'persona-assistant' ) : __( 'Shared appearance changes preview here instantly.', 'persona-assistant' ) ); ?></p>
			<p class="description persona-assistant-preview-note" id="persona-assistant-preview-note" hidden><?php esc_html_e( 'Previewing unsaved changes. Save to keep them.', 'persona-assistant' ); ?></p>
			<?php if ( 'assistant' === $section ) : ?>
				<iframe
					id="persona-assistant-preview-frame"
					class="persona-assistant-preview-iframe"
					src="<?php echo esc_url( $this->fullscreen_preview_url() ); ?>"
					title="<?php esc_attr_e( 'Assistant Page preview', 'persona-assistant' ); ?>"
					allow="microphone"
				></iframe>
			<?php else : ?>
				<div id="persona-assistant-preview-root" class="persona-assistant-preview-root"></div>
			<?php endif; ?>
			<?php if ( 'disabled' === persona_assistant_resolve_mode() ) : ?>
				<p class="description"><?php esc_html_e( 'Connect an AI and save to enable live testing.', 'persona-assistant' ); ?></p>
			<?php endif; ?>
		</div>
		<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Welcome-screen controls shown in the Assistant Page workspace.
	 *
	 * Copy stays shared with launcher and embedded chat so sites have one voice.
	 * Layout and starter-prompt presentation can inherit those shared settings or
	 * be overridden for the roomier full-screen surface.
	 *
	 * @param array<string,mixed> $settings Settings.
	 * @return void
	 */
	private function render_assistant_welcome_section( $settings ) {
		$opt          = esc_attr( PERSONA_ASSISTANT_SETTINGS_OPTION );
		$default_wsub = __( 'Ask anything about your account or products.', 'persona-assistant' );
		?>
		<details class="persona-assistant-details persona-assistant-page-tuning persona-assistant-page-welcome">
			<summary>
				<?php esc_html_e( 'Welcome screen', 'persona-assistant' ); ?>
				<span class="persona-assistant-badge persona-assistant-badge--info"><?php esc_html_e( 'Shared content', 'persona-assistant' ); ?></span>
			</summary>
			<p class="description persona-assistant-page-welcome-intro">
				<?php esc_html_e( 'Title, greeting, icon, placeholder, and starter prompts are shared with the launcher and embedded chat. Layout and prompt presentation below affect only the Assistant Page.', 'persona-assistant' ); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="persona-assistant-welcome-title"><?php esc_html_e( 'Welcome title', 'persona-assistant' ); ?></label></th>
					<td><input type="text" id="persona-assistant-welcome-title" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[welcome_title]" value="<?php echo esc_attr( (string) $settings['welcome_title'] ); ?>" placeholder="<?php echo esc_attr__( 'Hello 👋', 'persona-assistant' ); ?>" /></td>
				</tr>
				<tr>
					<th scope="row"><label for="persona-assistant-welcome-subtitle"><?php esc_html_e( 'Welcome subtitle', 'persona-assistant' ); ?></label></th>
					<td><input type="text" id="persona-assistant-welcome-subtitle" class="large-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[welcome_subtitle]" value="<?php echo esc_attr( (string) $settings['welcome_subtitle'] ); ?>" placeholder="<?php echo esc_attr( $default_wsub ); ?>" /></td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Assistant layout', 'persona-assistant' ); ?></th>
					<td>
						<?php
						$this->segmented(
							'assistant_welcome_variant',
							array(
								'inherit' => __( 'Use shared', 'persona-assistant' ),
								'card'    => __( 'Card', 'persona-assistant' ),
								'hero'    => __( 'Centered hero', 'persona-assistant' ),
								'none'    => __( 'Hidden', 'persona-assistant' ),
							),
							(string) $settings['assistant_welcome_variant']
						);
						?>
						<p class="description"><?php esc_html_e( 'Use shared follows the Welcome layout configured in Brand & Copy.', 'persona-assistant' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="persona-assistant-chat-icon"><?php esc_html_e( 'Welcome icon', 'persona-assistant' ); ?></label></th>
					<td>
						<span class="persona-assistant-icon-field" id="persona-assistant-icon-field">
							<span class="persona-assistant-icon-swatch" id="persona-assistant-icon-swatch" hidden></span>
							<input type="text" id="persona-assistant-chat-icon" class="regular-text persona-assistant-icon-raw" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[chat_icon]" value="<?php echo esc_attr( (string) $settings['chat_icon'] ); ?>" placeholder="🤖" />
							<button type="button" class="button" id="persona-assistant-icon-picker-button" hidden><?php esc_html_e( 'Change', 'persona-assistant' ); ?></button>
							<button type="button" class="button-link persona-assistant-icon-clear" id="persona-assistant-icon-clear" hidden><?php esc_html_e( 'Clear', 'persona-assistant' ); ?></button>
						</span>
						<p><label><input type="checkbox" id="persona-assistant-welcome-show-icon" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[welcome_show_icon]" value="1" <?php checked( ! empty( $settings['welcome_show_icon'] ) ); ?> /> <?php esc_html_e( 'Show this icon above the welcome title', 'persona-assistant' ); ?></label></p>
						<p class="description"><?php esc_html_e( 'This icon is shared with the launcher and chat header. Leave it unset to use your Site Icon, or the widget default if none is set.', 'persona-assistant' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Welcome dismissal', 'persona-assistant' ); ?></th>
					<td>
						<?php
						$this->segmented(
							'assistant_welcome_dismiss',
							array(
								'inherit'          => __( 'Use shared', 'persona-assistant' ),
								'never'            => __( 'Keep visible', 'persona-assistant' ),
								'on-first-message' => __( 'After first message', 'persona-assistant' ),
							),
							(string) $settings['assistant_welcome_dismiss']
						);
						?>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="persona-assistant-welcome-message"><?php esc_html_e( 'Greeting bubble', 'persona-assistant' ); ?></label></th>
					<td>
						<input type="text" id="persona-assistant-welcome-message" class="large-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[welcome_message]" value="<?php echo esc_attr( (string) $settings['welcome_message'] ); ?>" placeholder="<?php echo esc_attr__( 'Hi! What can I help you with today?', 'persona-assistant' ); ?>" />
						<p class="description"><?php esc_html_e( 'Display-only assistant message; it is never sent to the model and is ignored by the centered hero.', 'persona-assistant' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="persona-assistant-input-placeholder"><?php esc_html_e( 'Input placeholder', 'persona-assistant' ); ?></label></th>
					<td><input type="text" id="persona-assistant-input-placeholder" class="regular-text" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[input_placeholder]" value="<?php echo esc_attr( (string) $settings['input_placeholder'] ); ?>" placeholder="<?php echo esc_attr__( 'How can I help...', 'persona-assistant' ); ?>" /></td>
				</tr>
				<tr>
					<th scope="row"><label for="persona-assistant-suggested-prompts"><?php esc_html_e( 'Suggested prompts', 'persona-assistant' ); ?></label></th>
					<td>
						<textarea id="persona-assistant-suggested-prompts" class="large-text" rows="4" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[suggested_prompts]"><?php echo esc_textarea( (string) $settings['suggested_prompts'] ); ?></textarea>
						<p class="description"><?php esc_html_e( 'One prompt per line. These starter actions are shared across chat surfaces.', 'persona-assistant' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Prompt presentation', 'persona-assistant' ); ?></th>
					<td>
						<p><strong><?php esc_html_e( 'Style', 'persona-assistant' ); ?></strong></p>
						<?php
						$this->segmented(
							'assistant_suggestion_variant',
							array(
								'inherit' => __( 'Use shared', 'persona-assistant' ),
								'card'    => __( 'Cards', 'persona-assistant' ),
								'chip'    => __( 'Chips', 'persona-assistant' ),
								'list'    => __( 'List', 'persona-assistant' ),
							),
							(string) $settings['assistant_suggestion_variant']
						);
						?>
						<p><strong><?php esc_html_e( 'Placement', 'persona-assistant' ); ?></strong></p>
						<?php
						$this->segmented(
							'assistant_suggestion_placement',
							array(
								'inherit'  => __( 'Use shared', 'persona-assistant' ),
								'auto'     => __( 'Automatic', 'persona-assistant' ),
								'welcome'  => __( 'Welcome', 'persona-assistant' ),
								'composer' => __( 'Above input', 'persona-assistant' ),
							),
							(string) $settings['assistant_suggestion_placement']
						);
						?>
						<p><strong><?php esc_html_e( 'On click', 'persona-assistant' ); ?></strong></p>
						<?php
						$this->segmented(
							'assistant_suggestion_behavior',
							array(
								'inherit' => __( 'Use shared', 'persona-assistant' ),
								'send'    => __( 'Send immediately', 'persona-assistant' ),
								'fill'    => __( 'Fill the input', 'persona-assistant' ),
							),
							(string) $settings['assistant_suggestion_behavior']
						);
						?>
						<p>
							<label for="persona-assistant-page-suggestion-max"><?php esc_html_e( 'Maximum items', 'persona-assistant' ); ?></label>
							<input type="number" id="persona-assistant-page-suggestion-max" class="small-text" min="0" max="8" step="1" name="<?php echo $opt; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>[assistant_suggestion_max_items]" value="<?php echo esc_attr( (string) absint( $settings['assistant_suggestion_max_items'] ) ); ?>" />
							<span class="description"><?php esc_html_e( 'Use 0 to inherit the shared limit.', 'persona-assistant' ); ?></span>
						</p>
						<p><strong><?php esc_html_e( 'Chip overflow', 'persona-assistant' ); ?></strong></p>
						<?php
						$this->segmented(
							'assistant_suggestion_overflow',
							array(
								'inherit' => __( 'Use shared', 'persona-assistant' ),
								'wrap'    => __( 'Wrap', 'persona-assistant' ),
								'scroll'  => __( 'Scroll', 'persona-assistant' ),
							),
							(string) $settings['assistant_suggestion_overflow']
						);
						?>
					</td>
				</tr>
			</table>
		</details>
		<?php
	}

	/**
	 * Reconnect / disconnect actions, rendered inside the status panel's
	 * "Connection details" disclosure.
	 *
	 * The status panel lives outside the main settings <form>, so this admin-post
	 * form is valid (no nested forms) and its Reconnect / Disconnect buttons are
	 * nonce-protected.
	 *
	 * @param string $source Derived credential source.
	 * @param string $token  Effective client token (empty when not connected).
	 * @return void
	 */
	private function render_connection_actions( $source, $token ) {
		if ( '' === $token ) {
			return;
		}
		$has_constant    = defined( 'PERSONA_ASSISTANT_API_KEY' ) && PERSONA_ASSISTANT_API_KEY && Persona_Assistant_Credential::SOURCE_API_KEY === $source;
		$has_const_token = defined( 'PERSONA_ASSISTANT_CLIENT_TOKEN' ) && PERSONA_ASSISTANT_CLIENT_TOKEN && Persona_Assistant_Credential::SOURCE_CLIENT_TOKEN === $source;
		// A wp-config constant survives a disconnect, so the button can only
		// unpublish; never claim it removes the credential.
		$constant_backed = $has_constant || $has_const_token;
		?>
		<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="persona-assistant-actions">
			<?php wp_nonce_field( 'persona_assistant_remint' ); ?>
			<input type="hidden" name="action" value="persona_assistant_remint" />
			<?php if ( Persona_Assistant_Credential::source_mints() ) : ?>
				<button type="submit" class="button" name="persona_assistant_action" value="remint"><?php esc_html_e( 'Reconnect', 'persona-assistant' ); ?></button>
			<?php endif; ?>
			<button type="submit" class="button button-link-delete" name="persona_assistant_action" value="disconnect" data-persona-confirm="<?php echo esc_attr__( 'Disconnect Runtype, clear the plugin connection and agent, and unpublish chat?', 'persona-assistant' ); ?>"><?php echo esc_html( $constant_backed ? __( 'Disconnect and unpublish', 'persona-assistant' ) : __( 'Disconnect and remove credentials', 'persona-assistant' ) ); ?></button>
		</form>
		<?php if ( $has_constant ) : ?>
			<p class="description"><?php esc_html_e( 'The API key remains defined in wp-config.php. Selecting Runtype and saving will reconnect it.', 'persona-assistant' ); ?></p>
		<?php elseif ( $has_const_token ) : ?>
			<p class="description"><?php esc_html_e( 'The client token remains defined in wp-config.php. Selecting Runtype and saving will reconnect it.', 'persona-assistant' ); ?></p>
		<?php endif; ?>
		<?php
	}

	/* ---------------------------------------------------------------------
	 * Small render helpers
	 * ------------------------------------------------------------------- */

	/**
	 * Render a radio input bound to the settings option.
	 *
	 * @param string $key     Setting key.
	 * @param string $value   Radio value.
	 * @param string $label   Label text.
	 * @param string $current Current value.
	 * @return void
	 */
	private function radio( $key, $value, $label, $current ) {
		printf(
			'<p><label><input type="radio" name="%1$s[%2$s]" value="%3$s" %4$s /> %5$s</label></p>',
			esc_attr( PERSONA_ASSISTANT_SETTINGS_OPTION ),
			esc_attr( $key ),
			esc_attr( $value ),
			checked( $current, $value, false ),
			esc_html( $label )
		);
	}

	/**
	 * Render a card-like radio choice.
	 *
	 * @param string $key         Setting key.
	 * @param string $value       Radio value.
	 * @param string $label       Choice label.
	 * @param string $description Choice description.
	 * @param string $current     Current value.
	 * @return void
	 */
	private function choice_radio( $key, $value, $label, $description, $current ) {
		printf(
			'<label class="persona-assistant-choice"><input type="radio" name="%1$s[%2$s]" value="%3$s" %4$s /><span><strong>%5$s</strong><small>%6$s</small></span></label>',
			esc_attr( PERSONA_ASSISTANT_SETTINGS_OPTION ),
			esc_attr( $key ),
			esc_attr( $value ),
			checked( $current, $value, false ),
			esc_html( $label ),
			esc_html( $description )
		);
	}

	/**
	 * Render a segmented control (a labelled group of radio "chips").
	 *
	 * @param string                $key     Setting key.
	 * @param array<string,string>  $options value => label pairs.
	 * @param string                $current Current value.
	 * @return void
	 */
	private function segmented( $key, $options, $current ) {
		echo '<span class="persona-assistant-segmented" role="radiogroup">';
		foreach ( $options as $value => $label ) {
			printf(
				'<label class="persona-assistant-segment"><input type="radio" name="%1$s[%2$s]" value="%3$s" %4$s /><span>%5$s</span></label>',
				esc_attr( PERSONA_ASSISTANT_SETTINGS_OPTION ),
				esc_attr( $key ),
				esc_attr( (string) $value ),
				checked( $current, (string) $value, false ),
				esc_html( $label )
			);
		}
		echo '</span>';
	}

	/**
	 * Render a status badge.
	 *
	 * @param string $text  Badge text.
	 * @param string $state ok|warn|off|info.
	 * @return void
	 */
	private function badge( $text, $state ) {
		printf(
			'<span class="persona-assistant-badge persona-assistant-badge--%1$s">%2$s</span>',
			esc_attr( $state ),
			esc_html( $text )
		);
	}

	/**
	 * Human label for a credential source.
	 *
	 * @param string $source Source key.
	 * @return string
	 */
	private function source_label( $source ) {
		switch ( $source ) {
			case 'client_token':
				return __( 'Pasted client token', 'persona-assistant' );
			case 'oauth':
				return __( 'Login with Runtype', 'persona-assistant' );
			case 'api_key':
			default:
				return __( 'API key (auto-mint)', 'persona-assistant' );
		}
	}

	/**
	 * Mask a token for display (keep a short prefix/suffix).
	 *
	 * @param string $token Token.
	 * @return string
	 */
	private function mask_token( $token ) {
		$len = strlen( $token );
		if ( $len <= 12 ) {
			return str_repeat( '•', max( 0, $len ) );
		}
		return substr( $token, 0, 8 ) . '...' . substr( $token, -4 );
	}
}
