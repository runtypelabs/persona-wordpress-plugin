<?php
/**
 * Plugin-wide helpers: option access, defaults, and power-source resolution.
 *
 * These are intentionally free of any Runtype/Persona wire-contract details so
 * the resolution logic can be reasoned about (and unit-checked) in isolation.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Option key holding the admin-facing settings array. */
if ( ! defined( 'PERSONA_ASSISTANT_SETTINGS_OPTION' ) ) {
	define( 'PERSONA_ASSISTANT_SETTINGS_OPTION', 'persona_assistant_settings' );
}

/** Option key holding minted-client-token state (kept separate so a settings save never clobbers it). */
if ( ! defined( 'PERSONA_ASSISTANT_STATE_OPTION' ) ) {
	define( 'PERSONA_ASSISTANT_STATE_OPTION', 'persona_assistant_runtype_state' );
}

/**
 * Default settings. Every key the UI and resolver reads is declared here.
 *
 * @return array<string,mixed>
 */
function persona_assistant_default_settings() {
	return array(
		'enabled'             => false,        // Back-compat mirror of placement_mode=sitewide.
		'placement_mode'      => 'off',        // off | sitewide | manual.
		'assistant_page_id'   => 0,            // Optional WordPress Page rendered as a full-screen assistant.
		'assistant_style_preset' => 'branded', // branded | chatgpt (legacy classic/minimal normalize to these).
		'assistant_content_width' => 'wide',   // narrow | standard | wide.
		'assistant_header_style' => 'branded', // branded | minimal | hidden.
		'assistant_message_style' => 'bubble', // bubble | flat | minimal.
		'assistant_composer_style' => 'default', // default | pill.
		'assistant_show_welcome' => true,
		'assistant_welcome_variant' => 'inherit', // inherit | card | hero | none.
		'assistant_welcome_dismiss' => 'inherit', // inherit | never | on-first-message.
		'assistant_suggestion_variant' => 'inherit', // inherit | card | chip | list.
		'assistant_suggestion_placement' => 'inherit', // inherit | auto | welcome | composer.
		'assistant_suggestion_behavior' => 'inherit', // inherit | send | fill.
		'assistant_suggestion_overflow' => 'inherit', // inherit | wrap | scroll.
		'assistant_suggestion_max_items' => 0, // 0 inherits the shared 1-8 item limit.
		'assistant_show_avatars' => true,
		'assistant_show_timestamps' => false,
		'assistant_show_clear_chat' => true,
		'assistant_attachments' => false,
		'launcher_attachments' => false,
		'attachment_images'   => true,
		'attachment_documents' => true,
		'attachment_max_files' => 4,
		'attachment_max_size_mb' => 5,
		'assistant_voice' => false,
		'assistant_disclaimer' => '',
		'power_source'        => 'runtype',    // auto (legacy) | runtype | wordpress_ai.
		'api_key'             => '',           // rt_... management key: server-side secret, NEVER localized. No UI, constant/legacy only.
		'client_token'        => '',           // ct_... pasted directly (fallback source).
		'agent_id'            => '',           // Chosen agent to scope the minted/embedded token to.
		'api_base'            => PERSONA_ASSISTANT_DEFAULT_API_BASE, // Constant/legacy-driven; no UI (see persona_assistant_get_api_base()).
		'environment'         => 'live',       // live | test. Constant/legacy-driven; no UI (see persona_assistant_get_environment()).
		'theme_color'         => '#4f46e5',
		'theme_mode'          => 'light',       // light | dark | auto (widget colorScheme).
		'corner_style'        => 'rounded',     // rounded | soft | square (radius preset).
		'launcher_position'   => 'bottom-right', // bottom-right | bottom-left.
		'chat_icon'           => '',            // 'icon:<lucide-name>', emoji/short text, OR an image URL; blank = Site Icon, else widget default.
		'launcher_teaser_text' => '',           // Optional Persona 4.16 proactive launcher nudge.
		'launcher_teaser_delay' => 3,           // Seconds before the teaser appears (0-60).
		'launcher_teaser_frequency' => 'once',  // once | always.
		'launcher_teaser_dismissible' => true,
		'launcher_enabled'    => true,          // Legacy: launcher presentation now lives per-block/shortcode.
		'header_title'        => '',            // Panel/launcher header title; blank = site name.
		'header_subtitle'     => '',            // Panel/launcher header subtitle; blank = translated default.
		'welcome_title'       => '',
		'welcome_subtitle'    => '',
		'welcome_variant'     => 'card',        // card | hero | none (Persona 4.16 welcome namespace).
		'welcome_dismiss'     => 'never',       // never | on-first-message.
		'welcome_message'     => '',            // Display-only assistant greeting; never sent to the model.
		'welcome_show_icon'   => false,         // Reuse chat_icon / Site Icon above the welcome title.
		'input_placeholder'   => '',
		'suggested_prompts'   => '',            // One prompt per line; parsed to suggestion_max_items non-empty lines.
		'suggestion_variant'  => 'chip',        // card | chip | list; chip preserves pre-4.16 upgrades.
		'suggestion_placement' => 'auto',       // auto | welcome | composer.
		'suggestion_behavior' => 'send',        // send | fill.
		'suggestion_overflow' => 'wrap',        // wrap | scroll (chip variant only).
		'suggestion_max_items' => 4,            // 1-8 starter prompts.
		'followup_suggestions' => false,        // Advertise Persona's suggest_replies client tool (Runtype only).
		'scrollbar_policy'    => 'on-scroll',   // on-scroll | auto | hidden.
		'show_ai_activity'    => false,         // Show the AI's reasoning + tool-call steps.
		'wp_ai_system_prompt' => '',
		'wp_ai_model'         => '',
		'wp_ai_access'        => 'public',      // public | logged_in.
		'wp_ai_rate_limit'    => 10,            // Requests per visitor per minute (1-60). No UI; see persona_assistant_wp_ai_rate_limit filter.
		'history_browser_mode' => 'session',     // off | session | device. Safe text-only browser persistence.
		'wp_ai_account_history' => false,        // Optional logged-in WordPress AI history in dedicated tables.
		'history_retention_days' => 30,          // 7 | 30 | 90 | 365 | 0 (until erased).
		'wp_ai_tools_enabled' => false,
		'wp_ai_abilities'     => array( 'core/get-site-info' ),
		'webmcp_enabled'      => false,         // Master toggle: expose page tools (WebMCP) to the assistant. Runtype mode only.
		'webmcp_abilities'    => true,          // Auto-expose Abilities API tools (WP 6.9+). Only effective when webmcp_enabled is on.
	);
}

/**
 * MIME types accepted by Persona and the WordPress AI endpoint.
 *
 * @param array<string,mixed>|null $settings Optional settings.
 * @return array<int,string>
 */
function persona_assistant_attachment_mime_types( $settings = null ) {
	$settings = is_array( $settings ) ? $settings : persona_assistant_get_settings();
	$types    = array();
	if ( ! empty( $settings['attachment_images'] ) ) {
		$types = array_merge( $types, array( 'image/jpeg', 'image/png', 'image/gif', 'image/webp' ) );
	}
	if ( ! empty( $settings['attachment_documents'] ) ) {
		$types = array_merge( $types, array( 'application/pdf', 'text/plain', 'text/markdown', 'text/csv', 'application/json' ) );
	}

	/**
	 * Filter the attachment MIME allowlist. Keep this list aligned with the AI
	 * connectors installed on the site; unsupported types may be rejected by a provider.
	 *
	 * @param array<int,string>   $types    MIME types.
	 * @param array<string,mixed> $settings Plugin settings.
	 */
	return array_values( array_unique( (array) apply_filters( 'persona_assistant_attachment_mime_types', $types, $settings ) ) );
}

/**
 * List registered WordPress Abilities that are explicitly safe for autonomous reads.
 *
 * @return array<string,array{label:string,description:string}>
 */
