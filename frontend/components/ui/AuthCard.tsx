import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export default function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 shadow-2xl shadow-slate-950/40",
        className,
      ].join(" ")}
    >
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />
      <div className="p-5 sm:p-8">{children}</div>
    </div>
  );
}
