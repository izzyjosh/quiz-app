"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PreviewCard from "./_components/PreviewCard";
import QuestionsPanel from "./_components/QuestionsPanel";
import QuizSettingsPanel from "./_components/QuizSettingsPanel";
import type { Question, Quiz } from "./_components/types";
import { createQuizWithQuestions } from "@/lib/quiz";
import { getQuizTheme } from "@/lib/quizTheme";

const createOption = (prefix: string, index: number) => ({
  id: `${prefix}-option-${index}`,
  text: "",
});

const createQuestion = (index: number): Question => {
  const id = `q-${Date.now()}-${index}`;
  return {
    id,
    text: "",
    options: [
      createOption(id, 0),
      createOption(id, 1),
      createOption(id, 2),
      createOption(id, 3),
    ],
    correctOptionId: `${id}-option-0`,
    timeLimit: 15,
    difficulty: "medium",
    category: "",
  };
};

export default function CreateQuizPage() {
  const router = useRouter();
  const initialQuestion = useMemo(() => createQuestion(1), []);

  const [quiz, setQuiz] = useState<Quiz>({
    title: "",
    description: "",
    themeKey: "frontend",
    icon: getQuizTheme("frontend").icon,
    accentColor: getQuizTheme("frontend").accentColor,
    difficulty: "easy",
    category: "",
    scheduleType: "immediate",
    questions: [initialQuestion],
  });
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    initialQuestion.id,
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const handleAddQuestion = () => {
    const nextQuestion = createQuestion(quiz.questions.length + 1);
    setQuiz((previous) => ({
      ...previous,
      questions: [...previous.questions, nextQuestion],
    }));
    setSelectedQuestionId(nextQuestion.id);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuiz((previous) => {
      const nextQuestions = previous.questions.filter(
        (q) => q.id !== questionId,
      );
      const safeQuestions =
        nextQuestions.length > 0 ? nextQuestions : [createQuestion(1)];

      if (!safeQuestions.find((q) => q.id === selectedQuestionId)) {
        setSelectedQuestionId(safeQuestions[0].id);
      }

      return {
        ...previous,
        questions: safeQuestions,
      };
    });
  };

  const handleUpdateQuestion = (
    questionId: string,
    updates: Partial<Question>,
  ) => {
    setQuiz((previous) => ({
      ...previous,
      questions: previous.questions.map((question) =>
        question.id === questionId ? { ...question, ...updates } : question,
      ),
    }));
  };

  const canPublish =
    quiz.title.trim().length > 0 &&
    quiz.category.trim().length > 0 &&
    quiz.questions.length > 0 &&
    quiz.questions.every(
      (question) =>
        question.text.trim().length > 0 &&
        question.options.every((option) => option.text.trim().length > 0),
    );

  const selectedTheme = getQuizTheme(quiz.themeKey);

  const handlePublishQuiz = async () => {
    if (!canPublish) {
      setPublishError(
        "Please complete title, category, and all question fields.",
      );
      return;
    }

    try {
      setIsPublishing(true);
      setPublishError(null);
      setPublishSuccess(null);

      await createQuizWithQuestions({
        quiz: {
          title: quiz.title.trim(),
          description: quiz.description.trim() || undefined,
          timeLimit: 10,
          category: quiz.category.trim(),
          themeKey: quiz.themeKey,
          icon: selectedTheme.icon,
          accentColor: selectedTheme.accentColor,
          difficulty: quiz.difficulty.toUpperCase() as
            | "EASY"
            | "MEDIUM"
            | "HARD",
        },
        questions: quiz.questions.map((question, index) => ({
          text: question.text.trim(),
          order: index + 1,
          timeLimit: question.timeLimit,
          options: question.options.map((option) => ({
            text: option.text.trim(),
            isCorrect: option.id === question.correctOptionId,
          })),
        })),
      });

      setPublishSuccess("Quiz published successfully.");
      setTimeout(() => {
        router.push("/dashboard/quiz-templates");
      }, 800);
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : "Failed to publish quiz.",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-5 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-[#020617] p-4 shadow-2xl shadow-black/40 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-400">
            Quiz Builder
          </h1>
          <p className="mt-1 text-lg text-slate-400">
            Design questions, set a schedule, go live
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-lg font-semibold text-slate-100 transition hover:border-white/35"
          >
            ← Back
          </Link>
          <button
            type="button"
            onClick={handlePublishQuiz}
            disabled={!canPublish || isPublishing}
            className="rounded-xl border border-indigo-400/70 bg-indigo-500/20 px-5 py-2.5 text-lg font-semibold text-indigo-100 transition hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPublishing ? "Publishing..." : "Publish Quiz →"}
          </button>
        </div>
      </div>

      {publishError ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
          {publishError}
        </p>
      ) : null}

      {publishSuccess ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          {publishSuccess}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <QuizSettingsPanel
            quiz={quiz}
            onQuizChange={(nextQuiz) => {
              const theme = getQuizTheme(nextQuiz.themeKey);
              setQuiz({
                ...nextQuiz,
                icon: theme.icon,
                accentColor: theme.accentColor,
              });
            }}
          />
          <PreviewCard quiz={quiz} />
        </div>

        <QuestionsPanel
          questions={quiz.questions}
          selectedQuestionId={selectedQuestionId}
          accentColor={selectedTheme.accentColor}
          onSelectQuestion={setSelectedQuestionId}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
          onAddQuestion={handleAddQuestion}
        />
      </div>
    </div>
  );
}
