"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const languages=[
  ["fa","Persian (فارسی)"],["ar","Arabic (العربية)"],["tr","Turkish (Türkçe)"],["de","German (Deutsch)"],["es","Spanish (Español)"],
  ["fr","French (Français)"],["pt","Portuguese (Português)"],["hi","Hindi (हिन्दी)"],["ur","Urdu (اردو)"],["zh","Chinese (中文)"],
];
export function AccountForm({current}:{current?:string}){
  const router=useRouter(),[language,setLanguage]=useState(current||"fa"),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setMessage("");try{
    const response=await fetch("/api/account",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({translationLanguage:language})});
    const data=await response.json() as {error?:string};if(!response.ok)throw new Error(data.error||"Could not save your profile.");
    setMessage(current?"Language saved.":"Profile created.");router.refresh();
  }catch(error){setMessage(error instanceof Error?error.message:"Could not save your profile.")}finally{setBusy(false)}}
  return <form className="admin-form account-form" onSubmit={submit}><label htmlFor="translation-language">Preferred translation language</label><select id="translation-language" value={language} onChange={e=>setLanguage(e.target.value)}>{languages.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select><p>English remains the learning language. This preference is saved to your account. Current sample lesson translations are available in Persian only.</p><button className="button primary" disabled={busy}>{busy?"Saving…":current?"Save language":"Create learner profile"}</button><p role="status">{message}</p></form>
}
