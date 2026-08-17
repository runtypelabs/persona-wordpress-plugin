# Surfaces

## Full-screen assistant Page

The Assistant Page workspace can assign any native WordPress Page as a full-screen assistant, or explicitly create and publish a new "Assistant" Page. The stored Page ID is the feature toggle: selecting no Page disables the surface without deleting, unpublishing, or editing the Page.

`Persona_Assistant_Fullscreen` replaces the selected Page's theme template through `template_include` with `templates/fullscreen-assistant.php`. The template deliberately omits theme header/footer markup but retains `wp_head()`, `wp_body_open()`, and `wp_footer()` so enqueued assets, SEO integrations, accessibility hooks, and the front-end admin bar continue to work. `assets/css/fullscreen.css` gives the mount a definite `100dvh` height (offset for the admin bar).

The `fullscreen` widget-config context sets Persona's supported page layout and then applies the selected assistant-page appearance:

```php
array(
	'launcher' => array(
		'enabled'    => false,
		'fullHeight' => true,
	),
	'autoFocusInput' => true,
	'layout' => array(
		'header'   => array( 'showCloseButton' => false ),
		'messages' => array( 'layout' => 'minimal' ),
		'contentMaxWidth' => '48rem',
	),
)
```

`persona_assistant_apply_assistant_appearance()` maps the stored controls to Persona's documented layout, theme, feature, status, and scroll config. The optional pill composer is implemented as a Persona `renderComposer` plugin in `assets/js/persona-layouts.js`, so it still uses the installer's native `sendMessage()`, attachment picker, recording API, and disabled state instead of replacing the chat runtime.

This surface is independent of `placement_mode`: it can coexist with the site-wide launcher or manual blocks/shortcodes. The site-wide footer instance is suppressed on the assistant Page so only the full-screen mount renders. Pages created by the plugin carry `_persona_assistant_managed_assistant_page` metadata for identification, but are intentionally preserved on disable, deactivation, and uninstall.
