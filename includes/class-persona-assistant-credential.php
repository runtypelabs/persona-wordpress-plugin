<?php
/**
 * Credential resolution: maps the chosen "source" to a server-side credential
 * the mint engine can use, and houses the (designed-for, not-yet-built) OAuth seam.
 *
 * The whole point of this layer is that `api_key` and `oauth` both resolve to a
 * bearer credential that feeds the IDENTICAL mint engine, so shipping "Login
 * with Runtype" later requires no widget or mint changes, only wiring this seam.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Resolves a credential source to a usable bearer credential.
 */
class Persona_Assistant_Credential {

	const SOURCE_OAUTH        = 'oauth';
	const SOURCE_API_KEY      = 'api_key';
	const SOURCE_CLIENT_TOKEN = 'client_token';

	/** Refresh the access token this many seconds before it actually expires. */
	const OAUTH_EXPIRY_SKEW = 120;

	/** Atomic single-flight lock option for token refresh. */
	const OAUTH_REFRESH_LOCK = 'persona_assistant_oauth_refresh_lock';

	/** Seconds after which a held refresh lock is treated as stale (crashed worker). */
	const OAUTH_REFRESH_LOCK_TTL = 30;

	/**
	 * Derive the active credential source from what is actually configured.
	 *
	 * There is no stored "source" setting: the source falls out of the state and
	 * settings. OAuth tokens win, then a pasted/constant client token, then an
	 * available API key (constant or legacy stored). With nothing configured the
	 * default is OAuth, the "not connected yet" state the connect button targets.
	 *
	 * @return string
	 */
	public static function source() {
		// A wp-config.php constant is deliberate developer configuration and
		// outranks everything, including a connected Login with Runtype session
		// and the settings UI collapses to a "configured in code" note when it is
		// set, so runtime behavior must match what that note promises.
		if ( defined( 'PERSONA_ASSISTANT_CLIENT_TOKEN' ) && PERSONA_ASSISTANT_CLIENT_TOKEN ) {
			return self::SOURCE_CLIENT_TOKEN;
		}

		$state = persona_assistant_get_state();
		if ( ! empty( $state['oauth_access_token'] ) || ! empty( $state['oauth_refresh_token'] ) ) {
			return self::SOURCE_OAUTH;
		}

		if ( '' !== trim( (string) persona_assistant_get_setting( 'client_token', '' ) ) ) {
			return self::SOURCE_CLIENT_TOKEN;
		}

		if ( '' !== persona_assistant_get_api_key() ) {
			return self::SOURCE_API_KEY;
		}

		return self::SOURCE_OAUTH;
	}

	/**
	 * Does the active source mint a client token from a server-side credential?
	 *
	 * `client_token` is a pasted token (nothing to mint); `api_key`/`oauth` mint.
	 *
	 * @return bool
	 */
	public static function source_mints() {
		return in_array( self::source(), array( self::SOURCE_OAUTH, self::SOURCE_API_KEY ), true );
	}

	/**
	 * Resolve the bearer credential used to mint a client token.
	 *
	 * @return string|WP_Error The credential, or an error explaining what's missing.
	 */
	public static function resolve_mint_credential() {
		switch ( self::source() ) {
			case self::SOURCE_API_KEY:
				$key = persona_assistant_get_api_key();
				if ( '' === $key ) {
					return new WP_Error(
						'persona_assistant_no_api_key',
						__( 'No Runtype API key is configured.', 'persona-assistant' )
					);
				}
				return $key;

			case self::SOURCE_OAUTH:
				return self::oauth_credential();

			default:
				return new WP_Error(
					'persona_assistant_source_no_mint',
					__( 'The selected source does not mint client tokens.', 'persona-assistant' )
				);
		}
	}

