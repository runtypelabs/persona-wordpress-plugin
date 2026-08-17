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
	var ToggleControl = components.ToggleControl;
	var __ = i18n.__;
	var data = window.PersonaAssistantBlockData || {};

	blocks.registerBlockType('persona-assistant/widget', {
		edit: function (props) {
			var attributes = props.attributes;

			function setAttr(key) {
				return function (value) {
					var update = {};
					update[key] = value;
					props.setAttributes(update);
				};
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
						el(SelectControl, {
							label: __('Agent', 'persona-assistant'),
							value: attributes.agentId || '',
							options: data.agentOptions || [{ label: __('Use the default agent', 'persona-assistant'), value: '' }],
							help: __('Agent choices are loaded from Persona Assistant settings.', 'persona-assistant'),
							onChange: setAttr('agentId')
						}),
						el(ToggleControl, {
							label: __('Floating launcher', 'persona-assistant'),
							help: attributes.launcher
								? __('On: a floating chat button appears; the chat opens in an overlay.', 'persona-assistant')
								: __('Off: the chat renders inline, right where this block is placed.', 'persona-assistant'),
							checked: !!attributes.launcher,
							onChange: setAttr('launcher')
						})
					)
				),
				el(
					'div',
					{
						className: 'persona-assistant-editor-preview',
						style: { borderTopColor: data.accent || '#4f46e5' }
					},
					el('span', { className: 'dashicons dashicons-format-chat', 'aria-hidden': true }),
					el('strong', {}, data.welcomeTitle || __('Hello 👋', 'persona-assistant')),
					el('span', { className: 'persona-assistant-editor-input' }, data.placeholder || __('How can I help...', 'persona-assistant')),
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
