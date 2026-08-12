import Link from "next/link";
import { SUBJECTS } from "@/lib/subjects";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Real-Time Anime Analytics Hub</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AniLytics
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          Explore seasonal anime statistics, genre rankings, and popularity metrics powered by real-time data analysis. Select a subject from the navigation above to get started.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              href={subject.path}
              className="inline-flex items-center gap-2.5 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition-all duration-200"
            >
              <span>Explore {subject.title} Hub</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
