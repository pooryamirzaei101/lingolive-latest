export const DEFAULT_VIDEO_CATEGORIES=[
  {id:"grammar-lessons",name:"Grammar",legacy:"Grammar Lessons"},
  {id:"tenses",name:"Tenses",legacy:"Tenses"},
  {id:"business-english",name:"Business English",legacy:"Business English"},
  {id:"daily-situations",name:"Daily English",legacy:"Daily Situations"},
  {id:"news",name:"News",legacy:""},
  {id:"subjects",name:"Subjects",legacy:""},
  {id:"phrasal-verbs",name:"Phrasal Verbs",legacy:"Phrasal Verbs"},
  {id:"vocabulary",name:"Vocabulary",legacy:"Vocabulary"},
  {id:"pronunciation",name:"Pronunciation",legacy:"Pronunciation"},
  {id:"other-videos",name:"Other Videos",legacy:"Other Videos"},
] as const;
export const DEFAULT_SPEAKING_CATEGORIES=[
  {id:"speaking-everyday",name:"Everyday Conversations",legacy:""},
  {id:"speaking-pronunciation",name:"Pronunciation",legacy:""},
  {id:"speaking-business",name:"Work & Interviews",legacy:""},
  {id:"speaking-ielts",name:"IELTS Speaking",legacy:""},
] as const;
export const DEFAULT_READING_CATEGORIES=[
  {id:"reading-short-stories",name:"Short Stories",legacy:""},
  {id:"reading-everyday",name:"Everyday Reading",legacy:""},
  {id:"reading-articles",name:"Articles",legacy:""},
] as const;
export type ContentSection="video"|"speaking"|"reading";
export type VideoCategory={id:string;name:string;section:ContentSection;parentId:string|null;legacy?:string};
export const categorySlug=(name:string)=>name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
export type TranscriptSegment={start:number;end:number;english:string;translations:Record<string,string>};
export function parseTranscript(raw:string):TranscriptSegment[]{try{const value=JSON.parse(raw);if(!Array.isArray(value))return [];return value.filter(v=>Number.isFinite(v.start)&&Number.isFinite(v.end)&&v.end>v.start&&typeof v.english==="string"&&typeof v.translations==="object")}catch{return []}}
