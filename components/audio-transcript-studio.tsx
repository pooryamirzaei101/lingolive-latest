"use client";
import {useEffect,useState} from 'react';
import {TranscriptEditor} from '@/components/transcript-editor';
export function AudioTranscriptStudio({section,id}:{section:string;id:string}){const [initial,setInitial]=useState<string|null>(null);useEffect(()=>{fetch(`/api/admin/media-transcripts/${section}/${id}`).then(r=>r.json() as Promise<any>).then(d=>{if(d.transcript)setInitial(d.transcript)}).catch(()=>{})},[section,id]);return <details className="transcript-admin"><summary>Audio transcript: API, SRT, or manual text</summary>{initial!==null?<TranscriptEditor id={id} section={section} initial={initial}/>:<p>Save this lesson first to add a timed transcript.</p>}</details>}
