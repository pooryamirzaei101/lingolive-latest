import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { quickTipLessons } from "@/db/schema";
import { hiddenSampleIds, isSampleHidden } from "@/lib/sample-visibility";

export type QuickTip=typeof quickTipLessons.$inferSelect;
export const sampleTips:QuickTip[]=[
  {id:"tip-polite-requests",category:"tips-grammar",title:"Make a polite request",body:"Use could you when you ask someone to help. It sounds gentle and respectful.",translation:"وقتی از کسی کمک می‌خواهید، از «could you» استفاده کنید. این عبارت مؤدبانه است.",example:"Could you open the window, please?",exampleTranslation:"می‌توانید لطفاً پنجره را باز کنید؟",audioKey:null,mimeType:null,status:"published",createdAt:0},
  {id:"tip-word-stress",category:"tips-pronunciation",title:"Listen for word stress",body:"One part of a long word is often stronger. In the word about, the second part is stronger.",translation:"در بسیاری از واژه‌های بلند، یک بخش با تأکید بیشتری گفته می‌شود. در واژهٔ about، بخش دوم تأکید دارد.",example:"I am about to leave.",exampleTranslation:"من در آستانهٔ رفتن هستم.",audioKey:null,mimeType:null,status:"published",createdAt:0},
  {id:"tip-keep-in-touch",category:"tips-vocabulary",title:"Keep in touch",body:"Keep in touch means to continue talking or writing to someone after you leave.",translation:"عبارت keep in touch یعنی پس از دور شدن همچنان با کسی در ارتباط بمانید.",example:"Let’s keep in touch after the course.",exampleTranslation:"بیایید بعد از دوره در ارتباط بمانیم.",audioKey:null,mimeType:null,status:"published",createdAt:0},
];
export async function listQuickTips(includeDrafts=false){
  const [rows,hidden]=await Promise.all([getDb().select().from(quickTipLessons).orderBy(desc(quickTipLessons.createdAt)).all(),hiddenSampleIds()]);
  return [...sampleTips.filter(sample=>!hidden.has(sample.id)&&!rows.some(row=>row.id===sample.id)),...rows.filter(row=>row.category!=="flashcards"&&!hidden.has(row.id)&&(includeDrafts||row.status==="published"))];
}
export async function getQuickTip(id:string,includeDraft=false){
  if(sampleTips.some(tip=>tip.id===id)&&await isSampleHidden(id))return undefined;
  const row=await getDb().select().from(quickTipLessons).where(eq(quickTipLessons.id,id)).get();
  if(row)return row.category!=="flashcards"&&(includeDraft||row.status==="published")?row:undefined;
  return await isSampleHidden(id)?undefined:sampleTips.find(tip=>tip.id===id);
}
