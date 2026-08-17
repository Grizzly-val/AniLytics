export default function AggregatesEmptyState() {
  return (
    <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-12 text-center space-y-3">
      <div className="text-4xl">📊</div>
      <h3 className="text-lg font-bold text-white">
        Select Filters & Submit
      </h3>
      <p className="text-neutral-400 text-xs sm:text-sm max-w-md mx-auto font-normal">
        Please select a Season, Season Year, and Format above, then click &quot;Submit Filters&quot; to fetch and display genre analytics.
      </p>
    </div>
  );
}
