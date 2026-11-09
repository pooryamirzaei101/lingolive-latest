import { parseSrt, validateSegments } from "@/lib/transcript-import";
import { isTranslationLanguage } from "@/lib/languages";
export async function transcriptFromForm(form: FormData) {
  const mode = String(form.get("transcriptMode") || "manual"),
    language = String(form.get("translationLanguage") || "fa");
  if (!isTranslationLanguage(language))
    throw Error("Choose a translation language.");
  if (mode === "api" || mode === "captions") return [];
  if (mode === "manual" && form.get("segments"))
    return validateSegments(JSON.parse(String(form.get("segments"))));
  if (mode === "manual") return [];
  if (mode !== "srt")
    throw Error("Choose API generation, SRT files, or manual sentences.");
  const english = form.get("englishSrt"),
    translated = form.get("translationSrt");
  if (!(english instanceof File) || !english.size || english.size > 10000000)
    throw Error("Upload English SRT up to 10 MB.");
  const rows = parseSrt(await english.text());
  let translations: ReturnType<typeof parseSrt> = [];
  if (translated instanceof File && translated.size) {
    if (translated.size > 10000000)
      throw Error("Translation SRT must be up to 10 MB.");
    translations = parseSrt(await translated.text());
    if (
      translations.length !== rows.length ||
      translations.some(
        (t, i) =>
          Math.abs(t.start - rows[i].start) > 0.05 ||
          Math.abs(t.end - rows[i].end) > 0.05,
      )
    )
      throw Error(
        "English and translation SRT files must have matching cue counts and timestamps.",
      );
  }
  return validateSegments(
    rows.map((s, i) => ({
      start: s.start,
      end: s.end,
      english: s.text,
      translations: translations[i] ? { [language]: translations[i].text } : {},
    })),
  );
}
