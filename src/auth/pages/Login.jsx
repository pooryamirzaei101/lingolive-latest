import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import SocialLogin from "../components/SocialLogin";

import BackButton from "../../components/BackButton";

import { supabase } from "../../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        setError("Account services are not configured yet.");
        return;
      }
      // Clear any existing session first
      await supabase.auth.signOut();

      // Login with the email and password entered
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });

      if (loginError) {
        console.error("Login error:", loginError);

        setError(loginError.message);
        return;
      }

      // Get the authenticated user
      const loggedInEmail = data.user?.email || "";

      const ADMIN_EMAIL = "pooryamirzaei101@gmail.com";

if (
  loggedInEmail.trim().toLowerCase() ===
  ADMIN_EMAIL.trim().toLowerCase()
) {
  navigate("/admin");
} else {
  navigate(data.user?.user_metadata?.onboarding_complete ? "/dashboard" : "/onboarding");
}

    } catch (loginException) {
      console.error(
        "Unexpected login error:",
        loginException
      );

      setError(
        "Something went wrong while logging in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>

      {/* Back Button */}

      <div className="mb-6">
        <BackButton />
      </div>

      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue learning."
      >

        <form onSubmit={handleLogin}>

          {/* Email */}

          <AuthInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) =>
              updateField("email", e.target.value)
            }
          />

          {/* Password */}

          <AuthInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) =>
              updateField("password", e.target.value)
            }
          />

          {/* Remember Me / Forgot Password */}

          <div className="flex justify-between items-center mb-6">

            <label className="flex items-center gap-2 text-sm text-gray-600">

              <input
                type="checkbox"
                className="rounded"
              />

              <span>
                Remember me
              </span>

            </label>

            <button
              type="button"
              onClick={() =>
                navigate("/forgot-password")
              }
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot Password?
            </button>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Social Login */}

        <SocialLogin />

        {/* Register */}

        <div className="mt-8 text-center">

          <span className="text-gray-600">
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
            className="ml-2 text-blue-600 hover:underline"
          >
            Register
          </button>

        </div>

      </AuthCard>

    </AuthLayout>
  );
}
