import {desc} from 'drizzle-orm';
import {getDb} from '@/db';
import {ieltsSpeakingExamples,contentAccess} from '@/db/schema';
import {isAdmin} from '@/lib/admin';
import {getVideoCategories} from '@/lib/video-categories';
import {ieltsFolders,ieltsTitle,type IeltsMode} from '@/lib/ielts-library';
import {IeltsFolderManager} from '@/components/ielts-folder-manager';
import {IeltsSpeakingCreate,IeltsSpeakingEditor} from '@/components/ielts-speaking-admin';
import {IeltsModuleCreate,IeltsModuleEditor} from '@/components/ielts-module-admin';

export async function IeltsAdminPage({mode}:{mode:IeltsMode}){
 if(!await isAdmin())return <section className="section shell"><h1>Administration</h1><p>This area is available only to the administrator.</p></section>;
 try{
 const [all,rows,access]=await Promise.all([getVideoCategories('ielts'),getDb().select().from(ieltsSpeakingExamples).orderBy(desc(ieltsSpeakingExamples.createdAt)).all(),getDb().select().from(contentAccess).all()]);
 const folders=ieltsFolders(all,mode),ids=new Set(folders.map(c=>c.id)),examples=rows.filter(row=>mode==='video'?row.kind==='speaking_video':row.kind==='listening');
 // Retain legacy lessons in their original folder and make it available to the editor.
 const editorFolders=[...folders,...all.filter(c=>examples.some(e=>e.category===c.id)&&!ids.has(c.id))];
 return <section className="section shell admin-page"><a className="folder-back" href="/administration">← Administration</a><span className="section-eyebrow">IELTS LEARNING CENTER · ADMINISTRATION</span><h1>{ieltsTitle(mode)}</h1><p>{mode==='video'?'Upload or link model videos, add teleprompter scripts, review drafts, and publish lessons.':'Upload audio, review the automatically generated English transcript and timestamps, then publish.'}</p><IeltsFolderManager categories={folders} mode={mode}/><div className="detail-grid"><div className="detail-panel"><h2>Lessons and drafts</h2>{examples.map(example=>example.kind==='listening'?<IeltsSpeakingEditor key={example.id} example={example} categories={editorFolders} free={!!access.find(a=>a.id===`ielts:${example.id}`)?.free}/>:<IeltsModuleEditor key={example.id} example={example} categories={editorFolders} free={!!access.find(a=>a.id===`ielts:${example.id}`)?.free}/>)}{!examples.length&&<p>No lessons have been created yet.</p>}</div><aside className="detail-panel" id="add-content"><h2>Add a lesson</h2>{mode==='video'?<IeltsModuleCreate categories={folders} kind="speaking_video"/>:<IeltsSpeakingCreate categories={folders}/>}</aside></div></section>
 }catch{return <section className="section shell"><h1>{ieltsTitle(mode)}</h1><p className="notice">The IELTS lesson database is unavailable. Please try again later.</p></section>}
}
