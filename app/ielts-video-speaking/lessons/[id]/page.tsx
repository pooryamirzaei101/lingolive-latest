import IeltsPracticePage from '@/app/ielts-examples/practice/[id]/page';
export const dynamic='force-dynamic';
export default function Page({params}:{params:Promise<{id:string}>}){return <IeltsPracticePage params={params} mode="video"/>}
