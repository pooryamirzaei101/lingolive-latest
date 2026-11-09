# Shared media studios

Video Lessons (including News folders), YouTube Lessons, Podcasts, Speaking Practice, and both IELTS studios use LessonMediaCreate. A media source is independent of the lesson section. YouTube links remain embedded; they are not downloaded. Display formats are 16:9 and 9:16.

Transcript sources: connected API; matching English/translation SRT files; or timestamped sentence rows with separate English and translation inputs. API English is reviewed and saved before translating. Changes remain drafts until published. Reading passages and existing IELTS question editing remain available.

## Custom HTTP adapters

Media API connections retains AssemblyAI, Google, DeepL, and Azure and adds custom HTTP configuration for either purpose. Authentication headers and complete custom configurations are AES-GCM encrypted using the existing server key. Public settings return only connection flags, never secrets. An admin must re-enter a full custom bundle to replace it. Config changes never erase built-in credentials.

Transcription supports multipart POST with configurable file/extra fields (25 MB maximum) or JSON POST using an accessible original media URL. For asynchronous APIs, configure a GET polling URL with {{jobId}}, status path/values, and timed segment mapping. Polling snapshots the encrypted custom configuration into its job, so later changes do not redirect that job. Segment times may be seconds or milliseconds. Plain transcript-only responses need manual timestamps or SRT; they cannot produce accurate timing automatically.

Translation supports JSON POST with {{text}}, {{texts}}, {{source}}, and {{target}} variables. Exact placeholders preserve JSON types. The response may be a string, string array, or array of objects at a configured dot path. Requests currently contain one sentence, supporting services with a scalar text field. OAuth exchanges, WebSocket/gRPC APIs, arbitrary executable transformations, and provider-specific multi-step upload flows need a dedicated adapter.

Tests use a short accessible English recording for transcription and English Hello to the selected target language for translation. Tests consume provider quota. An asynchronous acceptance test confirms submission; verify completion in the lesson editor.

## Shared storage and costs

English transcripts live in the lesson database/media_transcripts, not browser storage. Starting transcription on a lesson with saved English requires explicit replacement. Existing transcription jobs are claimed with a database insert; stale jobs are deleted conditionally. Completed provider drafts must be applied and saved.

Generated translations use translation_cache, keyed by canonical English text and target language, with a database lease to prevent simultaneous learners making duplicate provider calls. Shared rows are reused across lessons; scoped rows preserve administrator corrections. Provider changes do not invalidate ready translations. Transcripts and reviewed translations are available to all learners authorized to access the lesson. No production API was called during automated tests.
