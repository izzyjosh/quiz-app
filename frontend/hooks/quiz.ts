import { useEffect, useState } from "react";
import { getQuizzes, getSessionStats, type QuizRecord } from "@/lib/quiz";

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<QuizRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        setError("Could not load quizzes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return { quizzes, isLoading, error };
};
