import {PlacedMedia} from '@/components/placed-media';
import {IeltsLibraryPage} from '@/components/ielts-library-page';
export const dynamic='force-dynamic';
function Page(){return <IeltsLibraryPage mode="listening"/>}

export default function MediaSectionPage(){return <><Page/><PlacedMedia section="ielts-listening-reading"/></>}
