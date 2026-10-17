"use client";
import { useEffect, useRef, useState } from "react";
import { normalizeEnglish, relatedPhrase, translateWord, phraseTranslations } from "@/lib/word-translations";

type Panel={term:string;meaning:string|null;language:string;loading?:boolean;phrase?:[string,string]|null;context?:string;audioError?:boolean;approximate?:boolean;saved?:boolean;saveError?:string};
export function InteractiveEnglish({text,translation,overrides,className,tapForMeaning=false,phraseAction=false}:{text:string;translation?:string;overrides?:Record<string,string>;className?:string;tapForMeaning?:boolean;phraseAction?:boolean}){
  const [panel,setPanel]=useState<Panel|null>(null),[saving,setSaving]=useState(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null),held=useRef(false),lastTap=useRef({word:"",at:0}),requestId=useRef(0);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
  function show(term:string,selected=false){
    const key=normalizeEnglish(term),exact=translateWord(key,overrides)||phraseTranslations[key]||null,approximate=selected&&key.includes(" ")&&!exact,meaning=exact||(approximate?key.split(" ").map(word=>translateWord(word,overrides)||word).join(" · "):null),currentRequest=++requestId.current;
    setPanel({term,meaning,language:"fa",loading:true,approximate,phrase:selected?null:relatedPhrase(key,text),context:translation});
    fetch("/api/word-translation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({word:term,manualPersian:exact||""})}).then(async response=>{
      if(!response.ok)throw new Error();return response.json() as Promise<{language:string;translation:string}>;
    }).then(data=>{if(currentRequest===requestId.current)setPanel(current=>current?.term===term?{...current,meaning:data.translation||null,language:data.language,loading:false,phrase:data.language==="fa"?current.phrase:null,context:data.language==="fa"?current.context:undefined}:current)}).catch(()=>{if(currentRequest===requestId.current)setPanel(current=>current?.term===term?{...current,loading:false}:current)});
  }
  function speak(word:string){if(!("speechSynthesis" in window)){show(word);setPanel(current=>current?.term===word?{...current,audioError:true}:current);return}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(word);utterance.lang="en-US";utterance.rate=.85;window.speechSynthesis.speak(utterance)}
  function tap(word:string){if(tapForMeaning){show(word);return}if(held.current){held.current=false;return}const now=Date.now();if(lastTap.current.word===word&&now-lastTap.current.at<360){show(word);lastTap.current={word:"",at:0}}else{lastTap.current={word,at:now};speak(word)}}
  function selectedPhrase(){const selected=window.getSelection()?.toString().trim()||"";if(selected.includes(" ")&&normalizeEnglish(text).includes(normalizeEnglish(selected)))show(selected,true)}
  async function saveWord(){
    if(!panel||saving)return;
    const term=panel.term;setSaving(true);
    try{
      const response=await fetch("/api/word-bank",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({word:term,manualPersian:panel.language==="fa"?panel.meaning||"":"",source:window.location.pathname,exampleSentence:text,lessonTitle:document.querySelector("h1")?.textContent||"",sourceSection:window.location.pathname.split("/")[1]||""})});
      const data=await response.json() as {error?:string};
      if(!response.ok)throw new Error(data.error||"Could not save this word.");
      setPanel(current=>current?.term===term?{...current,saved:true,saveError:undefined}:current);
    }catch(error){setPanel(current=>current?.term===term?{...current,saveError:error instanceof Error?error.message:"Could not save this word."}:current)}finally{setSaving(false)}
  }
  const parts=text.split(/(\p{L}+(?:[’'\-]\p{L}+)*)/gu);
  return <span className={`interactive-english ${className||""}`} onMouseUp={selectedPhrase} onTouchEnd={selectedPhrase}>{parts.map((part,index)=>/^\p{L}+(?:[’'\-]\p{L}+)*$/u.test(part)?<button type="button" className="interactive-word" key={index} title={`Hear ${part}. Double-tap or hold for meaning.`} aria-label={`${part}: tap to hear, double-tap or hold for meaning`} onClick={()=>tap(part)} onDoubleClick={()=>show(part)} onContextMenu={event=>{event.preventDefault();show(part)}} onPointerDown={event=>{if(event.pointerType==="touch"||event.pointerType==="pen"){held.current=false;timer.current=setTimeout(()=>{held.current=true;show(part)},550)}}} onPointerUp={()=>{if(timer.current)clearTimeout(timer.current)}} onPointerCancel={()=>{if(timer.current)clearTimeout(timer.current)}} onPointerLeave={()=>{if(timer.current)clearTimeout(timer.current)}}>{part}</button>:<span key={index}>{part}</span>)}{phraseAction&&<button type="button" className="flashcard-phrase-action" onClick={()=>show(text,true)}>Translate full phrase</button>}{panel&&<span className="word-meaning" role="status"><span className="word-meaning-head"><strong>{panel.term}</strong><button type="button" aria-label="Close word meaning" onClick={()=>{requestId.current++;setPanel(null)}}>×</button></span>{panel.approximate&&<span className="word-context">Word-by-word meaning:</span>}{panel.loading?<span>Checking translation…</span>:panel.meaning?<span lang={panel.language} dir={panel.language==="fa"||panel.language==="ar"||panel.language==="ur"?"rtl":"ltr"}>{panel.meaning}</span>:<span>Translation is not available in your selected language yet.</span>}{panel.phrase&&<span className="word-phrase" lang="fa" dir="rtl">{panel.phrase[0]}: {panel.phrase[1]}</span>}{panel.context&&<span className="word-context" lang="fa" dir="rtl">Sentence: {panel.context}</span>}{panel.audioError&&<span>Pronunciation is unavailable in this browser.</span>}{<button type="button" className="word-bank-save" disabled={saving||panel.saved||panel.loading||!panel.meaning} onClick={saveWord}>{panel.saved?"Saved to Word Bank":saving?"Saving…":"Save to Word Bank"}</button>}{panel.saveError&&<span className="word-save-error">{panel.saveError} {panel.saveError.includes("Sign in")&&<a href="/login">Sign in</a>}</span>}</span>}</span>
}
