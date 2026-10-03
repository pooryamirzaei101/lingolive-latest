/** Accept only YouTube's canonical video/Shorts links; never turn an arbitrary URL into an iframe. */
export function youtubeEmbedUrl(raw:string):string|null{
  try{
    const url=new URL(raw.trim()),host=url.hostname.toLowerCase();
    if(url.protocol!=="https:"||!["youtube.com","www.youtube.com","m.youtube.com","youtu.be"].includes(host))return null;
    const id=host==="youtu.be"?url.pathname.slice(1):url.pathname.startsWith("/shorts/")||url.pathname.startsWith("/embed/")?url.pathname.split("/")[2]:url.pathname==="/watch"?url.searchParams.get("v"):null;
    return id&&/^[a-zA-Z0-9_-]{11}$/.test(id)?`https://www.youtube.com/embed/${id}`:null;
  }catch{return null}
}
