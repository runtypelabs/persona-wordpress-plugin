<?php
/**
 * WordPress built-in AI isolation layer.
 *
 * This is the ONLY file that references WP-AI-specific API names. Everything is
 * guarded by function_exists()/class_exists() and wrapped in try/catch so that
 * an absent or differently-shaped AI stack degrades to "unavailable" rather than
 * fataling. When the core/AI-Services API names are finalized, adjust ONLY here.
 *
 * Supported (best-effort):
 *   - WordPress core AI Client (7.0+, also the "AI" feature plugin on 6.x):
 *     the wp_ai_client_prompt() global returning a WP_AI_Client_Prompt_Builder.
 *     This is the wrapper that respects the Connectors/approval/credential UI,
 *     returns WP_Error, and uses snake_case methods.
 *   - The "AI Services" community plugin (6.x): ai_services() service container.
 *
 * Note: a connector being "Connected" in Settings → AI is necessary but not
 * always sufficient. The AI Client also gates text generation behind the
 * `prompt_ai` capability, which administrators have but logged-out front-end
 * visitors do not, so detection/generation are wrapped in with_ai_cap() to
 * grant it for the trusted server-side call (see that method). And if the
 * "Connector Approval" experiment is enabled, this plugin must be approved
 * there (or that experiment disabled) or generate() returns the approval error.
 *
 * Streaming note: the one-shot AI Client returns a full string today, so the REST
 * layer wraps it as a single SSE frame. Incremental frames later need no widget change.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Built-in AI adapter.
 */
class Persona_Assistant_AI {

	/**
	 * Is a built-in AI capable of text generation available?
	 *
	 * @return bool
	 */
	public static function is_available() {
		// WordPress core AI Client (7.0+) / "AI" feature plugin.
		if ( function_exists( 'wp_ai_client_prompt' ) ) {
			try {
				return self::with_ai_cap(
					static function () {
						$builder = call_user_func( 'wp_ai_client_prompt' );
						if ( ! is_object( $builder ) ) {
							return false;
						}
						// The builder dispatches fluent methods through __call, so
						// method_exists() can't see them, so use is_callable(). Ask
						// whether a text-generation-capable connector is actually
						// configured; if that probe is unavailable, the function
						// existing is enough to attempt.
						if ( is_callable( array( $builder, 'is_supported_for_text_generation' ) ) ) {
							return (bool) $builder->is_supported_for_text_generation();
						}
						return true;
					}
				);
			} catch ( \Throwable $e ) {
				return false;
			}
		}

		// "AI Services" community plugin (6.x).
		try {
			if ( function_exists( 'ai_services' ) ) {
				$services = ai_services();
				if ( is_object( $services ) && method_exists( $services, 'has_available_services' ) ) {
					return (bool) $services->has_available_services();
				}
			}
		} catch ( \Throwable $e ) {
			return false;
		}

		return false;
	}

	/**
	 * Generate a reply for a prompt.
	 *
	 * @param string              $prompt The composed user prompt.
	 * @param array<string,mixed> $opts   { system?: string, model?: string }.
	 * @return string|WP_Error
	 */
	public static function generate( $prompt, $opts = array() ) {
		$prompt = (string) $prompt;
		if ( '' === trim( $prompt ) ) {
			return new WP_Error( 'persona_assistant_ai_empty_prompt', __( 'Empty prompt.', 'persona-assistant' ) );
		}

		if ( function_exists( 'wp_ai_client_prompt' ) ) {
			return self::generate_via_wp_ai_client( $prompt, $opts );
		}

		if ( function_exists( 'ai_services' ) ) {
			return self::generate_via_ai_services( $prompt, $opts );
		}

		return new WP_Error( 'persona_assistant_ai_unavailable', __( 'No built-in AI is configured.', 'persona-assistant' ) );
	}

