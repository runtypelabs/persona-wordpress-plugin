# Local testing

## Sample site (WordPress Playground)

The sample site is a [Playground blueprint](https://wordpress.github.io/wordpress-playground/blueprints/) that boots a temporary WordPress in the browser, installs this plugin, and creates a visual product-tour homepage plus a full-screen Assistant Page at `/assistant/`. The homepage puts the Connection workspace first, defines the available surfaces and capabilities, reuses the four WordPress.org screenshots, and links directly into the relevant settings workspaces.

Before any AI is connected, the plugin's built-in **demo mode** takes over for administrators (Playground logs you in as admin): the launcher renders with a "Demo mode — responses are simulated" badge and chats against the public scripted demo plane, so the widget UX is walkable immediately — see step 7 under [wp-env](#wp-env) below. Logged-out visitors see nothing until a real AI is connected. To go live, follow the **Connect an AI** waypoint on the homepage: paste a Runtype `ct_...` client token scoped to the Playground origin or configure WordPress built-in AI. Login with Runtype usually cannot verify Playground origins, so the paste-token path is the one that works here.

### Run it from this repo

```bash
npm run playground
```

That mounts the current working tree into Playground and applies `playground/local.json`. Open the URL the CLI prints (typically `http://127.0.0.1:9400/`).

### Share a browser URL

After this branch is on GitHub, open:

```text
https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/runtypelabs/persona-wordpress-plugin/main/playground/blueprint.json
```

`playground/blueprint.json` installs the plugin from GitHub (`git:directory` on `HEAD`) and then runs `playground/setup-sample-site.php`. Change the `ref` in that file to preview a different branch. You can also paste the JSON into the [Blueprint builder](https://playground.wordpress.net/builder/builder.html) without pushing.

### WordPress.org Live Preview

Commit `wordpress-org-assets/blueprints/blueprint.json` to the plugin’s SVN `assets/blueprints/blueprint.json`. A committer then sets Live Preview to public on the plugin’s Advanced screen. WordPress.org injects the reviewed plugin zip; the blueprint only seeds sample content and settings. The inlined PHP in that file is a copy of `playground/setup-sample-site.php` — if you change the seeder, update both.

## wp-env

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
