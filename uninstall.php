<?php
/**
 * Uninstall cleanup: remove the plugin's options.
 *
 * Best-effort revocation of any minted Runtype client token is intentionally
 * NOT performed here. Revoke the
 * token from the Runtype dashboard if you no longer want it to be valid.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Remove the identity integration while the server credential and signing keys
// still exist. Restricted OAuth or a disconnected account may require manual
// deletion in Runtype; local signing keys are always removed below.
require_once __DIR__ . '/persona-assistant.php';
if ( Persona_Assistant_Identity::registered() ) {
	$persona_assistant_identity_state = Persona_Assistant_Identity::state();
	$persona_assistant_identity_credential = '' !== persona_assistant_get_api_key() ? persona_assistant_get_api_key() : Persona_Assistant_Credential::resolve_mint_credential();
	if ( ! is_wp_error( $persona_assistant_identity_credential ) && '' !== $persona_assistant_identity_credential ) {
		$persona_assistant_identity_api = new Persona_Assistant_Runtype();
		$persona_assistant_identity_api->delete_identity_integration( $persona_assistant_identity_credential, $persona_assistant_identity_state['id'] );
	}
}
delete_option( Persona_Assistant_Identity::KEYS_OPTION );
delete_option( Persona_Assistant_Identity::STATE_OPTION );
delete_option( Persona_Assistant_Identity::LOCK_OPTION );

delete_option( 'persona_assistant_settings' );
delete_option( 'persona_assistant_runtype_state' );
delete_option( 'persona_assistant_history_schema' );
delete_option( 'persona_assistant_oauth_refresh_lock' );
delete_transient( 'persona_assistant_surfaces' );
delete_transient( 'persona_assistant_just_activated' );
delete_transient( 'persona_assistant_oauth_pkce' );
delete_transient( 'persona_assistant_oauth_challenge' );

global $wpdb;
$wpdb->query( 'DROP TABLE IF EXISTS ' . $wpdb->prefix . 'persona_assistant_messages' ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.SchemaChange,WordPress.DB.PreparedSQL.NotPrepared -- explicit plugin uninstall.
$wpdb->query( 'DROP TABLE IF EXISTS ' . $wpdb->prefix . 'persona_assistant_conversations' ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.SchemaChange,WordPress.DB.PreparedSQL.NotPrepared -- explicit plugin uninstall.

$timestamp = wp_next_scheduled( 'persona_assistant_history_cleanup' );
if ( $timestamp ) {
	wp_unschedule_event( $timestamp, 'persona_assistant_history_cleanup' );
}
