<?php
/**
 * Uninstall cleanup: remove the plugin's options.
 *
 * Best-effort revocation of any minted Runtype client token is intentionally
 * NOT performed here (no outbound network calls during uninstall). Revoke the
 * token from the Runtype dashboard if you no longer want it to be valid.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

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
