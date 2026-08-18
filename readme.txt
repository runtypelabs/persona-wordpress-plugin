=== Persona Assistant ===
Contributors: runtype
Tags: ai, assistant, chat, agent, support
Requires at least: 6.4
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add a customizable AI assistant to your site, powered by WordPress built-in AI or your Runtype account.

== Description ==

Persona Assistant embeds the open-source Persona chat widget on your WordPress site. It has two independent AI sources:

* **WordPress built-in AI**: if your site already has AI configured (WordPress 7.0's AI Client / the "AI" feature plugin with a connected Connector, or the AI Services plugin), the widget can be powered by your own AI through a small REST endpoint. WordPress AI Client mode preserves structured conversation history and supported image/document attachments, can display provider-returned reasoning, and can run an explicit allowlist of read-only WordPress Abilities. No Runtype account needed. If Connector Approval is enabled, approve this plugin under Settings → AI first.
* **Runtype**: connect your Runtype account and the widget talks directly to the Runtype API using a browser-safe, domain-scoped client token that the plugin mints for you.

Choose WordPress built-in AI or Runtype as the AI source; the plugin embeds whichever you select once it is ready.

Publish the chat as a site-wide floating launcher, place it manually with the `[persona_assistant]` shortcode or included "Persona Assistant" block, and optionally assign a native WordPress Page as a full-screen assistant. The full-screen Page is an independent surface, so it can coexist with either launcher or embed placement.

First-time setup is separate from everyday customization. A resumable checklist guides administrators through connecting an AI and choosing where chat appears, then the normal Overview provides focused workspaces:

* **Connection**: provider and assistant.
* **Brand & Copy**: shared colors, welcome layout, greeting, rich starter suggestions, scrollbar behavior, and live preview.
* **Launcher**: publishing mode, icon, position, proactive teaser message, and live preview.
* **Assistant Page**: Page selection, presets, shared welcome content, Page-specific welcome and starter-prompt presentation, layout controls, and full-screen live preview.
* **Advanced**: conversation retention, AI activity, attachment policy, automatic follow-up suggestions, and site tools.

On the front end the chat also matches your theme's body font automatically (opt out with the `persona_assistant_match_site_font` filter).

= Open source and community =

Persona Assistant uses [Persona](https://github.com/runtypelabs/persona), the MIT-licensed open-source interface that renders the chat experience. This plugin adapts Persona to WordPress by mapping WordPress settings to Persona configuration, serving the runtime locally, connecting WordPress AI or Runtype, and integrating Pages, blocks, attachments, Abilities, and WebMCP.

Feedback and contributions are welcome. For the Persona interface and runtime, open an issue or pull request in the Persona repository. For WordPress-specific feedback and contributions, visit the [Persona Assistant plugin repository](https://github.com/runtypelabs/persona-wordpress-plugin). If Persona is useful to your work, consider starring its repository to help other developers discover it.

= Page tools (WebMCP) =

In Runtype mode, the assistant can use the open **WebMCP** standard to search and read site content. Every built-in tool is read-only and requires visitor approval. Sites with the WordPress 6.9+ Abilities API may also expose abilities that the visitor can use. Requests have nonce, permission, validation, and rate-limit protection. Enable Page tools in Advanced and WebMCP on the Runtype chat surface.

= How the Runtype connection works =

* **Login with Runtype** (recommended) uses OAuth 2.0 with PKCE and verifies site ownership before returning to wp-admin. It requires a publicly reachable HTTPS site and requests only `CLIENT_TOKENS:WRITE` and `AGENTS:READ`.
* **Connect manually** accepts a browser-safe client token scoped to your site origin and agent. This is useful for local or private sites that Runtype cannot verify.

Advanced installations may define `PERSONA_ASSISTANT_API_KEY` in `wp-config.php`; the key stays server-side and mints an origin-scoped client token. Only the client token is sent to the browser.

= External services and privacy =

Persona itself is bundled locally and no widget code is loaded from a third-party CDN. Persona Assistant does not collect plugin telemetry.

The plugin sends data to an external service only when a visitor uses chat or an administrator connects/configures that service:

* **Runtype mode:** chat messages, attachments, available page context/tools, and tool results may be sent to Runtype and the AI providers configured for that assistant. The plugin also contacts Runtype while connecting an account, verifying site ownership, listing agents, refreshing access, and creating or revoking browser-safe client tokens. See the [Runtype Privacy Policy](https://www.runtype.com/privacy), [Terms of Service](https://www.runtype.com/terms), and [Security](https://www.runtype.com/security).
* **WordPress AI mode:** messages, attachments, selected read-only Ability results, and the configured system instruction are sent through the WordPress AI Client (or AI Services compatibility layer) to the connector/provider chosen by the site owner. Review that connector's privacy and retention terms.

Suggested disclosure text is added to WordPress's Settings → Privacy → Policy Guide.

= Conversation history and retention =

Conversation history is privacy-first and provider-aware:

* **Browser history** can be disabled, kept for the current tab session (the default), or remembered on the current device. Persona Assistant saves only user and assistant text; attachments, inline file data, reasoning, tool activity, artifacts, and execution metadata are removed first.
* **Runtype** remains the canonical store for Runtype sessions. The plugin may remember only the opaque Runtype session ID for the selected browser lifetime and does not duplicate the remote transcript in WordPress.
* **WordPress AI account history** is an optional administrator setting for logged-in visitors on the full-screen Assistant Page. It uses owner-scoped custom tables, defaults to 30-day retention, and is managed from the assistant's built-in conversation list, where visitors can start, reopen, and delete conversations (individually or all at once).

WordPress AI account history is included in WordPress's Tools → Export Personal Data and Erase Personal Data workflows. Attached files and AI execution details are never written to the history tables.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/` (or install the zip).
2. Activate it through the **Plugins** screen.
3. Follow the activation prompt or go to **Settings → Persona Assistant**.
4. Configure your WordPress AI provider, or connect Runtype (click **Connect with Runtype**, or paste a client token).
5. Complete the setup checklist by connecting an AI and choosing the launcher, assistant Page, or manual embeds.
6. Use the focused workspaces to customize each surface independently.

== Frequently Asked Questions ==

= Is my Runtype API key exposed to visitors? =

No. It stays server-side and is used only to mint the browser-safe client token. There is no API-key field in wp-admin; advanced installations may define it in `wp-config.php`:

`define( 'PERSONA_ASSISTANT_API_KEY', 'rt_live_...' );`

The plugin repository documents constants for a pre-scoped client token, pinned agent, and environment.

= Does the plugin load Persona from a CDN? =

No. The Persona widget runtime is bundled locally with the plugin, pinned to the exact version tested for each release. Its source is available at https://github.com/runtypelabs/persona and its MIT license is included under `assets/vendor/persona/LICENSE`.

= Which attachments are supported? =

Administrators can independently enable attachments for the launcher/embeds and assistant Page. The default allowlist is JPEG, PNG, GIF, WebP, PDF, plain text, Markdown, CSV, and JSON, with configurable limits up to four files and 10 MB each. Persona Assistant validates the MIME type and decoded size before forwarding a file. A selected AI connector may support fewer formats.

= Can WordPress AI use tools? =

On WordPress 7.0+, administrators can allow selected WordPress Abilities. Only registered Abilities explicitly marked read-only and non-destructive are offered. The plugin revalidates that metadata, uses WordPress's own Ability resolver and permission callback, and limits a response to four model/tool turns. Write-capable tools are intentionally excluded from version 1.0 because they need a separate approval flow.

= Is the public chat endpoint rate-limited? =

Yes. WordPress AI chat can require visitors to be logged in, and a per-visitor, per-minute request limit (default 10, hard-capped 1-60) always applies. Adjust the limit with the `persona_assistant_wp_ai_rate_limit` filter, and enforce additional site-specific rules with the `persona_assistant_rest_permission` filter.

= Where are conversations stored? =

By default, safe text-only history lasts for the current browser tab. Administrators can choose device storage or disable browser history in Advanced. Runtype transcripts remain in Runtype. Optional WordPress AI account history is stored in dedicated WordPress tables for logged-in Assistant Page users and follows the configured retention period. WordPress privacy export and erasure tools include that account history.

= Which database tables does the plugin create, and what is written to them? =

WordPress AI account history uses two plugin-owned tables (with your site's table prefix):

* `wp_persona_assistant_conversations` — one row per saved conversation: its public ID, the owning WordPress user ID, a title derived from the first message, created/updated timestamps, and the retention deadline.
* `wp_persona_assistant_messages` — the transcript: user and assistant **text only**, capped at the most recent 40 messages per conversation. Attachments, inline file data, reasoning, tool activity, artifacts, and execution metadata are stripped before anything is written.

Rows past the configured retention period are removed by a daily cleanup task, and a user's history is deleted when their WordPress account is deleted. If account history is never enabled, the tables stay empty. Browser history and Runtype sessions write nothing to these tables.

= What happens to stored conversations when the plugin is uninstalled? =

Deleting the plugin from the Plugins screen runs its uninstall routine, which **permanently drops both history tables** along with the plugin's settings. Deactivating (without deleting) keeps all data and only pauses the retention cleanup task. Export any needed history first via Tools → Export Personal Data.

== Screenshots ==

1. Configure AI
2. Theme Brand & Copy
3. Pill Launcher Example
4. Full-screen Assistant Example

== Changelog ==

= 1.1.0 =
* Added an administrator-only demo mode with simulated streaming responses, guided tool activity, and a live browser-only WebMCP round trip before an AI is connected.
* Added privacy-first on-device demo conversation history and Persona's conversation-history rail across demo, Runtype, and WordPress AI modes.
* Updated the bundled Persona runtime to a 4.18.0 pre-release and mounted it directly on full-screen Assistant Pages.
* Simplified Assistant Page style presets to Branded and ChatGPT-like while automatically migrating saved Classic and Minimal selections.

= 1.0.0 =
* Bundled Persona 4.16.0 locally for WordPress.org-compatible asset delivery.
* Added secure image and document attachments with independent surface toggles and configurable type, count, and size policy.
* Upgraded WordPress AI mode to structured history, provider-returned reasoning, and allowlisted read-only WordPress Abilities with visible tool activity and a bounded execution loop.
* Added a Welcome screen editor to the Assistant Page workspace, including the shared icon picker plus Page-specific layout, dismissal, and starter-prompt presentation overrides.
* Added suggested Privacy Policy text and explicit external-service disclosures.
* Added privacy-first browser/session history, Runtype session resumption, optional WordPress AI account history with an Assistant Page sidebar, retention cleanup, and WordPress personal-data export/erasure support.

Earlier release notes are available in `changelog.txt`, included with the plugin.