	/**
	 * Generate from structured chat history, preserving attachments and optionally
	 * resolving an allowlist of read-only WordPress Abilities.
	 *
	 * @param array<int,array<string,mixed>> $messages      Normalized messages.
	 * @param array<string,mixed>            $opts          System/model options.
	 * @param array<int,string>              $ability_names Allowed ability names.
	 * @param callable|null                  $on_event      Activity callback.
	 * @return array{text:string,iterations:int}|WP_Error
	 */
	public static function generate_chat( array $messages, $opts = array(), array $ability_names = array(), $on_event = null ) {
		if ( empty( $messages ) ) {
			return new WP_Error( 'persona_assistant_ai_empty_prompt', __( 'Empty prompt.', 'persona-assistant' ) );
		}

		if ( ! function_exists( 'wp_ai_client_prompt' ) ) {
			$prompt = self::flatten_messages( $messages );
			$reply  = self::generate( $prompt, $opts );
			return is_wp_error( $reply ) ? $reply : array( 'text' => $reply, 'iterations' => 1 );
		}

		try {
			return self::with_ai_cap(
				static function () use ( $messages, $opts, $ability_names, $on_event ) {
					$history = self::to_wp_ai_messages( array_slice( $messages, -20 ) );
					if ( is_wp_error( $history ) ) {
						return $history;
					}

					$ability_names = self::validate_readonly_abilities( $ability_names );
					$resolver      = ! empty( $ability_names ) && class_exists( 'WP_AI_Client_Ability_Function_Resolver' )
						? new WP_AI_Client_Ability_Function_Resolver( ...$ability_names )
						: null;
					$max_turns     = min( 4, max( 1, (int) apply_filters( 'persona_assistant_wp_ai_max_tool_turns', 4 ) ) );

					for ( $iteration = 1; $iteration <= $max_turns; $iteration++ ) {
						$builder = call_user_func( 'wp_ai_client_prompt', $history );
						if ( ! is_object( $builder ) ) {
							return new WP_Error( 'persona_assistant_ai_unavailable', __( 'No built-in AI is configured.', 'persona-assistant' ) );
						}
						if ( ! empty( $opts['system'] ) && is_callable( array( $builder, 'using_system_instruction' ) ) ) {
							$builder = $builder->using_system_instruction( (string) $opts['system'] );
						}
						if ( ! empty( $opts['model'] ) && is_callable( array( $builder, 'using_model_preference' ) ) ) {
							$builder = $builder->using_model_preference( (string) $opts['model'] );
						}
						if ( ! empty( $ability_names ) && is_callable( array( $builder, 'using_abilities' ) ) ) {
							$builder = $builder->using_abilities( ...$ability_names );
						}

						$result = $builder->generate_text_result();
						if ( is_wp_error( $result ) ) {
							return $result;
						}
						if ( ! is_object( $result ) || ! is_callable( array( $result, 'toMessage' ) ) ) {
							return new WP_Error( 'persona_assistant_ai_invalid_result', __( 'The AI returned an unsupported result.', 'persona-assistant' ) );
						}

						$model_message = $result->toMessage();
						$text          = '';
						$calls         = array();
						$canonical_tool_history = true;
						foreach ( $model_message->getParts() as $part ) {
							$part_text = $part->getText();
							if ( null !== $part_text && $part->getChannel()->isThought() ) {
								self::emit( $on_event, 'reasoning', array( 'text' => $part_text, 'iteration' => $iteration ) );
							} elseif ( null !== $part_text && $part->getChannel()->isContent() ) {
								$text .= $part_text;
							}
							$call = $part->getFunctionCall();
							if ( null !== $call ) {
								$calls[] = $call;
								if ( null === $part->getThoughtSignature() ) {
									$canonical_tool_history = false;
								}
							}
						}

						if ( empty( $calls ) ) {
							if ( '' === trim( $text ) ) {
								return new WP_Error( 'persona_assistant_ai_empty', __( 'The AI returned no text.', 'persona-assistant' ) );
							}
							return array( 'text' => trim( $text ), 'iterations' => $iteration );
						}
						if ( ! $resolver ) {
							return new WP_Error( 'persona_assistant_ai_tool_not_allowed', __( 'The AI requested a tool that is not enabled.', 'persona-assistant' ) );
						}

						$response_parts = array();
						$fallback_results = array();
						foreach ( $calls as $call ) {
							$name = (string) $call->getName();
							$id   = (string) ( $call->getId() ?: 'tool_' . wp_generate_uuid4() );
							self::emit( $on_event, 'tool_start', array( 'id' => $id, 'name' => self::ability_label_from_function( $name ), 'input' => $call->getArgs(), 'iteration' => $iteration ) );
							$response         = $resolver->execute_ability( $call );
							$response_parts[] = new \WordPress\AiClient\Messages\DTO\MessagePart( $response );
							$fallback_results[] = array( 'ability' => self::ability_label_from_function( $name ), 'result' => $response->getResponse() );
							self::emit( $on_event, 'tool_complete', array( 'id' => $id, 'name' => self::ability_label_from_function( $name ), 'output' => $response->getResponse(), 'iteration' => $iteration ) );
						}
						if ( $canonical_tool_history ) {
							$history[] = $model_message;
							$history[] = new \WordPress\AiClient\Messages\DTO\UserMessage( $response_parts );
						} else {
							// Some connectors currently omit required thought signatures from
							// function-call parts. Replaying those parts makes that provider
							// reject the follow-up request, so preserve the same result as a
							// bounded text transcript until the connector supplies signatures.
							$history[] = new \WordPress\AiClient\Messages\DTO\ModelMessage(
								array( new \WordPress\AiClient\Messages\DTO\MessagePart( __( 'I used the selected WordPress Ability.', 'persona-assistant' ) ) )
							);
							$history[] = new \WordPress\AiClient\Messages\DTO\UserMessage(
								array( new \WordPress\AiClient\Messages\DTO\MessagePart( 'WordPress Ability result (already executed; answer from this result without repeating the same call): ' . wp_json_encode( $fallback_results ) ) )
							);
						}
					}

					return new WP_Error( 'persona_assistant_ai_tool_limit', __( 'The assistant reached the tool-turn limit.', 'persona-assistant' ) );
				}
			);
		} catch ( \Throwable $e ) {
			return new WP_Error( 'persona_assistant_ai_error', $e->getMessage() );
		}
	}

