"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/authContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[-120px] top-[-80px] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute right-[-120px] top-[40px] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative">{children}</div>
      </div>
    </AuthProvider>
  );
}
