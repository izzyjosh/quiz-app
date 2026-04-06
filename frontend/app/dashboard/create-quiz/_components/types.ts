export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  timeLimit: number;
  difficulty: "easy" | "medium" | "hard";
  category?: string;
};

export type Quiz = {
  title: string;
  description: string;
  themeKey: string;
  icon: string;
  accentColor: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  questions: Question[];
  scheduleType: "immediate" | "scheduled";
};
