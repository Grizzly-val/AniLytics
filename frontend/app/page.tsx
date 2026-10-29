import { RotatingEyebrow } from "@/components/home/RotatingEyebrow";
import { RotatingMetaText } from "@/components/home/RotatingMetaText";
import { DashboardCardDeck } from "@/components/home/DashboardCardDeck";
import { getFeaturedDashboards } from "@/lib/dashboards";

export default function HomePage() {
  const dashboards = getFeaturedDashboards();

  return (
    <div className="flex-1 flex flex-col justify-center max-w-350 mx-auto w-full px-6 lg:px-12 py-10 lg:py-0">
      <main className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-10 min-h-hero-screen">
        {/* Left Panel */}
        <div className="relative z-10 flex flex-col items-start max-w-130 pl-4 sm:pl-6.5">
          {/* Subtle Breathing Grid Patch */}
          <div
            aria-hidden="true"
            className="absolute w-90 h-90 sm:w-155 sm:h-155 -left-12 -top-40 pointer-events-none -z-10 animate-grid-breathe origin-center"
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
            className="absolute left-0 top-1 w-0.375 h-46.5 bg-gradient-accent-line -z-10"
          />

          {/* Rotating Eyebrow */}
          <RotatingEyebrow />

          {/* Main Gradient Headline */}
          <h1 className="font-display font-light text-display-sm sm:text-hero-display leading-hero tracking-tightest bg-gradient-hero-text bg-clip-text text-transparent mb-5.5 select-none">
            Ani<strong className="font-medium text-transparent">Lytics</strong>
          </h1>

          {/* Subtext */}
          <p className="font-body font-normal text-body-xl sm:text-title-xs leading-loose-sm text-anilytics-text-mid max-w-100 mb-9">
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
