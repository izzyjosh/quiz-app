import Link from "next/link";

import AuthInput from "@/components/ui/AuthInput";
import SelectableChip from "@/components/ui/SelectableChip";

interface SignUpUsernameStepProps {
  username: string;
  usernameError?: string;
  isUsernameAvailable: boolean;
  suggestions: string[];
  onUsernameChange: (value: string) => void;
  onSuggestionClick: (value: string) => void;
}

export default function SignUpUsernameStep({
  username,
  usernameError,
  isUsernameAvailable,
  suggestions,
  onUsernameChange,
  onSuggestionClick,
}: SignUpUsernameStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100">
          Choose a username
        </h1>
        <p className="mt-2 text-slate-400">
          This is how other players will see you in the leaderboard.
        </p>
      </div>

      <AuthInput
        label="Username"
        placeholder="yourname"
        required
        minLength={4}
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        helperText={
          isUsernameAvailable ? `${username} is available` : undefined
        }
        errorText={usernameError}
      />

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
          Suggestions - click to use
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <SelectableChip
              key={item}
              label={item}
              selected={item === username}
              onClick={() => onSuggestionClick(item)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4 text-sm text-slate-300">
        Usernames are public and permanent. You can change your display name
        later, but not your username.
      </div>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/auth/sign-in"
          className="font-semibold text-indigo-300 hover:text-indigo-200"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
}
