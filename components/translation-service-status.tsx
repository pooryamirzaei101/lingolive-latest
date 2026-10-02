"use client";
import { useState } from "react";
export function TranslationServiceStatus({connected}:{connected:boolean}){
  const [checking,setChecking]=useState(false),[message,setMessage]=useState("");
  async function test(){setChecking(true);setMessage("");try{const response=await fetch("/api/admin/translation-service",{method:"POST"}),data=await response.json() as {testPassed?:boolean;error?:string};setMessage(data.testPassed?"Connection works. Live word translation is available in supported languages.":data.error||"The translation service did not respond.")}catch{setMessage("Could not test the translation connection.")}finally{setChecking(false)}}
  return <div className="detail-panel translation-status"><h2>{connected?"Connection configured":"No live service connected"}</h2><p>{connected?"A translation service is configured. Test it before relying on live translations.":"No external provider is active. You can still use reviewed Persian translations. Choose a provider later to enable other languages."}</p>{connected&&<button type="button" className="button secondary" disabled={checking} onClick={test}>{checking?"Testing…":"Test connection"}</button>}<p role="status">{message}</p></div>
}
