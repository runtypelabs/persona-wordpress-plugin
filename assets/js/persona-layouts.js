/** Native Persona full-screen layout options shared by the page and preview. */
(function () {
	'use strict';

	var WIDTHS = { narrow: '42rem', standard: '48rem', wide: '72rem' };

	function decorateConfig(config, appearance) {
		config = config || {};
		appearance = appearance || {};
		config.launcher = Object.assign({}, config.launcher, { enabled: false, fullHeight: true });

		// Use Persona's native composer so attachments, voice, stop, drafts and
		// streaming share the runtime's behavior. The saved pill choice requests
		// its compact single row; Default inherits the selected runtime defaults.
		// Respect a filter's explicit layout and any custom composer plugins.
		if (appearance.composerStyle === 'pill' && !(config.composer && config.composer.layout)) {
			config.composer = Object.assign({}, config.composer, { layout: 'single-row' });
		}

		return config;
	}

	// Updates deep-merge authored config. Explicitly delete overrides absent
	// from the next complete server/form snapshot (preset, corner and composer
	// switches must return to native defaults). Keep behavior/provider hooks.
	function replacementPatch(next, previous, preserveOtherKeys) {
		function patch(value, old) {
			var result = Object.assign({}, value);
			Object.keys(old || {}).forEach(function (key) {
				if (!Object.prototype.hasOwnProperty.call(result, key)) {
					result[key] = preserveOtherKeys && old[key] && typeof old[key] === 'object' && !Array.isArray(old[key])
						? patch({}, old[key]) : undefined;
				} else if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
					result[key] = patch(result[key], old[key]);
				}
			});
			return result;
		}
		var result = Object.assign({}, next);
		['theme', 'darkTheme', 'composer'].forEach(function (key) {
			if (previous && previous[key]) {
				result[key] = next[key] ? patch(next[key], previous[key]) : undefined;
			}
		});
		var oldRail = previous && previous.features && previous.features.history && previous.features.history.rail;
		var newHistory = next.features && next.features.history;
		var newRail = newHistory && newHistory.rail;
		if (oldRail && Object.prototype.hasOwnProperty.call(oldRail, 'brand') &&
			(!newRail || !Object.prototype.hasOwnProperty.call(newRail, 'brand'))) {
			result.features = Object.assign({}, next.features);
			result.features.history = Object.assign({}, newHistory);
			result.features.history.rail = Object.assign({}, newRail, { brand: undefined });
		}

		return result;
	}

	window.PersonaAssistantLayouts = { decorateConfig: decorateConfig, replacementPatch: replacementPatch, widths: WIDTHS };
})();
