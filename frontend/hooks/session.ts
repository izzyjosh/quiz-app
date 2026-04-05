"use client";

import { useEffect, useState } from "react";

import { useSocket } from "@/hooks/socket";
import { getSessionStats, type SessionStatsResponse } from "@/lib/quiz";

const initialStats: SessionStatsResponse = {
  activeParticipants: 0,
  activeSessions: 0,
  totalQuizTemplates: 0,
};

export const useSessionStats = () => {
  const socket = useSocket();
  const [stats, setStats] = useState<SessionStatsResponse>(initialStats);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const data = await getSessionStats();
        if (isMounted) {
          setStats(data);
        }
      } catch (loadError) {
        console.error("Failed to fetch session stats:", loadError);
        if (isMounted) {
          setError("Could not load session stats");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = socket.onSessionStatsUpdated((data) => {
      setStats(data);
    });

    return unsubscribe;
  }, [socket]);

  return { stats, isLoading, error };
};
