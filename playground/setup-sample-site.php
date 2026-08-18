<?php
/**
 * Seed the Persona Assistant product tour for WordPress Playground previews.
 *
 * WordPress must already be loaded. Safe to require more than once.
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( get_option( 'persona_assistant_sample_site_seeded' ) ) {
	return;
}

update_option( 'blogname', 'Persona Assistant Demo' );
update_option( 'blogdescription', 'An interactive WordPress Playground preview' );
update_option( 'permalink_structure', '/%postname%/' );
update_option( 'show_on_front', 'page' );

if ( function_exists( 'wp_update_custom_css_post' ) ) {
	wp_update_custom_css_post(
		'body.home header.wp-block-template-part,'
		. 'body.home footer.wp-block-template-part,'
		. 'body.home .wp-block-post-title{display:none;}'
		. 'body.home main{margin-block-start:0!important;}'
		. 'body.home main .wp-block-group.alignfull.has-global-padding:first-child{padding-top:0!important;padding-bottom:0!important;}'
		. 'body.home .entry-content{margin-block-start:0;}'
		. 'body.home .persona-demo-header+.wp-block-group{margin-block-start:0!important;}'
	);
}

$screenshots_base = 'https://raw.githubusercontent.com/runtypelabs/persona-wordpress-plugin/main/wordpress-org-assets/';
$connection_url   = '/wp-admin/options-general.php?page=persona-assistant&amp;view=connection';
$brand_url        = '/wp-admin/options-general.php?page=persona-assistant&amp;view=brand';
$launcher_url     = '/wp-admin/options-general.php?page=persona-assistant&amp;view=launcher';
$assistant_url    = '/wp-admin/options-general.php?page=persona-assistant&amp;view=assistant';
$advanced_url     = '/wp-admin/options-general.php?page=persona-assistant&amp;view=advanced';
$settings_url     = '/wp-admin/options-general.php?page=persona-assistant';

$home_content = <<<HTML
<!-- wp:group {"align":"full","className":"persona-demo-header","style":{"color":{"background":"#ffffff","text":"#111827"},"border":{"bottom":{"color":"#e5e7eb","width":"1px"}},"spacing":{"padding":{"top":"1rem","right":"clamp(1.25rem,5vw,4rem)","bottom":"1rem","left":"clamp(1.25rem,5vw,4rem)"}}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between"}} -->
<div class="wp-block-group alignfull persona-demo-header has-text-color has-background is-content-justification-space-between is-layout-flex wp-block-group-is-layout-flex" style="border-bottom-color:#e5e7eb;border-bottom-width:1px;color:#111827;background-color:#ffffff;padding-top:1rem;padding-right:clamp(1.25rem,5vw,4rem);padding-bottom:1rem;padding-left:clamp(1.25rem,5vw,4rem)">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"1.05rem","fontWeight":"700","letterSpacing":"-0.02em"}}} -->
<p style="font-size:1.05rem;font-weight:700;letter-spacing:-0.02em"><a href="/" style="text-decoration:none">Persona Assistant</a></p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"1.25rem"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-group is-layout-flex wp-block-group-is-layout-flex">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.9rem"}}} --><p style="font-size:0.9rem"><a href="#setup">How it works</a></p><!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.9rem"}}} --><p style="font-size:0.9rem"><a href="{$connection_url}"><strong>Connect AI</strong></a></p><!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.9rem"}}} --><p style="font-size:0.9rem"><a href="/assistant/">Assistant Page</a></p><!-- /wp:paragraph -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.9rem"}}} --><p style="font-size:0.9rem"><a href="{$settings_url}">Plugin Settings</a></p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"clamp(3rem,8vw,7rem)","right":"clamp(1.5rem,6vw,6rem)","bottom":"clamp(3rem,8vw,7rem)","left":"clamp(1.5rem,6vw,6rem)"}},"color":{"background":"#111827","text":"#f9fafb"}},"layout":{"type":"constrained","contentSize":"1120px"}} -->
<div class="wp-block-group alignfull has-text-color has-background" style="color:#f9fafb;background-color:#111827;padding-top:clamp(3rem,8vw,7rem);padding-right:clamp(1.5rem,6vw,6rem);padding-bottom:clamp(3rem,8vw,7rem);padding-left:clamp(1.5rem,6vw,6rem)">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.78rem","fontStyle":"normal","fontWeight":"700","letterSpacing":"0.12em"},"color":{"text":"#a5b4fc"}}} -->
<p class="has-text-color" style="color:#a5b4fc;font-size:0.78rem;font-style:normal;font-weight:700;letter-spacing:0.12em">WORDPRESS PLAYGROUND PREVIEW</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"clamp(3rem,8vw,6.5rem)","lineHeight":"0.95","letterSpacing":"-0.055em"},"spacing":{"margin":{"top":"1.25rem","bottom":"1.5rem"}}}} -->
<h1 class="wp-block-heading" style="margin-top:1.25rem;margin-bottom:1.5rem;font-size:clamp(3rem,8vw,6.5rem);letter-spacing:-0.055em;line-height:0.95">Put an AI assistant<br>on WordPress.</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"clamp(1.1rem,2vw,1.4rem)","lineHeight":"1.55"},"color":{"text":"#d1d5db"},"spacing":{"margin":{"bottom":"2rem"}}}} -->
<p class="has-text-color" style="color:#d1d5db;margin-bottom:2rem;font-size:clamp(1.1rem,2vw,1.4rem);line-height:1.55">Persona Assistant adds a customizable floating launcher and a full-screen assistant Page to any WordPress site. The assistant is already running here in demo mode — open the launcher in the corner, then connect an AI to make it answer for real.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button {"backgroundColor":"vivid-purple","style":{"border":{"radius":"999px"},"spacing":{"padding":{"left":"1.5rem","right":"1.5rem","top":"0.85rem","bottom":"0.85rem"}}}} -->
<div class="wp-block-button"><a class="wp-block-button__link has-vivid-purple-background-color has-background wp-element-button" href="/assistant/" style="border-radius:999px;padding-top:0.85rem;padding-right:1.5rem;padding-bottom:0.85rem;padding-left:1.5rem"><strong>Try the assistant →</strong></a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline","style":{"border":{"radius":"999px"},"spacing":{"padding":{"left":"1.5rem","right":"1.5rem","top":"0.85rem","bottom":"0.85rem"}}}} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="{$connection_url}" style="border-radius:999px;padding-top:0.85rem;padding-right:1.5rem;padding-bottom:0.85rem;padding-left:1.5rem">Connect an AI</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.9rem"},"color":{"text":"#9ca3af"},"spacing":{"margin":{"top":"1.25rem"}}}} -->
<p class="has-text-color" style="color:#9ca3af;margin-top:1.25rem;font-size:0.9rem">You are signed in as a Playground administrator, so chat is live right now with simulated demo responses. Say "hi" for a tour, or ask "What page am I looking at?" to watch a real page tool run behind an approval prompt.</p>
<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"anchor":"setup","align":"wide","style":{"spacing":{"padding":{"top":"5rem","bottom":"5rem"}}},"layout":{"type":"constrained","contentSize":"1120px"}} -->
<div id="setup" class="wp-block-group alignwide" style="padding-top:5rem;padding-bottom:5rem">
<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"4rem"}}}} -->
<div class="wp-block-columns">
<!-- wp:column {"width":"34%"} -->
<div class="wp-block-column" style="flex-basis:34%">
<!-- wp:paragraph {"style":{"typography":{"fontSize":"0.78rem","fontWeight":"700","letterSpacing":"0.1em"},"color":{"text":"#4f46e5"}}} -->
<p class="has-text-color" style="color:#4f46e5;font-size:0.78rem;font-weight:700;letter-spacing:0.1em">GO LIVE</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"style":{"typography":{"fontSize":"clamp(2rem,4vw,3.25rem)","lineHeight":"1.05","letterSpacing":"-0.04em"}}} -->
<h2 class="wp-block-heading" style="font-size:clamp(2rem,4vw,3.25rem);letter-spacing:-0.04em;line-height:1.05">From demo to live in three steps.</h2>
<!-- /wp:heading -->
</div>
<!-- /wp:column -->

<!-- wp:column {"width":"66%"} -->
<div class="wp-block-column" style="flex-basis:66%">
<!-- wp:group {"style":{"border":{"top":{"color":"#d1d5db","width":"1px"}},"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="border-top-color:#d1d5db;border-top-width:1px;padding-top:1.5rem;padding-bottom:1.5rem">
<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">01 — Connect</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>Connecting replaces the simulated demo with real answers. Choose WordPress built-in AI or Runtype — in Playground, a manually pasted, origin-scoped Runtype client token is the most direct path.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="{$connection_url}"><strong>Open Connection settings →</strong></a></p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"border":{"top":{"color":"#d1d5db","width":"1px"}},"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="border-top-color:#d1d5db;border-top-width:1px;padding-top:1.5rem;padding-bottom:1.5rem">
<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">02 — Make it yours</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>Set the accent color, icon, welcome copy, starter prompts, and theme behavior in a visual editor with a live preview.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="{$brand_url}"><strong>Open Brand &amp; Copy →</strong></a></p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"border":{"top":{"color":"#d1d5db","width":"1px"},"bottom":{"color":"#d1d5db","width":"1px"}},"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="border-top-color:#d1d5db;border-top-width:1px;border-bottom-color:#d1d5db;border-bottom-width:1px;padding-top:1.5rem;padding-bottom:1.5rem">
<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">03 — Publish</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>Turn on the site-wide pill launcher, assign a full-screen WordPress Page, or place chat manually with the block or shortcode.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p><a href="{$launcher_url}"><strong>Configure Launcher →</strong></a> &nbsp; <a href="{$assistant_url}"><strong>Configure Assistant Page →</strong></a></p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"color":{"background":"#f3f4f6"},"spacing":{"padding":{"top":"5rem","right":"clamp(1.5rem,6vw,6rem)","bottom":"5rem","left":"clamp(1.5rem,6vw,6rem)"}}},"layout":{"type":"constrained","contentSize":"1120px"}} -->
<div class="wp-block-group alignfull has-background" style="background-color:#f3f4f6;padding-top:5rem;padding-right:clamp(1.5rem,6vw,6rem);padding-bottom:5rem;padding-left:clamp(1.5rem,6vw,6rem)">
<!-- wp:heading {"style":{"typography":{"fontSize":"clamp(2.25rem,5vw,4rem)","letterSpacing":"-0.045em"},"spacing":{"margin":{"bottom":"0.75rem"}}}} -->
<h2 class="wp-block-heading" style="margin-bottom:0.75rem;font-size:clamp(2.25rem,5vw,4rem);letter-spacing:-0.045em">What you can build</h2>
<!-- /wp:heading -->
<!-- wp:paragraph {"style":{"typography":{"fontSize":"1.15rem"},"spacing":{"margin":{"bottom":"3rem"}}}} -->
<p style="margin-bottom:3rem;font-size:1.15rem">One connection, two primary surfaces, and a shared visual system.</p>
<!-- /wp:paragraph -->

<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"2rem","top":"2rem"}}}} -->
<div class="wp-block-columns">
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:image {"sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"16px"}}} -->
<figure class="wp-block-image size-large has-custom-border"><img src="{$screenshots_base}screenshot-1.png" alt="Persona Assistant Connection workspace" style="border-radius:16px"/><figcaption class="wp-element-caption"><strong>Connect either way.</strong> Use WordPress AI already configured on the site, or connect a Runtype assistant.</figcaption></figure>
<!-- /wp:image -->
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:image {"sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"16px"}}} -->
<figure class="wp-block-image size-large has-custom-border"><img src="{$screenshots_base}screenshot-2.png" alt="Persona Assistant Brand and Copy workspace" style="border-radius:16px"/><figcaption class="wp-element-caption"><strong>Design without code.</strong> Edit shared branding, welcome content, suggestions, and behavior with a live preview.</figcaption></figure>
<!-- /wp:image -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->

<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"2rem","top":"2rem"},"margin":{"top":"2rem"}}}} -->
<div class="wp-block-columns" style="margin-top:2rem">
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:image {"sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"16px"}}} -->
<figure class="wp-block-image size-large has-custom-border"><img src="{$screenshots_base}screenshot-3.png" alt="Persona Assistant floating pill launcher" style="border-radius:16px"/><figcaption class="wp-element-caption"><strong>Pill launcher.</strong> Add a site-wide floating entry point, or use the block and shortcode for deliberate placement.</figcaption></figure>
<!-- /wp:image -->
</div>
<!-- /wp:column -->
<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:image {"sizeSlug":"large","linkDestination":"none","style":{"border":{"radius":"16px"}}} -->
<figure class="wp-block-image size-large has-custom-border"><img src="{$screenshots_base}screenshot-4.png" alt="Persona Assistant full-screen Assistant Page" style="border-radius:16px"/><figcaption class="wp-element-caption"><strong>Assistant Page.</strong> Turn any native WordPress Page into a focused, full-height conversational experience.</figcaption></figure>
<!-- /wp:image -->
</div>
<!-- /wp:column -->
</div>
<!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"5rem","bottom":"5rem"}}},"layout":{"type":"constrained","contentSize":"1120px"}} -->
<div class="wp-block-group alignwide" style="padding-top:5rem;padding-bottom:5rem">
<!-- wp:heading {"style":{"typography":{"fontSize":"clamp(2.25rem,5vw,4rem)","letterSpacing":"-0.045em"}}} -->
<h2 class="wp-block-heading" style="font-size:clamp(2.25rem,5vw,4rem);letter-spacing:-0.045em">More than a chat bubble</h2>
<!-- /wp:heading -->
<!-- wp:columns {"style":{"spacing":{"blockGap":{"left":"2rem","top":"2rem"}}}} -->
<div class="wp-block-columns">
<!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">History</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Privacy-first browser history, optional WordPress AI account history for signed-in users, and Runtype session resumption.</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Attachments</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Allow images and documents independently on the launcher and Assistant Page, with type, count, and size limits.</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">Site tools</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Let assistants read site content through WebMCP or selected read-only WordPress Abilities, with explicit safeguards.</p><!-- /wp:paragraph --></div><!-- /wp:column -->
</div>
<!-- /wp:columns -->
<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
<div class="wp-block-buttons" style="margin-top:2rem"><!-- wp:button {"className":"is-style-outline","style":{"border":{"radius":"999px"}}} --><div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="{$advanced_url}" style="border-radius:999px">Explore Advanced settings →</a></div><!-- /wp:button --></div>
<!-- /wp:buttons -->
</div>
<!-- /wp:group -->
HTML;

$home_id = wp_insert_post(
	array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'Persona Assistant Demo',
		'post_name'    => 'persona-assistant-demo',
		'post_content' => $home_content,
	),
	true
);

$assistant_id = wp_insert_post(
	array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'Assistant',
		'post_name'    => 'assistant',
		'post_content' => 'This page is powered by Persona Assistant while the plugin is active.',
		'meta_input'   => array(
			'_persona_assistant_managed_assistant_page' => 1,
		),
	),
	true
);

if ( ! is_wp_error( $home_id ) ) {
	update_option( 'page_on_front', (int) $home_id );
}

if ( ! is_wp_error( $assistant_id ) ) {
	$option   = defined( 'PERSONA_ASSISTANT_SETTINGS_OPTION' ) ? PERSONA_ASSISTANT_SETTINGS_OPTION : 'persona_assistant_settings';
	$settings = function_exists( 'persona_assistant_get_settings' ) ? persona_assistant_get_settings() : array();
	$settings['placement_mode']       = 'sitewide';
	$settings['enabled']              = true;
	$settings['assistant_page_id']    = (int) $assistant_id;
	$settings['header_title']         = 'Persona Assistant';
	$settings['header_subtitle']      = 'AI chat for WordPress';
	$settings['welcome_title']        = 'How can I help?';
	$settings['welcome_subtitle']     = 'Ask a question about this site or choose a place to start.';
	$settings['welcome_message']      = 'I can answer questions, explain this page, and use the site tools you enable.';
	$settings['suggested_prompts']    = "What can you help me with?\nSummarize this page.\nHow do I get started?";
	$settings['launcher_teaser_text'] = 'Questions? Ask the assistant.';
	$settings['theme_color']          = '#4f46e5';
	$settings['ai_backend']           = 'auto';
	update_option( $option, $settings );
	// Demo mode activates the moment an administrator loads the site (no AI is
	// connected yet). Pre-seed the demo-plane health probe so Playground's
	// constrained PHP networking never stalls the first render — the widget
	// itself talks to the demo plane from the browser, where networking works.
	if ( function_exists( 'persona_assistant_demo_api_base' ) ) {
		set_transient(
			'persona_assistant_demo_probe',
			array(
				'base'    => persona_assistant_demo_api_base(),
				'retired' => false,
			),
			6 * HOUR_IN_SECONDS
		);
	}
	update_option(
		'persona_assistant_setup',
		array(
			'completed'    => true,
			'completed_at' => time(),
			'migrated'     => true,
		),
		false
	);
}

flush_rewrite_rules( false );
update_option( 'persona_assistant_sample_site_seeded', 1, false );
