<?php
/**
 * Plugin bootstrap singleton: wires the admin, front-end, REST, and block.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main plugin container.
 */
final class Persona_Assistant_Plugin {

	/**
	 * Singleton instance.
	 *
	 * @var Persona_Assistant_Plugin|null
	 */
	private static $instance = null;

	/**
	 * Admin settings controller (admin requests only).
	 *
	 * @var Persona_Assistant_Settings|null
	 */
	public $settings = null;

	/**
	 * Front-end controller.
	 *
	 * @var Persona_Assistant_Frontend
	 */
	public $frontend;

	/**
	 * REST controller (WP-AI mode).
	 *
	 * @var Persona_Assistant_REST
	 */
	public $rest;

	/**
	 * Privacy-first account history controller.
	 *
	 * @var Persona_Assistant_History
	 */
	public $history;

	/**
	 * WebMCP controller (page tools; Runtype mode only).
	 *
	 * @var Persona_Assistant_WebMCP
	 */
	public $webmcp;

	/**
	 * Full-screen assistant Page controller.
	 *
	 * @var Persona_Assistant_Fullscreen
	 */
	public $fullscreen;

	/** @var Persona_Assistant_Privacy */
	public $privacy;

	/**
	 * Get (or create) the singleton.
	 *
	 * @return Persona_Assistant_Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Wire hooks. Constructors of the sub-controllers only register hooks.
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'register_block' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_data' ) );
		add_filter( 'plugin_action_links_' . PERSONA_ASSISTANT_BASENAME, array( $this, 'plugin_action_links' ) );

		$this->history  = new Persona_Assistant_History();
		$this->frontend = new Persona_Assistant_Frontend( $this->history );
		$this->fullscreen = new Persona_Assistant_Fullscreen( $this->frontend );
		$this->rest     = new Persona_Assistant_REST( $this->history );
		$this->webmcp   = new Persona_Assistant_WebMCP();
		$this->privacy  = new Persona_Assistant_Privacy();

		if ( is_admin() ) {
			$this->settings = new Persona_Assistant_Settings();
		}
	}

	/**
	 * Register the optional build-free dynamic block, reusing the front-end render path.
	 *
	 * @return void
	 */
	public function register_block() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}
		if ( ! file_exists( PERSONA_ASSISTANT_DIR . 'blocks/persona-assistant/block.json' ) ) {
			return;
		}
		wp_register_script(
			'persona-assistant-block-widget',
			persona_assistant_vendor_asset_url( 'index.global.js' ),
			array(),
			PERSONA_ASSISTANT_PERSONA_VERSION,
			true
		);
		wp_register_style(
			'persona-assistant-block-widget-style',
			persona_assistant_vendor_asset_url( 'widget.css' ),
			array(),
			PERSONA_ASSISTANT_PERSONA_VERSION
		);
		register_block_type(
			PERSONA_ASSISTANT_DIR . 'blocks/persona-assistant',
			array(
				'render_callback' => array( $this->frontend, 'render_block' ),
			)
		);
	}

	/**
	 * Add a direct Settings link on the Plugins screen.
	 *
	 * @param array<int,string> $links Existing links.
	 * @return array<int,string>
	 */
	public function plugin_action_links( $links ) {
		array_unshift(
			$links,
			sprintf(
				'<a href="%1$s">%2$s</a>',
				esc_url( admin_url( 'options-general.php?page=' . Persona_Assistant_Settings::PAGE_SLUG ) ),
				esc_html__( 'Settings', 'persona-assistant' )
			)
		);
		return $links;
	}

	/**
	 * Supply connected-agent choices and preview copy to the block editor.
	 *
	 * @return void
	 */
	public function enqueue_block_editor_data() {
		$settings = persona_assistant_get_settings();
		$mode     = persona_assistant_resolve_mode();

		// A per-block override can only name an agent the minted token
		// authenticates as, and the token carries exactly the bound surface's
		// enabled agents — so those (stored at mint time) are the options.
		// Any wider list (e.g. all the org's agents) would offer choices that
		// fail chat auth at runtime.
		$state    = persona_assistant_get_state();
		$agents   = isset( $state['surface_agents'] ) && is_array( $state['surface_agents'] ) ? $state['surface_agents'] : array();
		$options  = array(
			array(
				'label' => __( 'Use the default agent', 'persona-assistant' ),
				'value' => '',
			),
		);
		foreach ( $agents as $agent ) {
			if ( ! is_array( $agent ) || empty( $agent['id'] ) ) {
				continue;
			}
			$id        = (string) $agent['id'];
			$options[] = array(
				'label' => ! empty( $agent['name'] ) ? (string) $agent['name'] : $id,
				'value' => $id,
			);
		}

		$preview_config = persona_assistant_widget_config( 'preview', null, true );
		$preview_config['autoFocusInput'] = false;
		$preview_config['launcher'] = array_merge(
			isset( $preview_config['launcher'] ) && is_array( $preview_config['launcher'] ) ? $preview_config['launcher'] : array(),
			array(
				'enabled'    => false,
				'fullHeight' => true,
				'width'      => '100%',
				'height'     => '100%',
			)
		);
		$preview = array(
			'config' => $preview_config,
		);
		if ( 'runtype' === $mode ) {
			$preview['clientToken'] = persona_assistant_effective_client_token();
			$preview['apiUrl']      = esc_url_raw( persona_assistant_get_api_base() );
		} elseif ( 'demo' === $mode ) {
			$preview['clientToken'] = 'ct_demo';
			$preview['apiUrl']      = esc_url_raw( persona_assistant_demo_api_base() );
		} elseif ( 'wordpress_ai' === $mode ) {
			$preview['apiUrl'] = esc_url_raw( rest_url( Persona_Assistant_REST::NAMESPACE . Persona_Assistant_REST::ROUTE ) );
		}

		wp_localize_script(
			'persona-assistant-widget-editor-script',
			'PersonaAssistantBlockData',
			array(
				'agentOptions' => $options,
				'mode'         => $mode,
				'modeLabel'    => array(
					'runtype'      => __( 'Runtype', 'persona-assistant' ),
					'wordpress_ai' => __( 'WordPress AI', 'persona-assistant' ),
					'demo'         => __( 'Demo mode', 'persona-assistant' ),
					'disabled'     => __( 'Not connected', 'persona-assistant' ),
				),
				'preview'      => $preview,
				'accent'       => (string) $settings['theme_color'],
				// Mirror the widget's real defaults so the editor preview matches
				// what a blank field actually renders.
				'welcomeTitle' => '' !== (string) $settings['welcome_title'] ? (string) $settings['welcome_title'] : __( 'Hello 👋', 'persona-assistant' ),
				'placeholder'  => '' !== (string) $settings['input_placeholder'] ? (string) $settings['input_placeholder'] : __( 'How can I help...', 'persona-assistant' ),
				'isReady'      => 'disabled' !== $mode,
				'isSitewide'   => persona_assistant_sitewide_enabled(),
				'placementMode' => (string) $settings['placement_mode'],
				'siteWpAiSystemPrompt' => (string) $settings['wp_ai_system_prompt'],
				'settingsUrl'  => admin_url( 'options-general.php?page=' . Persona_Assistant_Settings::PAGE_SLUG ),
			)
		);
	}
}
