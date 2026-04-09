"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from "@/app/dashboard/_components/DashboardHeader";
import { useSocket } from "@/hooks/socket";

type SessionWaitingPageProps = {
  params: {
    sessionId: string;
  };
};

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

export default function SessionWaitingPage({
  params,
}: SessionWaitingPageProps) {
  const router = useRouter();
  const { socketService } = useSocket();
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    const sessionId = params.sessionId;

    socketService.joinSession(sessionId);

    const unsubscribeStartingSoon = socketService.onSessionStartingSoon(
      (payload) => {
        if (payload.status !== "starting") {
          return;
        }

        const rawValue = Number(payload.remainingTime);
        if (!Number.isFinite(rawValue)) {
          return;
        }

        // Accept backend values in seconds or milliseconds.
        const normalizedSeconds =
          rawValue > 1000 ? Math.ceil(rawValue / 1000) : Math.ceil(rawValue);

        setRemainingSeconds(Math.max(0, normalizedSeconds));
      },
    );

    const unsubscribeNewQuestion = socketService.onNewQuestion(() => {
      router.replace(`/dashboard/session/${sessionId}/question`);
    });

    return () => {
      unsubscribeStartingSoon();
      unsubscribeNewQuestion();
    };
  }, [params.sessionId, router, socketService]);

  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 0) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [remainingSeconds]);

  const timerLabel = useMemo(() => {
    if (remainingSeconds === null) {
      return "--:--";
    }
    return formatTime(remainingSeconds);
  }, [remainingSeconds]);

  return (
    <ProtectedRoute>
      <header className="relative z-50">
        <DashboardHeader />
      </header>

      <main className="relative z-10 mx-auto w-full max-w-[1280px] px-3 pb-8 pt-6 sm:px-5 lg:px-8">
        <section className="relative overflow-hidden rounded-[30px] border border-cyan-400/15 bg-[#030b21] shadow-[0_30px_90px_-40px_rgba(7,57,169,0.95)] p-6 sm:p-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -right-20 top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>

          <div className="relative grid min-h-[70vh] place-items-center">
            <article className="w-full max-w-xl rounded-3xl border border-cyan-300/15 bg-slate-950/55 p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-300/85">
                Session #{params.sessionId.slice(0, 8)}
              </p>

              <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                Waiting For Quiz To Start
              </h1>

              <p className="mt-2 text-slate-400">
                Stay on this page. You will be moved to the question screen as
                soon as the session starts.
              </p>

              <div className="mt-6 rounded-2xl border border-amber-400/35 bg-amber-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.11em] text-amber-200/90">
                  Remaining Time
                </p>
                <p className="mt-1 text-5xl font-black text-amber-300">
                  {timerLabel}
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
