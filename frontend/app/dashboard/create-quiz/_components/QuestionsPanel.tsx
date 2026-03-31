import QuestionCard from "./QuestionCard";
import type { Question } from "./types";

type QuestionsPanelProps = {
  questions: Question[];
  selectedQuestionId: string;
  accentColor: string;
  onSelectQuestion: (id: string) => void;
  onDeleteQuestion: (id: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onAddQuestion: () => void;
};

export default function QuestionsPanel({
  questions,
  selectedQuestionId,
  accentColor,
  onSelectQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  onAddQuestion,
}: QuestionsPanelProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/30">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Questions</h2>
        <span className="text-sm text-slate-400">
          {questions.length} questions
        </span>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            isSelected={selectedQuestionId === question.id}
            accentColor={accentColor}
            onSelect={onSelectQuestion}
            onDelete={onDeleteQuestion}
            onUpdate={onUpdateQuestion}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddQuestion}
        className="mt-4 w-full rounded-2xl border border-white/15 px-4 py-3 text-lg font-semibold text-white transition hover:border-indigo-400 hover:bg-indigo-500/10"
      >
        + Add question
      </button>
    </section>
  );
}
