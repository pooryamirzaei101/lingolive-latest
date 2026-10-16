import { useMemo, useState } from "react";
import BackButton from "../components/BackButton";
import { getVideos } from "../admin/data/videoStore";

const SAMPLE_TRANSCRIPT = [
  "Hello and welcome to English practice.",
  "Today we are going to learn useful everyday expressions.",
  "Listen carefully, repeat the sentences, and practice speaking.",
];

const DICTIONARIES = {
  Persian: { hello: "سلام", welcome: "خوش آمدید", english: "انگلیسی", practice: "تمرین", today: "امروز", learn: "یاد گرفتن", useful: "مفید", everyday: "روزمره", expressions: "عبارت‌ها", listen: "گوش دادن", carefully: "با دقت", repeat: "تکرار کردن", sentences: "جمله‌ها", speaking: "صحبت کردن", and: "و", to: "به", we: "ما", are: "هستیم", going: "قرار است", the: "این / آن" },
  Spanish: { hello: "hola", welcome: "bienvenido", english: "inglés", practice: "práctica", today: "hoy", learn: "aprender", useful: "útil", everyday: "cotidiano", expressions: "expresiones", listen: "escuchar", carefully: "cuidadosamente", repeat: "repetir", sentences: "oraciones", speaking: "hablar", and: "y", to: "a", we: "nosotros", are: "somos", going: "ir", the: "el / la" },
};

function translateLine(line, dictionary) {
  return line.split(/(\s+)/).map((part) => dictionary[part.replace(/[^a-z']/gi, "").toLowerCase()] || part).join("");
}

export default function Videos() {
  const [videos] = useState(getVideos);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [language, setLanguage] = useState("Persian");
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT.join("\n"));
  const [selectedWord, setSelectedWord] = useState(null);
  const lines = useMemo(() => transcript.split("\n").map((line) => line.trim()).filter(Boolean), [transcript]);
  const dictionary = DICTIONARIES[language];
  const selectedVideo = videos.find((video) => video.id === selectedVideoId);
  const translation = selectedWord && (dictionary[selectedWord] || "No saved translation yet");

  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6"><div className="mx-auto max-w-7xl"><BackButton /><header className="mt-6 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow"><p className="font-semibold text-blue-100">VIDEO LEARNING LAB</p><h1 className="mt-2 text-4xl font-bold">Learn from YouTube videos</h1><p className="mt-3 max-w-3xl text-blue-100">Watch with English captions, read the transcript, choose a translation language, and tap a word to study it.</p></header>
    <section className="mt-6 rounded-xl bg-white p-5 shadow"><label className="block font-semibold" htmlFor="video-choice">Choose a video lesson</label><select id="video-choice" value={selectedVideoId} onChange={(event) => setSelectedVideoId(event.target.value)} className="mt-3 w-full rounded-lg border p-3"><option value="">Select a video added by your teacher</option>{videos.map((video) => <option key={video.id} value={video.id}>{video.title}</option>)}</select>{selectedVideo?.description && <p className="mt-3 text-gray-600">{selectedVideo.description}</p>}</section>
    <section className="mt-6 overflow-hidden rounded-2xl bg-black shadow">{selectedVideo ? <div className="aspect-video"><iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?cc_load_policy=1&cc_lang_pref=en&rel=0`} title={selectedVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div> : <div className="flex aspect-video items-center justify-center px-8 text-center text-slate-300">Your teacher has not added a video yet. Approved YouTube lessons appear here automatically.</div>}</section>
    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_260px]"><div className="rounded-2xl bg-white p-6 shadow"><h2 className="text-xl font-bold">English transcript</h2><p className="mt-1 text-sm text-gray-600">Tap any highlighted word for a quick translation.</p><div className="mt-5 space-y-3">{lines.map((line, lineIndex) => <p key={`${line}-${lineIndex}`} className="rounded-lg bg-slate-50 p-4 leading-8">{line.split(/(\s+)/).map((part, index) => { const word = part.replace(/[^a-z']/gi, "").toLowerCase(); return word ? <button key={`${part}-${index}`} type="button" onClick={() => setSelectedWord(word)} className="rounded px-0.5 font-medium text-blue-700 hover:bg-blue-100 hover:underline">{part}</button> : <span key={`${part}-${index}`}>{part}</span>; })}</p>)}</div></div><div className="rounded-2xl bg-white p-6 shadow"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Translation</h2><p className="mt-1 text-sm text-gray-600">Word-by-word learning aid.</p></div><select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-lg border p-2">{Object.keys(DICTIONARIES).map((item) => <option key={item}>{item}</option>)}</select></div><div className="mt-5 space-y-3">{lines.map((line, index) => <p key={`${line}-${index}`} className="rounded-lg bg-indigo-50 p-4 leading-8 text-indigo-950">{translateLine(line, dictionary)}</p>)}</div></div><aside className="rounded-2xl bg-white p-6 shadow"><h2 className="text-xl font-bold">Word card</h2>{selectedWord ? <div className="mt-5"><p className="text-2xl font-bold text-blue-700">{selectedWord}</p><p className="mt-2 text-lg">{translation}</p><p className="mt-4 text-sm text-gray-600">Choose a word in the English transcript to update this card.</p></div> : <p className="mt-5 text-gray-600">Tap a word in the English transcript to see its {language} meaning.</p>}</aside></section>
    <details className="mt-6 rounded-xl bg-white p-6 shadow"><summary className="cursor-pointer font-semibold">Edit the interactive English transcript</summary><p className="mt-3 text-sm text-gray-600">Paste one subtitle sentence per line. This text powers the two panels and word tapping; YouTube captions remain inside the video player.</p><textarea value={transcript} onChange={(event) => setTranscript(event.target.value)} rows="8" className="mt-4 w-full rounded-lg border p-3" /></details>
  </div></main>;
}
