"use client";
import {useState} from 'react';
import {ieltsBase,type IeltsMode} from '@/lib/ielts-library';
export type IeltsCard={id:string;title:string;description:string;category:string;kind:string;level:string;status:string;thumbnailKey:string|null};
export function IeltsLibrarySearch({items,mode}:{items:IeltsCard[];mode:IeltsMode}){
 const [query,setQuery]=useState('');const filtered=items.filter(item=>`${item.title} ${item.description} ${item.category}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 return <><label className="ielts-search">Search lessons<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by title or topic"/></label><div className="lesson-grid folder-video-rows">{filtered.map(item=><a className="lesson-card" key={item.id} href={`${ieltsBase(mode)}/lessons/${item.id}`}>{item.thumbnailKey&&<img className="ielts-card-thumbnail" src={`/api/ielts-speaking/${item.id}/asset/thumbnail`} alt=""/>}<div className="lesson-content"><span className="section-eyebrow">{item.kind==='reading'?'READING':item.kind==='speaking_video'?'VIDEO SPEAKING':'AUDIO'} · {item.level||'All levels'}</span><h2>{item.title}</h2><p>{item.description||item.category}</p><span className="text-link">Open lesson</span></div></a>)}</div>{!filtered.length&&<p>No matching lessons in this folder.</p>}</>
}
