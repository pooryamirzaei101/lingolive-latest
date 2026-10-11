"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
type Recording={id:string;lessonId:string;createdAt:number};
export function SpeakingRecordingsList({initial,titles}:{initial:Recording[];titles:Record<string,string>}){
  const [records,setRecords]=useState(initial),[deleting,setDeleting]=useState<string|null>(null),[message,setMessage]=useState("");
  async function remove(id:string){
    if(!window.confirm("Delete this private recording permanently?"))return;
    setDeleting(id);setMessage("");
    try{const response=await fetch(`/api/speaking-recordings/${id}`,{method:"DELETE"});if(!response.ok)throw new Error();setRecords(current=>current.filter(item=>item.id!==id));setMessage("Recording deleted.")}
    catch{setMessage("Could not delete the recording. Please try again.")}finally{setDeleting(null)}
  }
  return <><p role="status">{message}</p>{records.length===0?<p>No recordings yet. Choose a speaking video and press Start recording.</p>:<div className="recording-list">{records.map(item=><article className="recording-item" key={item.id}><div><strong>{titles[item.lessonId]||"Speaking video"}</strong><span>{new Date(item.createdAt).toLocaleString()}</span><audio onContextMenu={event=>event.preventDefault()} controls controlsList="nodownload" preload="none" src={`/api/speaking-recordings/${item.id}`} aria-label={`Your recording from ${new Date(item.createdAt).toLocaleString()}`}/><a href={`/video-lessons/${item.lessonId}`}>Open video</a></div><button type="button" aria-label="Delete recording" title="Delete recording" disabled={deleting!==null} onClick={()=>remove(item.id)}><Trash2 size={18}/></button></article>)}</div>}</>
}
