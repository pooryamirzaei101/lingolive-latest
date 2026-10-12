import {redirect} from 'next/navigation';
import IeltsPracticePage from '@/app/ielts-examples/practice/[id]/page';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{id:string}>}){if((await params).id==='sample-reading')redirect('/ielts-examples/sample-reading');return <IeltsPracticePage params={params} mode="listening"/>}
