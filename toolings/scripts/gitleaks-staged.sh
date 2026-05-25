#!/usr/bin/env sh
set -eu

if [ "${SKIP_GITLEAKS:-}" = "1" ]; then
  echo "warning: SKIP_GITLEAKS=1 — staged secret scan skipped (emergency only)" >&2
  exit 0
fi

if ! command -v gitleaks >/dev/null 2>&1; then
  echo "gitleaks is required for pre-commit secret scanning."
  echo "Install: https://github.com/gitleaks/gitleaks#installing"
  echo "  Arch:   sudo pacman -S gitleaks"
  echo "  macOS:  brew install gitleaks"
  echo "  Other:  see releases page or 'bun run secret-scan' after install"
  exit 1
fi

gitleaks protect --staged --redact --config .gitleaks.toml
