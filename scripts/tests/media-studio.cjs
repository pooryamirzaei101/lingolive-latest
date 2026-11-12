const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const {test,before,after}=require('node:test');
const {PGlite}=require('@electric-sql/pglite'),{drizzle}=require('drizzle-orm/pglite'),{migrate}=require('drizzle-orm/pglite/migrator'),{eq}=require('drizzle-orm');
let admin=true,db,network=[],address='93.184.216.34',handler=async()=>{throw Error('Unexpected provider call')};
const cache=new Map(),stubs={
 '@/db':{getDb:()=>db,getMediaBucket:()=>({head:async()=>({size:3,httpMetadata:{contentType:'video/mp4'}}),get:async()=>({body:new Blob(['media']).stream(),httpMetadata:{contentType:'video/mp4'}}),delete:async()=>{},put:async()=>{}})},
 '@/lib/admin':{isAdmin:async()=>admin},'@/lib/membership':{canLearn:async()=>true},
 'node:dns/promises':{lookup:async()=>[{address,family:4}]},
};
function load(file,overrides={}){
 if(!Object.keys(overrides).length&&cache.has(file))return cache.get(file);
 const module={exports:{}};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{
 module,exports:module.exports,require:n=>{if(n in overrides)return overrides[n];if(n in stubs)return stubs[n];if(n.startsWith('@/'))return load(n.slice(2)+'.ts');return require(n)},
 process:{env:{DATABASE_URL:'postgres://unused',MEDIA_CONFIG_ENCRYPTION_KEY:Buffer.alloc(32,8).toString('base64')}},
 Request,Response,Headers,FormData,File,Blob,URL,URLSearchParams,ReadableStream,Uint8Array,ArrayBuffer,TextEncoder,TextDecoder,AbortSignal,Date,atob,btoa,crypto:require('node:crypto').webcrypto,
 fetch:async(url,init)=>{network.push({url:String(url),init});return handler(url,init)},
 },{filename:file});cache.set(file,module.exports);return module.exports;
}
const schema=load('db/schema.ts'),pg=new PGlite(),raw=drizzle(pg,{schema});
db=load('db/index.ts',{'./schema':schema,postgres:()=>({}),'drizzle-orm/postgres-js':{drizzle:()=>raw},'@/lib/vps-media-store':{getVpsMediaStore(){}}}).getDb();
const create=load('app/api/admin/video-lessons/route.ts'),edit=load('app/api/admin/video-lessons/[id]/route.ts'),processing=load('app/api/admin/video-lessons/[id]/processing/route.ts'),settings=load('app/api/admin/provider-options/route.ts'),providers=load('lib/configurable-providers.ts');
const allSections=Object.keys(load('lib/media-sections.ts').mediaSections);
const request=(body,path='/api/admin/provider-options',origin='https://site.test')=>new Request('https://site.test'+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
const params=id=>({params:Promise.resolve({id})});
const patch=(id,body)=>edit.PATCH(new Request('https://site.test/api/admin/video-lessons/'+id,{method:'PATCH',headers:{'Content-Type':'application/json',Origin:'https://site.test'},body:JSON.stringify(body)}),params(id));
const run=(id,action,languages=[])=>processing.POST(request({action,languages},`/api/admin/video-lessons/${id}/processing`),params(id));
const conn={endpoint:'https://api.provider.com/transcribe',model:'timestamp-model',key:'test-provider-secret',authHeader:'Authorization'};
before(async()=>{await pg.exec('CREATE ROLE anon; CREATE ROLE authenticated');await migrate(raw,{migrationsFolder:'supabase/migrations'})});
after(async()=>{await pg.close()});
let lessonId;
function mediaForm(kind='youtube'){
 const form=new FormData();form.set('title','Reusable media');form.set('contentKind',kind);form.set('category',kind==='youtube'?'youtube-listening':'grammar-lessons');form.set('sourceUrl','https://www.youtube.com/shorts/abcdefghijk');form.set('displayFormat','vertical');form.set('transcriptMode','manual');form.set('transcriptRows',JSON.stringify([{start:0,end:2,english:'Hello there.',translations:{fa:'سلام'}}]));for(const s of allSections)form.append('sections',s);return form;
}
async function add(form){return create.POST(new Request('https://site.test/api/admin/video-lessons',{method:'POST',headers:{Origin:'https://site.test'},body:form}))}

test('only admins can create media and manage providers; cross-origin writes fail',async()=>{
 admin=false;assert.equal((await add(mediaForm())).status,403);assert.equal((await settings.GET()).status,403);assert.equal((await settings.POST(request({}))).status,403);admin=true;
 assert.equal((await settings.POST(request({},undefined,'https://evil.test'))).status,403);
 assert.equal((await create.POST(new Request('https://site.test/api/admin/video-lessons',{method:'POST',headers:{Origin:'https://evil.test'},body:mediaForm()}))).status,403);
});
test('YouTube Shorts save as drafts in all nine sections with separate sentence translations',async()=>{
 const response=await add(mediaForm());assert.equal(response.status,201,await response.clone().text());lessonId=(await response.json()).id;
 const row=await db.select().from(schema.videoLessons).where(eq(schema.videoLessons.id,lessonId)).get();assert.equal(row.status,'draft');assert.equal(row.sourceUrl,'https://www.youtube.com/embed/abcdefghijk');assert.equal(row.displayFormat,'vertical');assert.deepEqual(JSON.parse(row.sections),allSections);assert.equal(JSON.parse(row.transcript)[0].translations.fa,'سلام');
 assert.equal((await patch(lessonId,{sections:['unknown']})).status,400);
 assert.equal((await patch(lessonId,{status:'published'})).status,200);
 const {PlacedMedia}=load('components/placed-media.tsx');const {renderToStaticMarkup}=require('react-dom/server');
 for(const section of allSections){const html=renderToStaticMarkup(await PlacedMedia({section}));assert.match(html,/Reusable media/);assert.match(html,new RegExp(`/video-lessons/${lessonId}`))}
 await patch(lessonId,{status:'draft'});assert.equal(await PlacedMedia({section:'news'}),null);
});
test('hosted videos and audio podcasts use the same multi-section draft workflow',async()=>{
 const video=mediaForm('video');video.set('uploadKey','staged/video/12345678-1234-1234-1234-123456789012');
 let response=await add(video);assert.equal(response.status,201,await response.clone().text());const id=(await response.json()).id;
 let row=await db.select().from(schema.videoLessons).where(eq(schema.videoLessons.id,id)).get();assert.equal(row.mediaKey,'staged/video/12345678-1234-1234-1234-123456789012');assert.equal(row.mimeType,'video/mp4');assert.deepEqual(JSON.parse(row.sections),allSections);
 const audio=mediaForm('podcast');audio.set('category','podcast-general');audio.set('podcastMedia',new File(['sound'],'lesson.mp3',{type:'audio/mpeg'}));
 response=await add(audio);assert.equal(response.status,201,await response.clone().text());row=await db.select().from(schema.videoLessons).where(eq(schema.videoLessons.id,(await response.json()).id)).get();assert.equal(row.mimeType,'audio/mpeg');assert.equal(row.status,'draft');assert.deepEqual(JSON.parse(row.sections),allSections);
});
test('English and translation SRT files must match timestamps and preserve separate texts',async()=>{
 const form=mediaForm();form.set('transcriptMode','srt');form.set('englishSrt',new File(['1\n00:00:01,000 --> 00:00:03,000\nHello.'],'en.srt'));form.set('translationSrt',new File(['1\n00:00:01,000 --> 00:00:03,000\nسلام'],'fa.srt'));
 let response=await add(form);assert.equal(response.status,201);const id=(await response.json()).id;const row=await db.select().from(schema.videoLessons).where(eq(schema.videoLessons.id,id)).get();assert.equal(JSON.parse(row.transcript)[0].start,1);assert.equal(JSON.parse(row.transcript)[0].translations.fa,'سلام');
 form.set('translationSrt',new File(['1\n00:00:02,000 --> 00:00:03,000\nسلام'],'fa.srt'));response=await add(form);assert.equal(response.status,400);
});
test('provider fields start blank and save encrypted keys without exposing them',async()=>{
 let publicState=await (await settings.GET()).json();assert.equal(publicState.transcription.endpoint,'');assert.equal(publicState.translation.endpoint,'');assert.equal('key' in publicState.transcription,false);
 const response=await settings.POST(request({transcriptionProvider:'custom',translationProvider:'custom',enabled:true,transcription:conn,translation:{...conn,endpoint:'https://api.provider.com/translate'}}));assert.equal(response.status,200,await response.clone().text());assert.ok(!JSON.stringify(await response.json()).includes(conn.key));
 const stored=await db.select().from(schema.mediaIntegrations).where(eq(schema.mediaIntegrations.id,'main')).get();assert.ok(!stored.providerOptions.includes(conn.key));
 assert.equal((await settings.POST(request({transcriptionProvider:'custom',translationProvider:'custom',enabled:true,transcription:{...conn,key:'',endpoint:'https://other.provider.com/transcribe'},translation:{...conn,key:''}}))).status,400);
});
test('custom transcription creates reviewed timed English and translation reuses its timings',async()=>{
 await db.update(schema.videoLessons).set({transcriptionKey:'private-original'}).where(eq(schema.videoLessons.id,lessonId));
 handler=async(url,init)=>{assert.equal(init.headers.get('Authorization'),'Bearer '+conn.key);assert.equal(init.redirect,'error');assert.ok(init.body instanceof FormData);return Response.json({segments:[{start:.5,end:2.25,text:'Timed English.'}]})};
 let response=await run(lessonId,'start');assert.equal(response.status,200,await response.clone().text());assert.equal((await response.json()).job.state,'review');assert.equal((await run(lessonId,'apply')).status,200);
 const saved=await db.select().from(schema.videoLessons).where(eq(schema.videoLessons.id,lessonId)).get();assert.equal(saved.status,'draft');assert.equal(JSON.parse(saved.transcript)[0].english,'Timed English.');
 handler=async(url,init)=>{const body=JSON.parse(init.body);assert.equal(body.source,'en');assert.equal(body.target,'fa');assert.deepEqual(body.texts,['Timed English.']);return Response.json({translations:['انگلیسی زمان‌بندی‌شده']})};
 assert.equal((await run(lessonId,'translate',['fa'])).status,200);response=await run(lessonId,'poll');assert.equal(response.status,200,await response.clone().text());const job=(await response.json()).job;assert.equal(job.state,'review');const rows=JSON.parse(job.segments);assert.equal(rows[0].start,.5);assert.equal(rows[0].end,2.25);assert.equal(rows[0].english,'Timed English.');assert.ok(rows[0].translations.fa);
 assert.equal((await patch(lessonId,{status:'published'})).status,400);
 await run(lessonId,'apply');await patch(lessonId,{transcript:JSON.stringify(rows)});assert.equal((await patch(lessonId,{status:'published'})).status,200);
});
test('OpenAI-compatible formats validate result counts and timed segments',async()=>{
 handler=async(url,init)=>{const body=JSON.parse(init.body);assert.equal(body.model,'timestamp-model');assert.equal(body.messages[1].content,JSON.stringify({texts:['Hello']}));return Response.json({choices:[{message:{content:JSON.stringify({translations:['Hola']})}}]})};
 assert.deepEqual(Array.from(await providers.configurableTranslation(['Hello'],'es',conn,'openai')),['Hola']);
 handler=async()=>Response.json({translations:[]});await assert.rejects(()=>providers.configurableTranslation(['Hello'],'es',conn,'custom'),/one nonempty/);
 handler=async()=>Response.json({text:'Untimed text'});await assert.rejects(()=>providers.configurableTranscription({body:new Blob(['media']).stream()},conn,'openai'),/timed segments/);
});
test('private endpoints, private DNS, provider failures, and redirects cannot leak a key',async()=>{
 for(const endpoint of ['http://api.provider.com','https://127.0.0.1/a','https://localhost/a','https://host.internal/a','https://user:pass@api.provider.com/a','https://api.provider.com/a?key=secret'])assert.throws(()=>providers.providerUrl(endpoint));
 address='127.0.0.1';let calls=network.length;await assert.rejects(()=>providers.configurableTranslation(['Hi'],'fa',conn,'custom'),/public internet/);assert.equal(network.length,calls);address='93.184.216.34';
 handler=async()=>Response.json({error:conn.key},{status:401});await assert.rejects(()=>providers.configurableTranslation(['Hi'],'fa',conn,'custom'),e=>e.message.includes('401')&&!e.message.includes(conn.key));
 handler=async()=>{throw Error(conn.key)};await assert.rejects(()=>providers.configurableTranslation(['Hi'],'fa',conn,'custom'),e=>!e.message.includes(conn.key));
});
test('an in-flight AssemblyAI job still polls AssemblyAI after switching the selected provider',async()=>{
 const media=load('lib/media-integrations.ts');await db.update(schema.mediaIntegrations).set({assemblyKey:await media.encryptKey('assembly-test-key')}).where(eq(schema.mediaIntegrations.id,'main'));
 await db.insert(schema.videoLessons).values({id:'in-flight',title:'In flight',category:'grammar-lessons',mediaKey:'private-file',mimeType:'video/mp4',createdAt:Date.now()});await db.insert(schema.transcriptJobs).values({lessonId:'in-flight',providerId:'assembly-job',state:'transcribing',createdAt:Date.now()});
 handler=async(url,init)=>{assert.ok(String(url).startsWith('https://api.assemblyai.com/v2/transcript/assembly-job'));assert.equal(init.headers.authorization,'assembly-test-key');return String(url).endsWith('/sentences')?Response.json({sentences:[{start:0,end:2000,text:'Still works.'}]}):Response.json({status:'completed'})};
 const response=await run('in-flight','poll');assert.equal(response.status,200,await response.clone().text());assert.equal((await response.json()).job.state,'review');
});
