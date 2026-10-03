"use client";
import { useState } from "react";
import { Play, Square } from "lucide-react";
import { InteractiveEnglish } from "@/components/interactive-english";
import type { QuickTip } from "@/lib/quick-tips";

export function QuickTipLesson({tip}:{tip:QuickTip}){
  const [showTranslation,setShowTranslation]=useState(true),[speaking,setSpeaking]=useState(false),[message,setMessage]=useState("");
  function toggleSpeech(){if(speaking){window.speechSynthesis.cancel();setSpeaking(false);return}if(!("speechSynthesis" in window)){setMessage("Audio playback is unavailable in this browser.");return}const utterance=new SpeechSynthesisUtterance(`${tip.title}. ${tip.body} ${tip.example}`);utterance.lang="en-US";utterance.rate=.85;utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>{setSpeaking(false);setMessage("Could not play the sample audio.")};window.speechSynthesis.speak(utterance);setSpeaking(true);setMessage("")}
  return <div className="speaking-example">
    <div className="speaking-audio-card"><span className="section-eyebrow">LISTEN TO THE TIP</span>{tip.audioKey?<audio controls controlsList="nodownload" preload="metadata" src={`/api/quick-tips/${tip.id}/audio`} aria-label={`Audio for ${tip.title}`}>Your browser cannot play this audio.</audio>:<button type="button" className="button secondary" onClick={toggleSpeech}>{speaking?<Square size={17}/>:<Play size={17}/>} {speaking?"Stop sample audio":"Play sample audio"}</button>}{message&&<p role="status">{message}</p>}</div>
    <div className="speaking-answer detail-panel"><div className="speaking-answer-head"><h2>Read the tip</h2><label><input type="checkbox" checked={showTranslation} onChange={event=>setShowTranslation(event.target.checked)}/> Persian translation</label></div><p className="speaking-answer-text"><InteractiveEnglish text={tip.body} translation={tip.translation}/></p>{showTranslation&&tip.translation&&<p className="speaking-translation" lang="fa" dir="rtl">{tip.translation}</p>}{tip.example&&<div className="quick-tip-example"><span className="section-eyebrow">EXAMPLE</span><p className="speaking-answer-text"><InteractiveEnglish text={tip.example} translation={tip.exampleTranslation}/></p>{showTranslation&&tip.exampleTranslation&&<p className="speaking-translation" lang="fa" dir="rtl">{tip.exampleTranslation}</p>}</div>}<p className="speaking-note">Tap a word to hear it. Double-tap or hold to see its meaning and save it to Word Bank.</p></div>
  </div>
}
