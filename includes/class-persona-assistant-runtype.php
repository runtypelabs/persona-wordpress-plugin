<?php
/**
 * Runtype API client + client-token mint engine.
 *
 * Talks to the Runtype API (default https://api.runtype.com) with a bearer
 * credential (a management API key, or a "Login with Runtype" OAuth access token).
 * The only Runtype wire-contract details in the plugin live here.
 *
 * Wire contract (verified against core/apps/api/src/routes):
 *   POST /v1/client-tokens
 *     body: { name, allowedOrigins[≥1], productSurfaceId, agentIds/flowIds (≥1 combined),
 *             environment: 'test'|'live', ... }
 *     auth: API key with CLIENT_TOKENS:WRITE (or *)
 *     201 -> { token: 'ct_...' (plaintext, once), clientToken: { id, allowedOrigins, ... }, warnings[] }
 *   GET /v1/surfaces?type=chat
 *     -> { data: [ { id, productId, productName, name, type, status, ... } ], pagination }
 *        (PRODUCTS:SURFACES:READ)
 *   GET /v1/products/{id}/surfaces/{surfaceId}
 *     -> { id, productId, items: [ { agentId, flowId, enabled, ... } ], ... }
 *        (PRODUCTS:SURFACES:READ)
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Runtype HTTP client.
 */
class Persona_Assistant_Runtype {

	/**
	 * API base URL, no trailing slash.
	 *
	 * @var string
	 */
	private $api_base;

	/**
	 * Constructor.
	 *
	 * @param string|null $api_base Optional override; defaults to the configured base.
	 */
	public function __construct( $api_base = null ) {
		$this->api_base = $api_base ? untrailingslashit( $api_base ) : persona_assistant_get_api_base();
	}

	/**
	 * Perform a JSON request against the Runtype API.
	 *
	 * @param string                    $method     HTTP method.
	 * @param string                    $path       Path beginning with a slash.
	 * @param string                    $credential Bearer credential.
	 * @param array<string,mixed>|null  $body       JSON body, or null.
	 * @param array<string,mixed>|null  $query      Query args, or null.
	 * @return array<string,mixed>|WP_Error Decoded response array, or error.
	 */
	private function request( $method, $path, $credential, $body = null, $query = null ) {
		$url = $this->api_base . $path;
		if ( ! empty( $query ) ) {
			$url = add_query_arg( $query, $url );
		}

		$args = array(
			'method'  => $method,
			'timeout' => 20,
			'headers' => array(
				'Authorization' => 'Bearer ' . $credential,
				'Accept'        => 'application/json',
				'User-Agent'    => 'WordPress-Persona/' . PERSONA_ASSISTANT_VERSION . '; ' . home_url( '/' ),
			),
		);

		if ( null !== $body ) {
			$args['headers']['Content-Type'] = 'application/json';
			$args['body']                    = wp_json_encode( $body );
		}

		$response = wp_remote_request( $url, $args );
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		$raw  = wp_remote_retrieve_body( $response );
		$data = json_decode( $raw, true );

		if ( $code < 200 || $code >= 300 ) {
			return new WP_Error(
				'persona_assistant_api_error',
				self::error_message_from( $data, $code ),
				array(
					'status' => $code,
					'body'   => $data,
				)
			);
		}

		return is_array( $data ) ? $data : array();
	}

	/**
	 * Perform an UNAUTHENTICATED, form-encoded request against a Runtype OAuth
	 * endpoint. No Authorization header; these endpoints (site-verification,
	 * token, revoke) are the public-client OAuth surface.
	 *
	 * @param string              $method HTTP method.
	 * @param string              $path   Path beginning with a slash.
	 * @param array<string,mixed> $form   application/x-www-form-urlencoded body.
	 * @return array<string,mixed>|WP_Error Decoded response array, or error.
	 */
	private function oauth_request( $method, $path, array $form ) {
		$args = array(
			'method'  => $method,
			'timeout' => 20,
			'headers' => array(
				'Content-Type' => 'application/x-www-form-urlencoded',
				'Accept'       => 'application/json',
				'User-Agent'   => 'WordPress-Persona/' . PERSONA_ASSISTANT_VERSION . '; ' . home_url( '/' ),
			),
			'body'    => http_build_query( $form ),
		);

		$response = wp_remote_request( $this->api_base . $path, $args );
		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		$raw  = wp_remote_retrieve_body( $response );
		$data = json_decode( $raw, true );

		if ( $code < 200 || $code >= 300 ) {
			return new WP_Error(
				'persona_assistant_oauth_error',
				self::error_message_from( $data, $code ),
				array(
					'status'      => $code,
					'body'        => $data,
					// The RFC error code (e.g. invalid_grant, site_unreachable),
					// so callers can distinguish a rejection from a network blip.
					'oauth_error' => ( is_array( $data ) && isset( $data['error'] ) && is_string( $data['error'] ) ) ? $data['error'] : '',
				)
			);
		}

		return is_array( $data ) ? $data : array();
	}

