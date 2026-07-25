#!/usr/bin/env bash
set -euo pipefail
npm run research:validate
npm test
npm run build
