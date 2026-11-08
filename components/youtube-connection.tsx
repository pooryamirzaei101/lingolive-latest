"use client";

import { useEffect, useState } from "react";

type ConnectionState = { youtubeConfigured: boolean; youtubeConnected: boolean };

export function YouTubeConnection() {
  const [id, setId] = useState("");
  const [secret, setSecret] = useState("");
  const [state, setState] = useState<ConnectionState>({ youtubeConfigured: false, youtubeConnected: false });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [redirect, setRedirect] = useState("");
  const dirty = !!id.trim() || !!secret.trim();

  async function load() {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch("/api/admin/media-integrations", { cache: "no-store" });
      const data = await response.json() as ConnectionState & { error?: string };
      if (!response.ok) throw Error(data.error || "Could not load the YouTube connection.");
      setState(data);
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "Could not load the YouTube connection.");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    void load();
    setRedirect(`${window.location.origin}/api/admin/youtube-oauth/callback`);
    if (new URLSearchParams(window.location.search).get("youtube") === "connected") setMessage("YouTube account connected.");
  }, []);

  async function send(body: object, success: string) {
    setBusy(true);
    setFailed(false);
    setMessage("Working…");
    try {
      const response = await fetch("/api/admin/media-integrations", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await response.json() as { error?: string; config?: ConnectionState };
      if (!response.ok) throw Error(data.error || "Could not update the YouTube connection.");
      setId("");
      setSecret("");
      if (data.config) setState(data.config);
      else await load();
      setMessage(success);
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : "YouTube connection failed.");
    } finally { setBusy(false); }
  }

  return <section className="detail-panel">
    <h2>YouTube caption connection</h2>
    <p>Adding and playing a YouTube URL works without API credentials. Connect your Google account only to import captions from videos you can edit. For other videos, import SRT/VTT or upload your matching original media for transcription.</p>
    {loading ? <p role="status">Loading YouTube connection…</p> : failed ? <button type="button" className="button secondary" disabled={busy} onClick={() => void load()}>Reload connection status</button> : <p className="notice">{state.youtubeConnected ? "YouTube account connected" : state.youtubeConfigured ? "Credentials saved · connect your Google account next" : "YouTube account not connected · manual subtitles are available"}</p>}
    <ol>
      <li>Enable <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noreferrer">YouTube Data API v3</a> in your Google Cloud project.</li>
      <li>Configure the Google OAuth consent screen. If the app is in testing, add your Google account as a test user.</li>
      <li>Create a Web application OAuth client and add this exact redirect URI: <code style={{ overflowWrap: "anywhere" }}>{redirect}</code></li>
      <li>Save the client ID and secret below, then connect your Google account.</li>
    </ol>
    <form className="admin-form" onSubmit={event => {
      event.preventDefault();
      void send({ action: "youtube-save", youtubeClientId: id, youtubeClientSecret: secret }, dirty ? "YouTube credentials saved. Connect your Google account to finish." : "Saved credentials kept.");
    }}>
      <fieldset className="provider-fields" disabled={busy || loading}>
        <legend>Google OAuth credentials</legend>
        <label>Client ID<input type="password" autoComplete="new-password" maxLength={500} value={id} onChange={event => setId(event.target.value)} placeholder={state.youtubeConfigured ? "Saved — leave blank to keep" : "Web application client ID"} /></label>
        <label>Client secret<input type="password" autoComplete="new-password" maxLength={500} value={secret} onChange={event => setSecret(event.target.value)} placeholder={state.youtubeConfigured ? "Saved — leave blank to keep" : "OAuth client secret"} /></label>
        {dirty && state.youtubeConnected && <p>Saving replacement credentials disconnects the current account. Connect it again after saving.</p>}
        <button className="button primary">Save YouTube credentials</button>
      </fieldset>
    </form>
    <div className="admin-actions">
      {state.youtubeConfigured && !dirty && !loading && !busy && <a className="button secondary" href="/api/admin/youtube-oauth/connect">{state.youtubeConnected ? "Reconnect YouTube account" : "Connect YouTube account"}</a>}
      {state.youtubeConnected && <>
        <button type="button" className="button secondary" disabled={busy || loading || dirty} onClick={() => void send({ action: "youtube-test" }, "YouTube authorization test passed.")}>Test YouTube authorization</button>
        <button type="button" className="button danger" disabled={busy || loading || dirty} onClick={() => {
          if (confirm("Remove this app’s saved YouTube connection? Existing lessons and transcripts remain available.")) void send({ action: "youtube-disconnect" }, "YouTube account disconnected. Saved lessons are kept.");
        }}>Disconnect</button>
      </>}
    </div>
    {dirty && <p>Save your changes before connecting or testing.</p>}
    <p role={failed ? "alert" : "status"}>{message}</p>
    <p>Keys are stored encrypted and are never displayed here. Caption imports use YouTube API quota. Testing authorizations can expire and require reconnecting.</p>
  </section>;
}
