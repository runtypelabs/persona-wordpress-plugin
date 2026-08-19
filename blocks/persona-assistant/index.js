/**
 * Persona Assistant block: build-free editor registration.
 *
 * No JSX / no npm: uses the global `wp.*` modules and `createElement`. The block
 * is dynamic: `save` returns null and PHP's render_callback emits the mount div
 * on the front end (the same path as the [persona_assistant] shortcode).
 */
(function (blocks, element, blockEditor, components, i18n) {
	'use strict';

	var el = element.createElement;
	var useBlockProps = blockEditor.useBlockProps;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var SelectControl = components.SelectControl;
	var TextareaControl = components.TextareaControl;
	var ToggleControl = components.ToggleControl;
	var useEffect = element.useEffect;
	var useRef = element.useRef;
	var __ = i18n.__;
	var data = window.PersonaAssistantBlockData || {};

	function clone(value) {
		return JSON.parse(JSON.stringify(value || {}));
	}

	function previewConfig(attributes) {
		var preview = data.preview || {};
		var config = clone(preview.config);
		config.launcher = Object.assign({}, config.launcher || {}, {
			enabled: false,
			fullHeight: true,
			width: '100%',
			height: '100%'
		});

		if (data.mode === 'runtype') {
			config.clientToken = preview.clientToken || '';
			config.apiUrl = preview.apiUrl || '';
			config.agentId = attributes.agentId || preview.agentId || '';
		} else if (data.mode === 'demo') {
			config.clientToken = preview.clientToken || 'ct_demo';
			config.apiUrl = preview.apiUrl || '';
		} else if (data.mode === 'wordpress_ai') {
			config.apiUrl = preview.apiUrl || '';
			if (attributes.wpAiSystemPrompt) {
				config.requestMiddleware = function (context) {
					return Object.assign({}, context.payload || {}, {
						systemPrompt: attributes.wpAiSystemPrompt
					});
				};
			}
		}

		return config;
	}

	blocks.registerBlockType('persona-assistant/widget', {
		edit: function (props) {
			var attributes = props.attributes;
			var mountRef = useRef(null);
			var handleRef = useRef(null);
			var mode = data.mode || 'disabled';

			function setAttr(key) {
				return function (value) {
					var update = {};
					update[key] = value;
					props.setAttributes(update);
				};
			}

			useEffect(function () {
				var mount = mountRef.current;
				if (!mount || !data.isReady || !window.AgentWidget || typeof window.AgentWidget.initAgentWidget !== 'function') {
					return undefined;
				}

				try {
					handleRef.current = window.AgentWidget.initAgentWidget({
						target: mount,
						useShadowDom: false,
						config: previewConfig(attributes)
					});
				} catch (error) {
					mount.textContent = __('The assistant preview could not be loaded.', 'persona-assistant');
					if (window.console && window.console.error) {
						window.console.error('Persona Assistant block preview failed:', error);
					}
				}

				return function () {
					var handle = handleRef.current;
					if (handle && typeof handle.destroy === 'function') {
						handle.destroy();
					}
					handleRef.current = null;
					if (mount) {
						mount.innerHTML = '';
					}
				};
			}, []);

			useEffect(function () {
				var handle = handleRef.current;
				if (handle && typeof handle.update === 'function') {
					handle.update(previewConfig(attributes));
				}
			}, [attributes.agentId, attributes.wpAiSystemPrompt]);

			var modeControl = null;
			if (mode === 'runtype') {
				modeControl = data.hasConstAgent
					? el(
						'p',
						{ className: 'components-base-control__help' },
						__('The agent is set by PERSONA_ASSISTANT_AGENT_ID in wp-config.php.', 'persona-assistant')
					)
					: el(SelectControl, {
						label: __('Agent', 'persona-assistant'),
						value: attributes.agentId || '',
						options: data.agentOptions || [{ label: __('Use the default agent', 'persona-assistant'), value: '' }],
						help: __('Choose a Runtype agent for this block, or use the default from Persona Assistant settings.', 'persona-assistant'),
						onChange: setAttr('agentId')
					});
			} else if (mode === 'wordpress_ai') {
				modeControl = el(TextareaControl, {
					label: __('System prompt', 'persona-assistant'),
					value: attributes.wpAiSystemPrompt || '',
					help: data.siteWpAiSystemPrompt
						? __('Leave blank to inherit the system prompt from Persona Assistant settings.', 'persona-assistant')
						: __('Set instructions for WordPress AI on this block. Leave blank for no system prompt.', 'persona-assistant'),
					rows: 6,
					onChange: function (value) {
						setAttr('wpAiSystemPrompt')(value.slice(0, 8000));
					}
				});
			}

			return el(
				'div',
				useBlockProps(),
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __('Persona Assistant', 'persona-assistant'), initialOpen: true },
						el(
							'p',
							{ className: 'persona-assistant-editor-mode' },
							__('Mode:', 'persona-assistant'),
							' ',
							(data.modeLabel && data.modeLabel[mode]) || mode
						),
						modeControl,
						el(ToggleControl, {
							label: __('Floating launcher', 'persona-assistant'),
							help: attributes.launcher
								? __('On: a floating chat button appears on the published page. The editor keeps the chat expanded for previewing.', 'persona-assistant')
								: __('Off: the chat renders inline, right where this block is placed.', 'persona-assistant'),
							checked: !!attributes.launcher,
							onChange: setAttr('launcher')
						})
					)
				),
				el(
					'div',
					{ className: 'persona-assistant-editor-shell' },
					data.isReady
						? el('div', {
							className: 'persona-assistant-editor-preview',
							ref: mountRef
						})
						: el(
							'div',
							{ className: 'persona-assistant-editor-empty' },
							el('span', { className: 'dashicons dashicons-format-chat', 'aria-hidden': true }),
							el('strong', {}, data.welcomeTitle || __('Hello 👋', 'persona-assistant')),
							el('span', { className: 'persona-assistant-editor-input' }, data.placeholder || __('How can I help...', 'persona-assistant'))
						),
					!data.isReady && el(
						'p',
						{ className: 'persona-assistant-editor-warning' },
						__('Connect an AI before publishing this block.', 'persona-assistant'),
						' ',
						el('a', { href: data.settingsUrl || '#' }, __('Open settings', 'persona-assistant'))
					),
					data.isSitewide && el(
						'p',
						{ className: 'persona-assistant-editor-warning' },
						__('The site-wide launcher is active, so this block will not render another chat.', 'persona-assistant')
					),
					data.placementMode === 'off' && el(
						'p',
						{ className: 'persona-assistant-editor-warning' },
						__('Chat is not published. Choose block or shortcode placement in Persona Assistant settings.', 'persona-assistant')
					)
				)
			);
		},
		save: function () {
			return null;
		}
	});
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n);
