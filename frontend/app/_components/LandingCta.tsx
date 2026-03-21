import Link from "next/link";

export default function LandingCta() {
  return (
    <section className="py-10 sm:py-12">
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-cyan-500/10 p-5 text-center sm:p-8">
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Ready to start your first session?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Create your account to unlock your dashboard, save quiz blueprints,
          and join live challenges instantly.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/auth/sign-up"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 py-3 font-semibold text-white transition hover:opacity-90 sm:w-auto"
          >
            Create account
          </Link>
          <Link
            href="/auth/sign-in"
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-100 transition hover:border-indigo-400/50 sm:w-auto"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </section>
  );
}
