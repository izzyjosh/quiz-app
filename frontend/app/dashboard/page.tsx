"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from "./_components/DashboardHeader";
import DashboardWelcomePanel from "./_components/DashboardWelcomePanel";
import DashboardQuizCards from "./_components/DashboardQuizCards";
import { SocketProvider } from "@/context/SocketContext";

export default function DashboardPage() {
  return (
    <>
      <ProtectedRoute>
        <header>
          <DashboardHeader />
        </header>
        <SocketProvider>
          <main className="mx-auto w-full max-w-[1240px] px-3 py-6 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <DashboardWelcomePanel />
              <DashboardQuizCards />
            </div>
          </main>
        </SocketProvider>
      </ProtectedRoute>
    </>
  );
}
