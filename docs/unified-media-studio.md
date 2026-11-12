# YouTube and hosted media in every learning section

The shared admin studio is at `/administration/media`. Existing specialized
studios remain available. They link to the shared studio for YouTube and uploaded
media; the Administration home also has an **All-section media studio** card.

## Upgrade

After the feature branch is reviewed and merged, run:

```bash
npm ci
npm run db:migrate
npm run build
```

The new PostgreSQL migration adds `video_lessons.sections` and
`media_integrations.provider_options`. Existing rows retain their original
catalogs. Explicit section choices control where new media appears, independent
of whether its source is YouTube, uploaded video, or podcast audio.

Keep the existing `MEDIA_CONFIG_ENCRYPTION_KEY`. It encrypts provider credentials;
replacing it makes saved keys unreadable. Production Supabase and VPS media settings
are still required for authenticated use and uploads.

## Add content

1. Open **Administration → All-section media studio**.
2. Choose uploaded video, uploaded speaking video, a YouTube video/Short URL,
   or podcast audio/video. Hosted uploads remain in private server storage.
3. Select one or more destinations: Lessons, Video Lessons, News, Daily Lessons,
   YouTube Lessons, Podcasts, IELTS Listening & Reading, IELTS Video Speaking,
   or Speaking Practice. Choose landscape, vertical/Short, or square framing.
4. Create a draft. Prepare English using one of these sources:
   - Generate from the matching original media through the selected transcription API.
   - Upload an English SRT/VTT file.
   - Type individual sentence boxes or paste English lines into separate boxes.
5. Review start/end times and save English. Plain pasted text receives temporary
   three-second timings that must be adjusted to match the media.
6. Prepare each translation from that saved English:
   - Generate through the selected translation API.
   - Upload a separate translation SRT/VTT with matching sentence counts and times.
   - Type or paste the translation into each sentence’s separate box.
7. Apply generated results, review and save the transcript, then publish.
   Translations retain English timings. Existing translations are reused rather
   than regenerated. Editing an English sentence clears its old translations.

A YouTube URL is played through the official embedded player. The app does not
extract/download arbitrary YouTube audio. For automatic English transcription,
attach a matching original file you are allowed to use. Alternatively import
SRT/VTT or official captions for a video your connected YouTube account can edit.

Media placed in Speaking Practice or IELTS Video Speaking also supports private
learner recordings. Existing specialized IELTS reading, teleprompter, lesson-block,
and other editing tools remain available in their original studios.

## Separate transcription and translation APIs

Open `/administration/media-apis`. The provider-selection form has blank endpoint,
model, and password fields for the administrator to complete. Saved keys are
never returned by the settings APIs. Leaving a key blank preserves it; changing
its API website requires entering the appropriate key again.

English transcription supports:

- AssemblyAI, using its existing key field.
- OpenAI-compatible transcription, with a full endpoint, model, and key. The
  model must support `verbose_json` with timed segments; uploads are limited to
  25 MB for this protocol. An endpoint such as `/v1/audio/transcriptions` and a
  compatible timestamp model are supplied by the administrator.
- A custom timed-transcription endpoint, following the contract below.

Translation supports DeepL, Google Cloud Translation, Azure Translator,
OpenAI-compatible chat-completions endpoints, and a custom translation endpoint.
Transcription and translation have separate endpoint/model/key settings.
Authentication supports Bearer Authorization, `x-api-key`, or `api-key`.
Enable generation and save settings before generating. The **Test saved translation
connection** action uses the saved provider and its quota. Transcription support
is best tested on a short draft, since an API key alone cannot prove timestamp support.

### Custom transcription contract

The app sends multipart form data containing `file`, `language=en`, and an optional
`model`. Return JSON with English sentence segments and timestamps in **seconds**:

```json
{"segments":[{"start":0.5,"end":3.25,"text":"Hello there."}]}
```

### Custom translation contract

The app sends JSON, and expects one translation for every English input, in order:

```json
{"texts":["Hello there."],"source":"en","target":"fa","model":"optional-model"}
```

```json
{"translations":["سلام"]}
```

A key from an arbitrary website is insufficient if that site uses a different
request or response format; those services require an adapter or a compatible
API gateway. Endpoints must be public HTTPS URLs without embedded credentials
or query parameters. Private network addresses and HTTP redirects are rejected.
Provider error responses are not forwarded to the browser with their raw contents.

## Verification

- `npm test`: 30 tests passed, including PostgreSQL integration tests for all nine
  placements, YouTube Shorts, hosted video/audio, matching SRT files, encrypted
  settings, custom transcription → review → English save → translation → publish,
  authorization, and provider response validation.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Chromium component tests: passed at desktop and phone sizes for all nine
  selections, vertical YouTube creation, separate sentence boxes, blank custom
  provider fields, and paired SRT import. These use mocked API requests, not
  authenticated production Supabase or paid provider services.
- Existing content and manually reviewed translations are retained.

No production credentials were available. Live provider billing, quotas, model
capabilities, Supabase authentication, real VPS upload capacity, and production
acceptance still need verification in the configured environment.