function persona_assistant_readonly_abilities() {
	if ( ! function_exists( 'wp_get_abilities' ) ) {
		return array();
	}

	$available = array();
	foreach ( (array) call_user_func( 'wp_get_abilities' ) as $ability ) {
		if ( ! is_object( $ability ) || ! is_callable( array( $ability, 'get_name' ) ) || ! is_callable( array( $ability, 'get_meta' ) ) ) {
			continue;
		}
		$meta        = (array) $ability->get_meta();
		$annotations = isset( $meta['annotations'] ) && is_array( $meta['annotations'] ) ? $meta['annotations'] : array();
		if ( empty( $annotations['readonly'] ) || ! empty( $annotations['destructive'] ) ) {
			continue;
		}
		$name = (string) $ability->get_name();
		if ( '' === $name ) {
			continue;
		}
		$available[ $name ] = array(
			'label'       => is_callable( array( $ability, 'get_label' ) ) ? (string) $ability->get_label() : $name,
			'description' => is_callable( array( $ability, 'get_description' ) ) ? (string) $ability->get_description() : '',
		);
	}
	ksort( $available );
	return $available;
}

/**
 * Resolve selected Abilities against the read-only registry.
 *
 * @param array<string,mixed>|null $settings Optional settings.
 * @return array<int,string>
 */
function persona_assistant_selected_wp_ai_abilities( $settings = null ) {
	$settings  = is_array( $settings ) ? $settings : persona_assistant_get_settings();
	$selected  = isset( $settings['wp_ai_abilities'] ) && is_array( $settings['wp_ai_abilities'] ) ? $settings['wp_ai_abilities'] : array();
	$available = persona_assistant_readonly_abilities();
	return array_values( array_intersect( array_map( 'sanitize_text_field', $selected ), array_keys( $available ) ) );
}

/**
 * Build a secret-free support report administrators can copy into an issue.
 *
 * @return string
 */
function persona_assistant_diagnostics_report() {
	$settings = persona_assistant_get_settings();
	$ai       = class_exists( 'Persona_Assistant_AI' ) ? Persona_Assistant_AI::describe() : array( 'available' => false, 'backend' => '' );
	$page_id  = absint( $settings['assistant_page_id'] );
	$lines    = array(
		'Persona Assistant: ' . PERSONA_ASSISTANT_VERSION,
		'Persona runtime: ' . persona_assistant_installer_version() . ' (bundled locally)',
		'WordPress: ' . get_bloginfo( 'version' ),
		'PHP: ' . PHP_VERSION,
		'Mode: ' . persona_assistant_resolve_mode(),
		'WordPress AI backend: ' . ( '' !== $ai['backend'] ? $ai['backend'] : 'none' ),
		'WordPress AI available: ' . ( $ai['available'] ? 'yes' : 'no' ),
		'Placement: ' . (string) $settings['placement_mode'],
		'Assistant page: ' . ( $page_id ? get_permalink( $page_id ) : 'not configured' ),
		'Assistant attachments: ' . ( ! empty( $settings['assistant_attachments'] ) ? 'yes' : 'no' ),
		'Launcher attachments: ' . ( ! empty( $settings['launcher_attachments'] ) ? 'yes' : 'no' ),
		'Attachment policy: ' . absint( $settings['attachment_max_files'] ) . ' files / ' . absint( $settings['attachment_max_size_mb'] ) . ' MB / ' . implode( ', ', persona_assistant_attachment_mime_types( $settings ) ),
		'Browser history: ' . (string) $settings['history_browser_mode'],
		'WordPress AI account history: ' . ( ! empty( $settings['wp_ai_account_history'] ) ? ( absint( $settings['history_retention_days'] ) ? 'enabled / ' . absint( $settings['history_retention_days'] ) . ' days' : 'enabled / until erased' ) : 'disabled' ),
		'WordPress AI Abilities: ' . ( ! empty( $settings['wp_ai_tools_enabled'] ) ? implode( ', ', persona_assistant_selected_wp_ai_abilities( $settings ) ) : 'disabled' ),
		'WebMCP: ' . ( persona_assistant_webmcp_active() ? 'active' : 'inactive' ),
	);
	return implode( "\n", $lines );
}

/**
 * Mix a hex color toward another by a fraction (0 = unchanged, 1 = $with).
 *
 * @param string $hex    Base color (#rgb or #rrggbb).
 * @param string $with   Color to mix toward (#rrggbb).
 * @param float  $amount Fraction of $with to mix in.
 * @return string #rrggbb
 */
function persona_assistant_mix_hex( $hex, $with, $amount ) {
	$expand = function ( $h ) {
		$h = ltrim( (string) $h, '#' );
		if ( 3 === strlen( $h ) ) {
			$h = $h[0] . $h[0] . $h[1] . $h[1] . $h[2] . $h[2];
		}
		return $h;
	};
	$a   = $expand( $hex );
	$b   = $expand( $with );
	$out = '#';
	for ( $i = 0; $i < 3; $i++ ) {
		$ca   = hexdec( substr( $a, $i * 2, 2 ) );
		$cb   = hexdec( substr( $b, $i * 2, 2 ) );
		$out .= str_pad( dechex( (int) round( $ca + ( $cb - $ca ) * $amount ) ), 2, '0', STR_PAD_LEFT );
	}
	return $out;
}

/**
 * Full 11-step primary scale derived from the accent color.
 *
 * The widget's createTheme() replaces a color scale WHOLESALE when overridden
 * (`{...defaults.colors, ...user.colors}` merges at the scale level, not
 * per-shade), so a partial primary would wipe the shades it omits, notably
 * primary.50, which the header title, user-bubble text, launcher glyph, and
 * primary-button foregrounds all resolve from (invisible text on the brand
 * color). Always emit the complete scale.
 *
 * @param string $hex Accent color (#rrggbb).
 * @return array<string,string>
 */
function persona_assistant_primary_scale( $hex ) {
	return array(
		'50'  => '#ffffff',
		'100' => persona_assistant_mix_hex( $hex, '#ffffff', 0.9 ),
		'200' => persona_assistant_mix_hex( $hex, '#ffffff', 0.75 ),
		'300' => persona_assistant_mix_hex( $hex, '#ffffff', 0.5 ),
		'400' => persona_assistant_mix_hex( $hex, '#ffffff', 0.25 ),
		'500' => $hex,
		'600' => persona_assistant_mix_hex( $hex, '#000000', 0.12 ),
		'700' => persona_assistant_mix_hex( $hex, '#000000', 0.24 ),
		'800' => persona_assistant_mix_hex( $hex, '#000000', 0.4 ),
		'900' => persona_assistant_mix_hex( $hex, '#000000', 0.55 ),
		'950' => persona_assistant_mix_hex( $hex, '#000000', 0.7 ),
	);
}

/**
 * Persona widget theme derived from the accent color.
 *
 * The widget's brand surfaces (header, launcher, user bubbles, primary button)
 * all resolve from `palette.colors.primary`: 500 is the base, 600/700 the
 * hover/focus darkenings, 200 the light tint used for header subtitle and
 * action icons, and 50 the near-white foregrounds. The full scale is emitted
 * because the widget replaces overridden scales wholesale (see
 * persona_assistant_primary_scale()).
 *
 * The optional corner style overrides `palette.radius`, which the widget's
 * panel (radius.xl), message bubbles + input (radius.lg), and ghost/icon
 * buttons (radius.md) resolve from (see utils/tokens.ts). 'rounded' keeps the
 * widget defaults; 'soft' and 'square' tighten the scale so the three presets
 * read distinctly on the panel, bubbles, and buttons.
 *
 * @param string $hex          Accent color (#rrggbb).
 * @param string $corner_style rounded | soft | square. Default 'rounded'.
 * @return array<string,mixed> DeepPartial<PersonaTheme> token overrides.
 */
