import {mediaResponse} from "@/lib/media-response";
import {canLearn} from "@/lib/membership";
import {getMediaBucket} from "@/db";
import {getFlashcard} from "@/lib/flashcards";
import {isAdmin} from "@/lib/admin";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 try{const card=await getFlashcard(id,await isAdmin());if(!card?.audioKey)return new Response("Not found",{status:404});if(!await canLearn("flashcards",id))return new Response("Membership required",{status:403});return mediaResponse(getMediaBucket(),card.audioKey,card.mimeType||"audio/mpeg",request)}catch{return new Response("Audio unavailable",{status:503})}
}
export const HEAD=GET;
