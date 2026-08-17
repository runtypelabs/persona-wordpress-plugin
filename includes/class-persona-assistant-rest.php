<?php
/**
 * REST endpoint for "WordPress built-in AI" mode.
 *
 * The widget POSTs `{ messages: [...] }` to this route (its custom-backend
 * `apiUrl`) and natively parses Persona's wire format in the SSE response, the
 * same named-event vocabulary the Runtype API emits (execution_start →
 * turn_start → text_start → text_delta → ... → execution_complete). See
 * stream_sse() for the exact lifecycle.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * REST controller.
 */
class Persona_Assistant_REST {

	const NAMESPACE = 'persona-assistant/v1';
	const ROUTE     = '/chat';

	/** Public route the Runtype API fetches to verify site ownership. */
	const CHALLENGE_ROUTE = '/oauth-challenge';

	/** Transient holding the pending site-verification challenge doc. */
	const CHALLENGE_TRANSIENT = 'persona_assistant_oauth_challenge';

	/** @var Persona_Assistant_History */
	private $history;

	/**
	 * Register hooks.
	 */
	public function __construct( Persona_Assistant_History $history ) {
		$this->history = $history;
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register the chat route.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			self::ROUTE,
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'handle_chat' ),
				'permission_callback' => array( $this, 'permission' ),
				'args'                => array(
					'messages' => array(
						'required' => true,
						'type'     => 'array',
					),
					'conversationId' => array(
						'required' => false,
						'type'     => 'string',
					),
				),
			)
		);

		// Public: the Runtype API GETs this during site verification to read the
		// one-time challenge token. It exposes ONLY { verification_id, token }.
		register_rest_route(
			self::NAMESPACE,
			self::CHALLENGE_ROUTE,
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'handle_oauth_challenge' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Serve the pending site-verification challenge, if any.
	 *
	 * @return WP_REST_Response { verification_id, token } (200) or an error (404).
	 */
	public function handle_oauth_challenge() {
		$challenge = get_transient( self::CHALLENGE_TRANSIENT );
		if ( ! is_array( $challenge ) || empty( $challenge['verification_id'] ) || empty( $challenge['token'] ) ) {
			return new WP_REST_Response( array( 'error' => 'no_pending_verification' ), 404 );
		}
		return new WP_REST_Response(
			array(
				'verification_id' => (string) $challenge['verification_id'],
				'token'           => (string) $challenge['token'],
			),
			200
		);
	}

	/**
	 * Permission gate.
	 *
	 * The settings screen controls public versus logged-in access and a basic
	 * rate limit. This filter remains the site-specific outer gate for stricter
	 * policy such as membership, role, or custom abuse controls.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return bool|WP_Error
	 */
	public function permission( $request ) {
		return apply_filters( 'persona_assistant_rest_permission', true, $request );
	}

	/**
	 * Enforce the admin-selected audience and rate limit inside the SSE handler
	 * so visitors receive a chat-readable error frame instead of a JSON response.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return true|WP_Error
	 */
	private function access_guard( $request ) {
		$access = (string) persona_assistant_get_setting( 'wp_ai_access', 'public' );
		if ( 'logged_in' === $access && ! is_user_logged_in() ) {
			return new WP_Error(
				'persona_assistant_login_required',
				__( 'Please sign in to use chat.', 'persona-assistant' ),
				array( 'status' => 401 )
			);
		}

		/**
		 * Filter the WordPress AI per-visitor, per-minute request limit.
		 *
		 * The resolved value is always hard-capped to 1-60 after filtering.
		 *
		 * @param int $limit Configured (or default) requests per visitor per minute.
		 */
		$limit = (int) apply_filters( 'persona_assistant_wp_ai_rate_limit', (int) persona_assistant_get_setting( 'wp_ai_rate_limit', 10 ) );
		$limit = min( 60, max( 1, $limit ) );
		if ( is_user_logged_in() ) {
			$identity = 'user:' . get_current_user_id();
		} else {
			$remote_address = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'anonymous';
			$identity       = 'ip:' . $remote_address;
		}

		$bucket = (string) floor( time() / MINUTE_IN_SECONDS );
		$key    = 'persona_assistant_rate_' . substr( hash( 'sha256', $identity . ':' . $bucket ), 0, 32 );
		$count  = (int) get_transient( $key );
		if ( $count >= $limit ) {
			return new WP_Error(
				'persona_assistant_rate_limited',
				__( 'Too many chat messages. Please wait a minute and try again.', 'persona-assistant' ),
				array( 'status' => 429 )
			);
		}

		set_transient( $key, $count + 1, 2 * MINUTE_IN_SECONDS );
		return true;
	}

	/**
	 * Handle a chat turn: validate structured history, generate, and stream SSE.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_Error|void  Returns a WP_Error only on the pre-stream guard; otherwise streams and exits.
	 */
	public function handle_chat( $request ) {
		$access = $this->access_guard( $request );
		if ( is_wp_error( $access ) ) {
			$this->stream_sse( $access );
			return;
		}

		if ( ! Persona_Assistant_AI::is_available() ) {
			// Stream the failure as an SSE error frame the widget can render,
			// instead of a JSON WP_Error its SSE parser would silently drop.
			// (This path runs as the front-end visitor, which may evaluate
			// availability differently than the admin settings screen.)
			$this->stream_sse( new WP_Error( 'persona_assistant_ai_unavailable', __( 'No built-in AI is configured.', 'persona-assistant' ) ) );
			return;
		}

		$messages = $this->normalize_messages( (array) $request->get_param( 'messages' ) );
		if ( is_wp_error( $messages ) ) {
			$this->stream_sse( $messages );
			return;
		}

		$conversation_id = sanitize_text_field( (string) $request->get_param( 'conversationId' ) );
		if ( '' !== $conversation_id ) {
			$history_access = $this->history->validate_for_chat( $conversation_id );
			if ( is_wp_error( $history_access ) ) {
				$this->stream_sse( $history_access );
				return;
			}
		}

		$system = (string) persona_assistant_get_setting( 'wp_ai_system_prompt', '' );
		$model  = (string) persona_assistant_get_setting( 'wp_ai_model', '' );

		$stream = $this->open_stream();
		$reply  = Persona_Assistant_AI::generate_chat(
			$messages,
			array(
				'system' => $system,
				'model'  => $model,
			),
			! empty( persona_assistant_get_setting( 'wp_ai_tools_enabled', false ) ) ? persona_assistant_selected_wp_ai_abilities() : array(),
			function ( $type, $payload ) use ( $stream ) {
				if ( 'reasoning' === $type && ! empty( persona_assistant_get_setting( 'show_ai_activity', false ) ) ) {
					$id = 'reason_' . wp_generate_uuid4();
					call_user_func( $stream, 'reasoning_start', array( 'id' => $id, 'iteration' => (int) $payload['iteration'] ) );
					call_user_func( $stream, 'reasoning_delta', array( 'id' => $id, 'delta' => (string) $payload['text'], 'iteration' => (int) $payload['iteration'] ) );
					call_user_func( $stream, 'reasoning_complete', array( 'id' => $id, 'text' => (string) $payload['text'], 'iteration' => (int) $payload['iteration'] ) );
				} elseif ( 'tool_start' === $type ) {
					call_user_func(
						$stream,
						'tool_start',
						array(
							'toolCallId' => (string) $payload['id'],
							'toolName'   => (string) $payload['name'],
							'toolType'   => 'wordpress-ability',
							'parameters' => $payload['input'],
							'iteration'  => (int) $payload['iteration'],
						)
					);
				} elseif ( 'tool_complete' === $type ) {
					call_user_func(
						$stream,
						'tool_complete',
						array(
							'toolCallId' => (string) $payload['id'],
							'toolName'   => (string) $payload['name'],
							'success'    => true,
							'result'     => $payload['output'],
							'iteration'  => (int) $payload['iteration'],
							'completedAt' => self::iso_now(),
						)
					);
				}
			}
		);

		if ( '' !== $conversation_id && ! is_wp_error( $reply ) ) {
			$this->history->store_turn( $conversation_id, $messages, $reply );
		}

		$this->finish_stream( $stream, $reply );
	}

	/**
	 * Validate Persona messages without flattening their structure or files.
	 *
	 * @param array<int,mixed> $messages Messages from the widget.
	 * @return array<int,array<string,mixed>>|WP_Error
	 */
	private function normalize_messages( array $messages ) {
		$settings  = persona_assistant_get_settings();
		$max_files = min( 4, max( 1, (int) $settings['attachment_max_files'] ) );
		$max_bytes = min( 10, max( 1, (int) $settings['attachment_max_size_mb'] ) ) * MB_IN_BYTES;
		$allowed   = persona_assistant_attachment_mime_types( $settings );
		$files     = 0;
		$text_bytes = 0;
		$out       = array();

		foreach ( array_slice( $messages, -20 ) as $message ) {
			if ( ! is_array( $message ) ) {
				continue;
			}
			$role = isset( $message['role'] ) ? sanitize_key( (string) $message['role'] ) : 'user';
			if ( ! in_array( $role, array( 'user', 'assistant' ), true ) ) {
				continue;
			}
			$content = isset( $message['content'] ) ? $message['content'] : '';
			$content = is_array( $content ) ? $content : array( array( 'type' => 'text', 'text' => (string) $content ) );
			$parts   = array();
			foreach ( $content as $part ) {
				if ( is_string( $part ) ) {
					$part = array( 'type' => 'text', 'text' => $part );
				}
				if ( ! is_array( $part ) ) {
					continue;
				}
				$type = isset( $part['type'] ) ? sanitize_key( (string) $part['type'] ) : 'text';
				if ( 'text' === $type && isset( $part['text'] ) ) {
					$text = sanitize_textarea_field( (string) $part['text'] );
					if ( '' !== trim( $text ) ) {
						$text_bytes += strlen( $text );
						if ( strlen( $text ) > 20000 || $text_bytes > 80000 ) {
							return new WP_Error( 'persona_assistant_message_too_large', __( 'The conversation text is too long. Start a new conversation or shorten the message.', 'persona-assistant' ) );
						}
						$parts[] = array( 'type' => 'text', 'text' => $text );
					}
				} elseif ( in_array( $type, array( 'file', 'image' ), true ) ) {
					if ( 'user' !== $role || ( empty( $settings['assistant_attachments'] ) && empty( $settings['launcher_attachments'] ) ) ) {
						return new WP_Error( 'persona_assistant_attachments_disabled', __( 'File attachments are not enabled.', 'persona-assistant' ) );
					}
					if ( ++$files > $max_files ) {
						return new WP_Error( 'persona_assistant_too_many_files', __( 'Too many attached files.', 'persona-assistant' ) );
					}
					$data = isset( $part['data'] ) ? (string) $part['data'] : ( isset( $part['image'] ) ? (string) $part['image'] : '' );
					$mime = isset( $part['mimeType'] ) ? sanitize_mime_type( (string) $part['mimeType'] ) : '';
					if ( ! preg_match( '#^data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2})$#', $data, $matches ) ) {
						return new WP_Error( 'persona_assistant_invalid_file', __( 'An attached file is invalid.', 'persona-assistant' ) );
					}
					$uri_mime = sanitize_mime_type( $matches[1] );
					$decoded  = base64_decode( $matches[2], true );
					if ( false === $decoded || $uri_mime !== $mime || ! in_array( $mime, $allowed, true ) ) {
						return new WP_Error( 'persona_assistant_file_type', __( 'That file type is not allowed.', 'persona-assistant' ) );
					}
					if ( strlen( $decoded ) > $max_bytes ) {
						return new WP_Error( 'persona_assistant_file_too_large', __( 'An attached file is too large.', 'persona-assistant' ) );
					}
					$parts[] = array(
						'type'     => 'file',
						'data'     => $data,
						'mimeType' => $mime,
						'filename' => isset( $part['filename'] ) ? sanitize_file_name( (string) $part['filename'] ) : __( 'attachment', 'persona-assistant' ),
					);
				}
			}
			if ( ! empty( $parts ) ) {
				$out[] = array( 'role' => $role, 'parts' => $parts );
			}
		}

		if ( empty( $out ) ) {
			return new WP_Error( 'persona_assistant_no_message', __( 'No message to respond to.', 'persona-assistant' ) );
		}
		return $out;
	}

	/**
	 * Stream the reply in Persona's wire format, then exit.
	 *
	 * The Persona widget consumes its own event vocabulary natively, the very
	 * same wire the Runtype API emits, so a custom backend must speak it too.
	 * Each frame is a named SSE event whose JSON payload carries
	 * { type, executionId, seq, ... }, and one turn is a fixed lifecycle:
	 *
	 *   execution_start → turn_start → text_start → text_delta(...) →
	 *   text_complete → turn_complete → execution_complete      (success)
	 *   execution_start → execution_error                       (failure)
	 *
	 * The reply is produced in one shot (generate_text() returns the full
	 * string), so the whole text goes out as a single text_delta.
	 *
	 * @param string|WP_Error $reply Generated reply, or an error.
	 * @return void
	 */
	private function stream_sse( $reply ) {
		$send = $this->open_stream();
		$this->finish_stream( $send, $reply );
	}

	/** Open an SSE execution and return its event emitter. */
	private function open_stream() {
		// Do NOT discard output buffers here. Some runtimes capture the entire
		// HTTP body through an output buffer, notably WordPress Playground /
		// PHP-WASM, and ob_end_clean()-ing it throws the whole response away.
		// Letting PHP flush buffers at shutdown delivers the body intact
		// everywhere; the reply is one-shot, so nothing streams incrementally.
		if ( ! headers_sent() ) {
			nocache_headers();
			header( 'Content-Type: text/event-stream; charset=utf-8' );
			header( 'Cache-Control: no-cache, no-transform' );
			header( 'X-Accel-Buffering: no' );
			header( 'Connection: keep-alive' );
		}

		$execution_id = 'exec_' . wp_generate_uuid4();
		$seq          = 0;
		$send         = static function ( $event, $payload ) use ( &$seq, $execution_id ) {
			$event = sanitize_key( (string) $event );
			$frame = array_merge(
				array(
					'type'        => $event,
					'executionId' => $execution_id,
					'seq'         => $seq++,
				),
				$payload
			);
			echo 'event: ' . esc_html( $event ) . "\n" . 'data: ' . wp_json_encode( $frame ) . "\n\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- JSON is encoded for an SSE data frame, not HTML.
			if ( function_exists( 'flush' ) ) {
				flush();
			}
		};

		// execution_start opens every run, whether it ends in text or an error.
		$send(
			'execution_start',
			array(
				'kind'      => 'agent',
				'agentId'   => 'wordpress-ai',
				'agentName' => 'WordPress AI',
				'startedAt' => self::iso_now(),
			)
		);
		return $send;
	}

	/** Finish an open SSE execution with text or an error. */
	private function finish_stream( $send, $reply ) {
		if ( is_wp_error( $reply ) ) {
			$send(
				'execution_error',
				array(
					'kind'  => 'agent',
					'error' => array( 'message' => $reply->get_error_message() ),
				)
			);
			exit;
		}

		$text      = is_array( $reply ) && isset( $reply['text'] ) ? (string) $reply['text'] : (string) $reply;
		$iteration = is_array( $reply ) && isset( $reply['iterations'] ) ? max( 1, (int) $reply['iterations'] ) : 1;
		$turn_id   = 'turn_' . wp_generate_uuid4();
		$text_id = 'text_' . wp_generate_uuid4();

		$send( 'turn_start', array( 'id' => $turn_id, 'iteration' => $iteration ) );
		$send( 'text_start', array( 'id' => $text_id ) );
		$send( 'text_delta', array( 'id' => $text_id, 'delta' => $text, 'iteration' => $iteration ) );
		$send( 'text_complete', array( 'id' => $text_id, 'text' => $text ) );
		$send(
			'turn_complete',
			array(
				'id'          => $turn_id,
				'iteration'   => $iteration,
				'stopReason'  => 'end_turn',
				'completedAt' => self::iso_now(),
			)
		);
		$send(
			'execution_complete',
			array(
				'kind'        => 'agent',
				'success'     => true,
				'completedAt' => self::iso_now(),
			)
		);

		exit;
	}

	/**
	 * Current UTC time as an ISO-8601 string with milliseconds.
	 *
	 * @return string e.g. 2026-06-25T10:00:00.000Z
	 */
	private static function iso_now() {
		return gmdate( 'Y-m-d\TH:i:s' ) . '.000Z';
	}
}
