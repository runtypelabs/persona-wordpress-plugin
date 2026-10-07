<?php
/**
 * Signed WordPress account identity for Runtype client chats.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Persona_Assistant_Identity {
	const KEYS_OPTION = 'persona_assistant_identity_keys';
	const STATE_OPTION = 'persona_assistant_identity_state';
	const LOCK_OPTION = 'persona_assistant_identity_key_lock';
	const TOKEN_TTL = 300;
	const ROTATION_DELAY = 120;
	const KEY_OVERLAP = 900;

	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public static function issuer() {
		return untrailingslashit( rest_url( 'persona-assistant/v1/identity' ) );
	}

	public static function jwks_url() {
		return rest_url( 'persona-assistant/v1/identity/jwks' );
	}

	public static function audience() {
		return 'persona-assistant:' . hash( 'sha256', self::issuer() );
	}

	/** Publicly addressable HTTPS is required; actual reachability is checked by Runtype. */
	public static function environment_error() {
		foreach ( array( self::issuer(), self::jwks_url() ) as $url ) {
			$host = strtolower( (string) wp_parse_url( $url, PHP_URL_HOST ) );
			if ( 'https' !== wp_parse_url( $url, PHP_URL_SCHEME ) || '' === $host
				|| 'localhost' === $host || false === strpos( $host, '.' )
				|| preg_match( '/\.(localhost|local|test|internal)$/', $host )
				|| ( filter_var( trim( $host, '[]' ), FILTER_VALIDATE_IP ) && ! filter_var( trim( $host, '[]' ), FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) ) ) {
				return new WP_Error( 'persona_assistant_identity_https', __( 'WordPress user identity requires a public HTTPS issuer and JWKS URL that Runtype can reach. Localhost, private addresses, and HTTP sites are not supported.', 'persona-assistant' ), array( 'status' => 503 ) );
			}
		}
		if ( ! function_exists( 'openssl_pkey_new' ) || ! function_exists( 'openssl_sign' ) ) {
			return new WP_Error( 'persona_assistant_identity_openssl', __( 'WordPress user identity requires the PHP OpenSSL extension.', 'persona-assistant' ), array( 'status' => 503 ) );
		}
		return null;
	}

	public static function state() {
		$state = get_option( self::STATE_OPTION, array() );
		return is_array( $state ) ? $state : array();
	}

	public static function registered() {
		$state = self::state();
		return ! empty( $state['id'] ) && isset( $state['issuer'], $state['api_base'] )
			&& self::issuer() === $state['issuer'] && persona_assistant_get_api_base() === $state['api_base'];
	}

	public static function enabled() {
		return 'runtype' === persona_assistant_resolve_mode()
			&& ! empty( persona_assistant_get_setting( 'identity_enabled', false ) )
			&& self::registered() && ! self::environment_error();
	}

	/** Registration metadata never contains a signing key or a user token. */
	private static function store_result( $id, $message ) {
		$state = self::state();
		if ( null !== $id ) {
			$state['id'] = $id;
			$state['issuer'] = self::issuer();
			$state['api_base'] = persona_assistant_get_api_base();
		}
		$state['last_result'] = $message;
		$state['updated_at'] = time();
		update_option( self::STATE_OPTION, $state, false );
	}

	public static function integration_payload() {
		return array(
			'name' => substr( 'WordPress: ' . wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ), 0, 255 ),
			'provider' => 'oidc',
			'descriptor' => array(
				'kind' => 'oidc-jwt',
				'issuer' => self::issuer(),
				'jwksUri' => self::jwks_url(),
				'audience' => self::audience(),
				'allowedAlgorithms' => array( 'RS256' ),
				'claimMap' => array( 'subject' => 'sub', 'email' => 'email' ),
			),
		);
	}

	/** Register once, update on reconnect, and recover an existing issuer after a 409. */
	public static function register_integration() {
		$error = self::environment_error();
		if ( ! $error ) {
			$keys = self::keys();
			$error = is_wp_error( $keys ) ? $keys : null;
		}
		$credential = $error ? $error : Persona_Assistant_Credential::resolve_mint_credential();
		if ( ! $error && '' !== persona_assistant_get_api_key() ) {
			$credential = persona_assistant_get_api_key();
		}
		if ( is_wp_error( $credential ) ) {
			self::store_result( null, $credential->get_error_message() );
			return $credential;
		}
		$api = new Persona_Assistant_Runtype();
		$state = self::state();
		$id = self::registered() ? $state['id'] : '';
		$result = $api->save_identity_integration( $credential, self::integration_payload(), $id );
		if ( is_wp_error( $result ) ) {
			$data = $result->get_error_data();
			$status = is_array( $data ) && isset( $data['status'] ) ? (int) $data['status'] : 0;
			if ( 404 === $status && $id ) {
				$result = $api->save_identity_integration( $credential, self::integration_payload() );
				$data = is_wp_error( $result ) ? $result->get_error_data() : array();
				$status = isset( $data['status'] ) ? (int) $data['status'] : 0;
			}
			if ( 409 === $status ) {
				$list = $api->list_identity_integrations( $credential );
				if ( ! is_wp_error( $list ) ) {
					foreach ( $list as $integration ) {
						if ( isset( $integration['issuer'], $integration['provider'], $integration['id'], $integration['status'] ) && self::issuer() === $integration['issuer'] && 'oidc' === $integration['provider'] && 'active' === $integration['status'] ) {
							$result = $api->save_identity_integration( $credential, self::integration_payload(), $integration['id'] );
							break;
						}
					}
				}
			}
		}
		if ( is_wp_error( $result ) ) {
			$message = $result->get_error_message() . ' ' . __( 'If Login with Runtype cannot manage identity integrations, register the configuration below using a Runtype API key with INTEGRATIONS:READ and INTEGRATIONS:WRITE, then save the returned integration ID.', 'persona-assistant' );
			self::store_result( null, $message );
			return new WP_Error( 'persona_assistant_identity_registration', $message );
		}
		if ( empty( $result['id'] ) || ! is_string( $result['id'] ) ) {
			$error = new WP_Error( 'persona_assistant_identity_registration', __( 'Runtype did not return an identity integration ID.', 'persona-assistant' ) );
			self::store_result( null, $error->get_error_message() );
			return $error;
		}
		self::store_result( $result['id'], __( 'Identity integration registered with Runtype.', 'persona-assistant' ) );
		return $result;
	}

	/** Manual registration supports sites using pasted tokens or restricted OAuth credentials. */
	public static function use_manual_integration( $id ) {
		$error = self::environment_error();
		if ( $error ) {
			return $error;
		}
		if ( ! preg_match( '/^idint_[A-Za-z0-9_-]+$/', $id ) ) {
			return new WP_Error( 'persona_assistant_identity_id', __( 'Enter the identity integration ID returned by Runtype (idint_…).', 'persona-assistant' ) );
		}
		$keys = self::keys();
		if ( is_wp_error( $keys ) ) {
			return $keys;
		}
		self::store_result( $id, __( 'Manually registered integration saved. Verification will be checked by Runtype when a user chats.', 'persona-assistant' ) );
		return true;
	}

	private static function base64url( $value ) {
		return rtrim( strtr( base64_encode( $value ), '+/', '-_' ), '=' );
	}

	private static function generate_key() {
		if ( ! function_exists( 'openssl_pkey_new' ) ) {
			return new WP_Error( 'persona_assistant_identity_key', __( 'The PHP OpenSSL extension is unavailable.', 'persona-assistant' ), array( 'status' => 503 ) );
		}
		$key = openssl_pkey_new( array( 'private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA ) );
		$private = '';
		$details = $key ? openssl_pkey_get_details( $key ) : false;
		if ( ! $key || ! $details || ! isset( $details['rsa'] ) || ! openssl_pkey_export( $key, $private ) ) {
			return new WP_Error( 'persona_assistant_identity_key', __( 'Could not create the identity signing key.', 'persona-assistant' ), array( 'status' => 503 ) );
		}
		return array(
			'private' => $private,
			'public' => array(
				'kty' => 'RSA', 'kid' => hash( 'sha256', $details['key'] ), 'use' => 'sig', 'alg' => 'RS256',
				'n' => self::base64url( $details['rsa']['n'] ), 'e' => self::base64url( $details['rsa']['e'] ),
			),
		);
	}

	/** Atomic creation prevents simultaneous first requests publishing different keys. */
	private static function keys() {
		$keys = get_option( self::KEYS_OPTION, false );
		if ( false !== $keys ) {
			return is_array( $keys ) && isset( $keys['current']['private'], $keys['current']['public'] )
				? $keys : new WP_Error( 'persona_assistant_identity_key', __( 'The stored identity key is invalid.', 'persona-assistant' ), array( 'status' => 503 ) );
		}
		$key = self::generate_key();
		if ( is_wp_error( $key ) ) {
			return $key;
		}
		$keys = array( 'current' => $key );
		if ( ! add_option( self::KEYS_OPTION, $keys, '', false ) ) {
			wp_cache_delete( self::KEYS_OPTION, 'options' );
			$stored = get_option( self::KEYS_OPTION, false );
			return is_array( $stored ) && isset( $stored['current']['private'], $stored['current']['public'] ) ? $stored : new WP_Error( 'persona_assistant_identity_key', __( 'Could not store the identity signing key.', 'persona-assistant' ), array( 'status' => 503 ) );
		}
		return $keys;
	}

	/** Publish the new key before signing with it; retain the old key during overlap. */
	public static function rotate_keys() {
		$held = (int) get_option( self::LOCK_OPTION, 0 );
		if ( $held && $held < time() - 30 ) {
			delete_option( self::LOCK_OPTION );
		}
		if ( ! add_option( self::LOCK_OPTION, time(), '', false ) ) {
			return new WP_Error( 'persona_assistant_identity_busy', __( 'A signing key rotation is already in progress.', 'persona-assistant' ) );
		}
		try {
			$keys = self::keys();
			if ( is_wp_error( $keys ) ) {
				return $keys;
			}
			if ( ! empty( $keys['switch_at'] ) && time() < $keys['switch_at'] + self::KEY_OVERLAP ) {
				return new WP_Error( 'persona_assistant_identity_busy', __( 'Wait until the previous key rotation has completed before rotating again.', 'persona-assistant' ) );
			}
			$key = self::generate_key();
			if ( is_wp_error( $key ) ) {
				return $key;
			}
			$active = self::signing_key( $keys );
			$keys = array( 'current' => $key, 'previous' => $active, 'switch_at' => time() + self::ROTATION_DELAY );
			if ( ! update_option( self::KEYS_OPTION, $keys, false ) ) {
				return new WP_Error( 'persona_assistant_identity_key', __( 'Could not store the rotated signing key.', 'persona-assistant' ) );
			}
			return true;
		} finally {
			delete_option( self::LOCK_OPTION );
		}
	}

	private static function signing_key( $keys ) {
		return isset( $keys['switch_at'], $keys['previous'] ) && time() < $keys['switch_at'] ? $keys['previous'] : $keys['current'];
	}

	public function register_routes() {
		register_rest_route( 'persona-assistant/v1', '/identity/jwks', array(
			'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'jwks' ), 'permission_callback' => '__return_true',
		) );
		register_rest_route( 'persona-assistant/v1', '/identity/token', array(
			'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'token' ), 'permission_callback' => array( $this, 'permission' ),
		) );
	}

	public function jwks() {
		$keys = self::keys();
		if ( is_wp_error( $keys ) ) {
			return $keys;
		}
		$public = array( $keys['current']['public'] );
		if ( isset( $keys['previous'], $keys['switch_at'] ) && time() < $keys['switch_at'] + self::KEY_OVERLAP ) {
			$public[] = $keys['previous']['public'];
		}
		return new WP_REST_Response( array( 'keys' => $public ), 200, array( 'Cache-Control' => 'public, max-age=60, must-revalidate' ) );
	}

	public function permission( $request ) {
		if ( ! is_user_logged_in() ) {
			return new WP_Error( 'persona_assistant_identity_login', __( 'Sign in to request an identity token.', 'persona-assistant' ), array( 'status' => 401 ) );
		}
		if ( ! wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' ) ) {
			return new WP_Error( 'persona_assistant_identity_nonce', __( 'The identity request nonce is invalid.', 'persona-assistant' ), array( 'status' => 403 ) );
		}
		if ( ! self::enabled() ) {
			return new WP_Error( 'persona_assistant_identity_disabled', __( 'WordPress user identity is not available.', 'persona-assistant' ), array( 'status' => 403 ) );
		}
		return true;
	}

	public function token( $request ) {
		// Defense in depth for callers that invoke the callback directly.
		$permission = $this->permission( $request );
		if ( is_wp_error( $permission ) ) {
			return $permission;
		}
		$limit = min( 60, max( 1, (int) apply_filters( 'persona_assistant_identity_token_rate_limit', 10 ) ) );
		$bucket = 'persona_assistant_identity_rate_' . get_current_user_id() . '_' . floor( time() / MINUTE_IN_SECONDS );
		$count = (int) get_transient( $bucket );
		if ( $count >= $limit ) {
			return new WP_Error( 'persona_assistant_identity_rate', __( 'Too many identity requests. Please try again in a minute.', 'persona-assistant' ), array( 'status' => 429 ) );
		}
		set_transient( $bucket, $count + 1, 2 * MINUTE_IN_SECONDS );
		$keys = self::keys();
		if ( is_wp_error( $keys ) ) {
			return $keys;
		}
		$user = wp_get_current_user();
		$sub = apply_filters( 'persona_assistant_identity_subject', 'wp:' . $user->ID, $user );
		$now = time();
		$required = array( 'iss' => self::issuer(), 'sub' => $sub, 'aud' => self::audience(), 'iat' => $now, 'exp' => $now + self::TOKEN_TTL );
		$claims = $required;
		if ( persona_assistant_get_setting( 'identity_share_email', true ) && '' !== $user->user_email ) {
			$claims['email'] = $user->user_email;
		}
		$claims = apply_filters( 'persona_assistant_identity_claims', $claims, $user );
		if ( ! is_array( $claims ) || ! is_string( $sub ) || '' === trim( $sub ) ) {
			return new WP_Error( 'persona_assistant_identity_claims', __( 'The identity claims are invalid.', 'persona-assistant' ), array( 'status' => 500 ) );
		}
		// Extensions can add claims, but cannot override issuer/audience/lifetime or email opt-out.
		$claims = array_merge( $claims, $required );
		if ( ! persona_assistant_get_setting( 'identity_share_email', true ) ) {
			unset( $claims['email'] );
		}
		$key = self::signing_key( $keys );
		$header = wp_json_encode( array( 'alg' => 'RS256', 'typ' => 'JWT', 'kid' => $key['public']['kid'] ) );
		$payload = wp_json_encode( $claims );
		if ( false === $payload || false === $header ) {
			return new WP_Error( 'persona_assistant_identity_claims', __( 'Could not encode the identity claims.', 'persona-assistant' ), array( 'status' => 500 ) );
		}
		$input = self::base64url( $header ) . '.' . self::base64url( $payload );
		$signature = '';
		if ( ! openssl_sign( $input, $signature, $key['private'], OPENSSL_ALGO_SHA256 ) ) {
			return new WP_Error( 'persona_assistant_identity_sign', __( 'Could not sign the identity token.', 'persona-assistant' ), array( 'status' => 503 ) );
		}
		$token = $input . '.' . self::base64url( $signature );
		if ( strlen( $token ) > 8192 ) {
			return new WP_Error( 'persona_assistant_identity_size', __( 'The identity token is too large.', 'persona-assistant' ), array( 'status' => 500 ) );
		}
		return new WP_REST_Response( array( 'token' => $token, 'expiresAt' => $required['exp'] ), 200, array( 'Cache-Control' => 'no-store, private', 'Pragma' => 'no-cache' ) );
	}
}
