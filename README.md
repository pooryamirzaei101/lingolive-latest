# EnglishFluento — staged build

This project is a responsive English-learning application. It is being delivered section by section. The desktop interface has a left sidebar and mobile devices use a collapsible menu.

## Working in this release

- Home workspace and navigation to all requested areas; incomplete sections identify themselves clearly.
- Existing free text/audio sample lessons, courses, and device-local completed/saved lesson dashboard.
- Video Lessons categories, published-lesson catalog, video playback with English/Persian timed subtitles, transcript seeking, sentence loop, playback speed, and word pronunciation using browser speech synthesis.
- Owner-only Video Lesson administration: upload MP4/WebM files up to 25 MB, save a manually reviewed timestamped transcript, publish/unpublish, preview, and delete. Videos are stored in R2; lesson metadata is stored in D1.

## Not working yet

Automatic transcription/translation, arbitrary translation languages, word definitions and saved Word Bank, My Collection, cross-device progress, public account creation, quizzes, membership/payments, referrals, and the other requested learning and support sections. Their menu pages are informative placeholders, not completed features. The site remains owner-private until the user requests a different audience.

## Deployment and security

The Sites project ID is in `.openai/hosting.json`. `ADMIN_EMAIL` is a hosting runtime value, not included in the source. Administrative API routes verify the signed-in user's platform-provided email server-side. Media is served from a server route and unpublished drafts require administrator access. D1 migrations are in `drizzle/`; never modify a migration after it has been applied in production.

To develop locally, install with `npm ci`, generate future schema migrations with `npm run db:generate`, and run `npm run build`. Apply pending D1 migrations to a local preview before testing data-backed routes. Browser speech voices and picture-in-picture support vary by device.

## Next build stages

1. Connect a reviewed transcription/translation workflow and the student's language preference, then test a real video supplied by the owner.
2. Build persistent Word Bank and My Collection from the video transcript.
3. Complete Daily Lessons, YouTube, IELTS, Reading, Speaking, Quick Tips, achievements, membership/referrals, support/feedback, settings, and expanded administration in the order specified by the product brief.
