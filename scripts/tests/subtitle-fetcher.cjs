const ts=require('typescript'),vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
function load(file,stubs={}){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,{module,exports:module.exports,require:n=>n in stubs?stubs[n]:require(n),URL,TextDecoder,Uint8Array,Buffer,setTimeout,clearTimeout,console});return module.exports}
const imports=load('lib/transcript-import.ts'),f=load('lib/subtitle-fetcher.ts',{'@/lib/transcript-import':imports});
const enc=t=>new TextEncoder().encode(t),ok=(body,type='text/plain')=>async()=>({status:200,headers:{'content-type':type},body:enc(body)});
const SRT='1\n00:00:01,000 --> 00:00:03,000\nHello there.\n\n2\n00:00:03,500 --> 00:00:05,000\nWelcome!',VTT='WEBVTT\n\n00:01.000 --> 00:03.000\nHello <b>there</b>.'.replace('00:01.000','00:00:01.000').replace('00:03.000','00:00:03.000');
(async()=>{
 // address classification
 for(const a of['127.0.0.1','10.1.2.3','172.16.0.1','172.31.255.255','192.168.1.1','169.254.169.254','100.64.0.1','0.0.0.0','224.0.0.1','::1','::','fe80::1','fd00::1','::ffff:127.0.0.1','::ffff:10.0.0.1','not-an-ip'])assert.equal(f.isPublicAddress(a),false,a);
 for(const a of['8.8.8.8','1.1.1.1','172.32.0.1','93.184.216.34','2606:4700:4700::1111','::ffff:8.8.8.8'])assert.equal(f.isPublicAddress(a),true,a);
 // URL validation, before any network access
 for(const u of['http://example.com/a.srt','ftp://example.com/a.srt','https://user:pw@example.com/a.srt','https://example.com:8443/a.srt','https://127.0.0.1/a.srt','https://[::1]/a.srt','https://169.254.169.254/latest/meta-data','https://localhost/a.srt','https://db.internal/a.srt','https://www.youtube.com/watch?v=abcdefghijk','https://youtu.be/abcdefghijk','not a url'])await assert.rejects(()=>f.fetchSubtitleText(u,async()=>{throw Error('network must not be called')}),f.SubtitleFetchError,u);
 // parsing
 let r=await f.fetchSubtitleText('https://cdn.example.com/lesson.srt',ok(SRT));assert.equal(r.format,'srt');assert.equal(r.cues,2);
 r=await f.fetchSubtitleText('https://cdn.example.com/lesson.vtt',ok('﻿'+VTT,'text/vtt; charset=utf-8'));assert.equal(r.format,'vtt');assert.equal(r.cues,1);
 r=await f.fetchSubtitleText('https://cdn.example.com/l.srt',ok(SRT,'application/octet-stream'));assert.equal(r.cues,2);
 // rejects HTML, non-text, bad status, garbage, oversize
 await assert.rejects(()=>f.fetchSubtitleText('https://example.com/p',ok('<html></html>','text/html; charset=utf-8')),/not a subtitle/);
 await assert.rejects(()=>f.fetchSubtitleText('https://example.com/p',ok('{}','application/json')),/not a subtitle/);
 await assert.rejects(()=>f.fetchSubtitleText('https://example.com/p',async()=>({status:404,headers:{},body:enc('')})),/status 404/);
 await assert.rejects(()=>f.fetchSubtitleText('https://example.com/p',ok('just some prose')),f.SubtitleFetchError);
 await assert.rejects(()=>f.fetchSubtitleText('https://example.com/p',async()=>({status:200,headers:{'content-type':'text/plain'},body:new Uint8Array(f.MAX_SUBTITLE_BYTES+1)})),/10 MB/);
 // redirects: followed and re-validated
 let calls=[];r=await f.fetchSubtitleText('https://short.example/x',async u=>{calls.push(u.toString());return calls.length===1?{status:302,headers:{location:'/final.srt'},body:enc('')}:{status:200,headers:{'content-type':'text/plain'},body:enc(SRT)}});assert.equal(r.finalUrl,'https://short.example/final.srt');assert.equal(calls.length,2);
 for(const loc of['http://example.com/a.srt','https://169.254.169.254/x','https://127.0.0.1/x','https://localhost/x'])await assert.rejects(()=>f.fetchSubtitleText('https://short.example/x',async()=>({status:301,headers:{location:loc},body:enc('')})),f.SubtitleFetchError,loc);
 await assert.rejects(()=>f.fetchSubtitleText('https://loop.example/x',async()=>({status:302,headers:{location:'https://loop.example/x'},body:enc('')})),/redirects too many/);
 // the real transport refuses names that resolve to private addresses (connect-time check; no external traffic)
 await assert.rejects(()=>f.fetchSubtitleText('https://localtest.me/a.srt'),f.SubtitleFetchError);
 // DNS-rebinding guard: a public-looking name that resolves to a private address must be refused at connect time
 for(const addr of[[{address:'127.0.0.1',family:4}],[{address:'8.8.8.8',family:4},{address:'169.254.169.254',family:4}],[{address:'::1',family:6}]]){const g=load('lib/subtitle-fetcher.ts',{'@/lib/transcript-import':imports,'node:dns':{lookup:(h,o,cb)=>cb(null,addr)}});await assert.rejects(()=>g.fetchSubtitleText('https://looks-public.example/a.srt'),/not a public website/)}
 console.log('PASS: https-only, no credentials/ports, private/loopback/metadata/IPv6-mapped addresses blocked, YouTube pages redirected to official import, redirects re-validated and capped, HTML/JSON/oversize/garbage rejected, SRT and VTT parsed. No external call.');
})();