	/** Convert normalized chat records into WordPress AI Client messages. */
	private static function to_wp_ai_messages( array $messages ) {
		$out = array();
		try {
			foreach ( $messages as $message ) {
				$parts = array();
				foreach ( (array) $message['parts'] as $part ) {
					if ( 'text' === $part['type'] ) {
						$parts[] = new \WordPress\AiClient\Messages\DTO\MessagePart( (string) $part['text'] );
					} elseif ( 'file' === $part['type'] ) {
						$file    = new \WordPress\AiClient\Files\DTO\File( (string) $part['data'], (string) $part['mimeType'] );
						$parts[] = new \WordPress\AiClient\Messages\DTO\MessagePart( $file );
					}
				}
				if ( empty( $parts ) ) {
					continue;
				}
				$out[] = 'assistant' === $message['role']
					? new \WordPress\AiClient\Messages\DTO\ModelMessage( $parts )
					: new \WordPress\AiClient\Messages\DTO\UserMessage( $parts );
			}
		} catch ( \Throwable $e ) {
			return new WP_Error( 'persona_assistant_ai_invalid_message', $e->getMessage() );
		}
		return $out;
	}

	/** Flatten structured history for the legacy AI Services backend. */
	private static function flatten_messages( array $messages ) {
		$lines = array();
		foreach ( array_slice( $messages, -20 ) as $message ) {
			$text = array();
			foreach ( (array) $message['parts'] as $part ) {
				if ( 'text' === $part['type'] ) {
					$text[] = (string) $part['text'];
				} elseif ( 'file' === $part['type'] ) {
					$text[] = sprintf( '[Attached file: %s]', (string) $part['filename'] );
				}
			}
			$lines[] = ( 'assistant' === $message['role'] ? 'Assistant: ' : 'User: ' ) . implode( ' ', $text );
		}
		return implode( "\n", $lines );
	}

	/** Revalidate ability safety immediately before exposing or executing it. */
	private static function validate_readonly_abilities( array $names ) {
		$available = function_exists( 'persona_assistant_readonly_abilities' ) ? persona_assistant_readonly_abilities() : array();
		return array_values( array_intersect( array_map( 'sanitize_text_field', $names ), array_keys( $available ) ) );
	}

