"use client";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {prepareAdminMedia,discardAdminMedia} from '@/lib/admin-upload-client';
import {AudioTranscriptStudio} from '@/components/audio-transcript-studio';

export function IeltsAudioEditor({id,audioKey}:{id:string;audioKey:string|null}){
 const router=useRouter(),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[version,setVersion]=useState(0);
 async function upload(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);let key:string|null=null;try{const prepared=await prepareAdminMedia(e.currentTarget,'audio',setMessage);key=prepared.key;const response=await fetch(`/api/admin/ielts-speaking/${id}/audio`,{method:'POST',body:prepared.body}),data=await response.json() as {error?:string};if(!response.ok)throw Error(data.error||'Upload failed.');key=null;const process=await fetch(`/api/admin/video-lessons/${id}/processing?section=ielts`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'start',languages:[]})}),result=await process.json() as {error?:string};setVersion(n=>n+1);setMessage(process.ok?'English transcription started. Review timestamps before publishing.':`Audio saved. ${result.error||'Open the transcript editor to generate timestamps manually.'}`);router.refresh()}catch(error){if(key)await discardAdminMedia(key);setMessage(error instanceof Error?error.message:'Could not upload audio.')}finally{setBusy(false)}}
 return <div className="admin-form"><h3>Audio and timestamped transcript</h3>{audioKey&&<audio controls src={`/api/ielts-speaking/${id}/audio`} aria-label="Preview lesson audio"/>}<form onSubmit={upload}><label>Upload or replace MP3, WAV, M4A, AAC, OGG (up to 100 MB)<input name="audio" type="file" accept="audio/mpeg,audio/wav,audio/mp4,audio/aac,audio/ogg" required/></label><button className="button secondary" disabled={busy}>{busy?'Uploading…':'Upload and generate English transcript'}</button></form><p role="status">{message}</p><AudioTranscriptStudio key={version} section="ielts" id={id}/></div>
}
