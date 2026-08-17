export function GenreAnimesLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-8 space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-400 border-t-transparent" />
      <p className="text-neutral-400 text-sm animate-pulse">
        Fetching available genres...
      </p>
    </div>
  );
}
