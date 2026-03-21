import { useMemo } from "react";

interface InitialBadgeProps {
  label: string;
}

export default function InitialBadge({ label }: InitialBadgeProps) {
  const initials = useMemo(() => {
    const parts = label.split(" ").filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [label]);

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-sm font-bold text-slate-200">
      {initials}
    </span>
  );
}