	/**
	 * OAuth seam: "Login with Runtype" (Tier 1: Authorization Code + PKCE).
	 *
	 * Returns a VALID scoped access token, refreshing first (single-flighted)
	 * when the stored one is within the expiry skew. The token is a bearer
	 * credential that feeds the identical mint engine.
	 *
	 * @return string|WP_Error
	 */
	public static function oauth_credential() {
		$state   = persona_assistant_get_state();
		$access  = isset( $state['oauth_access_token'] ) ? (string) $state['oauth_access_token'] : '';
		$refresh = isset( $state['oauth_refresh_token'] ) ? (string) $state['oauth_refresh_token'] : '';

		if ( '' === $access && '' === $refresh ) {
			return new WP_Error(
				'persona_assistant_oauth_not_connected',
				__( 'Login with Runtype is not connected yet.', 'persona-assistant' )
			);
		}

		$expires_at    = isset( $state['oauth_expires_at'] ) ? (int) $state['oauth_expires_at'] : 0;
		$needs_refresh = ( 0 === $expires_at ) || ( ( $expires_at - self::OAUTH_EXPIRY_SKEW ) <= time() );

		if ( ! $needs_refresh && '' !== $access ) {
			return $access;
		}

		if ( '' === $refresh ) {
			// Nothing to refresh with; hand back a possibly-stale token if any.
			if ( '' !== $access ) {
				return $access;
			}
			return new WP_Error(
				'persona_assistant_oauth_reconnect',
				__( 'Login with Runtype needs to be reconnected.', 'persona-assistant' )
			);
		}

		return self::refresh_access_token( $refresh, $access, $expires_at );
	}

	/**
	 * Single-flight refresh of the rotating token pair.
	 *
	 * Refresh tokens rotate and the server burns the family on replay, so at most
	 * one request may refresh at a time. An atomic add_option() lock coordinates
	 * this: losers briefly wait for the winner to publish the rotated pair, then
	 * fall back to the current token rather than double-refreshing.
	 *
	 * @param string $refresh        Current refresh token.
	 * @param string $current_access Current (possibly-stale) access token.
	 * @param int    $current_expiry Current access-token expiry (unix), 0 if unknown.
	 * @return string|WP_Error Fresh (or acceptably-current) access token, or error.
	 */
	private static function refresh_access_token( $refresh, $current_access, $current_expiry ) {
		// add_option is atomic: it returns false if the lock already exists.
		$acquired = add_option( self::OAUTH_REFRESH_LOCK, time(), '', 'no' );

		if ( ! $acquired ) {
			// Reclaim a lock orphaned by a crashed worker.
			wp_cache_delete( self::OAUTH_REFRESH_LOCK, 'options' );
			$held = (int) get_option( self::OAUTH_REFRESH_LOCK, 0 );
			if ( $held > 0 && ( time() - $held ) > self::OAUTH_REFRESH_LOCK_TTL ) {
				delete_option( self::OAUTH_REFRESH_LOCK );
				$acquired = add_option( self::OAUTH_REFRESH_LOCK, time(), '', 'no' );
			}
		}

		if ( ! $acquired ) {
			// Another request is refreshing. Wait briefly for it to publish, then
			// re-read state; if still stale, use the current token (never refresh twice).
			$deadline = microtime( true ) + 5.0;
			while ( microtime( true ) < $deadline ) {
				usleep( 250000 );
				wp_cache_delete( self::OAUTH_REFRESH_LOCK, 'options' );
				if ( false === get_option( self::OAUTH_REFRESH_LOCK, false ) ) {
					break; // Winner released the lock.
				}
			}
			wp_cache_delete( PERSONA_ASSISTANT_STATE_OPTION, 'options' );
			$fresh   = persona_assistant_get_state();
			$access  = isset( $fresh['oauth_access_token'] ) ? (string) $fresh['oauth_access_token'] : '';
			$expiry  = isset( $fresh['oauth_expires_at'] ) ? (int) $fresh['oauth_expires_at'] : 0;
			if ( '' !== $access && ( $expiry - self::OAUTH_EXPIRY_SKEW ) > time() ) {
				return $access;
			}
			if ( '' !== $access ) {
				return $access; // Proceed without refresh rather than burning the family.
			}
			if ( '' !== $current_access ) {
				return $current_access;
			}
			return new WP_Error(
				'persona_assistant_oauth_refresh_busy',
				__( 'A Runtype login refresh is already in progress. Please try again in a moment.', 'persona-assistant' )
			);
		}

		try {
			// Re-read under the lock: another request may have rotated just before us.
			wp_cache_delete( PERSONA_ASSISTANT_STATE_OPTION, 'options' );
			$latest         = persona_assistant_get_state();
			$latest_access  = isset( $latest['oauth_access_token'] ) ? (string) $latest['oauth_access_token'] : '';
			$latest_refresh = isset( $latest['oauth_refresh_token'] ) ? (string) $latest['oauth_refresh_token'] : '';
			$latest_expiry  = isset( $latest['oauth_expires_at'] ) ? (int) $latest['oauth_expires_at'] : 0;

			if ( '' !== $latest_access && ( $latest_expiry - self::OAUTH_EXPIRY_SKEW ) > time() ) {
				return $latest_access;
			}

			$refresh = ( '' !== $latest_refresh ) ? $latest_refresh : $refresh;

			$runtype = new Persona_Assistant_Runtype();
			$result  = $runtype->refresh_token( $refresh );

			if ( is_wp_error( $result ) ) {
				return self::handle_refresh_error( $result, $current_access, $current_expiry );
			}

			// Persist the rotated pair atomically.
			$patch                          = self::state_from_token_response( $result );
			$patch['oauth_needs_reconnect'] = 0;
			$merged                         = persona_assistant_merge_state( $patch );

			if ( isset( $merged['oauth_access_token'] ) && '' !== (string) $merged['oauth_access_token'] ) {
				return (string) $merged['oauth_access_token'];
			}
			return '' !== $current_access ? $current_access : new WP_Error(
				'persona_assistant_oauth_refresh_failed',
				__( 'Runtype did not return a refreshed access token.', 'persona-assistant' )
			);
		} finally {
			delete_option( self::OAUTH_REFRESH_LOCK );
		}
	}

