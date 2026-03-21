"use client";

import { useState } from "react";

import AuthCard from "@/components/ui/AuthCard";
import StepIndicator from "@/components/ui/StepIndicator";
import SignUpAccountStep from "./SignUpAccountStep";
import SignUpAvatarStep from "./SignUpAvatarStep";
import SignUpUsernameStep from "./SignUpUsernameStep";
import type { AvatarCategory } from "./sign-up.constants";
import { signUpSteps, usernameSuggestions } from "./sign-up.constants";

export default function SignUpWizard() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
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

  const isUsernameAvailable = username.trim().length >= 4;

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

    setUsernameError(undefined);
    setStep(3);
  };

  const handleCreateAccount = () => {
    if (!selectedAvatar.trim()) {
      return;
    }

    // TODO: connect to real signup action
  };

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
            onContinue={handleContinueFromAccount}
          />
        ) : null}

        {step === 2 ? (
          <SignUpUsernameStep
            username={username}
            usernameError={usernameError}
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
            onBack={() => setStep(1)}
            onContinue={handleContinueFromUsername}
          />
        ) : null}

        {step === 3 ? (
          <SignUpAvatarStep
            username={username}
            category={category}
            selectedAvatar={selectedAvatar}
            onCategoryChange={setCategory}
            onAvatarChange={setSelectedAvatar}
            onBack={() => setStep(2)}
            onCreateAccount={handleCreateAccount}
          />
        ) : null}
      </div>
    </AuthCard>
  );
}
