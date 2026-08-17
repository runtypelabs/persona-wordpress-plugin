<?php
/**
 * Plugin-owned document template for the configured assistant Page.
 *
 * It intentionally omits theme header/footer markup while preserving the
 * standard WordPress head, body-open, and footer hooks for integrations,
 * accessibility, the admin bar, and enqueued assets.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$persona_assistant_preset_class = 'persona-assistant-preset-' . sanitize_html_class(
	persona_assistant_normalize_assistant_preset(
		(string) persona_assistant_get_setting( 'assistant_style_preset', 'branded' )
	)
);
$persona_assistant_body_classes = 'persona-assistant-fullscreen-page ' . $persona_assistant_preset_class;
if ( persona_assistant_is_fullscreen_preview() ) {
	$persona_assistant_body_classes .= ' persona-assistant-fullscreen-preview';
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<?php wp_head(); ?>
</head>
<body <?php body_class( $persona_assistant_body_classes ); ?>>
<?php wp_body_open(); ?>
	<?php
	// Conversation history now renders inside the widget itself: Persona's
	// history rail (features.history) lists, opens, and deletes conversations,
	// backed by Runtype or by this plugin's account-history REST routes. The
	// former server-rendered sidebar is retired.
	?>
	<div class="persona-assistant-app">
	<main class="persona-assistant-fullscreen-shell" aria-label="<?php esc_attr_e( 'Assistant', 'persona-assistant' ); ?>">
	<?php
	// render_fullscreen() returns markup assembled from escaped values.
	echo persona_assistant()->frontend->render_fullscreen(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	?>
	</main>
	</div>
<?php wp_footer(); ?>
</body>
</html>
