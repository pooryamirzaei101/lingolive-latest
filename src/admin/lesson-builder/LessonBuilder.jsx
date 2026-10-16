import { useState } from "react";

const BLOCK_TYPES = ["Heading", "Paragraph", "Vocabulary", "Grammar", "Exercise", "Transcript", "Translation", "Resource"];

export default function LessonBuilder({ onSave }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Grammar");
  const [level, setLevel] = useState("Beginner");
  const [description, setDescription] = useState("");
  const [blocks, setBlocks] = useState([]);
  const addBlock = () => setBlocks((items) => [...items, { id: crypto.randomUUID(), type: "Paragraph", content: "" }]);
  const updateBlock = (id, patch) => setBlocks((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  const removeBlock = (id) => setBlocks((items) => items.filter((item) => item.id !== id));
  const submit = (event) => { event.preventDefault(); if (!title.trim()) return; onSave({ title, category, level, description, blocks, status: "Draft" }); setTitle(""); setDescription(""); setBlocks([]); };
  return <form onSubmit={submit} className="rounded-xl bg-white p-6 shadow"><div className="flex items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">Lesson Builder</h2><p className="mt-1 text-gray-600">Compose a lesson from reusable learning blocks.</p></div><button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700">Save draft</button></div><div className="mt-6 grid gap-4 md:grid-cols-3"><input required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-lg border p-3 md:col-span-3" placeholder="Lesson title" /><select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border p-3">{["Grammar", "IELTS", "Stories", "Podcasts", "Vocabulary", "Flashcards", "Conversation", "Courses"].map((item) => <option key={item}>{item}</option>)}</select><select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-lg border p-3">{["Beginner", "Intermediate", "Advanced"].map((item) => <option key={item}>{item}</option>)}</select><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-lg border p-3" placeholder="Short description" /></div><div className="mt-6 space-y-4">{blocks.map((block, index) => <div key={block.id} className="rounded-lg border p-4"><div className="flex gap-3"><select value={block.type} onChange={(e) => updateBlock(block.id, { type: e.target.value })} className="rounded border p-2">{BLOCK_TYPES.map((item) => <option key={item}>{item}</option>)}</select><span className="flex-1 font-semibold">Block {index + 1}</span><button type="button" onClick={() => removeBlock(block.id)} className="text-red-600">Remove</button></div><textarea value={block.content} onChange={(e) => updateBlock(block.id, { content: e.target.value })} className="mt-3 w-full rounded border p-3" rows="3" placeholder="Write this block's content" /></div>)}</div><button type="button" onClick={addBlock} className="mt-5 rounded-lg border border-blue-600 px-4 py-2 text-blue-700 hover:bg-blue-50">+ Add block</button></form>;
}