	/**
	 * Create a site verification (unlocks a single-use exact-match redirect URI).
	 *
	 * @param string $origin       Site origin (scheme://host[:port], no path).
	 * @param string $redirect_uri Same-origin HTTPS wp-admin callback URL.
	 * @return array<string,mixed>|WP_Error { verification_id, challenge_token, expires_in } or error.
	 */
	public function create_site_verification( $origin, $redirect_uri ) {
		return $this->oauth_request(
			'POST',
			'/v1/oauth/site-verifications',
			array(
				'client_id'    => PERSONA_ASSISTANT_OAUTH_CLIENT_ID,
				'site_origin'  => $origin,
				'redirect_uri' => $redirect_uri,
			)
		);
	}

	/**
	 * Ask the API to fetch the challenge and verify the site.
	 *
	 * @param string $verification_id Verification id from create_site_verification().
	 * @return array<string,mixed>|WP_Error { status: 'verified' } or error.
	 */
	public function verify_site( $verification_id ) {
		return $this->oauth_request(
			'POST',
			'/v1/oauth/site-verifications/' . rawurlencode( (string) $verification_id ) . '/verify',
			array()
		);
	}

	/**
	 * Exchange an authorization code + PKCE verifier for tokens.
	 *
	 * @param string $code          Authorization code from the callback.
	 * @param string $redirect_uri  The exact redirect URI used in the authorize step.
	 * @param string $code_verifier PKCE code verifier.
	 * @return array<string,mixed>|WP_Error Token response, or error.
	 */
	public function exchange_code( $code, $redirect_uri, $code_verifier ) {
		return $this->oauth_request(
			'POST',
			'/v1/oauth/token',
			array(
				'grant_type'    => 'authorization_code',
				'code'          => $code,
				'redirect_uri'  => $redirect_uri,
				'client_id'     => PERSONA_ASSISTANT_OAUTH_CLIENT_ID,
				'code_verifier' => $code_verifier,
			)
		);
	}

	/**
	 * Exchange a (rotating) refresh token for a fresh token pair.
	 *
	 * @param string $refresh_token Current refresh token.
	 * @return array<string,mixed>|WP_Error New token response, or error.
	 */
	public function refresh_token( $refresh_token ) {
		return $this->oauth_request(
			'POST',
			'/v1/oauth/token',
			array(
				'grant_type'    => 'refresh_token',
				'refresh_token' => $refresh_token,
				'client_id'     => PERSONA_ASSISTANT_OAUTH_CLIENT_ID,
			)
		);
	}

	/**
	 * Best-effort token revocation (always 200 on the server side).
	 *
	 * @param string $token           Access or refresh token to revoke.
	 * @param string $token_type_hint Optional hint: 'access_token' | 'refresh_token'.
	 * @return array<string,mixed>|WP_Error
	 */
	public function revoke_oauth_token( $token, $token_type_hint = '' ) {
		$form = array(
			'token'     => $token,
			'client_id' => PERSONA_ASSISTANT_OAUTH_CLIENT_ID,
		);
		if ( '' !== (string) $token_type_hint ) {
			$form['token_type_hint'] = (string) $token_type_hint;
		}
		return $this->oauth_request( 'POST', '/v1/oauth/revoke', $form );
	}

	/**
	 * Extract a human-readable message from a Runtype error response.
	 *
	 * @param mixed $data Decoded body.
	 * @param int   $code HTTP status.
	 * @return string
	 */
	private static function error_message_from( $data, $code ) {
		if ( is_array( $data ) ) {
			// OAuth/RFC error bodies carry a human-readable `error_description`.
			if ( isset( $data['error_description'] ) && is_string( $data['error_description'] ) && '' !== $data['error_description'] ) {
				return $data['error_description'];
			}
			if ( isset( $data['error'] ) && is_string( $data['error'] ) ) {
				return $data['error'];
			}
			if ( isset( $data['message'] ) && is_string( $data['message'] ) ) {
				return $data['message'];
			}
			if ( isset( $data['error']['message'] ) && is_string( $data['error']['message'] ) ) {
				return $data['error']['message'];
			}
		}
		/* translators: %d: HTTP status code. */
		return sprintf( __( 'Runtype API request failed (HTTP %d).', 'persona-assistant' ), $code );
	}

