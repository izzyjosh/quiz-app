export default function LoadingQuizTemplatesPage() {
  return (
    <section className="rounded-3xl border border-indigo-500/20 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="h-10 w-64 animate-pulse rounded-md bg-slate-800" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded-md bg-slate-800" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-12 w-32 animate-pulse rounded-2xl bg-slate-800" />
          <div className="h-12 w-32 animate-pulse rounded-2xl bg-slate-800" />
        </div>
      </div>

      <div
        className="grid gap-4 md:grid-cols-2"
        aria-label="Loading quiz templates"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            key={`loading-template-${index}`}
            className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60 p-5"
          >
            <div className="h-7 w-2/3 rounded-md bg-slate-800" />
            <div className="mt-3 h-4 w-full rounded-md bg-slate-800" />
            <div className="mt-2 h-4 w-4/5 rounded-md bg-slate-800" />

            <div className="mt-4 grid grid-cols-4 gap-2 border-y border-slate-800 py-3">
              <div className="h-10 rounded-md bg-slate-800" />
              <div className="h-10 rounded-md bg-slate-800" />
              <div className="h-10 rounded-md bg-slate-800" />
              <div className="h-10 rounded-md bg-slate-800" />
            </div>

            <div className="mt-3 flex gap-2">
              <div className="h-7 w-24 rounded-xl bg-slate-800" />
              <div className="h-7 w-20 rounded-xl bg-slate-800" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
