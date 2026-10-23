<?php
/** Seed a disposable, local WordPress instance for the directory screenshots.
 * Run: wp eval-file wp-content/plugins/wordpress-persona/tools/screenshot-fixture.php
 * This intentionally changes the local site's title, front page and Persona settings.
 */
if ( ! defined( 'WP_CLI' ) || ! WP_CLI || ! in_array( wp_parse_url( home_url(), PHP_URL_HOST ), array( 'localhost', '127.0.0.1' ), true ) ) {
	exit( "Screenshot fixtures are restricted to local WP-CLI instances.\n" );
}
update_option( 'blogname', 'Flour & Stone' );
update_option( 'blogdescription', 'Slow mornings. Good bread.' );
update_option( 'permalink_structure', '/%postname%/' );
$pages = array();
foreach ( array( 'bakery' => 'Flour & Stone', 'assistant' => 'Bakery Assistant' ) as $slug => $title ) {
	$existing = get_page_by_path( $slug );
	$pages[ $slug ] = wp_insert_post( array( 'ID' => $existing ? $existing->ID : 0, 'post_title' => $title, 'post_name' => $slug, 'post_type' => 'page', 'post_status' => 'publish' ) );
}
update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', $pages['bakery'] );
$settings = array_merge( persona_assistant_default_settings(), array(
	'enabled' => true, 'placement_mode' => 'sitewide', 'assistant_page_id' => $pages['assistant'],
	'ai_backend' => 'auto', 'theme_color' => '#805238', 'chat_icon' => 'icon:sparkles',
	'header_title' => 'Flour & Stone', 'header_subtitle' => 'Your neighborhood bakery assistant',
	'welcome_title' => 'A little help, freshly baked.',
	'welcome_subtitle' => 'Ask about our bread, plan your visit, or find something for your table.',
	'input_placeholder' => 'What would you like to know?',
	'suggested_prompts' => "What’s fresh today?\nPlan my visit\nBread & ingredients",
	'launcher_teaser_text' => 'Good things start with a question.',
	'assistant_welcome_variant' => 'hero', 'assistant_content_width' => 'standard',
) );
update_option( PERSONA_ASSISTANT_SETTINGS_OPTION, $settings );
update_option( 'persona_assistant_setup', array( 'completed' => true, 'completed_at' => time() ) );
set_transient( 'persona_assistant_demo_probe', array( 'base' => persona_assistant_demo_api_base(), 'retired' => false ), 6 * HOUR_IN_SECONDS );
wp_mkdir_p( WPMU_PLUGIN_DIR );
file_put_contents( WPMU_PLUGIN_DIR . '/persona-screenshot-site.php', '<?php require ' . var_export( __DIR__ . '/screenshot-site.php', true ) . ';' );
flush_rewrite_rules();
WP_CLI::success( 'Bakery screenshot fixture ready. Demo responses remain clearly disclosed by Persona.' );
