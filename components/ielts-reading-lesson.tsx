"use client";
import {useState} from 'react';
import {InteractiveEnglish} from '@/components/interactive-english';
import {LearningTranslation,TranslationLanguagePicker} from '@/components/learning-translation';
import type {TranslationLanguage} from '@/lib/languages';
import type {ReadingQuestion} from '@/lib/ielts-practice';

export function IeltsReadingLesson({id,title,passage,instructions,track,questions,vocabulary}:{id:string;title:string;passage:string;instructions:string;track:string;questions:ReadingQuestion[];vocabulary:string}){
 const [answers,setAnswers]=useState<Record<number,string>>({}),[checked,setChecked]=useState(false),[language,setLanguage]=useState<TranslationLanguage>('fa');
 async function choose(value:TranslationLanguage){setLanguage(value);await fetch('/api/preferences/translation-language',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({language:value})}).catch(()=>{})}
 return <div className="ielts-reading-layout"><section className="detail-panel"><span className="section-eyebrow">{track==='general'?'GENERAL TRAINING':'ACADEMIC'} READING</span><h2>{title}</h2>{instructions&&<p>{instructions}</p>}<TranslationLanguagePicker value={language} onChange={choose}/>{passage.split(/\n\s*\n/).filter(Boolean).map((paragraph,i)=><p key={i} className="ielts-reading-paragraph"><InteractiveEnglish text={paragraph} tapForMeaning/></p>)}<LearningTranslation section="ielts" id={id} field="answer" language={language}/></section><aside className="detail-panel"><h2>Questions</h2>{questions.map((q,i)=><div className="ielts-reading-question" key={i}><label><strong>{i+1}. {q.prompt}</strong><input value={answers[i]||''} onChange={e=>setAnswers({...answers,[i]:e.target.value})} placeholder="Type your answer"/></label>{checked&&<p role="status"><strong>Model answer:</strong> {q.answer}{q.explanation&&<> · {q.explanation}</>}</p>}</div>)}<button type="button" className="button primary" onClick={()=>setChecked(true)}>Check model answers</button>{vocabulary.trim()&&<div className="ielts-vocabulary"><h3>Key IELTS vocabulary and structures</h3>{vocabulary.split(/\n|,/).map(s=>s.trim()).filter(Boolean).map((term,i)=><p key={i}><InteractiveEnglish text={term} tapForMeaning phraseAction/></p>)}</div>}</aside></div>
}
