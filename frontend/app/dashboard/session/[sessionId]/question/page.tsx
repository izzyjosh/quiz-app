"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";

type Option = {
  id: string;
  key: string;
  text: string;
};

type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
};

const options: Option[] = [
  { id: "opt-a", key: "A", text: "Strings" },
  { id: "opt-b", key: "B", text: "Numbers" },
  { id: "opt-c", key: "C", text: "Objects" },
  { id: "opt-d", key: "D", text: "Any primitive" },
];

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "JSNinja", score: 520 },
  { rank: 2, name: "AsyncKing", score: 492 },
  { rank: 3, name: "CallbackHell", score: 94 },
  { rank: 4, name: "CodeWizard99", score: 0 },
];

export default function SessionQuestionPage() {
  return (
    <ProtectedRoute>
      <header className="relative z-50">
        <DashboardHeader />
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1280px] px-3 pb-8 pt-6 sm:px-5 lg:px-8">
        <section className="relative overflow-hidden rounded-[30px] border border-cyan-400/15 bg-[#030b21] shadow-[0_30px_90px_-40px_rgba(7,57,169,0.95)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -right-20 top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>

          <div className="relative grid min-h-[70vh] grid-cols-1 lg:grid-cols-[1.45fr_0.75fr]">
            <div className="border-b border-cyan-400/10 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-400/15 bg-slate-950/70 p-3">
                <span className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                  Room: <strong>JS-1694</strong>
                </span>

                <div className="h-2 min-w-[120px] flex-1 overflow-hidden rounded-full bg-slate-800/80">
                  <span className="block h-full w-[75%] rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400" />
                </div>

                <div className="text-sm text-slate-300">Q 4/4</div>

                <div className="rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-200">
                  0 pts
                </div>

                <TimerRing value={35} label="7" />
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-200">
                <span>Active now:</span>
                <span>4</span>
              </div>

              <article className="mt-5 rounded-3xl border border-cyan-300/15 bg-slate-950/55 p-4 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.11em]">
                  <div className="flex gap-2">
                    <span className="rounded-lg bg-indigo-500/20 px-2.5 py-1 text-indigo-200">
                      Collection
                    </span>
                    <span className="rounded-lg bg-orange-500/20 px-2.5 py-1 text-orange-200">
                      Hard
                    </span>
                    <span className="rounded-lg bg-cyan-500/20 px-2.5 py-1 text-cyan-200">
                      20s
                    </span>
                  </div>

                  <span className="text-cyan-200/80">+300 pts</span>
                </div>

                <h1 className="text-2xl font-black text-white sm:text-4xl">
                  WeakMap keys must be?
                </h1>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/65 px-3 py-3 text-left text-base font-semibold text-slate-100 transition hover:border-cyan-400/50"
                    >
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700/90 text-sm font-extrabold text-slate-300">
                        {option.key}
                      </span>
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div>
              </article>
            </div>

            <aside className="p-4 sm:p-6 lg:p-8">
              <div className="rounded-2xl border border-cyan-400/15 bg-slate-950/60">
                <div className="flex items-center justify-between border-b border-cyan-400/10 px-4 py-3">
                  <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-cyan-100/80">
                    Leaderboard
                  </h2>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <ol className="space-y-1 p-3 sm:p-4">
                  {leaderboard.map((entry) => (
                    <li
                      key={`${entry.rank}-${entry.name}`}
                      className="grid grid-cols-[26px_1fr_auto] items-center gap-2 rounded-xl border border-transparent px-2 py-2.5 transition hover:border-cyan-400/20 hover:bg-cyan-500/5"
                    >
                      <span
                        className={[
                          "text-center text-lg font-extrabold",
                          entry.rank === 1
                            ? "text-amber-300"
                            : entry.rank === 2
                              ? "text-slate-300"
                              : entry.rank === 3
                                ? "text-orange-300"
                                : "text-slate-500",
                        ].join(" ")}
                      >
                        {entry.rank}
                      </span>

                      <span className="truncate text-base font-bold text-slate-100">
                        {entry.name}
                      </span>

                      <span className="text-lg font-black text-indigo-300">
                        {entry.score}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

function TimerRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-900/80">
      <div
        className="grid h-12 w-12 place-items-center rounded-full border border-slate-700 text-lg font-black text-white"
        style={{
          background: `conic-gradient(#f59e0b ${value * 3.6}deg, rgba(100,116,139,0.25) 0deg)`,
        }}
      >
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[#071633] text-sm font-extrabold">
          {label}
        </div>
      </div>
    </div>
  );
}