function persona_assistant_widget_theme( $hex, $corner_style = 'rounded' ) {
	$theme = array(
		'palette' => array(
			'colors' => array(
				'primary' => persona_assistant_primary_scale( $hex ),
			),
		),
	);

	if ( 'soft' === $corner_style ) {
		$theme['palette']['radius'] = array(
			'md'  => '0.25rem',
			'lg'  => '0.375rem',
			'xl'  => '0.5rem',
			'2xl' => '0.625rem',
		);
		$theme['components'] = persona_assistant_corner_components( '0.5rem', '0.375rem', '0.25rem', '0.625rem' );
	} elseif ( 'square' === $corner_style ) {
		$theme['palette']['radius'] = array(
			'sm'  => '0px',
			'md'  => '2px',
			'lg'  => '2px',
			'xl'  => '4px',
			'2xl' => '4px',
		);
		$theme['components'] = persona_assistant_corner_components( '4px', '2px', '2px', '4px' );
	}

	return $theme;
}

/**
 * Component-level borderRadius overrides for a corner preset.
 *
 * The widget's createDarkTheme() rebuilds `palette` from its defaults (keeping
 * only `colors`), so `palette.radius` overrides are silently dropped in dark
 * mode. The `components` layer survives that rebuild, so the presets are ALSO
 * expressed here, mirroring the default token map in utils/tokens.ts (panel
 * xl, header xl-top, bubbles/input/buttons lg, ghost md, intro card 2xl).
 *
 * @param string $xl  Panel/header radius.
 * @param string $lg  Bubbles, input, and solid-button radius.
 * @param string $md  Ghost-button radius.
 * @param string $xxl Intro-card radius.
 * @return array<string,mixed>
 */
function persona_assistant_corner_components( $xl, $lg, $md, $xxl ) {
	return array(
		'panel'     => array( 'borderRadius' => $xl ),
		'header'    => array( 'borderRadius' => $xl . ' ' . $xl . ' 0 0' ),
		'input'     => array( 'borderRadius' => $lg ),
		'introCard' => array( 'borderRadius' => $xxl ),
		'message'   => array(
			'user'      => array( 'borderRadius' => $lg ),
			'assistant' => array( 'borderRadius' => $lg ),
		),
		'button'    => array(
			'primary'   => array( 'borderRadius' => $lg ),
			'secondary' => array( 'borderRadius' => $lg ),
			'ghost'     => array( 'borderRadius' => $md ),
		),
	);
}

/**
 * Dark-mode Persona theme derived from the accent color.
 *
 * Always emitted alongside the light theme so `colorScheme: 'auto'` (and an
 * explicit 'dark') has a legible dark palette. Modeled on the widget's
 * darkIndigo theme reference: slate grays for dark surfaces, semantic tokens
 * redirected for inverted text/surface, and a brand primary lightened so it
 * stays readable on the dark container.
 *
 * @param string $hex Accent color (#rrggbb).
 * @return array<string,mixed> DeepPartial<PersonaTheme> token overrides.
 */
function persona_assistant_widget_dark_theme( $hex ) {
	return array(
		'palette'  => array(
			'colors' => array(
				// Full scales: the widget replaces overridden scales wholesale
				// (see persona_assistant_primary_scale()), so partial scales would
				// leave shades like primary.50 (foregrounds) undefined. The
				// brand base shifts to 500 = lightened accent so it reads on
				// the dark surface, with the true accent as the 600 hover.
				'primary' => array(
					'50'  => '#ffffff',
					'100' => persona_assistant_mix_hex( $hex, '#ffffff', 0.9 ),
					'200' => persona_assistant_mix_hex( $hex, '#ffffff', 0.75 ),
					'300' => persona_assistant_mix_hex( $hex, '#ffffff', 0.5 ),
					'400' => persona_assistant_mix_hex( $hex, '#ffffff', 0.3 ),
					'500' => persona_assistant_mix_hex( $hex, '#ffffff', 0.18 ),
					'600' => $hex,
					'700' => persona_assistant_mix_hex( $hex, '#000000', 0.12 ),
					'800' => persona_assistant_mix_hex( $hex, '#000000', 0.3 ),
					'900' => persona_assistant_mix_hex( $hex, '#000000', 0.5 ),
					'950' => persona_assistant_mix_hex( $hex, '#000000', 0.65 ),
				),
				'gray'    => array(
					'50'  => '#f1f5f9',
					'100' => '#1e293b',
					'200' => '#334155',
					'300' => '#cbd5e1',
					'400' => '#94a3b8',
					'500' => '#94a3b8',
					'600' => '#475569',
					'700' => '#334155',
					'800' => '#1e293b',
					'900' => '#0f172a',
					'950' => '#020617',
				),
			),
		),
		'semantic' => array(
			'colors' => array(
				'surface'     => 'palette.colors.gray.900',
				'background'   => 'palette.colors.gray.900',
				'container'    => 'palette.colors.gray.100',
				'text'        => 'palette.colors.gray.50',
				'textMuted'    => 'palette.colors.gray.500',
				'textInverse'  => 'palette.colors.gray.900',
				'border'       => 'palette.colors.gray.200',
			),
		),
	);
}

/**
 * Parse the suggested-prompts textarea into an ordered list of chips.
 *
 * One prompt per line, trimmed, empty lines dropped, capped at four so the
 * welcome screen stays uncluttered.
 *
 * @param string $text Raw textarea value.
 * @param int    $max  Maximum prompts to return.
 * @return array<int,string>
 */
function persona_assistant_parse_prompts( $text, $max = 4 ) {
	$lines  = preg_split( '/\r\n|\r|\n/', (string) $text );
	$chips  = array();
	$max    = max( 1, min( 8, absint( $max ) ) );
	foreach ( (array) $lines as $line ) {
		$line = trim( $line );
		if ( '' !== $line ) {
			$chips[] = $line;
		}
		if ( count( $chips ) >= $max ) {
			break;
		}
	}
	return $chips;
}

/**
 * Convert the plugin's shared icon setting into Persona's 4.16 welcome icon.
 *
 * @param array<string,mixed> $settings Plugin settings.
 * @return array<string,string>|null
 */
function persona_assistant_welcome_icon( $settings ) {
	if ( empty( $settings['welcome_show_icon'] ) ) {
		return null;
	}

	$icon = trim( (string) $settings['chat_icon'] );
	if ( preg_match( '/^icon:([a-z0-9-]+)$/', $icon, $match ) ) {
		return array(
			'type' => 'lucide',
			'name' => $match[1],
		);
	}
	if ( '' !== $icon && ( 0 === strpos( $icon, 'http://' ) || 0 === strpos( $icon, 'https://' ) || 0 === strpos( $icon, '/' ) ) ) {
		return array(
			'type' => 'image',
			'url'  => esc_url_raw( $icon ),
			'alt'  => (string) get_bloginfo( 'name' ),
		);
	}
	if ( '' !== $icon ) {
		return array(
			'type' => 'text',
			'text' => $icon,
		);
	}

	$site_icon = (string) get_site_icon_url();
	return '' !== $site_icon
		? array(
			'type' => 'image',
			'url'  => $site_icon,
			'alt'  => (string) get_bloginfo( 'name' ),
		)
		: null;
}

/**
 * Build the nested widget-config array (installer `config`) from settings.
 *
 * Single source of truth shared by the front end and the admin live preview.
 * Copy fields ALWAYS carry a value: the user's setting when non-empty, else a
	 * localized default that mirrors the widget's English wording, so non-English
	 * sites get translated copy even with blank fields. Starter suggestions fall to
	 * an empty array rather than the widget's built-in sample prompts.
 *
 * @param string                   $context    'frontend' | 'preview' | 'fullscreen'.
 * @param array<string,mixed>|null $settings   Optional settings override for an unsaved preview.
 * @param bool                     $is_preview Whether this config is for the isolated admin preview.
 * @return array<string,mixed>
 */
