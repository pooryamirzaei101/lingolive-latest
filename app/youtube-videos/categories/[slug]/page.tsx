import {DEFAULT_YOUTUBE_CATEGORIES} from "@/lib/video";
import {LearningFolder} from "@/components/learning-folder";
export const dynamic="force-dynamic";
export function generateStaticParams(){return DEFAULT_YOUTUBE_CATEGORIES.map(item=>({slug:item.id}))}
export default async function YouTubeFolder({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <LearningFolder section="youtube" id={slug}/>}