	/**
	 * Mint a domain-scoped, surface-bound client token.
	 *
	 * The surface id carries the policy plane (loggingPolicy, piiRedaction,
	 * webmcp, conversationTitles); the agent/flow ids are what the token
	 * authenticates against and the API requires at least one of them. Both
	 * come from the chosen chat surface (see describe_chat_surface()).
	 *
	 * @param string              $credential Bearer credential (rt_... key or access token).
	 * @param array<string,mixed> $opts       name, allowedOrigins[], productSurfaceId, agentIds[], flowIds[], defaultFlowId, environment.
	 * @return array<string,mixed>|WP_Error  { token, id, allowedOrigins[], warnings[] } or error.
	 */
	public function mint_client_token( $credential, array $opts ) {
		$origins = isset( $opts['allowedOrigins'] ) ? array_values( array_filter( (array) $opts['allowedOrigins'] ) ) : array();
		if ( empty( $origins ) ) {
			return new WP_Error( 'persona_assistant_mint_no_origin', __( 'No allowed origin to scope the token to.', 'persona-assistant' ) );
		}

		$surface_id = isset( $opts['productSurfaceId'] ) ? trim( (string) $opts['productSurfaceId'] ) : '';
		if ( '' === $surface_id ) {
			return new WP_Error( 'persona_assistant_mint_no_target', __( 'Choose a chat surface before connecting.', 'persona-assistant' ) );
		}

		$agent_ids = isset( $opts['agentIds'] ) ? array_values( array_filter( (array) $opts['agentIds'] ) ) : array();
		$flow_ids  = isset( $opts['flowIds'] ) ? array_values( array_filter( (array) $opts['flowIds'] ) ) : array();
		if ( empty( $agent_ids ) && empty( $flow_ids ) ) {
			return new WP_Error( 'persona_assistant_mint_no_capability', __( 'That chat surface has no enabled agent or flow to chat with. Add one to it in Runtype, then try again.', 'persona-assistant' ) );
		}

		$body = array(
			'name'             => isset( $opts['name'] ) ? (string) $opts['name'] : 'WordPress',
			'allowedOrigins'   => $origins,
			'environment'      => ( isset( $opts['environment'] ) && 'test' === $opts['environment'] ) ? 'test' : 'live',
			'productSurfaceId' => $surface_id,
		);
		if ( ! empty( $agent_ids ) ) {
			$body['agentIds'] = $agent_ids;
		}
		if ( ! empty( $flow_ids ) ) {
			$body['flowIds']       = $flow_ids;
			$body['defaultFlowId'] = isset( $opts['defaultFlowId'] ) && '' !== (string) $opts['defaultFlowId'] ? (string) $opts['defaultFlowId'] : $flow_ids[0];
		}

		$data = $this->request( 'POST', '/v1/client-tokens', $credential, $body );
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		$token = '';
		if ( isset( $data['token'] ) && is_string( $data['token'] ) ) {
			$token = $data['token'];
		} elseif ( isset( $data['clientToken']['tokenValue'] ) && is_string( $data['clientToken']['tokenValue'] ) ) {
			$token = $data['clientToken']['tokenValue'];
		}

		if ( '' === $token ) {
			return new WP_Error( 'persona_assistant_mint_no_token', __( 'Runtype did not return a client token.', 'persona-assistant' ) );
		}

		return array(
			'token'          => $token,
			'id'             => isset( $data['clientToken']['id'] ) ? (string) $data['clientToken']['id'] : '',
			'allowedOrigins' => isset( $data['clientToken']['allowedOrigins'] ) ? (array) $data['clientToken']['allowedOrigins'] : $origins,
			'warnings'       => isset( $data['warnings'] ) && is_array( $data['warnings'] ) ? $data['warnings'] : array(),
		);
	}

	/**
	 * Fetch the authenticated account's profile (GET /v1/users/profile).
	 *
	 * Used for a human-readable connection identity: the organization name is
	 * what the settings UI displays (the org owns the agents and tokens).
	 *
	 * @param string $credential Bearer credential.
	 * @return array{id:string,org_id:string,org_name:string}|WP_Error
	 */
	public function get_profile( $credential ) {
		$data = $this->request( 'GET', '/v1/users/profile', $credential );
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		return array(
			'id'       => isset( $data['id'] ) && is_string( $data['id'] ) ? $data['id'] : '',
			'org_id'   => isset( $data['orgId'] ) && is_string( $data['orgId'] ) ? $data['orgId'] : '',
			'org_name' => isset( $data['orgName'] ) && is_string( $data['orgName'] ) ? $data['orgName'] : '',
		);
	}