	/** Produce a friendly tool label from a wpab__ function name. */
	private static function ability_label_from_function( $function_name ) {
		if ( class_exists( 'WP_AI_Client_Ability_Function_Resolver' ) ) {
			$name      = WP_AI_Client_Ability_Function_Resolver::function_name_to_ability_name( (string) $function_name );
			$available = function_exists( 'persona_assistant_readonly_abilities' ) ? persona_assistant_readonly_abilities() : array();
			if ( isset( $available[ $name ]['label'] ) ) {
				return $available[ $name ]['label'];
			}
			return $name;
		}
		return (string) $function_name;
	}

	/** Invoke an optional activity callback. */
	private static function emit( $callback, $type, array $payload ) {
		if ( is_callable( $callback ) ) {
			call_user_func( $callback, $type, $payload );
		}
	}

	/**
	 * Describe the active backend (for the admin status panel).
	 *
	 * @return array{available:bool,backend:string}
	 */
	public static function describe() {
		if ( function_exists( 'wp_ai_client_prompt' ) ) {
			return array(
				'available' => self::is_available(),
				'backend'   => 'WordPress AI Client',
			);
		}
		if ( function_exists( 'ai_services' ) ) {
			return array(
				'available' => self::is_available(),
				'backend'   => 'AI Services plugin',
			);
		}
		return array(
			'available' => false,
			'backend'   => '',
		);
	}

	/**
	 * Best-effort admin URL of the screen where an AI provider gets connected.
	 *
	 * Used by the settings page to route the user to the right place when the
	 * AI stack exists but no provider is configured yet. Returns an empty url
	 * when no known screen is present.
	 *
	 * @return array{url:string,label:string}
	 */
	public static function settings_screen() {
		// WordPress core AI Client (7.0+): Settings → Connectors.
		if ( function_exists( 'wp_ai_client_prompt' ) && file_exists( ABSPATH . 'wp-admin/options-connectors.php' ) ) {
			return array(
				'url'   => admin_url( 'options-connectors.php' ),
				'label' => __( 'Open Connectors settings', 'persona-assistant' ),
			);
		}

		// "AI Services" community plugin settings page.
		if ( function_exists( 'ai_services' ) && function_exists( 'menu_page_url' ) ) {
			$url = menu_page_url( 'ais_services', false );
			if ( is_string( $url ) && '' !== $url ) {
				return array(
					'url'   => $url,
					'label' => __( 'Open AI Services settings', 'persona-assistant' ),
				);
			}
		}

		return array(
			'url'   => '',
			'label' => '',
		);
	}

	/**
	 * List text-generation-capable models grouped by provider (best-effort).
	 *
	 * Used by the settings screen to offer a dropdown instead of a free-text
	 * model field. Returns an empty array whenever enumeration is impossible
	 * (no AI stack, no configured provider, API error), so callers must fall
	 * back to free-text input in that case.
	 *
	 * WP AI Client note: findModelsMetadataForSupport() only includes providers
	 * whose credentials are configured, and the underlying list-models HTTP call
	 * is cached by the client (24h), so this is safe to call on an admin page.
	 *
	 * @return array<string, array<string,string>> Provider label => [ model id => display name ].
	 */
	public static function list_models() {
		// WordPress core AI Client (7.0+) / "AI" feature plugin.
		if ( class_exists( '\WordPress\AiClient\AiClient' ) ) {
			try {
				$registry     = \WordPress\AiClient\AiClient::defaultRegistry();
				$requirements = new \WordPress\AiClient\Providers\Models\DTO\ModelRequirements(
					array( \WordPress\AiClient\Providers\Models\Enums\CapabilityEnum::textGeneration() ),
					array()
				);

				$groups = array();
				foreach ( $registry->findModelsMetadataForSupport( $requirements ) as $provider_models ) {
					$provider = $provider_models->getProvider();
					$label    = is_object( $provider ) && is_callable( array( $provider, 'getName' ) ) ? (string) $provider->getName() : '';
					if ( '' === $label ) {
						$label = __( 'Provider', 'persona-assistant' );
					}
					foreach ( $provider_models->getModels() as $model ) {
						$id = (string) $model->getId();
						if ( '' === $id ) {
							continue;
						}
						$name = (string) $model->getName();
						$groups[ $label ][ $id ] = ( '' !== $name ) ? $name : $id;
					}
				}
				return $groups;
			} catch ( \Throwable $e ) {
				return array();
			}
		}

		// "AI Services" community plugin (6.x): list the available service's models.
		if ( function_exists( 'ai_services' ) ) {
			try {
				$services = ai_services();
				if ( ! is_object( $services ) || ! method_exists( $services, 'get_available_service' ) ) {
					return array();
				}
				$service = $services->get_available_service();
				if ( ! is_object( $service ) || ! is_callable( array( $service, 'list_models' ) ) ) {
					return array();
				}
				$label  = is_callable( array( $service, 'get_service_slug' ) ) ? (string) $service->get_service_slug() : __( 'AI service', 'persona-assistant' );
				$models = array();
				foreach ( (array) $service->list_models() as $slug => $data ) {
					$slug = is_string( $slug ) ? $slug : '';
					if ( '' === $slug ) {
						continue;
					}
					$name = ( is_array( $data ) && ! empty( $data['name'] ) && is_string( $data['name'] ) ) ? $data['name'] : $slug;
					$models[ $slug ] = $name;
				}
				return ( array() !== $models ) ? array( $label => $models ) : array();
			} catch ( \Throwable $e ) {
				return array();
			}
		}

		return array();
	}

