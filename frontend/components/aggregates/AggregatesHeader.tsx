import Link from "next/link";

export default function AggregatesHeader() {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-neutral-400">
        <Link href="/" className="hover:text-neutral-200 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/seasonal" className="hover:text-neutral-200 transition">
          Seasonal Analytics
        </Link>
        <span>/</span>
        <span>Genres</span>
        <span>/</span>
        <span className="text-purple-300 font-medium">Aggregates</span>
      </nav>

      {/* Header */}
      <div className="border-b border-neutral-800/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-violet-200 bg-clip-text text-transparent">
              Genre Aggregates
            </span>
          </h1>
          <p className="text-neutral-400 mt-1.5 text-xs sm:text-sm max-w-3xl font-normal">
            Filter and analyze anime counts, average scores, popularity, and trending metrics across anime genres by season and format.
          </p>
        </div>

        <Link
          href="/seasonal/genres/genre-animes"
          className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-purple-200 transition shrink-0"
        >
          <span>Switch to Genre Animes &rarr;</span>
        </Link>
      </div>
    </>
  );
}
