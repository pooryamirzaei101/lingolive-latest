import {splitEnglishScript} from "@/lib/plain-script";
import {audioTypes,videoTypes} from "@/lib/podcast-media";
import {validVideoFormat} from "@/lib/thumbnails";
import {parseSrt,validateSegments} from "@/lib/transcript-import";
import {isTranslationLanguage} from "@/lib/languages";
import { getDb, getMediaBucket } from "@/db";
import { videoLessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { getVideoCategories } from "@/lib/video-categories";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { stagedMedia } from "@/lib/admin-media";

export async function POST(request:Request){
  if(!await isAdmin())return Response.json({error:"Not authorized"},{status:403});
  try{
    const form=await request.formData();
    const title=String(form.get("title")||"").trim().slice(0,160),description=String(form.get("description")||"").trim().slice(0,4000),category=String(form.get("category")||""),contentKind=String(form.get("contentKind")||"video"),level=String(form.get("level")||"Beginner"),format=String(form.get("displayFormat")||"landscape"),file=form.get(contentKind==="podcast"?"podcastMedia":"video"),uploaded=await stagedMedia(String(form.get("uploadKey")||""),contentKind==="podcast"&&String(form.get("mediaKind"))==="audio"?"audio":"video");
    const sourceUrl=contentKind==="youtube"?youtubeEmbedUrl(String(form.get("sourceUrl")||"")):null;
    if(!["video","speaking","youtube","podcast"].includes(contentKind)||!title||!validVideoFormat(format)||!(await getVideoCategories(contentKind as "video"|"speaking"|"youtube"|"podcast")).some(c=>c.id===category))return Response.json({error:"Add a title and choose a valid section and folder."},{status:400});
    if(contentKind==="youtube"&&!sourceUrl)return Response.json({error:"Enter a valid YouTube video or Shorts URL."},{status:400});
    if(contentKind!=="youtube"&&!uploaded&&(!(file instanceof File)||!(contentKind==="podcast"?[...audioTypes,...videoTypes]: [...videoTypes] as string[]).includes(file.type)||file.size>90*1024*1024||file.size===0))return Response.json({error:"Choose a supported podcast audio or video file up to 100 MB."},{status:400});
    const language=String(form.get("translationLanguage")||"fa");if(!isTranslationLanguage(language))throw Error("Choose a supported language.");
    let transcript="[]";const mode=String(form.get("transcriptMode")||"manual");
    if(mode==="srt"){
      const english=form.get("englishSrt"),translated=form.get("translationSrt");if(!(english instanceof File)||english.size===0||english.size>10000000)throw Error("Choose an English SRT file up to 10 MB.");
      const rows=parseSrt(await english.text());let translations:ReturnType<typeof parseSrt>=[];
      if(translated instanceof File&&translated.size){if(translated.size>10000000)throw Error("Translation SRT must be up to 10 MB.");translations=parseSrt(await translated.text());if(translations.length!==rows.length||translations.some((r,i)=>Math.abs(r.start-rows[i].start)>.05||Math.abs(r.end-rows[i].end)>.05))throw Error("Translation SRT must match the English sentence count and timestamps.")}
      transcript=JSON.stringify(validateSegments(rows.map((r,i)=>({start:r.start,end:r.end,english:r.text,translations:translations[i]?{[language]:translations[i].text}:{}}))));
    }else if(mode==="manual"){
      const english=contentKind==="podcast"?splitEnglishScript(String(form.get("englishText")||"")):String(form.get("englishText")||"").split(/\n+/).map(s=>s.trim()).filter(Boolean),translated=String(form.get("translationText")||"").split(/\n+/).map(s=>s.trim()).filter(Boolean);
      if(translated.length&&translated.length!==english.length)throw Error("Use one sentence per line with matching English and translation lines.");
      transcript=JSON.stringify(validateSegments(english.map((text,i)=>({start:i*3,end:(i+1)*3,english:text,translations:translated[i]?{[language]:translated[i]}:{}}))));
    }else if(mode!=="api"&&mode!=="captions")throw Error("Choose manual text, SRT, or API generation.");
    const id=crypto.randomUUID(),key=contentKind==="youtube"?"":(uploaded?.key||(file instanceof File?`video-lessons/${id}/${file.name.replace(/[^a-zA-Z0-9._-]/g,"_").slice(0,80)}`:""));
    if(key&&!uploaded&&file instanceof File)await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
    try{await getDb().insert(videoLessons).values({id,title,description,category,contentKind,level,transcript,mediaKey:key,mimeType:uploaded?.mimeType||(key&&file instanceof File?file.type:"text/html"),sourceUrl,displayFormat:format,createdAt:Date.now()})}catch(error){if(key)await getMediaBucket().delete(key);throw error}
    return Response.json({id,status:"draft"},{status:201});
  }catch(e){return Response.json({error:e instanceof Error?e.message:"The upload could not be saved. Please try again."},{status:400})}
}
