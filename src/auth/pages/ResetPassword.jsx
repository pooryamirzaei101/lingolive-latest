import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import PasswordStrength from "../components/PasswordStrength";
import { supabase } from "../../lib/supabase";

export default function ResetPassword(){
 const navigate=useNavigate();const [password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(false);
 async function submit(e){e.preventDefault();setError("");if(password.length<8)return setError("Password must contain at least 8 characters.");if(password!==confirm)return setError("Passwords do not match.");if(!supabase)return setError("Account services are not configured yet.");setLoading(true);const result=await supabase.auth.updateUser({password});setLoading(false);if(result.error)setError(result.error.message);else navigate("/profile",{replace:true})}
 return <AuthLayout><AuthCard title="Choose a new password" subtitle="Use at least 8 characters and avoid passwords you use elsewhere."><form onSubmit={submit}><AuthInput label="New Password" type="password" placeholder="Create a secure password" value={password} onChange={e=>setPassword(e.target.value)}/><PasswordStrength password={password}/><div className="mt-5"><AuthInput label="Confirm New Password" type="password" placeholder="Enter it again" value={confirm} onChange={e=>setConfirm(e.target.value)}/></div>{error&&<div className="mb-5 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4">{error}</div>}<button disabled={loading} className="w-full bg-[#176b4d] hover:bg-[#0d4d36] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold transition">{loading?"Updating…":"Update password"}</button></form></AuthCard></AuthLayout>
}
