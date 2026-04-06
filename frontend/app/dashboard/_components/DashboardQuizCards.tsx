"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSessions } from "@/hooks/quizSession";
import { SessionRecord, joinQuizSession } from "@/lib/quiz";
import { getQuizTheme } from "@/lib/quizTheme";

type SessionStatus = "live" | "upcoming";

type SessionCardData = {
  id: string;
  sessionTopic: string;
  templateName: string;
  description: string;
  category: string;
  difficulty: string;
  questionCount: number;
  icon: string;
  accentColor: string;
  status: SessionStatus;
  statusLabel: string;
  accentClass: string;
  tags: string[];
  capacityLabel?: string;
  ctaLabel: string;
  timerLabel?: string;
  progressPct?: number;
  participants?: string[];
};

const formatCountdown = (scheduledStartTime?: string | null): string => {
  if (!scheduledStartTime) {
    return "TBA";
  }

  const diffMs = new Date(scheduledStartTime).getTime() - Date.now();
  if (diffMs <= 0) {
    return "Starting";
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
};

const resolveSessionTheme = (session: SessionRecord) => {
  const fallbackTheme = getQuizTheme(session.quiz?.themeKey);

  return {
    icon: session.quiz?.icon || fallbackTheme.icon,
    accentClass: fallbackTheme.accentClass,
    accentColor: session.quiz?.accentColor || fallbackTheme.accentColor,
  };
};

const mapLiveSession = (session: SessionRecord): SessionCardData => ({
  ...resolveSessionTheme(session),
  id: session.id,
  sessionTopic: session.sessionName?.trim() || "Open Live Session",
  templateName: session.quiz?.title?.trim() || `Quiz ${session.quizId}`,
  description:
    session.quiz?.description?.trim() ||
    "No description available for this live session.",
  category: session.quiz?.category?.toUpperCase() || "GENERAL",
  difficulty: session.quiz?.difficulty?.toUpperCase() || "MEDIUM",
  questionCount:
    session.quiz?.questionCount ?? session.quiz?.questions?.length ?? 0,
  status: "live",
  statusLabel: `Q${session.currentQuestionIndex + 1}`,
  tags: ["IN PROGRESS"],
  capacityLabel: undefined,
  ctaLabel: "Join",
  progressPct: Math.min((session.currentQuestionIndex + 1) * 20, 100),
  participants: undefined,
});

const mapUpcomingSession = (session: SessionRecord): SessionCardData => ({
  ...resolveSessionTheme(session),
  id: session.id,
  sessionTopic: session.sessionName?.trim() || "Scheduled Session",
  templateName: session.quiz?.title?.trim() || `Quiz ${session.quizId}`,
  description:
    session.quiz?.description?.trim() ||
    "No description available for this scheduled session.",
  category: session.quiz?.category?.toUpperCase() || "GENERAL",
  difficulty: session.quiz?.difficulty?.toUpperCase() || "MEDIUM",
  questionCount:
    session.quiz?.questionCount ?? session.quiz?.questions?.length ?? 0,
  status: "upcoming",
  statusLabel: "Starting soon",
  tags: [],
  capacityLabel: undefined,
  ctaLabel: "Reserve spot",
  timerLabel: formatCountdown(session.scheduledStartTime),
});

export default function DashboardQuizCards() {
  const router = useRouter();
  const { sessions, isLoading, error } = useSessions();
  const [joiningSessionId, setJoiningSessionId] = useState<string | null>(null);
  const liveSessions = sessions.activeSessions.map(mapLiveSession);
  const upcomingSessions = sessions.upcomingSessions.map(mapUpcomingSession);

  const handleJoinSession = async (sessionId: string) => {
    try {
      setJoiningSessionId(sessionId);
      await joinQuizSession(sessionId);
      router.push(`/dashboard/session/${sessionId}`);
    } catch (joinError) {
      const message =
        joinError instanceof Error
          ? joinError.message
          : "Could not join session";
      toast.error(message);
    } finally {
      setJoiningSessionId(null);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-400">Loading sessions...</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-400">{error}</p>;
  }

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
          LIVE SESSIONS
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {liveSessions.length > 0 ? (
            liveSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isBusy={joiningSessionId === session.id}
                onJoin={handleJoinSession}
              />
            ))
          ) : (
            <p className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
              No active sessions right now.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
          UPCOMING SESSIONS
        </h2>

        <div className="max-w-2xl">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <p className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
              No upcoming sessions found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function SessionCard({
  session,
  onJoin,
  isBusy = false,
}: {
  session: SessionCardData;
  onJoin?: (sessionId: string) => void;
  isBusy?: boolean;
}) {
  const isLive = session.status === "live";

  return (
    <article
      className={[
        "rounded-3xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-xl shadow-black/20",
        session.accentClass,
      ].join(" ")}
      style={{ borderTopColor: session.accentColor }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl">
          {session.icon}
        </span>

        <span
          className={[
            "text-sm font-semibold",
            isLive ? "text-emerald-400" : "text-amber-400",
          ].join(" ")}
        >
          {isLive ? "● " : "● "}
          {session.statusLabel}
        </span>
      </div>

      <div className="mt-1 space-y-1.5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-cyan-300/85">
          Session Topic
        </p>
        <h3 className="text-2xl font-extrabold text-cyan-100 sm:text-3xl">
          {session.sessionTopic}
        </h3>

        <p className="pt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-indigo-300/80">
          Quiz Template
        </p>
        <p className="text-lg font-bold text-white sm:text-xl">
          {session.templateName}
        </p>
      </div>
      <p className="mt-2 text-slate-400">{session.description}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-xl bg-indigo-500/20 px-3 py-1 text-xs font-bold tracking-wide text-indigo-300">
          {session.category}
        </span>
        <span className="rounded-xl bg-slate-700/60 px-3 py-1 text-xs font-bold tracking-wide text-slate-300">
          {session.difficulty}
        </span>
        {!isLive ? (
          <span className="rounded-xl bg-slate-700/60 px-3 py-1 text-xs font-bold tracking-wide text-slate-300">
            {session.questionCount} QS
          </span>
        ) : null}
        {session.tags.map((tag, index) => {
          const isProgressTag = tag === "IN PROGRESS";
          const isPrimaryTag = index === 0;

          return (
            <span
              key={tag}
              className={[
                "rounded-xl px-3 py-1 text-xs font-bold tracking-wide",
                isProgressTag
                  ? "bg-emerald-500/15 text-emerald-400"
                  : isPrimaryTag
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-slate-700/60 text-slate-400",
              ].join(" ")}
            >
              {tag}
            </span>
          );
        })}
      </div>

      {session.capacityLabel ? (
        <div className="mt-2">
          <span className="rounded-xl bg-slate-700/60 px-3 py-1 text-xs font-bold tracking-wide text-slate-400">
            {session.capacityLabel}
          </span>
        </div>
      ) : null}

      {isLive ? (
        <div className="mt-5 h-1 w-full rounded-full bg-slate-700/80">
          <span
            className="block h-full rounded-full bg-indigo-400"
            style={{ width: `${session.progressPct ?? 0}%` }}
          />
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3">
        {!isLive ? (
          <span className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xl font-bold text-amber-300">
            {session.timerLabel}
          </span>
        ) : null}

        <button
          type="button"
          disabled={isBusy}
          onClick={isLive && onJoin ? () => onJoin(session.id) : undefined}
          className={[
            "inline-flex items-center gap-2 rounded-2xl border border-slate-600 px-4 py-2 text-base font-semibold text-white transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60",
            isLive ? "ml-auto" : "",
          ].join(" ")}
        >
          <span>{isBusy ? "Joining..." : session.ctaLabel}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
