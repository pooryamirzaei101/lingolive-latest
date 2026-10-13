import {notFound} from 'next/navigation';
import {and,eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {ieltsSpeakingExamples} from '@/db/schema';
import {getVideoCategories} from '@/lib/video-categories';
import {ieltsBase,ieltsFolders,ieltsTitle,type IeltsMode} from '@/lib/ielts-library';
import {IeltsLibrarySearch,type IeltsCard} from '@/components/ielts-library-search';
import {canLearn} from '@/lib/membership';
import {ieltsSamples} from '@/lib/ielts-speaking';
import {isSampleHidden} from '@/lib/sample-visibility';

export async function IeltsLibraryPage({mode,folderId}:{mode:IeltsMode;folderId?:string}){
 const all=await getVideoCategories('ielts'),folders=ieltsFolders(all,mode),ids=new Set(folders.map(c=>c.id)),folder=folderId?folders.find(c=>c.id===folderId):undefined;
 if(folderId&&!folder)notFound();
 const children=folders.filter(c=>folder?c.parentId===folder.id:!c.parentId||!ids.has(c.parentId));
 const records=await getDb().select().from(ieltsSpeakingExamples).where(eq(ieltsSpeakingExamples.status,'published')).all();
 const chosen=records.filter(row=>mode==='video'?row.kind==='speaking_video':row.kind==='listening').filter(row=>folder?row.category===folder.id:!ids.has(row.category));
 const items:IeltsCard[]=chosen.map(row=>({id:row.id,title:row.question,description:row.cue,category:all.find(c=>c.id===row.category)?.name||'',kind:row.kind,level:row.level,status:row.status,thumbnailKey:row.thumbnailKey}));
 if(mode==='listening'&&folder)items.push(...ieltsSamples.filter(s=>s.category===folder.id&&['sample-introduce-yourself','sample-study','sample-describe-a-friend'].includes(s.id)).map(s=>({id:s.id,title:s.question,description:s.cue,category:folder.name,kind:'listening',level:'Sample',status:'published',thumbnailKey:null})));
 const access=await Promise.all(items.map(i=>canLearn('ielts',i.id)));
 return <section className="section shell catalog-page"><a className="folder-back" href={folder?.parentId&&ids.has(folder.parentId)?`${ieltsBase(mode)}/folders/${folder.parentId}`:ieltsBase(mode)}>← {folder?.parentId&&ids.has(folder.parentId)?all.find(c=>c.id===folder.parentId)?.name:ieltsTitle(mode)}</a><span className="section-eyebrow">IELTS LEARNING CENTER</span><h1>{folder?.name||ieltsTitle(mode)}</h1><p>{mode==='video'?'Choose a model video, follow the teleprompter, and record your response.':'Choose a listening or reading lesson. Tap words to translate and save them.'}</p><div className="video-folder-grid">{children.map(c=><a className="video-folder-card" href={`${ieltsBase(mode)}/folders/${c.id}`} key={c.id}><span className="folder-icon">📂</span><h2>{c.name}</h2><span className="folder-open">Open folder</span></a>)}</div>{items.length>0?<IeltsLibrarySearch items={items.map((item,i)=>({...item,description:access[i]?item.description:'Included in Membership.'}))} mode={mode}/>:children.length===0?<p>No lessons have been published in this folder yet.</p>:null}</section>;
}
