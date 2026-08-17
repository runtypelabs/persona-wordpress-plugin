<?php
/**
 * Privacy-policy guidance for site owners.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Registers suggested privacy-policy text in WordPress. */
class Persona_Assistant_Privacy {

	/** Register hooks. */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'add_policy_content' ) );
	}

	/** Add text to Settings > Privacy > Policy Guide. */
	public function add_policy_content() {
		if ( ! function_exists( 'wp_add_privacy_policy_content' ) ) {
			return;
		}

		$content  = '<p>' . esc_html__( 'When visitors use the assistant, their messages and any files they attach are sent to the AI service selected by the site owner. Persona Assistant itself does not collect telemetry.', 'persona-assistant' ) . '</p>';
		$content .= '<p>' . esc_html__( 'In Runtype mode, messages, attachments, page context, and tool results may be sent to Runtype and its configured AI providers. In WordPress AI mode, that content is sent through the WordPress AI Client to the connector selected in WordPress. Retention and processing depend on those services and the site owner\'s configuration.', 'persona-assistant' ) . '</p>';
		$content .= '<p>' . esc_html__( 'Depending on the site configuration, text-only conversation history may be kept in session storage for the current tab, in local storage on the visitor\'s device, or (only for logged-in WordPress AI users who are offered account history) in dedicated WordPress database tables. Browser and account history exclude attachments, inline file data, reasoning, tool calls, tool results, artifacts, and execution metadata.', 'persona-assistant' ) . '</p>';
		$content .= '<p>' . esc_html__( 'Account history is private to its WordPress user, follows the retention period selected by the site owner, and is included in WordPress personal-data export and erasure tools. Runtype session transcripts are not duplicated in WordPress; Runtype retention settings apply to them.', 'persona-assistant' ) . '</p>';
		$content .= '<p>' . sprintf(
			/* translators: 1: privacy URL, 2: terms URL. */
			wp_kses_post( __( 'Runtype service information: <a href="%1$s">Privacy Policy</a> and <a href="%2$s">Terms of Service</a>.', 'persona-assistant' ) ),
			esc_url( 'https://www.runtype.com/privacy' ),
			esc_url( 'https://www.runtype.com/terms' )
		) . '</p>';

		wp_add_privacy_policy_content( 'Persona Assistant', wp_kses_post( $content ) );
	}
}
