'use client';
import {useEffect,useState} from 'react';
export function InviteLink({code}:{code:string}){
 const [link,setLink]=useState(`/invite/${code}`),[message,setMessage]=useState('');
 useEffect(()=>setLink(`${window.location.origin}/invite/${code}`),[code]);
 async function copy(){try{await navigator.clipboard.writeText(link);setMessage('Link copied.')}catch{setMessage('Copy the link above to share it.')}}
 async function share(){try{if(navigator.share)await navigator.share({title:'Join me on LingoLive',text:'Learn English with me!',url:link});else await copy()}catch{/* Share sheet dismissed. */}}
 return <div><label htmlFor="referral-link">Your personal link</label><input id="referral-link" value={link} readOnly onFocus={event=>event.currentTarget.select()} style={{width:'100%',margin:'8px 0 12px'}}/><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button className="button primary" type="button" onClick={share}>Share link</button><button className="button secondary" type="button" onClick={copy}>Copy link</button></div><p role="status">{message}</p></div>
}
