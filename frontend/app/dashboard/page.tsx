"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardWelcomePanel from "./_components/DashboardWelcomePanel";

export default function DashboardPage() {
  return (
    <>
      <ProtectedRoute>
        <header>
          <DashboardHeader />
        </header>
        <main className="mx-auto w-full max-w-[1240px] px-3 py-6 sm:px-6 lg:px-8">
          <DashboardWelcomePanel />
        </main>
      </ProtectedRoute>
    </>
  );
}
