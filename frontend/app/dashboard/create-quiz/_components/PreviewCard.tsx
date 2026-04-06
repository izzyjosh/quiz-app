import type { Quiz } from "./types";
import { getQuizTheme } from "@/lib/quizTheme";

type PreviewCardProps = {
  quiz: Quiz;
};

export default function PreviewCard({ quiz }: PreviewCardProps) {
  const theme = getQuizTheme(quiz.themeKey);
  const previewIcon = quiz.icon || theme.icon;
  const previewAccentColor = quiz.accentColor || theme.accentColor;

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/30">
      <h2 className="text-2xl font-bold text-white">Preview</h2>

      <article
        className={[
          "mt-4 rounded-2xl border border-indigo-400/30 bg-slate-900/80 p-5",
          theme.accentClass,
        ].join(" ")}
        style={{ borderTopColor: previewAccentColor }}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{ backgroundColor: `${previewAccentColor}33` }}
          >
            {previewIcon}
          </span>
          <span className="text-xs font-semibold text-indigo-300">Preview</span>
        </div>

        <h3 className="mt-4 text-3xl font-extrabold text-white">
          {quiz.title || "Your Quiz Title"}
        </h3>
        <p className="mt-1 text-slate-400">
          {quiz.description || "Your description will appear here..."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase text-indigo-200">
            {quiz.category || "Category"}
          </span>
          <span className="rounded-lg bg-slate-700 px-3 py-1 text-xs font-bold uppercase text-slate-200">
            {quiz.difficulty}
          </span>
          <span className="rounded-lg bg-slate-700 px-3 py-1 text-xs font-bold uppercase text-slate-200">
            {quiz.questions.length} qs
          </span>
        </div>
      </article>
    </section>
  );
}
