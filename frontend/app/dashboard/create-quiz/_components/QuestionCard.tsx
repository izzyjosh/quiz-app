import type { Question } from "./types";

type QuestionCardProps = {
  question: Question;
  index: number;
  isSelected: boolean;
  accentColor: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Question>) => void;
};

const TIME_OPTIONS = [10, 15, 20, 30, 45, 60];
const LEVELS: Array<Question["difficulty"]> = ["easy", "medium", "hard"];
const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  index,
  isSelected,
  accentColor,
  onSelect,
  onDelete,
  onUpdate,
}: QuestionCardProps) {
  return (
    <article
      className={[
        "rounded-2xl border bg-slate-900/70 transition",
        isSelected
          ? "border-indigo-400/70"
          : "border-white/10 hover:border-white/20",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => onSelect(question.id)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: isSelected ? accentColor : "#334155" }}
          >
            {index + 1}
          </span>
          <input
            value={question.text}
            onChange={(event) =>
              onUpdate(question.id, { text: event.target.value })
            }
            onClick={(event) => event.stopPropagation()}
            placeholder="Click to edit question..."
            className="w-full border-0 bg-transparent text-slate-200 outline-none placeholder:text-slate-500"
          />
        </button>

        <span className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-2 py-1 text-xs font-semibold text-cyan-300">
          {question.timeLimit}s
        </span>

        <button
          type="button"
          onClick={() => onDelete(question.id)}
          className="rounded-lg border border-white/15 px-2.5 py-1.5 text-lg leading-none text-slate-200 transition hover:border-rose-400/70 hover:text-rose-300"
        >
          ×
        </button>
      </div>

      {isSelected ? (
        <div className="border-t border-white/10 px-4 pb-4 pt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Question text
          </label>
          <textarea
            value={question.text}
            onChange={(event) =>
              onUpdate(question.id, { text: event.target.value })
            }
            rows={3}
            placeholder="Type your question here..."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
          />

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Answer options (tick correct)
            </p>

            <div className="mt-2 space-y-2">
              {question.options.map((option, optionIndex) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/60 px-3 py-2"
                >
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={question.correctOptionId === option.id}
                    onChange={() =>
                      onUpdate(question.id, { correctOptionId: option.id })
                    }
                    className="h-4 w-4 accent-emerald-400"
                  />
                  <span className="w-5 rounded bg-slate-700 px-1 text-center text-xs font-bold text-slate-300">
                    {OPTION_LABELS[optionIndex]}
                  </span>
                  <input
                    value={option.text}
                    onChange={(event) => {
                      const nextOptions = question.options.map((candidate) =>
                        candidate.id === option.id
                          ? { ...candidate, text: event.target.value }
                          : candidate,
                      );
                      onUpdate(question.id, { options: nextOptions });
                    }}
                    placeholder={`Option ${OPTION_LABELS[optionIndex]}`}
                    className="w-full border-0 bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Time limit
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {TIME_OPTIONS.map((seconds) => (
                <button
                  key={seconds}
                  type="button"
                  onClick={() => onUpdate(question.id, { timeLimit: seconds })}
                  className={[
                    "rounded-xl border px-2 py-2 text-sm font-semibold transition",
                    question.timeLimit === seconds
                      ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                      : "border-white/10 bg-slate-800/70 text-slate-200 hover:border-white/20",
                  ].join(" ")}
                >
                  {seconds}s
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Difficulty
              </label>
              <select
                value={question.difficulty}
                onChange={(event) =>
                  onUpdate(question.id, {
                    difficulty: event.target.value as Question["difficulty"],
                  })
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 capitalize text-slate-100 outline-none transition focus:border-indigo-400"
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Category tag
              </label>
              <input
                value={question.category || ""}
                onChange={(event) =>
                  onUpdate(question.id, { category: event.target.value })
                }
                placeholder="e.g. Arrays"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 text-slate-100 outline-none transition focus:border-indigo-400"
              />
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
