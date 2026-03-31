import { useEffect, useState } from "react";
import {
  ActiveAndUpcomingSessionsResponse,
  getActiveAndUpcomingSessions,
} from "@/lib/quiz";

export const useSessions = () => {
  const [sessions, setSessions] = useState<ActiveAndUpcomingSessionsResponse>({
    activeSessions: [],
    upcomingSessions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getActiveAndUpcomingSessions();
        setSessions(res);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        setError("Could not load sessions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return { sessions, isLoading, error };
};
