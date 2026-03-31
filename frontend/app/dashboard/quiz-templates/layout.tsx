"use client";

import type { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from "../_components/DashboardHeader";

type QuizTemplatesLayoutProps = {
  children: ReactNode;
};

export default function QuizTemplatesLayout({
  children,
}: QuizTemplatesLayoutProps) {
  return (
    <ProtectedRoute>
      <header>
        <DashboardHeader />
      </header>

      <main className="mx-auto w-full max-w-[1240px] px-3 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </ProtectedRoute>
  );
}
