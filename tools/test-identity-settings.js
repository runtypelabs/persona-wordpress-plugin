/** Admin behavior checks: node tools/test-identity-settings.js */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function fixture({ provider = 'runtype', enabled = true, savedReady = true, clipboard = true } = {}) {
	function node(props = {}) {
		const attrs = {}, handlers = {};
		return Object.assign({ style: {}, disabled: false, checked: false, value: '', handlers,
			setAttribute(k, v) { attrs[k] = v; }, getAttribute(k) { return attrs[k] ?? null; },
			addEventListener(k, cb) { (handlers[k] ||= []).push(cb); },
			fire(k) { for (const cb of handlers[k] || []) cb({ currentTarget: this }); },
			focus() {}, select() { this.selected = true; }, querySelectorAll() { return []; }
		}, props);
	}
	const runtype = node({ value: 'runtype', checked: provider === 'runtype' });
	const wordpress = node({ value: 'wordpress_ai', checked: provider === 'wordpress_ai' });
	const checkbox = node({ checked: enabled }), fallback = node(), email = node({ checked: false }), emailFallback = node();
	const button = node({ disabled: !savedReady }), integration = node({ disabled: !savedReady });
	const verify = node({ disabled: true }); // No saved ID yet.
	const workflow = node({ querySelectorAll: () => [button, integration, verify] }), reminder = node();
	const identity = node(), setup = node({ querySelector: s => s === '[data-identity-workflow]' ? workflow : reminder });
	setup.setAttribute('data-identity-ready', savedReady ? 'true' : 'false');
	const surface = node({ value: 'surf_saved' }), token = node({ value: 'ct_saved' });
	const row = node({ querySelectorAll: () => [email, emailFallback] });
	const runtypeSection = node(), wpSection = node();
	runtypeSection.setAttribute('data-provider', 'runtype'); wpSection.setAttribute('data-provider', 'wordpress_ai');
	const prompt = node({ parentElement: { open: false } }), status = node();
	const ids = { 'persona-assistant-identity-enabled': checkbox, 'persona-assistant-copy-identity-prompt': button,
		'persona-assistant-identity-prompt': prompt, 'persona-assistant-identity-copy-status': status,
		'persona-assistant-identity-share-email': email, 'persona-assistant-surface-id': surface, 'persona-assistant-client-token': token };
	const requests = [], copied = [];
	let response = { success: true, data: { prompt: 'public setup configuration' } };
	const document = { readyState: 'complete',
		getElementById(id) { return ids[id] || null; },
		querySelector(s) {
			if (s === '[data-runtype-only]') return identity;
			if (s === '[data-identity-setup]') return setup;
			if (s === 'input[name$="[ai_backend]"]:checked') return runtype.checked ? runtype : wordpress.checked ? wordpress : null;
			return null;
		},
		querySelectorAll(s) {
			if (s === '.persona-assistant-provider-section') return [runtypeSection, wpSection];
			if (s === 'input[name$="[ai_backend]"]') return [runtype, wordpress];
			if (s === 'input[name$="[identity_enabled]"]') return [checkbox, fallback];
			if (s === '[data-identity-dependent]') return [row];
			return [];
		}, execCommand() { return false; }
	};
	const window = { PersonaAssistantAdmin: { provider, ajaxUrl: '/admin-ajax.php', nonce: 'admin-nonce' }, addEventListener() {} };
	vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../assets/js/admin.js'), 'utf8'), {
		window, document, navigator: clipboard ? { clipboard: { writeText: async text => copied.push(text) } } : {},
		URLSearchParams, Promise, setTimeout, clearTimeout,
		fetch: async (url, options) => { requests.push({ url, options }); return { json: async () => response }; }
	});
	return { checkbox, fallback, email, emailFallback, identity, setup, workflow, reminder, surface, token, button, verify, prompt, status, requests, copied,
		selectProvider(value) { runtype.checked = value === 'runtype'; wordpress.checked = value === 'wordpress_ai'; (runtype.checked ? runtype : wordpress).fire('change'); },
		respond(value) { response = value; } };
}

