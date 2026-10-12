import type {VideoCategory} from '@/lib/video';

export type IeltsMode='listening'|'video';
export const ieltsTitle=(mode:IeltsMode)=>mode==='video'?'IELTS Video Speaking Practice':'IELTS Listening & Reading';
export const ieltsBase=(mode:IeltsMode)=>mode==='video'?'/ielts-video-speaking':'/ielts-listening-reading';
export function ieltsFolders(categories:VideoCategory[],mode:IeltsMode){
 const roots=mode==='video'?['ielts-video-speaking','ielts-speaking']:['ielts-listening','ielts-reading','ielts-audio-model-answers','ielts-speaking'];
 const byId=new Map(categories.map(c=>[c.id,c]));
 return categories.filter(category=>{
  let current:VideoCategory|undefined=category;
  for(let i=0;current&&i<=categories.length;i++){
   if(roots.includes(current.id))return true;
   current=current.parentId?byId.get(current.parentId):undefined;
  }
  return false;
 });
}
