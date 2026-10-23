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
	var previousConfig = (window.PersonaAssistantData || {}).config || {};

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
	function apply(payload) {
		pending = payload;
		if (!handle || !payload || !payload.config) {
			return;
		}

		var config = payload.config;
		if ((window.PersonaAssistantData || {}).matchFont !== false) {
			config = matchSiteFont(config);
		}
		if (window.PersonaAssistantLayouts) {
			config = window.PersonaAssistantLayouts.decorateConfig(config, payload.appearance || {});
		}

		var patch = window.PersonaAssistantLayouts
			? window.PersonaAssistantLayouts.replacementPatch(config, previousConfig)
			: config;
		try {
			handle.update(patch);
			previousConfig = config;
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
