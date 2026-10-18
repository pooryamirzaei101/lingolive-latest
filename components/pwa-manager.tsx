"use client";

import {Download, RefreshCw, WifiOff, X} from "lucide-react";
import {useEffect, useState} from "react";

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{outcome:"accepted"|"dismissed";platform:string}>;
}

export function PwaManager(){
  const [installPrompt,setInstallPrompt]=useState<InstallPromptEvent|null>(null);
  const [waiting,setWaiting]=useState<ServiceWorker|null>(null);
  const [offline,setOffline]=useState(false);
  const [dismissed,setDismissed]=useState(false);

  useEffect(()=>{
    setOffline(!navigator.onLine);
    const online=()=>setOffline(false),offlineNow=()=>setOffline(true);
    const offerInstall=(event:Event)=>{event.preventDefault();setInstallPrompt(event as InstallPromptEvent);setDismissed(false)};
    window.addEventListener("online",online);
    window.addEventListener("offline",offlineNow);
    window.addEventListener("beforeinstallprompt",offerInstall);
    if("serviceWorker" in navigator){
      navigator.serviceWorker.register("/sw.js").then(registration=>{
        if(registration.waiting)setWaiting(registration.waiting);
        registration.addEventListener("updatefound",()=>{
          const worker=registration.installing;
          worker?.addEventListener("statechange",()=>{
            if(worker.state==="installed"&&navigator.serviceWorker.controller)setWaiting(worker);
          });
        });
        registration.update().catch(()=>{});
      }).catch(()=>{});
      let refreshing=false;
      const reload=()=>{if(!refreshing){refreshing=true;window.location.reload()}};
      navigator.serviceWorker.addEventListener("controllerchange",reload);
      return()=>{
        window.removeEventListener("online",online);
        window.removeEventListener("offline",offlineNow);
        window.removeEventListener("beforeinstallprompt",offerInstall);
        navigator.serviceWorker.removeEventListener("controllerchange",reload);
      };
    }
    return()=>{
      window.removeEventListener("online",online);
      window.removeEventListener("offline",offlineNow);
      window.removeEventListener("beforeinstallprompt",offerInstall);
    };
  },[]);

  async function install(){
    if(!installPrompt)return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  if(offline)return <div className="pwa-status" role="status"><WifiOff size={18}/><span>You are offline. Saved app pages remain available.</span></div>;
  if(waiting)return <div className="pwa-status" role="status"><RefreshCw size={18}/><span>A new version is ready.</span><button type="button" onClick={()=>waiting.postMessage({type:"SKIP_WAITING"})}>Update</button></div>;
  if(installPrompt&&!dismissed)return <div className="pwa-install" role="status"><Download size={20}/><div><strong>Install LingoLive</strong><span>Use it like an app on this device.</span></div><button className="button primary" type="button" onClick={install}>Install</button><button className="pwa-dismiss" type="button" aria-label="Dismiss install suggestion" onClick={()=>setDismissed(true)}><X size={18}/></button></div>;
  return null;
}
