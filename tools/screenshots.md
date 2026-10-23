# Directory screenshot capture

Use a **disposable local WordPress instance** with Persona activated. The fixture changes its title, front page, assistant page and Persona settings, and installs a small local MU plugin. It does not connect an AI account. Persona's administrator-only demo and its disclosure stay visible.

From the disposable wp-env configuration directory, seed the fixture (adjust the mounted plugin directory if needed):

```sh
/path/to/wordpress-persona/node_modules/.bin/wp-env run cli wp eval-file wp-content/plugins/wordpress-persona/tools/screenshot-fixture.php
```

Install Playwright and Chromium outside the plugin's production dependencies. With `playwright` resolvable by Node (or its containing `node_modules` directory in `NODE_PATH`), run:

```sh
PERSONA_SCREENSHOT_URL=http://localhost:8894 node tools/capture-screenshots.cjs
```

The default login is wp-env's `admin` / `password`. Override it with `PERSONA_SCREENSHOT_USER` and `PERSONA_SCREENSHOT_PASSWORD` if needed. The script only captures localhost or 127.0.0.1, opens a fresh browser context, and writes four native 1440×1100 PNGs to `wordpress-org-assets/`:

1. Connection, with the Runtype option selected in the form and the actual local connection requirements shown.
2. Brand & Copy with the live preview.
3. The bakery site with the floating assistant open.
4. The full-screen Assistant Page after a real “Hi” demo roundtrip, with the response and conversation history rail.

No browser chrome or replacement UI is composited into the images. Review all four images after capture. Destroy the disposable WordPress instance when finished; do not run this fixture on an existing site.
