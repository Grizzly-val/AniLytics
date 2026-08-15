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
        <span className="text-indigo-400 font-semibold">Aggregates</span>
      </nav>

      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Genre Aggregates
            </span>
          </h1>
          <p className="text-neutral-400 mt-1.5 text-sm max-w-3xl">
            Filter and analyze anime counts, average scores, popularity, and trending metrics across anime genres by season and format.
          </p>
        </div>

        <Link
          href="/seasonal/genres/genre-animes"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-600 transition shrink-0"
        >
          <span>Switch to Genre Animes &rarr;</span>
        </Link>
      </div>
    </>
  );
}
