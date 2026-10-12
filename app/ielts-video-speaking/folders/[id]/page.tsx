import {IeltsLibraryPage} from '@/components/ielts-library-page';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){return <IeltsLibraryPage mode="video" folderId={(await params).id}/>}
