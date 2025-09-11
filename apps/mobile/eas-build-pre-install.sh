#!/usr/bin/env bash
set -euo pipefail
echo "[pre-install] Updating CocoaPods specs repo..."
if command -v pod >/dev/null 2>&1; then
  pod repo update
else
  echo "CocoaPods not found; skipping pod repo update"
fi

