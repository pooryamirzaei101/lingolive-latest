import { DEFAULT_VIDEO_CATEGORIES } from "@/lib/video";
import { LearningFolder } from "@/components/learning-folder";
export const dynamic="force-dynamic";
export function generateStaticParams(){return DEFAULT_VIDEO_CATEGORIES.map(item=>({slug:item.id}))}
export default async function VideoFolder({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <LearningFolder section="video" id={slug}/>}
