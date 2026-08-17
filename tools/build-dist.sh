#!/usr/bin/env bash
# Build the distributable plugin zip: dist/persona-assistant-<version>.zip
#
# The zip contains a top-level persona-assistant/ folder (so WordPress installs it
# into the right directory regardless of this repo's folder name) and only the
# runtime files, no dev tooling (node_modules, wp-env config, this script).
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION=$(sed -n 's/.*Version:[[:space:]]*\([0-9.]*\).*/\1/p' persona-assistant.php | head -1)
if [ -z "$VERSION" ]; then
	echo "Could not read the Version header from persona-assistant.php" >&2
	exit 1
fi

STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/persona-assistant" dist
rsync -a \
	--exclude=node_modules \
	--exclude=.git \
	--exclude=.gitignore \
	--exclude=package.json \
	--exclude=package-lock.json \
	--exclude=.wp-env.json \
	--exclude=.wp-env.override.json \
	--exclude=dist \
	--exclude=artifacts \
	--exclude=docs \
	--exclude=wordpress-org-assets \
	--exclude=tools \
	--exclude='*.zip' \
	--exclude=.DS_Store \
	--exclude='/assets/vendor/persona/index.js' \
	--exclude='/assets/vendor/persona/theme-editor.js' \
	--exclude='/assets/vendor/persona/theme-editor-preview.js' \
	--exclude='/assets/vendor/persona/theme-reference.js' \
	--exclude='/assets/vendor/persona/codegen.js' \
	--exclude='/assets/vendor/persona/smart-dom-reader.js' \
	--exclude='/assets/vendor/persona/plugin-kit.js' \
	--exclude='/assets/vendor/persona/testing.js' \
	--exclude='/assets/vendor/persona/voice-worklet-player.js' \
	--exclude='/assets/vendor/persona/chunk-*.js' \
	--exclude='/assets/vendor/persona/*-[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9].js' \
	./ "$STAGE/persona-assistant/"

# The Persona excludes above drop roughly 1.4 MB of the bundled npm dist/ that
# no browser ever requests: the ESM build (index.js) with its hashed chunks, and
# the theme-editor/codegen tooling. Only the IIFE path is reachable: the plugin
# enqueues install.global.js (or, on the full-screen assistant, index.global.js
# and widget.css directly); the installer loads widget.css, launcher.global.js,
# and index.global.js, and index.global.js resolves its lazy siblings by
# rewriting its own URL (markdown-parsers.js, context-mentions.js,
# context-mentions-inline.js, runtype-tts.js, webmcp-polyfill.js,
# history-view.js, event-stream-view.js).
#
# Re-derive the list when the bundled Persona version changes. The guard below
# is the safety net: a missing reachable asset is a runtime 404, not a build
# error, so fail loudly here instead of shipping a broken widget.
VENDOR="$STAGE/persona-assistant/assets/vendor/persona"
MISSING=""
for asset in install.global.js widget.css launcher.global.js index.global.js \
	markdown-parsers.js context-mentions.js context-mentions-inline.js \
	runtype-tts.js webmcp-polyfill.js history-view.js event-stream-view.js; do
	[ -f "$VENDOR/$asset" ] || MISSING="$MISSING $asset"
done
if [ -n "$MISSING" ]; then
	echo "Build aborted: excluded a Persona asset the browser loads at runtime:$MISSING" >&2
	exit 1
fi

ZIP="$PWD/dist/persona-assistant-$VERSION.zip"
rm -f "$ZIP"
( cd "$STAGE" && zip -qr "$ZIP" persona-assistant )

echo "Built $ZIP"
echo "  plugin size: $(du -sh "$STAGE/persona-assistant" | cut -f1) unpacked, $(du -h "$ZIP" | cut -f1) zipped"
unzip -l "$ZIP" | tail -2
