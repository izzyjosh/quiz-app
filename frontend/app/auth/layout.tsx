import type { ReactNode } from "react";
import Link from "next/link";

import Logo from "@/components/ui/logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[-120px] top-[-90px] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-120px] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8">
        <aside className="hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <Logo size="md" />
            <h1 className="mt-10 text-4xl font-extrabold leading-tight">
              Compete live.
              <br />
              Learn faster.
            </h1>
            <p className="mt-4 max-w-sm text-slate-300">
              Join QuizSync to host sessions, build quiz blueprints, and climb
              the leaderboard with your community.
            </p>
          </div>

          <div className="space-y-2 text-sm text-slate-400">
            <p>Need help getting started?</p>
            <Link
              href="/"
              className="font-semibold text-indigo-300 hover:text-indigo-200"
            >
              Back to homepage
            </Link>
          </div>
        </aside>

        <main className="flex items-center justify-center py-4 lg:py-0">
          {children}
        </main>
      </div>
    </div>
  );
}
