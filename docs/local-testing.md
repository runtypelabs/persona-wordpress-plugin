# Local testing

1. Run a local WordPress (`wp-env` or Local) and symlink/copy this folder into `wp-content/plugins`. From this repo, `npm run env:start` starts `@wordpress/env`.
2. **API-key path:** define `PERSONA_ASSISTANT_API_KEY` in `wp-config.php` (or connect via **Login with Runtype**) → the agent list auto-loads → pick one → **Save**. The status panel should show a minted token scoped to your origin; the front-end launcher chats via `api.runtype.com`. Change the site URL and save to confirm a re-mint.
3. **Paste-token path:** open "Connect manually with a client token", paste a `ct_...`, save, and confirm it embeds.
4. **WP-AI path:** clear the Runtype credentials, ensure a built-in AI is present, set power source to `auto`, and confirm requests hit `/wp-json/persona-assistant/v1/chat` (`curl -N` shows persona-wire frames: `event: execution_start` → `text_delta` → `execution_complete`, the model's reply in the `text_delta` `delta`).
5. **Placement:** verify each explicit publishing mode: site-wide floating launcher, block/shortcode only, and no launcher/embeds. Confirm editors see a useful warning if a manual placement conflicts with the site-wide launcher or duplicates another instance.
6. **Full-screen Page:** create the assistant Page, verify its native permalink renders a viewport-height Persona surface, then test it alongside each placement mode. Select no Page and confirm the WordPress Page remains unchanged.
7. **Demo mode:** with no credentials and no built-in AI selected, log in as an administrator and confirm the launcher renders with the "Demo mode — responses are simulated" badge and the settings status panel says demo is active. The widget runs in ordinary client-token mode against the public demo plane (`https://mock.runtype.com/demo`, scripted responses; see runtype-core `apps/mock-api/src/demo-client`). To test against a pre-release demo plane, point the base at it — with wp-env, via the gitignored `.wp-env.override.json`:

   ```json
   { "config": { "PERSONA_ASSISTANT_DEMO_API_BASE": "https://<pre-release-demo-host>/demo" } }
   ```

   Walk the chips: tour → streaming/markdown → launch tree → tool call (tool row renders; demo forces AI-activity display on) → "What page am I looking at?" (real `get_current_page` approval bubble; the reply must contain the actual page title). Confirm a logged-out window shows no widget at all, and that connecting either real power source makes the badge and demo notice disappear.

Run `php -l` on the PHP files and the WordPress **Plugin Check (PCP)** tool before shipping; the only expected finding is the CDN enqueue (see [Developers](developers.md#asset-delivery--wordpressorg)).
