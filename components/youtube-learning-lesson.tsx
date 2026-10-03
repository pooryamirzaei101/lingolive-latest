"use client";
import {LearningTranslation} from "@/components/learning-translation";
import { useState } from "react";
import { InteractiveEnglish } from "@/components/interactive-english";
import type { TranscriptSegment } from "@/lib/video";
export function YouTubeLearningLesson({url,lines,title,id}:{id:string;url:string;lines:TranscriptSegment[];title:string}){
  const [english,setEnglish]=useState(true),[persian,setPersian]=useState(true);
  return <div className="youtube-lesson"><div className="youtube-frame"><iframe src={url} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div><div className="player-options"><label><input type="checkbox" checked={english} onChange={event=>setEnglish(event.target.checked)}/> English text</label><label><input type="checkbox" checked={persian} onChange={event=>setPersian(event.target.checked)}/> Translation</label></div><div className="detail-panel video-transcript"><h2>Lesson text</h2><p>Use the YouTube player above to control playback. The lesson text below is for reading and vocabulary practice; it does not follow the video automatically.</p>{lines.map((line,index)=><div className="transcript-entry" key={`${line.start}-${index}`}><span className="section-eyebrow">{Math.floor(line.start/60)}:{String(Math.floor(line.start%60)).padStart(2,"0")}</span>{english&&<p><InteractiveEnglish text={line.english} translation={line.translations.fa}/></p>}{persian&&<LearningTranslation section="video" id={id} field={`segment-${index}`} manual={line.translations.fa}/>}</div>)}</div></div>
}
