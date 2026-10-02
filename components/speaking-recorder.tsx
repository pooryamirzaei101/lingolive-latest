"use client";
import { useEffect, useRef, useState } from "react";
import { Mic2, Square } from "lucide-react";

export function SpeakingRecorder({lessonId,signedIn,onStart}:{lessonId:string;signedIn:boolean;onStart?:()=>void}){
  const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),timer=useRef<ReturnType<typeof setInterval>|null>(null);
  const [recording,setRecording]=useState(false),[seconds,setSeconds]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  useEffect(()=>()=>{if(timer.current)clearInterval(timer.current);if(recorder.current?.state==="recording")recorder.current.stop();stream.current?.getTracks().forEach(track=>track.stop())},[]);
  async function start(){
    if(!signedIn){window.location.href=`/login?return_to=${encodeURIComponent(`/video-lessons/${lessonId}`)}`;return}
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){setMessage("This browser does not support microphone recording.");return}
    try{
      const media=await navigator.mediaDevices.getUserMedia({audio:true}),mime=["audio/webm","audio/mp4","audio/ogg"].find(type=>MediaRecorder.isTypeSupported(type));
      if(!mime){media.getTracks().forEach(track=>track.stop());setMessage("This browser cannot save a supported audio format.");return}
      stream.current=media;const chunks:BlobPart[]=[],instance=new MediaRecorder(media,{mimeType:mime});recorder.current=instance;
      instance.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
      instance.onstop=async()=>{
        media.getTracks().forEach(track=>track.stop());stream.current=null;if(timer.current)clearInterval(timer.current);setRecording(false);
        const blob=new Blob(chunks,{type:mime});if(!blob.size){setMessage("No audio was recorded. Please try again.");return}
        setBusy(true);setMessage("Saving your recording…");
        try{
          const form=new FormData();form.set("lessonId",lessonId);form.set("audio",new File([blob],"speaking."+(mime==="audio/mp4"?"m4a":mime==="audio/ogg"?"ogg":"webm"),{type:mime}));
          const response=await fetch("/api/speaking-recordings",{method:"POST",body:form}),data=await response.json() as {error?:string};
          if(!response.ok)throw new Error(data.error||"Save failed");setMessage("Saved to My recordings.");
        }catch(error){setMessage(error instanceof Error?error.message:"Could not save your recording.")}finally{setBusy(false)}
      };
      instance.start(1000);onStart?.();setSeconds(0);setRecording(true);setMessage("");
      timer.current=setInterval(()=>setSeconds(value=>{if(value>=119&&recorder.current?.state==="recording")recorder.current.stop();return Math.min(120,value+1)}),1000);
    }catch{setMessage("Microphone access was not granted. Allow it when you start recording.")}
  }
  function stop(){if(recorder.current?.state==="recording")recorder.current.stop()}
  return <div className="speaking-record-control">
    {recording?<button type="button" className="button danger" onClick={stop}><Square size={17}/> Stop recording · {Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</button>:<button type="button" className="button primary" disabled={busy} onClick={start}><Mic2 size={18}/> Start recording</button>}
    {message&&<p role="status">{message}</p>}
  </div>
}
