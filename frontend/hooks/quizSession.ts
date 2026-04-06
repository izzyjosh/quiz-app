"use client";

import { useEffect, useState } from "react";
import {
  ActiveAndUpcomingSessionsResponse,
  getActiveAndUpcomingSessions,
} from "@/lib/quiz";
import { useSocket } from "@/hooks/socket";

export const useSessions = () => {
  const socket = useSocket();
  const [sessions, setSessions] = useState<ActiveAndUpcomingSessionsResponse>({
    activeSessions: [],
    upcomingSessions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSessions = async () => {
      try {
        const res = await getActiveAndUpcomingSessions();
        if (isMounted) {
          setSessions(res);
        }
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        if (isMounted) {
          setError("Could not load sessions");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSessions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const refetch = async () => {
      try {
        const res = await getActiveAndUpcomingSessions();
        setSessions(res);
      } catch (error) {
        console.error("Failed to refresh sessions:", error);
      }
    };

    const unsubscribe = socket.onSessionListUpdated(() => {
      void refetch();
    });

    return unsubscribe;
  }, [socket]);

  useEffect(() => {
    const unsubscribe = socket.onLiveSessionRemoved(({ sessionId }) => {
      setSessions((current) => ({
        ...current,
        activeSessions: current.activeSessions.filter(
          (session) => session.id !== sessionId,
        ),
      }));
    });

    return unsubscribe;
  }, [socket]);

  return { sessions, isLoading, error };
};
