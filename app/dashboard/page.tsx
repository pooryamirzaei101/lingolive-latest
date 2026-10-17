import {lessons} from "@/lib/content";
import { ProgressBoard } from "@/components/progress-board";
export default function Dashboard(){return <><section className="page-hero"><div className="shell"><span className="section-eyebrow">YOUR LEARNING</span><h1>Your English journey.</h1><p>Pick up a lesson you saved or see what you have completed on this device.</p></div></section><section className="section shell page-content"><ProgressBoard lessons={lessons.map(({slug,title})=>({slug,title}))}/></section></>}
