import Link from "next/link";
import type { ReactNode } from "react";

import Logo from "@/components/ui/logo";

interface HeaderProps {
  rightSlot?: ReactNode;
  showBottomBorder?: boolean;
}

export default function Header({
  rightSlot,
  showBottomBorder = true,
}: HeaderProps) {
  return (
    <header
      className={[
        "sticky top-0 z-40 backdrop-blur-md bg-slate-950/70",
        showBottomBorder ? "border-b border-slate-800/80" : "",
      ].join(" ")}
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:min-h-20 sm:px-6 lg:px-8">
        <Logo size="sm" className="sm:text-4xl" />

        {rightSlot ? (
          <div className="flex items-center gap-2 sm:gap-3">{rightSlot}</div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth/sign-in"
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-400/50 hover:text-white sm:rounded-xl sm:px-4 sm:text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="hidden rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 sm:inline-flex"
            >
              Create account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
