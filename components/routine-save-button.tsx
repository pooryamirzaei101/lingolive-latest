"use client";
import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
export function RoutineSaveButton({lessonId,initial,signedIn}:{lessonId:string;initial:boolean;signedIn:boolean}){
  const [saved,setSaved]=useState(initial),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  async function toggle(){
    if(!signedIn){window.location.href=`/login?returnTo=${encodeURIComponent(`/daily-lessons/routines/${lessonId}`)}`;return}
    setBusy(true);setMessage("");try{const response=await fetch("/api/saved-routines",{method:saved?"DELETE":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lessonId})}),data=await response.json() as {error?:string};if(!response.ok)throw new Error(data.error||"Could not save lesson.");setSaved(!saved);setMessage(saved?"Removed from saved routines.":"Saved for review.")}catch(error){setMessage(error instanceof Error?error.message:"Could not save lesson.")}finally{setBusy(false)}
  }
  return <div className="routine-save"><button type="button" className="button secondary" onClick={toggle} disabled={busy}>{saved?<BookmarkCheck size={18}/>:<Bookmark size={18}/>} {saved?"Saved for review":"Save for review"}</button><span role="status">{message}</span></div>
}
