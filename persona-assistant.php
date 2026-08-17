<?php
/**
 * Plugin Name:       Persona Assistant
 * Plugin URI:        https://github.com/runtypelabs/persona-wordpress-plugin
 * Description:       Add a customizable AI assistant to your site.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            Runtype
 * Author URI:        https://runtype.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       persona-assistant
 * Domain Path:       /languages
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PERSONA_ASSISTANT_VERSION', '1.0.0' );
define( 'PERSONA_ASSISTANT_PERSONA_VERSION', '4.18.0-dev' );
define( 'PERSONA_ASSISTANT_FILE', __FILE__ );
define( 'PERSONA_ASSISTANT_DIR', plugin_dir_path( __FILE__ ) );
define( 'PERSONA_ASSISTANT_URL', plugin_dir_url( __FILE__ ) );
define( 'PERSONA_ASSISTANT_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Flag first activation so the admin can offer a direct setup action.
 *
 * @return void
 */
function persona_assistant_activate() {
	Persona_Assistant_History::activate();
	set_transient( 'persona_assistant_just_activated', true, DAY_IN_SECONDS );
	if ( false === get_option( 'persona_assistant_setup', false ) ) {
		$existing_settings = get_option( 'persona_assistant_settings', null );
		$already_configured = is_array( $existing_settings );
		$setup_state = array(
			'completed' => $already_configured,
			'migrated'  => $already_configured,
		);
		$setup_state[ $already_configured ? 'completed_at' : 'started_at' ] = time();
		update_option(
			'persona_assistant_setup',
			$setup_state,
			false
		);
	}
}
register_activation_hook( __FILE__, 'persona_assistant_activate' );

/** Stop recurring retention work when the plugin is inactive. */
function persona_assistant_deactivate() {
	Persona_Assistant_History::deactivate();
}
register_deactivation_hook( __FILE__, 'persona_assistant_deactivate' );

/**
 * The locally bundled Persona widget installer script.
 *
 * WordPress.org does not permit remotely hosted non-service JavaScript. Persona
 * is therefore shipped with the plugin at the exact version tested above. Sites
 * with a reviewed self-hosted build may override this constant in wp-config.php.
 */
if ( ! defined( 'PERSONA_ASSISTANT_INSTALL_URL' ) ) {
	define( 'PERSONA_ASSISTANT_INSTALL_URL', PERSONA_ASSISTANT_URL . 'assets/vendor/persona/install.global.js' );
}

/**
 * Default Runtype API base. Override per-site with the PERSONA_ASSISTANT_API_BASE
 * constant (wp-config.php) or the "API base" setting.
 */
if ( ! defined( 'PERSONA_ASSISTANT_DEFAULT_API_BASE' ) ) {
	define( 'PERSONA_ASSISTANT_DEFAULT_API_BASE', 'https://api.runtype.com' );
}

/**
 * Public OAuth client id for "Login with Runtype" (Authorization Code + PKCE).
 *
 * Operator-seeded, first-party, no client secret. The plugin is a public
 * client and proves control of its origin via site verification instead.
 */
if ( ! defined( 'PERSONA_ASSISTANT_OAUTH_CLIENT_ID' ) ) {
	define( 'PERSONA_ASSISTANT_OAUTH_CLIENT_ID', 'rt_wordpress_persona' );
}

require_once PERSONA_ASSISTANT_DIR . 'includes/helpers.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-credential.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-runtype.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-ai.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-history.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-rest.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-webmcp.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-frontend.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-fullscreen.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-privacy.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-settings.php';
require_once PERSONA_ASSISTANT_DIR . 'includes/class-persona-assistant-plugin.php';

/**
 * Boot the plugin.
 *
 * @return Persona_Assistant_Plugin
 */
function persona_assistant() {
	return Persona_Assistant_Plugin::instance();
}

persona_assistant();
