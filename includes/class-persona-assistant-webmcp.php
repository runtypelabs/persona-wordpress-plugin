<?php
/**
 * Page tools (WebMCP): the tool manifest and the REST execution route.
 *
 * When the feature is on (Runtype mode only), the front-end registration script
 * publishes each manifest tool on `document.modelContext`; the Persona widget
 * snapshots that registry at the start of every chat turn and, for a tool call,
 * shows the visitor a native approval bubble before invoking it. Server-side
 * tools run through the same-origin REST route below; the `get_current_page`
 * tool is answered entirely in the browser from localized data.
 *
 * Security model (defence in depth): the route fails closed when the feature is
 * off or the mode is not Runtype; it requires the `wp_rest` cookie nonce; it
 * re-checks each tool's own permission at execute time (an Ability's permission
 * callback, or public-read for the built-ins); it validates input (built-ins by
 * hand, Abilities via the Abilities API's own schema validation); and it applies
 * a per-visitor, per-minute rate limit. Runtype additionally only admits WebMCP
 * tools when the chat surface opts in (dashboard Surface → WebMCP tab).
 *
 * @package Persona_Assistant
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * WebMCP controller: manifest builder + execution route.
 */
class Persona_Assistant_WebMCP {

	/** REST route (under Persona_Assistant_REST::NAMESPACE) for tool execution. */
	const EXECUTE_ROUTE = '/webmcp/execute';

	/** Default per-visitor, per-minute execution limit (filterable, hard-capped). */
	const DEFAULT_RATE_LIMIT = 30;

	/** Max post-content length (characters) returned by get_post. */
	const CONTENT_LIMIT = 5000;

	/** Max rows any listing/search tool returns. */
	const MAX_RESULTS = 10;

