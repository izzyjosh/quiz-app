export type QuizTheme = {
  key: string;
  label: string;
  icon: string;
  accentClass: string;
  accentColor: string;
};

export const QUIZ_THEME_OPTIONS = [
  {
    key: "aurora",
    label: "Aurora",
    icon: "🏗️",
    accentClass: "border-t-indigo-400",
    accentColor: "#6366f1",
  },
  {
    key: "pulse",
    label: "Pulse",
    icon: "⚙️",
    accentClass: "border-t-cyan-400",
    accentColor: "#06b6d4",
  },
  {
    key: "orbit",
    label: "Orbit",
    icon: "🗄️",
    accentClass: "border-t-emerald-400",
    accentColor: "#10b981",
  },
  {
    key: "solar",
    label: "Solar",
    icon: "⚡",
    accentClass: "border-t-amber-400",
    accentColor: "#f59e0b",
  },
  {
    key: "glacier",
    label: "Glacier",
    icon: "🧠",
    accentClass: "border-t-sky-400",
    accentColor: "#38bdf8",
  },
  {
    key: "forge",
    label: "Forge",
    icon: "🚀",
    accentClass: "border-t-violet-400",
    accentColor: "#8b5cf6",
  },
  {
    key: "shield",
    label: "Shield",
    icon: "🔒",
    accentClass: "border-t-rose-400",
    accentColor: "#f43f5e",
  },
  {
    key: "nova",
    label: "Nova",
    icon: "💡",
    accentClass: "border-t-lime-400",
    accentColor: "#84cc16",
  },
] as const satisfies readonly QuizTheme[];

export type QuizThemeKey = (typeof QUIZ_THEME_OPTIONS)[number]["key"];

const QUIZ_THEME_MAP: Record<string, QuizTheme> = QUIZ_THEME_OPTIONS.reduce(
  (acc, theme) => {
    acc[theme.key] = theme;
    return acc;
  },
  {} as Record<string, QuizTheme>,
);

const LEGACY_THEME_KEY_ALIASES: Record<string, QuizThemeKey> = {
  frontend: "aurora",
  backend: "pulse",
  databases: "orbit",
  javascript: "solar",
  typescript: "glacier",
  devops: "forge",
  security: "shield",
  fundamentals: "nova",
};

const DEFAULT_THEME: QuizTheme = {
  key: "aurora",
  label: "Core",
  icon: "🎯",
  accentClass: "border-t-indigo-400",
  accentColor: "#6366f1",
};

const normalizeThemeKey = (value?: string): string =>
  value?.trim().toLowerCase().replace(/\s+/g, "-") ?? "";

export const getQuizTheme = (themeKeyInput?: string): QuizTheme => {
  const normalizedThemeKey = normalizeThemeKey(themeKeyInput);
  const resolvedThemeKey =
    LEGACY_THEME_KEY_ALIASES[normalizedThemeKey] ?? normalizedThemeKey;

  return QUIZ_THEME_MAP[resolvedThemeKey] ?? DEFAULT_THEME;
};

export const getQuizThemeOptions = () => QUIZ_THEME_OPTIONS;
