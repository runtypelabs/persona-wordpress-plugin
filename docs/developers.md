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
| `persona_assistant_identity_subject` | `( string $sub, WP_User $user )`: stable subject, default `wp:<ID>`. Return a nonempty string; keep it stable to preserve usage attribution. |
| `persona_assistant_identity_claims` | `( array $claims, WP_User $user )`: add application claims. Issuer, subject, audience, issuance/expiry are protected, and the email opt-out is enforced after this filter. |
| `persona_assistant_identity_token_rate_limit` | `( int $limit )`: token requests per logged-in user per minute, default 10, hard-capped 1–60. |
| `persona_assistant_rest_permission` | Stricter site-specific policy for the WP-AI REST endpoint. |
| `persona_assistant_webmcp_tools` | `( array $tools )`: the composed WebMCP tool manifest before it is registered/executed. Remove or amend entries (each is `{ name, title, description, inputSchema, clientSide?, ability? }`). |
| `persona_assistant_webmcp_rate_limit` | The WebMCP per-visitor tool-execution rate limit (default 30, hard-capped 1-120). |

## Asset delivery / WordPress.org

The Persona runtime is shipped under `assets/vendor/persona/`, including its MIT license, at the exact version pinned by the `PERSONA_ASSISTANT_PERSONA_VERSION` constant. The widget discovers all of its dynamic chunks from that same local directory (so the files must keep their canonical names and stay colocated), and the plugin does not depend on a JavaScript CDN. `PERSONA_ASSISTANT_INSTALL_URL` remains available for reviewed self-hosted overrides.


## Verified WordPress identity in Runtype mode

In Connection, enable **Identify logged-in users to Runtype**, save, then register the integration. **Include email address** defaults on; unchecking it removes email from all newly issued tokens, including filtered claims. Already issued proofs can remain valid for up to five minutes. Identity sharing itself defaults off. Use a surface-bound client token so usage has a product association; the existing surface picker and token reconciliation already provide this.

The issuer is `rest_url('persona-assistant/v1/identity')` without a trailing slash; public keys are at `GET /persona-assistant/v1/identity/jwks`. Both must resolve to publicly reachable HTTPS URLs. The audience is `persona-assistant:` followed by the SHA-256 hash of the issuer. If the site URL, REST permalink format, or Runtype API base changes, register again. Registration creates the integration or updates its stored ID; a duplicate-issuer conflict is recovered by finding and updating the existing OIDC integration. Reusing the ID preserves Runtype's end-user namespace.

Existing Login with Runtype credentials may lack identity integration access. The manual registration section displays the exact JSON for `POST /v1/identity-integrations`. Use an API key with `INTEGRATIONS:READ` and `INTEGRATIONS:WRITE` (or `*`), then save its returned `idint_…` ID. A server-side `PERSONA_ASSISTANT_API_KEY` can also register through the button. Manual IDs are configuration, not proof of successful verification; Runtype verifies the token on use.

`POST /persona-assistant/v1/identity/token` requires a logged-in WordPress user and an `X-WP-Nonce` header for `wp_rest`, and returns `{ token, expiresAt }` with Unix expiry seconds and `Cache-Control: no-store`. RS256 tokens use RSA 2048-bit keys, a five-minute lifetime, and a stable subject. Token proofs are cached only in tab memory until sixty seconds before expiry. The browser callback returns the token string; Persona adds `{ provider: 'oidc', token }` to every chat request, independently of history. Neither email nor private keys are localized into widget configuration.

Rotation publishes both public keys immediately, signs with the existing key for two more minutes to allow short JWKS caches to expire, then signs with the new key. Both public keys remain published for fifteen minutes after the switch. A second rotation is rejected during that interval. Never rotate by deleting the key option: this would immediately invalidate active proofs.

Account-enabled history and visitor credentials are partitioned by WordPress user, site, provider, and surface. Persona selects `verified-user` history when identity is configured. Browser-only fallback requires the visitor to start a fresh chat; it resets verified history credentials and uses ephemeral state without remote history. Rejected messages and previous verified transcripts are never automatically replayed without identity. Refreshing the page restores the site's identity configuration. Agents requiring verified identity can still reject browser-only chats.

Ask Runtype to enable `enable-identity-exchange-admission` and `enable-end-user-usage-analytics` for the organization. Verification must be checked on a reachable HTTPS staging site: confirm end users and product usage, reject tampered/expired tokens, and exercise logged-out and disabled settings. These organization flags and reports are external prerequisites, not configured by the plugin.

Uninstall deletes local identity keys, registration metadata, and locks, and attempts to delete the matching Runtype integration before removing credentials. If the credential is disconnected or restricted, delete the integration manually in Runtype. Existing Runtype usage/user records are retained according to that service's policies.
