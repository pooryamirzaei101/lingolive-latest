/** Break pasted prose into editable sentences; timing is assigned separately. */
export function splitEnglishScript(text:string):string[]{const segmenter=new Intl.Segmenter('en',{granularity:'sentence'});return text.replace(/\r/g,'').split(/\n+/).flatMap(paragraph=>Array.from(segmenter.segment(paragraph),item=>item.segment.trim())).filter(Boolean)}
