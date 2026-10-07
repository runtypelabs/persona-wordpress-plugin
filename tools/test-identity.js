/** Browser adapter checks: node tools/test-identity.js */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function fixture() {
	const listeners = {};
	const elements = [];
	let now = 1000000;
	let requests = [];
	let respond = async () => ({ ok: true, json: async () => ({ token: 'signed-token', expiresAt: (now + 300000) / 1000 }) });
	function element() {
		return {
			children: [], handlers: {}, dataset: {}, style: {},
			setAttribute() {}, appendChild(child) { this.children.push(child); },
			addEventListener(name, cb) { this.handlers[name] = cb; }, remove() { this.removed = true; }
		};
	}
	const root = element();
	const window = {
		addEventListener(name, cb) { (listeners[name] ||= []).push(cb); },
		dispatchEvent(event) { for (const callback of listeners[event.type] || []) callback(event); },
		setTimeout, clearTimeout,
		fetch: async (url, options) => { requests.push({ url, options }); return respond(); }
	};
	const document = { body: element(), getElementById: () => root, querySelector: () => root, createElement() { const node = element(); elements.push(node); return node; } };
	class ClockDate extends Date { static now() { return now; } }
	const context = vm.createContext({ window, document, Date: ClockDate, AbortController, Promise, Number, Object, Error, console, CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } } });
	function load(file) { vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'assets/js', file), 'utf8'), context); }
	load('persona-identity.js');
	const identity = { enabled: true, provider: 'oidc', tokenUrl: '/wp-json/persona-assistant/v1/identity/token', nonce: 'rest-nonce', failureMessage: 'Identity unavailable', continueLabel: 'Start browser chat', retryMessage: 'Try again', genericFailureMessage: 'Chat failed' };
	return { window, document, identity, elements, load, requests, advance(ms) { now += ms; }, setResponse(fn) { respond = fn; }, decorate(config = {}, mode = 'runtype') { return window.PersonaAssistantIdentity.decorateConfig(config, identity, mode); } };
}

(async function () {
	const f = fixture();
	const config = f.decorate({ features: { history: { enabled: true } } });
	assert.equal(config.identityProvider, 'oidc');
	assert.equal(config.features.history.scope, 'verified-user');
	const proofs = await Promise.all([config.getIdentityProof(), config.getIdentityProof(), config.getIdentityProof()]);
	assert.deepEqual(proofs, ['signed-token', 'signed-token', 'signed-token']);
	assert.equal(f.requests.length, 1, 'Concurrent requests share one token fetch');
	assert.equal(f.requests[0].options.credentials, 'same-origin');
	assert.equal(f.requests[0].options.cache, 'no-store');
	assert.equal(f.requests[0].options.headers['X-WP-Nonce'], 'rest-nonce');
	await config.getIdentityProof();
	assert.equal(f.requests.length, 1, 'Token is reused in memory');
	f.advance(241000);
	await config.getIdentityProof();
	assert.equal(f.requests.length, 2, 'Token refreshes before expiry');

	let reset = 0, cleared = 0, focused = 0, updated = null;
	const handle = {
		on() {}, async resetHistoryIdentity() { reset++; },
		update(patch) { updated = patch; }, clearChat() { cleared++; }, focusInput() { focused++; }
	};
	f.window.dispatchEvent({ type: 'persona:chat-ready', detail: handle });
	f.advance(241000);
	f.setResponse(async () => ({ ok: false, status: 401 }));
	assert.equal(await config.getIdentityProof(), null, 'Endpoint failures return null');
	const notice = f.document.body.children.at(-1);
	assert.equal(notice.children[0].textContent, 'Identity unavailable');
	assert.equal(reset, 0, 'Verified history is not silently downgraded');
	await notice.children[1].handlers.click();
	assert.equal(reset, 1, 'Explicit fallback resets the bound device');
	assert.equal(updated.identityProvider, undefined);
	assert.equal(updated.getIdentityProof, undefined);
	assert.equal(updated.persistState, false);
	assert.equal(updated.features.history.enabled, false);
	assert.equal(updated.getStoredSessionId(), null);
	assert.equal(updated.getStoredConversationId(), null);
	assert.equal(cleared, 1, 'Fallback starts without a previous transcript');
	assert.equal(focused, 1);
	assert.equal(await config.getIdentityProof(), null);
	assert.equal(config.errorMessage(new Error('other failure')), 'Chat failed');

	const rejected = fixture();
	const rejectedConfig = rejected.decorate();
	rejected.window.dispatchEvent({ type: 'persona:chat-ready', detail: handle });
	await rejectedConfig.getIdentityProof();
	assert.equal(rejectedConfig.errorMessage(Object.assign(new Error('proof rejected'), { code: 'invalid_identity_proof' })), 'Identity unavailable');
	assert.equal(rejected.document.body.children.length, 1, 'Tampered/expired proof errors offer a fresh browser chat');
	const normal = fixture();
	for (const mode of ['wordpress_ai', 'demo', 'disabled']) assert.equal(normal.decorate({}, mode).getIdentityProof, undefined);
	normal.identity.enabled = false;
	assert.equal(normal.decorate().identityProvider, undefined, 'Feature off adds no identity options');
	const malformed = fixture();
	malformed.setResponse(async () => ({ ok: true, json: async () => ({ token: 'bad', expiresAt: 'invalid' }) }));
	assert.equal(await malformed.decorate().getIdentityProof(), null, 'Invalid expiry fails safely');

	// Both bootstrap paths must keep function-valued identity options nested
	// where the Persona installer/direct mount consumes them.
	for (const context of ['frontend', 'fullscreen']) {
		const boot = fixture();
		boot.window.PersonaAssistantData = { mode: 'runtype', context, config: {}, identity: boot.identity, clientToken: 'ct_test', apiUrl: 'https://api.example.com', history: { browserMode: 'off', storageKey: 'test', sessionKey: 'session' } };
		let mounted;
		if (context === 'fullscreen') boot.window.AgentWidget = { initAgentWidget(options) { mounted = options.config; return handle; } };
		boot.load('persona-history.js');
		boot.load('persona-bootstrap.js');
		await new Promise(resolve => setTimeout(resolve, 10));
		const resolved = context === 'fullscreen' ? mounted : boot.window.siteAgentConfig.config;
		assert.equal(resolved.identityProvider, 'oidc', `${context} includes identity provider`);
		assert.equal(typeof resolved.getIdentityProof, 'function');
		assert.equal(resolved.features.history.scope, 'verified-user');
		assert.equal(await resolved.getIdentityProof(), 'signed-token');
	}
	console.log('PASS: memory caching, single-flight refresh, nonce transport, failure fallback, mode gates, and both bootstrap paths');
})().catch(error => { console.error(error); process.exitCode = 1; });
