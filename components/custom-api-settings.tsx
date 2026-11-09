"use client";
import { useState } from "react";
import { defaultHttpProvider, type HttpProvider } from "@/lib/custom-provider";
import { translationLanguages } from "@/lib/languages";
export function CustomApiSettings() {
  const [kind, setKind] = useState<"transcription" | "translation">(
      "transcription",
    ),
    [config, setConfig] = useState<HttpProvider>(defaultHttpProvider),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [media, setMedia] = useState(""),
    [language, setLanguage] = useState("fa"),
    [saved, setSaved] = useState(false);
  function change(p: Partial<HttpProvider>) {
    setConfig((c) => ({ ...c, ...p }));
    setSaved(false);
  }
  async function send(body: object) {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/media-integrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
        d = (await r.json()) as any;
      if (!r.ok) throw Error(d.error || "Request failed.");
      if ((body as any).action === "custom-save") {
        setSaved(true);
        setMessage(
          "Custom provider saved and selected. Enable API generation above, then test.",
        );
      } else
        setMessage(
          d.message ||
            "English-to-selected-language connection test succeeded.",
        );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }
  const field = (key: keyof HttpProvider, label: string, help?: string) => (
    <label key={key}>
      {label}
      <input
        value={config[key]}
        onChange={(e) => change({ [key]: e.target.value })}
      />
      {help && <small>{help}</small>}
    </label>
  );
  return (
    <details className="detail-panel">
      <summary>
        <strong>
          Connect any compatible transcription or translation HTTP API
        </strong>
      </summary>
      <p>
        Configure the request and response to match your provider’s
        documentation. Settings and authentication headers are encrypted on the
        server. Multipart transcription accepts files up to 25 MB; use a JSON
        API with an accessible original media URL for larger files. Saved
        secrets are never sent back to this form. To edit a saved custom
        connection, enter its full configuration again; leaving this form alone
        keeps it.
      </p>
      <form
        className="admin-form"
        onSubmit={(e) => {
          e.preventDefault();
          send({ action: "custom-save", kind, config });
        }}
      >
        <label>
          API purpose
          <select
            value={kind}
            onChange={(e) => {
              const next = e.target.value as typeof kind;
              setKind(next);
              setConfig({
                ...defaultHttpProvider,
                format: next === "translation" ? "json" : "multipart",
                resultPath:
                  next === "translation" ? "translations" : "segments",
                body:
                  next === "translation"
                    ? '{{"text":"{{texts}}","source_lang":"{{source}}","target_lang":"{{target}}"}}'.slice(
                        1,
                        -1,
                      )
                    : '{"model":"whisper-1","response_format":"verbose_json","language":"en"}',
              });
              setSaved(false);
            }}
          >
            <option value="transcription">English transcription</option>
            <option value="translation">Translation from English</option>
          </select>
        </label>
        {field("name", "Provider name")}
        {field("endpoint", "HTTPS API endpoint")}
        <label>
          Authentication and additional headers (JSON)
          <textarea
            rows={4}
            value={config.headers}
            onChange={(e) => change({ headers: e.target.value })}
            autoComplete="off"
            spellCheck={false}
          />
          <small>
            Example: {`{"Authorization":"Bearer YOUR_KEY"}`}. Add any required
            provider headers here.
          </small>
        </label>
        <label>
          Request format
          <select
            value={config.format}
            onChange={(e) =>
              change({ format: e.target.value as HttpProvider["format"] })
            }
          >
            <option value="json">JSON</option>
            {kind === "transcription" && (
              <option value="multipart">Multipart file upload</option>
            )}
          </select>
        </label>
        <label>
          Request body / multipart fields (JSON)
          <textarea
            rows={6}
            value={config.body}
            onChange={(e) => change({ body: e.target.value })}
            spellCheck={false}
          />
          <small>
            {kind === "translation"
              ? "Variables: {{texts}} is an array, {{text}} is one sentence, {{source}} is en, {{target}} is the selected language code. Exact placeholders preserve JSON types. Translation calls send one sentence at a time for compatibility."
              : "Variables: {{mediaUrl}} is an accessible original media URL, {{source}} is en. Add model, language, response format, and any required fields. Multipart APIs receive the attached file."}
          </small>
        </label>
        {kind === "transcription" &&
          config.format === "multipart" &&
          field("fileField", "File upload field name")}
        {field(
          "resultPath",
          kind === "transcription"
            ? "Timed segments array path"
            : "Translation array / string path",
          "Dot notation, such as results.segments or data.translations. Leave blank for a root array.",
        )}
        {field(
          "textPath",
          kind === "transcription"
            ? "English text field in each segment"
            : "Translation text field in each result",
          "For arrays of strings, leave blank.",
        )}
        {kind === "transcription" && (
          <>
            {field("startPath", "Segment start field")}
            {field("endPath", "Segment end field")}
            <label>
              Timestamp unit
              <select
                value={config.timeUnit}
                onChange={(e) =>
                  change({
                    timeUnit: e.target.value as HttpProvider["timeUnit"],
                  })
                }
              >
                <option value="seconds">Seconds</option>
                <option value="milliseconds">Milliseconds</option>
              </select>
            </label>
            <details>
              <summary>Asynchronous transcription / polling (optional)</summary>
              {field(
                "pollEndpoint",
                "HTTPS polling endpoint",
                "Use {{jobId}} in the URL. Leave blank for synchronous APIs.",
              )}
              {field("jobIdPath", "Job ID response path")}
              {field("statusPath", "Status response path")}
              {field("doneValue", "Completed status value")}
              {field("failedValue", "Failed status value")}
            </details>
          </>
        )}
        <button className="button primary" disabled={busy}>
          Save and select custom API
        </button>
        <fieldset disabled={busy || !saved}>
          <legend>Test saved connection</legend>
          {kind === "transcription" ? (
            <>
              <label>
                Short English test media URL (public HTTPS, up to 5 MB)
                <input
                  type="url"
                  value={media}
                  onChange={(e) => setMedia(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="button secondary"
                onClick={() =>
                  send({
                    action: "test",
                    provider: "custom-transcription",
                    testMediaUrl: media,
                  })
                }
              >
                Test English transcription
              </button>
            </>
          ) : (
            <>
              <label>
                Translate “Hello” into
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {Object.entries(translationLanguages).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="button secondary"
                onClick={() =>
                  send({ action: "test", provider: "custom", language })
                }
              >
                Test English → selected translation
              </button>
            </>
          )}
        </fieldset>
        <p>
          Tests contact your provider and use its quota. A successful
          asynchronous submission confirms acceptance; verify its completed
          timestamps in a lesson.
        </p>
        <p role="status">{message}</p>
      </form>
    </details>
  );
}
