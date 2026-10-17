/** Break pasted prose into editable sentences; timing is assigned separately. */
export function splitEnglishScript(text:string):string[]{const segmenter=new Intl.Segmenter('en',{granularity:'sentence'});return text.replace(/\r/g,'').split(/\n+/).flatMap(paragraph=>Array.from(segmenter.segment(paragraph),item=>item.segment.trim())).filter(Boolean)}

export function hasPlaceholderTiming(rows:{start:number;end:number}[]){return rows.length>0&&rows.every((row,i)=>Math.abs(row.start-i*3)<0.001&&Math.abs(row.end-(i+1)*3)<0.001)}