	/**
	 * Decide how to treat a refresh failure.
	 *
	 * An OAuth-level 4xx rejection (e.g. invalid_grant, a burned refresh family)
	 * clears the OAuth state and flags "reconnect required"; a transient network
	 * error leaves the tokens intact and hands back the current token if usable.
	 * The minted `client_token` is NEVER cleared here; it keeps working.
	 *
	 * @param WP_Error $error          Refresh error.
	 * @param string   $current_access Current access token.
	 * @param int      $current_expiry Current access-token expiry (unix).
	 * @return string|WP_Error
	 */
	private static function handle_refresh_error( $error, $current_access, $current_expiry ) {
		$data   = $error->get_error_data();
		$status = ( is_array( $data ) && isset( $data['status'] ) ) ? (int) $data['status'] : 0;
		$is_oauth_rejection = ( 'persona_assistant_oauth_error' === $error->get_error_code() ) && $status >= 400 && $status < 500;

		if ( $is_oauth_rejection ) {
			persona_assistant_merge_state(
				array(
					'oauth_access_token'       => '',
					'oauth_refresh_token'      => '',
					'oauth_expires_at'         => 0,
					'oauth_refresh_expires_at' => 0,
					'oauth_needs_reconnect'    => 1,
				)
			);
			return new WP_Error(
				'persona_assistant_oauth_reconnect',
				__( 'Login with Runtype needs to be reconnected.', 'persona-assistant' )
			);
		}

		// Transient failure: keep the tokens, use the current one while still valid.
		if ( '' !== $current_access && ( 0 === $current_expiry || $current_expiry > time() ) ) {
			return $current_access;
		}
		return $error;
	}

	/**
	 * Map an OAuth token response into state keys.
	 *
	 * Shared by the initial code exchange and the refresh path so both persist
	 * the same shape. Absolute expiries are derived from the relative lifetimes.
	 *
	 * @param array<string,mixed> $token Token response from the API.
	 * @return array<string,mixed> State patch (only present fields).
	 */
	public static function state_from_token_response( array $token ) {
		$now   = time();
		$patch = array();

		if ( isset( $token['access_token'] ) && is_string( $token['access_token'] ) ) {
			$patch['oauth_access_token'] = $token['access_token'];
		}
		if ( isset( $token['refresh_token'] ) && is_string( $token['refresh_token'] ) ) {
			$patch['oauth_refresh_token'] = $token['refresh_token'];
		}
		if ( isset( $token['expires_in'] ) && is_numeric( $token['expires_in'] ) ) {
			$patch['oauth_expires_at'] = $now + (int) $token['expires_in'];
		}
		if ( isset( $token['refresh_token_expires_in'] ) && is_numeric( $token['refresh_token_expires_in'] ) ) {
			$patch['oauth_refresh_expires_at'] = $now + (int) $token['refresh_token_expires_in'];
		}
		if ( isset( $token['user_id'] ) && is_string( $token['user_id'] ) ) {
			$patch['oauth_user_id'] = $token['user_id'];
		}

		return $patch;
	}
}
