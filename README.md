# LingoLive

LingoLive is a Vinext/React English-learning application. This branch is prepared for a private Ubuntu VPS deployment with Supabase Auth/Postgres and protected filesystem media.

## Hosting architecture

- **Application:** Docker on Ubuntu Server 24.04 LTS, bound to `127.0.0.1:3000` behind Nginx and HTTPS.
- **Authentication and database:** Supabase Auth and Supabase Postgres.
- **Lesson media and student recordings:** `/var/lib/lingolive/media` on the VPS. This directory is mounted into the application container and is never exposed by Nginx.
- **Authorization:** every media request goes through a server API route. Lesson routes check publication and membership; administration upload and management routes check the administrator on the server; recording routes match the authenticated user ID.
- **Backups:** restic sends encrypted media backups to storage outside the VPS.
- **Capacity monitoring:** a systemd timer checks disk use every 15 minutes and warns at 80% used or less than 10 GiB free.

`controlsList="nodownload"` is only a user-interface hint. Actual protection comes from private storage and server-side authorization. An authorized user can still record or copy a stream; preventing that requires a commercial DRM system.

## Required production variables

Copy `.env.example` to `.env.production` and set the real values. Never commit `.env.production`.

- `DATABASE_URL`: Supabase Postgres connection string, preferably the Supavisor session-pooler connection.
- `DATABASE_SSL=require`
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_EMAIL`: the only account allowed to manage lesson media.
- `MEDIA_ROOT=/var/lib/lingolive/media`
- `MEDIA_CONFIG_ENCRYPTION_KEY`: random 32-byte base64 key used to encrypt provider credentials.
- `APP_ORIGIN`: final HTTPS origin.

## Database setup

```bash
npm ci
npm run db:migrate
```

The generated PostgreSQL migrations are in `supabase/migrations/`. The second migration enables row-level security and revokes browser roles from all application tables. Browser clients use Supabase only for authentication; application data is accessed by the server.

The original D1/R2 production data is **not** migrated automatically. Export the existing database and media, transform the D1 rows into PostgreSQL, copy media keys unchanged into `MEDIA_ROOT`, and compare record/file counts before changing DNS.

## Build and deploy

```bash
sudo install -d -o 10001 -g 10001 -m 0750 /var/lib/lingolive/media
docker compose build
docker compose run --rm app npm run db:migrate
docker compose up -d
docker compose exec app npm run verify:vps
```

Copy `ops/nginx/lingolive.conf` to `/etc/nginx/sites-available/lingolive`, replace `learn.example.com`, enable it, test Nginx, and issue the TLS certificate. Do not add an Nginx alias for the media directory.

## Provider checks

`npm run verify:vps` checks Supabase Postgres, Supabase Auth, media-directory write access, and free disk space. After signing in as the administrator, open **Administration → Media API connections** and use each provider's **Test** action to verify transcription and translation with the encrypted credentials stored by the app.

## Backups and monitoring

Install `restic`, copy the scripts to `/opt/lingolive/ops`, and configure `/etc/lingolive/backup.env` with an off-VPS `RESTIC_REPOSITORY`, `RESTIC_PASSWORD_FILE`, and the credentials required by that repository. Then install and enable the timers:

```bash
sudo install -m 0755 ops/backup-media.sh ops/check-disk.sh /opt/lingolive/ops/
sudo install -m 0644 ops/systemd/* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now lingolive-backup.timer lingolive-disk-check.timer
sudo systemctl start lingolive-backup.service
sudo systemctl status lingolive-backup.service
```

Test a restore into a temporary directory before launch and repeat restore tests regularly. A backup that has never been restored is not considered verified.

## Release checks

```bash
npm run build
npm run lint
npm run verify:vps
```

The last command needs the production environment and is expected to fail on a development machine without Supabase credentials and the VPS media path.
