import { RotatingEyebrow } from "@/components/home/RotatingEyebrow";
import { RotatingMetaText } from "@/components/home/RotatingMetaText";
import { DashboardCardDeck } from "@/components/home/DashboardCardDeck";
import { getFeaturedDashboards } from "@/lib/dashboards";

export default function HomePage() {
  const dashboards = getFeaturedDashboards();

  return (
    <div className="flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-10 lg:py-0">
      <main className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-10 min-h-[calc(100vh-79px)]">
        {/* Left Panel */}
        <div className="relative z-10 flex flex-col items-start max-w-[520px] pl-4 sm:pl-[26px]">
          {/* Subtle Breathing Grid Patch */}
          <div
            aria-hidden="true"
            className="absolute w-[360px] h-[360px] sm:w-[620px] sm:h-[620px] -left-12 -top-40 pointer-events-none -z-10 animate-grid-breathe origin-center"
            style={{
              backgroundImage: `
                linear-gradient(rgba(178,133,251,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(178,133,251,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "64px 64px",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 50%, black 0%, black 28%, rgba(0,0,0,0.5) 46%, transparent 68%)",
              maskImage:
                "radial-gradient(circle at 50% 50%, black 0%, black 28%, rgba(0,0,0,0.5) 46%, transparent 68%)",
            }}
          />

          {/* Thin Vertical Editorial Accent Line */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-[4px] w-[1.5px] h-[186px] bg-[linear-gradient(180deg,var(--purple-400)_0%,rgba(124,58,237,0.25)_55%,transparent_100%)] -z-10"
          />

          {/* Rotating Eyebrow */}
          <RotatingEyebrow />

          {/* Main Gradient Headline */}
          <h1 className="font-display font-light text-[48px] sm:text-[clamp(56px,7vw,92px)] leading-[0.98] tracking-[-0.03em] bg-[linear-gradient(180deg,#ffffff_0%,var(--purple-300)_120%)] bg-clip-text text-transparent mb-5.5 select-none">
            Ani<strong className="font-medium text-transparent">Lytics</strong>
          </h1>

          {/* Subtext */}
          <p className="font-body font-normal text-[15.5px] sm:text-[16.5px] leading-[1.65] text-[var(--text-mid)] max-w-[400px] mb-9">
            Anime analytics, one module at a time.
          </p>

          {/* Rotating Meta Stat Line */}
          <RotatingMetaText />
        </div>

        {/* Right Panel / Interactive Card Deck */}
        <div className="relative flex flex-col items-center justify-center">
          <DashboardCardDeck dashboards={dashboards} />
        </div>
      </main>
    </div>
  );
}
