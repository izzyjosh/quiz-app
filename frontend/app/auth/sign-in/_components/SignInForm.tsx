"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import EyeIcon from "@/components/icons/EyeIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import AuthCard from "@/components/ui/AuthCard";
import AuthInput from "@/components/ui/AuthInput";
import SocialAuthButton from "@/components/ui/SocialAuthButton";
import Logo from "@/components/ui/logo";
import { login } from "@/lib/api/auth";

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let hasError = false;

    if (!trimmedEmail) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!emailPattern.test(trimmedEmail)) {
      setEmailError("Enter a valid email address.");
      hasError = true;
    } else {
      setEmailError(undefined);
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    } else {
      setPasswordError(undefined);
    }

    if (hasError || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login({
        email: trimmedEmail,
        password,
      });

      const token = response?.data?.token;
      if (token) {
        localStorage.setItem("accessToken", token);
      }

      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard className="mx-auto w-full max-w-xl">
      <section className="space-y-5">
        <div>
          <Logo size="sm" href="" showGlow={false} />
          <h1 className="mt-4 text-3xl font-extrabold text-slate-100">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-400">
            Sign in to continue to your quizzes and live sessions.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SocialAuthButton icon={<GoogleIcon />} label="Google" />
          <SocialAuthButton icon={<GitHubIcon />} label="GitHub" />
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="h-px flex-1 bg-slate-700" />
          <span>or with email</span>
          <span className="h-px flex-1 bg-slate-700" />
        </div>

        <div className="space-y-4">
          <AuthInput
            label="Email address"
            placeholder="you@example.com"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) {
                setEmailError(undefined);
              }
            }}
            autoComplete="email"
            errorText={emailError}
          />

          <AuthInput
            label="Password"
            placeholder="Enter your password"
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) {
                setPasswordError(undefined);
              }
            }}
            autoComplete="current-password"
            rightAdornment={<EyeIcon className="h-5 w-5" />}
            onRightAdornmentClick={() => setShowPassword((value) => !value)}
            errorText={passwordError}
          />
        </div>

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-xl border border-indigo-400/50 bg-indigo-500/10 px-5 py-3 font-semibold text-indigo-100 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-100 border-r-transparent" />
              <span className="sr-only">Signing in</span>
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-indigo-300 hover:text-indigo-200"
          >
            Create one
          </Link>
        </p>
      </section>
    </AuthCard>
  );
}
