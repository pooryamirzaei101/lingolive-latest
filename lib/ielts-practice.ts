export type ReadingQuestion={prompt:string;answer:string;explanation:string};
export type CuePoint={at:number;text:string};

export function parseReadingQuestions(value:string):ReadingQuestion[]{
 const lines=value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
 if(lines.length>30)throw Error('Add at most 30 reading questions.');
 return lines.map(line=>{const [prompt,answer,explanation,...extra]=line.split('|').map(s=>s.trim());if(!prompt||!answer||extra.length||prompt.length>500||answer.length>500||(explanation||'').length>1000)throw Error('Use one question per line: Question | Answer | Explanation.');return {prompt,answer,explanation:explanation||''}});
}
export function readingQuestionLines(raw:string):string{try{return (JSON.parse(raw) as ReadingQuestion[]).map(q=>[q.prompt,q.answer,q.explanation].join(' | ')).join('\n')}catch{return ''}}

export function parseCuePoints(value:string):CuePoint[]{
 const lines=value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
 if(lines.length>100)throw Error('Add at most 100 teleprompter cues.');
 let previous=-1;
 return lines.map(line=>{const divider=line.indexOf('|'),at=Number(line.slice(0,divider).trim()),text=line.slice(divider+1).trim();if(divider<1||!Number.isFinite(at)||at<0||at<=previous||!text||text.length>500)throw Error('Use increasing timestamps in seconds: 3.5 | Prompt text.');previous=at;return {at,text}});
}
export function cuePointLines(raw:string):string{try{return (JSON.parse(raw) as CuePoint[]).map(c=>`${c.at} | ${c.text}`).join('\n')}catch{return ''}}
