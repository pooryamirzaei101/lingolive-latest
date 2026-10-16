import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import PasswordStrength from "../components/PasswordStrength";
import SocialLogin from "../components/SocialLogin";

import BackButton from "../../components/BackButton";

import { supabase } from "../../lib/supabase";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Validate fields
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate password
    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Confirm password
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (!supabase) {
        setError("Account services are not configured yet.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,

        options: {
          data: {
            full_name: form.name.trim(),
            onboarding_complete: false,
          },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        console.error("Registration error:", error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log("Registration successful:", data);

      // Supabase requires email confirmation
      if (data.user && !data.session) {
        setSuccess(
          "Account created successfully! Please check your email to confirm your account."
        );

        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setLoading(false);
        return;
      }

      // Email confirmation is disabled
      setSuccess(
        "Account created successfully! Redirecting..."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setLoading(false);

      setTimeout(() => {
        navigate("/onboarding");
      }, 1000);
    } catch (registrationError) {
      console.error(
        "Unexpected registration error:",
        registrationError
      );

      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout>

      {/* ================= Back Button ================= */}

      <div className="max-w-md mx-auto mb-4">
        <BackButton />
      </div>

      {/* ================= Register Card ================= */}

      <AuthCard
        title="Create Account"
        subtitle="Start your English learning journey."
      >

        <form onSubmit={handleRegister}>

          {/* Full Name */}

          <AuthInput
            label="Full Name"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
          />

          {/* Email */}

          <AuthInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
          />

          {/* Password */}

          <AuthInput
            label="Password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={(event) =>
              updateField("password", event.target.value)
            }
          />

          <PasswordStrength password={form.password} />

          {/* Confirm Password */}

          <div className="mt-5">
            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="Enter your password again"
              value={form.confirmPassword}
              onChange={(event) =>
                updateField(
                  "confirmPassword",
                  event.target.value
                )
              }
            />
          </div>

          {/* Terms */}

          <label className="flex items-start gap-3 mb-6 text-sm text-gray-600">

            <input
              type="checkbox"
              required
              className="mt-1"
            />

            <span>
              I agree to the Terms of Service and Privacy Policy.
            </span>

          </label>

          {/* Error */}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
              {success}
            </div>
          )}

          {/* Register Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Social Login */}

        <SocialLogin />

        {/* Login */}

        <div className="mt-8 text-center">

          <span className="text-gray-600">
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="ml-2 text-blue-600 hover:underline"
          >
            Login
          </button>

        </div>

      </AuthCard>

    </AuthLayout>
  );
}
