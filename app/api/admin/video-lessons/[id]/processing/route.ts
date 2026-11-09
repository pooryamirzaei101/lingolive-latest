import {providerRequest,providerSegments,validateHttpProvider,atPath,publicEndpoint} from "@/lib/custom-provider";
import {encryptKey,decryptKey} from "@/lib/media-integrations";
import { assemblyTimedSegments } from "@/lib/assembly-transcript";
import {
  MediaApiError,
  mediaErrorResponse,
  mediaJson,
} from "@/lib/media-api-errors";
import { isTranslationProvider } from "@/lib/translation-providers";
import { importYoutubeEnglish } from "@/lib/youtube-captions";
import { lessonMedia, saveMediaTranscript } from "@/lib/lesson-media";
import { cachedTranslation } from "@/lib/translation-cache";
import { eq, and } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { videoLessons, transcriptJobs } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import {
  integrationConfig,
  assemblyRequest,
  translationConnected,
} from "@/lib/media-integrations";
import { isTranslationLanguage } from "@/lib/languages";
import { validateSegments } from "@/lib/transcript-import";
import type { TranscriptSegment } from "@/lib/video";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return Response.json({ error: "Not authorized" }, { status: 403 });
  const { id } = await params;
  return Response.json({
    job:
      (await getDb()
        .select()
        .from(transcriptJobs)
        .where(
          eq(
            transcriptJobs.lessonId,
            new URL(_request.url).searchParams.get("section") &&
              new URL(_request.url).searchParams.get("section") !== "video"
              ? `${new URL(_request.url).searchParams.get("section")}:${id}`
              : id,
          ),
        )
        .get()) || null,
  });
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin()))
    return Response.json({ error: "Not authorized" }, { status: 403 });
  if (
    request.headers.get("origin") &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const { id } = await params,
    db = getDb(),
    section = new URL(request.url).searchParams.get("section") || "video",
    jobId = section === "video" ? id : `${section}:${id}`;
  let job = await db
    .select()
    .from(transcriptJobs)
    .where(eq(transcriptJobs.lessonId, jobId))
    .get();
  let processingStarted = false;
  try {
    const data = await mediaJson(request);
    if (
      !["apply", "captions", "translate", "start", "poll"].includes(data.action)
    )
      throw new MediaApiError(
        "INVALID_ACTION",
        "action",
        "validation",
        "Choose a valid processing action.",
      );
    if (
      data.languages !== undefined &&
      (!Array.isArray(data.languages) ||
        data.languages.length > 20 ||
        data.languages.some((l: unknown) => !isTranslationLanguage(l)))
    )
      throw new MediaApiError(
        "INVALID_LANGUAGE",
        "languages",
        "validation",
        "Choose supported translation languages, such as Persian (fa).",
      );
    const lesson = await lessonMedia(section, id, true);
    if (data.action === "apply") {
      if (job?.state !== "review")
        throw new Error("Generate a transcript first.");
      const segments = validateSegments(JSON.parse(job.segments));
      await saveMediaTranscript(section, id, JSON.stringify(segments));
      await db
        .update(transcriptJobs)
        .set({ state: section === "video" ? "needs_review" : "applied" })
        .where(eq(transcriptJobs.lessonId, jobId));
      return Response.json({ applied: true });
    }
    if (data.action === "captions") {
      if(!lesson.sourceUrl)throw Error('Choose a YouTube lesson.');
      if (
        job &&
        ["uploading", "transcribing", "translating"].includes(job.state)
      )
        throw Error("Wait for the current job to finish.");
      const rows = await importYoutubeEnglish(lesson.sourceUrl);
      await db
        .insert(transcriptJobs)
        .values({
          lessonId: jobId,
          state: "review",
          segments: JSON.stringify(rows),
          languages: "[]",
          createdAt: Date.now(),
        })
        .onConflictDoUpdate({
          target: transcriptJobs.lessonId,
          set: {
            state: "review",
            segments: JSON.stringify(rows),
            languages: "[]",
            error: "",
            cursor: 0,
            createdAt: Date.now(),
          },
        });
      return Response.json({
        job: await db
          .select()
          .from(transcriptJobs)
          .where(eq(transcriptJobs.lessonId, jobId))
          .get(),
      });
    }
    const config = await integrationConfig({
      assembly:
        data.action === "start" ||
        (data.action === "poll" && job?.state === "transcribing"),
      translation:
        data.action === "translate" ||
        (data.action === "poll" && job?.state === "translating"),
    });
    if (
      data.translationProvider !== undefined &&
      (!isTranslationProvider(data.translationProvider) ||
        data.translationProvider !== config.translationProvider)
    )
      throw new MediaApiError(
        "PROVIDER_CHANGED",
        "translationProvider",
        "validation",
        "The selected provider differs from saved settings. Reload Media API connections and save your provider.",
        409,
      );
    if (
      data.generationEnabled !== undefined &&
      typeof data.generationEnabled !== "boolean"
    )
      throw new MediaApiError(
        "INVALID_ENABLED",
        "generationEnabled",
        "validation",
        "Generation enabled must be true or false.",
      );
    if (!config.enabled)
      throw new MediaApiError(
        "GENERATION_DISABLED",
        "enabled",
        "validation",
        "API generation is disabled. Enable generation and save Media API connections before generating translations.",
        409,
      );
    if (
      data.action === "poll" &&
      job &&
      ["uploading", "transcribing"].includes(job.state) &&
      Date.now() - job.createdAt > 20 * 60_000
    ) {
      await db
        .update(transcriptJobs)
        .set({
          state: "failed",
          error:
            "Transcription took over 20 minutes. Retry generation; the audio remains saved.",
        })
        .where(eq(transcriptJobs.lessonId, jobId));
      return Response.json({
        job: await db
          .select()
          .from(transcriptJobs)
          .where(eq(transcriptJobs.lessonId, jobId))
          .get(),
      });
    }
    if (data.action === "poll" && !job)
      throw new MediaApiError(
        "MISSING_JOB",
        "job",
        "validation",
        "Start generation before checking processing.",
      );
    if (
      data.action === "poll" &&
      job?.state === "translating" &&
      !translationConnected(config)
    )
      throw new MediaApiError(
        "MISSING_CREDENTIAL",
        `${config.translationProvider}Key`,
        "credentials",
        "Save the selected translation provider API key in Media API connections.",
      );
    if (data.action === "translate") {
      if (!translationConnected(config))
        throw new MediaApiError(
          "MISSING_CREDENTIAL",
          `${config.translationProvider}Key`,
          "credentials",
          "Save the selected translation provider API key in Media API connections.",
        );
      if (
        job &&
        ["uploading", "transcribing", "translating"].includes(job.state)
      )
        throw Error("Wait for the current job to finish.");
      const rows = validateSegments(JSON.parse(lesson.transcript));
      if (!rows.length)
        throw new MediaApiError(
          "MISSING_TRANSCRIPT",
          "transcript",
          "validation",
          "Save the English transcript first.",
        );
      const languages = Array.isArray(data.languages)
        ? [...new Set(data.languages.filter(isTranslationLanguage))]
        : [];
      if (!languages.length)
        throw new MediaApiError(
          "MISSING_LANGUAGE",
          "languages",
          "validation",
          "Choose a translation language, such as Persian (fa).",
        );
      await db
        .insert(transcriptJobs)
        .values({
          lessonId: jobId,
          state: "translating",
          segments: JSON.stringify(rows),
          languages: JSON.stringify(languages),
          createdAt: Date.now(),
        })
        .onConflictDoUpdate({
          target: transcriptJobs.lessonId,
          set: {
            state: "translating",
            segments: JSON.stringify(rows),
            languages: JSON.stringify(languages),
            cursor: 0,
            error: "",
            createdAt: Date.now(),
          },
        });
      return Response.json({
        job: await db
          .select()
          .from(transcriptJobs)
          .where(eq(transcriptJobs.lessonId, jobId))
          .get(),
      });
    }
    if (data.action === "start") {
      if(validateSegments(JSON.parse(lesson.transcript)).length&&data.regenerate!==true)return Response.json({error:'An English transcript is already saved. Reuse it or explicitly replace it.',code:'TRANSCRIPT_ALREADY_SAVED'},{status:409});
      if (config.transcriptionProvider!=="custom"&&!config.assemblyKey)
        throw new MediaApiError(
          "MISSING_CREDENTIAL",
          "assemblyKey",
          "credentials",
          "Save an AssemblyAI transcription API key first.",
        );
      if (lesson.contentKind === "podcast")
        await db
          .update(videoLessons)
          .set({ status: "draft" })
          .where(eq(videoLessons.id, id));
      if (lesson.sourceUrl && !lesson.mediaKey && !(config.transcriptionProvider==="custom"&&data.mediaUrl))
        throw new MediaApiError(
          "MISSING_TRANSCRIPTION_SOURCE",
          "transcriptionSource",
          "validation",
          "This YouTube lesson has no matching original media for AssemblyAI. Import authorized YouTube captions, upload English SRT/VTT, or attach the matching original audio/video first.",
        );
      if (
        job &&
        !["failed", "applied", "approved", "review"].includes(job.state)
      ) {
        if (Date.now() - job.createdAt < 20 * 60_000)
          return Response.json({ job });
        await db
          .update(transcriptJobs)
          .set({
            state: "failed",
            error:
              "Transcription took over 20 minutes. Retry generation; the audio remains saved.",
          })
          .where(eq(transcriptJobs.lessonId, jobId));
      }
      const langs: string[] = []; // Transcribe English first; translate only from the reviewed, saved transcript.
      if (job)
        await db
          .delete(transcriptJobs)
          .where(and(eq(transcriptJobs.lessonId, jobId),eq(transcriptJobs.createdAt,job.createdAt)));
      const inserted = await db
        .insert(transcriptJobs)
        .values({
          lessonId: jobId,
          state: "uploading",
          languages: JSON.stringify([...new Set(langs)]),
          createdAt: Math.max(Date.now(),(job?.createdAt||0)+1),
        })
        .onConflictDoNothing()
        .returning();
      if (!inserted.length)
        throw new Error("A processing job is already running.");
      processingStarted = true;
      if(config.transcriptionProvider==='custom'){
        const custom=validateHttpProvider(JSON.parse(config.customTranscription||'{}'));
        const mediaUrl=typeof data.mediaUrl==='string'?publicEndpoint(data.mediaUrl):'';
        if(custom.format==='json'&&!mediaUrl)throw Error('This provider requires an accessible original media URL. Enter it in the transcript editor.');
        const file=custom.format==='multipart'?await getMediaBucket().get(lesson.mediaKey):null;
        if(custom.format==='multipart'&&!file)throw Error('Attach the matching original media file first.');
        if(file&&file.size>25000000)throw Error('Custom multipart transcription supports files up to 25 MB. Use a JSON URL API for larger media.');
        const result=await providerRequest(custom,{mediaUrl,source:'en'},file?new Blob([await file.arrayBuffer()],{type:file.httpMetadata?.contentType||'application/octet-stream'}):undefined);
        if(custom.pollEndpoint){const providerId=atPath(result,custom.jobIdPath);if(typeof providerId!=='string'&&typeof providerId!=='number')throw Error('No provider job ID returned. Check the response mapping.');await db.update(transcriptJobs).set({providerId:'custom:'+await encryptKey(JSON.stringify({jobId:String(providerId),config:custom})),state:'transcribing'}).where(eq(transcriptJobs.lessonId,jobId))}
        else{const segments=validateSegments(providerSegments(result,custom));await db.update(transcriptJobs).set({state:'review',segments:JSON.stringify(segments)}).where(eq(transcriptJobs.lessonId,jobId))}
        return Response.json({job:await db.select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,jobId)).get()});
      }
      const file = await getMediaBucket().get(lesson.mediaKey);
      if (!file) throw new Error("Video file is unavailable.");
      const upload = await assemblyRequest("upload", config.assemblyKey, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: file.body,
      });
      const transcript = await assemblyRequest(
        "transcript",
        config.assemblyKey,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audio_url: upload.upload_url,
            language_code: "en",
            speech_models: ["universal-3-pro", "universal-2"],
          }),
        },
      );
      await db
        .update(transcriptJobs)
        .set({ providerId: transcript.id, state: "transcribing" })
        .where(eq(transcriptJobs.lessonId, jobId));
    } else if (data.action === "poll" && job) {
      if (job.state === "transcribing") {
        processingStarted = true;
        if(job.providerId.startsWith('custom:')){
          const snapshot=JSON.parse(await decryptKey(job.providerId.slice(7))),custom=validateHttpProvider(snapshot.config);
          const result=await providerRequest(custom,{jobId:snapshot.jobId,source:'en'},undefined,true),state=atPath(result,custom.statusPath);
          if(state===custom.failedValue)throw Error('The transcription provider reported a failed job.');
          if(state===custom.doneValue){const segments=validateSegments(providerSegments(result,custom));await db.update(transcriptJobs).set({state:'review',segments:JSON.stringify(segments),cursor:0}).where(eq(transcriptJobs.lessonId,jobId))}
          return Response.json({job:await db.select().from(transcriptJobs).where(eq(transcriptJobs.lessonId,jobId)).get()});
        }
        const result = await assemblyRequest(
          `transcript/${job.providerId}`,
          config.assemblyKey,
        );
        if (result.status === "error")
          throw new Error(
            `AssemblyAI could not transcribe this recording${typeof result.error === "string" && result.error.length < 240 ? `: ${result.error}` : ". Check that it contains audible English speech and try another audio format."}`,
          );
        if (result.status === "completed") {
          let sentences: unknown = [];
          try {
            const detail = await assemblyRequest(
              `transcript/${job.providerId}/sentences`,
              config.assemblyKey,
            );
            sentences = detail.sentences;
          } catch {
            /* The completed response includes word timings even if sentence retrieval fails. */
          }
          const rows = assemblyTimedSegments(sentences, result);
          if (!rows.length) throw new Error("No English speech was detected.");
          await db
            .update(transcriptJobs)
            .set({ state: "review", segments: JSON.stringify(rows), cursor: 0 })
            .where(eq(transcriptJobs.lessonId, jobId));
        }
      } else if (job.state === "translating") {
        processingStarted = true;
        const rows = JSON.parse(job.segments) as TranscriptSegment[],
          languages = JSON.parse(job.languages) as string[];
        const total = rows.length * languages.length,
          lang = languages[Math.floor(job.cursor / rows.length)],
          start = job.cursor % rows.length,
          end = Math.min(start + 20, rows.length);
        const translated = await Promise.all(
          rows
            .slice(start, end)
            .map(
              async (s, index) =>
                s.translations[lang] ||
                (
                  await cachedTranslation(
                    s.english,
                    lang as import("@/lib/languages").TranslationLanguage,
                    undefined,
                    `lesson:${section}:${id}:segment-${start + index}`,
                  )
                ).translation,
            ),
        );
        for (let i = start; i < end; i++)
          rows[i].translations[lang] = translated[i - start];
        const cursor = job.cursor + end - start;
        await db
          .update(transcriptJobs)
          .set({
            segments: JSON.stringify(rows),
            cursor,
            state: cursor >= total ? "review" : "translating",
          })
          .where(
            and(
              eq(transcriptJobs.lessonId, jobId),
              eq(transcriptJobs.cursor, job.cursor),
            ),
          );
      }
    }
    return Response.json({
      job: await db
        .select()
        .from(transcriptJobs)
        .where(eq(transcriptJobs.lessonId, jobId))
        .get(),
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Processing failed.";
    if (processingStarted)
      await db
        .update(transcriptJobs)
        .set({ state: "failed", error })
        .where(eq(transcriptJobs.lessonId, jobId));
    return mediaErrorResponse(e, "processing");
  }
}
