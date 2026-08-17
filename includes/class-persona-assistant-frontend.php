<?php
/**
 * Front-end: enqueue the Persona installer, localize the resolved config, and
 * inject the widget mount point (site-wide footer, `[persona_assistant]` shortcode,
 * or the Gutenberg block).
 *
 * The `rt_` API key is NEVER localized, only the browser-safe `ct_` client
 * token (runtype mode) or the same-origin REST URL (wordpress_ai mode).
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Front-end controller.
 */
class Persona_Assistant_Frontend {

	const ROOT_ID = 'persona-assistant-root';

	/**
	 * Guards a single widget instance per page render.
	 *
	 * @var bool
	 */
	private $emitted = false;

	/** @var Persona_Assistant_History */
	private $history;

	/**
	 * Register hooks.
	 */
	public function __construct( Persona_Assistant_History $history ) {
		$this->history = $history;
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'wp_footer', array( $this, 'render_footer' ) );
		add_shortcode( 'persona_assistant', array( $this, 'shortcode' ) );
	}

	/**
	 * On `wp_enqueue_scripts`: load assets when the site-wide launcher is on.
	 *
	 * When the launcher is off, assets load only on demand for a shortcode/block
	 * (see ensure_enqueued()), so footer-disabled pages stay free of the script.
	 *
	 * @return void
	 */
	public function enqueue() {
		if ( persona_assistant_is_assistant_page() || persona_assistant_is_fullscreen_preview() ) {
			$this->enqueue_fullscreen();
			return;
		}
		if ( ! persona_assistant_sitewide_enabled() ) {
			return;
		}
		if ( 'disabled' === persona_assistant_resolve_mode() ) {
			return;
		}
		$this->do_enqueue( 'frontend' );
	}

	/**
	 * Register + enqueue the bootstrap (config composer) and the Persona installer.
	 *
	 * @param string $context Widget config context.
	 * @return void
	 */
	private function do_enqueue( $context = 'frontend' ) {
		if ( wp_script_is( 'persona-assistant-bootstrap', 'enqueued' ) ) {
			return;
		}

		wp_register_script(
			'persona-assistant-layouts',
			PERSONA_ASSISTANT_URL . 'assets/js/persona-layouts.js',
			array(),
			persona_assistant_asset_version( 'assets/js/persona-layouts.js' ),
			true
		);

		wp_register_script(
			'persona-assistant-history',
			PERSONA_ASSISTANT_URL . 'assets/js/persona-history.js',
			array(),
			persona_assistant_asset_version( 'assets/js/persona-history.js' ),
			true
		);

		$bootstrap_dependencies = array( 'persona-assistant-layouts', 'persona-assistant-history' );

		// The full-screen assistant mounts the widget bundle directly instead of
		// going through the installer: the installer always wraps the widget in
		// the fixed-width floating panel, which blocks the conversation-history
		// rail presentation. The bundle must load before the bootstrap, which
		// calls AgentWidget.initAgentWidget synchronously.
		$direct_mount = 'fullscreen' === $context;
		if ( $direct_mount ) {
			wp_enqueue_style(
				'persona-assistant-widget',
				persona_assistant_vendor_asset_url( 'widget.css' ),
				array(),
				PERSONA_ASSISTANT_PERSONA_VERSION
			);
			wp_register_script(
				'persona-assistant-widget',
				persona_assistant_vendor_asset_url( 'index.global.js' ),
				array(),
				PERSONA_ASSISTANT_PERSONA_VERSION,
				true
			);
			$bootstrap_dependencies[] = 'persona-assistant-widget';
		}

		wp_register_script(
			'persona-assistant-bootstrap',
			PERSONA_ASSISTANT_URL . 'assets/js/persona-bootstrap.js',
			$bootstrap_dependencies,
			persona_assistant_asset_version( 'assets/js/persona-bootstrap.js' ),
			true
		);
		wp_localize_script( 'persona-assistant-bootstrap', 'PersonaAssistantData', $this->build_data( $context ) );
		wp_enqueue_script( 'persona-assistant-bootstrap' );

		$installer_dependencies = array( 'persona-assistant-bootstrap' );
		if ( persona_assistant_is_fullscreen_preview() ) {
			wp_register_script(
				'persona-assistant-preview-frame',
				PERSONA_ASSISTANT_URL . 'assets/js/persona-preview-frame.js',
				array( 'persona-assistant-bootstrap' ),
				persona_assistant_asset_version( 'assets/js/persona-preview-frame.js' ),
				true
			);
			wp_localize_script(
				'persona-assistant-preview-frame',
				'PersonaAssistantPreviewFrame',
				array(
					'ajaxUrl' => admin_url( 'admin-ajax.php' ),
					'nonce'   => wp_create_nonce( 'persona_assistant_preview_config' ),
				)
			);
			wp_enqueue_script( 'persona-assistant-preview-frame' );
			$installer_dependencies[] = 'persona-assistant-preview-frame';
		}

		// The installer reads window.siteAgentConfig (set by the bootstrap), so it
		// depends on the bootstrap to guarantee ordering. The direct-mount path
		// skips it entirely: the bootstrap itself paints the widget there.
		if ( ! $direct_mount ) {
			wp_enqueue_script(
				'persona-assistant-installer',
				PERSONA_ASSISTANT_INSTALL_URL,
				$installer_dependencies,
				PERSONA_ASSISTANT_PERSONA_VERSION,
				true
			);
		}

		if ( ! persona_assistant_is_fullscreen_preview() ) {
			$this->maybe_enqueue_webmcp();
		}
	}

	/**
	 * Enqueue Persona for the configured full-screen Page.
	 *
	 * Public so the Page controller/template can guarantee the asset contract
	 * without duplicating credential or transport configuration.
	 *
	 * @return void
	 */
	public function enqueue_fullscreen() {
		if ( 'disabled' === persona_assistant_resolve_mode() ) {
			return;
		}
		$this->do_enqueue( 'fullscreen' );
	}

	/**
	 * Enqueue the WebMCP page-tools registration script (Runtype mode only).
	 *
	 * The script registers each manifest tool on `document.modelContext` once the
	 * widget has installed its polyfill; it depends on the bootstrap so it loads
	 * alongside the installer. Nothing is enqueued when the feature is inactive,
	 * so a WP-AI or unconfigured site never ships the script or the manifest.
	 *
	 * @return void
	 */
	private function maybe_enqueue_webmcp() {
		if ( ! persona_assistant_webmcp_active() ) {
			return;
		}
		if ( wp_script_is( 'persona-assistant-webmcp', 'enqueued' ) ) {
			return;
		}

		wp_register_script(
			'persona-assistant-webmcp',
			PERSONA_ASSISTANT_URL . 'assets/js/persona-webmcp.js',
			array( 'persona-assistant-bootstrap' ),
			persona_assistant_asset_version( 'assets/js/persona-webmcp.js' ),
			true
		);
		wp_localize_script( 'persona-assistant-webmcp', 'PersonaAssistantWebMCP', Persona_Assistant_WebMCP::localized_data() );
		wp_enqueue_script( 'persona-assistant-webmcp' );
	}

	/**
	 * Build the data localized to the browser. Never includes the API key.
	 *
	 * @return array<string,mixed>
	 */
	private function build_data( $context = 'frontend' ) {
		$mode     = persona_assistant_resolve_mode();
		$settings = persona_assistant_get_settings();
		$preview  = persona_assistant_is_fullscreen_preview();
		$config   = persona_assistant_widget_config( $context, null, $preview );
		if ( $preview ) {
			// An iframe preview should never steal focus or scroll the parent
			// settings page when it first mounts.
			$config['autoFocusInput'] = false;
		}

		$data = array(
			'mode'      => $mode,
			'target'    => '#' . self::ROOT_ID,
			// The whole nested widget config (launcher, welcome, suggestions,
			// copy, theme, darkTheme, colorScheme, features) from the single source of
			// truth. The bootstrap passes it through as the installer's `config`.
			'config'    => $config,
			'context'   => $context,
			'appearance' => 'fullscreen' === $context ? persona_assistant_page_appearance( $settings ) : array(),
			// Deep-set the site's body font onto config.theme in the browser so
			// chat matches the theme's typography (opt out via the filter).
			'matchFont' => (bool) apply_filters( 'persona_assistant_match_site_font', true ),
			// Pin the widget bundle + polyfill chunks to the installer's own
			// version (see persona_assistant_installer_version()).
			'version'   => persona_assistant_installer_version(),
			'localAssets' => 0 === strpos( PERSONA_ASSISTANT_INSTALL_URL, PERSONA_ASSISTANT_URL ),
			'history'     => $this->history->localized_data( $context, $preview ),
		);

		if ( 'runtype' === $mode ) {
			$data['clientToken'] = persona_assistant_effective_client_token();
			// The widget defaults to the production API; without this it would
			// ignore a staging/self-hosted PERSONA_ASSISTANT_API_BASE override.
			$data['apiUrl'] = esc_url_raw( persona_assistant_get_api_base() );
			if ( '' !== persona_assistant_effective_agent_id() ) {
				$data['agentId'] = persona_assistant_effective_agent_id();
			}
		} elseif ( 'wordpress_ai' === $mode ) {
			// Same-origin endpoint. Audience and rate-limit policy are enforced by
			// Persona_Assistant_REST before generation begins.
			$data['restUrl'] = esc_url_raw( rest_url( Persona_Assistant_REST::NAMESPACE . Persona_Assistant_REST::ROUTE ) );
		}

		return $data;
	}

	/**
	 * Render the site-wide footer instance (when enabled and nothing already emitted).
	 *
	 * @return void
	 */
	public function render_footer() {
		if ( persona_assistant_is_assistant_page() || persona_assistant_is_fullscreen_preview() ) {
			return;
		}
		if ( ! persona_assistant_sitewide_enabled() ) {
			return;
		}
		if ( 'disabled' === persona_assistant_resolve_mode() ) {
			return;
		}
		// Built from escaped parts in render_root().
		echo $this->render_root(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	/**
	 * Render the full-screen assistant mount.
	 *
	 * @return string
	 */
	public function render_fullscreen() {
		if ( 'disabled' === persona_assistant_resolve_mode() ) {
			return sprintf(
				'<div class="persona-assistant-fullscreen-unavailable" role="status"><h1>%1$s</h1><p>%2$s</p></div>',
				esc_html__( 'Assistant unavailable', 'persona-assistant' ),
				esc_html__( 'The assistant is not connected yet. Please try again later.', 'persona-assistant' )
			);
		}

		$this->enqueue_fullscreen();
		return $this->render_root( array( 'launcher' => 'false' ) );
	}

	/**
	 * Render the widget mount point. Single instance per request (first call wins).
	 *
	 * @param array<string,mixed> $attrs Optional per-instance overrides (agent/launcher).
	 * @return string
	 */
	public function render_root( $attrs = array() ) {
		if ( $this->emitted ) {
			return $this->render_editor_warning( __( 'Persona Assistant already appears on this page. Only the first instance is rendered.', 'persona-assistant' ) );
		}
		$this->emitted = true;

		$data_attrs = '';

		$agent = isset( $attrs['agent'] ) ? trim( (string) $attrs['agent'] ) : '';
		if ( '' !== $agent ) {
			$data_attrs .= sprintf( ' data-agent="%s"', esc_attr( $agent ) );
		}

		if ( isset( $attrs['launcher'] ) && '' !== (string) $attrs['launcher'] ) {
			$launcher = ( '1' === (string) $attrs['launcher'] || 'true' === strtolower( (string) $attrs['launcher'] ) ) ? 'true' : 'false';
			$data_attrs .= sprintf( ' data-launcher="%s"', esc_attr( $launcher ) );
		}

		return sprintf(
			'<div id="%1$s" class="persona-assistant-root"%2$s></div>',
			esc_attr( self::ROOT_ID ),
			$data_attrs
		);
	}

	/**
	 * `[persona_assistant agent="" launcher=""]` shortcode.
	 *
	 * `launcher` is empty by default, which renders chat inline where the
	 * shortcode is placed. Set `launcher="true"` to show a floating chat button
	 * instead (or `launcher="false"` to force inline).
	 *
	 * @param array<string,mixed>|string $atts Shortcode attributes.
	 * @return string
	 */
	public function shortcode( $atts ) {
		if ( 'disabled' === persona_assistant_resolve_mode() ) {
			return '';
		}
		if ( persona_assistant_sitewide_enabled() ) {
			return $this->render_editor_warning( __( 'The Persona Assistant site-wide launcher is already enabled, so this shortcode is not rendered.', 'persona-assistant' ) );
		}
		if ( 'manual' !== persona_assistant_get_setting( 'placement_mode', 'off' ) ) {
			return $this->render_editor_warning( __( 'Persona Assistant is not published. Choose block or shortcode placement in Persona Assistant settings.', 'persona-assistant' ) );
		}
		$this->ensure_enqueued();

		$atts = shortcode_atts(
			array(
				'agent'    => '',
				'launcher' => '',
			),
			$atts,
			'persona_assistant'
		);

		return $this->render_root( $atts );
	}

	/**
	 * Block render callback (build-free dynamic block). Reuses the shortcode path.
	 *
	 * @param array<string,mixed> $attributes Block attributes.
	 * @return string
	 */
	public function render_block( $attributes ) {
		if ( 'disabled' === persona_assistant_resolve_mode() ) {
			return '';
		}
		if ( persona_assistant_sitewide_enabled() ) {
			return $this->render_editor_warning( __( 'The Persona Assistant site-wide launcher is already enabled, so this block is not rendered.', 'persona-assistant' ) );
		}
		if ( 'manual' !== persona_assistant_get_setting( 'placement_mode', 'off' ) ) {
			return $this->render_editor_warning( __( 'Persona Assistant is not published. Choose block or shortcode placement in Persona Assistant settings.', 'persona-assistant' ) );
		}
		$this->ensure_enqueued();

		$attrs = array(
			'agent'    => isset( $attributes['agentId'] ) ? (string) $attributes['agentId'] : '',
			'launcher' => isset( $attributes['launcher'] ) ? ( $attributes['launcher'] ? '1' : '0' ) : '',
		);

		return $this->render_root( $attrs );
	}

	/**
	 * Ensure scripts are enqueued for a shortcode/block render (independent of the
	 * site-wide launcher toggle).
	 *
	 * @return void
	 */
	private function ensure_enqueued() {
		if ( 'disabled' === persona_assistant_resolve_mode() ) {
			return;
		}
		$this->do_enqueue();
	}

	/**
	 * Show placement mistakes to editors without exposing them to visitors.
	 *
	 * @param string $message Warning message.
	 * @return string
	 */
	private function render_editor_warning( $message ) {
		if ( current_user_can( 'edit_posts' ) ) {
			return sprintf(
				'<div class="persona-assistant-render-warning" role="status">%s</div>',
				esc_html( $message )
			);
		}
		return '<!-- Persona Assistant: another placement is already active. -->';
	}
}
