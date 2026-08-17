/**
 * Persona Assistant page tools (WebMCP).
 *
 * Registers each server-composed manifest tool on `document.modelContext` so the
 * Persona widget can offer them during a chat turn. The widget snapshots the
 * registry at the start of every turn and shows the visitor a native approval
 * bubble before any tool runs, so late registration is fine.
 *
 * Timing: the widget defers importing its webmcp-polyfill until the FIRST chat
 * turn, which is after that turn's tool snapshot, so waiting for it would always
 * lose the first message. So we eagerly import the same standalone chunk
 * (served next to the installer; the URL is localized as `polyfillUrl`) so
 * `document.modelContext` exists before the visitor types anything, and keep a
 * two-phase poll (fast, then slow) as the fallback when the import is
 * unavailable. On browsers where only Chrome's native `navigator.modelContext`
 * exists (the pre-May-2026 draft surface) we register there instead. Everything
 * is wrapped in try/catch so a tool-surface failure can never break the host
 * page.
 *
 * Server tools execute over the same-origin REST route (with the `wp_rest`
 * nonce); the `get_current_page` tool is answered locally from localized data.
 */
(function () {
	'use strict';

	var data = window.PersonaAssistantWebMCP || {};
	var tools = data.tools || [];
	if (!tools.length) {
		return;
	}

	// Guard so the two registration surfaces (document + navigator) and the retry
	// loop never double-register the same tool set.
	var registeredOn = [];

	/**
	 * POST a server tool to the REST execute route and normalize the reply into
	 * the WebMCP result envelope the widget expects.
	 */
	function executeServerTool(name, args) {
		return fetch(data.executeUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': data.nonce || ''
			},
			body: JSON.stringify({ tool: name, args: args || {} })
		})
			.then(function (response) {
				return response.json().then(function (body) {
					return { response: response, body: body };
				});
			})
			.then(function (payload) {
				var body = payload.body || {};
				if (!payload.response.ok || !body.ok) {
					var message = body && body.error ? body.error : 'Tool request failed.';
					return {
						content: [{ type: 'text', text: message }],
						isError: true
					};
				}
				return {
					content: [{ type: 'text', text: JSON.stringify(body.result) }],
					structuredContent: body.result
				};
			})
			.catch(function (error) {
				return {
					content: [{ type: 'text', text: 'Tool request failed: ' + (error && error.message ? error.message : 'network error') }],
					isError: true
				};
			});
	}

	/**
	 * Answer the browser-only current-page tool from localized data, preferring
	 * the live window.location.href (accurate even on subdirectory installs and
	 * archive views, where the server can only localize a coarse fallback url).
	 */
	function executeClientTool() {
		var source = data.currentPage || {};
		var page = {};
		for (var key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				page[key] = source[key];
			}
		}
		try {
			if (window.location && window.location.href) {
				page.url = window.location.href;
			}
			if (!page.title && document.title) {
				page.title = document.title;
			}
		} catch (e) {
			// Fall back to the localized values.
		}
		return Promise.resolve({
			content: [{ type: 'text', text: JSON.stringify(page) }],
			structuredContent: page
		});
	}

	/** Build the execute() closure for one manifest tool. */
	function makeExecute(tool) {
		return function (args) {
			try {
				if (tool.clientSide) {
					return executeClientTool();
				}
				return executeServerTool(tool.name, args);
			} catch (e) {
				return Promise.resolve({
					content: [{ type: 'text', text: 'Tool error: ' + (e && e.message ? e.message : 'unexpected error') }],
					isError: true
				});
			}
		};
	}

	/** Register the whole manifest onto one modelContext surface. */
	function registerOn(modelContext) {
		if (!modelContext || typeof modelContext.registerTool !== 'function') {
			return false;
		}
		if (registeredOn.indexOf(modelContext) !== -1) {
			return true;
		}
		try {
			for (var i = 0; i < tools.length; i++) {
				var tool = tools[i];
				var descriptor = {
					name: tool.name,
					title: tool.title || tool.name,
					description: tool.description || '',
					inputSchema: tool.inputSchema || { type: 'object' },
					execute: makeExecute(tool)
				};
				// Only the built-in read-only tools carry the hint; Ability tools
				// may have side effects, so they must not claim to be read-only.
				if (tool.readOnly) {
					descriptor.annotations = { readOnlyHint: true };
				}
				modelContext.registerTool(descriptor);
			}
			registeredOn.push(modelContext);
			return true;
		} catch (e) {
			// A registration failure must never break the page.
			return false;
		}
	}

	/** Register on the best available surface. Returns true once registered. */
	function tryRegister() {
		try {
			// The polyfill aliases navigator.modelContext to this same registry
			// (behind a deprecation warning), so document alone is the whole
			// story once it exists, native document.modelContext included.
			if (document.modelContext) {
				return registerOn(document.modelContext);
			}
		} catch (e) {
			// Ignore and try the navigator surface.
		}
		try {
			// Chrome's native WebMCP developer trial ships only the older
			// navigator surface; register there when document has nothing.
			if (navigator && navigator.modelContext) {
				return registerOn(navigator.modelContext);
			}
		} catch (e) {
			// Ignore; the poll below retries.
		}
		return false;
	}

	/**
	 * Eagerly import the widget's own standalone polyfill chunk so
	 * `document.modelContext` exists before the first chat turn (the widget only
	 * imports it lazily on that turn, after the turn's tool snapshot). The
	 * widget's own install is a no-op once the global exists, and the module is
	 * fetched once either way.
	 */
	function ensurePolyfill() {
		if (document.modelContext || !data.polyfillUrl) {
			return;
		}
		try {
			import(data.polyfillUrl).then(function (mod) {
				try {
					if (!document.modelContext && mod && typeof mod.initializeWebMCPPolyfill === 'function') {
						mod.initializeWebMCPPolyfill();
					}
				} catch (e) {
					// Fall through to the poll.
				}
				tryRegister();
			}).catch(function () {
				// Import blocked/failed: the poll still catches the widget's
				// own lazy install.
			});
		} catch (e) {
			// No dynamic-import support: rely on the poll.
		}
	}

	// Fallback: poll for a surface, every 250ms for the first ~10s (widget +
	// polyfill startup), then every 2s for ~2 minutes (the widget's own lazy
	// install lands on the first chat turn, which can be long after page load).
	// Single scheduled probe at a time; registerOn is idempotent per surface.
	var pollAttempts = 0;
	var pollScheduled = false;
	function pollForSurface() {
		if (pollScheduled || pollAttempts >= 100 || tryRegister()) {
			return;
		}
		pollScheduled = true;
		window.setTimeout(function () {
			pollScheduled = false;
			pollAttempts++;
			pollForSurface();
		}, pollAttempts < 40 ? 250 : 2000);
	}

	// Register immediately if a surface already exists.
	if (tryRegister()) {
		return;
	}
	ensurePolyfill();

	window.addEventListener('persona:chat-ready', function () {
		if (!tryRegister()) {
			ensurePolyfill();
			pollForSurface();
		}
	});

	pollForSurface();
})();
