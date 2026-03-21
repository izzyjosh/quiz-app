export default function LandingBenefits() {
  return (
    <section className="py-8 sm:py-10">
      <h2 className="text-xl font-bold sm:text-2xl">Why people use QuizSync</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <h3 className="text-lg font-semibold">Fast quiz setup</h3>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Create quiz blueprints in minutes with timed questions and
            difficulty tags.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <h3 className="text-lg font-semibold">Live competition</h3>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Run real-time sessions with instant scoring and crowd-ready
            leaderboards.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <h3 className="text-lg font-semibold">Track progress</h3>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Follow your stats, improve weak areas, and climb seasonal rankings.
          </p>
        </article>
      </div>
    </section>
  );
}
