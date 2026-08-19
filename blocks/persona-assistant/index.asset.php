<?php
/**
 * Editor script dependencies for the build-free Persona Assistant block.
 *
 * WordPress pairs this file with index.js when registering the block from
 * block.json. Without it, the script loads before wp-blocks/wp-block-editor
 * and client-side registration fails silently.
 *
 * @package Persona_Assistant
 */

return array(
	'dependencies' => array(
		'wp-blocks',
		'wp-element',
		'wp-block-editor',
		'wp-components',
		'wp-i18n',
		'persona-assistant-block-widget',
	),
	'version'      => persona_assistant_asset_version( 'blocks/persona-assistant/index.js' ),
);