function persona_assistant_widget_config( $context, $settings = null, $is_preview = false ) {
	$settings = is_array( $settings ) ? $settings : persona_assistant_get_settings();

	$default_welcome_title    = __( 'Hello 👋', 'persona-assistant' );
	$default_welcome_subtitle = __( 'Ask anything about your account or products.', 'persona-assistant' );
	$default_placeholder      = __( 'How can I help...', 'persona-assistant' );
	$default_launcher_sub     = __( 'Here to help you get answers fast', 'persona-assistant' );

	$header_title = '' !== trim( (string) $settings['header_title'] )
		? (string) $settings['header_title']
		: (string) get_bloginfo( 'name' );
	$header_subtitle = '' !== trim( (string) $settings['header_subtitle'] )
		? (string) $settings['header_subtitle']
		: $default_launcher_sub;
	$is_assistant_context = 'fullscreen' === $context;
	$welcome_variant_value = $is_assistant_context && 'inherit' !== (string) $settings['assistant_welcome_variant']
		? (string) $settings['assistant_welcome_variant']
		: (string) $settings['welcome_variant'];
	$welcome_dismiss_value = $is_assistant_context && 'inherit' !== (string) $settings['assistant_welcome_dismiss']
		? (string) $settings['assistant_welcome_dismiss']
		: (string) $settings['welcome_dismiss'];
	$suggestion_variant_value = $is_assistant_context && 'inherit' !== (string) $settings['assistant_suggestion_variant']
		? (string) $settings['assistant_suggestion_variant']
		: (string) $settings['suggestion_variant'];
	$suggestion_placement_value = $is_assistant_context && 'inherit' !== (string) $settings['assistant_suggestion_placement']
		? (string) $settings['assistant_suggestion_placement']
		: (string) $settings['suggestion_placement'];
	$suggestion_behavior_value = $is_assistant_context && 'inherit' !== (string) $settings['assistant_suggestion_behavior']
		? (string) $settings['assistant_suggestion_behavior']
		: (string) $settings['suggestion_behavior'];
	$suggestion_overflow_value = $is_assistant_context && 'inherit' !== (string) $settings['assistant_suggestion_overflow']
		? (string) $settings['assistant_suggestion_overflow']
		: (string) $settings['suggestion_overflow'];
	$assistant_suggestion_max = absint( $settings['assistant_suggestion_max_items'] );
	$suggestion_max_value     = $is_assistant_context && $assistant_suggestion_max > 0
		? $assistant_suggestion_max
		: absint( $settings['suggestion_max_items'] );

	$welcome_variant = in_array( $welcome_variant_value, array( 'card', 'hero', 'none' ), true )
		? $welcome_variant_value
		: 'card';
	$welcome_dismiss = 'on-first-message' === $welcome_dismiss_value ? 'on-first-message' : 'never';
	$suggestion_max  = max( 1, min( 8, $suggestion_max_value ) );

	$launcher = array(
		'enabled'  => 'frontend' === $context ? persona_assistant_sitewide_enabled() : false,
		'title'    => $header_title,
		'subtitle' => $header_subtitle,
		'position' => 'bottom-left' === (string) $settings['launcher_position'] ? 'bottom-left' : 'bottom-right',
	);
	$teaser_text = trim( (string) $settings['launcher_teaser_text'] );
	if ( '' !== $teaser_text && 'frontend' === $context ) {
		$launcher['teaser'] = array(
			'text'         => $teaser_text,
			'delayMs'      => max( 0, min( 60, absint( $settings['launcher_teaser_delay'] ) ) ) * 1000,
			'frequency'    => 'always' === (string) $settings['launcher_teaser_frequency'] ? 'always' : 'once',
			'dismissible'  => (bool) $settings['launcher_teaser_dismissible'],
			'dismissLabel' => __( 'Dismiss message', 'persona-assistant' ),
		);
	}
	if ( 'preview' === $context || 'fullscreen' === $context ) {
		// Inline/full-screen mounts fill their definite-height host and scroll
		// the transcript inside it instead of growing with the conversation.
		$launcher['fullHeight'] = true;
	}

	// Icon logic. Custom/site icons must clear the Lucide defaults that outrank
	// them: headerIconName (panel header) and agentIconName (collapsed pill), so
	// the widget's falsy check falls through to iconUrl / agentIconText.
	// `icon:<name>` (written by the settings-page icon picker) selects one of
	// the widget's built-in lucide icons by registry name instead.
	$icon = trim( (string) $settings['chat_icon'] );
	if ( preg_match( '/^icon:([a-z0-9-]+)$/', $icon, $m ) ) {
		$launcher['headerIconName'] = $m[1];
		$launcher['agentIconName']  = $m[1];
		$launcher['iconUrl']        = '';
		$launcher['agentIconText']  = '';
	} elseif ( '' !== $icon && ( 0 === strpos( $icon, 'http://' ) || 0 === strpos( $icon, 'https://' ) || 0 === strpos( $icon, '/' ) ) ) {
		$launcher['iconUrl']        = esc_url_raw( $icon );
		$launcher['headerIconName'] = '';
		$launcher['agentIconName']  = '';
	} elseif ( '' !== $icon ) {
		$launcher['agentIconText']  = $icon;
		$launcher['headerIconName'] = '';
		$launcher['agentIconName']  = '';
	} else {
		$site_icon = (string) get_site_icon_url();
		if ( '' !== $site_icon ) {
			$launcher['iconUrl']        = $site_icon;
			$launcher['headerIconName'] = '';
			$launcher['agentIconName']  = '';
		}
	}

	$welcome = array(
		'title'    => '' !== trim( (string) $settings['welcome_title'] ) ? (string) $settings['welcome_title'] : $default_welcome_title,
		'subtitle' => '' !== trim( (string) $settings['welcome_subtitle'] ) ? (string) $settings['welcome_subtitle'] : $default_welcome_subtitle,
		'variant'  => $welcome_variant,
		'dismiss'  => $welcome_dismiss,
		'message'  => (string) $settings['welcome_message'],
	);
	$welcome_icon = persona_assistant_welcome_icon( $settings );
	if ( is_array( $welcome_icon ) ) {
		$welcome['icon'] = $welcome_icon;
	}

	$config = array(
		// Persona's installer adds its Markdown postprocessor automatically. Being
		// explicit keeps the secure default sanitizer enabled and avoids the 4.16
		// warning reserved for intentionally custom HTML postprocessors.
		'sanitize' => true,
		'launcher' => $launcher,
		'welcome'  => $welcome,
		'copy'     => array(
			'inputPlaceholder' => '' !== trim( (string) $settings['input_placeholder'] ) ? (string) $settings['input_placeholder'] : $default_placeholder,
		),
		'suggestions' => array(
			'starters' => array(
				'items'     => persona_assistant_parse_prompts( (string) $settings['suggested_prompts'], $suggestion_max ),
				'variant'   => in_array( $suggestion_variant_value, array( 'card', 'chip', 'list' ), true ) ? $suggestion_variant_value : 'chip',
				'placement' => in_array( $suggestion_placement_value, array( 'auto', 'welcome', 'composer' ), true ) ? $suggestion_placement_value : 'auto',
				'behavior'  => 'fill' === $suggestion_behavior_value ? 'fill' : 'send',
				'overflow'  => 'scroll' === $suggestion_overflow_value ? 'scroll' : 'wrap',
				'maxItems'  => $suggestion_max,
			),
			'followUps' => array(
				'enabled'   => true,
				// Demo mode always exposes suggest_replies: the demo plane
				// drives its chip navigation through that client tool and
				// degrades to a markdown list when it is not advertised.
				'expose'    => ( (bool) $settings['followup_suggestions'] && 'runtype' === persona_assistant_resolve_mode() )
					|| 'demo' === persona_assistant_resolve_mode(),
				'variant'   => 'chip',
				'placement' => 'auto',
				'overflow'  => 'wrap',
				'maxItems'  => 4,
			),
		),
		'features'        => array(
			// Demo mode forces AI-activity display on: the demo plane's
			// tool-call scenarios exist to show exactly this chrome (their
			// copy says "watch the tool row below"), so hiding it would make
			// the demo read as broken rather than as configured-minimal.
			'showReasoning' => (bool) $settings['show_ai_activity'] || 'demo' === persona_assistant_resolve_mode(),
			'showToolCalls' => (bool) $settings['show_ai_activity'] || 'demo' === persona_assistant_resolve_mode(),
			'scrollBehavior' => array(
				'scrollbar' => in_array( (string) $settings['scrollbar_policy'], array( 'on-scroll', 'auto', 'hidden' ), true ) ? (string) $settings['scrollbar_policy'] : 'on-scroll',
			),
		),
		'colorScheme'     => in_array( (string) $settings['theme_mode'], array( 'light', 'dark', 'auto' ), true ) ? (string) $settings['theme_mode'] : 'light',
		'theme'           => persona_assistant_widget_theme( (string) $settings['theme_color'], (string) $settings['corner_style'] ),
		'darkTheme'       => persona_assistant_widget_dark_theme( (string) $settings['theme_color'] ),
		'attachments'     => array(
			'enabled'      => (bool) $settings['launcher_attachments'],
			'allowedTypes' => persona_assistant_attachment_mime_types( $settings ),
			'maxFiles'     => min( 4, max( 1, (int) $settings['attachment_max_files'] ) ),
			'maxFileSize'  => min( 10, max( 1, (int) $settings['attachment_max_size_mb'] ) ) * MB_IN_BYTES,
		),
	);

	// WordPress REST cookie authentication requires this nonce before it will
	// preserve the current logged-in visitor. Without it WordPress deliberately
	// downgrades the REST request to anonymous, causing otherwise-authorized
	// Ability permission callbacks to fail. Logged-out visitors remain anonymous.
	if ( 'wordpress_ai' === persona_assistant_resolve_mode() ) {
		$config['headers'] = array( 'X-WP-Nonce' => wp_create_nonce( 'wp_rest' ) );
	}

	if ( 'fullscreen' === $context ) {
		$config['autoFocusInput'] = true;
		$config = persona_assistant_apply_assistant_appearance( $config, $settings );
	}

	// Page tools (WebMCP): enabling reads the registry from document.modelContext
	// at the start of every chat turn. Only the front end wires the registration
	// script, so the admin preview (which runs in wp-admin, where the tools are
	// neither present nor relevant) never advertises the capability.
	if ( ! $is_preview && 'preview' !== $context && persona_assistant_webmcp_client_active() ) {
		$config['webmcp'] = array( 'enabled' => true );
	}

	/**
	 * Filter the composed Persona widget config before it is localized.
	 *
	 * @param array<string,mixed> $config  The nested widget-config array.
	 * @param string              $context 'frontend' | 'preview' | 'fullscreen'.
	 */
	return apply_filters( 'persona_assistant_widget_config', $config, $context );
}

