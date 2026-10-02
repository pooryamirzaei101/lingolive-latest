"use client";

import { useState } from "react";
import { InteractiveEnglish } from "@/components/interactive-english";
import type { SpeakingExample } from "@/lib/ielts-speaking";

export function IeltsSpeakingLesson({example,audioSrc}:{example:SpeakingExample;audioSrc:string|null}){
  const [showTranslation,setShowTranslation]=useState(true);
  return <div className="speaking-example">
    <div className="speaking-audio-card">
      <span className="section-eyebrow">MODEL ANSWER AUDIO</span>
      {audioSrc?<audio controls controlsList="nodownload" preload="metadata" src={audioSrc} aria-label={`Model answer audio for ${example.question}`}>Your browser cannot play this audio.</audio>:<p>No audio has been added to this draft yet. Read the model answer below.</p>}
    </div>
    <div className="speaking-prompt"><span className="section-eyebrow">QUESTION</span><h2>{example.question}</h2>{example.cue&&<p>{example.cue}</p>}</div>
    <div className="speaking-answer detail-panel"><div className="speaking-answer-head"><h2>Model answer</h2><label><input type="checkbox" checked={showTranslation} onChange={event=>setShowTranslation(event.target.checked)}/> Persian translation</label></div><p className="speaking-answer-text"><InteractiveEnglish text={example.answer} translation={example.translation}/></p>{showTranslation&&example.translation&&<p className="speaking-translation" lang="fa" dir="rtl">{example.translation}</p>}<p className="speaking-note">Tap a word to hear it. Double-tap or hold to see its meaning. This is a practice model, not an official IELTS answer.</p></div>
  </div>
}
