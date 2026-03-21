"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* 404 Icon/Text */}
        <div className="mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-none mb-4">
            404
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg mx-auto">
          Looks like you've wandered into an unscheduled quiz session. The page
          you're looking for doesn't exist in our leaderboard.
        </p>

        {/* Action Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 group"
        >
          <span>Back to Dashboard</span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>

        {/* Fun secondary link */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-500 mb-4">
            Want to explore other quizzes instead?
          </p>
          <Link
            href="/quizzes"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline underline-offset-2"
          >
            Browse all quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}
