interface AggregatesErrorStateProps {
  error: string;
}

export default function AggregatesErrorState({ error }: AggregatesErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-red-400 space-y-2">
      <h3 className="font-semibold text-lg">Error loading data</h3>
      <p className="text-sm text-red-300/80">{error}</p>
    </div>
  );
}
