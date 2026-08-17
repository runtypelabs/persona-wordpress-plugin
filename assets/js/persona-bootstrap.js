/**
 * Persona Assistant bootstrap.
 *
 * Composes `window.siteAgentConfig` from the server-localized `PersonaAssistantData`
 * before the Persona installer runs (the installer depends on this script). The
 * installer then reads the global and paints the widget.
 *
 * Shape contract (see @runtypelabs/persona src/install.ts): the installer reads
 * `target`, `clientToken`, `apiUrl`, and `agentId` at the TOP level of
 * `siteAgentConfig`, and passes ONLY the nested `config` object through as the
 * widget config (launcher, welcome, suggestions, copy, theme, darkTheme,
 * colorScheme, features, ...). Widget options placed at the top level are silently dropped,
 * and `config.target` means a ROUTING target inside the widget config, so the
 * DOM selector must stay top level only.
 *
 * The nested widget config is composed server-side (persona_assistant_widget_config)
 * and localized whole under `PersonaAssistantData.config`; this script passes it
 * through untouched apart from optional site-font matching and the per-instance
 * data-launcher / data-agent overrides.
 *
 * Two modes:
 *   - runtype:      embed the browser-safe client token; the widget talks to the Runtype API.
 *   - wordpress_ai: point the widget's custom backend (`apiUrl`) at our REST route,
 *                   which streams persona-wire SSE the widget parses natively.
 */
