import {getChatGPTUser} from "@/app/chatgpt-auth";
import {preferredLanguage} from "@/lib/translation-service";
import {isAdmin} from '@/lib/admin';
import {lessonMedia} from '@/lib/lesson-media';
import {parseTranscript} from '@/lib/video';
export async function GET(request:Request){try{const q=new URL(request.url).searchParams,m=await lessonMedia(q.get('section')||'',q.get('id')||'',await isAdmin());const user=await getChatGPTUser();return Response.json({lines:parseTranscript(m.transcript),language:user?await preferredLanguage(user.userId):"fa"})}catch{return Response.json({error:'Lesson unavailable.'},{status:404})}}
