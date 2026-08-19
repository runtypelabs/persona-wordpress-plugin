/**
 * Persona Assistant: settings admin behavior (no build step, vanilla JS).
 *
 *  - Shows the connection section that matches the chosen provider.
 *  - Auto-loads the agent list (and a "Refresh" button re-fires it).
 *  - Selecting an agent copies its id into the manual id input.
 */
(function () {
	'use strict';

	var copyDiagnostics = document.getElementById('persona-assistant-copy-diagnostics');
	if (copyDiagnostics) {
		copyDiagnostics.addEventListener('click', function () {
			var report = document.getElementById('persona-assistant-diagnostics-report');
			var status = document.getElementById('persona-assistant-copy-diagnostics-status');
			if (!report) return;
			var done = function () { if (status) status.textContent = 'Copied.'; };
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(report.value).then(done);
			} else {
				report.select();
				document.execCommand('copy');
				done();
			}
		});
	}

	var cfg = window.PersonaAssistantAdmin || {};
	var strings = cfg.strings || {};

	// The preview always mounts the REAL widget. Without a connected AI a
	// dispatch would fail, so swap the transport for a canned persona-wire
	// stream: typing in the preview yields a friendly stub reply instead of an
	// error bubble (same frame vocabulary the Runtype API emits).
	function previewStubFetch() {
		var executionId = 'exec-preview';
		var text = (cfg.preview && cfg.preview.stubReply) || 'Connect an AI to test live responses.';
		var frames = [
			{ type: 'execution_start', kind: 'agent', executionId: executionId, agentId: 'preview', startedAt: Date.now() },
			{ type: 'turn_start', executionId: executionId, id: 'turn-1', iteration: 1 },
			{ type: 'text_start', executionId: executionId, id: 'text-1' },
			{ type: 'text_delta', executionId: executionId, id: 'text-1', delta: text, iteration: 1 },
			{ type: 'text_complete', executionId: executionId, id: 'text-1' },
			{ type: 'turn_complete', executionId: executionId, id: 'turn-1', iteration: 1 },
			{ type: 'execution_complete', kind: 'agent', executionId: executionId, success: true, completedAt: Date.now() }
		];
		var body = '';
		for (var f = 0; f < frames.length; f++) {
			body += 'data: ' + JSON.stringify(frames[f]) + '\n\n';
		}
		return Promise.resolve(new Response(body, {
			status: 200,
			headers: { 'Content-Type': 'text/event-stream' }
		}));
	}

	// Brand and launcher previews mount Persona directly in wp-admin. The
	// assistant preview uses the real front-end document in an iframe instead.
	if (cfg.preview && cfg.preview.ready && cfg.preview.config) {
		if (!cfg.preview.canChat && cfg.preview.config.config) {
			cfg.preview.config.config.customFetch = previewStubFetch;
		}
		window.siteAgentConfig = cfg.preview.config;
	}

	// Live preview: the installer dispatches `persona:chat-ready` with the
	// widget controller handle; `handle.update()` re-applies theme and copy in
	// place, so appearance edits preview without saving.
	var previewHandle = null;
	var assistantPreviewFrame = document.getElementById('persona-assistant-preview-frame');
	var assistantPreviewReady = false;
	window.addEventListener('persona:chat-ready', function (event) {
		previewHandle = event.detail;
		syncLivePreview();
	});
	window.addEventListener('message', function (event) {
		if (!assistantPreviewFrame || event.origin !== window.location.origin || event.source !== assistantPreviewFrame.contentWindow) {
			return;
		}
		if (!event.data || (event.data.type !== 'persona-assistant-preview-loaded' && event.data.type !== 'persona-assistant-preview-ready')) {
			return;
		}
		assistantPreviewReady = true;
		syncLivePreview();
	});
	if (assistantPreviewFrame) {
		assistantPreviewFrame.addEventListener('load', function () {
			assistantPreviewReady = true;
			syncLivePreview();
		});
	}

	function show(el, on) {
		if (el) {
			el.style.display = on ? '' : 'none';
		}
	}

	function selectedValue(name, fallback) {
		var checked = document.querySelector('input[name$="[' + name + ']"]:checked');
		return checked ? checked.value : fallback;
	}

	function syncProviderVisibility() {
		// With no radio checked (e.g. a legacy 'auto' value that has no card),
		// show both sections so nothing is hidden until the user picks one.
		var checked = document.querySelector('input[name$="[ai_backend]"]:checked');
		var provider = checked ? checked.value : '';
		var sections = document.querySelectorAll('.persona-assistant-provider-section');
		for (var i = 0; i < sections.length; i++) {
			var matches = sections[i].getAttribute('data-provider') === provider;
			show(sections[i], !checked || matches);
		}
	}

	function syncPlacementVisibility() {
		var placement = selectedValue('placement_mode', 'off');
		var conditional = document.querySelectorAll('[data-placement]');
		for (var i = 0; i < conditional.length; i++) {
			show(conditional[i], conditional[i].getAttribute('data-placement') === placement);
		}
	}

	function syncAccessVisibility() {
		// The login requirement is a single checkbox: checked = logged_in,
		// unchecked = public. The cost warning shows only for public access.
		var checkbox = document.getElementById('persona-assistant-wp-ai-login');
		var access = checkbox && checkbox.checked ? 'logged_in' : 'public';
		var warnings = document.querySelectorAll('[data-access]');
		for (var i = 0; i < warnings.length; i++) {
			show(warnings[i], warnings[i].getAttribute('data-access') === access);
		}
	}

	function syncColorMeta() {
		var colorInput = document.getElementById('persona-assistant-theme-color');
		var colorValue = document.getElementById('persona-assistant-color-value');
		var contrastStatus = document.getElementById('persona-assistant-color-contrast');
		if (colorInput && colorValue) {
			colorValue.textContent = colorInput.value;
		}
		if (colorInput && contrastStatus) {
			var hex = colorInput.value.replace('#', '');
			var channels = [0, 2, 4].map(function (offset) {
				var value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
				return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
			});
			var luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
			var ratio = 1.05 / (luminance + 0.05);
			var template = ratio >= 4.5 ? (strings.goodContrast || 'Good contrast with white text (%s:1).') : (strings.lowContrast || 'Low contrast with white text (%s:1). Choose a darker accent.');
			contrastStatus.textContent = template.replace('%s', ratio.toFixed(1));
			contrastStatus.className = 'description' + (ratio < 4.5 ? ' persona-assistant-inline-status--error' : '');
		}
	}

	// Mirrors persona_assistant_mix_hex(): mix a hex color toward another,
	// expanding #rgb shorthand like the PHP side does.
	function mixHex(hex, withHex, amount) {
		function expand(h) {
			h = h.replace('#', '');
			if (h.length === 3) {
				h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
			}
			return h;
		}
		var a6 = expand(hex);
		var b6 = expand(withHex);
		var out = '#';
		for (var i = 0; i < 3; i++) {
			var a = parseInt(a6.slice(i * 2, 2 + i * 2), 16);
			var b = parseInt(b6.slice(i * 2, 2 + i * 2), 16);
			out += ('0' + Math.round(a + (b - a) * amount).toString(16)).slice(-2);
		}
		return out;
	}

	// Mirrors persona_assistant_primary_scale(): the widget replaces overridden
	// color scales wholesale, so a partial primary would wipe shades like
	// primary.50 (header title / bubble / button foregrounds).
	function primaryScale(hex) {
		return {
			50: '#ffffff',
			100: mixHex(hex, '#ffffff', 0.9),
			200: mixHex(hex, '#ffffff', 0.75),
			300: mixHex(hex, '#ffffff', 0.5),
			400: mixHex(hex, '#ffffff', 0.25),
			500: hex,
			600: mixHex(hex, '#000000', 0.12),
			700: mixHex(hex, '#000000', 0.24),
			800: mixHex(hex, '#000000', 0.4),
			900: mixHex(hex, '#000000', 0.55),
			950: mixHex(hex, '#000000', 0.7)
		};
	}

	// Mirrors persona_assistant_widget_theme(): the widget's brand surfaces resolve
	// from palette.colors.primary (500 base, 600/700 darkened, 200 light tint),
	// plus optional radius presets (byte-equivalent to the PHP builder).
	function previewTheme(hex, corner) {
		var theme = {
			palette: {
				colors: {
					primary: primaryScale(hex)
				}
			}
		};
		if (corner === 'soft') {
			theme.palette.radius = { md: '0.25rem', lg: '0.375rem', xl: '0.5rem', '2xl': '0.625rem' };
			theme.components = cornerComponents('0.5rem', '0.375rem', '0.25rem', '0.625rem');
		} else if (corner === 'square') {
			theme.palette.radius = { sm: '0px', md: '2px', lg: '2px', xl: '4px', '2xl': '4px' };
			theme.components = cornerComponents('4px', '2px', '2px', '4px');
		}
		return theme;
	}

	// Mirrors persona_assistant_corner_components(): the widget rebuilds `palette`
	// in dark mode (dropping radius overrides), so corner presets are also
	// expressed as component tokens, which survive the rebuild.
	function cornerComponents(xl, lg, md, xxl) {
		return {
			panel: { borderRadius: xl },
			header: { borderRadius: xl + ' ' + xl + ' 0 0' },
			input: { borderRadius: lg },
			introCard: { borderRadius: xxl },
			message: {
				user: { borderRadius: lg },
				assistant: { borderRadius: lg }
			},
			button: {
				primary: { borderRadius: lg },
				secondary: { borderRadius: lg },
				ghost: { borderRadius: md }
			}
		};
	}

	// Mirrors persona_assistant_widget_dark_theme(): slate grays + inverted semantic
	// tokens + a brand primary lightened so it reads on the dark container.
	function darkPreviewTheme(hex) {
		return {
			palette: {
				colors: {
					primary: {
						50: '#ffffff',
						100: mixHex(hex, '#ffffff', 0.9),
						200: mixHex(hex, '#ffffff', 0.75),
						300: mixHex(hex, '#ffffff', 0.5),
						400: mixHex(hex, '#ffffff', 0.3),
						500: mixHex(hex, '#ffffff', 0.18),
						600: hex,
						700: mixHex(hex, '#000000', 0.12),
						800: mixHex(hex, '#000000', 0.3),
						900: mixHex(hex, '#000000', 0.5),
						950: mixHex(hex, '#000000', 0.65)
					},
					gray: {
						50: '#f1f5f9',
						100: '#1e293b',
						200: '#334155',
						300: '#cbd5e1',
						400: '#94a3b8',
						500: '#94a3b8',
						600: '#475569',
						700: '#334155',
						800: '#1e293b',
						900: '#0f172a',
						950: '#020617'
					}
				}
			},
			semantic: {
				colors: {
					surface: 'palette.colors.gray.900',
					background: 'palette.colors.gray.900',
					container: 'palette.colors.gray.100',
					text: 'palette.colors.gray.50',
					textMuted: 'palette.colors.gray.500',
					textInverse: 'palette.colors.gray.900',
					border: 'palette.colors.gray.200'
				}
			}
		};
	}

	// Mirrors persona_assistant_parse_prompts(): one per line, trimmed, capped.
	function parsePrompts(text, maxItems) {
		return (text || '').split(/\r\n|\r|\n/).map(function (line) {
			return line.trim();
		}).filter(function (line) {
			return line.length > 0;
		}).slice(0, Math.max(1, Math.min(8, parseInt(maxItems, 10) || 4)));
	}

	function welcomeIcon(raw, enabled) {
		if (!enabled) {
			return undefined;
		}
		var icon = (raw || '').trim();
		var builtIn = /^icon:([a-z0-9-]+)$/.exec(icon);
		if (builtIn) {
			return { type: 'lucide', name: builtIn[1] };
		}
		if (icon && /^(https?:\/\/|\/)/.test(icon)) {
			return { type: 'image', url: icon, alt: strings.siteName || '' };
		}
		if (icon) {
			return { type: 'text', text: icon };
		}
		return cfg.siteIconUrl ? { type: 'image', url: cfg.siteIconUrl, alt: strings.siteName || '' } : undefined;
	}

	// Mirrors the icon logic in persona_assistant_widget_config(): 'icon:<name>'
	// selects a built-in lucide icon by registry name, a URL sets iconUrl,
	// other text sets agentIconText, blank falls back to the Site Icon. Every
	// custom/site branch clears the Lucide defaults that outrank it so the icon
	// applies to both the panel header and the collapsed launcher pill.
	function iconLauncherKeys(raw) {
		// handle.update() deep-merges the launcher config, so a branch that
		// omits a key would leave the previous edit's value stuck in the
		// preview (e.g. an emoji surviving after the field is cleared). Every
		// branch therefore sets ALL four keys; the blank/no-site-icon branch
		// restores the widget's own defaults (bot icons, 💬 fallback).
		var icon = (raw || '').trim();
		var builtIn = /^icon:([a-z0-9-]+)$/.exec(icon);
		if (builtIn) {
			return { iconUrl: '', agentIconText: '', headerIconName: builtIn[1], agentIconName: builtIn[1] };
		}
		if (icon && /^(https?:\/\/|\/)/.test(icon)) {
			return { iconUrl: icon, agentIconText: '', headerIconName: '', agentIconName: '' };
		}
		if (icon) {
			return { iconUrl: '', agentIconText: icon, headerIconName: '', agentIconName: '' };
		}
		if (cfg.siteIconUrl) {
			return { iconUrl: cfg.siteIconUrl, agentIconText: '', headerIconName: '', agentIconName: '' };
		}
		return { iconUrl: '', agentIconText: '💬', headerIconName: 'bot', agentIconName: 'bot' };
	}

	function fieldValue(id, fallback) {
		var el = document.getElementById(id);
		return el ? el.value : (fallback || '');
	}

	function checkedValue(id, fallback) {
		var el = document.getElementById(id);
		return el ? !!el.checked : !!fallback;
	}

	function currentAppearance() {
		var defaults = (cfg.preview && cfg.preview.formDefaults) || {};
		var colorInput = document.getElementById('persona-assistant-theme-color');
		var activity = document.getElementById('persona-assistant-show-ai-activity');
		return {
			color: colorInput ? colorInput.value : (defaults.color || '#4f46e5'),
			mode: selectedValue('theme_mode', defaults.mode || 'light'),
			corner: selectedValue('corner_style', defaults.corner || 'rounded'),
			position: selectedValue('launcher_position', defaults.position || 'bottom-right'),
			icon: fieldValue('persona-assistant-chat-icon', defaults.icon),
			teaserText: fieldValue('persona-assistant-launcher-teaser', defaults.teaserText),
			teaserDelay: fieldValue('persona-assistant-launcher-teaser-delay', defaults.teaserDelay || 3),
			teaserFrequency: selectedValue('launcher_teaser_frequency', defaults.teaserFrequency || 'once'),
			teaserDismissible: checkedValue('persona-assistant-launcher-teaser-dismissible', defaults.teaserDismissible),
			headerTitle: fieldValue('persona-assistant-header-title', defaults.headerTitle),
			headerSubtitle: fieldValue('persona-assistant-header-subtitle', defaults.headerSubtitle),
			title: fieldValue('persona-assistant-welcome-title', defaults.title),
			welcomeSubtitle: fieldValue('persona-assistant-welcome-subtitle', defaults.welcomeSubtitle),
			welcomeVariant: selectedValue('welcome_variant', defaults.welcomeVariant || 'card'),
			welcomeDismiss: selectedValue('welcome_dismiss', defaults.welcomeDismiss || 'never'),
			welcomeMessage: fieldValue('persona-assistant-welcome-message', defaults.welcomeMessage),
			welcomeShowIcon: checkedValue('persona-assistant-welcome-show-icon', defaults.welcomeShowIcon),
			placeholder: fieldValue('persona-assistant-input-placeholder', defaults.placeholder),
			prompts: fieldValue('persona-assistant-suggested-prompts', defaults.prompts),
			suggestionVariant: selectedValue('suggestion_variant', defaults.suggestionVariant || 'chip'),
			suggestionPlacement: selectedValue('suggestion_placement', defaults.suggestionPlacement || 'auto'),
			suggestionBehavior: selectedValue('suggestion_behavior', defaults.suggestionBehavior || 'send'),
			suggestionOverflow: selectedValue('suggestion_overflow', defaults.suggestionOverflow || 'wrap'),
			suggestionMaxItems: fieldValue('persona-assistant-suggestion-max', defaults.suggestionMaxItems || 4),
			scrollbarPolicy: selectedValue('scrollbar_policy', defaults.scrollbarPolicy || 'on-scroll'),
			showActivity: activity ? !!activity.checked : !!defaults.showActivity,
			assistantPreset: selectedValue('assistant_style_preset', defaults.assistantPreset || 'branded'),
			assistantWidth: selectedValue('assistant_content_width', defaults.assistantWidth || 'wide'),
			assistantHeader: selectedValue('assistant_header_style', defaults.assistantHeader || 'branded'),
			assistantMessages: selectedValue('assistant_message_style', defaults.assistantMessages || 'bubble'),
			assistantComposer: selectedValue('assistant_composer_style', defaults.assistantComposer || 'default'),
			assistantWelcome: checkedValue('persona-assistant-page-show-welcome', defaults.assistantWelcome),
			assistantWelcomeVariant: selectedValue('assistant_welcome_variant', defaults.assistantWelcomeVariant || 'inherit'),
			assistantWelcomeDismiss: selectedValue('assistant_welcome_dismiss', defaults.assistantWelcomeDismiss || 'inherit'),
			assistantSuggestionVariant: selectedValue('assistant_suggestion_variant', defaults.assistantSuggestionVariant || 'inherit'),
			assistantSuggestionPlacement: selectedValue('assistant_suggestion_placement', defaults.assistantSuggestionPlacement || 'inherit'),
			assistantSuggestionBehavior: selectedValue('assistant_suggestion_behavior', defaults.assistantSuggestionBehavior || 'inherit'),
			assistantSuggestionOverflow: selectedValue('assistant_suggestion_overflow', defaults.assistantSuggestionOverflow || 'inherit'),
			assistantSuggestionMaxItems: fieldValue('persona-assistant-page-suggestion-max', defaults.assistantSuggestionMaxItems || 0),
			assistantAvatars: checkedValue('persona-assistant-page-show-avatars', defaults.assistantAvatars),
			assistantTimestamps: checkedValue('persona-assistant-page-show-timestamps', defaults.assistantTimestamps),
			assistantClear: checkedValue('persona-assistant-page-show-clear-chat', defaults.assistantClear),
			assistantAttachments: checkedValue('persona-assistant-page-attachments', defaults.assistantAttachments),
			launcherAttachments: checkedValue('persona-assistant-launcher-attachments', defaults.launcherAttachments),
			assistantVoice: checkedValue('persona-assistant-page-voice', defaults.assistantVoice),
			assistantDisclaimer: fieldValue('persona-assistant-page-disclaimer', defaults.assistantDisclaimer)
		};
	}

	function assistantDraftSettings(now) {
		return {
			chat_icon: now.icon,
			welcome_title: now.title,
			welcome_subtitle: now.welcomeSubtitle,
			welcome_message: now.welcomeMessage,
			welcome_show_icon: now.welcomeShowIcon,
			input_placeholder: now.placeholder,
			suggested_prompts: now.prompts,
			assistant_style_preset: now.assistantPreset,
			assistant_content_width: now.assistantWidth,
			assistant_header_style: now.assistantHeader,
			assistant_message_style: now.assistantMessages,
			assistant_composer_style: now.assistantComposer,
			assistant_show_welcome: now.assistantWelcome,
			assistant_welcome_variant: now.assistantWelcomeVariant,
			assistant_welcome_dismiss: now.assistantWelcomeDismiss,
			assistant_suggestion_variant: now.assistantSuggestionVariant,
			assistant_suggestion_placement: now.assistantSuggestionPlacement,
			assistant_suggestion_behavior: now.assistantSuggestionBehavior,
			assistant_suggestion_overflow: now.assistantSuggestionOverflow,
			assistant_suggestion_max_items: now.assistantSuggestionMaxItems,
			assistant_show_avatars: now.assistantAvatars,
			assistant_show_timestamps: now.assistantTimestamps,
			assistant_show_clear_chat: now.assistantClear,
			assistant_attachments: now.assistantAttachments,
			launcher_attachments: now.launcherAttachments,
			assistant_voice: now.assistantVoice,
			assistant_disclaimer: now.assistantDisclaimer
		};
	}

	var savedAppearance = null;
	var livePreviewTimer = null;

	function appearanceChanged(a, b) {
		if (!a || !b) {
			return false;
		}
		for (var key in a) {
			if (a.hasOwnProperty(key) && a[key] !== b[key]) {
				return true;
			}
		}
		return false;
	}

	function syncLivePreview() {
		var now = currentAppearance();
		var strings = cfg.strings || {};

		// Flag unsaved edits so the preview isn't mistaken for the published state.
		var note = document.getElementById('persona-assistant-preview-note');
		if (note && savedAppearance) {
			note.hidden = !appearanceChanged(now, savedAppearance);
		}

		if (assistantPreviewFrame) {
			if (!assistantPreviewReady) {
				return;
			}
			clearTimeout(livePreviewTimer);
			livePreviewTimer = setTimeout(function () {
				assistantPreviewFrame.contentWindow.postMessage(
					{
						type: 'persona-assistant-preview-settings',
						settings: assistantDraftSettings(now)
					},
					window.location.origin
				);
			}, 150);
			return;
		}

		if (!previewHandle) {
			return;
		}
		clearTimeout(livePreviewTimer);
		livePreviewTimer = setTimeout(function () {
			// Mirror persona_assistant_widget_config(): copy fields always carry a
			// value (setting or localized default) and the launcher stays inline.
			var copy = {
				inputPlaceholder: now.placeholder || strings.defaultPlaceholder || 'How can I help...'
			};
			var launcher = {
				enabled: false,
				// Keep filling the fixed-height preview box (matches the
				// 'preview' context in persona_assistant_widget_config()).
				fullHeight: true,
				title: now.headerTitle || strings.siteName || '',
				subtitle: now.headerSubtitle || strings.defaultLauncherSubtitle || '',
				position: now.position,
				// Released widget builds shallow-merge `launcher` on update(),
				// wholesale-replacing the defaulted config, which strips the
				// transparent button chrome and rebuilds the header buttons
				// with UA-default gray circles. Restate the visually-critical
				// defaults (from the widget's DEFAULT_LAUNCHER_CONFIG) so the
				// replacement is harmless. Redundant-but-safe on builds that
				// deep-merge the launcher.
				headerIconSize: '40px',
				agentIconSize: '40px',
				closeButtonSize: '32px',
				closeButtonPaddingX: '0px',
				closeButtonPaddingY: '0px',
				closeButtonBackgroundColor: 'transparent',
				clearChat: {
					enabled: true,
					placement: 'inline',
					iconName: 'refresh-cw',
					size: '32px',
					backgroundColor: 'transparent',
					borderColor: 'transparent',
					paddingX: '0px',
					paddingY: '0px',
					showTooltip: true,
					tooltipText: strings.clearChat || 'Clear chat'
				}
			};
			launcher.teaser = now.teaserText ? {
				text: now.teaserText,
				delayMs: Math.max(0, Math.min(60, parseInt(now.teaserDelay, 10) || 0)) * 1000,
				frequency: now.teaserFrequency,
				dismissible: now.teaserDismissible,
				dismissLabel: strings.dismissMessage || 'Dismiss message'
			} : undefined;
			var iconKeys = iconLauncherKeys(now.icon);
			for (var key in iconKeys) {
				if (iconKeys.hasOwnProperty(key)) {
					launcher[key] = iconKeys[key];
				}
			}
			try {
				var update = {
					theme: previewTheme(now.color, now.corner),
					darkTheme: darkPreviewTheme(now.color),
					colorScheme: now.mode,
					copy: copy,
					welcome: {
						title: now.title || strings.defaultTitle || 'Hello 👋',
						subtitle: now.welcomeSubtitle || strings.defaultWelcomeSubtitle || '',
						variant: now.welcomeVariant,
						dismiss: now.welcomeDismiss,
						message: now.welcomeMessage,
						icon: welcomeIcon(now.icon, now.welcomeShowIcon)
					},
					suggestions: {
						starters: {
							items: parsePrompts(now.prompts, now.suggestionMaxItems),
							variant: now.suggestionVariant,
							placement: now.suggestionPlacement,
							behavior: now.suggestionBehavior,
							overflow: now.suggestionOverflow,
							maxItems: Math.max(1, Math.min(8, parseInt(now.suggestionMaxItems, 10) || 4))
						}
					},
					features: {
						showReasoning: now.showActivity,
						showToolCalls: now.showActivity,
						scrollBehavior: { scrollbar: now.scrollbarPolicy }
					},
					launcher: launcher,
					attachments: { enabled: now.launcherAttachments }
				};
				previewHandle.update(update);
			} catch (e) {
				// Preview-only affordance: never let it break the settings page.
			}
		}, 150);
	}

	function onPreviewFieldChange() {
		paintIconField();
		syncColorMeta();
		syncLivePreview();
	}

	// Two canonical presets; each seeds the fine-tune fields below (width is
	// one of them, so the old width-only variants are covered by fine-tuning).
	var assistantPresets = {
		branded: {
			width: 'standard', header: 'branded', messages: 'bubble', composer: 'default',
			welcome: true, avatars: true, timestamps: false, clearChat: true
		},
		chatgpt: {
			width: 'standard', header: 'hidden', messages: 'minimal', composer: 'pill',
			welcome: true, avatars: false, timestamps: false, clearChat: true
		}
	};

	function setRadio(name, value) {
		var radios = document.querySelectorAll('input[name$="[' + name + ']"]');
		for (var i = 0; i < radios.length; i++) {
			radios[i].checked = radios[i].value === value;
		}
	}

	function setChecked(id, value) {
		var el = document.getElementById(id);
		if (el) {
			el.checked = !!value;
		}
	}

	function applyAssistantPreset(name) {
		var preset = assistantPresets[name];
		if (!preset) {
			return;
		}
		setRadio('assistant_content_width', preset.width);
		setRadio('assistant_header_style', preset.header);
		setRadio('assistant_message_style', preset.messages);
		setRadio('assistant_composer_style', preset.composer);
		setChecked('persona-assistant-page-show-welcome', preset.welcome);
		setChecked('persona-assistant-page-show-avatars', preset.avatars);
		setChecked('persona-assistant-page-show-timestamps', preset.timestamps);
		setChecked('persona-assistant-page-show-clear-chat', preset.clearChat);
		onPreviewFieldChange();
	}

	// Renders one lucide IconNode (from admin-icons.js, same draw data the
	// widget bundles) as an inline SVG, mirroring createSvgFromIconData.
	function renderIconSvg(iconData, size) {
		var svgNs = 'http://www.w3.org/2000/svg';
		var svg = document.createElementNS(svgNs, 'svg');
		svg.setAttribute('width', String(size));
		svg.setAttribute('height', String(size));
		svg.setAttribute('viewBox', '0 0 24 24');
		svg.setAttribute('fill', 'none');
		svg.setAttribute('stroke', 'currentColor');
		svg.setAttribute('stroke-width', '2');
		svg.setAttribute('stroke-linecap', 'round');
		svg.setAttribute('stroke-linejoin', 'round');
		svg.setAttribute('aria-hidden', 'true');
		for (var i = 0; i < iconData.length; i++) {
			var part = iconData[i];
			if (!part || part.length < 2) {
				continue;
			}
			var el = document.createElementNS(svgNs, part[0]);
			var attrs = part[1] || {};
			for (var key in attrs) {
				if (attrs.hasOwnProperty(key) && key !== 'stroke') {
					el.setAttribute(key, String(attrs[key]));
				}
			}
			svg.appendChild(el);
		}
		return svg;
	}

	// Paints the enhanced chat-icon control (swatch + summary + Clear) from the
	// raw field value. Branch order mirrors iconLauncherKeys() so the swatch
	// always previews what the widget will actually render.
	function paintIconField() {
		var wrapper = document.getElementById('persona-assistant-icon-field');
		if (!wrapper || !wrapper.classList.contains('is-enhanced')) {
			return;
		}
		var swatch = document.getElementById('persona-assistant-icon-swatch');
		var clearButton = document.getElementById('persona-assistant-icon-clear');
		var strings = cfg.strings || {};
		var icons = window.PersonaAssistantIconData || {};
		var raw = fieldValue('persona-assistant-chat-icon').trim();
		var builtIn = /^icon:([a-z0-9-]+)$/.exec(raw);

		function image(url) {
			var img = document.createElement('img');
			img.src = url;
			img.alt = '';
			return img;
		}

		while (swatch.firstChild) {
			swatch.removeChild(swatch.firstChild);
		}
		var text;
		if (builtIn) {
			if (icons[builtIn[1]]) {
				swatch.appendChild(renderIconSvg(icons[builtIn[1]], 22));
			}
			text = (strings.iconBuiltIn || '%s (built-in icon)').replace('%s', builtIn[1]);
		} else if (raw && /^(https?:\/\/|\/)/.test(raw)) {
			swatch.appendChild(image(raw));
			text = strings.iconCustomImage || 'Custom image';
		} else if (raw) {
			swatch.textContent = raw;
			text = strings.iconEmojiText || 'Emoji or text';
		} else if (cfg.siteIconUrl) {
			swatch.appendChild(image(cfg.siteIconUrl));
			text = strings.iconSiteDefault || 'Site Icon (default)';
		} else {
			if (icons.bot) {
				swatch.appendChild(renderIconSvg(icons.bot, 22));
			} else {
				swatch.textContent = '💬';
			}
			text = strings.iconWidgetDefault || 'Widget default';
		}
		// The swatch speaks for itself; the description below the field covers
		// the blank-field fallbacks. The specifics live in the hover tooltip.
		swatch.title = text;
		clearButton.hidden = '' === raw;
	}

	// The chat-icon control: swap the raw text field for swatch + summary +
	// Change/Clear backed by one tabbed modal: built-in icons (searchable),
	// Media Library image, or emoji/URL. Every path writes the same raw field
	// and re-runs the same preview update path a typed value would.
	function wireIconPicker() {
		var wrapper = document.getElementById('persona-assistant-icon-field');
		var input = document.getElementById('persona-assistant-chat-icon');
		var changeButton = document.getElementById('persona-assistant-icon-picker-button');
		var clearButton = document.getElementById('persona-assistant-icon-clear');
		var icons = window.PersonaAssistantIconData;
		if (!wrapper || !input || !changeButton || !clearButton || !icons) {
			return;
		}
		var strings = cfg.strings || {};
		var overlay = null;
		var searchField = null;
		var grid = null;
		var emptyNote = null;
		var textField = null;
		var tabs = {};
		var panes = {};
		var mediaFrame = null;

		function setValue(value) {
			input.value = value;
			onPreviewFieldChange();
		}

		function close() {
			if (overlay) {
				overlay.hidden = true;
			}
			document.removeEventListener('keydown', onKeydown);
		}

		function onKeydown(event) {
			if (event.key === 'Escape') {
				close();
				changeButton.focus();
			}
		}

		function activateTab(key) {
			for (var k in panes) {
				if (panes.hasOwnProperty(k)) {
					panes[k].hidden = k !== key;
					tabs[k].classList.toggle('is-active', k === key);
					tabs[k].setAttribute('aria-selected', k === key ? 'true' : 'false');
				}
			}
			if (key === 'icons') {
				searchField.focus();
			} else if (key === 'text') {
				textField.focus();
			}
		}

		function applyFilter() {
			var query = searchField.value.trim().toLowerCase();
			var visible = 0;
			for (var i = 0; i < grid.children.length; i++) {
				var cell = grid.children[i];
				var match = !query || cell.getAttribute('data-icon').indexOf(query) !== -1;
				cell.hidden = !match;
				visible += match ? 1 : 0;
			}
			emptyNote.hidden = visible > 0;
		}

		function markSelected() {
			var current = /^icon:([a-z0-9-]+)$/.exec(input.value.trim());
			var name = current ? current[1] : '';
			for (var i = 0; i < grid.children.length; i++) {
				var cell = grid.children[i];
				cell.classList.toggle('is-selected', cell.getAttribute('data-icon') === name);
			}
		}

		// The wp.media modal stacks below our overlay, so close ours first.
		function openMediaFrame() {
			if (!window.wp || !window.wp.media) {
				return;
			}
			close();
			if (!mediaFrame) {
				mediaFrame = window.wp.media({
					title: cfg.mediaTitle || 'Choose a chat icon',
					button: { text: cfg.mediaButton || 'Use this image' },
					library: { type: 'image' },
					multiple: false
				});
				mediaFrame.on('select', function () {
					var attachment = mediaFrame.state().get('selection').first();
					if (attachment) {
						setValue(attachment.toJSON().url || '');
					}
				});
			}
			mediaFrame.open();
		}

		function makeTab(key, label) {
			var tab = document.createElement('button');
			tab.type = 'button';
			tab.className = 'persona-assistant-icon-modal-tab';
			tab.setAttribute('role', 'tab');
			tab.textContent = label;
			tab.addEventListener('click', function () {
				activateTab(key);
			});
			tabs[key] = tab;
			return tab;
		}

		function makePane(key) {
			var pane = document.createElement('div');
			pane.className = 'persona-assistant-icon-modal-pane';
			pane.hidden = true;
			panes[key] = pane;
			return pane;
		}

		function build() {
			overlay = document.createElement('div');
			overlay.className = 'persona-assistant-icon-modal-overlay';
			overlay.addEventListener('click', function (event) {
				if (event.target === overlay) {
					close();
				}
			});

			var modal = document.createElement('div');
			modal.className = 'persona-assistant-icon-modal';
			modal.setAttribute('role', 'dialog');
			modal.setAttribute('aria-modal', 'true');
			modal.setAttribute('aria-label', strings.iconModalTitle || 'Choose a chat icon');

			var header = document.createElement('div');
			header.className = 'persona-assistant-icon-modal-header';
			var title = document.createElement('strong');
			title.textContent = strings.iconModalTitle || 'Choose a chat icon';
			var closeButton = document.createElement('button');
			closeButton.type = 'button';
			closeButton.className = 'button-link persona-assistant-icon-modal-close';
			closeButton.setAttribute('aria-label', strings.iconModalClose || 'Close');
			closeButton.textContent = '✕';
			closeButton.addEventListener('click', close);
			header.appendChild(title);
			header.appendChild(closeButton);

			var tabRow = document.createElement('div');
			tabRow.className = 'persona-assistant-icon-modal-tabs';
			tabRow.setAttribute('role', 'tablist');
			tabRow.appendChild(makeTab('icons', strings.iconTabIcons || 'Icons'));
			tabRow.appendChild(makeTab('image', strings.iconTabImage || 'Media Library'));
			tabRow.appendChild(makeTab('text', strings.iconTabText || 'Emoji or URL'));

			// Icons pane: searchable grid over the widget's built-in registry.
			var iconsPane = makePane('icons');
			searchField = document.createElement('input');
			searchField.type = 'search';
			searchField.className = 'persona-assistant-icon-modal-search';
			searchField.placeholder = strings.iconSearch || 'Search icons…';
			searchField.addEventListener('input', applyFilter);

			grid = document.createElement('div');
			grid.className = 'persona-assistant-icon-modal-grid';
			for (var name in icons) {
				if (!icons.hasOwnProperty(name)) {
					continue;
				}
				var cell = document.createElement('button');
				cell.type = 'button';
				cell.className = 'persona-assistant-icon-modal-cell';
				cell.setAttribute('data-icon', name);
				cell.setAttribute('title', name);
				cell.appendChild(renderIconSvg(icons[name], 22));
				var label = document.createElement('span');
				label.textContent = name;
				cell.appendChild(label);
				cell.addEventListener('click', function (event) {
					setValue('icon:' + event.currentTarget.getAttribute('data-icon'));
					close();
				});
				grid.appendChild(cell);
			}

			emptyNote = document.createElement('p');
			emptyNote.className = 'persona-assistant-icon-modal-empty';
			emptyNote.textContent = strings.iconNoMatches || 'No icons match your search.';
			emptyNote.hidden = true;

			iconsPane.appendChild(searchField);
			iconsPane.appendChild(grid);
			iconsPane.appendChild(emptyNote);

			// Image pane: gateway to the Media Library.
			var imagePane = makePane('image');
			var imageHelp = document.createElement('p');
			imageHelp.className = 'persona-assistant-icon-modal-help';
			imageHelp.textContent = strings.iconImageHelp || 'Use any image from your Media Library.';
			var browseButton = document.createElement('button');
			browseButton.type = 'button';
			browseButton.className = 'button';
			browseButton.textContent = strings.iconBrowseMedia || 'Browse Media Library…';
			if (!window.wp || !window.wp.media) {
				browseButton.disabled = true;
			}
			browseButton.addEventListener('click', openMediaFrame);
			imagePane.appendChild(imageHelp);
			imagePane.appendChild(browseButton);

			// Text pane: emoji / short text / image URL, applied explicitly.
			var textPane = makePane('text');
			var textHelp = document.createElement('p');
			textHelp.className = 'persona-assistant-icon-modal-help';
			textHelp.textContent = strings.iconTextHelp || 'An emoji or short text, or the URL of an image.';
			var textRow = document.createElement('div');
			textRow.className = 'persona-assistant-icon-modal-text-row';
			textField = document.createElement('input');
			textField.type = 'text';
			textField.placeholder = '🤖';
			var applyButton = document.createElement('button');
			applyButton.type = 'button';
			applyButton.className = 'button button-primary';
			applyButton.textContent = strings.iconApply || 'Apply';
			function applyText() {
				setValue(textField.value.trim());
				close();
			}
			applyButton.addEventListener('click', applyText);
			textField.addEventListener('keydown', function (event) {
				if (event.key === 'Enter') {
					event.preventDefault();
					applyText();
				}
			});
			textRow.appendChild(textField);
			textRow.appendChild(applyButton);
			textPane.appendChild(textHelp);
			textPane.appendChild(textRow);

			modal.appendChild(header);
			modal.appendChild(tabRow);
			modal.appendChild(iconsPane);
			modal.appendChild(imagePane);
			modal.appendChild(textPane);
			overlay.appendChild(modal);
			document.body.appendChild(overlay);
		}

		changeButton.addEventListener('click', function (event) {
			event.preventDefault();
			if (!overlay) {
				build();
			}
			overlay.hidden = false;
			searchField.value = '';
			applyFilter();
			markSelected();
			// Land on the tab that matches the current value: built-in/blank
			// on the grid, anything typed (emoji or URL) prefilled for editing.
			var raw = input.value.trim();
			var isBuiltIn = /^icon:/.test(raw);
			textField.value = isBuiltIn ? '' : raw;
			activateTab( isBuiltIn || '' === raw ? 'icons' : 'text' );
			document.addEventListener('keydown', onKeydown);
		});

		clearButton.addEventListener('click', function () {
			setValue('');
		});

		// Enhance: hide the raw field, reveal the picker control.
		wrapper.classList.add('is-enhanced');
		var reveal = [
			document.getElementById('persona-assistant-icon-swatch'),
			changeButton,
			clearButton
		];
		for (var r = 0; r < reveal.length; r++) {
			if (reveal[r]) {
				reveal[r].hidden = false;
			}
		}
		paintIconField();
	}

	function setStatus(el, text, isError) {
		if (!el) {
			return;
		}
		el.textContent = text || '';
		el.className = 'persona-assistant-inline-status' + (isError ? ' persona-assistant-inline-status--error' : '');
	}

	function populate(selectId, items) {
		var select = document.getElementById(selectId);
		if (!select) {
			return;
		}
		var current = select.getAttribute('data-current') || '';
		var extra = select.querySelectorAll('option:not(:first-child)');
		for (var i = 0; i < extra.length; i++) {
			extra[i].remove();
		}
		(items || []).forEach(function (item) {
			var option = document.createElement('option');
			option.value = item.id;
			// Two products can each own a "Chat" surface, so the product name is
			// the disambiguator, not the raw id.
			option.textContent = item.name + (item.productName ? ' — ' + item.productName : '');
			if (item.id === current) {
				option.selected = true;
			}
			select.appendChild(option);
		});
	}

	// First-run onboarding: with zero chat surfaces the select is meaningless,
	// so swap it for the create-your-site-assistant panel. Only a successful
	// fetch decides; errors leave the default UI in place.
	function syncSurfaceEmptyState(isEmpty) {
		var emptyEl = document.getElementById('persona-assistant-surface-empty');
		var selectRow = document.getElementById('persona-assistant-surface-select-row');
		if (!emptyEl) {
			return;
		}
		emptyEl.hidden = !isEmpty;
		if (selectRow) {
			selectRow.hidden = isEmpty;
		}
	}

	function loadTargets() {
		var statusEl = document.getElementById('persona-assistant-load-status');
		var loadButton = document.getElementById('persona-assistant-load-targets');

		setStatus(statusEl, strings.loading || 'Loading…');
		if (loadButton) {
			loadButton.disabled = true;
			loadButton.textContent = strings.loading || 'Loading…';
		}

		// The server resolves the stored credential for the active source; there
		// is no API-key field to send.
		var body = new URLSearchParams();
		body.set('action', 'persona_assistant_list_targets');
		body.set('nonce', cfg.nonce || '');

		fetch(cfg.ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: body.toString()
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				if (!json || !json.success) {
					var message = json && json.data && json.data.message ? json.data.message : (strings.error || 'Error');
					setStatus(statusEl, message, true);
					return;
				}
				populate('persona-assistant-surface-select', json.data.surfaces);
				var total = json.data.surfaces ? json.data.surfaces.length : 0;
				if (total === 1) {
					var select = document.getElementById('persona-assistant-surface-select');
					var ownInput = document.getElementById('persona-assistant-surface-id');
					select.value = json.data.surfaces[0].id;
					select.setAttribute('data-current', json.data.surfaces[0].id);
					ownInput.value = json.data.surfaces[0].id;
				}
				syncSurfaceEmptyState(total === 0);
				// With the onboarding panel visible, a "no results" status line
				// would just restate it negatively.
				var emptyShown = total === 0 && document.getElementById('persona-assistant-surface-empty');
				setStatus(statusEl, total ? (strings.loaded || 'Assistants loaded.') : (emptyShown ? '' : (strings.noResults || '')));
			})
			.catch(function () {
				setStatus(statusEl, strings.error || 'Error', true);
			})
			.finally(function () {
				if (loadButton) {
					loadButton.disabled = false;
					loadButton.textContent = strings.refresh || 'Refresh';
				}
			});
	}

	function wireTargetSelect(selectId, ownInputId) {
		var select = document.getElementById(selectId);
		var ownInput = document.getElementById(ownInputId);
		if (!select || !ownInput) {
			return;
		}
		select.addEventListener('change', function () {
			if (!select.value) {
				ownInput.value = '';
				select.setAttribute('data-current', '');
				return;
			}
			ownInput.value = select.value;
			select.setAttribute('data-current', select.value);
		});
		ownInput.addEventListener('input', function () {
			var matching = false;
			for (var i = 0; i < select.options.length; i++) {
				if (select.options[i].value === ownInput.value) {
					matching = true;
					break;
				}
			}
			select.value = matching ? ownInput.value : '';
			select.setAttribute('data-current', ownInput.value);
		});
	}

	function onReady() {
		var providerRadios = document.querySelectorAll('input[name$="[ai_backend]"]');
		for (var p = 0; p < providerRadios.length; p++) {
			providerRadios[p].addEventListener('change', syncProviderVisibility);
		}
		syncProviderVisibility();

		var placementRadios = document.querySelectorAll('input[name$="[placement_mode]"]');
		for (var m = 0; m < placementRadios.length; m++) {
			placementRadios[m].addEventListener('change', syncPlacementVisibility);
		}
		syncPlacementVisibility();

		var loginCheckbox = document.getElementById('persona-assistant-wp-ai-login');
		if (loginCheckbox) {
			loginCheckbox.addEventListener('change', syncAccessVisibility);
		}
		syncAccessVisibility();

		wireTargetSelect('persona-assistant-surface-select', 'persona-assistant-surface-id');

		var loadButton = document.getElementById('persona-assistant-load-targets');
		if (loadButton) {
			loadButton.addEventListener('click', loadTargets);
			// Auto-fire the surface list on load when a mint credential is present.
			if (cfg.canListSurfaces) {
				loadTargets();
			}
		}

		// Baseline for the unsaved-changes note: the values as saved.
		savedAppearance = currentAppearance();

		var assistantPresetRadios = document.querySelectorAll('input[name$="[assistant_style_preset]"]');
		for (var ap = 0; ap < assistantPresetRadios.length; ap++) {
			assistantPresetRadios[ap].addEventListener('change', function (event) {
				if (event.currentTarget.checked) {
					applyAssistantPreset(event.currentTarget.value);
				}
			});
		}

		// Every focused appearance control feeds the live preview. `input`
		// covers text/textarea/color; `change` covers radios and checkboxes.
		var previewInputs = document.querySelectorAll(
			'#persona-assistant-theme-color, #persona-assistant-chat-icon, #persona-assistant-header-title, ' +
			'#persona-assistant-header-subtitle, #persona-assistant-welcome-title, #persona-assistant-welcome-subtitle, ' +
			'#persona-assistant-welcome-message, #persona-assistant-welcome-show-icon, ' +
			'#persona-assistant-input-placeholder, #persona-assistant-suggested-prompts, #persona-assistant-suggestion-max, ' +
			'#persona-assistant-launcher-teaser, #persona-assistant-launcher-teaser-delay, #persona-assistant-launcher-teaser-dismissible, ' +
			'input[name$="[theme_mode]"], input[name$="[corner_style]"], ' +
			'input[name$="[launcher_position]"], input[name$="[launcher_teaser_frequency]"], ' +
			'input[name$="[welcome_variant]"], input[name$="[welcome_dismiss]"], ' +
			'input[name$="[suggestion_variant]"], input[name$="[suggestion_placement]"], ' +
			'input[name$="[suggestion_behavior]"], input[name$="[suggestion_overflow]"], ' +
			'input[name$="[scrollbar_policy]"], #persona-assistant-show-ai-activity, ' +
			'input[name$="[assistant_content_width]"], input[name$="[assistant_header_style]"], ' +
			'input[name$="[assistant_message_style]"], input[name$="[assistant_composer_style]"], ' +
			'input[name$="[assistant_welcome_variant]"], input[name$="[assistant_welcome_dismiss]"], ' +
			'input[name$="[assistant_suggestion_variant]"], input[name$="[assistant_suggestion_placement]"], ' +
			'input[name$="[assistant_suggestion_behavior]"], input[name$="[assistant_suggestion_overflow]"], ' +
			'#persona-assistant-page-suggestion-max, ' +
			'#persona-assistant-page-show-welcome, #persona-assistant-page-show-avatars, ' +
			'#persona-assistant-page-show-timestamps, #persona-assistant-page-show-clear-chat, ' +
			'#persona-assistant-page-attachments, #persona-assistant-page-voice, ' +
			'#persona-assistant-page-disclaimer'
		);
		for (var n = 0; n < previewInputs.length; n++) {
			previewInputs[n].addEventListener('input', onPreviewFieldChange);
			previewInputs[n].addEventListener('change', onPreviewFieldChange);
		}
		syncColorMeta();

		var colorReset = document.getElementById('persona-assistant-color-reset');
		if (colorReset) {
			colorReset.addEventListener('click', function () {
				var colorInput = document.getElementById('persona-assistant-theme-color');
				colorInput.value = colorReset.getAttribute('data-color') || '#4f46e5';
				syncColorMeta();
				syncLivePreview();
			});
		}

		wireIconPicker();

		var confirmButtons = document.querySelectorAll('[data-persona-confirm]');
		for (var c = 0; c < confirmButtons.length; c++) {
			confirmButtons[c].addEventListener('click', function (event) {
				if (!window.confirm(event.currentTarget.getAttribute('data-persona-confirm'))) {
					event.preventDefault();
				}
			});
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', onReady);
	} else {
		onReady();
	}
})();
