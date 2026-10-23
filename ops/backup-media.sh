#!/usr/bin/env bash
set -euo pipefail

media_root="${MEDIA_ROOT:-/var/lib/lingolive/media}"
environment_file="${BACKUP_ENV_FILE:-/etc/lingolive/backup.env}"
lock_file="/run/lock/lingolive-media-backup.lock"

if [[ -r "$environment_file" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$environment_file"
  set +a
fi

if [[ ! -d "$media_root" ]]; then
  echo "Media directory does not exist: $media_root" >&2
  exit 1
fi

: "${RESTIC_REPOSITORY:?Set RESTIC_REPOSITORY to storage outside this VPS}"
: "${RESTIC_PASSWORD_FILE:?Set RESTIC_PASSWORD_FILE}"

exec 9>"$lock_file"
flock -n 9 || exit 0

restic backup "$media_root" --tag lingolive-media --one-file-system
restic forget --tag lingolive-media --keep-daily 7 --keep-weekly 5 --keep-monthly 12 --prune
restic check --read-data-subset=2.5%
