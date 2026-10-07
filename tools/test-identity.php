<?php
/** Run in a disposable WordPress: wp eval-file wp-content/plugins/wordpress-persona/tools/test-identity.php */

if ( ! defined( 'ABSPATH' ) || ! class_exists( 'Persona_Assistant_Identity' ) ) {
	throw new RuntimeException( 'Load WordPress and activate Persona Assistant first.' );
}

function persona_identity_test_assert( $condition, $message ) {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
	echo 'PASS: ' . $message . "\n";
}
function persona_identity_test_decode( $value ) {
	return base64_decode( strtr( $value, '-_', '+/' ) );
}
function persona_identity_test_asn1( $tag, $value ) {
	$length = strlen( $value );
	$encoded = $length < 128 ? chr( $length ) : chr( 0x82 ) . pack( 'n', $length );
	return chr( $tag ) . $encoded . $value;
}
function persona_identity_test_pem( $jwk ) {
	$n = persona_identity_test_decode( $jwk['n'] );
	$e = persona_identity_test_decode( $jwk['e'] );
	$rsa = persona_identity_test_asn1( 0x30, persona_identity_test_asn1( 2, "\0" . $n ) . persona_identity_test_asn1( 2, $e ) );
	$algorithm = hex2bin( '300d06092a864886f70d0101010500' );
	$spki = persona_identity_test_asn1( 0x30, $algorithm . persona_identity_test_asn1( 3, "\0" . $rsa ) );
	return "-----BEGIN PUBLIC KEY-----\n" . chunk_split( base64_encode( $spki ), 64, "\n" ) . "-----END PUBLIC KEY-----\n";
}