/**
 * Return the serializable assistant-page appearance consumed by the browser
 * decorator. Keeping this separate from the widget config lets JavaScript add
 * function-valued Persona plugins (such as renderComposer), which cannot pass
 * through wp_localize_script's JSON encoding.
 *
 * @param array<string,mixed>|null $settings Optional settings array.
 * @return array<string,mixed>
 */
/**
 * Canonical assistant-page style preset.
 *
 * The four original presets collapsed into two real styles — each pair
 * differed only in its default conversation width, which is a separate
 * fine-tune setting. Stored legacy values keep working: 'classic' was the
 * accent style ('branded') and 'minimal' the neutral style ('chatgpt').
 *
 * @param string $preset Stored preset value.
 * @return string 'branded' | 'chatgpt'.
 */
function persona_assistant_normalize_assistant_preset( $preset ) {
	$map = array(
		'classic' => 'branded',
		'minimal' => 'chatgpt',
	);
	$preset = isset( $map[ $preset ] ) ? $map[ $preset ] : (string) $preset;
	return in_array( $preset, array( 'branded', 'chatgpt' ), true ) ? $preset : 'branded';
}

function persona_assistant_page_appearance( $settings = null ) {
	$settings = is_array( $settings ) ? $settings : persona_assistant_get_settings();

	return array(
		'preset'        => persona_assistant_normalize_assistant_preset( (string) $settings['assistant_style_preset'] ),
		'contentWidth'  => (string) $settings['assistant_content_width'],
		'headerStyle'   => (string) $settings['assistant_header_style'],
		'messageStyle'  => (string) $settings['assistant_message_style'],
		'composerStyle' => (string) $settings['assistant_composer_style'],
		'showWelcome'   => (bool) $settings['assistant_show_welcome'],
		'showAvatars'   => (bool) $settings['assistant_show_avatars'],
		'showTimestamps' => (bool) $settings['assistant_show_timestamps'],
		'showClearChat' => (bool) $settings['assistant_show_clear_chat'],
		'attachments'   => (bool) $settings['assistant_attachments'],
		'voice'         => (bool) $settings['assistant_voice'],
		'disclaimer'    => '' !== trim( (string) $settings['assistant_disclaimer'] )
			? (string) $settings['assistant_disclaimer']
			: __( 'AI can make mistakes. Check important information.', 'persona-assistant' ),
	);
}

/**
 * Neutral theme overrides for the ChatGPT-like preset.
 *
 * @param bool $dark Whether to return dark-scheme tokens.
 * @return array<string,mixed>
 */
function persona_assistant_neutral_assistant_theme( $dark = false ) {
	if ( $dark ) {
		$background = '#212121';
		$surface    = '#212121';
		$container  = '#212121';
		$input      = '#2f2f2f';
		$text       = '#ececec';
		$muted      = '#b4b4b4';
		$border     = '#424242';
		$user       = '#2f2f2f';
	} else {
		$background = '#ffffff';
		$surface    = '#ffffff';
		$container  = '#ffffff';
		$input      = '#f4f4f4';
		$text       = '#0d0d0d';
		$muted      = '#6b6b6b';
		$border     = '#dedede';
		$user       = '#f4f4f4';
	}

	return array(
		'semantic'  => array(
			'colors' => array(
				'background' => $background,
				'surface'    => $surface,
				'container'  => $container,
				'text'       => $text,
				'textMuted'  => $muted,
				'border'     => $border,
				'divider'    => $border,
			),
		),
		'components' => array(
			'panel'  => array(
				'border'       => 'none',
				'shadow'       => 'none',
				'borderRadius' => '0',
			),
			'header' => array(
				'background'   => $surface,
				'foreground'   => $text,
				'border'       => $border,
				'borderBottom' => '1px solid ' . $border,
				'borderRadius' => '0',
				'shadow'       => 'none',
			),
			'input'  => array(
				'background'   => $input,
				'foreground'   => $text,
				'placeholder'  => $muted,
				'border'       => $border,
				'borderRadius' => '1.5rem',
				'focus'        => array(
					'border' => $border,
					'ring'   => 'transparent',
				),
			),
			'introCard' => array(
				'background'   => 'transparent',
				'border'       => 'transparent',
				'shadow'       => 'none',
				'borderRadius' => '0',
			),
			'message' => array(
				'user'      => array(
					'background'   => $user,
					'text'         => $text,
					'border'       => 'transparent',
					'borderRadius' => '1.25rem',
					'shadow'       => 'none',
				),
				'assistant' => array(
					'background'   => 'transparent',
					'text'         => $text,
					'border'       => 'transparent',
					'borderRadius' => '0',
					'shadow'       => 'none',
				),
			),
			'scrollToBottom' => array(
				'background'   => $surface,
				'foreground'   => $text,
				'border'       => $border,
				'borderRadius' => '9999px',
				'size'         => '40px',
				'shadow'       => $dark ? '0 4px 14px rgba(0,0,0,.35)' : '0 4px 14px rgba(0,0,0,.12)',
			),
		),
	);
}

/**
 * Apply the selected full-screen assistant appearance to a Persona config.
 *
 * Function-valued render hooks are added later by assets/js/persona-layouts.js;
 * this function handles the serializable config and theme contract.
 *
 * @param array<string,mixed> $config   Widget config.
 * @param array<string,mixed> $settings Plugin settings.
 * @return array<string,mixed>
 */
