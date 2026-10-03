import {canLearn} from '@/lib/membership';
import {MembershipLock} from '@/components/membership-lock';
import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuickTip } from "@/lib/quick-tips";
import { isAdmin } from "@/lib/admin";
import { QuickTipLesson } from "@/components/quick-tip-lesson";
export const dynamic="force-dynamic";
export default async function TipPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;let tip;
  try{tip=await getQuickTip(id,await isAdmin())}catch{notFound()}
  if(!tip)notFound();
  if(!await canLearn('tips',id))return <MembershipLock/>;
  return <section className="section shell catalog-page speaking-lesson-page"><Link className="folder-back" href={`/quick-tips/categories/${tip.category}`}>← Back to Quick Tips</Link><span className="section-eyebrow">QUICK TIPS · {tip.status==="draft"?"DRAFT PREVIEW":"LESSON"}</span><h1>{tip.title}</h1><QuickTipLesson tip={tip}/></section>
}
