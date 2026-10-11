// Load through the authenticated page when a mobile media engine cannot stream
// a protected URL. The temporary URL is local to this page and is revoked later.
export async function loadPlaybackBlob(src:string,signal:AbortSignal){
 const response=await fetch(src,{credentials:'same-origin',cache:'no-store',signal});
 if(!response.ok)throw Error(response.status===403?'Sign in or renew your membership to play this lesson.':response.status===404?'The uploaded video file is unavailable.':'The video could not load. Please retry.');
 const type=(response.headers.get('Content-Type')||'').split(';')[0];
 if(!['video/mp4','video/webm'].includes(type))throw Error('The server did not return a video file. Reload the page and sign in again.');
 const declared=Number(response.headers.get('Content-Length'));
 if(declared>100_000_000)throw Error('The video exceeds the supported 100 MB limit.');
 const blob=await response.blob();
 if(!blob.size||blob.size>100_000_000)throw Error('The video file is empty or exceeds 100 MB.');
 if(declared>0&&blob.size!==declared)throw Error('The video transfer was incomplete. Please retry.');
 return blob;
}
