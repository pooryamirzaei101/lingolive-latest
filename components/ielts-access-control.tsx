"use client";
import {useState} from 'react';
export function IeltsAccessControl({id,initialFree}:{id:string;initialFree:boolean}){
 const [free,setFree]=useState(initialFree),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function update(value:boolean){setBusy(true);try{const response=await fetch(`/api/admin/ielts-speaking/${id}/access`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({free:value})}),data=await response.json() as {error?:string};if(!response.ok)throw Error(data.error||'Could not change access.');setFree(value);setMessage('Access saved.')}catch(error){setMessage(error instanceof Error?error.message:'Could not save access.')}finally{setBusy(false)}}
 return <label>Student access<select value={free?'free':'premium'} disabled={busy} onChange={e=>update(e.target.value==='free')}><option value="premium">Premium</option><option value="free">Free</option></select><span role="status">{message}</span></label>
}
