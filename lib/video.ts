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
export const DEFAULT_DAILY_CATEGORIES=[
  {id:"daily-everyday",name:"Everyday English",legacy:""},
] as const;
export const DEFAULT_YOUTUBE_CATEGORIES=[
  {id:"youtube-listening",name:"Listening Practice",legacy:""},
] as const;
export const DEFAULT_IELTS_CATEGORIES=[
  {id:"ielts-listening",name:"Listening",legacy:""},
  {id:"ielts-reading",name:"Reading",legacy:""},
  {id:"ielts-reading-academic",name:"Academic",parentId:"ielts-reading",legacy:""},
  {id:"ielts-reading-general",name:"General Training",parentId:"ielts-reading",legacy:""},
  {id:"ielts-audio-model-answers",name:"Speaking Model Answers (Audio)",legacy:""},
  {id:"ielts-video-speaking",name:"Video Speaking Practice",legacy:""},
  {id:"ielts-video-part1",name:"Speaking Part 1",parentId:"ielts-video-speaking",legacy:""},
  {id:"ielts-video-hometown",name:"Hometown",parentId:"ielts-video-part1",legacy:""},
  {id:"ielts-video-part2",name:"Speaking Part 2",parentId:"ielts-video-speaking",legacy:""},
  {id:"ielts-video-person",name:"Describe a Person",parentId:"ielts-video-part2",legacy:""},
  {id:"ielts-video-part3",name:"Speaking Part 3",parentId:"ielts-video-speaking",legacy:""},
  {id:"ielts-writing",name:"Writing",legacy:""},
  {id:"ielts-speaking",name:"Speaking",legacy:""},
  {id:"ielts-speaking-part1",name:"Speaking Part 1",parentId:"ielts-speaking",legacy:""},
  {id:"ielts-speaking-introduction",name:"Introduction",parentId:"ielts-speaking-part1",legacy:""},
  {id:"ielts-speaking-study",name:"Study",parentId:"ielts-speaking-part1",legacy:""},
  {id:"ielts-speaking-part2",name:"Speaking Part 2",parentId:"ielts-speaking",legacy:""},
  {id:"ielts-speaking-people",name:"People",parentId:"ielts-speaking-part2",legacy:""},
] as const;
export const DEFAULT_TIPS_CATEGORIES=[
  {id:"tips-grammar",name:"Grammar",legacy:""},
  {id:"tips-pronunciation",name:"Pronunciation",legacy:""},
  {id:"tips-vocabulary",name:"Vocabulary",legacy:""},
] as const;
export const DEFAULT_PODCAST_CATEGORIES=[{id:"podcast-general",name:"All Podcasts",legacy:""}] as const;
export const DEFAULT_CATEGORIES={podcast:DEFAULT_PODCAST_CATEGORIES,video:DEFAULT_VIDEO_CATEGORIES,speaking:DEFAULT_SPEAKING_CATEGORIES,reading:DEFAULT_READING_CATEGORIES,daily:DEFAULT_DAILY_CATEGORIES,youtube:DEFAULT_YOUTUBE_CATEGORIES,ielts:DEFAULT_IELTS_CATEGORIES,tips:DEFAULT_TIPS_CATEGORIES};
export type ContentSection=keyof typeof DEFAULT_CATEGORIES;
export type VideoCategory={id:string;name:string;section:ContentSection;parentId:string|null;legacy?:string};
export const categorySlug=(name:string)=>name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
export type TranscriptSegment={start:number;end:number;english:string;translations:Record<string,string>;words?:{start:number;end:number;text:string}[]};
export function parseTranscript(raw:string):TranscriptSegment[]{try{const value=JSON.parse(raw);if(!Array.isArray(value))return [];return value.filter(v=>Number.isFinite(v.start)&&Number.isFinite(v.end)&&v.end>v.start&&typeof v.english==="string"&&typeof v.translations==="object")}catch{return []}}