	/**
	 * Register hooks.
	 */
	public function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register the execution route.
	 *
	 * The route is always registered; the permission gate below is what fails
	 * closed when the feature is off, so a stale front end cannot reach a live
	 * handler.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			Persona_Assistant_REST::NAMESPACE,
			self::EXECUTE_ROUTE,
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'handle_execute' ),
				'permission_callback' => array( $this, 'permission' ),
				'args'                => array(
					'tool' => array(
						'required' => true,
						'type'     => 'string',
					),
					'args' => array(
						'required' => false,
						'type'     => 'object',
					),
				),
			)
		);
	}

	/**
	 * Permission gate: fail closed unless the feature is live, then verify the
	 * `wp_rest` cookie nonce (the CSRF control for a same-origin fetch).
	 *
	 * Per-tool permission is re-checked inside the handler, once the tool is
	 * known. This gate only proves the request is a legitimate same-origin call
	 * to a live feature.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return true|WP_Error
	 */
	public function permission( $request ) {
		if ( ! persona_assistant_webmcp_active() ) {
			return new WP_Error(
				'persona_assistant_webmcp_disabled',
				__( 'Page tools are not available.', 'persona-assistant' ),
				array( 'status' => 403 )
			);
		}

		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
			return new WP_Error(
				'persona_assistant_webmcp_nonce',
				__( 'Your session could not be verified. Reload the page and try again.', 'persona-assistant' ),
				array( 'status' => 403 )
			);
		}

		return true;
	}

	/**
	 * Execute a tool call: rate-limit, resolve the tool, run it, return plain data.
	 *
	 * @param WP_REST_Request $request Request.
	 * @return WP_REST_Response { ok: true, result } or { ok: false, error }.
	 */
	public function handle_execute( $request ) {
		$rate = $this->rate_limit_guard();
		if ( is_wp_error( $rate ) ) {
			return $this->error_response( $rate );
		}

		$tool = (string) $request->get_param( 'tool' );
		$args = $request->get_param( 'args' );
		$args = is_array( $args ) ? $args : array();

		$manifest = self::build_manifest();
		$entry    = null;
		foreach ( $manifest as $candidate ) {
			if ( isset( $candidate['name'] ) && $candidate['name'] === $tool ) {
				$entry = $candidate;
				break;
			}
		}

		if ( null === $entry ) {
			return $this->error_response(
				new WP_Error(
					'persona_assistant_webmcp_unknown_tool',
					__( 'Unknown tool.', 'persona-assistant' ),
					array( 'status' => 404 )
				)
			);
		}

		// The current-page tool is answered in the browser; it never has a
		// server-side implementation, so reject it here rather than 500 later.
		if ( ! empty( $entry['clientSide'] ) ) {
			return $this->error_response(
				new WP_Error(
					'persona_assistant_webmcp_client_tool',
					__( 'This tool is answered in the browser and has no server action.', 'persona-assistant' ),
					array( 'status' => 400 )
				)
			);
		}

		if ( ! empty( $entry['ability'] ) ) {
			$result = $this->execute_ability( (string) $entry['ability'], $args );
		} else {
			$result = $this->execute_builtin( $tool, $args );
		}

		if ( is_wp_error( $result ) ) {
			return $this->error_response( $result );
		}

		return new WP_REST_Response(
			array(
				'ok'     => true,
				'result' => $result,
			),
			200
		);
	}

	/**
	 * Per-visitor, per-minute rate limit, mirroring the WP-AI throttle.
	 *
	 * @return true|WP_Error
	 */
	private function rate_limit_guard() {
		/**
		 * Filter the WebMCP per-visitor, per-minute tool-execution limit.
		 *
		 * The resolved value is always hard-capped to 1-120 after filtering.
		 *
		 * @param int $limit Configured (or default) executions per visitor per minute.
		 */
		$limit = (int) apply_filters( 'persona_assistant_webmcp_rate_limit', self::DEFAULT_RATE_LIMIT );
		$limit = min( 120, max( 1, $limit ) );

		if ( is_user_logged_in() ) {
			$identity = 'user:' . get_current_user_id();
		} else {
			$remote_address = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'anonymous';
			$identity       = 'ip:' . $remote_address;
		}

		$bucket = (string) floor( time() / MINUTE_IN_SECONDS );
		$key    = 'persona_assistant_webmcp_rate_' . substr( hash( 'sha256', $identity . ':' . $bucket ), 0, 32 );
		$count  = (int) get_transient( $key );
		if ( $count >= $limit ) {
			return new WP_Error(
				'persona_assistant_webmcp_rate_limited',
				__( 'Too many tool requests. Please wait a minute and try again.', 'persona-assistant' ),
				array( 'status' => 429 )
			);
		}

		set_transient( $key, $count + 1, 2 * MINUTE_IN_SECONDS );
		return true;
	}

	/* ---------------------------------------------------------------------
	 * Manifest
	 * ------------------------------------------------------------------- */

	/**
	 * Build the tool manifest for the current visitor.
	 *
	 * Each entry is `{ name, title, description, inputSchema, clientSide?,
	 * ability? }`: `clientSide` marks the browser-only current-page tool, and
	 * `ability` carries the ORIGINAL (un-munged) Abilities API name so execution
	 * never depends on reversing the WebMCP-safe name.
	 *
	 * @return array<int,array<string,mixed>>
	 */
	public static function build_manifest() {
		$tools = self::builtin_tools();

		// Demo mode advertises ONLY browser-answered tools (get_current_page):
		// the demo plane's page scenario needs a client tool to round-trip, but
		// a scripted demo must never be able to reach the server execute route
		// (whose permission gate is closed in demo mode anyway) — so server
		// built-ins and Abilities are excluded from the manifest outright.
		if ( 'demo' === persona_assistant_resolve_mode() ) {
			$demo_tools = array();
			foreach ( $tools as $tool ) {
				if ( ! empty( $tool['clientSide'] ) ) {
					$demo_tools[] = $tool;
				}
			}
			$demo_tools = apply_filters( 'persona_assistant_webmcp_tools', $demo_tools );
			return is_array( $demo_tools ) ? array_values( $demo_tools ) : array();
		}

		if ( persona_assistant_webmcp_abilities_enabled() ) {
			$used = array();
			foreach ( $tools as $tool ) {
				$used[ $tool['name'] ] = true;
			}
			foreach ( self::ability_tools( $used ) as $tool ) {
				$tools[] = $tool;
			}
		}

		/**
		 * Filter the final WebMCP tool manifest.
		 *
		 * Remove or amend entries here. Each entry is `{ name, title, description,
		 * inputSchema, clientSide?, ability? }`. An entry's `name` is what the
		 * browser registers and what the execute route dispatches on, so renaming
		 * a built-in also requires handling the new name.
		 *
		 * @param array<int,array<string,mixed>> $tools The composed manifest.
		 */
		$tools = apply_filters( 'persona_assistant_webmcp_tools', $tools );

		return is_array( $tools ) ? array_values( $tools ) : array();
	}

	/**
	 * The read-only built-in tools, always present when the feature is on.
	 *
	 * @return array<int,array<string,mixed>>
	 */
	private static function builtin_tools() {
		return array(
			array(
				'name'        => 'search_posts',
				'readOnly'    => true,
				'title'       => __( 'Search posts', 'persona-assistant' ),
				'description' => __( 'Full-text search of published posts on this site. Returns up to ten matches with id, title, excerpt, url, and date.', 'persona-assistant' ),
				'inputSchema' => array(
					'type'       => 'object',
					'properties' => array(
						'query' => array(
							'type'        => 'string',
							'description' => __( 'Free-text search query.', 'persona-assistant' ),
						),
						'limit' => array(
							'type'        => 'integer',
							'minimum'     => 1,
							'maximum'     => self::MAX_RESULTS,
							'description' => __( 'Maximum results to return (1-10).', 'persona-assistant' ),
						),
					),
					'required'   => array( 'query' ),
				),
			),
			array(
				'name'        => 'get_post',
				'readOnly'    => true,
				'title'       => __( 'Get post', 'persona-assistant' ),
				'description' => __( 'Fetch one published post by numeric id or slug. Returns title, url, date, author, and the plain-text content.', 'persona-assistant' ),
				'inputSchema' => array(
					'type'       => 'object',
					'properties' => array(
						'id'   => array(
							'type'        => 'integer',
							'description' => __( 'Numeric post id.', 'persona-assistant' ),
						),
						'slug' => array(
							'type'        => 'string',
							'description' => __( 'Post slug (used when no id is given).', 'persona-assistant' ),
						),
					),
				),
			),
			array(
				'name'        => 'list_terms',
				'readOnly'    => true,
				'title'       => __( 'List categories or tags', 'persona-assistant' ),
				'description' => __( 'List the site\'s categories or tags. Returns name, slug, post count, and archive url.', 'persona-assistant' ),
				'inputSchema' => array(
					'type'       => 'object',
					'properties' => array(
						'taxonomy' => array(
							'type'        => 'string',
							'enum'        => array( 'category', 'post_tag' ),
							'description' => __( 'Which taxonomy to list: "category" or "post_tag".', 'persona-assistant' ),
						),
					),
					'required'   => array( 'taxonomy' ),
				),
			),
			array(
				'name'        => 'get_current_page',
				'readOnly'    => true,
				'title'       => __( 'Get current page', 'persona-assistant' ),
				'description' => __( 'Return details about the page the visitor is currently viewing: its url and title, plus the id, type, and excerpt when it is a single post or page.', 'persona-assistant' ),
				'inputSchema' => array(
					'type'       => 'object',
					'properties' => array(),
				),
				'clientSide'  => true,
			),
		);
	}

	/**
	 * Map every registered Ability whose permission check passes for the current
	 * user into a manifest entry, skipping any whose WebMCP-safe name would
	 * collide with an already-used name (built-ins are never shadowed).
	 *
	 * @param array<string,bool> $used Names already claimed (built-ins first).
	 * @return array<int,array<string,mixed>>
	 */
	private static function ability_tools( $used ) {
		$tools     = array();
		$abilities = call_user_func( 'wp_get_abilities' );
		if ( ! is_array( $abilities ) ) {
			return $tools;
		}

		foreach ( $abilities as $ability ) {
			if ( ! ( $ability instanceof WP_Ability ) ) {
				continue;
			}

			// Manifest-time permission gate: include only abilities this visitor
			// may run. Permission callbacks are third-party code, so a thrown
			// error is treated as "no" (fail closed).
			try {
				$allowed = $ability->check_permissions();
			} catch ( \Throwable $e ) {
				$allowed = false;
			}
			if ( true !== $allowed ) {
				continue;
			}

			$original = $ability->get_name();
			$name     = self::sanitize_tool_name( $original );
			if ( '' === $name || isset( $used[ $name ] ) ) {
				continue;
			}
			$used[ $name ] = true;

			$schema = $ability->get_input_schema();
			if ( empty( $schema ) || ! is_array( $schema ) ) {
				// WebMCP needs an object schema; an Ability with no input schema
				// takes no arguments (execute() is called with null input).
				$schema = array(
					'type'       => 'object',
					'properties' => array(),
				);
			}

			$label = $ability->get_label();

			$tools[] = array(
				'name'        => $name,
				'title'       => '' !== $label ? $label : $original,
				'description' => $ability->get_description(),
				'inputSchema' => $schema,
				'ability'     => $original,
			);
		}

		return $tools;
	}

	/**
	 * Convert an Ability name (e.g. `my-plugin/do-thing`) into a WebMCP-safe tool
	 * name: only `[A-Za-z0-9_-]` survive, everything else becomes `_`.
	 *
	 * @param string $name Original ability name.
	 * @return string
	 */
	private static function sanitize_tool_name( $name ) {
		$name = preg_replace( '/[^A-Za-z0-9_-]/', '_', (string) $name );
		return trim( (string) $name, '_' );
	}

	/* ---------------------------------------------------------------------
	 * Front-end localization
	 * ------------------------------------------------------------------- */

	/**
	 * The data localized to the registration script (front end only).
	 *
	 * Only browser-relevant fields are exposed: the internal `ability` mapping
	 * stays server-side (the execute route re-derives it from the manifest).
	 *
	 * @return array<string,mixed>
	 */
	public static function localized_data() {
		$tools = array();
		foreach ( self::build_manifest() as $tool ) {
			$schema = isset( $tool['inputSchema'] ) && is_array( $tool['inputSchema'] ) ? $tool['inputSchema'] : array( 'type' => 'object' );
			// An empty `properties` must reach the browser as `{}`; an empty PHP
			// array would JSON-encode as `[]`, which is not a valid schema node.
			if ( isset( $schema['properties'] ) && is_array( $schema['properties'] ) && empty( $schema['properties'] ) ) {
				$schema['properties'] = (object) array();
			}
			$tools[] = array(
				'name'        => (string) $tool['name'],
				'title'       => isset( $tool['title'] ) ? (string) $tool['title'] : (string) $tool['name'],
				'description' => isset( $tool['description'] ) ? (string) $tool['description'] : '',
				'inputSchema' => $schema,
				'clientSide'  => ! empty( $tool['clientSide'] ),
				// Only built-ins assert read-only; Abilities are third-party code
				// and must not be advertised to the agent as side-effect free.
				'readOnly'    => ! empty( $tool['readOnly'] ),
			);
		}

		return array(
			'tools'       => $tools,
			'executeUrl'  => esc_url_raw( rest_url( Persona_Assistant_REST::NAMESPACE . self::EXECUTE_ROUTE ) ),
			'nonce'       => wp_create_nonce( 'wp_rest' ),
			'currentPage' => self::current_page_context(),
			// The widget's standalone webmcp-polyfill chunk, published next to
			// the installer. The registration script imports it eagerly so
			// document.modelContext exists before the first chat turn (the
			// widget itself only installs it lazily on that turn).
			'polyfillUrl' => esc_url_raw( dirname( PERSONA_ASSISTANT_INSTALL_URL ) . '/webmcp-polyfill.js' ),
		);
	}

	/**
	 * The context answered by the browser-only `get_current_page` tool.
	 *
	 * @return array<string,mixed>
	 */
	private static function current_page_context() {
		$context = array(
			'url'        => '',
			'title'      => (string) wp_get_document_title(),
			'isSingular' => false,
		);

		if ( is_singular() ) {
			$object = get_queried_object();
			if ( $object instanceof WP_Post ) {
				$context['isSingular'] = true;
				$context['id']         = (int) $object->ID;
				$context['type']       = (string) $object->post_type;
				$context['title']      = (string) get_the_title( $object );
				$context['url']        = (string) get_permalink( $object );
				$context['excerpt']    = (string) wp_strip_all_tags( get_the_excerpt( $object ) );
			}
		}

		if ( '' === $context['url'] ) {
			// Coarse but always correct-origin fallback for non-singular views; the
			// registration script overrides this with the live window.location.href.
			$context['url'] = (string) home_url( '/' );
		}

		return $context;
	}

	/* ---------------------------------------------------------------------
	 * Execution
	 * ------------------------------------------------------------------- */

	/**
	 * Execute an Ability by its original name.
	 *
	 * WP_Ability::execute() validates the input against the ability's schema,
	 * re-runs its permission check, executes, and validates the output, so this
	 * is the single trusted entry point. Abilities with no input schema take no
	 * arguments and are executed with null input.
	 *
	 * @param string              $original Original ability name.
	 * @param array<string,mixed> $args     Raw tool arguments.
	 * @return mixed|WP_Error
	 */
	private function execute_ability( $original, $args ) {
		if ( ! function_exists( 'wp_get_ability' ) ) {
			return new WP_Error( 'persona_assistant_webmcp_no_abilities', __( 'The Abilities API is not available.', 'persona-assistant' ), array( 'status' => 404 ) );
		}

		$ability = call_user_func( 'wp_get_ability', $original );
		if ( ! ( $ability instanceof WP_Ability ) ) {
			return new WP_Error( 'persona_assistant_webmcp_unknown_tool', __( 'Unknown tool.', 'persona-assistant' ), array( 'status' => 404 ) );
		}

		$schema = $ability->get_input_schema();
		$input  = ( empty( $schema ) || ! is_array( $schema ) ) ? null : $args;

		$result = $ability->execute( $input );
		if ( is_wp_error( $result ) ) {
			// Give the permission failure a 403 so the client can distinguish it.
			$data   = $result->get_error_data();
			$status = ( is_array( $data ) && isset( $data['status'] ) ) ? (int) $data['status'] : 400;
			if ( 'ability_invalid_permissions' === $result->get_error_code() ) {
				$status = 403;
			}
			return new WP_Error( $result->get_error_code(), $result->get_error_message(), array( 'status' => $status ) );
		}

		return $result;
	}

	/**
	 * Dispatch a built-in tool.
	 *
	 * @param string              $tool Tool name.
	 * @param array<string,mixed> $args Raw tool arguments.
	 * @return mixed|WP_Error
	 */
	private function execute_builtin( $tool, $args ) {
		switch ( $tool ) {
			case 'search_posts':
				return $this->tool_search_posts( $args );
			case 'get_post':
				return $this->tool_get_post( $args );
			case 'list_terms':
				return $this->tool_list_terms( $args );
			default:
				return new WP_Error( 'persona_assistant_webmcp_unknown_tool', __( 'Unknown tool.', 'persona-assistant' ), array( 'status' => 404 ) );
		}
	}

	/**
	 * search_posts: full-text search of published posts.
	 *
	 * @param array<string,mixed> $args Arguments.
	 * @return array<string,mixed>|WP_Error
	 */
	private function tool_search_posts( $args ) {
		$query = isset( $args['query'] ) ? sanitize_text_field( (string) $args['query'] ) : '';
		if ( '' === $query ) {
			return new WP_Error( 'persona_assistant_webmcp_bad_input', __( 'A search query is required.', 'persona-assistant' ), array( 'status' => 400 ) );
		}

		$limit = isset( $args['limit'] ) ? (int) $args['limit'] : self::MAX_RESULTS;
		$limit = min( self::MAX_RESULTS, max( 1, $limit ) );

		$found = new WP_Query(
			array(
				's'                   => $query,
				'post_type'           => 'post',
				'post_status'         => 'publish',
				'posts_per_page'      => $limit,
				'ignore_sticky_posts' => true,
				'no_found_rows'       => true,
			)
		);

		$results = array();
		foreach ( $found->posts as $post ) {
			$results[] = array(
				'id'      => (int) $post->ID,
				'title'   => (string) get_the_title( $post ),
				'excerpt' => (string) wp_strip_all_tags( get_the_excerpt( $post ) ),
				'url'     => (string) get_permalink( $post ),
				'date'    => (string) get_post_time( 'c', true, $post ),
			);
		}

		return array(
			'query'   => $query,
			'count'   => count( $results ),
			'results' => $results,
		);
	}

	/**
	 * get_post: fetch one published post by id or slug.
	 *
	 * @param array<string,mixed> $args Arguments.
	 * @return array<string,mixed>|WP_Error
	 */
	private function tool_get_post( $args ) {
		$post = null;

		$id = isset( $args['id'] ) ? (int) $args['id'] : 0;
		if ( $id > 0 ) {
			$candidate = get_post( $id );
			if ( $candidate instanceof WP_Post ) {
				$post = $candidate;
			}
		}

		if ( null === $post ) {
			$slug = isset( $args['slug'] ) ? sanitize_title( (string) $args['slug'] ) : '';
			if ( '' !== $slug ) {
				$found = get_posts(
					array(
						'name'        => $slug,
						'post_type'   => 'post',
						'post_status' => 'publish',
						'numberposts' => 1,
					)
				);
				if ( ! empty( $found ) ) {
					$post = $found[0];
				}
			}
		}

		if ( ! ( $post instanceof WP_Post ) || 'publish' !== $post->post_status ) {
			return new WP_Error( 'persona_assistant_webmcp_not_found', __( 'No published post matched.', 'persona-assistant' ), array( 'status' => 404 ) );
		}

		// Password-protected posts keep `publish` status; the password gate lives
		// in the template loop, not the `the_content` filter, so check it here.
		if ( post_password_required( $post ) ) {
			return new WP_Error( 'persona_assistant_webmcp_protected', __( 'This post is password protected.', 'persona-assistant' ), array( 'status' => 403 ) );
		}

		$content = wp_strip_all_tags( (string) apply_filters( 'the_content', $post->post_content ) ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- Core content rendering filter.
		if ( strlen( $content ) > self::CONTENT_LIMIT ) {
			$content = mb_substr( $content, 0, self::CONTENT_LIMIT ) . '…';
		}

		$author = get_the_author_meta( 'display_name', (int) $post->post_author );

		return array(
			'id'      => (int) $post->ID,
			'title'   => (string) get_the_title( $post ),
			'url'     => (string) get_permalink( $post ),
			'date'    => (string) get_post_time( 'c', true, $post ),
			'author'  => (string) $author,
			'content' => $content,
		);
	}

	/**
	 * list_terms: list categories or tags.
	 *
	 * @param array<string,mixed> $args Arguments.
	 * @return array<string,mixed>|WP_Error
	 */
	private function tool_list_terms( $args ) {
		$taxonomy = isset( $args['taxonomy'] ) ? sanitize_key( (string) $args['taxonomy'] ) : '';
		if ( ! in_array( $taxonomy, array( 'category', 'post_tag' ), true ) ) {
			return new WP_Error( 'persona_assistant_webmcp_bad_input', __( 'Taxonomy must be "category" or "post_tag".', 'persona-assistant' ), array( 'status' => 400 ) );
		}

		$terms = get_terms(
			array(
				'taxonomy'   => $taxonomy,
				'hide_empty' => true,
				'number'     => 100,
			)
		);
		if ( is_wp_error( $terms ) ) {
			return new WP_Error( 'persona_assistant_webmcp_terms_error', $terms->get_error_message(), array( 'status' => 500 ) );
		}

		$results = array();
		foreach ( (array) $terms as $term ) {
			if ( ! ( $term instanceof WP_Term ) ) {
				continue;
			}
			$link      = get_term_link( $term );
			$results[] = array(
				'name'  => (string) $term->name,
				'slug'  => (string) $term->slug,
				'count' => (int) $term->count,
				'url'   => is_wp_error( $link ) ? '' : (string) $link,
			);
		}

		return array(
			'taxonomy' => $taxonomy,
			'count'    => count( $results ),
			'terms'    => $results,
		);
	}

	/* ---------------------------------------------------------------------
	 * Helpers
	 * ------------------------------------------------------------------- */

	/**
	 * Build a `{ ok: false, error }` response with the status carried on the error.
	 *
	 * @param WP_Error $error Error.
	 * @return WP_REST_Response
	 */
	private function error_response( WP_Error $error ) {
		$data   = $error->get_error_data();
		$status = ( is_array( $data ) && isset( $data['status'] ) ) ? (int) $data['status'] : 400;
		return new WP_REST_Response(
			array(
				'ok'    => false,
				'error' => $error->get_error_message(),
			),
			$status
		);
	}
}