	/**
	 * Generate via the "AI Services" plugin.
	 *
	 * @param string              $prompt Prompt.
	 * @param array<string,mixed> $opts   Options.
	 * @return string|WP_Error
	 */
	private static function generate_via_ai_services( $prompt, $opts ) {
		try {
			$services = ai_services();
			if ( ! is_object( $services ) || ! method_exists( $services, 'get_available_service' ) ) {
				return new WP_Error( 'persona_assistant_ai_unavailable', __( 'No built-in AI is configured.', 'persona-assistant' ) );
			}

			$service = $services->get_available_service();
			if ( ! is_object( $service ) || ! method_exists( $service, 'get_model' ) ) {
				return new WP_Error( 'persona_assistant_ai_unavailable', __( 'No built-in AI service is available.', 'persona-assistant' ) );
			}

			$model_args = array( 'feature' => 'persona-assistant' );
			if ( ! empty( $opts['model'] ) ) {
				$model_args['model'] = (string) $opts['model'];
			}
			if ( ! empty( $opts['system'] ) ) {
				$model_args['systemInstruction'] = (string) $opts['system'];
			}

			$model = $service->get_model( $model_args );
			if ( ! is_object( $model ) || ! method_exists( $model, 'generate_text' ) ) {
				return new WP_Error( 'persona_assistant_ai_unavailable', __( 'The AI service cannot generate text.', 'persona-assistant' ) );
			}

			$result = $model->generate_text( $prompt );
			$text   = self::extract_text( $result );

			if ( '' === $text ) {
				return new WP_Error( 'persona_assistant_ai_empty', __( 'The AI returned no text.', 'persona-assistant' ) );
			}
			return $text;
		} catch ( \Throwable $e ) {
			return new WP_Error( 'persona_assistant_ai_error', $e->getMessage() );
		}
	}