function persona_assistant_apply_assistant_appearance( $config, $settings ) {
	$appearance = persona_assistant_page_appearance( $settings );
	$widths     = array(
		'narrow'   => '42rem',
		'standard' => '48rem',
		'wide'     => '72rem',
	);
	$width       = isset( $widths[ $appearance['contentWidth'] ] ) ? $widths[ $appearance['contentWidth'] ] : $widths['wide'];
	$header      = (string) $appearance['headerStyle'];
	$messages    = (string) $appearance['messageStyle'];

	$config['welcome']['variant']      = $appearance['showWelcome'] ? (string) $config['welcome']['variant'] : 'none';
	$config['launcher']['enabled']     = false;
	$config['launcher']['fullHeight']  = true;
	$config['layout'] = array(
		'showHeader' => 'hidden' !== $header,
		'header'     => array(
			'layout'          => 'minimal' === $header ? 'minimal' : 'default',
			'showIcon'        => 'branded' === $header,
			'showTitle'       => true,
			'showSubtitle'    => 'branded' === $header,
			'showCloseButton' => false,
			'showClearChat'   => (bool) $appearance['showClearChat'],
		),
		'messages'   => array(
			'layout'           => in_array( $messages, array( 'bubble', 'flat', 'minimal' ), true ) ? $messages : 'bubble',
			'avatar'           => array( 'show' => (bool) $appearance['showAvatars'] ),
			'timestamp'        => array( 'show' => (bool) $appearance['showTimestamps'] ),
			'groupConsecutive' => true,
		),
		'contentMaxWidth' => $width,
	);

	$config['attachments']            = isset( $config['attachments'] ) && is_array( $config['attachments'] ) ? $config['attachments'] : array();
	$config['attachments']['enabled'] = (bool) $appearance['attachments'];
	$config['voiceRecognition'] = array( 'enabled' => (bool) $appearance['voice'] );
	$config['messageActions'] = array(
		'enabled'    => true,
		'showCopy'   => true,
		'showUpvote' => false,
		'showDownvote' => false,
		'visibility' => 'always',
		'align'      => 'right',
		'layout'	 => 'row-inside',
	);
	$config['statusIndicator'] = array(
		// The pill composer renders this text itself. The default composer keeps
		// Persona's normal connection status behavior.
		'visible'        => 'pill' !== $appearance['composerStyle'],
		'idleText'       => (string) $appearance['disclaimer'],
		'connectedText'  => (string) $appearance['disclaimer'],
		'connectingText' => __( 'Connecting…', 'persona-assistant' ),
		'errorText'      => __( 'Connection error', 'persona-assistant' ),
	);
	$config['features']['scrollToBottom'] = array(
		'enabled'  => true,
		'iconName' => 'arrow-down',
		'label'    => '',
	);
	$config['features']['scrollBehavior'] = array_merge(
		isset( $config['features']['scrollBehavior'] ) && is_array( $config['features']['scrollBehavior'] )
			? $config['features']['scrollBehavior']
			: array(),
		array(
			'mode'                    => 'follow',
			'showActivityWhilePinned' => true,
		)
	);

	// Persona dresses its chat panel as a rounded, bordered card via the
	// documented components.panel theme tokens (they feed --persona-panel-radius
	// and --persona-panel-border). The card look is right for the floating
	// launcher, but the assistant Page fills the shell edge-to-edge, so the
	// corners must sit flat. Set on BOTH themes: dark mode resolves its own
	// component tokens.
	foreach ( array( 'theme', 'darkTheme' ) as $theme_key ) {
		$config[ $theme_key ]['components']['panel'] = array(
			'borderRadius' => '0px',
			'border'       => 'none',
		);
	}

	if ( 'chatgpt' === persona_assistant_normalize_assistant_preset( (string) $appearance['preset'] ) ) {
		$config['theme'] = array_replace_recursive( $config['theme'], persona_assistant_neutral_assistant_theme( false ) );
		$config['darkTheme'] = array_replace_recursive( $config['darkTheme'], persona_assistant_neutral_assistant_theme( true ) );
	}

	return $config;
}

/**
 * Cache-busting version string for a plugin asset.
 *
 * Appends the file's mtime so every edit invalidates browser caches. The
 * plugin version alone only changes on releases, which leaves admins staring
 * at stale CSS/JS between them.
 *
 * @param string $relative Asset path relative to the plugin root.
 * @return string
 */
function persona_assistant_asset_version( $relative ) {
	$mtime = @filemtime( PERSONA_ASSISTANT_DIR . $relative );
	return $mtime ? PERSONA_ASSISTANT_VERSION . '.' . $mtime : PERSONA_ASSISTANT_VERSION;
}

/**
 * Get the merged settings (saved over defaults).
 *
 * @return array<string,mixed>
 */
function persona_assistant_get_settings() {
	$saved  = get_option( PERSONA_ASSISTANT_SETTINGS_OPTION, null );
	$exists = is_array( $saved );
	if ( ! is_array( $saved ) ) {
		$saved = array();
	}
	// Migrate the original boolean site-wide setting without changing existing
	// sites when placement_mode was introduced. A previously disabled footer
	// still allowed blocks/shortcodes, so it maps to manual placement.
	if ( ! array_key_exists( 'placement_mode', $saved ) ) {
		$saved['placement_mode'] = $exists ? ( ! empty( $saved['enabled'] ) ? 'sitewide' : 'manual' ) : 'off';
	}
	return wp_parse_args( $saved, persona_assistant_default_settings() );
}

/**
 * Is the site-wide floating launcher published?
 *
 * @return bool
 */
function persona_assistant_sitewide_enabled() {
	return 'sitewide' === persona_assistant_get_setting( 'placement_mode', 'off' );
}

/**
 * Get the WordPress Page assigned to the full-screen assistant.
 *
 * @return int Page ID, or 0 when the surface is disabled.
 */
function persona_assistant_get_assistant_page_id() {
	return absint( persona_assistant_get_setting( 'assistant_page_id', 0 ) );
}

/**
 * Does the configured assistant Page still exist outside the Trash?
 *
 * @return bool
 */
function persona_assistant_page_exists() {
	$page_id = persona_assistant_get_assistant_page_id();
	$page    = $page_id ? get_post( $page_id ) : null;
	return $page instanceof WP_Post
		&& 'page' === $page->post_type
		&& 'trash' !== $page->post_status;
}

/**
 * Is the current front-end query the configured full-screen assistant Page?
 *
 * Conditional tags are only reliable after WordPress has parsed the main
 * query, which is true for template selection and wp_enqueue_scripts.
 *
 * @return bool
 */
function persona_assistant_is_assistant_page() {
	$page_id = persona_assistant_get_assistant_page_id();
	return $page_id > 0 && persona_assistant_page_exists() && ! is_admin() && is_page( $page_id );
}

/**
 * Is this the authenticated, nonce-protected full-screen admin preview?
 *
 * The preview deliberately uses a front-end URL so it receives the same
 * document, theme font, widget bootstrap, and full-screen template as the
 * published assistant Page. It is available only to administrators.
 *
 * @return bool
 */
