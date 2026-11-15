import dns from "node:dns";
import https from "node:https";
import net from "node:net";
import { parseSrt, parseVtt } from "@/lib/transcript-import";

/**
 * Fetches an SRT/VTT subtitle file from a public https URL for the transcript editor.
 *
 * Because the server makes the request on an administrator's behalf, this is hardened
 * against server-side request forgery: https only, no credentials, port 443 only,
 * public IP addresses only (checked at connect time, so DNS rebinding cannot slip a
 * private address in), re-validated redirects, a size cap and a time limit.
 */

export const MAX_SUBTITLE_BYTES = 10_000_000;
const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 15_000;

export class SubtitleFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubtitleFetchError";
  }
}

export type TransportResponse = {
  status: number;
  headers: Record<string, string | undefined>;
  body: Uint8Array;
};
export type Transport = (url: URL) => Promise<TransportResponse>;
export type FetchedSubtitles = {
  format: "srt" | "vtt";
  text: string;
  cues: number;
  finalUrl: string;
};

const blocked = new net.BlockList();
for (const [net4, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const)
  blocked.addSubnet(net4, prefix, "ipv4");
for (const [net6, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["fc00::", 7],
  ["fe80::", 10],
  ["fec0::", 10],
  ["ff00::", 8],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["64:ff9b::", 96],
  ["100::", 64],
] as const)
  blocked.addSubnet(net6, prefix, "ipv6");

/** True only for globally routable unicast addresses. */
export function isPublicAddress(address: string): boolean {
  const family = net.isIP(address);
  if (!family) return false;
  if (family === 6) {
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address);
    if (mapped) return isPublicAddress(mapped[1]);
    return !blocked.check(address, "ipv6");
  }
  return !blocked.check(address, "ipv4");
}

/** Validates the shape of a URL before any network access. */
export function assertFetchableUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new SubtitleFetchError("Enter a valid subtitle file URL.");
  }
  if (url.protocol !== "https:")
    throw new SubtitleFetchError("Use an https:// link to the subtitle file.");
  if (url.username || url.password)
    throw new SubtitleFetchError("Links with a username or password are not allowed.");
  if (url.port && url.port !== "443")
    throw new SubtitleFetchError("Only the standard https port is allowed.");
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (/(^|\.)(youtube\.com|youtu\.be)$/.test(host))
    throw new SubtitleFetchError(
      "YouTube pages are not subtitle files. Use the official YouTube caption import, or link directly to an .srt or .vtt file.",
    );
  if (net.isIP(host) && !isPublicAddress(host))
    throw new SubtitleFetchError("That address is not a public website.");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal"))
    throw new SubtitleFetchError("That address is not a public website.");
  return url;
}

/** Default transport: node:https with a connect-time lookup that rejects non-public addresses. */
const nodeTransport: Transport = (url) =>
  new Promise((resolve, reject) => {
    let settled = false;
    const done = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn();
    };
    const request = https.request(
      {
        protocol: "https:",
        hostname: url.hostname.replace(/^\[|\]$/g, ""),
        port: 443,
        path: `${url.pathname}${url.search}`,
        method: "GET",
        headers: {
          Accept: "text/vtt, application/x-subrip, text/plain;q=0.9, */*;q=0.1",
          "Accept-Encoding": "identity",
          "User-Agent": "LingoLive-SubtitleFetcher/1.0",
        },
        lookup: (hostname, options, callback) => {
          dns.lookup(hostname, { ...options, all: true }, (error, addresses) => {
            const list = (addresses || []) as dns.LookupAddress[];
            if (error || !list.length)
              return (callback as any)(error || new Error("Host not found"), "", 4);
            if (!list.every((a) => isPublicAddress(a.address)))
              return (callback as any)(new SubtitleFetchError("That address is not a public website."), "", 4);
            if ((options as any)?.all) return (callback as any)(null, list);
            return (callback as any)(null, list[0].address, list[0].family);
          });
        },
      },
      (response) => {
        const chunks: Buffer[] = [];
        let size = 0;
        response.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > MAX_SUBTITLE_BYTES) {
            request.destroy();
            done(() => reject(new SubtitleFetchError("The subtitle file is larger than 10 MB.")));
            return;
          }
          chunks.push(chunk);
        });
        response.on("end", () =>
          done(() =>
            resolve({
              status: response.statusCode || 0,
              headers: response.headers as Record<string, string | undefined>,
              body: new Uint8Array(Buffer.concat(chunks)),
            }),
          ),
        );
        response.on("error", () => done(() => reject(new SubtitleFetchError("The download was interrupted."))));
      },
    );
    const timer = setTimeout(() => {
      request.destroy();
      done(() => reject(new SubtitleFetchError("The website took too long to respond.")));
    }, TIMEOUT_MS);
    request.on("error", (error) =>
      done(() =>
        reject(
          error instanceof SubtitleFetchError
            ? error
            : new SubtitleFetchError("Could not connect to that website."),
        ),
      ),
    );
    request.end();
  });

function decode(bytes: Uint8Array): string {
  return new TextDecoder("utf-8").decode(bytes).replace(/^﻿/, "");
}

export async function fetchSubtitleText(
  rawUrl: string,
  transport: Transport = nodeTransport,
): Promise<FetchedSubtitles> {
  let url = assertFetchableUrl(rawUrl);
  for (let hop = 0; ; hop++) {
    const response = await transport(url);
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.location;
      if (!location || hop >= MAX_REDIRECTS)
        throw new SubtitleFetchError("The link redirects too many times.");
      url = assertFetchableUrl(new URL(location, url).toString());
      continue;
    }
    if (response.status !== 200)
      throw new SubtitleFetchError(`The website returned status ${response.status}. Check that the link is public and correct.`);
    const type = (response.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
    if (type && !(type.startsWith("text/") || ["application/octet-stream", "application/x-subrip", "application/x-srt", "binary/octet-stream"].includes(type)) || type === "text/html")
      throw new SubtitleFetchError("That link is not a subtitle file (expected .srt or .vtt text).");
    if (response.body.length > MAX_SUBTITLE_BYTES)
      throw new SubtitleFetchError("The subtitle file is larger than 10 MB.");
    const text = decode(response.body);
    const format = text.trimStart().startsWith("WEBVTT") ? "vtt" : "srt";
    try {
      const cues = (format === "vtt" ? parseVtt(text) : parseSrt(text)).length;
      return { format, text, cues, finalUrl: url.toString() };
    } catch (error) {
      throw new SubtitleFetchError(
        error instanceof Error ? error.message : "That file is not valid SRT or VTT.",
      );
    }
  }
}
