import type { ContentSection } from "@/lib/video";

export const learningSections = {
  "daily-lessons": {section:"daily",title:"Daily Lessons",sample:"daily-small-steps",sampleCategory:"daily-everyday",description:"Short reading and listening lessons."},
  "youtube-videos": {section:"youtube",title:"YouTube Videos",sample:"youtube-transcript-preview",sampleCategory:"youtube-listening",description:"Organize reviewed YouTube lessons by topic."},
  "ielts-examples": {section:"ielts",title:"IELTS Examples",sample:"ielts-reading-notice",sampleCategory:"ielts-reading",description:"Practice organized by IELTS skill."},
  "quick-tips": {section:"tips",title:"Quick Tips",sample:"tip-polite-requests",sampleCategory:"tips-grammar",description:"Small ideas you can put into practice."},
} as const satisfies Record<string,{section:ContentSection;title:string;sample:string;sampleCategory:string;description:string}>;

export type LearningSectionSlug=keyof typeof learningSections;
export function isLearningSection(slug:string):slug is LearningSectionSlug{return Object.hasOwn(learningSections,slug)}
