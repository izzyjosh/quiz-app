"use client";

import type { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from "../_components/DashboardHeader";

type CreateQuizLayoutProps = {
  children: ReactNode;
};

export default function CreateQuizLayout({ children }: CreateQuizLayoutProps) {
  return (
    <ProtectedRoute>
      <header>
        <DashboardHeader />
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-3 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </ProtectedRoute>
  );
}
