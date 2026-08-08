import Link from "next/link";
import { dashboards } from "@/lib/dashboards";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-400">
          <span>✨ Anime Analytics Hub</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AniLytics
          </span>
        </h1>
        <p className="text-lg text-neutral-400 leading-relaxed">
          Explore seasonal anime statistics, genre rankings, and popularity metrics powered by real-time data analysis. Select a dashboard from the navigation above to get started.
        </p>

        <div className="pt-6 flex justify-center gap-4">
          {dashboards.map((dash) => (
            <Link
              key={dash.slug}
              href={`/${dash.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition-all duration-200"
            >
              Explore {dash.label} &rarr;
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
