#!/usr/bin/env bash
# One-command recovery after a sandbox reset (node_modules/.next are not persisted).
# npm cache is redirected to /tmp so it never inflates the workspace budget.
set -e
cd "$(dirname "$0")"
npm install --no-audit --no-fund --cache /tmp/npm-cache
npm run build
echo "✓ ready — start with: npm run start"
