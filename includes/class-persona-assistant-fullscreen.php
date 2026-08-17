<?php
/**
 * Full-screen assistant Page: native Page creation and plugin template.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Owns the optional full-screen WordPress Page surface.
 */
class Persona_Assistant_Fullscreen {

	/** Post meta marking Pages created by this plugin. */
	const MANAGED_META = '_persona_assistant_managed_assistant_page';

	/** @var Persona_Assistant_Frontend Front-end widget controller. */
	private $frontend;

	/**
	 * Register hooks.
	 *
	 * @param Persona_Assistant_Frontend $frontend Front-end widget controller.
	 */
	public function __construct( Persona_Assistant_Frontend $frontend ) {
		$this->frontend = $frontend;

		add_action( 'template_redirect', array( $this, 'prepare_preview' ) );
		add_filter( 'template_include', array( $this, 'template_include' ), 99 );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_style' ), 20 );
		add_filter( 'show_admin_bar', array( $this, 'show_admin_bar' ) );
		add_action( 'admin_post_persona_assistant_create_assistant_page', array( $this, 'handle_create_page' ) );
		add_action( 'admin_notices', array( $this, 'admin_notice' ) );
		add_action( 'before_delete_post', array( $this, 'maybe_clear_deleted_page' ) );
	}

	/**
	 * Use the plugin's document template for the configured WordPress Page.
	 *
	 * @param string $template Theme-selected template.
	 * @return string
	 */
	public function template_include( $template ) {
		if ( ! persona_assistant_is_assistant_page() && ! persona_assistant_is_fullscreen_preview() ) {
			return $template;
		}

		$fullscreen_template = PERSONA_ASSISTANT_DIR . 'templates/fullscreen-assistant.php';
		return file_exists( $fullscreen_template ) ? $fullscreen_template : $template;
	}

	/**
	 * Load the small host-page stylesheet on the assistant Page only.
	 *
	 * The widget bundle loads its own scoped styles; this stylesheet only gives
	 * its mount node a definite viewport height and removes theme page chrome.
	 *
	 * @return void
	 */
	public function enqueue_style() {
		if ( ! persona_assistant_is_assistant_page() && ! persona_assistant_is_fullscreen_preview() ) {
			return;
		}

		$this->frontend->enqueue_fullscreen();

		wp_enqueue_style(
			'persona-assistant-fullscreen',
			PERSONA_ASSISTANT_URL . 'assets/css/fullscreen.css',
			array(),
			persona_assistant_asset_version( 'assets/css/fullscreen.css' )
		);
	}

	/**
	 * Normalize WordPress's front-page query before rendering the preview.
	 *
	 * @return void
	 */
	public function prepare_preview() {
		if ( ! persona_assistant_is_fullscreen_preview() ) {
			return;
		}

		status_header( 200 );
		nocache_headers();
		if ( isset( $GLOBALS['wp_query'] ) ) {
			$GLOBALS['wp_query']->is_404 = false;
		}
	}

	/**
	 * Keep wp-admin chrome outside the preview document.
	 *
	 * @param bool $show Whether WordPress intends to show the admin bar.
	 * @return bool
	 */
	public function show_admin_bar( $show ) {
		return persona_assistant_is_fullscreen_preview() ? false : $show;
	}

	/**
	 * Create and publish a native WordPress Page, then assign it to Persona.
	 *
	 * @return void
	 */
	public function handle_create_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'persona-assistant' ) );
		}
		check_admin_referer( 'persona_assistant_create_assistant_page' );

		$settings = persona_assistant_get_settings();
		$page_id  = absint( $settings['assistant_page_id'] );
		$page     = $page_id ? get_post( $page_id ) : null;

		if ( $page instanceof WP_Post && 'page' === $page->post_type && 'trash' !== $page->post_status ) {
			$this->queue_notice( __( 'The selected assistant Page already exists.', 'persona-assistant' ), 'info' );
			$this->redirect_back();
		}

		$page_id = wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => __( 'Assistant', 'persona-assistant' ),
				'post_content' => __( 'This page is powered by Persona Assistant while the plugin is active.', 'persona-assistant' ),
				'meta_input'   => array(
					self::MANAGED_META => 1,
				),
			),
			true
		);

		if ( is_wp_error( $page_id ) ) {
			$this->queue_notice( __( 'The assistant Page could not be created. Please create a Page manually and select it here.', 'persona-assistant' ), 'error' );
			$this->redirect_back();
		}

		$settings['assistant_page_id'] = (int) $page_id;
		update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings );

		$this->queue_notice( __( 'The full-screen assistant Page was created and published.', 'persona-assistant' ), 'success' );
		$this->redirect_back();
	}

	/**
	 * Clear a stale Page assignment when that Page is permanently deleted.
	 *
	 * Trashing is intentionally non-destructive: restoring the Page restores the
	 * assistant surface. Permanent deletion clears only the stored reference.
	 *
	 * @param int $post_id Post being permanently deleted.
	 * @return void
	 */
	public function maybe_clear_deleted_page( $post_id ) {
		if ( absint( $post_id ) !== persona_assistant_get_assistant_page_id() ) {
			return;
		}

		$settings                      = persona_assistant_get_settings();
		$settings['assistant_page_id'] = 0;
		update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings );
	}

	/**
	 * Show a one-shot result from the create-Page action.
	 *
	 * @return void
	 */
	public function admin_notice() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$notice = get_transient( $this->notice_key() );
		if ( ! is_array( $notice ) || empty( $notice['message'] ) ) {
			return;
		}
		delete_transient( $this->notice_key() );

		$type = isset( $notice['type'] ) && in_array( $notice['type'], array( 'success', 'error', 'warning', 'info' ), true )
			? $notice['type']
			: 'info';
		printf(
			'<div class="notice notice-%1$s is-dismissible"><p>%2$s</p></div>',
			esc_attr( $type ),
			esc_html( $notice['message'] )
		);
	}

	/**
	 * Persist a user-specific notice across the admin-post redirect.
	 *
	 * @param string $message Notice text.
	 * @param string $type    Notice type.
	 * @return void
	 */
	private function queue_notice( $message, $type ) {
		set_transient(
			$this->notice_key(),
			array(
				'message' => (string) $message,
				'type'    => (string) $type,
			),
			MINUTE_IN_SECONDS
		);
	}

	/**
	 * User-specific transient key.
	 *
	 * @return string
	 */
	private function notice_key() {
		return 'persona_assistant_page_notice_' . get_current_user_id();
	}

	/**
	 * Return to Persona Assistant settings.
	 *
	 * @return void
	 */
	private function redirect_back() {
		wp_safe_redirect( admin_url( 'options-general.php?page=' . Persona_Assistant_Settings::PAGE_SLUG . '&view=assistant' ) );
		exit;
	}
}
