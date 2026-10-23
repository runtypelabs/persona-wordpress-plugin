/** Native V5 wiring and mounted-update checks: node tools/test-v5-rendering.js */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function fixture() {
	const listeners = {}, radios = {}, ids = {}, updates = [];
	const root = { dataset: {}, style: {}, children: [], appendChild(n) { this.children.push(n); } };
	const window = { location: { origin: 'https://example.test' }, setTimeout, clearTimeout,
		addEventListener(type, cb) { (listeners[type] ||= []).push(cb); },
		dispatchEvent(event) { for (const cb of listeners[event.type] || []) cb(event); },
		getComputedStyle() { return { fontFamily: 'Site font' }; }, parent: { postMessage() {} } };
	const document = { body: root, referrer: '', readyState: 'complete',
		getElementById(id) { return ids[id] || (id === 'persona-assistant-root' ? root : null); },
		querySelector(selector) { return selector === '#persona-assistant-root' ? root : radios[selector] || null; },
		querySelectorAll() { return []; } };
	const context = vm.createContext({ window, document, console, URL, URLSearchParams, setTimeout, clearTimeout,
		CustomEvent: class { constructor(type, data) { this.type = type; this.detail = data.detail; } } });
	const handle = { update(patch) { updates.push(patch); }, on() {} };
	function load(file) { vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js', file), 'utf8'), context); }
	load('persona-layouts.js');
	return { window, document, context, handle, updates, radios, ids, load };
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
	const f = fixture();
	const plugin = { id: 'site-customization' };
	const pill = f.window.PersonaAssistantLayouts.decorateConfig({ future: { v5Defaults: true }, plugins: [plugin] }, { composerStyle: 'pill' });
	assert.equal(pill.composer.layout, 'single-row');
	assert.equal(pill.plugins.length, 1, 'Pill uses native composer, retaining custom plugins');
	assert.equal(pill.plugins[0], plugin);
	assert.equal(f.window.PersonaAssistantLayouts.decorateConfig({}, { composerStyle: 'default' }).composer, undefined, 'Default inherits native V5 composer defaults');
	assert.equal(f.window.PersonaAssistantLayouts.decorateConfig({ composer: { layout: 'stacked' } }, { composerStyle: 'pill' }).composer.layout, 'stacked', 'Explicit filter composer layout survives');
	const prior = { future: { v5Defaults: true }, theme: { palette: { colors: { primary: { 500: 'red' } }, radius: { lg: '2px' } }, components: { input: { borderRadius: '1px' } } }, composer: { layout: 'single-row' } };
	const next = { theme: { palette: { colors: { primary: { 500: 'blue' } } } } };
	const patch = f.window.PersonaAssistantLayouts.replacementPatch(next, prior);
	assert.equal(patch.theme.palette.radius, undefined);
	assert.ok(Object.hasOwn(patch.theme.palette, 'radius'), 'Changing corner back to rounded deletes previous radius');
	assert.ok(Object.hasOwn(patch.theme, 'components'));
	assert.ok(Object.hasOwn(patch, 'composer'), 'Changing pill back to Default deletes previous composer opinion');
	assert.equal(Object.hasOwn(next.theme.palette, 'radius'), false, 'Patch does not mutate server snapshot');

	const railPatch = f.window.PersonaAssistantLayouts.replacementPatch(
		{ features: { history: { enabled: true } } },
		{ features: { history: { provider: () => {}, rail: { brand: { icon: 'leaf' } } } } }
	);
	assert.ok(Object.hasOwn(railPatch.features.history.rail, 'brand'), 'Branded to minimal removes the previous rail mark');
	assert.equal(railPatch.features.history.rail.brand, undefined);
	assert.equal(Object.hasOwn(railPatch.features.history, 'provider'), false, 'Rail reset leaves mounted history provider intact');

	for (const context of ['frontend', 'fullscreen']) {
		const b = fixture(); let mounted;
		b.window.PersonaAssistantData = { mode: 'runtype', context, target: '#persona-assistant-root', config: { future: { v5Defaults: true }, features: { history: { rail: { brand: { icon: 'leaf' } } } } },
			clientToken: 'ct_test', apiUrl: 'https://api.example.test', appearance: { composerStyle: 'pill' },
			history: { browserMode: 'off', storageKey: 'test', sessionKey: 'session' }, identity: { enabled: true, provider: 'oidc', tokenUrl: '/identity', nonce: 'nonce' } };
		b.load('persona-history.js'); b.load('persona-identity.js');
		if (context === 'fullscreen') b.window.AgentWidget = { initAgentWidget(options) { mounted = options.config; return b.handle; } };
		b.load('persona-bootstrap.js'); await wait(5);
		const config = context === 'fullscreen' ? mounted : b.window.siteAgentConfig.config;
		assert.equal(config.future.v5Defaults, true, context + ' keeps V5 nested at runtime config');
		assert.equal(typeof config.getIdentityProof, 'function', 'Identity decorator survives');
		assert.equal(config.features.history.scope, 'verified-user', 'History decorator survives');
		assert.equal(config.features.history.rail.brand.icon, 'leaf');
		if (context === 'fullscreen') assert.equal(config.composer.layout, 'single-row');
	}

	prior.theme.components.input.background = '#feedab';
	prior.theme.components.customComponent = { foreground: '#123456' };
	for (const [width, presentation, enabled, expected] of [
		[390, 'rail', true, 0], [719, 'rail', true, 0], [720, 'rail', true, 1],
		[1280, 'rail', true, 1], [1280, 'panel', true, 0],
		[600, 'auto', true, 0], [960, 'auto', true, 1], [1280, 'rail', false, 0]
	]) {
		const h = fixture(); let opened = 0;
		h.window.innerWidth = 1600; // A narrow mount inside a wide settings page.
		h.document.body.getBoundingClientRect = () => ({ width });
		h.window.PersonaAssistantData = { target: '#persona-assistant-root' };
		h.load('persona-history.js');
		const historyConfig = h.window.PersonaAssistantHistory.decorateConfig(
			{ launcher: { enabled: false }, features: { history: { presentation, enabled } } },
			{ browserMode: 'session', storageKey: 'test', sessionKey: 'session' }, 'runtype', 'fullscreen'
		);
		const historyHandle = { showHistory() { opened++; return Promise.resolve(); } };
		h.window.dispatchEvent({ type: 'persona:chat-ready', detail: historyHandle });
		assert.equal(opened, expected, `History ${presentation} enabled=${enabled} at mount width ${width}`);
		assert.equal(historyConfig.features.history.presentation, presentation, 'Mount gating preserves configured history presentation');
		if (enabled && width < 720) {
			await historyHandle.showHistory();
			assert.equal(opened, 1, 'Messages remains manually available on narrow mounts');
		}
	}

	const admin = fixture();
	admin.window.PersonaAssistantAdmin = { provider: 'runtype', preview: { ready: true, canChat: true, config: { config: prior }, formDefaults: { color: '#ba2459', corner: 'square' } } };
	admin.radios['input[name$="[corner_style]"]:checked'] = { value: 'rounded' };
	admin.load('admin.js');
	admin.window.dispatchEvent({ type: 'persona:chat-ready', detail: admin.handle });
	await wait(180);
	assert.ok(admin.updates.length, 'Launcher admin preview updates mounted widget');
	for (const key of ['headerIconSize', 'agentIconSize', 'closeButtonSize', 'clearChat']) {
		assert.equal(Object.hasOwn(admin.updates.at(-1).launcher, key), false, 'Live preview inherits V5 launcher ' + key);
	}

	assert.equal(admin.updates.at(-1).future.v5Defaults, true);
	assert.equal(admin.updates.at(-1).darkTheme.palette.colors.gray, undefined, 'Launcher preview leaves dark neutrals to V5');
	assert.ok(Object.hasOwn(admin.updates.at(-1).theme.palette, 'radius'), 'Launcher preview resets old corner overrides');

	const themePatch = admin.updates.at(-1).theme;
	assert.ok(Object.hasOwn(themePatch.components.input, 'borderRadius'), 'Corner reset targets plugin radius leaves');
	assert.equal(Object.hasOwn(themePatch.components.input, 'background'), false, 'Corner reset preserves custom input background');
	assert.equal(Object.hasOwn(themePatch.components, 'customComponent'), false, 'Corner reset preserves unrelated custom component');
	assert.equal(Object.hasOwn(themePatch.palette.radius, 'full'), false, 'Corner reset preserves unrelated custom radius token');
	assert.equal(Object.hasOwn(admin.updates.at(-1), 'composer'), false, 'Launcher form does not erase custom composer config');

	const optedOut = fixture();
	optedOut.window.PersonaAssistantAdmin = { preview: { ready: true, canChat: true, config: { config: { future: { v5Defaults: false } } } } };
	optedOut.load('admin.js');
	optedOut.window.dispatchEvent({ type: 'persona:chat-ready', detail: optedOut.handle });
	await wait(180);
	assert.equal(optedOut.updates.at(-1).future.v5Defaults, false, 'Admin preview keeps public-filter opt-out');

	const frame = fixture();
	frame.window.PersonaAssistantData = { config: prior, matchFont: false };
	frame.window.PersonaAssistantPreviewFrame = { ajaxUrl: '/preview', nonce: 'nonce' };
	frame.window.fetch = async () => ({ json: async () => ({ success: true, data: { config: { future: { v5Defaults: true }, theme: { palette: { colors: { primary: { 500: 'blue' } } } } }, appearance: { composerStyle: 'default' } } }) });
	frame.load('persona-preview-frame.js');
	frame.window.dispatchEvent({ type: 'persona:chat-ready', detail: frame.handle });
	frame.window.dispatchEvent({ type: 'message', origin: frame.window.location.origin, source: frame.window.parent, data: { type: 'persona-assistant-preview-settings', settings: {} } });
	await wait(130);
	assert.equal(frame.updates.length, 1, 'Assistant iframe updates mounted widget from server config');
	assert.equal(frame.updates[0].future.v5Defaults, true);
	assert.ok(Object.hasOwn(frame.updates[0].theme.palette, 'radius'));
	assert.ok(Object.hasOwn(frame.updates[0], 'composer'));
	console.log('PASS: native composer/filter compatibility, theme resets, installer/direct mounts, history/identity, responsive initial rail and both admin preview updates');
})().catch(error => { console.error(error); process.exitCode = 1; });
