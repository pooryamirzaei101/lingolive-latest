# LingoLive — staged build

This project is a responsive English-learning application. It is being delivered section by section. The desktop interface has a left sidebar and mobile devices use a collapsible menu.

## Working in this release

- Home workspace and navigation to all requested areas; incomplete sections identify themselves clearly.
- Folder, sidebar, and home navigation use direct page links so the destination loads even if client-side navigation fails in an embedded browser.
- Account page supports ChatGPT sign-in, learner profile creation, role display, and a saved translation-language preference. The owner email configured as `ADMIN_EMAIL` has the administrator role; ordinary signed-in accounts are students. Sign-out is handled by the Sites sign-in provider. Site audience is still owner-private, so external students require an access-policy change before they can register themselves.
- Existing free text/audio sample lessons, courses, and device-local completed/saved lesson dashboard.
- Video Lessons folders, including Grammar, Tenses, Business English, Daily English, News, and Subjects. Administrators can add nested subcategories (for example, News / War), rename subjects, upload or move videos into a folder, and publish lessons. Renaming a folder preserves its video assignments.
- News has its own sidebar and home link into the News video folder. The administrator folder list now has Open folder links. News includes an original fictional silent clip to make its player and category flow reviewable before the owner publishes actual news videos.
- Published-lesson catalog, video playback with English/Persian timed subtitles, transcript seeking, sentence loop, playback speed, and word pronunciation using browser speech synthesis.
- The active video transcript sentence is highlighted and scrolled into view. Each sentence has a loop control and a save control before its text. Signed-in users can save sentences to a private D1-backed My Collection, replay from the saved timestamp, and remove entries. Duplicate saves are prevented per user, lesson, and timestamp.
- Video transcripts, text/audio sample lessons, and Reading Room passages share interactive English words. Single tap uses browser pronunciation; double tap or hold opens a Persian meaning. Punctuation remains outside the tappable word, including the final word in a sentence. The original sample lessons have a reviewed local glossary and a small phrase list. Unknown administrator-added vocabulary visibly reports that its translation is not available until a reviewed glossary or translation provider is supplied.
- Video lessons use a compact single-column video/transcript view. Independent English and Persian switches show or hide each language in both the on-video subtitles and the transcript. The short silent sample clips contain no embedded lesson text, so their captions respond to these controls.
- Owner-only Video Lesson administration: upload MP4/WebM files up to 25 MB, save a manually reviewed timestamped transcript, publish/unpublish, preview, and delete. Videos are stored in R2; lesson and category metadata is stored in D1.
- Learning folders never show upload or add controls, including when the owner is browsing as a learner. Uploads remain in the owner-only Administration pages, and write endpoints verify the administrator on the server. The player requests browsers to hide their standard download action; streamed media cannot be made technically impossible to copy without a dedicated DRM delivery service.
- Speaking Practice has its own administrator-managed category tree and accepts video lessons. Signed-in students can watch a published speaking video, record audio through their microphone, save private recordings, replay them, and delete them. The microphone is requested only when recording starts. Recordings are limited to two minutes and 10 MB.
- Reading Room has administrator-managed shelves and text lessons with multiple chapters. Administrators can create, edit, publish, and delete lessons and chapters. Students can choose a chapter, move to the previous or next one, copy passages, and tap words for browser pronunciation.
- Original short samples now appear in Video Lessons (one silent 12-second clip), Daily Lessons, YouTube transcript practice (without an attached YouTube video), IELTS Reading, Speaking prompts, Quick Tips, and each of the three Reading Room shelves. Sample text lessons use browser speech synthesis and device-local save/completion. The Reading Room fixtures are separate from administrator-created content.

## Not working yet

Automatic transcription/translation, full translations for arbitrary selected languages, word definitions and saved Word Bank, cross-device lesson progress, Reading Room bookmarks and audio narration, independent email/password accounts, quizzes, membership/payments, referrals, and the other requested learning and support sections. My Collection currently saves video and news transcript sentences; folders, notes, and speaking practice from saved sentences are pending. Short static examples in Daily Lessons, YouTube, IELTS, and Quick Tips are for reviewing the content flow; their full section publishing workflows are still pending. The site remains owner-private until the user requests a different audience. Speaking recordings are private to each authenticated site visitor; AI pronunciation assessment is not active.

## Deployment and security

The Sites project ID is in `.openai/hosting.json`. `ADMIN_EMAIL` is a hosting runtime value, not included in the source. Administrative API routes verify the signed-in user's platform-provided email server-side. Media is served from a server route and unpublished drafts require administrator access. D1 migrations are in `drizzle/`; never modify a migration after it has been applied in production.

To develop locally, install with `npm ci`, generate future schema migrations with `npm run db:generate`, and run `npm run build`. Apply pending D1 migrations to a local preview before testing data-backed routes. Browser speech voices and picture-in-picture support vary by device.

## Next build stages

1. Connect a reviewed transcription/translation workflow and the student's language preference, then test a real video supplied by the owner.
2. Build persistent Word Bank and My Collection from the video transcript.
3. Complete Daily Lessons, YouTube, IELTS, Reading, Speaking, Quick Tips, achievements, membership/referrals, support/feedback, settings, and expanded administration in the order specified by the product brief.
