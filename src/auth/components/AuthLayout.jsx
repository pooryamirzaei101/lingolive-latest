import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-[#f7faf8] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="hidden lg:flex bg-[#0d4d36] text-white p-12 flex-col justify-between relative overflow-hidden">
        <Link to="/" className="relative z-10 text-2xl font-black tracking-tight"><span className="inline-grid place-items-center h-10 w-10 rounded-xl bg-white text-[#176b4d] mr-3">L</span>Lingo<span className="text-emerald-200">Live</span></Link>
        <div className="relative z-10 max-w-md">
          <span className="text-xs font-black tracking-[.18em] uppercase text-emerald-200">Your learning space</span>
          <h2 className="font-serif text-5xl leading-[1.05] tracking-tight mt-5 mb-6">English that fits your life, not the other way around.</h2>
          <p className="text-lg leading-8 text-emerald-100">Tell us where you are and where you want to go. LingoLive builds a clear path from there.</p>
        </div>
        <p className="relative z-10 text-sm text-emerald-200">Private by design · Preferences stay editable</p>
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full border-[90px] border-white/5"/>
      </aside>
      <section className="flex min-h-screen items-center justify-center p-5 sm:p-10">{children}</section>
    </main>
  );
}
