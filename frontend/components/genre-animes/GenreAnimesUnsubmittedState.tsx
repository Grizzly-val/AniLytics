export function GenreAnimesUnsubmittedState() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-12 text-center space-y-3">
      <div className="text-4xl">📊</div>
      <h3 className="text-lg font-semibold text-white">
        Load Genres to View Analytics
      </h3>
      <p className="text-neutral-400 text-sm max-w-md mx-auto">
        Please configure Season, Year, and Format above, then click &quot;Load Genres&quot; to fetch available genres and view detailed analytics.
      </p>
    </div>
  );
}