	/**
	 * List the credential's chat surfaces (for the admin assistant picker).
	 *
	 * Returns the raw rows (id, productId, productName, name, ...); callers
	 * shape them for their UI.
	 *
	 * @param string $credential Bearer credential.
	 * @return array<int,array<string,mixed>>|WP_Error
	 */
	public function list_chat_surfaces( $credential ) {
		$data = $this->request(
			'GET',
			'/v1/surfaces',
			$credential,
			null,
			array(
				'type'  => 'chat',
				'limit' => 100,
			)
		);
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		if ( isset( $data['data'] ) && is_array( $data['data'] ) ) {
			return array_values( array_filter( $data['data'], 'is_array' ) );
		}
		return array();
	}

	/**
	 * Resolve a chat surface into what a mint needs: its product, and the
	 * enabled agent/flow capabilities the token must carry to authenticate
	 * against it (chat auth requires the token's agents/flows to overlap the
	 * surface's enabled capabilities; the surface id alone is only policy).
	 *
	 * `agents` pairs each agent id with its surface-facing label (the item's
	 * exposedName/capabilityName) for UIs that let a block pick among the
	 * surface's agents — the only agents a token minted from this surface can
	 * authenticate as.
	 *
	 * @param string $credential Bearer credential.
	 * @param string $surface_id Chat surface id.
	 * @return array{product_id:string,agent_ids:array<int,string>,flow_ids:array<int,string>,agents:array<int,array{id:string,name:string}>}|WP_Error
	 */
	public function describe_chat_surface( $credential, $surface_id ) {
		$surface_id = trim( (string) $surface_id );
		if ( '' === $surface_id ) {
			return new WP_Error( 'persona_assistant_surface_no_id', __( 'Choose a chat surface before connecting.', 'persona-assistant' ) );
		}

		$surfaces = $this->list_chat_surfaces( $credential );
		if ( is_wp_error( $surfaces ) ) {
			return $surfaces;
		}

		$product_id = '';
		foreach ( $surfaces as $surface ) {
			if ( isset( $surface['id'] ) && (string) $surface['id'] === $surface_id ) {
				$product_id = isset( $surface['productId'] ) ? (string) $surface['productId'] : '';
				break;
			}
		}
		if ( '' === $product_id ) {
			return new WP_Error( 'persona_assistant_surface_gone', __( 'The selected chat surface no longer exists on Runtype. Refresh the list and choose another.', 'persona-assistant' ) );
		}

		$detail = $this->request(
			'GET',
			'/v1/products/' . rawurlencode( $product_id ) . '/surfaces/' . rawurlencode( $surface_id ),
			$credential
		);
		if ( is_wp_error( $detail ) ) {
			return $detail;
		}

		$agents   = array();
		$flow_ids = array();
		$items    = isset( $detail['items'] ) && is_array( $detail['items'] ) ? $detail['items'] : array();
		foreach ( $items as $item ) {
			if ( ! is_array( $item ) || empty( $item['enabled'] ) ) {
				continue;
			}
			if ( ! empty( $item['agentId'] ) ) {
				$agent_id = (string) $item['agentId'];
				if ( ! isset( $agents[ $agent_id ] ) ) {
					$name = '';
					if ( ! empty( $item['exposedName'] ) ) {
						$name = (string) $item['exposedName'];
					} elseif ( ! empty( $item['capabilityName'] ) ) {
						$name = (string) $item['capabilityName'];
					}
					$agents[ $agent_id ] = array(
						'id'   => $agent_id,
						'name' => '' !== $name ? $name : $agent_id,
					);
				}
			} elseif ( ! empty( $item['flowId'] ) ) {
				$flow_ids[] = (string) $item['flowId'];
			}
		}

		return array(
			'product_id' => $product_id,
			'agent_ids'  => array_keys( $agents ),
			'flow_ids'   => array_values( array_unique( $flow_ids ) ),
			'agents'     => array_values( $agents ),
		);
	}

	/**
	 * Best-effort revoke (delete) of a client token.
	 *
	 * @param string $credential Bearer credential.
	 * @param string $id         Client-token id.
	 * @return array<string,mixed>|WP_Error
	 */
	public function revoke( $credential, $id ) {
		if ( '' === (string) $id ) {
			return new WP_Error( 'persona_assistant_revoke_no_id', __( 'No client-token id to revoke.', 'persona-assistant' ) );
		}
		return $this->request( 'DELETE', '/v1/client-tokens/' . rawurlencode( $id ), $credential );
	}

}
