"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/components/ui/logo";
import DashboardMenuItem from "./DashboardMenuItem";
import { useAuth } from "@/context/authContext";

export default function DashboardHeader() {
  const router = useRouter();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const username = auth.user?.username || "User";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) {
        return;
      }

      if (!wrapperRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSignOut = () => {
    auth.logout();
    router.push("/login");
  };

  const navigateToPendingPage = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <header className="border-b border-indigo-500/20 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-20 w-full max-w-[1240px] items-center justify-between gap-2 px-2.5 sm:min-h-24 sm:gap-4 sm:px-6 lg:px-8">
        <Logo
          size="sm"
          href="/dashboard"
          showGlow={false}
          className="text-xl sm:text-4xl"
        />

        <div className="relative" ref={wrapperRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex w-[11rem] max-w-[56vw] items-center gap-2 rounded-2xl border border-indigo-400/20 bg-slate-900/80 px-2 py-2 text-left shadow-lg shadow-black/30 transition hover:border-indigo-300/40 sm:w-auto sm:min-w-64 sm:max-w-none sm:gap-3 sm:px-3 sm:py-2.5"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-indigo-300/25 bg-indigo-500/10 sm:h-10 sm:w-10">
              <img
                src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(username)}`}
                alt="User avatar"
                className="h-full w-full object-cover"
              />
            </span>

            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-sm font-extrabold text-slate-100 sm:text-lg">
                {username}
              </span>
              <span className="truncate text-[10px] font-semibold tracking-wide text-amber-500/90 sm:text-sm">
                BRONZE · 800 RP
              </span>
            </span>

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className={[
                "h-5 w-5 text-slate-400 transition-transform",
                menuOpen ? "rotate-180" : "",
              ].join(" ")}
            >
              <path
                d="M6.5 9.5 12 15l5.5-5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+10px)] z-20 w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-indigo-400/20 bg-slate-900/95 py-2 shadow-xl shadow-black/40 sm:w-64"
            >
              <DashboardMenuItem
                label="+ Create quiz"
                onClick={() => navigateToPendingPage("/dashboard/create-quiz")}
              />
              <DashboardMenuItem
                label="Quiz templates"
                onClick={() =>
                  navigateToPendingPage("/dashboard/quiz-templates")
                }
              />
              <DashboardMenuItem
                label="My stats"
                onClick={() => navigateToPendingPage("/dashboard/my-stats")}
                icon="bar"
              />
              <DashboardMenuItem
                label="Settings"
                onClick={() => navigateToPendingPage("/dashboard/settings")}
                icon="gear"
              />

              <div className="my-2 border-t border-slate-800" />

              <button
                type="button"
                onClick={handleSignOut}
                className="block w-full px-4 py-2 text-left text-sm font-semibold text-red-500 transition hover:bg-red-500/10 sm:px-5"
                role="menuitem"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