	/**
	 * Generate via the WordPress core AI Client wrapper (wp_ai_client_prompt()).
	 *
	 * The wrapper returns a WP_AI_Client_Prompt_Builder whose snake_case fluent
	 * methods are dispatched through __call (so method_exists() is blind to them
	 * so we probe with is_callable()), returns WP_Error, and routes through the
	 * configured Connectors. Optional `system`/`model` are applied best-effort.
	 *
	 * @param string              $prompt Prompt.
	 * @param array<string,mixed> $opts   { system?: string, model?: string }.
	 * @return string|WP_Error
	 */
	private static function generate_via_wp_ai_client( $prompt, $opts ) {
		try {
			return self::with_ai_cap(
				static function () use ( $prompt, $opts ) {
					$builder = call_user_func( 'wp_ai_client_prompt', $prompt );
					if ( ! is_object( $builder ) ) {
						return new WP_Error( 'persona_assistant_ai_unavailable', __( 'No built-in AI is configured.', 'persona-assistant' ) );
					}

					// Fluent methods are dispatched through the builder's __call,
					// so guard with is_callable(); method_exists() can't see them.
					if ( ! empty( $opts['system'] ) && is_callable( array( $builder, 'using_system_instruction' ) ) ) {
						$builder = $builder->using_system_instruction( (string) $opts['system'] );
					}
					if ( ! empty( $opts['model'] ) && is_callable( array( $builder, 'using_model_preference' ) ) ) {
						$builder = $builder->using_model_preference( (string) $opts['model'] );
					}

					$result = $builder->generate_text();
					if ( is_wp_error( $result ) ) {
						return $result;
					}

					$text = self::extract_text( $result );
					if ( '' === $text ) {
						return new WP_Error( 'persona_assistant_ai_empty', __( 'The AI returned no text.', 'persona-assistant' ) );
					}
					return $text;
				}
			);
		} catch ( \Throwable $e ) {
			return new WP_Error( 'persona_assistant_ai_error', $e->getMessage() );
		}
	}

	/**
	 * Run $fn with the `prompt_ai` capability granted for its duration.
	 *
	 * The WordPress AI Client gates text generation behind the `prompt_ai`
	 * capability, which administrators have by default but logged-out front-end
	 * visitors do not. A public chat widget must generate on behalf of anonymous
	 * visitors, so we grant the capability only for the scope of this trusted,
	 * server-side call. Access to the endpoint itself is governed separately by
	 * Persona Assistant's audience/rate-limit settings and the
	 * `persona_assistant_rest_permission` filter; this grant is not a substitute for
	 * those controls.
	 *
	 * @param callable $fn Operation to run.
	 * @return mixed Whatever $fn returns.
	 */
	private static function with_ai_cap( callable $fn ) {
		$grant = static function ( $allcaps ) {
			$allcaps['prompt_ai'] = true;
			return $allcaps;
		};
		add_filter( 'user_has_cap', $grant, PHP_INT_MAX );
		try {
			return $fn();
		} finally {
			remove_filter( 'user_has_cap', $grant, PHP_INT_MAX );
		}
	}

	/**
	 * Coerce a variety of AI-result shapes into a plain string.
	 *
	 * @param mixed $result Generation result (string, array, or an object with text accessors).
	 * @return string
	 */
	private static function extract_text( $result ) {
		if ( is_string( $result ) ) {
			return trim( $result );
		}

		if ( is_object( $result ) ) {
			foreach ( array( 'get_text', 'to_string', '__toString' ) as $method ) {
				if ( method_exists( $result, $method ) ) {
					try {
						$value = $result->$method();
						if ( is_string( $value ) ) {
							return trim( $value );
						}
					} catch ( \Throwable $e ) {
						// Try the next accessor.
						continue;
					}
				}
			}
			if ( method_exists( $result, 'to_array' ) ) {
				try {
					$result = $result->to_array();
				} catch ( \Throwable $e ) {
					return '';
				}
			}
		}

		if ( is_array( $result ) ) {
			// Common shapes: ['text'=>...], candidates[0].content.parts[0].text, etc.
			if ( isset( $result['text'] ) && is_string( $result['text'] ) ) {
				return trim( $result['text'] );
			}
			$found = self::deep_find_text( $result );
			if ( '' !== $found ) {
				return $found;
			}
		}

		return '';
	}

	/**
	 * Recursively pull the first plausible text leaf out of a nested result array.
	 *
	 * @param array<mixed> $data  Nested data.
	 * @param int          $depth Recursion guard.
	 * @return string
	 */
	private static function deep_find_text( $data, $depth = 0 ) {
		if ( $depth > 6 || ! is_array( $data ) ) {
			return '';
		}
		if ( isset( $data['text'] ) && is_string( $data['text'] ) && '' !== trim( $data['text'] ) ) {
			return trim( $data['text'] );
		}
		foreach ( $data as $value ) {
			if ( is_array( $value ) ) {
				$found = self::deep_find_text( $value, $depth + 1 );
				if ( '' !== $found ) {
					return $found;
				}
			}
		}
		return '';
	}
}
