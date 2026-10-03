"use client";

import { useState } from "react";
import { Play, Square } from "lucide-react";
import { InteractiveEnglish } from "@/components/interactive-english";
import type { SpeakingExample } from "@/lib/ielts-speaking";

export function IeltsSpeakingLesson({example,audioSrc}:{example:SpeakingExample;audioSrc:string|null}){
  const [showTranslation,setShowTranslation]=useState(true),[speaking,setSpeaking]=useState(false),[audioMessage,setAudioMessage]=useState("");
  function playSample(){if(!("speechSynthesis" in window)){setAudioMessage("Audio playback is unavailable in this browser.");return}window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(example.answer);voice.lang="en-US";voice.rate=.85;voice.onend=()=>setSpeaking(false);voice.onerror=()=>setSpeaking(false);window.speechSynthesis.speak(voice);setSpeaking(true);setAudioMessage("")}
  function stopSample(){window.speechSynthesis.cancel();setSpeaking(false)}
  async function audioError(){
    if(!audioSrc)return;
    try{
      const response=await fetch(audioSrc,{headers:{Range:"bytes=0-0"},cache:"no-store"});
      setAudioMessage(response.ok?"This audio could not be decoded by your browser. Please upload an MP3 or M4A file.":`Audio could not load (error ${response.status}). Please check the file in Administration.`);
    }catch{setAudioMessage("The audio connection failed. Please try again.");}
  }
  return <div className="speaking-example">
    <div className="speaking-audio-card">
      <span className="section-eyebrow">MODEL ANSWER AUDIO</span>
      {audioSrc?<><audio controls controlsList="nodownload" preload="metadata" src={audioSrc} onLoadedMetadata={()=>setAudioMessage("")} onError={audioError} aria-label={`Model answer audio for ${example.question}`}>Your browser cannot play this audio.</audio><p role="status">{audioMessage}</p></>:example.id.startsWith("sample-")?<><button type="button" className="button secondary" onClick={speaking?stopSample:playSample}>{speaking?<Square size={17}/>:<Play size={17}/>} {speaking?"Stop sample audio":"Play sample audio"}</button><p role="status">{audioMessage}</p></>:<p>No audio has been added to this draft yet. Add model audio before publishing.</p>}
    </div>
    <div className="speaking-prompt"><span className="section-eyebrow">QUESTION</span><h2>{example.question}</h2>{example.cue&&<p>{example.cue}</p>}</div>
    <div className="speaking-answer detail-panel"><div className="speaking-answer-head"><h2>Model answer</h2><label><input type="checkbox" checked={showTranslation} onChange={event=>setShowTranslation(event.target.checked)}/> Persian translation</label></div><p className="speaking-answer-text"><InteractiveEnglish text={example.answer} translation={example.translation}/></p>{showTranslation&&example.translation&&<p className="speaking-translation" lang="fa" dir="rtl">{example.translation}</p>}<p className="speaking-note">Tap a word to hear it. Double-tap or hold to see its meaning and save it to Word Bank. This is a practice model, not an official IELTS answer.</p></div>
  </div>
}
