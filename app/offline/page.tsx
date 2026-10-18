import {BookOpenCheck,WifiOff} from "lucide-react";

export const metadata={title:"Offline — LingoLive"};

export default function Offline(){return <section className="section shell page-content"><div className="empty-state"><WifiOff size={42}/><span className="section-eyebrow">OFFLINE MODE</span><h1>You are not connected right now.</h1><p>Reconnect to open lessons, play media, translate words, and sync your learning progress.</p><a className="button primary" href="/">Try again</a><div className="notice"><BookOpenCheck size={20}/><span>LingoLive protects account information and lesson media by keeping them out of the offline cache.</span></div></div></section>}
