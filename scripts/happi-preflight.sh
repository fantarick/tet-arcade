#!/usr/bin/env bash
# Read-only, sanitized environment assessment for TET Arcade on Happi.
# Do not collect host addresses, credentials, usernames, home paths or private configuration.
set -u

printf '%s\n' 'TET Arcade / Happi read-only preflight'
printf '%s\n' 'No changes to packages, host services, network, or repository.'

printf 'Architecture: '
uname -m 2>/dev/null || printf '%s\n' 'unavailable'

for tool in git node npm python3; do
  if command -v "$tool" >/dev/null 2>&1; then
    case "$tool" in
      git) version=$(git --version 2>/dev/null) ;;
      node) version=$(node --version 2>/dev/null) ;;
      npm) version=$(npm --version 2>/dev/null) ;;
      python3) version=$(python3 --version 2>/dev/null) ;;
    esac
    printf '%s: %s\n' "$tool" "$version"
  else
    printf '%s: not on PATH\n' "$tool"
  fi
done

if command -v codex >/dev/null 2>&1; then
  printf 'Codex CLI: %s\n' "$(codex --version 2>/dev/null || printf 'version unavailable')"
elif [ -x /opt/codex/0.154.0/bin/codex ]; then
  printf 'Codex CLI (known local installation): %s\n' "$(/opt/codex/0.154.0/bin/codex --version 2>/dev/null || printf 'version unavailable')"
else
  printf '%s\n' 'Codex CLI: not found on PATH or previously documented installation'
fi

if [ -r /proc/meminfo ]; then
  awk '/^MemAvailable:/ { printf "Available RAM: %.2f GiB\n", $2/1048576; found=1; exit } END { if (!found) print "Available RAM: unknown" }' /proc/meminfo
else
  printf '%s\n' 'Available RAM: /proc/meminfo not available'
fi

if command -v df >/dev/null 2>&1; then
  df -Pk . 2>/dev/null | awk 'NR==2 { printf "Free space for current working directory: %.2f GiB\n", $4/1048576; found=1 } END { if (!found) print "Disk availability: unknown" }'
fi

if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  printf '%s\n' 'Git worktree: available'
  changed=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  printf 'Tracked/untracked changes: %s\n' "$changed"
else
  printf '%s\n' 'Git worktree: not detected'
fi

printf '%s\n' 'Preflight complete; no changes made by this script.'
