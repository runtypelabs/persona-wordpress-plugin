# Customization

## Admin lifecycle

Persona Assistant separates one-time onboarding from ongoing configuration. A fresh install opens a resumable checklist with two essential tasks (connect an AI and choose at least one visitor-facing surface) plus optional brand customization. Completing or skipping the checklist switches the default settings route to an Overview dashboard. Existing configured installations are migrated directly to complete.

The permanent administration uses focused query-based workspaces instead of a long wizard:

* **Overview**: connection and surface status cards with direct actions.
* **Connection**: Runtype or WordPress AI provider and agent configuration.
* **Brand & Copy**: shared accent, theme mode, corner style, titles, welcome layout/copy, rich starter suggestions, scrollbar policy, and an isolated live preview.
* **Launcher**: publishing mode, icon, position, proactive teaser, and an isolated live preview.
* **Assistant Page**: WordPress Page selection, Branded/ChatGPT-like style presets, shared welcome content, Page-specific welcome/prompt presentation, fine-tuning, and a full-screen live preview.
* **Advanced**: browser/account conversation retention, reasoning/tool visibility, automatic follow-up suggestions, and WebMCP settings.

Each workspace submits a `_persona_assistant_scope` marker. The sanitizer begins with the saved option and updates only keys owned by that workspace, so a Launcher save cannot reset Assistant Page or Connection settings.

The widget config is composed once, server-side, by **`persona_assistant_widget_config( $context, $settings = null, $is_preview = false )`** (`includes/helpers.php`, `$context` = `'frontend'` | `'preview'` | `'fullscreen'`): the single source of truth the front end (`Persona_Assistant_Frontend::build_data()`), assistant Page, and admin previews consume. It returns the nested installer `config` (launcher, welcome, suggestions, copy, theme, `darkTheme`, `colorScheme`, features); the theme is derived from the accent color + corner style by `persona_assistant_widget_theme()`, and a dark palette by `persona_assistant_widget_dark_theme()`.

## Persona capability mapping

The plugin bundles the Persona runtime (pinned by the `PERSONA_ASSISTANT_PERSONA_VERSION` constant)

| Persona capability | WordPress ownership |
| --- | --- |
| `welcome.*` | Admin-customizable title, subtitle, card/hero/hidden layout, dismissal, shared icon, and display-only greeting bubble. Copy stays shared across surfaces; the Assistant Page can override layout and dismissal. |
| `suggestions.starters.*` | Admin-customizable prompt text, card/chip/list style, welcome/composer placement, send/fill behavior, wrap/scroll overflow, and 1-8 item cap. The Assistant Page can inherit or override presentation and item count. |
| `launcher.teaser` | Admin-customizable teaser text, 0-60 second delay, once/every-load frequency, and dismissibility. |
| `suggestions.followUps.expose` | Optional Runtype-only toggle in Advanced; presentation uses Persona's compact wrapped chips. |
| `features.scrollBehavior.scrollbar` | Admin-customizable on-scroll, browser-default, or hidden behavior. |
| Centered 768px default, anchor-top streaming fixes, improved chips/header actions | Adopted automatically from the runtime; the Assistant Page width presets still override the default intentionally. |
| `renderWelcome` and re-entrant `renderComposer` | Developer extension points, not generic settings: useful for a site-specific pre-chat form, authenticated customer home, or help search that owns its own data and JavaScript. |
| Artifact drawer width and artifact chrome | Leave to `persona_assistant_widget_config` until the WordPress plugin has an explicit artifact workflow. |
| Per-surface typography and low-level theme tokens | Keep the WordPress UI focused on site-font matching, accent, and corner presets; advanced sites can add exact token overrides through `persona_assistant_widget_config`. |

The Assistant Page preview is not a JavaScript recreation. It is a nonce-protected, administrator-only iframe that loads `templates/fullscreen-assistant.php`, the public full-screen stylesheet, and the normal Persona bootstrap. Unsaved Assistant values are posted to WordPress, sanitized through the Assistant settings scope, composed by `persona_assistant_widget_config()`, and sent back to the iframe for `handle.update()`. This keeps the preview and published Page on the same document and configuration path while preventing preview-only autofocus and WebMCP registration.
