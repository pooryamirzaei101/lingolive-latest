"use client";
import {useEffect,useState} from 'react';
import {TranscriptEditor} from '@/components/transcript-editor';
export function AudioTranscriptStudio({section,id}:{section:string;id:string}){const [initial,setInitial]=useState<string|null>(null);useEffect(()=>{fetch(`/api/admin/media-transcripts/${section}/${id}`).then(r=>r.json() as Promise<any>).then(d=>{if(d.transcript)setInitial(d.transcript)}).catch(()=>{})},[section,id]);return <details className="transcript-admin" open={section==="ielts"}><summary>Audio transcript: generate, review, and translate</summary>{initial!==null?<TranscriptEditor id={id} section={section} initial={initial} autoPoll={section==="ielts"}/>:<p>Save this lesson first to add a timed transcript.</p>}</details>}
