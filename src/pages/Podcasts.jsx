import { useEffect, useMemo, useRef, useState } from "react";
import BackButton from "../components/BackButton";

const EPISODE = {
  title: "A Productive Morning",
  level: "Beginner",
  description: "Practice everyday routines with clear, natural English.",
  transcript: [
    "Every morning, I wake up at seven o'clock.",
    "I open the curtains and take a deep breath.",
    "Then I make a cup of coffee and plan my day.",
    "I choose three important tasks to finish before lunch.",
    "Starting slowly helps me feel calm and focused.",
  ],
};

function PodcastPlayer() {
  const [playing,setPlaying]=useState(false),[rate,setRate]=useState(1),[active,setActive]=useState(0),[word,setWord]=useState(0),[supported,setSupported]=useState(true);
  const runRef=useRef(0), activeRef=useRef(0), rateRef=useRef(1);
  const words=useMemo(()=>EPISODE.transcript.map(line=>line.split(/\s+/)),[]);

  useEffect(()=>()=>{runRef.current+=1;window.speechSynthesis?.cancel()},[]);
  useEffect(()=>{activeRef.current=active},[active]);
  useEffect(()=>{rateRef.current=rate},[rate]);

  function speakFrom(start=activeRef.current){
    if(!("speechSynthesis" in window)){setSupported(false);return}
    const id=++runRef.current;window.speechSynthesis.cancel();setActive(start);activeRef.current=start;setWord(0);setPlaying(true);
    const speakLine=(index)=>{
      if(id!==runRef.current||index>=EPISODE.transcript.length){setPlaying(false);return}
      setActive(index);activeRef.current=index;setWord(0);
      const utterance=new SpeechSynthesisUtterance(EPISODE.transcript[index]);
      utterance.lang="en-US";utterance.rate=rateRef.current;
      utterance.onboundary=(event)=>{if(id!==runRef.current)return;const before=EPISODE.transcript[index].slice(0,event.charIndex);setWord(before.trim()?before.trim().split(/\s+/).length:0)};
      utterance.onend=()=>{if(id===runRef.current)speakLine(index+1)};
      utterance.onerror=()=>{if(id===runRef.current)setPlaying(false)};
      window.speechSynthesis.speak(utterance);
    };
    speakLine(start);
  }
  function toggle(){if(playing){runRef.current+=1;window.speechSynthesis.cancel();setPlaying(false)}else speakFrom(activeRef.current)}
  function restart(){speakFrom(0)}
  function chooseRate(value){setRate(value);rateRef.current=value;if(playing)speakFrom(activeRef.current)}

  return <section className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
    <aside className="rounded-[24px] bg-[#0d4d36] p-7 text-white shadow-xl h-fit lg:sticky lg:top-24">
      <div className="h-44 rounded-2xl bg-gradient-to-br from-emerald-300 to-amber-200 grid place-items-center text-7xl">🎙️</div>
      <span className="mt-6 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider">{EPISODE.level} podcast</span>
      <h2 className="mt-3 font-serif text-3xl font-bold">{EPISODE.title}</h2><p className="mt-2 leading-7 text-emerald-100">{EPISODE.description}</p>
      <div className="mt-6 flex gap-3"><button onClick={toggle} className="flex-1 rounded-xl bg-white py-3 font-bold text-[#0d4d36]">{playing?"Pause":"Play episode"}</button><button onClick={restart} aria-label="Restart episode" className="rounded-xl border border-white/25 px-4">↺</button></div>
      <label className="mt-5 flex items-center justify-between text-sm font-bold">Playback speed<select value={rate} onChange={e=>chooseRate(Number(e.target.value))} className="rounded-lg bg-white/10 border border-white/20 p-2"><option className="text-black" value="0.75">0.75×</option><option className="text-black" value="1">1×</option><option className="text-black" value="1.25">1.25×</option><option className="text-black" value="1.5">1.5×</option></select></label>
      {!supported&&<p className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-800">Your browser does not support synchronized speech playback.</p>}
    </aside>
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-8 shadow-lg"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.15em] text-[#176b4d]">Interactive transcript</p><h2 className="mt-2 text-2xl font-bold">Listen and follow along</h2></div><span aria-live="polite" className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-[#176b4d]">{playing?"Speaking now":"Ready"}</span></div><p className="mt-2 text-slate-500">The highlighted words follow the voice. Select any sentence to continue from there.</p>
      <div className="mt-7 space-y-3">{EPISODE.transcript.map((line,index)=><button type="button" onClick={()=>speakFrom(index)} key={line} className={`w-full rounded-2xl border p-5 text-left leading-8 transition ${active===index?"border-[#176b4d] bg-emerald-50 shadow-sm":"border-slate-200 hover:border-emerald-300"}`}><span className="mr-3 text-xs font-black text-slate-400">{String(index+1).padStart(2,"0")}</span>{words[index].map((item,itemIndex)=><span key={`${item}-${itemIndex}`} className={active===index&&playing&&itemIndex<=word?"rounded bg-amber-200 px-0.5 text-slate-950":""}>{item}{" "}</span>)}</button>)}</div>
    </div>
  </section>
}

export default function Podcasts(){return <main className="min-h-screen bg-[#f4f8f5] px-4 py-8 sm:px-6"><div className="mx-auto max-w-6xl"><BackButton/><header className="mt-6 rounded-[24px] border border-slate-200 bg-white p-7 sm:p-10 shadow-sm"><span className="text-xs font-black uppercase tracking-[.16em] text-[#176b4d]">LingoLive listening studio</span><h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight">Podcasts that speak with the transcript.</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Play a lesson and follow each word in real time. Change speed or select any sentence without losing your place.</p></header><PodcastPlayer/></div></main>}
