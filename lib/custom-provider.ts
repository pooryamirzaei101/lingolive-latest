// Configurable HTTP adapters. Secrets are only loaded and used on the server.
export type HttpProvider = {
  name: string;
  endpoint: string;
  headers: string;
  body: string;
  format: "json" | "multipart";
  fileField: string;
  resultPath: string;
  textPath: string;
  startPath: string;
  endPath: string;
  timeUnit: "seconds" | "milliseconds";
  jobIdPath: string;
  pollEndpoint: string;
  statusPath: string;
  doneValue: string;
  failedValue: string;
};
export const defaultHttpProvider: HttpProvider = {
  name: "Custom API",
  endpoint: "",
  headers: '{"Authorization":"Bearer YOUR_API_KEY"}',
  body: "{}",
  format: "multipart",
  fileField: "file",
  resultPath: "segments",
  textPath: "text",
  startPath: "start",
  endPath: "end",
  timeUnit: "seconds",
  jobIdPath: "id",
  pollEndpoint: "",
  statusPath: "status",
  doneValue: "completed",
  failedValue: "error",
};
export function publicEndpoint(value: string) {
  const u = new URL(value);
  const h = u.hostname.toLowerCase();
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    (u.port && u.port !== "443") ||
    h === "localhost" ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    h.endsWith(".localhost") ||
    h.includes(":") ||
    /^\d+(\.\d+){3}$/.test(h) ||
    !h.includes(".")
  )
    throw Error(
      "Use a public HTTPS provider hostname without credentials or a custom port.",
    );
  return u.href;
}
export function atPath(value: any, path: string): any {
  return path ? path.split(".").reduce((v, k) => v?.[k], value) : value;
}
export function template(value: any, vars: Record<string, unknown>): any {
  if (typeof value === "string") {
    const exact = /^\{\{(\w+)\}\}$/.exec(value);
    if (exact) {
      if (!(exact[1] in vars))
        throw Error(`Unknown template variable: ${exact[1]}`);
      return vars[exact[1]];
    }
    return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (!(key in vars)) throw Error(`Unknown template variable: ${key}`);
      const v = vars[key];
      return typeof v === "string" ? v : JSON.stringify(v);
    });
  }
  if (Array.isArray(value)) return value.map((v) => template(v, vars));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, template(v, vars)]),
    );
  return value;
}
export function validateHttpProvider(
  value: unknown,
  translation = false,
): HttpProvider {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Error("Enter the custom provider settings.");
  const c = { ...defaultHttpProvider, ...value } as HttpProvider;
  for (const [key, v] of Object.entries(c))
    if (typeof v !== "string" || v.length > 16000)
      throw Error(`Check custom provider ${key}.`);
  publicEndpoint(c.endpoint);
  if (c.pollEndpoint)
    publicEndpoint(c.pollEndpoint.replace("{{jobId}}", "test"));
  if (
    !["json", "multipart"].includes(c.format) ||
    !["seconds", "milliseconds"].includes(c.timeUnit)
  )
    throw Error("Choose a valid request format and timestamp unit.");
  const headers = JSON.parse(c.headers),
    body = JSON.parse(c.body);
  if (
    !headers ||
    Array.isArray(headers) ||
    typeof headers !== "object" ||
    Object.entries(headers).some(
      ([k, v]) =>
        typeof v !== "string" ||
        /[\r\n]/.test(k + v) ||
        /^(host|cookie|content-length|connection)$/i.test(k),
    )
  )
    throw Error("Headers must be a JSON object with text values.");
  if (!body || typeof body !== "object")
    throw Error("Request body must be a JSON object or array.");
  if (translation && c.format !== "json")
    throw Error("Custom translation requests use JSON.");
  if (!translation && c.format === "json" && !c.body.includes("{{mediaUrl}}"))
    throw Error(
      "A JSON transcription request must include {{mediaUrl}} and an accessible matching media URL.",
    );
  return c;
}
export async function providerRequest(
  c: HttpProvider,
  vars: Record<string, unknown>,
  file?: Blob,
  poll = false,
) {
  const url = publicEndpoint(
    poll
      ? c.pollEndpoint.replace(
          "{{jobId}}",
          encodeURIComponent(String(vars.jobId)),
        )
      : c.endpoint,
  );
  const headers = new Headers(JSON.parse(c.headers));
  let body: BodyInit | undefined;
  if (!poll) {
    const data = template(JSON.parse(c.body), vars);
    if (c.format === "multipart") {
      const form = new FormData();
      if (file) form.set(c.fileField, file, "media");
      for (const [k, v] of Object.entries(data))
        form.set(k, typeof v === "string" ? v : JSON.stringify(v));
      headers.delete("Content-Type");
      body = form;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(data);
    }
  }
  let res: Response;
  try {
    res = await fetch(url, {
      method: poll ? "GET" : "POST",
      headers,
      body,
      redirect: "error",
      signal: AbortSignal.timeout(90000),
    });
  } catch {
    throw Error(
      "Transcription provider or translation provider could not connect or timed out. Check the custom endpoint.",
    );
  }
  if (!res.ok)
    throw Error(
      `Transcription provider or translation provider returned ${res.status}. Check authentication, request fields, balance, and limits.`,
    );
  try {
    return await res.json();
  } catch {
    throw Error("The custom provider must return JSON.");
  }
}
export function providerSegments(data: unknown, c: HttpProvider) {
  const rows = atPath(data, c.resultPath);
  if (!Array.isArray(rows) || !rows.length || rows.length > 5000)
    throw Error(
      "The transcription response needs a nonempty timed segments array. Check the response path.",
    );
  const divisor = c.timeUnit === "milliseconds" ? 1000 : 1;
  return rows.map((row) => ({
    start: Number(atPath(row, c.startPath)) / divisor,
    end: Number(atPath(row, c.endPath)) / divisor,
    english: atPath(row, c.textPath),
    translations: {},
  }));
}
export async function customTranslate(
  texts: string[],
  target: string,
  config: string,
) {
  const c = validateHttpProvider(JSON.parse(config), true);
  const data = await providerRequest(c, {
    texts,
    text: texts[0],
    target,
    source: "en",
  });
  const raw = atPath(data, c.resultPath);
  const rows = Array.isArray(raw) ? raw : [raw];
  const results = rows.map((row) =>
    typeof row === "string" ? row : atPath(row, c.textPath),
  );
  if (
    results.length !== texts.length ||
    results.some((v) => typeof v !== "string" || !v.trim())
  )
    throw Error(
      "Translation provider returned an incomplete result. Check the array and text response paths.",
    );
  return results as string[];
}
