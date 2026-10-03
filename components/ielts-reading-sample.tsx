"use client";
import {LearningTranslation} from "@/components/learning-translation";

import { useState } from "react";
import { InteractiveEnglish } from "@/components/interactive-english";

const passage=[
  {english:"The library opens at nine o’clock on weekdays.",persian:"کتابخانه در روزهای کاری ساعت نه باز می‌شود."},
  {english:"On Saturday, it opens at ten o’clock.",persian:"روز شنبه ساعت ده باز می‌شود."},
  {english:"Visitors can borrow up to three books.",persian:"بازدیدکنندگان می‌توانند تا سه کتاب امانت بگیرند."},
];
const questions=[
  {prompt:"What time does the library open on Saturday?",choices:["Nine o’clock","Ten o’clock","Eleven o’clock"],answer:1,explanation:"The second sentence says it opens at ten o’clock on Saturday."},
  {prompt:"How many books can a visitor borrow?",choices:["One book","Two books","Three books"],answer:2,explanation:"The last sentence says visitors can borrow up to three books."},
];

export function IeltsReadingSample(){
  const [answers,setAnswers]=useState<(number|null)[]>([null,null]);
  const [checked,setChecked]=useState(false);
  const [showTranslation,setShowTranslation]=useState(true);
  const score=answers.filter((answer,index)=>answer===questions[index].answer).length;
  function choose(index:number,value:number){setAnswers(previous=>previous.map((answer,i)=>i===index?value:answer));setChecked(false)}
  return <div className="ielts-sample">
    <div className="ielts-passage detail-panel">
      <div className="ielts-sample-heading"><div><span className="section-eyebrow">READING PASSAGE · SAMPLE</span><h2>A Library Notice</h2></div><label><input type="checkbox" checked={showTranslation} onChange={event=>setShowTranslation(event.target.checked)}/> Translation</label></div>
      <p className="ielts-instruction">Read the notice, then answer the two questions. Tap a word to hear it; double-tap or hold to see its meaning.</p>
      {passage.map((line,index)=><div className="ielts-passage-line" key={index}><p><InteractiveEnglish text={line.english} translation={line.persian}/></p>{showTranslation&&<LearningTranslation section="lesson" id="ielts-reading-notice" field={`line-${index}`} manual={line.persian}/>}</div>)}
    </div>
    <form className="ielts-questions detail-panel" onSubmit={event=>{event.preventDefault();setChecked(true)}}>
      <h2>Questions</h2>
      {questions.map((question,index)=><fieldset key={index}><legend>{index+1}. {question.prompt}</legend>{question.choices.map((choice,option)=><label className={checked&&answers[index]===option?(option===question.answer?"correct":"incorrect"):""} key={option}><input type="radio" name={`question-${index}`} value={option} checked={answers[index]===option} onChange={()=>choose(index,option)}/>{choice}</label>)}{checked&&<p className={answers[index]===question.answer?"ielts-correct":"ielts-incorrect"}>{answers[index]===null?"Choose an answer. ":answers[index]===question.answer?"Correct. ":"Try again. "}{question.explanation}</p>}</fieldset>)}
      <div className="ielts-actions"><button className="button primary" type="submit">Check answers</button><button className="button secondary" type="button" onClick={()=>{setAnswers([null,null]);setChecked(false)}}>Start again</button></div>
      {checked&&<p className="ielts-result" role="status">You answered {score} of {questions.length} correctly. This practice result is not an official IELTS score.</p>}
    </form>
  </div>
}
