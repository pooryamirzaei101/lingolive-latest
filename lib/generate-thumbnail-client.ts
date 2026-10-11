export async function generateThumbnailForLesson(id:string){
 const video=document.createElement('video');video.preload='metadata';video.muted=true;video.src=`/api/video-lessons/${id}/media`;
 try{
  await new Promise<void>((resolve,reject)=>{video.onloadedmetadata=()=>resolve();video.onerror=()=>reject(Error('Video frame unavailable'))});
  if(!video.videoWidth||!video.videoHeight)throw Error('Video frame unavailable');
  video.currentTime=Math.min(1,Math.max(0,(video.duration||1)/4));
  await new Promise<void>((resolve,reject)=>{video.onseeked=()=>resolve();video.onerror=()=>reject(Error('Video frame unavailable'));setTimeout(resolve,2000)});
  const canvas=document.createElement('canvas');canvas.width=Math.min(video.videoWidth,1280);canvas.height=Math.round(canvas.width*video.videoHeight/video.videoWidth);canvas.getContext('2d')?.drawImage(video,0,0,canvas.width,canvas.height);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/jpeg',.8));if(!blob)throw Error('Frame capture unavailable');
  const body=new FormData();body.set('image',new File([blob],'generated-cover.jpg',{type:'image/jpeg'}));body.set('source','generated');
  const result=await fetch(`/api/admin/video-lessons/${id}/thumbnail`,{method:'POST',body});if(!result.ok)throw Error('Frame capture unavailable');
 }finally{video.removeAttribute('src');video.load()}
}
