"use client";

import { useState } from "react";

export type ScheduleSessionModalProps = {
  isOpen: boolean;
  quizTitle: string;
  quizId: string;
  questionCount: number;
  difficulty: string;
  onClose: () => void;
  onLaunch: (sessionData: {
    quizId: string;
    sessionName: string;
    startImmediately: boolean;
    maxPlayers: number;
  }) => Promise<void>;
};

export default function ScheduleSessionModal({
  isOpen,
  quizTitle,
  quizId,
  questionCount,
  difficulty,
  onClose,
  onLaunch,
}: ScheduleSessionModalProps) {
  const [sessionName, setSessionName] = useState("");
  const [startImmediately, setStartImmediately] = useState(true);
  const [maxPlayers, setMaxPlayers] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLaunch = async () => {
    if (!sessionName.trim() && !startImmediately) {
      setError("Session name is required when scheduling for a specific time");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onLaunch({
        quizId,
        sessionName: sessionName || `${quizTitle} Session`,
        startImmediately,
        maxPlayers,
      });
      // Reset form
      setSessionName("");
      setStartImmediately(true);
      setMaxPlayers(100);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to launch session");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-indigo-400/30 bg-slate-900/95 p-8 shadow-2xl shadow-black/50">
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-white">
            Schedule a session
          </h2>
          <p className="mt-1 text-slate-400">
            Create a live session from this quiz blueprint
          </p>
        </div>

        {/* Quiz Info Card */}
        <div className="mb-6 rounded-2xl border border-indigo-500/20 bg-slate-800/50 p-4">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-xl">
              🏗️
            </div>
            <div>
              <h3 className="font-bold text-white">{quizTitle}</h3>
              <p className="text-sm text-slate-400">
                {questionCount} questions · {difficulty}
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Session Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400">
              Session name (optional)
            </label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g. Monday Night Challenge"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-slate-100 placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          {/* When to Start */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400">
              When to start
            </label>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setStartImmediately(true)}
                className={`flex-1 rounded-lg border-2 px-4 py-3 font-bold transition ${
                  startImmediately
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-400"
                    : "border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600"
                }`}
              >
                Start immediately
              </button>
              <button
                type="button"
                onClick={() => setStartImmediately(false)}
                className={`flex-1 rounded-lg border-2 px-4 py-3 font-bold transition ${
                  !startImmediately
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-400"
                    : "border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600"
                }`}
              >
                Schedule
              </button>
            </div>
          </div>

          {/* Max Players */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400">
              Max players
            </label>
            <select
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-slate-100 transition focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value={25}>Up to 25</option>
              <option value={50}>Up to 50</option>
              <option value={100}>Up to 100</option>
              <option value={500}>Up to 500</option>
              <option value={1000}>Up to 1000</option>
            </select>
          </div>

          {/* Error Message */}
          {error ? (
            <p className="rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              {error}
            </p>
          ) : null}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleLaunch}
              disabled={isSubmitting}
              className="flex-1 rounded-2xl border border-indigo-500 bg-indigo-500/20 px-6 py-3 font-bold text-indigo-300 transition hover:bg-indigo-500/30 disabled:opacity-50"
            >
              {isSubmitting ? "Launching..." : "Launch session →"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl border border-slate-600 px-6 py-3 font-bold text-slate-100 transition hover:border-slate-400 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
