"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { activateQuizSession, createQuizSession } from "@/lib/quiz";
import ScheduleSessionModal from "./_components/ScheduleSessionModal";
import { useQuizzes } from "@/hooks/quiz";

type TemplateCard = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  liveNow: number;
  upcoming: number;
  totalRuns: number;
  tags: string[];
};

export default function QuizTemplatesPage() {
  const router = useRouter();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isLaunchingSession, setIsLaunchingSession] = useState(false);
  const {
    quizzes,
    isLoading: quizzesLoading,
    error: quizzesError,
  } = useQuizzes();

  const templateCards = useMemo(
    () =>
      quizzes.map(
        (quiz): TemplateCard => ({
          id: String(quiz.id),
          title: quiz.title || "Untitled Quiz",
          description: quiz.description || "No description yet",
          questionCount: Number(quiz.questionCount || 0),
          liveNow: Number(quiz.liveNow || 0),
          upcoming: Number(quiz.upcoming || 0),
          totalRuns: Number(quiz.totalRuns || 0),
          tags: [quiz.category || "QUIZ TEMPLATE", quiz.difficulty || "MEDIUM"],
        }),
      ),
    [quizzes],
  );

  const selectedCard = templateCards.find((c) => c.id === selectedCardId);

  const handleLaunchSession = async (sessionData: {
    quizId: string;
    startImmediately: boolean;
    scheduledStartTime?: string;
  }) => {
    try {
      setIsLaunchingSession(true);

      const createdSession = await createQuizSession({
        quizId: sessionData.quizId,
        scheduledStartTime: sessionData.startImmediately
          ? undefined
          : sessionData.scheduledStartTime,
      });

      if (sessionData.startImmediately) {
        await activateQuizSession(createdSession.id);
      }

      toast.success(
        sessionData.startImmediately
          ? "Session started successfully"
          : "Session scheduled successfully",
      );
      setSelectedCardId(null);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to launch session";
      toast.error(message);
      throw err;
    } finally {
      setIsLaunchingSession(false);
    }
  };

  return (
    <section className="rounded-3xl border border-indigo-500/20 bg-slate-950/80 p-6 shadow-2xl shadow-black/30">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-400 sm:text-4xl">
            Quiz Library
          </h1>
          <p className="mt-1 text-sm text-slate-400 sm:text-base">
            Quiz blueprints and reusable content behind every session.
          </p>
          {quizzesError ? (
            <p className="mt-2 text-sm text-rose-400">{quizzesError}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-600 px-5 py-2.5 text-lg font-bold text-slate-100 transition hover:border-slate-400"
          >
            &larr; Lobby
          </Link>
        </div>
      </div>

      {quizzesLoading ? (
        <TemplateGridSkeleton />
      ) : templateCards.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
          <p className="text-lg font-semibold text-slate-200">No quiz found.</p>
          <p className="mt-1 text-sm text-slate-400">
            Create your first quiz template to start scheduling sessions.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {templateCards.map((card) => (
            <article
              key={card.id}
              className="rounded-3xl border border-indigo-400/20 bg-slate-900/70 p-5"
            >
              <h2 className="text-2xl font-extrabold text-white">
                {card.title}
              </h2>
              <p className="mt-1 text-slate-400">{card.description}</p>

              <div className="mt-4 grid grid-cols-4 gap-2 border-y border-slate-800 py-3 text-center">
                <div>
                  <p className="text-3xl font-bold text-indigo-400">
                    {card.questionCount}
                  </p>
                  <p className="text-xs tracking-wide text-slate-500">
                    QUESTIONS
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-400">
                    {card.liveNow}
                  </p>
                  <p className="text-xs tracking-wide text-slate-500">
                    LIVE NOW
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400">
                    {card.upcoming}
                  </p>
                  <p className="text-xs tracking-wide text-slate-500">
                    UPCOMING
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-300">
                    {card.totalRuns}
                  </p>
                  <p className="text-xs tracking-wide text-slate-500">
                    TOTAL RUNS
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={`${card.id}-${tag}`}
                    className="rounded-xl bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCardId(card.id)}
                className="mt-4 block w-full rounded-2xl border border-slate-600 px-4 py-2.5 font-bold text-slate-100 transition hover:border-indigo-400 hover:bg-indigo-500/10"
              >
                + Schedule a session
              </button>
            </article>
          ))}
        </div>
      )}

      {selectedCard && (
        <ScheduleSessionModal
          isOpen={Boolean(selectedCardId)}
          quizTitle={selectedCard.title}
          quizId={selectedCard.id}
          questionCount={selectedCard.questionCount}
          difficulty={
            selectedCard.tags[selectedCard.tags.length - 1] || "MEDIUM"
          }
          isSubmitting={isLaunchingSession}
          onClose={() => setSelectedCardId(null)}
          onLaunch={handleLaunchSession}
        />
      )}
    </section>
  );
}

function TemplateGridSkeleton() {
  return (
    <div
      className="grid gap-4 md:grid-cols-2"
      aria-label="Loading quiz templates"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <article
          key={`skeleton-${index}`}
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
  );
}
