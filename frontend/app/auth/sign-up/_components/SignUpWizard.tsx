"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register } from "@/lib/auth";

import AuthCard from "@/components/ui/AuthCard";
import StepIndicator from "@/components/ui/StepIndicator";
import SignUpAccountStep from "./SignUpAccountStep";
import SignUpAvatarStep from "./SignUpAvatarStep";
import SignUpUsernameStep from "./SignUpUsernameStep";
import type { AvatarCategory } from "./sign-up.constants";
import { signUpSteps, usernameSuggestions } from "./sign-up.constants";
import { useUsernameCheck } from "@/hooks/usernameCheck";

export default function SignUpWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("apexvector");
  const [category, setCategory] = useState<AvatarCategory>("Animals");
  const [selectedAvatar, setSelectedAvatar] = useState("Wolf");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | undefined
  >();
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const status = useUsernameCheck(username);

  const isUsernameAvailable = status === "available";

  const handleContinueFromAccount = () => {
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
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      hasError = true;
    } else {
      setPasswordError(undefined);
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      hasError = true;
    } else {
      setConfirmPasswordError(undefined);
    }

    if (hasError) {
      return;
    }

    setShowPassword(false);
    setStep(2);
  };

  const handleContinueFromUsername = () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setUsernameError("Username is required.");
      return;
    }

    if (trimmedUsername.length < 4) {
      setUsernameError("Username must be at least 4 characters.");
      return;
    }

    if (status === "checking") {
      setUsernameError("Checking username availability. Please wait.");
      return;
    }

    if (status === "taken") {
      setUsernameError("This username is already taken.");
      return;
    }

    if (status === "error") {
      setUsernameError("Could not verify username availability. Try again.");
      return;
    }

    setUsernameError(undefined);
    setStep(3);
  };

  const handleCreateAccount = async () => {
    if (!selectedAvatar.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await register({
        username: username.trim(),
        email: email.trim(),
        password,
        avatar: selectedAvatar,
      });

      if (!response) {
        throw new Error("Registration failed");
      }
      toast.success("Account created successfully!");

      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (isSubmitting || step === 1) {
      return;
    }

    setStep((currentStep) => currentStep - 1);
  };

  const handlePrimaryAction = () => {
    if (step === 1) {
      handleContinueFromAccount();
      return;
    }

    if (step === 2) {
      handleContinueFromUsername();
      return;
    }

    void handleCreateAccount();
  };

  const showBackButton = step > 1;
  const primaryButtonLabel = step === 3 ? "Create account" : "Continue";

  return (
    <AuthCard className="mx-auto w-full max-w-3xl">
      <div className="space-y-6 sm:space-y-8">
        <StepIndicator steps={signUpSteps} currentStep={step} />

        {step === 1 ? (
          <SignUpAccountStep
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            emailError={emailError}
            passwordError={passwordError}
            confirmPasswordError={confirmPasswordError}
            showPassword={showPassword}
            onEmailChange={(value) => {
              setEmail(value);
              if (emailError) {
                setEmailError(undefined);
              }
            }}
            onPasswordChange={(value) => {
              setPassword(value);
              if (passwordError) {
                setPasswordError(undefined);
              }
              if (confirmPasswordError) {
                setConfirmPasswordError(undefined);
              }
            }}
            onConfirmPasswordChange={(value) => {
              setConfirmPassword(value);
              if (confirmPasswordError) {
                setConfirmPasswordError(undefined);
              }
            }}
            onTogglePassword={() => setShowPassword((value) => !value)}
          />
        ) : null}

        {step === 2 ? (
          <SignUpUsernameStep
            username={username}
            usernameError={usernameError}
            usernameStatus={status}
            isUsernameAvailable={isUsernameAvailable}
            suggestions={usernameSuggestions}
            onUsernameChange={(value) => {
              setUsername(value);
              if (usernameError) {
                setUsernameError(undefined);
              }
            }}
            onSuggestionClick={(value) => {
              setUsername(value);
              if (usernameError) {
                setUsernameError(undefined);
              }
            }}
          />
        ) : null}

        {step === 3 ? (
          <SignUpAvatarStep
            username={username}
            category={category}
            selectedAvatar={selectedAvatar}
            onCategoryChange={setCategory}
            onAvatarChange={setSelectedAvatar}
          />
        ) : null}

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          {showBackButton ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
          ) : null}

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-400/50 bg-indigo-500/10 px-5 py-3 font-semibold text-indigo-100 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {step === 3 && isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-100 border-r-transparent" />
                <span className="sr-only">Creating account</span>
              </>
            ) : (
              primaryButtonLabel
            )}
          </button>
        </div>
      </div>
    </AuthCard>
  );
}
