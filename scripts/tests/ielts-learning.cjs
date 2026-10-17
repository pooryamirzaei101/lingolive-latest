const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const vm=require('node:vm');
function load(file,stubs={}){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module,exports:module.exports,require:name=>{if(name in stubs)return stubs[name];throw Error(name)}});return module.exports}
const {parseVtt,validateSegments}=load('lib/transcript-import.ts');
const cues=parseVtt('WEBVTT\n\n00:00.500 --> 00:02.250\nThe first sentence.\n\nsecond\n00:03.000 --> 00:05.000 align:start\nThe last word.');
assert.equal(cues.length,2);assert.equal(cues[0].start,.5);assert.equal(cues[1].text,'The last word.');
assert.equal(validateSegments(cues.map(c=>({start:c.start,end:c.end,english:c.text,translations:{}}))).length,2);
assert.throws(()=>parseVtt('WEBVTT\n\n00:05.000 --> 00:03.000\nWrong'));
const {ieltsFolders}=load('lib/ielts-library.ts');
const folders=[{id:'ielts-listening',parentId:null},{id:'ielts-reading',parentId:null},{id:'ielts-reading-general',parentId:'ielts-reading'},{id:'ielts-video-speaking',parentId:null},{id:'ielts-video-part2',parentId:'ielts-video-speaking'},{id:'ielts-video-person',parentId:'ielts-video-part2'}];
assert.deepEqual(Array.from(ieltsFolders(folders,'listening'),f=>f.id),['ielts-listening','ielts-reading','ielts-reading-general']);
assert.deepEqual(Array.from(ieltsFolders(folders,'video'),f=>f.id),['ielts-video-speaking','ielts-video-part2','ielts-video-person']);
console.log('PASS: VTT import, timestamp validation, separate IELTS folder trees.');
