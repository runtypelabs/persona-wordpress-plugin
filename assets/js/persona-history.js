/**
 * Privacy-first Persona state adapters and conversation-history wiring.
 *
 * Browser history stores only user/assistant text. Attachments, inline data,
 * reasoning, tool activity, artifacts, and metadata are deliberately omitted.
 *
 * On the full-screen assistant this also enables Persona's built-in
 * conversation-history UX (`features.history`, rail presentation):
 *   - runtype mode uses Persona's Runtype-backed provider (client-token mode);
 *   - wordpress_ai account mode supplies a custom HistoryProvider backed by
 *     this plugin's REST routes (features.history.provider);
 *   - demo mode supplies a fully on-device HistoryProvider (browser scope):
 *     the stateless demo plane stores nothing, so conversations live in the
 *     visitor-selected browser storage and never leave the device.
 * Rename/star stay hidden: neither custom provider has an `update` capability.
 */
(function () {
	'use strict';

	function storageFor(mode) {
		try {
			return mode === 'device' ? window.localStorage : window.sessionStorage;
		} catch (e) {
			return null;
		}
	}

	function messageText(message) {
		var content = message && message.content;
		if (typeof content === 'string') {
			return content;
		}
		if (!Array.isArray(content)) {
			return '';
		}
		return content.map(function (part) {
			if (typeof part === 'string') {
				return part;
			}
			return part && part.type === 'text' && typeof part.text === 'string' ? part.text : '';
		}).filter(Boolean).join('\n');
	}

	function safeState(state) {
		var messages = state && Array.isArray(state.messages) ? state.messages : [];
		messages = messages.map(function (message) {
			if (!message || (message.role !== 'user' && message.role !== 'assistant')) {
				return null;
			}
			// Persona represents reasoning/tool activity as assistant variants. Those
			// execution details are useful live but are not conversation history.
			if (message.variant && message.variant !== 'message') {
				return null;
			}
			var content = messageText(message).trim();
			if (!content) {
				return null;
			}
			return {
				id: typeof message.id === 'string' ? message.id : undefined,
				role: message.role,
				content: content,
				createdAt: typeof message.createdAt === 'string' ? message.createdAt : undefined
			};
		}).filter(Boolean);

		return { messages: messages, metadata: {} };
	}

	function browserAdapter(mode, key) {
		var storage = storageFor(mode);
		return {
			load: function () {
				if (!storage) {
					return { messages: [], metadata: {} };
				}
				try {
					return safeState(JSON.parse(storage.getItem(key) || '{}'));
				} catch (e) {
					storage.removeItem(key);
					return { messages: [], metadata: {} };
				}
			},
			save: function (state) {
				if (storage) {
					try {
						storage.setItem(key, JSON.stringify(safeState(state)));
					} catch (e) {
						// Storage can be blocked or full; chat must keep working in memory.
					}
				}
			},
			clear: function () {
				if (storage) {
					storage.removeItem(key);
				}
			}
		};
	}

	/**
	 * Typed provider failure. Persona's history view branches on `code`, never
	 * on message text; a plain Error degrades to its generic failure surface.
	 */
	function historyError(code, message, retryAfterSeconds) {
		var HistoryProviderError = window.AgentWidget && window.AgentWidget.HistoryProviderError;
		if (HistoryProviderError) {
			return new HistoryProviderError(code, message || code, retryAfterSeconds ? { retryAfterSeconds: retryAfterSeconds } : undefined);
		}
		return new Error(message || code);
	}

	function errorCodeForStatus(status) {
		if (status === 404) {
			return 'not_found';
		}
		if (status === 401 || status === 403) {
			return 'authentication_required';
		}
		if (status === 429) {
			return 'rate_limited';
		}
		return 'unavailable';
	}

	function request(history, url, options) {
		var opts = options || {};
		opts.headers = Object.assign({}, opts.headers || {}, {
			'Content-Type': 'application/json',
			'X-WP-Nonce': history.nonce || ''
		});
		return window.fetch(url, opts).then(function (response) {
			if (!response.ok) {
				var retryAfter = parseInt(response.headers.get('Retry-After') || '', 10);
				return response.json().catch(function () { return {}; }).then(function (body) {
					throw historyError(
						errorCodeForStatus(response.status),
						body.message || (history.strings && history.strings.requestFailed) || 'Conversation history request failed.',
						isNaN(retryAfter) ? undefined : retryAfter
					);
				});
			}
			if (response.status === 204) {
				return null;
			}
			return response.json();
		}, function () {
			throw historyError('unavailable', (history.strings && history.strings.unavailable) || 'Conversation history is unavailable.');
		});
	}

	function conversationUrl(history, id) {
		return history.collectionUrl.replace(/\/$/, '') + '/' + encodeURIComponent(id);
	}

	/**
	 * Tracks the account conversation the chat endpoint appends turns to. The
	 * active id is mirrored into the `persona_conversation` URL argument so a
	 * reload (or a shared link) reopens the same conversation.
	 */
	function accountManager(history) {
		var activeId = history.selectedId || '';
		var creating = null;

		function setActive(id) {
			activeId = id || '';
			history.selectedId = activeId;
			try {
				var url = new URL(window.location.href);
				if (activeId) {
					url.searchParams.set(history.conversationArg || 'persona_conversation', activeId);
				} else {
					url.searchParams.delete(history.conversationArg || 'persona_conversation');
				}
				window.history.replaceState({}, '', url.toString());
			} catch (e) {
				// URL synchronization is progressive enhancement.
			}
		}

		function ensureConversation() {
			if (activeId) {
				return Promise.resolve(activeId);
			}
			if (!creating) {
				creating = request(history, history.collectionUrl, { method: 'POST', body: '{}' })
					.then(function (conversation) {
						setActive(conversation.id);
						return activeId;
					})
					.finally(function () { creating = null; });
			}
			return creating;
		}

		return {
			getActiveId: function () { return activeId; },
			ensureConversation: ensureConversation,
			setActive: setActive
		};
	}

	/**
	 * Persona HistoryProvider backed by the plugin's account-history REST routes
	 * (WordPress AI mode). Identity is the WordPress login carried by the REST
	 * cookie + nonce, so the provider always reports `verified` and advertises
	 * only the verified-user scope. No `update` capability: rename/star hidden.
	 * No `resetDevice`: "forget this device" hidden (the account, not the
	 * device, owns the history).
	 */
	function wpHistoryProvider(history, manager) {
		// updatedAt doubles as the conversation revision; the newest value seen
		// wins, and prepareOpen falls back to a fetch on a cold cache.
		var revisions = {};
		var availabilitySubscribers = [];

		function summarize(row) {
			revisions[row.id] = row.updatedAt || '';
			return {
				id: row.id,
				title: row.title || (history.strings && history.strings.newConversation) || 'New conversation',
				targetId: null,
				preview: row.preview || null,
				messageCount: typeof row.messageCount === 'number' ? row.messageCount : 0,
				createdAt: row.createdAt || '',
				updatedAt: row.updatedAt || ''
			};
		}

		function activation(id, revision, onCommit, onDiscard) {
			var settled = false;
			return {
				conversationId: id,
				conversationRevision: revision || '',
				commit: function () {
					if (settled) {
						return;
					}
					settled = true;
					onCommit();
				},
				discard: function () {
					if (settled) {
						return;
					}
					settled = true;
					if (onDiscard) {
						onDiscard();
					}
				}
			};
		}

		return {
			capabilities: { scopes: ['verified-user'] },

			getIdentityStatus: function () {
				return { state: 'verified' };
			},

			subscribeIdentityStatus: function () {
				return function () {};
			},

			// Persona's history view re-fetches its list whenever availability
			// reports true, which doubles as the refresh channel for turns the
			// widget cannot see (the server stores each turn out of band).
			subscribeAvailability: function (callback) {
				availabilitySubscribers.push(callback);
				return function () {
					availabilitySubscribers = availabilitySubscribers.filter(function (subscriber) {
						return subscriber !== callback;
					});
				};
			},

			notifyChanged: function () {
				availabilitySubscribers.forEach(function (callback) {
					try {
						callback(true);
					} catch (e) {
						// One broken subscriber must not block the rest.
					}
				});
			},

			list: function () {
				return request(history, history.collectionUrl, { method: 'GET' }).then(function (rows) {
					return {
						items: (rows || []).map(summarize),
						nextCursor: null
					};
				});
			},

			getPage: function (id) {
				return request(history, conversationUrl(history, id), { method: 'GET' }).then(function (conversation) {
					var state = safeState(conversation.state || {});
					var summary = summarize({
						id: conversation.id,
						title: conversation.title,
						preview: conversation.preview,
						messageCount: state.messages.length,
						createdAt: conversation.createdAt,
						updatedAt: conversation.updatedAt
					});
					return {
						summary: summary,
						messages: state.messages,
						conversationRevision: summary.updatedAt,
						nextCursor: null
					};
				});
			},

			prepareOpen: function (id) {
				var revision = revisions[id]
					? Promise.resolve(revisions[id])
					: request(history, conversationUrl(history, id), { method: 'GET' }).then(function (conversation) {
						revisions[id] = conversation.updatedAt || '';
						return revisions[id];
					});
				return revision.then(function (rev) {
					return activation(id, rev, function () { manager.setActive(id); });
				});
			},

			prepareStartNew: function () {
				return request(history, history.collectionUrl, { method: 'POST', body: '{}' }).then(function (conversation) {
					revisions[conversation.id] = conversation.updatedAt || '';
					return activation(
						conversation.id,
						conversation.updatedAt,
						function () { manager.setActive(conversation.id); },
						function () {
							// Discard the never-activated empty row so it cannot
							// linger server-side. Best-effort by design.
							request(history, conversationUrl(history, conversation.id), { method: 'DELETE' }).catch(function () {});
						}
					);
				});
			},

			'delete': function (id) {
				return request(history, conversationUrl(history, id), { method: 'DELETE' }).then(function () {
					if (id === manager.getActiveId()) {
						manager.setActive('');
					}
				});
			},

			deleteAll: function () {
				return request(history, history.collectionUrl, { method: 'DELETE' }).then(function (result) {
					manager.setActive('');
					return { deleted: result && typeof result.deleted === 'number' ? result.deleted : 0 };
				});
			}
		};
	}

	/**
	 * Device-local conversation store for demo mode.
	 *
	 * The demo plane is stateless by design (it stores no transcripts), so the
	 * browser is the only place demo conversations can live. Everything stays
	 * in the visitor-selected storage (session/device) under a demo-scoped key;
	 * nothing ever leaves the device, which keeps the demo's "nothing you type
	 * is stored" promise true server-side.
	 */
	function demoConversationStore(history) {
		var storage = storageFor(history.browserMode);
		var key = history.storageKey + '-conversations';
		var MAX_CONVERSATIONS = 30;

		function read() {
			if (!storage) {
				return {};
			}
			try {
				var parsed = JSON.parse(storage.getItem(key) || '{}');
				return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
			} catch (e) {
				try { storage.removeItem(key); } catch (e2) { /* best-effort */ }
				return {};
			}
		}

		function write(conversations) {
			if (!storage) {
				return;
			}
			// Newest-first cap so a long-lived demo tab cannot grow unbounded.
			var ids = Object.keys(conversations).sort(function (a, b) {
				return (conversations[b].updatedAt || '').localeCompare(conversations[a].updatedAt || '');
			});
			ids.slice(MAX_CONVERSATIONS).forEach(function (id) {
				delete conversations[id];
			});
			try {
				storage.setItem(key, JSON.stringify(conversations));
			} catch (e) {
				// Storage can be blocked or full; the live chat keeps working.
			}
		}

		return {
			all: read,
			get: function (id) {
				return read()[id] || null;
			},
			put: function (conversation) {
				var conversations = read();
				conversations[conversation.id] = conversation;
				write(conversations);
			},
			remove: function (id) {
				var conversations = read();
				delete conversations[id];
				write(conversations);
			},
			removeAll: function () {
				var count = Object.keys(read()).length;
				if (storage) {
					try { storage.removeItem(key); } catch (e) { /* best-effort */ }
				}
				return count;
			}
		};
	}

	/**
	 * Tracks the active demo conversation, mirroring the id into the
	 * `persona_conversation` URL argument exactly like the account manager so
	 * reloads reopen the same on-device conversation.
	 */
	function demoManager(history) {
		var activeId = '';
		try {
			activeId = new URL(window.location.href).searchParams.get(history.conversationArg || 'persona_conversation') || '';
		} catch (e) {
			// URL selection is progressive enhancement.
		}

		function setActive(id) {
			activeId = id || '';
			try {
				var url = new URL(window.location.href);
				if (activeId) {
					url.searchParams.set(history.conversationArg || 'persona_conversation', activeId);
				} else {
					url.searchParams.delete(history.conversationArg || 'persona_conversation');
				}
				window.history.replaceState({}, '', url.toString());
			} catch (e) {
				// URL synchronization is progressive enhancement.
			}
		}

		return {
			getActiveId: function () { return activeId; },
			setActive: setActive
		};
	}

	/**
	 * Persona HistoryProvider over the device-local demo store. Browser scope
	 * only — the scope banner reads as on-this-device history, and rename/star
	 * stay hidden because there is no `update` capability. Turn capture happens
	 * in the demo storage adapter (see decorateConfig), not here: the provider
	 * is the read/manage side of the same store.
	 */
	function demoHistoryProvider(history, manager, store) {
		var availabilitySubscribers = [];

		function firstUserText(messages) {
			for (var i = 0; i < messages.length; i++) {
				if (messages[i].role === 'user' && messages[i].content) {
					return messages[i].content;
				}
			}
			return '';
		}

		function summarize(conversation) {
			var messages = conversation.messages || [];
			var last = messages.length ? messages[messages.length - 1].content : '';
			return {
				id: conversation.id,
				title: conversation.title || (history.strings && history.strings.newConversation) || 'New conversation',
				targetId: null,
				preview: last ? String(last).slice(0, 300) : null,
				messageCount: messages.length,
				createdAt: conversation.createdAt || '',
				updatedAt: conversation.updatedAt || ''
			};
		}

		function activation(id, revision, onCommit, onDiscard) {
			var settled = false;
			return {
				conversationId: id,
				conversationRevision: revision || '',
				commit: function () {
					if (settled) {
						return;
					}
					settled = true;
					onCommit();
				},
				discard: function () {
					if (settled) {
						return;
					}
					settled = true;
					if (onDiscard) {
						onDiscard();
					}
				}
			};
		}

		return {
			capabilities: { scopes: ['browser'] },

			getIdentityStatus: function () {
				return { state: 'browser_only', reason: 'configured_browser_scope' };
			},

			subscribeIdentityStatus: function () {
				return function () {};
			},

			subscribeAvailability: function (callback) {
				availabilitySubscribers.push(callback);
				return function () {
					availabilitySubscribers = availabilitySubscribers.filter(function (subscriber) {
						return subscriber !== callback;
					});
				};
			},

			notifyChanged: function () {
				availabilitySubscribers.forEach(function (callback) {
					try {
						callback(true);
					} catch (e) {
						// One broken subscriber must not block the rest.
					}
				});
			},

			list: function () {
				var conversations = store.all();
				var items = Object.keys(conversations).map(function (id) {
					return summarize(conversations[id]);
				}).filter(function (summary) {
					// A conversation without a stored transcript is invisible,
					// mirroring the account provider's semantics.
					return summary.messageCount > 0;
				}).sort(function (a, b) {
					return (b.updatedAt || '').localeCompare(a.updatedAt || '');
				});
				return Promise.resolve({ items: items, nextCursor: null });
			},

			getPage: function (id) {
				var conversation = store.get(id);
				if (!conversation) {
					return Promise.reject(historyError('not_found', (history.strings && history.strings.unavailable) || 'Conversation not found.'));
				}
				var summary = summarize(conversation);
				return Promise.resolve({
					summary: summary,
					messages: conversation.messages || [],
					conversationRevision: summary.updatedAt,
					nextCursor: null
				});
			},

			prepareOpen: function (id) {
				var conversation = store.get(id);
				if (!conversation) {
					return Promise.reject(historyError('not_found', (history.strings && history.strings.unavailable) || 'Conversation not found.'));
				}
				return Promise.resolve(activation(id, conversation.updatedAt, function () {
					manager.setActive(id);
				}));
			},

			prepareStartNew: function () {
				var now = new Date().toISOString();
				var conversation = {
					id: 'demo-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
					title: '',
					createdAt: now,
					updatedAt: now,
					messages: []
				};
				store.put(conversation);
				return Promise.resolve(activation(
					conversation.id,
					now,
					function () { manager.setActive(conversation.id); },
					function () { store.remove(conversation.id); }
				));
			},

			'delete': function (id) {
				store.remove(id);
				if (id === manager.getActiveId()) {
					manager.setActive('');
				}
				return Promise.resolve();
			},

			deleteAll: function () {
				var deleted = store.removeAll();
				manager.setActive('');
				return Promise.resolve({ deleted: deleted });
			},

			firstUserText: firstUserText
		};
	}

	/**
	 * Enable Persona's conversation-history UX. The rail presentation only
	 * renders on the full-screen assistant (direct inline mount, wide shell);
	 * everywhere else the Messages panel presentation applies.
	 */
	function enableHistoryFeature(config, context, provider) {
		config.features = config.features || {};
		config.features.history = Object.assign(
			{
				enabled: true,
				presentation: context === 'fullscreen' ? 'rail' : 'panel'
			},
			config.features.history || {}
		);
		if (provider) {
			config.features.history.provider = provider;
		}
		if (context === 'fullscreen') {
			// The rail owns the brand row, so the header shows the ACTIVE
			// conversation's title (falls back to launcher.title on a fresh chat).
			config.layout = config.layout || {};
			config.layout.header = config.layout.header || {};
			if (!config.layout.header.titleSource) {
				config.layout.header.titleSource = 'conversation';
			}
		}
		return config;
	}

	function decorateConfig(config, history, mode, context) {
		if (!history) {
			return config;
		}

		var sessionStore = storageFor('session');
		var deviceStore = storageFor('device');
		var historyFeatureEnabled = false;
		function remove(store, key) {
			try {
				if (store) {
					store.removeItem(key);
				}
			} catch (e) {
				// Storage cleanup is best-effort.
			}
		}
		if (mode === 'demo' && history.browserMode !== 'off') {
			// Demo mode: the demo plane stores nothing server-side, so the rail
			// is powered by an entirely on-device conversation store in the
			// visitor-selected browser lifetime. Clean the other lifetime's keys.
			remove(history.browserMode === 'device' ? sessionStore : deviceStore, history.storageKey);
			remove(history.browserMode === 'device' ? sessionStore : deviceStore, history.sessionKey);

			var demoStore = demoConversationStore(history);
			var demoMgr = demoManager(history);
			var demoProvider = demoHistoryProvider(history, demoMgr, demoStore);
			config = enableHistoryFeature(config, context, function () { return demoProvider; });
			historyFeatureEnabled = true;

			// The widget persists its live transcript through this adapter after
			// every change; that seam IS the capture path. Reads stay empty so
			// boot restore flows through openConversation below and is never
			// doubled by a session-restore of the same messages.
			config.persistState = true;
			var notifyTimer = null;
			config.storageAdapter = {
				load: function () {
					return { messages: [], metadata: {} };
				},
				save: function (state) {
					var clean = safeState(state);
					// The demo plane injects a scripted welcome before any input;
					// a conversation only becomes real (and rail-worthy) once the
					// visitor has actually said something.
					var hasUserMessage = clean.messages.some(function (message) {
						return message.role === 'user';
					});
					if (!hasUserMessage) {
						return;
					}
					var now = new Date().toISOString();
					var id = demoMgr.getActiveId();
					var conversation = id ? demoStore.get(id) : null;
					if (!conversation) {
						conversation = {
							id: 'demo-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
							title: '',
							createdAt: now,
							messages: []
						};
						demoMgr.setActive(conversation.id);
					}
					conversation.messages = clean.messages;
					if (!conversation.title) {
						conversation.title = String(demoProvider.firstUserText(clean.messages)).slice(0, 80);
					}
					conversation.updatedAt = now;
					demoStore.put(conversation);
					// Nudge the rail once the burst of stream-time saves settles.
					window.clearTimeout(notifyTimer);
					notifyTimer = window.setTimeout(function () {
						demoProvider.notifyChanged();
					}, 400);
				},
				clear: function () {
					// A cleared transcript means a fresh chat: detach the active
					// conversation so the next save opens a new one instead of
					// overwriting the old.
					demoMgr.setActive('');
				}
			};

			// Boot resume: reopen the URL-selected on-device conversation.
			var demoSelected = demoMgr.getActiveId();
			if (demoSelected && !demoStore.get(demoSelected)) {
				demoMgr.setActive('');
				demoSelected = '';
			}
			if (demoSelected) {
				window.addEventListener('persona:chat-ready', function (event) {
					var handle = event.detail;
					if (handle && typeof handle.openConversation === 'function') {
						Promise.resolve(handle.openConversation(demoSelected)).catch(function () {
							// Pruned or cleared selection: stay on the fresh chat.
							demoMgr.setActive('');
						});
					}
				}, { once: true });
			}
		} else if (history.accountEnabled && mode === 'wordpress_ai') {
			remove(sessionStore, history.storageKey);
			remove(deviceStore, history.storageKey);

			// The server holds the transcripts; nothing is persisted browser-side.
			// Persona's history view (rail) lists, opens, and deletes through the
			// REST-backed provider below.
			config.persistState = false;

			var manager = accountManager(history);
			var provider = wpHistoryProvider(history, manager);
			config = enableHistoryFeature(config, context, function () { return provider; });
			historyFeatureEnabled = true;

			// Attach the active account conversation to every chat request so the
			// endpoint appends the turn to the right transcript (creating the
			// conversation lazily on the first message of a fresh chat).
			var existingFetch = config.customFetch;
			config.customFetch = function (url, options, payload) {
				return manager.ensureConversation().then(function (conversationId) {
					var nextPayload = Object.assign({}, payload || {}, { conversationId: conversationId });
					var nextOptions = Object.assign({}, options || {}, { body: JSON.stringify(nextPayload) });
					return existingFetch ? existingFetch(url, nextOptions, nextPayload) : window.fetch(url, nextOptions);
				});
			};

			window.addEventListener('persona:chat-ready', function (event) {
				var handle = event.detail;
				if (!handle) {
					return;
				}

				// Boot resume is the host's concern with a supplied provider:
				// reopen the URL-selected conversation once the widget hands over
				// control.
				if (history.selectedId && typeof handle.openConversation === 'function') {
					Promise.resolve(handle.openConversation(history.selectedId)).catch(function () {
						// Deleted or expired selection: stay on the fresh chat.
						manager.setActive('');
					});
				}

				// The server appends turns outside the provider seam, so the rail
				// cannot know a fresh conversation gained its first messages (or
				// an existing one a new title/preview) until nudged. The delay
				// covers the gap between the client-side stream end and the
				// server's transcript write.
				if (typeof handle.on === 'function') {
					var refreshTimer = null;
					handle.on('assistant:complete', function () {
						window.clearTimeout(refreshTimer);
						refreshTimer = window.setTimeout(function () {
							provider.notifyChanged();
						}, 600);
					});
				}
			}, { once: true });
		} else if (history.browserMode === 'off') {
			remove(sessionStore, history.storageKey);
			remove(deviceStore, history.storageKey);
			remove(sessionStore, history.sessionKey);
			remove(deviceStore, history.sessionKey);
			config.persistState = false;
		} else {
			remove(history.browserMode === 'device' ? sessionStore : deviceStore, history.storageKey);
			remove(history.browserMode === 'device' ? sessionStore : deviceStore, history.sessionKey);
			config.persistState = true;
			config.storageAdapter = browserAdapter(history.browserMode, history.storageKey);
		}

		if (mode === 'runtype' && history.browserMode !== 'off') {
			// Runtype's own visitor-history backend powers the history UX in
			// client-token mode; no custom provider needed. Titles are generated
			// server-side by Runtype.
			config = enableHistoryFeature(config, context, null);
			historyFeatureEnabled = true;
		}

		// The rail is the frame of the full-screen layout, so it opens with the
		// page instead of waiting for the header's Messages toggle. (The widget
		// itself remembers the visitor's collapse choice across reloads.)
		if (historyFeatureEnabled && context === 'fullscreen') {
			window.addEventListener('persona:chat-ready', function (event) {
				var handle = event.detail;
				if (handle && typeof handle.showHistory === 'function') {
					Promise.resolve(handle.showHistory()).catch(function () {
						// The widget falls back to the panel presentation below its
						// 720px minimum; leaving history closed there is correct.
					});
				}
			}, { once: true });
		}

		// Runtype holds the canonical remote transcript. Persist only its opaque
		// session ID, using the same visitor-selected browser lifetime.
		if (mode === 'runtype' && history.browserMode !== 'off') {
			var sessionStorage = storageFor(history.browserMode);
			var oldGet = config.getStoredSessionId;
			var oldSet = config.setStoredSessionId;
			var oldExpired = config.onSessionExpired;
			config.getStoredSessionId = function () {
				var existing = typeof oldGet === 'function' ? oldGet() : '';
				try {
					return existing || (sessionStorage ? sessionStorage.getItem(history.sessionKey) : '') || null;
				} catch (e) {
					return existing || null;
				}
			};
			config.setStoredSessionId = function (id) {
				if (typeof oldSet === 'function') {
					oldSet(id);
				}
				if (sessionStorage && id) {
					try {
						sessionStorage.setItem(history.sessionKey, String(id));
					} catch (e) {
						// Session resume is optional.
					}
				}
			};
			config.onSessionExpired = function () {
				remove(sessionStore, history.sessionKey);
				remove(deviceStore, history.sessionKey);
				if (typeof oldExpired === 'function') {
					oldExpired();
				}
			};
			if (!historyFeatureEnabled) {
				window.addEventListener('persona:clear-chat', function () {
					remove(sessionStore, history.sessionKey);
					remove(deviceStore, history.sessionKey);
					// Persona's controller clears the visible transcript but keeps its
					// in-memory Runtype client session. Reload once so the next message
					// receives a genuinely new remote session as the user expects.
					window.setTimeout(function () { window.location.reload(); }, 0);
				}, { once: true });
			}
		}

		return config;
	}

	window.PersonaAssistantHistory = {
		decorateConfig: decorateConfig,
		safeState: safeState
	};
})();
