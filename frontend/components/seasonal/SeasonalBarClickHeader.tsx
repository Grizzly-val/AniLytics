import Link from "next/link";
import { Season } from "@/lib/types";

interface SeasonalBarClickHeaderProps {
  activeItemName: string;
  activeSeason: Season | null;
  activeYear: number | null;
  activeFilter?: string | null;
}

export function SeasonalBarClickHeader({
  activeItemName,
  activeSeason,
  activeYear,
  activeFilter,
}: SeasonalBarClickHeaderProps) {
  return (
    <div className="space-y-4">
      <Link
        href="/easy-anilytics/filter-by"
        className="inline-flex items-center gap-2 text-xs font-mono text-[var(--purple-300)] hover:text-white transition-colors"
        id="back-to-filter-by-link"
      >
        &larr; Back to Filter by Dashboards
      </Link>

      <div className="flex items-baseline gap-3.5 flex-wrap">
        <h1 className="font-display font-normal text-[clamp(30px,4vw,40px)] tracking-[-0.02em] bg-gradient-to-b from-white via-white to-[var(--purple-300)] bg-clip-text text-transparent">
          {activeItemName || "Seasonal Analytics"}
        </h1>
        {activeSeason && activeYear && (
          <>
            <div className="w-[1px] h-3.5 bg-[var(--line-soft)] self-center" />
            <span className="font-mono text-[11.5px] tracking-[0.06em] uppercase text-[var(--text-low)]">
              {activeSeason} {activeYear} {activeFilter ? `· ${activeFilter}` : ""}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
