import type { Quiz } from "./types";
import { getQuizThemeOptions } from "@/lib/quizTheme";

type QuizSettingsPanelProps = {
  quiz: Quiz;
  onQuizChange: (nextQuiz: Quiz) => void;
};

const DIFFICULTIES: Array<Quiz["difficulty"]> = ["easy", "medium", "hard"];
const THEME_CHOICES = getQuizThemeOptions();

export default function QuizSettingsPanel({
  quiz,
  onQuizChange,
}: QuizSettingsPanelProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/30">
      <h2 className="text-2xl font-bold text-white">Quiz settings</h2>

      <div className="mt-5 space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Title
          </label>
          <input
            value={quiz.title}
            maxLength={60}
            onChange={(event) =>
              onQuizChange({ ...quiz, title: event.target.value })
            }
            placeholder="e.g. Advanced React Patterns"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
          />
          <p className="mt-1 text-right text-xs text-slate-500">
            {quiz.title.length} / 60
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Description
          </label>
          <textarea
            value={quiz.description}
            maxLength={120}
            onChange={(event) =>
              onQuizChange({ ...quiz, description: event.target.value })
            }
            rows={4}
            placeholder="What will participants be tested on?"
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
          />
          <p className="mt-1 text-right text-xs text-slate-500">
            {quiz.description.length} / 120
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Theme
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {THEME_CHOICES.map((theme) => {
              const selected = quiz.themeKey === theme.key;
              return (
                <button
                  key={theme.key}
                  type="button"
                  onClick={() =>
                    onQuizChange({
                      ...quiz,
                      themeKey: theme.key,
                      icon: theme.icon,
                      accentColor: theme.accentColor,
                    })
                  }
                  className={[
                    "rounded-xl border px-3 py-3 text-left transition",
                    selected
                      ? "border-indigo-400 bg-indigo-500/20"
                      : "border-white/10 bg-slate-800/70 hover:border-white/20",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl"
                      style={{ backgroundColor: `${theme.accentColor}22` }}
                    >
                      {theme.icon}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-100">
                        {theme.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {theme.key}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Selected theme
          </p>
          <div className="mt-2 rounded-xl border border-white/10 bg-slate-800/70 px-4 py-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <span>
                {THEME_CHOICES.find((theme) => theme.key === quiz.themeKey)
                  ?.label || "Core"}
              </span>
              <span
                className="inline-flex h-6 w-6 rounded-full border border-white/20"
                style={{ backgroundColor: quiz.accentColor }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Difficulty
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((level) => {
              const selected = quiz.difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onQuizChange({ ...quiz, difficulty: level })}
                  className={[
                    "rounded-xl border px-3 py-2 font-semibold capitalize transition",
                    selected
                      ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                      : "border-white/10 bg-slate-800/70 text-slate-200 hover:border-white/20",
                  ].join(" ")}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Category tag
          </label>
          <input
            value={quiz.category}
            onChange={(event) =>
              onQuizChange({ ...quiz, category: event.target.value })
            }
            placeholder="e.g. Frontend, Backend, CS Fundamentals"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
          />
        </div>
      </div>
    </section>
  );
}
