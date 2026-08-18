# Architecture

## File layout

```
persona-assistant.php                  # header, constants (local Persona + API base), bootstrap
uninstall.php                     # delete options
includes/
  class-persona-assistant-plugin.php   # singleton; wires admin / front-end / REST / block
  class-persona-assistant-settings.php # Settings API page, credential UI, agent picker, status panel, mint reconcile
  class-persona-assistant-credential.php # source -> credential resolution + OAuth seam
  class-persona-assistant-runtype.php  # Runtype API client: mint token, list agents, revoke
  class-persona-assistant-frontend.php # enqueue + footer/shortcode/block injection + JS config
  class-persona-assistant-fullscreen.php # native Page creation + full-screen template selection
  class-persona-assistant-rest.php     # REST routes: WP-AI chat (persona-wire SSE) + public oauth-challenge
  class-persona-assistant-webmcp.php   # WebMCP page tools: manifest builder + /webmcp/execute route
  class-persona-assistant-ai.php       # built-in AI detection + invocation (isolation layer)
  helpers.php                     # options, defaults, origin, mode resolution
assets/js/persona-bootstrap.js    # composes window.siteAgentConfig from localized data
assets/js/persona-layouts.js      # optional Persona render hooks for page layouts
assets/js/persona-webmcp.js       # registers page tools on document.modelContext (WebMCP)
assets/js/admin.js                # settings UI behavior (no build step)
assets/css/admin.css              # status-badge styling
assets/css/fullscreen.css         # viewport-sized assistant Page host
assets/vendor/persona/            # locally bundled Persona library + MIT license
blocks/persona-assistant/{block.json,index.js}  # build-free dynamic block
templates/fullscreen-assistant.php # standalone Page document preserving WP hooks
languages/persona-assistant.pot
playground/                               # WordPress Playground sample site
  blueprint.json                          # shareable: installs this repo from GitHub
  local.json                              # npm run playground (mounts the working tree)
  setup-sample-site.php                   # seeds product tour + plugin settings
wordpress-org-assets/blueprints/          # WordPress.org Live Preview (SVN /assets/blueprints/)
```
