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

# Verify the recursive browser asset graph and published-file checksums before staging.
node tools/vendor-persona.mjs --check

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
	--exclude=playground \
	--exclude=tools \
	--exclude='*.zip' \
	--exclude=.DS_Store \
	--exclude='/*-screenshot.*' \
	./ "$STAGE/persona-assistant/"

# Vendor contents already contain only the reachable IIFE/browser runtime. Do not
# exclude hashed chunks: lazy modules can import them transitively.
node tools/vendor-persona.mjs --check "$STAGE/persona-assistant/assets/vendor/persona"

ZIP="$PWD/dist/persona-assistant-$VERSION.zip"
rm -f "$ZIP"
( cd "$STAGE" && zip -qr "$ZIP" persona-assistant )

echo "Built $ZIP"
echo "  plugin size: $(du -sh "$STAGE/persona-assistant" | cut -f1) unpacked, $(du -h "$ZIP" | cut -f1) zipped"
unzip -l "$ZIP" | tail -2
