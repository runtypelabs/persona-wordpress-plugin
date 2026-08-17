# Developers

## Constants

| Constant | Purpose |
| --- | --- |
| `PERSONA_ASSISTANT_API_KEY` | Supply the Runtype API key from `wp-config.php` (there is no UI field). Mints a scoped client token automatically. |
| `PERSONA_ASSISTANT_CLIENT_TOKEN` | Supply a pre-scoped, browser-safe `ct_...` client token from `wp-config.php`. Takes precedence over any pasted value; used as-is (no minting). |
| `PERSONA_ASSISTANT_API_BASE` | Override the Runtype API base (self-host / staging). No UI. |
| `PERSONA_ASSISTANT_ENVIRONMENT` | Force the client-token environment, `test` or `live` (default `live`). No UI. |
| `PERSONA_ASSISTANT_INSTALL_URL` | Override the Persona installer URL (e.g. a locally bundled copy). |

The WordPress-AI rate limit is filterable via `persona_assistant_wp_ai_rate_limit` (hard-capped 1-60).

## Filters

| Filter | Purpose |
| --- | --- |
| `persona_assistant_widget_config` | `( array $config, string $context )`: the composed nested widget config before it is localized. Context is `frontend`, `preview`, or `fullscreen`; amend launcher/copy/theme/features here. |
| `persona_assistant_match_site_font` | `( bool $enabled )`: front end only (default `true`). When on, the bootstrap reads `getComputedStyle(document.body).fontFamily` and deep-sets `config.theme.palette.typography.fontFamily.sans` so chat matches the site's body font. The admin preview never font-matches (wp-admin fonts are not the site's). |
| `persona_assistant_wp_ai_rate_limit` | The WordPress-AI per-visitor rate limit (hard-capped 1-60). |
| `persona_assistant_rest_permission` | Stricter site-specific policy for the WP-AI REST endpoint. |
| `persona_assistant_webmcp_tools` | `( array $tools )`: the composed WebMCP tool manifest before it is registered/executed. Remove or amend entries (each is `{ name, title, description, inputSchema, clientSide?, ability? }`). |
| `persona_assistant_webmcp_rate_limit` | The WebMCP per-visitor tool-execution rate limit (default 30, hard-capped 1-120). |

## Asset delivery / WordPress.org

The Persona runtime is shipped under `assets/vendor/persona/`, including its MIT license, at the exact version pinned by the `PERSONA_ASSISTANT_PERSONA_VERSION` constant. The widget discovers all of its dynamic chunks from that same local directory (so the files must keep their canonical names and stay colocated), and the plugin does not depend on a JavaScript CDN. `PERSONA_ASSISTANT_INSTALL_URL` remains available for reviewed self-hosted overrides.
