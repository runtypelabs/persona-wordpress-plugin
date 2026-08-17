/**
 * Full-screen admin preview bridge.
 *
 * This script runs inside the same front-end document as the published
 * assistant Page. The parent settings screen sends unsaved Assistant values;
 * WordPress sanitizes them and returns the same server-composed config used by
 * the public Page, then the existing Persona handle updates in place.
 */
(function () {
	'use strict';

	var data = window.PersonaAssistantPreviewFrame || {};
	var parentOrigin = window.location.origin;
	var handle = null;
	var pending = null;
	var timer = null;
	var requestId = 0;

	try {
		if (document.referrer) {
			parentOrigin = new URL(document.referrer).origin;
		}
	} catch (e) {
		// Same-origin is the safe fallback for the WordPress admin iframe.
	}

	function post(type, detail) {
		if (window.parent === window) {
			return;
		}
		var message = detail || {};
		message.type = type;
		window.parent.postMessage(message, parentOrigin);
	}

	function matchSiteFont(config) {
		try {
			var fontFamily = window.getComputedStyle(document.body).fontFamily;
			if (!fontFamily) {
				return config;
			}
			config.theme = config.theme || {};
			config.theme.palette = config.theme.palette || {};
			config.theme.palette.typography = config.theme.palette.typography || {};
			config.theme.palette.typography.fontFamily = config.theme.palette.typography.fontFamily || {};
			config.theme.palette.typography.fontFamily.sans = fontFamily;
			config.theme.semantic = config.theme.semantic || {};
			config.theme.semantic.typography = config.theme.semantic.typography || {};
			config.theme.semantic.typography.fontFamily = fontFamily;
		} catch (e) {
			// Font matching is best-effort and must never block the preview.
		}
		return config;
	}

	/**
	 * Persona's handle.update() deep-merges theme patches, so a theme key set
	 * by an earlier preview round-trip (the ChatGPT preset's neutral
	 * `semantic.colors`) would survive a later config that no longer defines
	 * it, rendering a hybrid of both presets. The server config is the FULL
	 * theme opinion, and an explicitly-undefined key is a delete in Persona's
	 * patch merge — so reset every contested subtree the config leaves absent.
	 */
	function resetAbsentThemeKeys(config) {
		['theme', 'darkTheme'].forEach(function (key) {
			var theme = config[key] = config[key] || {};
			var semantic = theme.semantic = theme.semantic || {};
			if (!('colors' in semantic)) {
				semantic.colors = undefined;
			}
			if (!('palette' in theme)) {
				theme.palette = undefined;
			}
			if (!('components' in theme)) {
				theme.components = undefined;
			}
		});
		return config;
	}

	function apply(payload) {
		pending = payload;
		if (!handle || !payload || !payload.config) {
			return;
		}

		var config = resetAbsentThemeKeys(matchSiteFont(payload.config));
		if (window.PersonaAssistantLayouts) {
			config = window.PersonaAssistantLayouts.decorateConfig(config, payload.appearance || {});
		}

		try {
			handle.update(config);
			post('persona-assistant-preview-updated');
		} catch (e) {
			post('persona-assistant-preview-error', { message: e && e.message ? e.message : 'Preview update failed.' });
		}
	}

	function requestConfig(settings) {
		clearTimeout(timer);
		var thisRequest = ++requestId;
		timer = window.setTimeout(function () {
			var body = new URLSearchParams();
			body.set('action', 'persona_assistant_preview_config');
			body.set('nonce', data.nonce || '');
			body.set('settings', JSON.stringify(settings || {}));

			window.fetch(data.ajaxUrl, {
				method: 'POST',
				credentials: 'same-origin',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: body.toString()
			}).then(function (response) {
				return response.json();
			}).then(function (result) {
				if (thisRequest !== requestId) {
					return;
				}
				if (!result || !result.success || !result.data) {
					throw new Error(result && result.data && result.data.message ? result.data.message : 'Preview configuration failed.');
				}
				apply(result.data);
			}).catch(function (error) {
				if (thisRequest === requestId) {
					post('persona-assistant-preview-error', { message: error && error.message ? error.message : 'Preview configuration failed.' });
				}
			});
		}, 100);
	}

	window.addEventListener('message', function (event) {
		if (event.origin !== parentOrigin || event.source !== window.parent) {
			return;
		}
		if (!event.data || event.data.type !== 'persona-assistant-preview-settings') {
			return;
		}
		requestConfig(event.data.settings || {});
	});

	window.addEventListener('persona:chat-ready', function (event) {
		handle = event.detail;
		post('persona-assistant-preview-ready');
		if (pending) {
			apply(pending);
		}
	});

	post('persona-assistant-preview-loaded');
})();
