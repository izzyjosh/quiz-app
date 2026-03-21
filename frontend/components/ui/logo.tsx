import Link from "next/link";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  href?: string;
  showGlow?: boolean;
  className?: string;
}

const sizeClasses: Record<LogoSize, string> = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-5xl",
};

export default function Logo({
  size = "md",
  href = "/",
  showGlow = true,
  className = "",
}: LogoProps) {
  const content = (
    <span
      className={[
        "relative inline-flex items-center font-black tracking-tight leading-none",
        sizeClasses[size],
        className,
      ].join(" ")}
      aria-label="QuizSync"
    >
      {showGlow ? (
        <span
          className="absolute inset-0 blur-xl opacity-40 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
          aria-hidden="true"
        />
      ) : null}

      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
        QuizSync
      </span>
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-sm"
    >
      {content}
    </Link>
  );
}
