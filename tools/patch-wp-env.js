#!/usr/bin/env node
/**
 * Postinstall shim: makes @wordpress/env work with simple-git 4.
 *
 * simple-git 4 (forced via package.json "overrides" to clear GHSA advisories on
 * simple-git <4.0.1 / @simple-git/argv-parser <2.0.1) no longer exports a
 * callable CommonJS default, but @wordpress/env still does
 * `const SimpleGit = require( 'simple-git' ); SimpleGit( {...} )`.
 * Rewrite those requires to the named `simpleGit` export.
 *
 * Remove this script, the postinstall hook and the simple-git overrides once
 * @wordpress/env depends on simple-git ^4 itself.
 */
'use strict';
const fs = require( 'fs' );
const path = require( 'path' );

const FROM = "const SimpleGit = require( 'simple-git' );";
const TO = "const { simpleGit: SimpleGit } = require( 'simple-git' );";
const FILES = [ 'lib/download-sources.js', 'lib/runtime/docker/download-wp-phpunit.js' ];

let root;
try {
	root = path.dirname( require.resolve( '@wordpress/env/package.json' ) );
} catch {
	process.exit( 0 ); // Not installed (e.g. --omit=dev); nothing to patch.
}

for ( const rel of FILES ) {
	const file = path.join( root, rel );
	const src = fs.readFileSync( file, 'utf8' );
	if ( src.includes( TO ) ) {
		continue;
	}
	if ( ! src.includes( FROM ) ) {
		console.error( `patch-wp-env: expected simple-git require not found in ${ rel }; check whether @wordpress/env changed and this shim is still needed.` );
		process.exit( 1 );
	}
	fs.writeFileSync( file, src.replace( FROM, TO ) );
	console.log( `patch-wp-env: patched ${ rel } for simple-git 4` );
}
