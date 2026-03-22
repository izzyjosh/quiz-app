import GitHubIcon from "@/components/icons/GitHubIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import AuthInput from "@/components/ui/AuthInput";
import SocialAuthButton from "@/components/ui/SocialAuthButton";
import Logo from "@/components/ui/logo";

interface SignUpAccountStepProps {
  email: string;
  password: string;
  confirmPassword: string;
  emailError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
  showPassword: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
}

export default function SignUpAccountStep({
  email,
  password,
  confirmPassword,
  emailError,
  passwordError,
  confirmPasswordError,
  showPassword,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
}: SignUpAccountStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <Logo size="sm" href="" showGlow={false} />
        <h1 className="mt-4 text-3xl font-extrabold text-slate-100">
          Create your account
        </h1>
        <p className="mt-2 text-slate-400">
          Start with your email and a secure password.
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
          onChange={(e) => onEmailChange(e.target.value)}
          autoComplete="email"
          errorText={emailError}
        />
        <AuthInput
          label="Password"
          placeholder="Min 8 characters"
          required
          minLength={8}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          autoComplete="new-password"
          rightAdornment={<EyeIcon className="h-5 w-5" />}
          onRightAdornmentClick={onTogglePassword}
          errorText={passwordError}
        />
        <AuthInput
          label="Confirm password"
          placeholder="Repeat password"
          required
          minLength={8}
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          autoComplete="new-password"
          errorText={confirmPasswordError}
        />
      </div>
    </section>
  );
}
