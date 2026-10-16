import { Link } from "react-router-dom";
import LearningPreferences from "../components/LearningPreferences";

export default function Profile(){
  return <main className="min-h-screen bg-[#f3f8f5] p-4 sm:p-10"><div className="mx-auto max-w-5xl"><div className="flex items-end justify-between gap-5 mb-7"><div><span className="text-xs font-black tracking-[.16em] uppercase text-[#176b4d]">My account</span><h1 className="font-serif text-5xl font-bold tracking-tight mt-2">Your learning profile.</h1></div><Link to="/dashboard" className="px-5 py-3 rounded-xl border border-slate-200 bg-white font-bold">Learning dashboard</Link></div><section className="bg-white border border-slate-200 rounded-[24px] shadow-xl p-6 sm:p-10"><LearningPreferences account/></section></div></main>
}
