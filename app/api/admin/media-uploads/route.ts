import {audioTypes,videoTypes} from "@/lib/podcast-media";
import { getMediaBucket } from "@/db";
import { isAdmin } from "@/lib/admin";

const MAX_BYTES=100_000_000;
const PART_BYTES=8*1024*1024;
const types={video:new Set<string>(videoTypes),audio:new Set<string>(audioTypes),document:new Set<string>(["application/pdf"])};
const keyPattern=/^staged\/(video|audio|document)\/[0-9a-f-]{36}$/i;
const invalid=(message:string)=>Response.json({error:message},{status:400});
// R2 upload IDs are opaque and can be substantially longer than a local
// emulator's ID. Keep a generous URL bound without rejecting valid sessions.
function target(request:Request){const url=new URL(request.url),key=url.searchParams.get("key")||"",uploadId=url.searchParams.get("uploadId")||"";return {url,key,uploadId,valid:keyPattern.test(key)&&uploadId.length>0&&uploadId.length<=4096}}
export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{const {url,key,uploadId,valid}=target(request);
    if(url.searchParams.get("action")==="complete"){
      if(!valid)return invalid("Invalid upload session.");
      const data=await request.json() as {parts?:Array<{partNumber:number;etag:string}>};
      if(!Array.isArray(data.parts)||!data.parts.length||data.parts.length>13||data.parts.some((part,index)=>part.partNumber!==index+1||typeof part.etag!=="string"||!part.etag))return invalid("Incomplete upload parts.");
      const object=await getMediaBucket().resumeMultipartUpload(key,uploadId).complete(data.parts);
      if(object.size>MAX_BYTES){await getMediaBucket().delete(key);return invalid("The file is larger than 100 MB.")}
      return Response.json({key,size:object.size});
    }
    const data=await request.json() as {kind?:"video"|"audio"|"document";mimeType?:string;size?:number};
    const kind=data.kind;
    if((kind!=="video"&&kind!=="audio"&&kind!=="document")||!data.mimeType||!types[kind].has(data.mimeType)||typeof data.size!=="number"||!Number.isInteger(data.size)||data.size<=0||data.size>MAX_BYTES)return invalid("Choose a supported audio, video, or PDF file up to 100 MB.");
    const newKey=`staged/${kind}/${crypto.randomUUID()}`;
    const upload=await getMediaBucket().createMultipartUpload(newKey,{httpMetadata:{contentType:data.mimeType}});
    return Response.json({key:newKey,uploadId:upload.uploadId,partSize:PART_BYTES});
  }catch{return Response.json({error:"Could not start or complete the upload."},{status:500})}
}
export async function PUT(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{const {url,key,uploadId,valid}=target(request),partNumber=Number(url.searchParams.get("partNumber"));
    if(!valid||!Number.isInteger(partNumber)||partNumber<1||partNumber>13||!request.body)return invalid("Invalid upload part.");
    const declared=Number(request.headers.get("Content-Length"));if(declared>PART_BYTES)return invalid("Upload part too large.");
    const bytes=new Uint8Array(await request.arrayBuffer());if(!bytes.length||bytes.length>PART_BYTES)return invalid("Invalid upload part.");
    if(key.startsWith("staged/document/")&&partNumber===1&&(bytes.length<5||String.fromCharCode(...bytes.slice(0,5))!=="%PDF-"))return invalid("This file is not a valid PDF.");
    const part=await getMediaBucket().resumeMultipartUpload(key,uploadId).uploadPart(partNumber,bytes);
    return Response.json(part);
  }catch{return Response.json({error:"Could not upload this part. Please retry."},{status:500})}
}
export async function DELETE(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{const {url,key,uploadId,valid}=target(request);if(!keyPattern.test(key))return invalid("Invalid upload session.");if(url.searchParams.get("action")==="abort"){if(!valid)return invalid("Invalid upload session.");await getMediaBucket().resumeMultipartUpload(key,uploadId).abort()}else await getMediaBucket().delete(key);return Response.json({ok:true})}catch{return Response.json({error:"Could not discard the upload."},{status:500})}
}
