"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { translationLanguages } from "@/lib/languages";
export function AccountForm({current}:{current?:string}){
  const router=useRouter(),[language,setLanguage]=useState(current||"fa"),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setMessage("");try{
    const response=await fetch("/api/account",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({translationLanguage:language})});
    const data=await response.json() as {error?:string};if(!response.ok)throw new Error(data.error||"Could not save your profile.");
    setMessage(current?"Language saved.":"Profile created.");router.refresh();
  }catch(error){setMessage(error instanceof Error?error.message:"Could not save your profile.")}finally{setBusy(false)}}
  return <form className="admin-form account-form" onSubmit={submit}><label htmlFor="translation-language">Preferred translation language</label><select id="translation-language" value={language} onChange={e=>setLanguage(e.target.value)}>{Object.entries(translationLanguages).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select><p>English remains the learning language. This preference is saved to your account. Reviewed sample translations are available in Persian. Other languages will become available when a translation service is connected.</p><button className="button primary" disabled={busy}>{busy?"Saving…":current?"Save language":"Create learner profile"}</button><p role="status">{message}</p></form>
}
