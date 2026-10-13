import {validateSegments} from '@/lib/transcript-import';

/** Prefer provider sentence boundaries; retain its word times when possible. */
export function assemblyTimedSegments(sentences:unknown, transcript:unknown){
 const original=transcript as {words?:unknown;text?:unknown};
 const words=Array.isArray(original?.words)?original.words.filter((w:any)=>Number.isFinite(w?.start)&&Number.isFinite(w?.end)&&w.end>w.start&&typeof w.text==='string'&&w.text.trim()):[];
 const given=Array.isArray(sentences)?sentences.filter((s:any)=>Number.isFinite(s?.start)&&Number.isFinite(s?.end)&&s.end>s.start&&typeof s.text==='string'&&s.text.trim()):[];
 if(given.length)return validateSegments(given.map((s:any)=>({start:s.start/1000,end:s.end/1000,english:s.text,translations:{},words:(Array.isArray(s.words)&&s.words.length?s.words:words.filter((w:any)=>w.start>=s.start-100&&w.end<=s.end+100)).map((w:any)=>({start:w.start/1000,end:w.end/1000,text:w.text}))})));
 if(!words.length)throw new Error('AssemblyAI completed without timed English words. Try another recording or add timed subtitles manually.');
 const groups:any[][]=[];let current:any[]=[];
 for(const word of words){if(current.length&&(current.length>=25||word.start-current.at(-1).end>950)){groups.push(current);current=[]}current.push(word);if(/[.!?]["'”’)]*$/.test(word.text)){groups.push(current);current=[]}}
 if(current.length)groups.push(current);
 return validateSegments(groups.map(group=>({start:group[0].start/1000,end:group.at(-1).end/1000,english:group.map((w:any)=>w.text).join(' '),translations:{},words:group.map((w:any)=>({start:w.start/1000,end:w.end/1000,text:w.text}))})));
}
