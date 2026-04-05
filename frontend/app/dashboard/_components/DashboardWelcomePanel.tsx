"use client";

import { useAuth } from "@/context/authContext";
import { useSessionStats } from "@/hooks/session";

export default function DashboardWelcomePanel() {
  const auth = useAuth();
  const { stats: sessionStats } = useSessionStats();
  const username = auth.user?.username || "player";
  const statCards = [
    {
      value: sessionStats.activeParticipants.toLocaleString(),
      label: "ONLINE NOW",
    },
    { value: sessionStats.activeSessions, label: "LIVE SESSIONS" },
    {
      value: sessionStats.totalQuizTemplates.toLocaleString(),
      label: "BLUEPRINTS",
    },
    { value: "99.1%", label: "UPTIME" },
  ];

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-indigo-500/30 bg-slate-900/70 px-4 py-4 shadow-xl shadow-black/25 sm:px-6 sm:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-indigo-400/60 bg-indigo-500/10 sm:h-16 sm:w-16">
            <img
              src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(username)}`}
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </span>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold text-slate-100 sm:text-3xl">
              Welcome, {username}! <span aria-hidden="true">🎉</span>
            </h1>
            <p className="mt-2 truncate text-slate-400">
              Logged in as
              <span className="font-bold text-cyan-400"> @{username}</span>
              <span className="text-slate-300"> · Ready to quiz?</span>
            </p>
          </div>
        </div>
      </div>

      <div className="inline-grid w-fit grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {statCards.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-700/70 bg-slate-900/65 px-4 py-3.5 sm:px-5 sm:py-4"
          >
            <p className="text-3xl font-extrabold leading-none text-indigo-400 sm:text-4xl">
              {item.value}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
