"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Mic2, Pause, Play, Square } from "lucide-react";

export function SpeakingRecorder({lessonId,signedIn,onStart,video,allowCamera=false,returnPath}:{lessonId:string;signedIn:boolean;onStart?:()=>void;video?:RefObject<HTMLVideoElement|null>;allowCamera?:boolean;returnPath?:string}){
  const recorder=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),timer=useRef<ReturnType<typeof setInterval>|null>(null);
  const playback=useRef<HTMLMediaElement|null>(null),preview=useRef<HTMLVideoElement>(null),wasMuted=useRef(false),recordWasMuted=useRef(false);
  const [recording,setRecording]=useState(false),[seconds,setSeconds]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[latestId,setLatestId]=useState<string|null>(null),[latestMime,setLatestMime]=useState('audio/webm'),[playing,setPlaying]=useState(false),[muted,setMuted]=useState(false),[useCamera,setUseCamera]=useState(false);
  useEffect(()=>{if(!signedIn)return;let active=true;fetch(`/api/speaking-recordings?lessonId=${encodeURIComponent(lessonId)}`,{cache:"no-store"}).then(response=>{if(!response.ok)throw new Error("Load failed");return response.json() as Promise<{recordings?:{id:string;mimeType:string}[]}>}).then(data=>{if(active){setLatestId(data.recordings?.[0]?.id||null);setLatestMime(data.recordings?.[0]?.mimeType||'audio/webm')}}).catch(()=>{if(active)setMessage("Saved recordings could not be loaded.")});return()=>{active=false}},[lessonId,signedIn]);
  useEffect(()=>()=>{if(timer.current)clearInterval(timer.current);if(recorder.current?.state==="recording")recorder.current.stop();stream.current?.getTracks().forEach(track=>track.stop())},[]);
  useEffect(()=>{if(recording&&preview.current&&stream.current){preview.current.srcObject=stream.current;preview.current.play().catch(()=>{})}},[recording,useCamera]);
  function stopPlayback(){playback.current?.pause();setPlaying(false);if(video?.current){video.current.pause();video.current.muted=wasMuted.current}}
  async function playRecording(){
    if(!latestId||!playback.current)return;
    if(playing){stopPlayback();return}
    const player=playback.current;
    try{
      player.currentTime=0;
      if(video?.current){wasMuted.current=video.current.muted;video.current.muted=true;video.current.currentTime=0}
      await player.play();setPlaying(true);setMessage("");
      video?.current?.play().catch(()=>{});
    }catch{if(video?.current)video.current.muted=wasMuted.current;setMessage("Could not play the recording. Please try again.")}
  }
  async function start(){
    if(!signedIn){window.location.href=`/login?return_to=${encodeURIComponent(returnPath||`/video-lessons/${lessonId}`)}`;return}
    if(playing)stopPlayback();
    if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==="undefined"){setMessage("This browser does not support microphone recording.");return}
    try{
      const media=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true},video:allowCamera&&useCamera?{facingMode:'user'}:false}),mime=(allowCamera&&useCamera?["video/webm","video/mp4"]:["audio/webm","audio/mp4","audio/ogg"]).find(type=>MediaRecorder.isTypeSupported(type));
      if(!mime){media.getTracks().forEach(track=>track.stop());setMessage("This browser cannot save a supported audio format.");return}
      if(video?.current){recordWasMuted.current=video.current.muted;video.current.muted=true;setMuted(true)}
      stream.current=media;if(preview.current){preview.current.srcObject=media;preview.current.play().catch(()=>{})}const chunks:BlobPart[]=[],instance=new MediaRecorder(media,{mimeType:mime});recorder.current=instance;
      instance.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
      instance.onstop=async()=>{
        media.getTracks().forEach(track=>track.stop());stream.current=null;if(preview.current)preview.current.srcObject=null;if(video?.current){video.current.muted=recordWasMuted.current;setMuted(recordWasMuted.current)};if(timer.current)clearInterval(timer.current);setRecording(false);
        const blob=new Blob(chunks,{type:mime});if(!blob.size){setMessage("No audio was recorded. Please try again.");return}
        setBusy(true);setMessage("Saving your recording…");
        try{
          const form=new FormData();form.set("lessonId",lessonId);form.set("audio",new File([blob],"speaking."+(mime.endsWith('mp4')?(mime.startsWith('video/')?'mp4':'m4a'):mime==="audio/ogg"?"ogg":"webm"),{type:mime}));
          const response=await fetch("/api/speaking-recordings",{method:"POST",body:form}),data=await response.json() as {id?:string;mimeType?:string;error?:string};
          if(!response.ok)throw new Error(data.error||"Save failed");if(data.id)setLatestId(data.id);setLatestMime(data.mimeType||mime);setMessage("Recording saved to My Voices. Press Play Recording to compare.");
        }catch(error){setMessage(error instanceof Error?error.message:"Could not save your recording.")}finally{setBusy(false)}
      };
      instance.start(1000);onStart?.();setSeconds(0);setRecording(true);setMessage("");
      timer.current=setInterval(()=>setSeconds(value=>{if(value>=119&&recorder.current?.state==="recording")recorder.current.stop();return Math.min(120,value+1)}),1000);
    }catch{setMessage("Microphone access was not granted. Allow it when you start recording.")}
  }
  function stop(){if(recorder.current?.state==="recording")recorder.current.stop()}
  return <div className="speaking-record-control">
    {allowCamera&&<label><input type="checkbox" checked={useCamera} disabled={recording||busy} onChange={e=>setUseCamera(e.target.checked)}/> Include webcam video in my recording</label>}
    {allowCamera&&recording&&useCamera&&<video ref={preview} muted playsInline className="speaking-camera-preview" aria-label="Webcam recording preview"/>}
    <div className="speaking-record-buttons">{video&&<button type="button" className="button secondary" disabled={recording||busy} aria-pressed={muted} onClick={()=>{if(video.current){video.current.muted=!video.current.muted;setMuted(video.current.muted)}}}>{muted?"Unmute video":"Mute video"}</button>}{recording?<button type="button" className="button danger" onClick={stop}><Square size={17}/> Stop recording · {Math.floor(seconds/60)}:{String(seconds%60).padStart(2,"0")}</button>:<button type="button" className="button primary" disabled={busy} onClick={start}><Mic2 size={18}/> Start recording</button>}
      <button type="button" className="button secondary" disabled={!latestId||recording||busy} onClick={playRecording} aria-label={playing?"Pause your recording":"Play your latest recording"}>{playing?<Pause size={18}/>:<Play size={18}/>} {playing?"Pause recording":"Play recording"}</button></div>
    {latestId&&(latestMime.startsWith('video/')?<video controls onContextMenu={event=>event.preventDefault()} key={latestId} ref={node=>{playback.current=node}} preload="none" src={`/api/speaking-recordings/${latestId}`} onEnded={()=>{setPlaying(false);if(video?.current){video.current.pause();video.current.muted=wasMuted.current}}} onError={()=>{setPlaying(false);setMessage("Could not play the recording. Please try again.")}} aria-label="Your latest speaking recording"/>:<audio onContextMenu={event=>event.preventDefault()} key={latestId} ref={node=>{playback.current=node}} preload="none" src={`/api/speaking-recordings/${latestId}`} onEnded={()=>{setPlaying(false);if(video?.current){video.current.pause();video.current.muted=wasMuted.current}}} onError={()=>{setPlaying(false);setMessage("Could not play the recording. Please try again.")}} aria-label="Your latest speaking recording"/>)}
    <p>Recording uses your microphone. The video is muted while you record.</p><a className="button secondary" href="/speaking-practice/recordings">My Voices</a>{message&&<p role="status">{message}</p>}
  </div>
}
