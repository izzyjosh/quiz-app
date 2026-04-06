export type QuizTheme = {
  key: string;
  label: string;
  icon: string;
  accentClass: string;
  accentColor: string;
};

export const QUIZ_THEME_OPTIONS = [
  {
    key: "frontend",
    label: "Aurora",
    icon: "🏗️",
    accentClass: "border-t-indigo-400",
    accentColor: "#6366f1",
  },
  {
    key: "backend",
    label: "Pulse",
    icon: "⚙️",
    accentClass: "border-t-cyan-400",
    accentColor: "#06b6d4",
  },
  {
    key: "databases",
    label: "Orbit",
    icon: "🗄️",
    accentClass: "border-t-emerald-400",
    accentColor: "#10b981",
  },
  {
    key: "javascript",
    label: "Solar",
    icon: "⚡",
    accentClass: "border-t-amber-400",
    accentColor: "#f59e0b",
  },
  {
    key: "typescript",
    label: "Glacier",
    icon: "🧠",
    accentClass: "border-t-sky-400",
    accentColor: "#38bdf8",
  },
  {
    key: "devops",
    label: "Forge",
    icon: "🚀",
    accentClass: "border-t-violet-400",
    accentColor: "#8b5cf6",
  },
  {
    key: "security",
    label: "Shield",
    icon: "🔒",
    accentClass: "border-t-rose-400",
    accentColor: "#f43f5e",
  },
  {
    key: "fundamentals",
    label: "Nova",
    icon: "💡",
    accentClass: "border-t-lime-400",
    accentColor: "#84cc16",
  },
] as const satisfies readonly QuizTheme[];

export type QuizThemeKey = (typeof QUIZ_THEME_OPTIONS)[number]["key"];

const QUIZ_THEME_MAP: Record<string, QuizTheme> = {
  frontend: {
    key: "frontend",
    label: "Aurora",
    icon: "🏗️",
    accentClass: "border-t-indigo-400",
    accentColor: "#6366f1",
  },
  backend: {
    key: "backend",
    label: "Pulse",
    icon: "⚙️",
    accentClass: "border-t-cyan-400",
    accentColor: "#06b6d4",
  },
  databases: {
    key: "databases",
    label: "Orbit",
    icon: "🗄️",
    accentClass: "border-t-emerald-400",
    accentColor: "#10b981",
  },
  javascript: {
    key: "javascript",
    label: "Solar",
    icon: "⚡",
    accentClass: "border-t-amber-400",
    accentColor: "#f59e0b",
  },
  typescript: {
    key: "typescript",
    label: "Glacier",
    icon: "🧠",
    accentClass: "border-t-sky-400",
    accentColor: "#38bdf8",
  },
  devops: {
    key: "devops",
    label: "Forge",
    icon: "🚀",
    accentClass: "border-t-violet-400",
    accentColor: "#8b5cf6",
  },
  security: {
    key: "security",
    label: "Shield",
    icon: "🔒",
    accentClass: "border-t-rose-400",
    accentColor: "#f43f5e",
  },
  fundamentals: {
    key: "fundamentals",
    label: "Nova",
    icon: "💡",
    accentClass: "border-t-lime-400",
    accentColor: "#84cc16",
  },
};

const DEFAULT_THEME: QuizTheme = {
  key: "frontend",
  label: "Core",
  icon: "🎯",
  accentClass: "border-t-indigo-400",
  accentColor: "#6366f1",
};

const normalizeThemeKey = (value?: string): string =>
  value?.trim().toLowerCase().replace(/\s+/g, "-") ?? "";

export const getQuizTheme = (category?: string): QuizTheme => {
  const themeKey = normalizeThemeKey(category);
  return QUIZ_THEME_MAP[themeKey] ?? DEFAULT_THEME;
};

export const getQuizThemeOptions = () => QUIZ_THEME_OPTIONS;
