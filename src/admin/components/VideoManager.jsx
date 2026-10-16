import { useState } from "react";
import { createVideo, getYouTubeId } from "../data/videoStore";

export default function VideoManager({ videos, onAdd, onDelete }) {
  const [form, setForm] = useState({ title: "", url: "", description: "" });

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim() || !getYouTubeId(form.url)) {
      window.alert("Enter a title and a valid YouTube link.");
      return;
    }
    onAdd(createVideo(form));
    setForm({ title: "", url: "", description: "" });
  }

  return <section id="video-manager" className="rounded-xl bg-white p-6 shadow"><h2 className="text-2xl font-bold">Video Library</h2><p className="mt-1 text-gray-600">Add approved YouTube lessons for students. The player will request English captions automatically.</p><form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-lg border p-3" placeholder="Video lesson title" /><input required value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} className="rounded-lg border p-3" placeholder="YouTube URL" /><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-lg border p-3 md:col-span-2" rows="2" placeholder="Short description (optional)" /><button className="w-fit rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Add video lesson</button></form><div className="mt-6 divide-y rounded-lg border">{videos.length ? videos.map((video) => <div key={video.id} className="flex items-center justify-between gap-4 p-4"><div><p className="font-semibold">{video.title}</p><p className="mt-1 text-sm text-gray-600">{video.description || "No description"}</p></div><button type="button" onClick={() => onDelete(video.id)} className="rounded border border-red-200 px-3 py-2 text-red-700 hover:bg-red-50">Delete</button></div>) : <p className="p-4 text-gray-600">No video lessons have been added yet.</p>}</div></section>;
}
