# Page tools (WebMCP)

The **Advanced Behavior** group has a **Page tools (WebMCP)** master toggle (`webmcp_enabled`, default off). When it is on **and the resolved mode is Runtype**, the plugin advertises the [WebMCP](https://github.com/webmachinelearning/webmcp) capability to the widget (`config.webmcp = { enabled: true }`) and enqueues `assets/js/persona-webmcp.js`, which registers a set of page tools on `document.modelContext`. The Persona widget snapshots that registry at the start of every chat turn and shows the visitor a **native approval bubble** before invoking any tool.

The feature is **Runtype-only** in this phase: in `wordpress_ai` mode the backend cannot yet pause/resume a tool call, so nothing is advertised, no script is enqueued, and the REST route fails closed. Resolution lives in `persona_assistant_webmcp_active()` (`includes/helpers.php`); everything else lives in `Persona_Assistant_WebMCP` (`includes/class-persona-assistant-webmcp.php`).

**Built-in read-only tools** (always present when the feature is on; individually removable via the `persona_assistant_webmcp_tools` filter):

* `search_posts`: full-text search of published posts (id, title, excerpt, url, date; capped at 10).
* `get_post`: one published post by id or slug (title, url, date, author, plain-text content trimmed to ~5000 chars).
* `list_terms`: categories or tags (`taxonomy` ∈ `category` | `post_tag`), returning name, slug, count, and archive url.
* `get_current_page`: **answered entirely in the browser** from localized data (no REST call): the current url and title, plus id/type/excerpt on a singular post.

**Abilities auto-exposure.** With **Automatically expose Abilities API tools** on (`webmcp_abilities`, default on) and the [Abilities API](https://developer.wordpress.org/apis/abilities-api/) present (WordPress 6.9+), every registered ability whose permission check passes **for the current visitor** at manifest-build time also becomes a tool. Ability names (`my-plugin/do-thing`) are mapped to WebMCP-safe names (`my-plugin_do-thing`); an ability can never shadow a built-in tool name, and the original ability name is carried in the manifest entry so execution never depends on reversing the munge. Abilities are enumerated with `wp_get_abilities()`; each entry's name/label/description/schema come from `WP_Ability::get_name()`/`get_label()`/`get_description()`/`get_input_schema()`, the visitor gate is `WP_Ability::check_permissions()`, and execution is the all-in-one `WP_Ability::execute()` (which re-validates input, re-checks permission, runs, and validates output).

**Runtype surface step (required).** Runtype only admits WebMCP tools when the chat surface opts in. After enabling the toggle here, open the surface in your Runtype dashboard and turn on **Surface → WebMCP**, or the tools are rejected server-side. The settings status panel surfaces this reminder while the feature is active.

**Security model** (defence in depth):

* **Fail closed**: the `POST persona-assistant/v1/webmcp/execute` route refuses (403) when the feature is off or the mode is not Runtype, so a stale front end cannot reach a live handler.
* **Nonce**: the route requires the `wp_rest` cookie nonce (`X-WP-Nonce`), the CSRF control for the same-origin `fetch`.
* **Per-tool permission re-check at execute time**: abilities go through their own permission callback again (via `WP_Ability::execute()`); built-ins are public read only.
* **Input validation**: built-ins type/range-check their own args; abilities rely on the Abilities API's schema validation inside `execute()`.
* **Rate limit**: a per-visitor, per-minute cap mirroring the WP-AI throttle (`persona_assistant_webmcp_rate_limit`, default 30, hard-capped 1-120).
* **Persona approval bubbles**: every tool call is approved by the visitor in the widget.
* **Runtype origin allowlist / spotlighting**: the surface must additionally allow WebMCP, and the client token stays origin-scoped.

Responses are plain JSON, either `{ ok: true, result }` or `{ ok: false, error }` with an appropriate status, never HTML.
