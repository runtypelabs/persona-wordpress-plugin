# Connecting AI

## Two ways to power AI

| Mode | What happens | Credential |
| --- | --- | --- |
| `runtype` | A browser-safe **client token** is embedded; the widget talks directly to `api.runtype.com`. | minted from your API key, or pasted |
| `wordpress_ai` | The widget's custom backend (`apiUrl`) points at the plugin's REST route, which calls the site's built-in AI and streams the reply back as **persona-wire** SSE (the same event vocabulary the Runtype API emits), which the widget parses natively. | none (uses your site's AI) |

`auto` prefers Runtype when a client token is available and otherwise falls back to built-in WordPress AI. The resolver lives in `persona_assistant_resolve_mode()` (`includes/helpers.php`).

## Credential architecture

`Persona_Assistant_Credential` resolves a **source** to a server-side bearer credential; `Persona_Assistant_Runtype` uses it to mint a domain-scoped client token. The minted `ct_...` is what gets embedded, identical downstream regardless of source.

The source is **derived, not chosen** (`Persona_Assistant_Credential::source()`): OAuth tokens in state win, then a pasted/constant client token, then an available API key, otherwise the "not connected yet" OAuth default. There is no credential-source picker in the UI.

| Source | Detected when | Yields |
| --- | --- | --- |
| `oauth` ("Login with Runtype") | OAuth tokens are stored (Tier 1: site-verified Authorization Code + PKCE) | a scoped access token (auto-refreshed) → feeds the mint engine |
| `client_token` | `PERSONA_ASSISTANT_CLIENT_TOKEN` constant or a pasted `ct_...` is stored | a `ct_...`, used as-is (no minting) |
| `api_key` | an API key is available (constant/legacy only, no UI field) | the `rt_...` key → mints a client token |

The mint call is `POST /v1/client-tokens` with `Authorization: Bearer <credential>` and a body of `{ name, allowedOrigins: [origin], productSurfaceId, agentIds/flowIds, environment }`. `productSurfaceId` is the chosen chat surface (the "Assistant" picker) and carries the surface policy plane (loggingPolicy, piiRedaction, webmcp, conversationTitles); the agent/flow ids are read from that surface's enabled capabilities via `GET /v1/products/{id}/surfaces/{surfaceId}`, because chat auth requires the token's agents/flows to overlap them. The token is re-minted when the site origin, the chosen surface, or the environment changes.

### "Login with Runtype": the OAuth seam (Tier 1 shipped)

One-click "Login with Runtype" is **available**, implemented as **Tier 1: site-verified OAuth 2.0 Authorization Code + PKCE**. The plugin proves control of its origin via an HTTP challenge (a public REST route the API fetches), which unlocks a short-lived, single-use, exact-match redirect URI back into wp-admin. The acquired access token is a bearer credential that feeds the **identical** mint engine, and enabling it was purely a credential-acquisition front-end.

**Admin UX:** click **Connect with Runtype** → approve on the Runtype consent page → land back in wp-admin connected. No codes are shown anywhere. Requires the site to be publicly reachable over HTTPS; unreachable sites fall back to pasting a scoped client token (the "Connect manually with a client token" disclosure, which opens automatically when OAuth cannot work here).

**The flow (all server-side except the two browser redirects):**

1. `POST /v1/oauth/site-verifications` (unauthenticated, form-encoded `client_id`/`site_origin`/`redirect_uri`) → `{ verification_id, challenge_token }`. The plugin stashes the challenge in a 10-min transient.
2. The API `GET`s `{site_origin}/?rest_route=/persona-assistant/v1/oauth-challenge`; the plugin's public REST route returns `{ verification_id, token }` from that transient (and nothing else).
3. `POST /v1/oauth/site-verifications/{id}/verify` → `{ status: "verified" }`. The challenge transient is dropped immediately.
4. The plugin generates a PKCE `code_verifier`/`code_challenge` (S256) + a random `state`, stashes `{code_verifier, state, redirect_uri}` in a 10-min transient, and `wp_redirect`s the browser to `GET /v1/oauth/authorize?...`.
5. The consent page redirects back to the wp-admin `redirect_uri` with `?code&state`. The settings-page load handler validates `state` against the transient (the CSRF control for the external leg), then `POST /v1/oauth/token` (`grant_type=authorization_code`, PKCE verifier) → tokens.
6. Tokens are stored (merged onto state) and a client token is minted immediately via the existing reconcile path.

Code map: `Persona_Assistant_Runtype::{create_site_verification,verify_site,exchange_code,refresh_token,revoke_oauth_token}` (unauthenticated form-POST via `oauth_request`), `Persona_Assistant_REST::handle_oauth_challenge` (public route), `Persona_Assistant_Settings::{handle_oauth_connect,maybe_handle_oauth_callback,handle_oauth_disconnect}`, and `Persona_Assistant_Credential::oauth_credential` (returns a valid token, refreshing within a 120s skew).

**Tier 2, Device Authorization Grant (RFC 8628): designed but DISABLED server-side.** An enabled device client is a phishable surface for every builder account, so the server fails closed on device sessions for this client id and the plugin renders **no** device-code UI anywhere. Sites that fail verification paste a scoped client token instead.

* **Client ID:** `rt_wordpress_persona` (operator-seeded, first-party, public client, no secret; `PERSONA_ASSISTANT_OAUTH_CLIENT_ID` constant).
* **Scopes:** server-fixed `CLIENT_TOKENS:WRITE` + `AGENTS:READ` + `PRODUCTS:SURFACES:READ`. The plugin sends `scope=` empty; it never requests or expects `*`.
* **Refresh (foot-gun):** grants return a long-lived access token + a *rotating* refresh token with family replay detection. Concurrent refreshes burn the family, so refresh is **single-flighted** via an atomic `add_option()` lock (`persona_assistant_oauth_refresh_lock`, with a 30s stale-lock steal): the winner refreshes and persists the rotated pair atomically via `persona_assistant_merge_state`; losers wait briefly, re-read state, and fall back to the current token rather than double-refreshing. On an OAuth-level 4xx (family burn / `invalid_grant`) the OAuth state is cleared and `oauth_needs_reconnect` surfaces "reconnect required" in the status panel, and the already-minted `ct_...` keeps working until replaced. Transient network errors leave tokens intact.
* **Disconnect:** best-effort `POST /v1/oauth/revoke` (refresh + access), then clear only the `oauth_*` state keys via merge (the minted client token is preserved).
