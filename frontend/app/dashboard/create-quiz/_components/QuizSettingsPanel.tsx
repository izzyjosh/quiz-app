import type { Quiz } from "./types";

type QuizSettingsPanelProps = {
  quiz: Quiz;
  onQuizChange: (nextQuiz: Quiz) => void;
};

const ICON_CHOICES = [
  "🏗️",
  "⚡",
  "🧮",
  "🔒",
  "🧠",
  "🎯",
  "🚀",
  "🧪",
  "💡",
  "🎮",
];

const COLOR_CHOICES = [
  "#6366f1",
  "#f59e0b",
  "#14b8a6",
  "#ec4899",
  "#f97316",
  "#06b6d4",
  "#8b5cf6",
  "#ef4444",
  "#22c55e",
  "#a855f7",
];

const DIFFICULTIES: Array<Quiz["difficulty"]> = ["easy", "medium", "hard"];

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
            Icon
          </p>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {ICON_CHOICES.map((icon) => {
              const selected = quiz.icon === icon;
              return (
                <button
                  key={icon}
                  type="button"
                  onClick={() => onQuizChange({ ...quiz, icon })}
                  className={[
                    "rounded-xl border px-2 py-2 text-xl transition",
                    selected
                      ? "border-indigo-400 bg-indigo-500/20"
                      : "border-white/10 bg-slate-800/70 hover:border-white/20",
                  ].join(" ")}
                >
                  {icon}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Accent color
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {COLOR_CHOICES.map((color) => {
              const selected = quiz.accentColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onQuizChange({ ...quiz, accentColor: color })}
                  className={[
                    "h-8 w-8 rounded-full border-2 transition",
                    selected ? "border-white" : "border-transparent",
                  ].join(" ")}
                  style={{ backgroundColor: color }}
                />
              );
            })}
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