async function settled() { await new Promise(resolve => setImmediate(resolve)); }
(async () => {
	const f = fixture();
	assert.equal(f.identity.style.display, '');
	f.selectProvider('wordpress_ai');
	assert.equal(f.identity.style.display, 'none', 'All identity controls hide under WordPress AI');
	assert.equal(f.checkbox.disabled, true); assert.equal(f.fallback.disabled, true);
	assert.equal(f.email.disabled, true); assert.equal(f.emailFallback.disabled, true);
	f.selectProvider('runtype');
	assert.equal(f.identity.style.display, ''); assert.equal(f.checkbox.disabled, false);
	assert.equal(f.email.checked, false, 'Provider changes preserve email opt-out');
	assert.equal(f.email.disabled, false);
	f.email.checked = true; f.email.fire('change');
	assert.equal(f.workflow.hidden, true, 'Email changes hide the prompt and setup actions until saved');
	assert.equal(f.reminder.hidden, false); assert.equal(f.button.disabled, true);
	f.button.fire('click'); await settled();
	assert.equal(f.requests.length, 0, 'Unsaved email changes cannot request a prompt');
	f.email.checked = false; f.email.fire('change');
	assert.equal(f.workflow.hidden, false, 'Reverting changes restores setup for the saved settings');
	assert.equal(f.reminder.hidden, true);
	f.surface.value = 'surf_changed'; f.surface.fire('change');
	assert.equal(f.workflow.hidden, true, 'Changing the selected surface requires a save');
	f.surface.value = 'surf_saved'; f.surface.fire('change');
	f.token.value = 'ct_changed'; f.token.fire('input');
	assert.equal(f.button.disabled, true, 'Editing chat credentials blocks setup');
	f.token.value = 'ct_saved'; f.token.fire('input');
	f.checkbox.checked = false; f.checkbox.fire('change');
	assert.equal(f.setup.hidden, true); assert.equal(f.emailFallback.disabled, true);
	f.checkbox.checked = true; f.checkbox.fire('change');
	assert.equal(f.setup.hidden, false); assert.equal(f.button.disabled, false);
	assert.equal(f.verify.disabled, true, 'Toggling identity cannot unlock verification without a saved ID');
	f.button.fire('click'); await settled();
	assert.deepEqual(f.copied, ['public setup configuration']);
	assert.equal(f.requests.length, 1, 'Provider changes do not duplicate copy handlers');
	assert.equal(f.requests[0].options.credentials, 'same-origin');
	assert.equal(f.requests[0].options.body.get('nonce'), 'admin-nonce');
	assert.equal(f.button.disabled, false);
	const manual = fixture({ clipboard: false });
	manual.button.fire('click'); await settled();
	assert.equal(manual.prompt.parentElement.open, true); assert.equal(manual.prompt.selected, true);
	assert.match(manual.status.textContent, /copy/);
	const failed = fixture(); failed.respond({ success: false, data: { message: 'Save identity first' } });
	failed.button.fire('click'); await settled();
	assert.equal(failed.status.textContent, 'Save identity first'); assert.equal(failed.copied.length, 0);
	const unsaved = fixture({ enabled: false, savedReady: false });
	unsaved.checkbox.checked = true; unsaved.checkbox.fire('change');
	assert.equal(unsaved.button.disabled, true, 'Unsaved enablement cannot prepare keys');
	assert.equal(unsaved.workflow.hidden, true, 'Unsaved enablement hides the manually copyable prompt too');
	assert.equal(unsaved.reminder.hidden, false);
	unsaved.button.fire('click'); await settled();
	assert.equal(unsaved.requests.length, 0);
	const blocked = fixture({ savedReady: false });
	assert.equal(blocked.workflow.hidden, true, 'An unsupported site cannot expose the setup workflow');
	const wp = fixture({ provider: 'wordpress_ai' });
	assert.equal(wp.identity.style.display, 'none', 'WordPress AI hides identity on initial page load');
	console.log('PASS: provider visibility, preference preservation, setup gating, prompt preparation, copy fallback, and errors');
})();
