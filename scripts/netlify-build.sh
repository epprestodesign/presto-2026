#!/usr/bin/env bash
# Build both clickable prototypes into one publish directory for Netlify.
#
#   dist-netlify/prototype/         booking journey (desktop + responsive)
#   dist-netlify/prototype-mobile/  device-frame showcase, embeds the above
#
# This mirrors the "Build prototype" steps in .github/workflows/deploy.yml —
# the difference is the base path. GitHub Pages serves the repo under
# /presto-2026/, Netlify serves it at the domain root, so the bases here are
# /prototype/ and /prototype-mobile/. Storybook itself is NOT built here; it
# stays on GitHub Pages.
#
# The prototype folders have no dependencies of their own — vue/quasar/vite all
# resolve up the tree to the repo's node_modules (installed by Netlify before
# this runs). A bare `vite` isn't on PATH inside them, so we invoke the root
# binary directly, exactly like the package.json scripts do.
set -euo pipefail

VITE="../node_modules/vite/bin/vite.js"

rm -rf dist-netlify
mkdir -p dist-netlify

(cd prototype && node "$VITE" build --base=/prototype/)
(cd prototype-mobile && node "$VITE" build --base=/prototype-mobile/)

cp -r prototype/dist dist-netlify/prototype
cp -r prototype-mobile/dist dist-netlify/prototype-mobile
