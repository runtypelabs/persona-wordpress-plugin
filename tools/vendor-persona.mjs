#!/usr/bin/env node
// Vendor the published browser runtime, including lazy modules and their imports.
// Update: node tools/vendor-persona.mjs --from /path/to/unpacked/npm/package
// Verify: node tools/vendor-persona.mjs --check [path/to/vendor/persona]
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'assets/vendor/persona');
const version = readFileSync(path.join(root, 'persona-assistant.php'), 'utf8')
	.match(/PERSONA_ASSISTANT_PERSONA_VERSION',\s*'([^']+)'/)[1];
const entries = ['install.global.js', 'index.global.js', 'launcher.global.js', 'widget.css'];
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

function graph(directory) {
	const visited = new Set();
	const pending = [...entries];
	while (pending.length) {
		const name = pending.pop();
		if (visited.has(name)) continue;
		if (name.startsWith('../') || path.isAbsolute(name)) throw new Error(`Unsafe asset path: ${name}`);
		const source = readFileSync(path.join(directory, name), 'utf8');
		visited.add(name);
		// Includes import("./chunk.js"), URL-rewriting lazy loaders ("module.js"),
		// and the installer's template URLs (`${base}/index.global.js`). Keeping
		// all local JS/CSS string references is deliberately conservative.
		for (const match of source.matchAll(/["'`]([^"'`\n]*?\.(?:js|css))(?:\?[^"'`\n]*)?["'`]/g)) {
			let reference = match[1];
			if (/^(?:[a-z]+:|\/\/|@)/i.test(reference)) continue;
			if (reference.includes('${')) {
				if (!/^\$\{[^}]+\}\//.test(reference)) throw new Error(`Unknown asset expression in ${name}: ${reference}`);
				reference = reference.replace(/^\$\{[^}]+\}\//, '');
			}
			pending.push(path.posix.normalize(path.posix.join(path.posix.dirname(name), reference)));
		}
	}
	return [...visited].sort();
}

function check(directory) {
	const manifest = JSON.parse(readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
	if (manifest.package !== '@runtypelabs/persona' || manifest.version !== version) {
		throw new Error(`Vendor manifest must match @runtypelabs/persona@${version}`);
	}
	const reachable = [...graph(directory), 'LICENSE'].sort();
	if (JSON.stringify(reachable) !== JSON.stringify(Object.keys(manifest.files).sort())) {
		throw new Error('Vendor manifest does not match the reachable browser asset graph');
	}
	for (const name of reachable) {
		if (digest(readFileSync(path.join(directory, name))) !== manifest.files[name]) {
			throw new Error(`Vendor asset checksum mismatch: ${name}`);
		}
	}
	const inventory = readdirSync(directory).sort();
	if (JSON.stringify(inventory) !== JSON.stringify([...reachable, 'manifest.json'].sort())) {
		throw new Error('Unexpected files in Persona vendor directory; re-vendor the published runtime');
	}
	console.log(`Verified Persona ${version}: ${reachable.length - 1} reachable browser assets and LICENSE`);
}

try {
	const [mode, argument] = process.argv.slice(2);
	if (mode === '--from' && argument) {
		const source = path.resolve(argument);
		const metadata = JSON.parse(readFileSync(path.join(source, 'package.json'), 'utf8'));
		if (metadata.name !== '@runtypelabs/persona' || metadata.version !== version) {
			throw new Error(`Expected published @runtypelabs/persona@${version}`);
		}
		const dist = path.join(source, 'dist');
		const assets = graph(dist);
		// The published package omits its root license; retain the existing MIT notice.
		const license = readFileSync(path.join(destination, 'LICENSE'));
		rmSync(destination, { recursive: true });
		mkdirSync(destination, { recursive: true });
		writeFileSync(path.join(destination, 'LICENSE'), license);
		for (const name of assets) copyFileSync(path.join(dist, name), path.join(destination, name));
		const files = Object.fromEntries([...assets, 'LICENSE'].sort().map((name) => [name, digest(readFileSync(path.join(destination, name)))]));
		writeFileSync(path.join(destination, 'manifest.json'), JSON.stringify({ package: metadata.name, version, files }, null, 2) + '\n');
		check(destination);
	} else if (mode === '--check') {
		check(argument ? path.resolve(argument) : destination);
	} else {
		throw new Error('Usage: node tools/vendor-persona.mjs --from <unpacked-package> | --check [vendor-directory]');
	}
} catch (error) {
	console.error(`Persona vendor check failed: ${error.message}`);
	process.exitCode = 1;
}
