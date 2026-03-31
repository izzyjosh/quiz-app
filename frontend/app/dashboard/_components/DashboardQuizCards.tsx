"use client";

import { useSessions } from "@/hooks/quizSession";
import { SessionRecord } from "@/lib/quiz";

type SessionStatus = "live" | "upcoming";

type SessionCardData = {
  id: string;
  title: string;
  topic: string;
  icon: string;
  status: SessionStatus;
  statusLabel: string;
  accentClass: string;
  tags: string[];
  capacityLabel: string;
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

const mapLiveSession = (session: SessionRecord): SessionCardData => ({
  id: session.id,
  title: `Session ${session.id.slice(0, 8)}`,
  topic: `Quiz ${session.quizId}`,
  icon: "⚡",
  status: "live",
  statusLabel: `Live · Q${session.currentQuestionIndex + 1}`,
  accentClass: "border-t-indigo-400",
  tags: ["ACTIVE", "IN PROGRESS"],
  capacityLabel: "LIVE",
  ctaLabel: "Join ->",
  progressPct: Math.min((session.currentQuestionIndex + 1) * 20, 100),
  participants: ["LIVE"],
});

const mapUpcomingSession = (session: SessionRecord): SessionCardData => ({
  id: session.id,
  title: `Session ${session.id.slice(0, 8)}`,
  topic: `Quiz ${session.quizId}`,
  icon: "🧮",
  status: "upcoming",
  statusLabel: "Upcoming",
  accentClass: "border-t-amber-500",
  tags: ["SCHEDULED", "WAITING"],
  capacityLabel: "UPCOMING",
  ctaLabel: "Reserve ->",
  timerLabel: formatCountdown(session.scheduledStartTime),
});

export default function DashboardQuizCards() {
  const { sessions, isLoading, error } = useSessions();
  const liveSessions = sessions.activeSessions.map(mapLiveSession);
  const upcomingSessions = sessions.upcomingSessions.map(mapUpcomingSession);

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
              <SessionCard key={session.id} session={session} />
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

function SessionCard({ session }: { session: SessionCardData }) {
  const isLive = session.status === "live";

  return (
    <article
      className={[
        "rounded-3xl border border-slate-800/90 bg-slate-900/70 p-5 shadow-xl shadow-black/20",
        session.accentClass,
      ].join(" ")}
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

      <p className="text-slate-400">📋 {session.topic}</p>
      <h3 className="mt-1 text-3xl font-extrabold text-white">
        {session.title}
      </h3>

      <div className="mt-3 flex flex-wrap gap-2">
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

      <div className="mt-2">
        <span className="rounded-xl bg-slate-700/60 px-3 py-1 text-xs font-bold tracking-wide text-slate-400">
          {session.capacityLabel}
        </span>
      </div>

      {isLive ? (
        <div className="mt-5 h-1 w-full rounded-full bg-slate-700/80">
          <span
            className="block h-full rounded-full bg-indigo-400"
            style={{ width: `${session.progressPct ?? 0}%` }}
          />
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3">
        {isLive ? (
          <div className="rounded-lg bg-slate-800/80 px-2.5 py-1.5 text-lg">
            {(session.participants ?? []).join(" ")}
          </div>
        ) : (
          <span className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xl font-bold text-amber-300">
            {session.timerLabel}
          </span>
        )}

        <button
          type="button"
          className="rounded-2xl border border-slate-600 px-5 py-2.5 text-2xl font-bold text-white transition hover:border-slate-400"
        >
          {session.ctaLabel}
        </button>
      </div>
    </article>
  );
}
