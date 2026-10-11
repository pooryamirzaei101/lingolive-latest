import {mediaResponse} from '@/lib/media-response';
import {canLearn} from '@/lib/membership';
import { eq } from "drizzle-orm";
import { getDb, getMediaBucket } from "@/db";
import { ieltsSpeakingExamples } from "@/db/schema";
import { isAdmin } from "@/lib/admin";



export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const example = await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.id, id)).get();
    if (!example?.audioKey || (example.status !== "published" && !await isAdmin())) {
      return new Response("Not found", { status: 404 });
    }

    if(!await canLearn('ielts',id))return new Response('Membership required',{status:403});
    return mediaResponse(getMediaBucket(),example.audioKey,example.mimeType||'audio/mpeg',request);
  } catch {
    return new Response("Audio unavailable", { status: 503 });
  }
}

export const HEAD=GET;
