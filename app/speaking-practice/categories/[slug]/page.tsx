import { DEFAULT_SPEAKING_CATEGORIES } from "@/lib/video";
import { LearningFolder } from "@/components/learning-folder";
export const dynamic="force-dynamic";
export function generateStaticParams(){return DEFAULT_SPEAKING_CATEGORIES.map(item=>({slug:item.id}))}
export default async function SpeakingFolder({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <LearningFolder section="speaking" id={slug}/>}