function persona_assistant_is_fullscreen_preview() {
	if ( is_admin() || ! current_user_can( 'manage_options' ) ) {
		return false;
	}

	$is_preview = isset( $_GET['persona_assistant_preview'] ) && '1' === sanitize_text_field( wp_unslash( $_GET['persona_assistant_preview'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$nonce      = isset( $_GET['_wpnonce'] ) ? sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

	return $is_preview && wp_verify_nonce( $nonce, 'persona_assistant_fullscreen_preview' );
}

/**
 * Cache the most recently loaded Runtype agents for settings and block pickers.
 *
 * @param array<int,array<string,mixed>> $agents Agents returned by Runtype.
 * @return void
 */
function persona_assistant_cache_agents( array $agents ) {
	set_transient( 'persona_assistant_agents', $agents, 15 * MINUTE_IN_SECONDS );
}

/**
 * Get the recently loaded Runtype agents.
 *
 * @return array<int,array<string,mixed>>
 */
function persona_assistant_get_cached_agents() {
	$agents = get_transient( 'persona_assistant_agents' );
	return is_array( $agents ) ? $agents : array();
}

/**
 * Read a single setting.
 *
 * @param string $key     Setting key.
 * @param mixed  $default Fallback if absent.
 * @return mixed
 */
function persona_assistant_get_setting( $key, $default = null ) {
	$settings = persona_assistant_get_settings();
	return array_key_exists( $key, $settings ) ? $settings[ $key ] : $default;
}

/**
 * Resolve the management API key.
 *
 * A wp-config.php constant is preferred for secrets; the stored option is the
 * fallback. Returned only to server-side code, never localized to the browser.
 *
 * @return string
 */
function persona_assistant_get_api_key() {
	if ( defined( 'PERSONA_ASSISTANT_API_KEY' ) && PERSONA_ASSISTANT_API_KEY ) {
		return (string) PERSONA_ASSISTANT_API_KEY;
	}
	return (string) persona_assistant_get_setting( 'api_key', '' );
}

/**
 * Resolve the Runtype API base URL (constant override → setting → default), no trailing slash.
 *
 * @return string
 */
function persona_assistant_get_api_base() {
	if ( defined( 'PERSONA_ASSISTANT_API_BASE' ) && PERSONA_ASSISTANT_API_BASE ) {
		return untrailingslashit( (string) PERSONA_ASSISTANT_API_BASE );
	}
	$base = (string) persona_assistant_get_setting( 'api_base', PERSONA_ASSISTANT_DEFAULT_API_BASE );
	return untrailingslashit( '' !== $base ? $base : PERSONA_ASSISTANT_DEFAULT_API_BASE );
}

/**
 * The Persona version specifier pinned in the installer URL (e.g. `4` or
 * `4.9.0` from `.../persona@4/dist/install.global.js`), or '' when the URL has
 * no npm-style pin (e.g. a self-hosted copy).
 *
 * Passed to the installer as `version` so the widget bundle and the
 * webmcp-polyfill chunk it loads stay on the SAME version as the installer.
 * without it the installer defaults those chunks to `latest`, which could
 * drift across a future major release.
 *
 * @return string
 */
function persona_assistant_installer_version() {
	return defined( 'PERSONA_ASSISTANT_PERSONA_VERSION' ) ? PERSONA_ASSISTANT_PERSONA_VERSION : '';
}

/**
 * URL of a Persona dist asset served from the same directory as the installer.
 *
 * The widget resolves its lazy chunks (history-view.js, webmcp-polyfill.js, …)
 * by rewriting its own script URL, so every dist file must stay colocated with
 * install.global.js under their canonical names — including when the
 * PERSONA_ASSISTANT_INSTALL_URL override points at a self-hosted copy.
 *
 * @param string $file Dist filename, e.g. 'index.global.js' or 'widget.css'.
 * @return string
 */
function persona_assistant_vendor_asset_url( $file ) {
	return dirname( PERSONA_ASSISTANT_INSTALL_URL ) . '/' . $file;
}

/**
 * The Runtype dashboard base URL, derived from the API base so a staging or
 * self-hosted API (api.example.com) links to its matching dashboard
 * (use.example.com).
 *
 * @return string No trailing slash.
 */
function persona_assistant_dashboard_base() {
	$host = wp_parse_url( persona_assistant_get_api_base(), PHP_URL_HOST );
	if ( is_string( $host ) && 0 === strpos( $host, 'api.' ) ) {
		return 'https://use.' . substr( $host, 4 );
	}
	return 'https://use.runtype.com';
}

/**
 * Resolve the Runtype client-token environment ('test' | 'live').
 *
 * A wp-config constant wins (only 'test' or 'live' honored); otherwise the
 * stored setting for back-compat; otherwise 'live'. There is no UI for this.
 *
 * @return string 'test' | 'live'.
 */
function persona_assistant_get_environment() {
	if ( defined( 'PERSONA_ASSISTANT_ENVIRONMENT' ) ) {
		$env = (string) PERSONA_ASSISTANT_ENVIRONMENT;
		if ( 'test' === $env || 'live' === $env ) {
			return $env;
		}
	}
	$stored = (string) persona_assistant_get_setting( 'environment', 'live' );
	return ( 'test' === $stored ) ? 'test' : 'live';
}

/**
 * The site's browser origin (scheme://host[:port]), derived from home_url().
 *
 * This is what a Runtype client token's `allowedOrigins` is scoped to, and it must
 * match the `Origin` header the browser sends to the Runtype API, which is the
 * origin only (no path), even when WordPress lives in a subdirectory.
 *
 * @return string
 */
function persona_assistant_site_origin() {
	$home  = home_url();
	$parts = wp_parse_url( $home );
	if ( empty( $parts['host'] ) ) {
		return untrailingslashit( $home );
	}
	$scheme = isset( $parts['scheme'] ) ? $parts['scheme'] : 'https';
	$origin = $scheme . '://' . $parts['host'];
	if ( ! empty( $parts['port'] ) ) {
		$origin .= ':' . $parts['port'];
	}
	return $origin;
}

/**
 * Minted-client-token state.
 *
 * @return array<string,mixed>
 */
function persona_assistant_get_state() {
	$state = get_option( PERSONA_ASSISTANT_STATE_OPTION, array() );
	return is_array( $state ) ? $state : array();
}

/**
 * Persist minted-client-token state. Not autoloaded.
 *
 * @param array<string,mixed> $state State to store.
 * @return void
 */
function persona_assistant_update_state( array $state ) {
	update_option( PERSONA_ASSISTANT_STATE_OPTION, $state, false );
}

/**
 * Merge a patch onto the existing state (read-modify-write).
 *
 * The state option is stored as a WHOLE-ARRAY replace, so any partial write
 * (notably the OAuth token keys) MUST merge onto the current state or it would
 * clobber the minted `client_token` the front-end embeds.
 *
 * @param array<string,mixed> $patch Keys to add or overwrite.
 * @return array<string,mixed> The merged state that was persisted.
 */
function persona_assistant_merge_state( array $patch ) {
	$merged = array_merge( persona_assistant_get_state(), $patch );
	persona_assistant_update_state( $merged );
	return $merged;
}

/**
 * Clear minted-client-token state.
 *
 * @return void
 */
function persona_assistant_clear_state() {
	delete_option( PERSONA_ASSISTANT_STATE_OPTION );
}

/**
 * The client token actually embedded on the page.
 *
 * For the `client_token` source it is the pasted value (the
 * PERSONA_ASSISTANT_CLIENT_TOKEN constant winning over the stored setting); for
 * `api_key`/`oauth` it is the token minted from that credential. Browser-safe
 * either way.
 *
 * @return string
 */
function persona_assistant_effective_client_token() {
	if ( Persona_Assistant_Credential::SOURCE_CLIENT_TOKEN === Persona_Assistant_Credential::source() ) {
		if ( defined( 'PERSONA_ASSISTANT_CLIENT_TOKEN' ) && PERSONA_ASSISTANT_CLIENT_TOKEN ) {
			return trim( (string) PERSONA_ASSISTANT_CLIENT_TOKEN );
		}
		return trim( (string) persona_assistant_get_setting( 'client_token', '' ) );
	}
	$state = persona_assistant_get_state();
	return isset( $state['client_token'] ) ? (string) $state['client_token'] : '';
}

/**
 * The agent the widget routes to.
 *
 * The PERSONA_ASSISTANT_AGENT_ID constant (a developer pin set in wp-config.php)
 * wins over the setting saved from the agent picker.
 *
 * @return string
 */
function persona_assistant_effective_agent_id() {
	if ( defined( 'PERSONA_ASSISTANT_AGENT_ID' ) && PERSONA_ASSISTANT_AGENT_ID ) {
		return trim( (string) PERSONA_ASSISTANT_AGENT_ID );
	}
	return trim( (string) persona_assistant_get_setting( 'agent_id', '' ) );
}

/**
 * Is a usable Runtype client token available (pasted or minted)?
 *
 * @return bool
 */
function persona_assistant_runtype_available() {
	return '' !== persona_assistant_effective_client_token();
}

/**
 * Is the site's built-in AI usable for text generation?
 *
 * @return bool
 */
function persona_assistant_wp_ai_available() {
	return (bool) apply_filters( 'persona_assistant_wp_ai_available', Persona_Assistant_AI::is_available() );
}

/**
 * Base URL of the Runtype demo client plane, no trailing slash.
 *
 * This is the `/demo` CONTRACT base (consumer-owned segment); the widget
 * appends the `/v1/client/*` wire segment itself. Constant override wins so a
 * dev site can point at a pre-release or self-hosted demo plane.
 *
 * @return string
 */
function persona_assistant_demo_api_base() {
	$base = defined( 'PERSONA_ASSISTANT_DEMO_API_BASE' ) && PERSONA_ASSISTANT_DEMO_API_BASE
		? (string) PERSONA_ASSISTANT_DEMO_API_BASE
		: PERSONA_ASSISTANT_DEFAULT_DEMO_API_BASE;

	/**
	 * Filter the demo client-plane base URL.
	 *
	 * @param string $base Demo contract base, e.g. https://mock.runtype.com/demo.
	 */
	return untrailingslashit( (string) apply_filters( 'persona_assistant_demo_api_base', $base ) );
}

/**
 * May THIS request run the widget in demo mode?
 *
 * Demo mode is the try-before-connecting state: the widget runs in ordinary
 * client-token mode against the public demo plane with scripted responses.
 * It is intentionally limited to users who can manage the plugin so a canned
 * bot is never shown to real site visitors, and it stands down when the demo
 * contract has been retired server-side (HTTP 410, see
 * persona_assistant_demo_retired()).
 *
 * @return bool
 */
function persona_assistant_demo_available() {
	/**
	 * Kill-switch for demo mode (default on). Return false to restore the old
	 * behavior where an unconfigured site resolves to 'disabled'.
	 *
	 * @param bool $enabled Whether demo mode may run at all.
	 */
	if ( ! apply_filters( 'persona_assistant_demo_enabled', true ) ) {
		return false;
	}
	if ( ! is_user_logged_in() || ! current_user_can( 'manage_options' ) ) {
		return false;
	}
	return ! persona_assistant_demo_retired();
}

/**
 * Has the pinned demo contract been retired server-side?
 *
 * Branches on the HTTP 410 STATUS only (never on error-body strings — the
 * plane's documented consumer contract): 410 means this plugin build's demo
 * pin is dead and the fix is a plugin update, so demo resolves to disabled.
 * Every other outcome — including a network failure — treats the demo as
 * alive: PHP being unable to reach the plane does not mean the visitor's
 * browser cannot (WordPress Playground is exactly that case), and the widget
 * surfaces its own error if the browser truly cannot connect.
 *
 * The probe is cached in a transient (keyed content includes the base URL so
 * a base change re-probes) to keep admin page renders free of a per-request
 * HTTP round trip.
 *
 * @return bool
 */
function persona_assistant_demo_retired() {
	$base   = persona_assistant_demo_api_base();
	$cached = get_transient( 'persona_assistant_demo_probe' );
	if ( is_array( $cached ) && isset( $cached['base'], $cached['retired'] ) && $cached['base'] === $base ) {
		return (bool) $cached['retired'];
	}

	$response = wp_remote_post(
		$base . '/v1/client/init',
		array(
			'timeout' => 5,
			'headers' => array(
				'Content-Type' => 'application/json',
				'User-Agent'   => 'WordPress-Persona/' . PERSONA_ASSISTANT_VERSION . '; ' . home_url( '/' ),
			),
			'body'    => '{}',
		)
	);

	$retired = ! is_wp_error( $response ) && 410 === (int) wp_remote_retrieve_response_code( $response );
	// A definitive answer (including a healthy 2xx) holds for 6 hours; a
	// network error re-probes sooner in case connectivity comes back.
	$ttl = is_wp_error( $response ) ? HOUR_IN_SECONDS : 6 * HOUR_IN_SECONDS;
	set_transient(
		'persona_assistant_demo_probe',
		array(
			'base'    => $base,
			'retired' => $retired,
		),
		$ttl
	);

	return $retired;
}

/**
 * Resolve which power source actually runs for the front-end widget.
 *
 * Precedence is "prefer Runtype": with `auto`, a Runtype token wins over WP AI.
 * An explicit `runtype`/`wordpress_ai` choice only runs if that source is
 * actually available.
 *
 * When NO real source is ready, plugin managers get `demo` — the widget in
 * ordinary client-token mode against the public scripted demo plane — instead
 * of nothing, regardless of which source they intended to configure. Everyone
 * else still gets `disabled`, so a canned bot is never shown to visitors (see
 * persona_assistant_demo_available()).
 *
 * @return string One of: runtype | wordpress_ai | demo | disabled.
 */
function persona_assistant_resolve_mode() {
	$preference = persona_assistant_get_setting( 'power_source', 'auto' );
	$has_runtype = persona_assistant_runtype_available();
	$has_wp_ai   = persona_assistant_wp_ai_available();

	switch ( $preference ) {
		case 'runtype':
			if ( $has_runtype ) {
				return 'runtype';
			}
			break;

		case 'wordpress_ai':
			if ( $has_wp_ai ) {
				return 'wordpress_ai';
			}
			break;

		case 'auto':
		default:
			if ( $has_runtype ) {
				return 'runtype';
			}
			if ( $has_wp_ai ) {
				return 'wordpress_ai';
			}
			break;
	}

	return persona_assistant_demo_available() ? 'demo' : 'disabled';
}

/**
 * Is the "page tools (WebMCP)" master toggle on?
 *
 * The toggle alone does nothing: the feature only wires anything when it is on
 * AND the resolved mode is Runtype (see persona_assistant_webmcp_active()).
 *
 * @return bool
 */
function persona_assistant_webmcp_enabled() {
	return (bool) persona_assistant_get_setting( 'webmcp_enabled', false );
}

/**
 * Is the WebMCP page-tools feature actually live for this request?
 *
 * Runtype mode only: in WordPress-AI mode the backend cannot pause/resume a tool
 * call yet, so the feature stays inert there: no widget config key, no tool
 * registration script, and the REST route refuses to run.
 *
 * @return bool
 */
function persona_assistant_webmcp_active() {
	return persona_assistant_webmcp_enabled() && 'runtype' === persona_assistant_resolve_mode();
}

/**
 * Should the BROWSER side of page tools be wired for this request (the
 * registration script and the widget's `webmcp` config key)?
 *
 * True whenever the full feature is active, and also in demo mode — where the
 * demo plane's flagship scenario round-trips the browser-only
 * `get_current_page` tool through the real pause/approve/resume machinery.
 * Demo does not require the master toggle: the demo manifest is limited to
 * read-only client-side tools (see Persona_Assistant_WebMCP::build_manifest())
 * and demo itself is limited to plugin managers. The server execute route
 * stays gated on persona_assistant_webmcp_active(), so demo mode never opens
 * a server-side tool path.
 *
 * @return bool
 */
function persona_assistant_webmcp_client_active() {
	return persona_assistant_webmcp_active() || 'demo' === persona_assistant_resolve_mode();
}

/**
 * Is the Abilities API (WordPress 6.9+) present and its auto-exposure enabled?
 *
 * @return bool
 */
function persona_assistant_webmcp_abilities_enabled() {
	return persona_assistant_webmcp_enabled()
		&& (bool) persona_assistant_get_setting( 'webmcp_abilities', true )
		&& function_exists( 'wp_get_abilities' )
		&& class_exists( 'WP_Ability' );
}
