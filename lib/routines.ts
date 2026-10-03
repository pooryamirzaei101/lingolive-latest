import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { routineLessons } from "@/db/schema";
import { hiddenSampleIds, isSampleHidden } from "@/lib/sample-visibility";

export type RoutineLesson=typeof routineLessons.$inferSelect;
export const morningRoutine:RoutineLesson={
  id:"morning-routine",title:"A Morning Routine",category:"daily-everyday",phrase:"get ready",phraseTranslation:"آماده شدن",
  explanation:"Get ready means to prepare yourself for something. We often use it before school, work, or a trip.",
  exampleOne:"I get ready for work after breakfast.",exampleOneTranslation:"من بعد از صبحانه برای کار آماده می‌شوم.",
  exampleTwo:"Sara gets ready at seven o’clock.",exampleTwoTranslation:"سارا ساعت هفت آماده می‌شود.",
  body:"Sara wakes up at seven o’clock. She washes her face and makes breakfast. Then she gets ready for work.",
  audioKey:null,mimeType:null,status:"published",createdAt:0,
};
export async function getRoutine(id:string,includeDraft=false){
  if(id===morningRoutine.id&&await isSampleHidden(id))return undefined;
  const stored=await getDb().select().from(routineLessons).where(eq(routineLessons.id,id)).get();
  if(stored&&(includeDraft||stored.status==="published"))return stored;
  if(stored)return undefined;
  return id===morningRoutine.id&&!await isSampleHidden(id)?morningRoutine:undefined;
}
export async function listRoutines(includeDrafts=false){
  const [records,hidden]=await Promise.all([getDb().select().from(routineLessons).orderBy(desc(routineLessons.createdAt)).all(),hiddenSampleIds()]);
  return [ ...(records.some(item=>item.id===morningRoutine.id)||hidden.has(morningRoutine.id)?[]:[morningRoutine]), ...records.filter(item=>!hidden.has(item.id)&&(includeDrafts||item.status==="published")) ];
}
