import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { ieltsSpeakingExamples } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

const CHUNK_BYTES = 1024 * 1024;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const example = await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id, id)).get();
    if (!example?.audioKey || (example.status !== "published" && !await isAdmin())) {
      return new Response("Not found", { status: 404 });
    }

    const bucket = getMediaBucket();
    const metadata = await bucket.head(example.audioKey);
    if (!metadata?.size) return new Response("Audio unavailable", { status: 404 });
    const headers = new Headers({
      "Content-Type": example.mimeType || metadata.httpMetadata?.contentType || "audio/mpeg",
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });

    const requestedRange = request.headers.get("range");
    if (requestedRange) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(requestedRange.trim());
      if (!match || (!match[1] && !match[2])) {
        headers.set("Content-Range", `bytes */${metadata.size}`);
        return new Response(null, { status: 416, headers });
      }
      const start = match[1] ? Number(match[1]) : Math.max(0, metadata.size - Number(match[2]));
      const requestedEnd = match[2] && match[1] ? Number(match[2]) : metadata.size - 1;
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd) || start >= metadata.size || requestedEnd < start) {
        headers.set("Content-Range", `bytes */${metadata.size}`);
        return new Response(null, { status: 416, headers });
      }
      const end = Math.min(requestedEnd, start + CHUNK_BYTES - 1, metadata.size - 1);
      const object = await bucket.get(example.audioKey, { range: { offset: start, length: end - start + 1 } });
      if (!object) return new Response("Audio unavailable", { status: 404 });
      headers.set("Content-Range", `bytes ${start}-${end}/${metadata.size}`);
      headers.set("Content-Length", String(end - start + 1));
      return new Response(object.body, { status: 206, headers });
    }

    const object = await bucket.get(example.audioKey);
    if (!object) return new Response("Audio unavailable", { status: 404 });
    headers.set("Content-Length", String(object.size));
    return new Response(object.body, { headers });
  } catch {
    return new Response("Audio unavailable", { status: 503 });
  }
}