$option_names = array( 'home', 'siteurl', PERSONA_ASSISTANT_SETTINGS_OPTION, PERSONA_ASSISTANT_STATE_OPTION, Persona_Assistant_Identity::KEYS_OPTION, Persona_Assistant_Identity::STATE_OPTION, Persona_Assistant_Identity::LOCK_OPTION );
$saved = array();
foreach ( $option_names as $name ) {
	$saved[ $name ] = get_option( $name, null );
}
$original_user = get_current_user_id();
$user_id = 0;
$test_origin = 'https://identity.example.com';
$rest_url_hook = function ( $url, $path ) use ( &$test_origin ) { return $test_origin . '/wp-json/' . ltrim( $path, '/' ); };
$http_hook = null;
$claims_hook = null;
$subject_hook = null;
$limit_hook = null;
try {
	// The disposable fixture must not call a configured live Runtype account.
	remove_all_actions( 'add_option_' . PERSONA_ASSISTANT_SETTINGS_OPTION );
	remove_all_actions( 'update_option_' . PERSONA_ASSISTANT_SETTINGS_OPTION );
	add_filter( 'rest_url', $rest_url_hook, PHP_INT_MAX, 2 );
	update_option( 'home', 'https://identity.example.com' );
	update_option( 'siteurl', 'https://identity.example.com' );
	$settings = persona_assistant_default_settings();
	$settings['ai_backend'] = 'runtype';
	$settings['client_token'] = 'ct_identity_test';
	$settings['identity_enabled'] = true;
	update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings, false );
	update_option( PERSONA_ASSISTANT_STATE_OPTION, array(), false );
	delete_option( Persona_Assistant_Identity::KEYS_OPTION );
	delete_option( Persona_Assistant_Identity::LOCK_OPTION );
	update_option( Persona_Assistant_Identity::STATE_OPTION, array( 'id' => 'idint_test', 'issuer' => Persona_Assistant_Identity::issuer(), 'api_base' => persona_assistant_get_api_base() ), false );
	$user_id = wp_insert_user( array( 'user_login' => 'identity-test-' . wp_generate_password( 8, false ), 'user_pass' => wp_generate_password(), 'user_email' => 'identity-test@example.com', 'role' => 'subscriber' ) );
	persona_identity_test_assert( ! is_wp_error( $user_id ), 'Create test user' );
	wp_set_current_user( $user_id );
	$identity = new Persona_Assistant_Identity();
	$generous_limit = function () { return 60; };
	add_filter( 'persona_assistant_identity_token_rate_limit', $generous_limit );
	$request = new WP_REST_Request( 'POST', '/persona-assistant/v1/identity/token' );
	persona_identity_test_assert( 403 === $identity->permission( $request )->get_error_data()['status'], 'Missing nonce is rejected' );
	$request->set_header( 'X-WP-Nonce', wp_create_nonce( 'wp_rest' ) );
	$request->set_param( 'userId', 1 );
	persona_identity_test_assert( true === $identity->permission( $request ), 'Logged-in user with REST nonce is admitted' );
	$response = $identity->token( $request );
	persona_identity_test_assert( $response instanceof WP_REST_Response, 'Issue token' );
	$data = $response->get_data();
	$parts = explode( '.', $data['token'] );
	$header = json_decode( persona_identity_test_decode( $parts[0] ), true );
	$claims = json_decode( persona_identity_test_decode( $parts[1] ), true );
	$jwks = $identity->jwks()->get_data();
	$pem = persona_identity_test_pem( $jwks['keys'][0] );
	persona_identity_test_assert( 1 === openssl_verify( $parts[0] . '.' . $parts[1], persona_identity_test_decode( $parts[2] ), $pem, OPENSSL_ALGO_SHA256 ), 'RS256 signature verifies independently using the public JWKS parameters' );
	persona_identity_test_assert( 1 !== openssl_verify( $parts[0] . '.' . $parts[1] . 'tampered', persona_identity_test_decode( $parts[2] ), $pem, OPENSSL_ALGO_SHA256 ), 'Tampering invalidates the signature' );
	persona_identity_test_assert( 'RS256' === $header['alg'] && $header['kid'] === $jwks['keys'][0]['kid'], 'JWT key ID matches published public key' );
	persona_identity_test_assert( 'wp:' . $user_id === $claims['sub'] && Persona_Assistant_Identity::issuer() === $claims['iss'] && Persona_Assistant_Identity::audience() === $claims['aud'], 'Claims use current user and exact issuer/audience; body user ID is ignored' );
	persona_identity_test_assert( 300 === $claims['exp'] - $claims['iat'] && $data['expiresAt'] === $claims['exp'], 'Token expires after five minutes' );
	persona_identity_test_assert( 'identity-test@example.com' === $claims['email'], 'Email is shared by default when identity is on' );
	persona_identity_test_assert( false === strpos( wp_json_encode( $jwks ), 'PRIVATE' ) && ! isset( $jwks['keys'][0]['d'] ), 'JWKS exposes public parameters only' );
	persona_identity_test_assert( 'no-store, private' === $response->get_headers()['Cache-Control'], 'Token responses prohibit caching' );
	global $wpdb;
	$autoload = $wpdb->get_var( $wpdb->prepare( "SELECT autoload FROM {$wpdb->options} WHERE option_name = %s", Persona_Assistant_Identity::KEYS_OPTION ) );
	persona_identity_test_assert( in_array( $autoload, array( 'no', 'off', 'auto-off' ), true ), 'Private keys are stored without autoload' );

	$settings['identity_share_email'] = false;
	update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings, false );
	$claims_hook = function ( $claims ) { $claims['email'] = 'override@example.com'; $claims['exp'] = time() + 999999; $claims['iss'] = 'https://attacker.example'; $claims['custom'] = 'value'; return $claims; };
	add_filter( 'persona_assistant_identity_claims', $claims_hook );
	$subject_hook = function () { return 'stable-custom-subject'; };
	add_filter( 'persona_assistant_identity_subject', $subject_hook );
	$filtered = $identity->token( $request )->get_data();
	$filtered_claims = json_decode( persona_identity_test_decode( explode( '.', $filtered['token'] )[1] ), true );
	persona_identity_test_assert( ! isset( $filtered_claims['email'] ) && 300 === $filtered_claims['exp'] - $filtered_claims['iat'] && Persona_Assistant_Identity::issuer() === $filtered_claims['iss'], 'Email opt-out and security claims survive extension filters' );
	persona_identity_test_assert( 'stable-custom-subject' === $filtered_claims['sub'] && 'value' === $filtered_claims['custom'], 'Custom subject and additional claims work' );
	remove_filter( 'persona_assistant_identity_claims', $claims_hook );
	remove_filter( 'persona_assistant_identity_subject', $subject_hook );

	persona_identity_test_assert( true === Persona_Assistant_Identity::rotate_keys(), 'Key rotation succeeds' );
	$rotated = $identity->jwks()->get_data();
	persona_identity_test_assert( 2 === count( $rotated['keys'] ), 'JWKS publishes old and new public keys during overlap' );
	$rotation_token = $identity->token( $request )->get_data();
	$rotation_header = json_decode( persona_identity_test_decode( explode( '.', $rotation_token['token'] )[0] ), true );
	persona_identity_test_assert( $header['kid'] === $rotation_header['kid'], 'Signing waits for JWKS caches before switching' );
	persona_identity_test_assert( is_wp_error( Persona_Assistant_Identity::rotate_keys() ), 'Overlapping rotations are rejected' );
	$keys = get_option( Persona_Assistant_Identity::KEYS_OPTION );
	$keys['switch_at'] = time() - 1;
	update_option( Persona_Assistant_Identity::KEYS_OPTION, $keys, false );
	$rotation_token = $identity->token( $request )->get_data();
	$rotation_parts = explode( '.', $rotation_token['token'] );
	$rotation_header = json_decode( persona_identity_test_decode( $rotation_parts[0] ), true );
	persona_identity_test_assert( $rotated['keys'][0]['kid'] === $rotation_header['kid'] && 1 === openssl_verify( $rotation_parts[0] . '.' . $rotation_parts[1], persona_identity_test_decode( $rotation_parts[2] ), persona_identity_test_pem( $rotated['keys'][0] ), OPENSSL_ALGO_SHA256 ), 'Signing switches to the new public key' );
	$keys['switch_at'] = time() - 901;
	update_option( Persona_Assistant_Identity::KEYS_OPTION, $keys, false );
	persona_identity_test_assert( 1 === count( $identity->jwks()->get_data()['keys'] ), 'Old public key leaves JWKS after overlap' );

	$history = new Persona_Assistant_History();
	$first = $history->localized_data( 'fullscreen' );
	wp_set_current_user( 1 );
	$second = $history->localized_data( 'fullscreen' );
	persona_identity_test_assert( $first['storageKey'] !== $second['storageKey'] && $first['sessionKey'] !== $second['sessionKey'], 'Account switches partition local transcripts and sessions' );
	wp_set_current_user( 0 );
	persona_identity_test_assert( 401 === $identity->permission( $request )->get_error_data()['status'], 'Anonymous token requests are rejected' );
	wp_set_current_user( $user_id );
	$settings['identity_enabled'] = false;
	update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings, false );
	persona_identity_test_assert( 403 === $identity->permission( $request )->get_error_data()['status'], 'Identity-off setting blocks tokens' );
	$settings['identity_enabled'] = true;
	$settings['ai_backend'] = 'wordpress_ai';
	update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings, false );
	persona_identity_test_assert( ! Persona_Assistant_Identity::enabled(), 'WordPress AI never enables Runtype identity' );
	$settings['ai_backend'] = 'runtype';
	update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings, false );
	$test_origin = 'http://localhost';
	persona_identity_test_assert( is_wp_error( Persona_Assistant_Identity::environment_error() ), 'HTTP/localhost issuer is rejected' );
	$test_origin = 'https://identity.example.com';
	$limit_hook = function () { return 1; };
	add_filter( 'persona_assistant_identity_token_rate_limit', $limit_hook, 20 );
	$rate = $identity->token( $request );
	persona_identity_test_assert( is_wp_error( $rate ) && 429 === $rate->get_error_data()['status'], 'Token rate limit returns 429' );
	remove_filter( 'persona_assistant_identity_token_rate_limit', $limit_hook, 20 );

	// Exercise the real HTTP client without sending a request to a live account.
	$settings['client_token'] = '';
	update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings, false );
	update_option( PERSONA_ASSISTANT_STATE_OPTION, array( 'oauth_access_token' => 'fixture-access', 'oauth_expires_at' => time() + 3600 ), false );
	$calls = array();
	$scenario = 'update';
	$http_hook = function ( $preempt, $args, $url ) use ( &$calls, &$scenario ) {
		$calls[] = array( 'method' => $args['method'], 'url' => $url, 'body' => isset( $args['body'] ) ? json_decode( $args['body'], true ) : null );
		$status = 200;
		$body = array( 'id' => 'idint_existing' );
		if ( 'conflict' === $scenario && 'POST' === $args['method'] ) { $status = 409; $body = array( 'error' => 'duplicate issuer' ); }
		if ( 'GET' === $args['method'] ) { $body = array( 'identityIntegrations' => array( array( 'id' => 'idint_existing', 'issuer' => Persona_Assistant_Identity::issuer(), 'provider' => 'oidc', 'status' => 'active' ) ) ); }
		if ( 'denied' === $scenario ) { $status = 401; $body = array( 'error' => 'Unauthorized' ); }
		return array( 'response' => array( 'code' => $status ), 'body' => wp_json_encode( $body ), 'headers' => array() );
	};
	add_filter( 'pre_http_request', $http_hook, 10, 3 );
	$registered = Persona_Assistant_Identity::register_integration();
	persona_identity_test_assert( ! is_wp_error( $registered ) && 'PATCH' === $calls[0]['method'] && 'active' === $calls[0]['body']['status'], 'Reconnect updates the existing identity integration' );
	delete_option( Persona_Assistant_Identity::STATE_OPTION );
	$calls = array();
	$scenario = 'conflict';
	$registered = Persona_Assistant_Identity::register_integration();
	persona_identity_test_assert( ! is_wp_error( $registered ) && array( 'POST', 'GET', 'PATCH' ) === array_column( $calls, 'method' ), 'Duplicate issuer is recovered without changing integration namespace' );
	$scenario = 'denied';
	$registered = Persona_Assistant_Identity::register_integration();
	persona_identity_test_assert( is_wp_error( $registered ) && false !== strpos( Persona_Assistant_Identity::state()['last_result'], 'API key' ), 'Restricted OAuth exposes manual registration guidance' );
	persona_identity_test_assert( true === Persona_Assistant_Identity::use_manual_integration( 'idint_manual' ) && Persona_Assistant_Identity::registered(), 'Manual registration supports restricted credentials' );
	persona_identity_test_assert( is_wp_error( Persona_Assistant_Identity::use_manual_integration( '../bad' ) ), 'Invalid manual integration ID is rejected' );

	// Frontend localization carries routing and a nonce, never user claims or keys.
	update_option( PERSONA_ASSISTANT_STATE_OPTION, array(), false );
	$settings['client_token'] = 'ct_identity_test';
	update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings, false );
	$frontend = new Persona_Assistant_Frontend( $history );
	$build_data = new ReflectionMethod( $frontend, 'build_data' );
	$build_data->setAccessible( true );
	foreach ( array( 'frontend', 'fullscreen' ) as $context ) {
		$localized = $build_data->invoke( $frontend, $context );
		persona_identity_test_assert( isset( $localized['identity']['provider'] ) && 'oidc' === $localized['identity']['provider'] && wp_verify_nonce( $localized['identity']['nonce'], 'wp_rest' ), $context . ' localization includes identity with a valid nonce' );
		$serialized = wp_json_encode( $localized );
		persona_identity_test_assert( false === strpos( $serialized, 'PRIVATE KEY' ) && false === strpos( $serialized, 'identity-test@example.com' ), $context . ' localization excludes signing keys and email' );
	}
	wp_set_current_user( 0 );
	persona_identity_test_assert( ! isset( $build_data->invoke( $frontend )['identity'] ), 'Anonymous frontend receives no identity options' );
	wp_set_current_user( $user_id );
	$settings['identity_enabled'] = false;
	update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings, false );
	persona_identity_test_assert( ! isset( $build_data->invoke( $frontend )['identity'] ), 'Identity-off frontend receives no identity options' );
	$settings['identity_enabled'] = true;
	update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings, false );

	$admin = new Persona_Assistant_Settings();
	$sanitized = $admin->sanitize( array( '_persona_assistant_scope' => 'connection', 'identity_enabled' => '1', 'identity_share_email' => '0' ) );
	persona_identity_test_assert( true === $sanitized['identity_enabled'] && false === $sanitized['identity_share_email'], 'Connection settings support email opt-out' );
	$sanitized = $admin->sanitize( array( '_persona_assistant_scope' => 'brand' ) );
	persona_identity_test_assert( $settings['identity_enabled'] === $sanitized['identity_enabled'] && $settings['identity_share_email'] === $sanitized['identity_share_email'], 'Unrelated settings saves preserve identity choices' );
	echo "Identity integration checks passed.\n";
} finally {
	remove_all_actions( 'add_option_' . PERSONA_ASSISTANT_SETTINGS_OPTION );
	remove_all_actions( 'update_option_' . PERSONA_ASSISTANT_SETTINGS_OPTION );
	if ( isset( $generous_limit ) ) { remove_filter( 'persona_assistant_identity_token_rate_limit', $generous_limit ); }
	remove_filter( 'rest_url', $rest_url_hook, PHP_INT_MAX );
	foreach ( array( 'pre_http_request' => $http_hook, 'persona_assistant_identity_claims' => $claims_hook, 'persona_assistant_identity_subject' => $subject_hook, 'persona_assistant_identity_token_rate_limit' => $limit_hook ) as $name => $callback ) {
		if ( $callback ) { remove_filter( $name, $callback ); }
	}
	if ( $user_id && ! is_wp_error( $user_id ) ) {
		delete_transient( 'persona_assistant_identity_rate_' . $user_id . '_' . floor( time() / MINUTE_IN_SECONDS ) );
		require_once ABSPATH . 'wp-admin/includes/user.php';
		wp_delete_user( $user_id );
	}
	foreach ( $saved as $name => $value ) {
		if ( null === $value ) { delete_option( $name ); } else { update_option( $name, $value ); }
	}
	wp_set_current_user( $original_user );
}
