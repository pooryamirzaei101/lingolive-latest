export const VIDEO_CATEGORIES=["Grammar Lessons","Daily Situations","Business English","Tenses","Phrasal Verbs","Vocabulary","Pronunciation","Other Videos"] as const;
export type TranscriptSegment={start:number;end:number;english:string;translations:Record<string,string>};
export function parseTranscript(raw:string):TranscriptSegment[]{try{const value=JSON.parse(raw);if(!Array.isArray(value))return [];return value.filter(v=>Number.isFinite(v.start)&&Number.isFinite(v.end)&&v.end>v.start&&typeof v.english==="string"&&typeof v.translations==="object")}catch{return []}}
