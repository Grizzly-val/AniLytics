"use client";

import { useState, useEffect, useRef } from "react";
import { SeasonalSubjectItem } from "@/lib/subjects";

interface SubjectRailProps {
  subjects: SeasonalSubjectItem[];
  activeSubjectId: string;
  onSelectSubject: (id: string) => void;
}

export function SubjectRail({
  subjects,
  activeSubjectId,
  onSelectSubject,
}: SubjectRailProps) {
  const [isAwake, setIsAwake] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);

  // Proximity tracking hook for mouse pointer
  useEffect(() => {
    const THRESHOLD = 210;
    let animationFrameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      if (!railRef.current) return;

      // Skip proximity calculation on small touch devices
      if (window.innerWidth < 1024) return;

      animationFrameId = requestAnimationFrame(() => {
        if (!railRef.current) return;
        const rect = railRef.current.getBoundingClientRect();
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const dist = Math.sqrt(dx * dx + dy * dy);

        const near = dist < THRESHOLD;
        if (!isFocused) {
          setIsAwake(near);
        }
      });
    };

    const handlePointerLeave = () => {
      if (!isFocused) {
        setIsAwake(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isFocused]);

  // Keep awake if keyboard focus is inside the rail
  const handleFocus = () => {
    setIsFocused(true);
    setIsAwake(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (railRef.current && !railRef.current.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
      setIsAwake(false);
    }
  };

  return (
    <aside
      aria-label="Seasonal Analytics Subject Navigation"
      className="relative lg:fixed lg:left-0 lg:top-[79px] lg:bottom-0 z-30 pointer-events-none mb-6 lg:mb-0"
    >
      <div
        ref={railRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`relative flex flex-col items-start gap-1 pl-6 sm:pl-10 lg:pl-10 pr-6 w-full lg:w-max pointer-events-auto lg:top-1/2 lg:-translate-y-1/2 select-none ${
          isAwake ? "rail-awake" : ""
        }`}
      >
        {/* Thin Vertical Rail Line Accent (Desktop) */}
        <div
          aria-hidden="true"
          className={`hidden lg:block absolute left-0 top-0 bottom-0 w-[1.5px] transition-all duration-500 ${
            isAwake
              ? "bg-[linear-gradient(180deg,transparent_0%,rgba(178,133,251,0.5)_12%,rgba(178,133,251,0.5)_88%,transparent_100%)]"
              : "bg-[linear-gradient(180deg,transparent_0%,var(--line)_12%,var(--line)_88%,transparent_100%)]"
          }`}
        />

        {/* Rail Title Header & Info Toggle */}
        <div className="relative flex items-center gap-2 mb-3 lg:mb-5">
          <span
            className={`font-mono text-[9.5px] lg:text-[9.5px] tracking-[0.1em] uppercase text-[var(--text-low)] whitespace-nowrap transition-all duration-450 ease-[cubic-bezier(.65,0,.35,1)] ${
              isAwake ? "opacity-85 text-[10.5px]" : "opacity-40 text-[9.5px]"
            }`}
          >
            Easy-AniLytics
          </span>

          {/* Info Toggle Button & Tooltip Popover */}
          <div className="relative group/info">
            <button
              type="button"
              onClick={() => setIsInfoOpen((prev) => !prev)}
              onMouseEnter={() => setIsInfoOpen(true)}
              onMouseLeave={() => setIsInfoOpen(false)}
              aria-label="About Easy-AniLytics subjects"
              aria-expanded={isInfoOpen}
              className="w-[14px] h-[14px] rounded-full border border-[var(--line)] flex items-center justify-center font-mono text-[9px] text-[var(--text-low)] cursor-help transition-all duration-250 hover:border-[var(--purple-400)] hover:text-[var(--purple-300)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--purple-400)]"
            >
              ?
            </button>

            {/* Info Popover */}
            <div
              role="tooltip"
              className={`absolute left-0 lg:left-[calc(100%+14px)] top-[calc(100%+8px)] lg:top-1/2 lg:-translate-y-1/2 w-[240px] bg-[linear-gradient(160deg,var(--panel-2),var(--panel))] border border-[var(--line)] rounded-xl p-3.5 sm:p-4 text-[12.5px] leading-[1.55] text-[var(--text-mid)] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] z-40 transition-all duration-280 ease-[cubic-bezier(.65,0,.35,1)] ${
                isInfoOpen
                  ? "opacity-100 translate-x-0 lg:translate-x-0 pointer-events-auto"
                  : "opacity-0 -translate-x-2 lg:-translate-x-2 pointer-events-none"
              }`}
            >
              Explore real-time anime analytics from AniList, filterable by genre or media format.
            </div>
          </div>
        </div>

        {/* Rail Subject Items List */}
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-1.5 w-full overflow-x-auto lg:overflow-visible py-1">
          {subjects.map((sub) => {
            const isActive = sub.id === activeSubjectId;

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubject(sub.id)}
                aria-current={isActive ? "page" : undefined}
                className={`group/item flex items-center gap-2.25 py-1.5 pr-2.5 whitespace-nowrap cursor-pointer transition-all duration-400 ease-[cubic-bezier(.65,0,.35,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--purple-400)] rounded-sm ${
                  isAwake
                    ? isActive
                      ? "opacity-100"
                      : "opacity-68 hover:opacity-100"
                    : isActive
                      ? "opacity-60 hover:opacity-100"
                      : "opacity-28 hover:opacity-100"
                }`}
              >
                {/* Item Dot */}
                <span
                  className={`w-[5px] h-[5px] rounded-full shrink-0 transition-all duration-250 ${
                    isActive
                      ? "bg-[var(--purple-400)] shadow-[0_0_8px_rgba(178,133,251,0.7)]"
                      : "bg-[var(--line)] group-hover/item:bg-[var(--purple-400)]"
                  }`}
                />

                {/* Item Label */}
                <span
                  className={`font-display transition-all duration-400 ease-[cubic-bezier(.65,0,.35,1)] ${
                    isAwake
                      ? "text-[15px] group-hover/item:text-[16px]"
                      : "text-[11px] group-hover/item:text-[16px]"
                  } ${
                    isActive
                      ? "text-[var(--text-hi)] font-medium"
                      : "text-[var(--text-mid)] group-hover/item:text-[var(--purple-300)]"
                  }`}
                >
                  {sub.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