(function () {
	'use strict';

	var data = window.PersonaAssistantData || {};
	if (!data.mode || data.mode === 'disabled') {
		return;
	}

	// Per-instance overrides set by the shortcode/block on the root element.
	var root = document.getElementById('persona-assistant-root');
	var dataset = root && root.dataset ? root.dataset : {};

	// The server-composed nested widget config, used as-is.
	var config = data.config || {};

	// Full-screen presets can include function-valued Persona plugins (for
	// example the pill composer), which PHP cannot serialize into localized
	// JSON. The layout decorator runs before the installer consumes config.
	if (data.context === 'fullscreen' && window.PersonaAssistantLayouts) {
		config = window.PersonaAssistantLayouts.decorateConfig(config, data.appearance || {});
	}

	// Apply the site's selected retention policy before the installer consumes
	// config. The adapter stores text-only state and owns Runtype session resume
	// or opt-in WordPress account history without persisting attachments/tools.
	// On the full-screen assistant it also enables Persona's conversation
	// history rail (Runtype's built-in provider, or the plugin's REST-backed
	// provider in WordPress AI account mode).
	if (window.PersonaAssistantHistory) {
		config = window.PersonaAssistantHistory.decorateConfig(config, data.history || {}, data.mode, data.context);
	}

	// Match the site's body font: deep-set the font onto config.theme without
	// clobbering the primary/radius theme keys. Gated on the server flag
	// (persona_assistant_match_site_font); never runs in the admin preview, whose
	// fonts are wp-admin's, not the site's. Set in BOTH layers: palette drives
	// the light theme, while semantic.typography.fontFamily (a raw CSS string
	// is valid there) survives the widget's dark-mode palette rebuild, which
	// discards user palette.typography (see createDarkTheme in utils/theme.ts).
	if (data.matchFont) {
		try {
			var fontFamily = window.getComputedStyle(document.body).fontFamily;
			if (fontFamily) {
				config.theme = config.theme || {};
				config.theme.palette = config.theme.palette || {};
				config.theme.palette.typography = config.theme.palette.typography || {};
				config.theme.palette.typography.fontFamily = config.theme.palette.typography.fontFamily || {};
				config.theme.palette.typography.fontFamily.sans = fontFamily;
				config.theme.semantic = config.theme.semantic || {};
				config.theme.semantic.typography = config.theme.semantic.typography || {};
				config.theme.semantic.typography.fontFamily = fontFamily;
			}
		} catch (e) {
			// Font matching is best-effort; never block the widget.
		}
	}

	// data-launcher="true|false" overrides the configured default.
	if (dataset.launcher === 'true' || dataset.launcher === 'false') {
		config.launcher = config.launcher || {};
		config.launcher.enabled = dataset.launcher === 'true';
	}

	// Full-screen pages mount the widget bundle directly instead of using the
	// installer. The installer always hosts the widget inside its fixed-width
	// floating panel, which resolves `features.history.presentation: "rail"`
	// down to the panel presentation; a direct inline mount that fills the wide
	// shell is the only way the rail renders. The widget bundle is enqueued as a
	// bootstrap dependency on these pages, so AgentWidget is defined here.
	if (data.context === 'fullscreen' && window.AgentWidget && typeof window.AgentWidget.initAgentWidget === 'function') {
		var mount = document.querySelector(data.target || '#persona-assistant-root');
		var widgetConfig = Object.assign({}, config);
		// The inline panel's size rides on launcher.width/height even with the
		// launcher disabled; 100% fills the shell so the rail's 720px container
		// minimum can be met.
		widgetConfig.launcher = Object.assign({}, config.launcher, {
			enabled: false,
			fullHeight: true,
			width: '100%',
			height: '100%'
		});
		if (data.mode === 'runtype') {
			widgetConfig.clientToken = data.clientToken;
			if (data.apiUrl) {
				widgetConfig.apiUrl = data.apiUrl;
			}
			var fsAgentId = dataset.agent || data.agentId;
			if (fsAgentId) {
				widgetConfig.agentId = fsAgentId;
			}
		} else if (data.mode === 'wordpress_ai') {
			widgetConfig.apiUrl = data.restUrl;
		}
		// Deferred one task on purpose: scripts that load AFTER this one (the
		// admin preview-frame bridge, WebMCP registration) attach their
		// persona:chat-ready listeners at evaluation time. A synchronous mount
		// would dispatch the event before those listeners exist — the installer
		// path never had this problem because it initializes asynchronously
		// after every footer script has run.
		window.setTimeout(function () {
			try {
				if (!mount) {
					throw new Error('Persona Assistant mount point not found: ' + (data.target || '#persona-assistant-root'));
				}
				var handle = window.AgentWidget.initAgentWidget({
					target: mount,
					useShadowDom: false,
					config: widgetConfig
				});
				// Mirror the installer's lifecycle contract so persona-history,
				// persona-webmcp, and the admin preview frame keep working.
				window.dispatchEvent(new CustomEvent('persona:chat-ready', { detail: handle }));
			} catch (error) {
				window.dispatchEvent(new CustomEvent('persona:error', { detail: { phase: 'init', error: error } }));
				if (window.console && window.console.error) {
					window.console.error('Persona Assistant failed to mount:', error);
				}
			}
		}, 0);
		return;
	}

	var install = {
		target: data.target || '#persona-assistant-root',
		config: config
	};

	// Keep the widget bundle + polyfill chunks on the installer's own pinned
	// version; without this the installer loads them from `latest`, which
	// could drift across a future Persona major release.
	if (data.version && !data.localAssets) {
		install.version = data.version;
	}

	if (data.mode === 'runtype') {
		install.clientToken = data.clientToken;

		// Point the widget at the configured Runtype API; without this the
		// installer falls back to production even when the plugin is pointed
		// at a staging or self-hosted API base. Client-token mode appends
		// /v1/client/* to this base itself.
		if (data.apiUrl) {
			install.apiUrl = data.apiUrl;
		}

		var agentId = dataset.agent || data.agentId;
		if (agentId) {
			install.agentId = agentId;
		}
	} else if (data.mode === 'wordpress_ai') {
		// Point the widget's custom backend at our REST route. With no
		// clientToken set, the installer initializes in backend-agnostic mode:
		// it POSTs { messages } here and parses the persona-wire SSE we stream
		// back natively, with no custom parser needed. The endpoint applies the
		// audience and rate-limit policy selected in Persona Assistant settings.
		install.apiUrl = data.restUrl;
	}

	window.siteAgentConfig = install;
})();
