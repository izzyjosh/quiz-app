import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="grid items-center gap-8 py-6 sm:py-10 md:grid-cols-2 md:gap-10 md:py-16">
      <div>
        <p className="mb-3 inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-300 sm:text-xs">
          Real-time multiplayer quiz platform
        </p>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          Host, join, and compete in high-energy quiz sessions.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
          QuizSync helps teams and communities run engaging live quizzes with
          leaderboards, timed rounds, and instant results. Sign in to access
          your dashboard, create blueprints, and launch sessions.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
          <Link
            href="/auth/sign-up"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:opacity-90 sm:w-auto"
          >
            Create account
          </Link>
          <Link
            href="/auth/sign-in"
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:border-indigo-400/50 sm:w-auto"
          >
            Sign in
          </Link>
        </div>

        <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-center sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-2xl font-bold text-indigo-300">3,256</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Online now
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-2xl font-bold text-cyan-300">4</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Live sessions
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-2xl font-bold text-violet-300">99.1%</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Uptime
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
          <div className="h-1 bg-gradient-to-r from-indigo-400 to-cyan-400" />
          <div className="space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Live now</h2>
              <span className="text-xs font-medium text-emerald-300 sm:text-sm">
                247 playing
              </span>
            </div>
            <p className="text-xl font-bold sm:text-2xl">System Design</p>
            <p className="text-slate-400">
              Distributed systems, scalability, and architecture tradeoffs.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-indigo-500/20 px-2 py-1 text-indigo-300">
                  Engineering
                </span>
                <span className="rounded-md bg-slate-700 px-2 py-1 text-slate-300">
                  Hard
                </span>
              </div>
              <Link
                href="/auth/sign-in"
                className="inline-flex w-full items-center justify-center rounded-lg border border-indigo-400/60 px-4 py-2 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/10 sm:w-auto"
              >
                Join after login
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300 sm:p-5">
          You are currently viewing the guest homepage. Sign in to see your
          personalized dashboard, active sessions, quiz history, and ranking.
        </div>
      </div>
    </section>
  );
}
