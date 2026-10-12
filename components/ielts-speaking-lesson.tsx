"use client";
import {TimedAudioLesson} from "@/components/timed-audio-lesson";
import {LearningTranslation} from "@/components/learning-translation";

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
      {audioSrc?<><TimedAudioLesson section="ielts" id={example.id} src={audioSrc}/><p role="status">{audioMessage}</p></>:example.id.startsWith("sample-")?<><button type="button" className="button secondary" onClick={speaking?stopSample:playSample}>{speaking?<Square size={17}/>:<Play size={17}/>} {speaking?"Stop sample audio":"Play sample audio"}</button><p role="status">{audioMessage}</p></>:<p>No audio has been added to this draft yet. Add model audio before publishing.</p>}
    </div>
    <div className="speaking-prompt"><span className="section-eyebrow">QUESTION</span><h2>{example.question}</h2>{example.cue&&<p>{example.cue}</p>}</div>
    <div className="speaking-answer detail-panel"><div className="speaking-answer-head"><h2>Model answer</h2><label><input type="checkbox" checked={showTranslation} onChange={event=>setShowTranslation(event.target.checked)}/> Translation</label></div><p className="speaking-answer-text"><InteractiveEnglish text={example.answer} translation={example.translation}/></p>{showTranslation&&<LearningTranslation section="ielts" id={example.id} field="answer" manual={example.translation}/>}<p className="speaking-note">Tap a word to hear it. Double-tap or hold to see its meaning and save it to Word Bank. This is a practice model, not an official IELTS answer.</p>{example.vocabulary?.trim()&&<div className="ielts-vocabulary"><h3>Key IELTS vocabulary and structures</h3>{example.vocabulary.split(/\n|,/).map(s=>s.trim()).filter(Boolean).map((term,i)=><p key={i}><InteractiveEnglish text={term} tapForMeaning phraseAction/></p>)}</div>}</div>
  </div>
}
