import type { ReactNode } from "react";

interface SocialAuthButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export default function SocialAuthButton({
  icon,
  label,
  onClick,
}: SocialAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 font-semibold text-slate-100 transition hover:border-indigo-400/50 hover:bg-slate-900"
    >
      <span className="text-slate-200">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
