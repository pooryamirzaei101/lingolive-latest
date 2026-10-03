import { getMediaBucket } from "@/db";

export const MAX_MEDIA_BYTES=100_000_000;
export async function stagedMedia(key:string,kind:"audio"|"video"){
  if(!new RegExp(`^staged/${kind}/[0-9a-f-]{36}$`,"i").test(key))return null;
  const object=await getMediaBucket().head(key);
  if(!object||!object.size||object.size>MAX_MEDIA_BYTES)return null;
  const mimeType=object.httpMetadata?.contentType||"";
  const allowed=kind==="video"?["video/mp4","video/webm"]:["audio/mpeg","audio/mp3","audio/wav","audio/x-wav","audio/ogg","audio/webm","audio/mp4"];
  return allowed.includes(mimeType)?{key,mimeType}:null;
}
