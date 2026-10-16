import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SocialLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function continueWithGoogle() {
    if (!supabase) return setError("Account services are not configured yet.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
    if (error) { setError(error.message); setLoading(false); }
  }

  return (
    <div className="mt-7">
      <div className="flex items-center gap-4 mb-5"><div className="flex-1 border-t border-slate-200"/><span className="text-xs font-bold tracking-widest text-slate-400">OR</span><div className="flex-1 border-t border-slate-200"/></div>
      <button type="button" onClick={continueWithGoogle} disabled={loading} className="w-full border border-slate-200 bg-white rounded-xl p-3.5 hover:bg-slate-50 transition font-semibold flex items-center justify-center gap-3 disabled:opacity-60">
        <span className="font-bold text-blue-500">G</span>{loading ? "Connecting…" : "Continue with Google"}
      </button>
      {error && <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-700">{error}</div>}
    </div>
  );
}
