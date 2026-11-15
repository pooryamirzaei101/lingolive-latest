import { isAdmin } from "@/lib/admin";
import { fetchSubtitleText, SubtitleFetchError } from "@/lib/subtitle-fetcher";

/** Administrator-only: fetch an SRT/VTT file from a public https URL and return it for review in the transcript editor. */
export async function POST(request: Request) {
  if (!(await isAdmin()))
    return Response.json({ error: "Not authorized" }, { status: 403 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ error: "Cross-site requests are not allowed." }, { status: 403 });
  let url = "";
  try {
    const body = (await request.json()) as { url?: unknown };
    url = typeof body.url === "string" ? body.url : "";
  } catch {
    return Response.json({ error: "Send a JSON body with a url." }, { status: 400 });
  }
  if (!url || url.length > 2000)
    return Response.json({ error: "Enter a subtitle file URL." }, { status: 400 });
  try {
    const { format, text, cues } = await fetchSubtitleText(url);
    return Response.json({ format, text, cues });
  } catch (error) {
    if (error instanceof SubtitleFetchError)
      return Response.json({ error: error.message }, { status: 400 });
    console.warn(JSON.stringify({ event: "subtitle_fetch_error" }));
    return Response.json({ error: "Could not fetch that subtitle file." }, { status: 502 });
  }
}
