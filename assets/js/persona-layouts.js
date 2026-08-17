/**
 * Persona Assistant full-screen layout decorators.
 *
 * WordPress localizes widget config as JSON, so function-valued Persona hooks
 * cannot be produced by PHP. This file adds those hooks before the installer
 * reads window.siteAgentConfig. It intentionally uses only DOM APIs and the
 * public renderComposer context, keeping the plugin build-free.
 */
(function () {
	'use strict';

	var WIDTHS = {
		narrow: '42rem',
		standard: '48rem',
		wide: '72rem'
	};

	function isObject(value) {
		return value && typeof value === 'object' && !Array.isArray(value);
	}

	function merge(target, source) {
		var out = isObject(target) ? target : {};
		if (!isObject(source)) {
			return out;
		}
		for (var key in source) {
			if (!source.hasOwnProperty(key)) {
				continue;
			}
			out[key] = isObject(source[key])
				? merge(isObject(out[key]) ? out[key] : {}, source[key])
				: source[key];
		}
		return out;
	}

	function prefersDark(config) {
		if (config.colorScheme === 'dark') {
			return true;
		}
		if (config.colorScheme === 'light') {
			return false;
		}
		return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
	}

	function iconButton(label, svg, dark) {
		var button = document.createElement('button');
		button.type = 'button';
		button.setAttribute('aria-label', label);
		button.title = label;
		button.innerHTML = svg;
		button.style.cssText = [
			'display:inline-flex',
			'align-items:center',
			'justify-content:center',
			'width:32px',
			'height:32px',
			'padding:0',
			'border:0',
			'border-radius:9999px',
			'background:transparent',
			'color:' + (dark ? '#b4b4b4' : '#5d5d5d'),
			'cursor:pointer'
		].join(';');
		return button;
	}

	function pillComposerPlugin(appearance) {
		return {
			id: 'persona-assistant-pill-composer',
			priority: 50,
			renderComposer: function (context) {
				var config = context.config || {};
				var dark = prefersDark(config);
				var footer = document.createElement('div');
				footer.className = 'persona-widget-footer';
				footer.style.cssText = [
					'box-sizing:border-box',
					'width:100%',
					'padding:12px 20px 10px',
					'background:' + (dark ? '#212121' : '#ffffff')
				].join(';');

				// The built-in welcome surface is intentionally retained so copy
				// and rich starters keep their native behavior. Center it in
				// the otherwise empty transcript and neutralize its brand-colored
				// heading to match the app-like preset. Keeping the style inside
				// the returned subtree makes it work in both light DOM and the
				// admin preview iframe. Persona 4.16 exposes the stable data hook.
				var style = document.createElement('style');
				style.textContent = [
					'.persona-widget-body > [data-persona-intro-card] {',
					'width:min(100%, ' + (WIDTHS[appearance.contentWidth] || WIDTHS.standard) + ');',
					'margin:auto;',
					'box-sizing:border-box;',
					'text-align:center;',
					'}',
					'.persona-widget-body > [data-persona-intro-card] h2 {',
					'color:' + (dark ? '#ececec' : '#0d0d0d') + ' !important;',
					'font-size:1.75rem;',
					'line-height:1.2;',
					'}'
				].join('');
				footer.appendChild(style);

				var inner = document.createElement('div');
				inner.style.cssText = [
					'box-sizing:border-box',
					'width:100%',
					'max-width:' + (WIDTHS[appearance.contentWidth] || WIDTHS.standard),
					'margin:0 auto'
				].join(';');

				var form = document.createElement('form');
				form.setAttribute('data-persona-composer-form', '');
				form.style.cssText = [
					'box-sizing:border-box',
					'display:flex',
					'flex-direction:column',
					'width:100%',
					'padding:10px 12px 8px',
					'border:1px solid ' + (dark ? '#424242' : '#dedede'),
					'border-radius:26px',
					'background:' + (dark ? '#2f2f2f' : '#f4f4f4'),
					'box-shadow:' + (dark ? '0 0 0 1px rgba(255,255,255,.02)' : '0 2px 10px rgba(0,0,0,.06)')
				].join(';');

				var input = document.createElement('textarea');
				input.setAttribute('data-persona-composer-input', '');
				input.rows = 1;
				input.placeholder = (config.copy && config.copy.inputPlaceholder) || 'Message the assistant';
				input.disabled = !!context.streaming;
				input.style.cssText = [
					'box-sizing:border-box',
					'display:block',
					'width:100%',
					'min-height:28px',
					'max-height:180px',
					'padding:4px 6px 6px',
					'resize:none',
					'overflow-y:auto',
					'border:0',
					'outline:0',
					'background:transparent',
					'color:' + (dark ? '#ececec' : '#0d0d0d'),
					'font:inherit',
					'font-size:16px',
					'line-height:1.45'
				].join(';');

				var actions = document.createElement('div');
				actions.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:32px;';
				var left = document.createElement('div');
				left.style.cssText = 'display:flex;align-items:center;gap:4px;';
				var right = document.createElement('div');
				right.style.cssText = 'display:flex;align-items:center;gap:4px;';

				if (appearance.attachments && typeof context.openAttachmentPicker === 'function') {
					var attach = iconButton(
						'Attach files',
						'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
						dark
					);
					attach.setAttribute('data-persona-composer-disable-when-streaming', '');
					attach.disabled = !!context.streaming;
					attach.addEventListener('click', function () {
						context.openAttachmentPicker();
					});
					left.appendChild(attach);
				}

				if (appearance.voice && typeof context.onVoiceToggle === 'function') {
					var voice = iconButton(
						'Voice input',
						'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/></svg>',
						dark
					);
					voice.setAttribute('data-persona-composer-mic', '');
					voice.addEventListener('click', function () {
						context.onVoiceToggle();
					});
					right.appendChild(voice);
				}

				var send = document.createElement('button');
				send.type = 'submit';
				send.setAttribute('aria-label', 'Send message');
				send.title = 'Send message';
				send.disabled = !!context.streaming;
				send.setAttribute('data-persona-composer-disable-when-streaming', '');
				send.style.cssText = [
					'display:inline-flex',
					'align-items:center',
					'justify-content:center',
					'width:32px',
					'height:32px',
					'padding:0',
					'border:0',
					'border-radius:9999px',
					'background:' + (dark ? '#ececec' : '#111111'),
					'color:' + (dark ? '#111111' : '#ffffff'),
					'cursor:pointer'
				].join(';');
				send.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7M12 19V5"/></svg>';
				right.appendChild(send);

				actions.appendChild(left);
				actions.appendChild(right);

				function resizeInput() {
					input.style.height = 'auto';
					input.style.height = Math.min(input.scrollHeight, 180) + 'px';
				}

				function submit() {
					var value = input.value.trim();
					if (!value || context.streaming) {
						return;
					}
					context.onSubmit(value);
					input.value = '';
					resizeInput();
				}

				input.addEventListener('input', resizeInput);
				input.addEventListener('keydown', function (event) {
					if (event.key === 'Enter' && !event.shiftKey) {
						event.preventDefault();
						submit();
					}
				});
				form.addEventListener('submit', function (event) {
					event.preventDefault();
					submit();
				});

				form.appendChild(input);
				form.appendChild(actions);
				inner.appendChild(form);

				if (appearance.disclaimer) {
					var disclaimer = document.createElement('p');
					disclaimer.style.cssText = [
						'margin:7px 12px 0',
						'text-align:center',
						'color:' + (dark ? '#b4b4b4' : '#6b6b6b'),
						'font-size:11px',
						'line-height:1.35'
					].join(';');
					disclaimer.textContent = appearance.disclaimer;
					inner.appendChild(disclaimer);
				}

				footer.appendChild(inner);
				return footer;
			}
		};
	}

	function decorateConfig(config, appearance) {
		config = config || {};
		appearance = appearance || {};
		config.launcher = merge(config.launcher, { enabled: false, fullHeight: true });

		if (appearance.composerStyle === 'pill') {
			config.plugins = Array.isArray(config.plugins) ? config.plugins.slice() : [];
			config.plugins.push(pillComposerPlugin(appearance));
		}

		return config;
	}

	window.PersonaAssistantLayouts = {
		decorateConfig: decorateConfig,
		widths: WIDTHS
	};
})();
