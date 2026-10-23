#!/usr/bin/env bash
set -euo pipefail

media_root="${MEDIA_ROOT:-/var/lib/lingolive/media}"
max_used_percent="${MAX_DISK_USED_PERCENT:-80}"
min_free_gib="${MIN_FREE_GIB:-10}"

read -r total_kib used_kib available_kib used_percent < <(
  df -Pk "$media_root" | awk 'NR==2 {gsub(/%/, "", $5); print $2, $3, $4, $5}'
)

free_gib=$((available_kib / 1024 / 1024))
if (( used_percent >= max_used_percent || free_gib < min_free_gib )); then
  message="LingoLive disk alert: ${used_percent}% used and ${free_gib} GiB free on $(hostname)."
  logger -p daemon.warning -t lingolive-disk "$message"
  echo "$message" >&2
  if [[ -n "${DISK_ALERT_WEBHOOK_URL:-}" ]]; then
    curl --fail --silent --show-error --max-time 15 \
      -H 'Content-Type: application/json' \
      --data "{\"text\":\"$message\"}" \
      "$DISK_ALERT_WEBHOOK_URL" >/dev/null
  fi
  exit 1
fi

echo "Disk healthy: ${used_percent}% used, ${free_gib} GiB free."
