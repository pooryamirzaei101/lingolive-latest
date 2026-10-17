import { notFound } from "next/navigation";
import { LearningFolder } from "@/components/learning-folder";
import { getVideoCategories } from "@/lib/video-categories";
export const dynamic="force-dynamic";
export default async function NewsCategory({params}:{params:Promise<{id:string}>}){
  const {id}=await params,categories=await getVideoCategories("video");
  let current=categories.find(category=>category.id===id);
  while(current?.parentId&&current.parentId!=="news")current=categories.find(category=>category.id===current?.parentId);
  if(!current||current.parentId!=="news")notFound();
  return <LearningFolder section="video" id={id} news/>;
}
