import {audioTypes,videoTypes} from "@/lib/podcast-media";
import { getMediaBucket } from "@/db";

export const MAX_MEDIA_BYTES=100_000_000;
export async function stagedMedia(key:string,kind:"audio"|"video"|"document"){
  if(!new RegExp(`^staged/${kind}/[0-9a-f-]{36}$`,"i").test(key))return null;
  const object=await getMediaBucket().head(key);
  if(!object||!object.size||object.size>MAX_MEDIA_BYTES)return null;
  const mimeType=object.httpMetadata?.contentType||"";
  const allowed:readonly string[]=kind==="document"?["application/pdf"]:kind==="video"?videoTypes:audioTypes;
  return allowed.includes(mimeType)?{key,mimeType}:null;
}
