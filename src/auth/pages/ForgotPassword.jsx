import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const [email,setEmail]=useState(""),[message,setMessage]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(false);
  async function submit(event){event.preventDefault();setError("");setMessage("");if(!supabase)return setError("Account services are not configured yet.");setLoading(true);const result=await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(),{redirectTo:`${window.location.origin}/reset-password`});setLoading(false);if(result.error)setError(result.error.message);else setMessage("Check your inbox for a secure, time-limited password reset link.")}
  return <AuthLayout><AuthCard title="Reset your password" subtitle="Enter your account email and we’ll send a secure reset link."><form onSubmit={submit}><AuthInput label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>{error&&<div className="mb-5 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4">{error}</div>}{message&&<div className="mb-5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-4">{message}</div>}<button disabled={loading} className="w-full bg-[#176b4d] hover:bg-[#0d4d36] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold transition">{loading?"Sending…":"Send reset link"}</button></form><p className="mt-7 text-center"><Link className="font-bold text-[#176b4d]" to="/login">← Back to sign in</Link></p></AuthCard></AuthLayout>
}
