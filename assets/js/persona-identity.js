/** Verified WordPress identity. Proofs live only in memory, never in browser storage. */
(function () {
	'use strict';

	function decorateConfig(config, identity, mode) {
		if (mode !== 'runtype' || !identity || !identity.enabled) {
			return config;
		}

		var cached = null;
		var pending = null;
		var handle = null;
		var notice = null;
		var disabled = false;
		var previousErrorMessage = config.errorMessage;

		function showFallback() {
			if (notice || disabled || !handle) {
				return;
			}
			notice = document.createElement('div');
			notice.setAttribute('role', 'status');
			notice.style.cssText = 'position:fixed;bottom:24px;left:24px;right:24px;max-width:520px;z-index:2147483001;padding:16px;background:#fff;color:#1d2327;border:1px solid #767676;border-radius:8px;font:14px/1.5 system-ui;box-shadow:0 2px 12px rgba(0,0,0,.2)';
			var message = document.createElement('p');
			message.textContent = identity.failureMessage;
			var button = document.createElement('button');
			button.type = 'button';
			button.textContent = identity.continueLabel;
			button.addEventListener('click', async function () {
				button.disabled = true;
				try {
					// Reset the bound device before leaving verified history. No previous
					// transcript is replayed, and the visitor explicitly starts a new chat.
					if (config.features && config.features.history && config.features.history.enabled && typeof handle.resetHistoryIdentity === 'function') {
						await handle.resetHistoryIdentity();
					}
					if (typeof config.clearStoredSessionId === 'function') {
						config.clearStoredSessionId();
					}
					disabled = true;
					cached = null;
					handle.update({
						identityProvider: undefined,
						getIdentityProof: undefined,
						// Ephemeral storage creates a new visitor credential; never reuse
						// an account-bound credential or a persisted conversation ID.
						persistState: false,
						getStoredSessionId: function () { return null; },
						getStoredConversationId: function () { return null; },
						setStoredSessionId: function () {},
						setStoredConversationId: function () {},
						features: { history: { enabled: false, scope: 'browser' } }
					});
					handle.clearChat();
					notice.remove();
					notice = null;
					handle.focusInput();
				} catch (e) {
					message.textContent = identity.retryMessage;
					button.disabled = false;
				}
			});
			notice.appendChild(message);
			notice.appendChild(button);
			document.body.appendChild(notice);
		}

		async function fetchProof() {
			var controller = typeof AbortController === 'function' ? new AbortController() : null;
			var timeout = controller ? window.setTimeout(function () { controller.abort(); }, 8000) : null;
			try {
				var response = await window.fetch(identity.tokenUrl, {
					method: 'POST',
					credentials: 'same-origin',
					cache: 'no-store',
					headers: { 'X-WP-Nonce': identity.nonce, 'Accept': 'application/json' },
					signal: controller ? controller.signal : undefined
				});
				if (!response.ok) {
					throw new Error('Identity token unavailable');
				}
				var result = await response.json();
				var expiresAt = Number(result.expiresAt) * 1000;
				if (typeof result.token !== 'string' || !result.token || result.token.length > 8192 || !Number.isFinite(expiresAt) || expiresAt <= Date.now() + 60000) {
					throw new Error('Invalid identity response');
				}
				if (disabled) {
					return null;
				}
				cached = { token: result.token, expiresAt: expiresAt };
				return result.token;
			} catch (e) {
				cached = null;
				showFallback();
				return null;
			} finally {
				if (timeout !== null) {
					window.clearTimeout(timeout);
				}
			}
		}

		config.identityProvider = identity.provider;
		config.getIdentityProof = function () {
			if (disabled) {
				return Promise.resolve(null);
			}
			if (cached && cached.expiresAt > Date.now() + 60000) {
				return Promise.resolve(cached.token);
			}
			if (!pending) {
				pending = fetchProof().finally(function () { pending = null; });
			}
			return pending;
		};
		config.features = config.features || {};
		config.features.history = Object.assign({}, config.features.history || {}, { scope: 'verified-user' });
		config.errorMessage = function (error) {
			if (error && (error.code === 'invalid_identity_proof' || /identity proof/i.test(error.message || ''))) {
				cached = null;
				showFallback();
				return identity.failureMessage;
			}
			return typeof previousErrorMessage === 'function' ? previousErrorMessage(error) : (previousErrorMessage || identity.genericFailureMessage);
		};
		window.addEventListener('persona:chat-ready', function (event) {
			handle = event.detail;
			if (handle && typeof handle.on === 'function') {
				handle.on('history:identityStatusChanged', function (event) {
					if (event.status && ['authentication_required', 'identity_provider_failed', 'configuration_error'].indexOf(event.status.state) !== -1) {
						cached = null;
						showFallback();
					}
				});
			}
		}, { once: true });
		return config;
	}

	window.PersonaAssistantIdentity = { decorateConfig: decorateConfig };
})();
