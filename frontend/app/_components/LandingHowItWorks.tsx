export default function LandingHowItWorks() {
  return (
    <section className="py-8 sm:py-10">
      <h2 className="text-xl font-bold sm:text-2xl">How it works</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <p className="text-sm font-semibold text-indigo-300">Step 1</p>
          <p className="mt-2 text-lg font-semibold">Create account</p>
          <p className="mt-1 text-sm text-slate-400 sm:text-base">
            Sign up with email or social auth and choose your username and
            avatar.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <p className="text-sm font-semibold text-indigo-300">Step 2</p>
          <p className="mt-2 text-lg font-semibold">Join or host</p>
          <p className="mt-1 text-sm text-slate-400 sm:text-base">
            Enter active sessions or create your own blueprint-driven quiz
            rooms.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <p className="text-sm font-semibold text-indigo-300">Step 3</p>
          <p className="mt-2 text-lg font-semibold">Compete and improve</p>
          <p className="mt-1 text-sm text-slate-400 sm:text-base">
            Answer under time pressure, earn points, and track your growth over
            time.
          </p>
        </div>
      </div>
    </section>
  );
}
