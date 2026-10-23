<?php
/** Isolated config contract: php tools/test-v5-config.php (no WordPress or network). */
define( 'ABSPATH', __DIR__ );
define( 'PERSONA_ASSISTANT_DEFAULT_API_BASE', 'https://example.test' );
define( 'MB_IN_BYTES', 1048576 );
function __( $text, $domain = '' ) { return $text; }
function absint( $value ) { return abs( (int) $value ); }
function wp_parse_args( $value, $defaults ) { return array_merge( $defaults, $value ); }
function get_option( $name, $default = false ) { return 'persona_assistant_settings' === $name ? array( 'client_token' => 'test' ) : $default; }
function get_bloginfo( $key ) { return 'Saved site'; }
function get_site_icon_url() { return ''; }
function wp_specialchars_decode( $text, $flags ) { return htmlspecialchars_decode( $text, $flags ); }
function esc_url_raw( $value ) { return $value; }
function apply_filters( $name, $value, ...$args ) {
	if ( 'persona_assistant_widget_config' === $name ) {
		check( true === $value['future']['v5Defaults'], 'V5 defaults are set before the public config filter' );
		if ( ! empty( $GLOBALS['opt_out'] ) ) { $value['future']['v5Defaults'] = false; }
	}
	return $value;
}
class Persona_Assistant_AI { public static function is_available() { return false; } }
class Persona_Assistant_Credential {
	const SOURCE_CLIENT_TOKEN = 'token';
	public static function source() { return self::SOURCE_CLIENT_TOKEN; }
}
function check( $condition, $message ) {
	if ( ! $condition ) { throw new RuntimeException( $message ); }
}
require __DIR__ . '/../includes/helpers.php';
$settings = persona_assistant_default_settings();
$settings = array_merge( $settings, array(
	'theme_color' => '#ba2459', 'header_title' => 'Saved assistant',
	'input_placeholder' => 'Saved placeholder', 'suggested_prompts' => "Saved prompt\nSecond prompt",
	'assistant_content_width' => 'narrow', 'assistant_composer_style' => 'pill',
	'assistant_disclaimer' => 'Saved disclaimer', 'assistant_attachments' => true,
	'assistant_voice' => true, 'chat_icon' => 'icon:leaf',
) );
foreach ( array( 'frontend', 'preview', 'fullscreen' ) as $context ) {
	$config = persona_assistant_widget_config( $context, $settings, true );
	check( true === $config['future']['v5Defaults'], 'Every render context opts into V5' );
	check( '#ba2459' === $config['theme']['palette']['colors']['primary'][500], 'Saved accent survives' );
	check( ! isset( $config['darkTheme']['palette']['colors']['gray'], $config['darkTheme']['semantic']['colors'] ), 'Native dark neutral palette survives' );
	check( 'Saved assistant' === $config['launcher']['title'], 'Saved title survives' );
	check( array( 'Saved prompt', 'Second prompt' ) === $config['suggestions']['starters']['items'], 'Saved prompts survive' );
	if ( 'fullscreen' === $context ) {
		check( '42rem' === $config['layout']['contentMaxWidth'], 'Saved content width survives' );
		check( $config['attachments']['enabled'] && $config['voiceRecognition']['enabled'], 'Saved attachments and voice survive' );
		check( 'always' === $config['statusIndicator']['mode'] && 'Saved disclaimer' === $config['statusIndicator']['idleText'], 'Disclaimer remains visible under V5' );
		check( 'leaf' === $config['features']['history']['rail']['brand']['icon'], 'Rail brand survives' );
	}
}
foreach ( array( 'soft', 'square' ) as $corner ) {
	$settings['corner_style'] = $corner;
	check( isset( persona_assistant_widget_config( 'preview', $settings, true )['theme']['components']['panel']['borderRadius'] ), 'Explicit corner choice survives' );
}
$settings['corner_style'] = 'rounded';
$settings['assistant_style_preset'] = 'chatgpt';
$neutral = persona_assistant_widget_config( 'fullscreen', $settings, true );
check( ! isset( $neutral['theme']['components']['input'], $neutral['theme']['components']['introCard'] ), 'Native composer and welcome geometry survive neutral preset' );
$settings['assistant_disclaimer'] = '';
check( 'always' === persona_assistant_widget_config( 'fullscreen', $settings, true )['statusIndicator']['mode'], 'Default disclaimer also remains visible' );
$GLOBALS['opt_out'] = true;
check( false === persona_assistant_widget_config( 'preview', $settings, true )['future']['v5Defaults'], 'Public filter can opt out' );
echo "PASS: V5 context/filter contract, saved branding/copy/layout/features, native theme geometry and disclaimer\n";
