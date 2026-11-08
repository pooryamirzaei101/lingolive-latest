import {PlacedMedia} from '@/components/placed-media';
import { LearningFolder } from "@/components/learning-folder";
export const dynamic="force-dynamic";
function News(){return <LearningFolder section="video" id="news" news/>}

export default function MediaSectionPage(){return <><News/><PlacedMedia section="news"/></>}
