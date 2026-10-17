const ts=require('typescript'),vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');const {drizzle}=require('drizzle-orm/sqlite-proxy');
const sqlite=new DatabaseSync(':memory:');sqlite.exec(fs.readFileSync('drizzle/0013_yielding_spacker_dave.sql','utf8'));
function load(file,stubs={}){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,require:n=>n in stubs?stubs[n]:require(n),crypto:require('node:crypto').webcrypto,TextEncoder,Date,Uint8Array,Error});return module.exports}
const schema=load('db/schema.ts');const db=drizzle(async(sql,params,method)=>{const stmt=sqlite.prepare(sql);stmt.setReturnArrays(true);if(method==='run'){stmt.run(...params);return {rows:[]}}const rows=stmt.all(...params);return {rows:method==='get'?rows[0]:rows}},{schema});
let calls=0,enabled=true,fail=false;const cache=load('lib/translation-cache.ts',{'@/db':{getDb:()=>db},'@/db/schema':schema,'@/lib/media-integrations':{integrationConfig:async()=>({enabled,googleKey:'mock-only'}),translationConnected:()=>true,translateTexts:async([text],lang)=>{calls++;await new Promise(r=>setTimeout(r,10));if(fail)throw Error('Mock outage');return [`${lang}:${text}`]}}});
(async()=>{
 const concurrent=await Promise.allSettled([cache.cachedTranslation('Hello there','id','student-one'),cache.cachedTranslation('Hello there','id','student-two')]);assert.equal(calls,1);assert.equal(concurrent.filter(r=>r.status==='fulfilled').length,1);
 assert.equal((await cache.cachedTranslation('Hello there','id','student-two')).translation,'id:Hello there');assert.equal(calls,1);
 await cache.cachedTranslation('Hello there','es','student-two');assert.equal(calls,2);
 await cache.saveTranslation('Hello there','es','Reviewed Spanish');assert.equal((await cache.cachedTranslation('Hello there','es','student-three')).translation,'Reviewed Spanish');assert.equal(calls,2);
 enabled=false;assert.equal((await cache.cachedTranslation('Hello there','id')).translation,'id:Hello there');await assert.rejects(()=>cache.cachedTranslation('Changed English','id'));
 enabled=true;await cache.cachedTranslation('Changed English','id');assert.equal(calls,3);
 fail=true;await assert.rejects(()=>cache.cachedTranslation('Retry sentence','tr'));fail=false;await cache.cachedTranslation('Retry sentence','tr');assert.equal(calls,5);
 const beforeShared=calls;await cache.cachedTranslation('Shared lesson sentence','de',undefined,'lesson:one:segment-0');await cache.cachedTranslation('Shared lesson sentence','de',undefined,'lesson:two:segment-4');assert.equal(calls,beforeShared+1);
 const usage=sqlite.prepare('SELECT count FROM translation_usage WHERE id LIKE ?').get('student-two:%');assert.ok(usage.count===1||usage.count===2);
 console.log('PASS: one concurrent provider call, reuse across students and lesson scopes, separate languages, manual corrections, offline reuse, changed English, failure retry, quota accounting. No real provider contacted.');
})().catch(e=>{console.error(e);process.exit(1)});
