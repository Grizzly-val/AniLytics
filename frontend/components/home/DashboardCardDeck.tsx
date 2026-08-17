"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { DeckDashboard } from "@/lib/dashboards";

interface DashboardCardDeckProps {
  dashboards: DeckDashboard[];
}

export function DashboardCardDeck({ dashboards }: DashboardCardDeckProps) {
  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  const total = dashboards.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total]
  );

  const next = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, posIndex: number) => {
    if (posIndex !== 0) return;
    if ((e.target as HTMLElement).closest("a, button")) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    setDragOffset(0);
    activeCardRef.current = e.currentTarget;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const MAX_DRAG = 160;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const rawDx = e.clientX - startXRef.current;
    const clampedDx = Math.max(-MAX_DRAG, Math.min(MAX_DRAG, rawDx));
    setDragOffset(clampedDx);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const dx = dragOffset || 0;
    setDragOffset(null);

    if (dx < -80) {
      next();
    } else if (dx > 80) {
      prev();
    }
  };

  if (!dashboards || dashboards.length === 0) {
    return null;
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[480px] sm:min-h-[560px]">
      {/* Glow background */}
      <div className="absolute w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.20)_0%,transparent_68%)] pointer-events-none z-0" />

      {/* Card stack container */}
      <div
        className="relative w-[min(400px,86vw)] h-[400px] z-[2] select-none touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {dashboards.map((dash, i) => {
          const pos = (i - current + total) % total;
          const isFront = pos === 0;

          // Compute transform styles based on stack position
          let transformStyle = "";
          let opacity = 0;
          let zIndex = 10;
          let pointerEvents: "auto" | "none" = "none";

          if (isFront) {
            zIndex = 40;
            opacity = 1;
            pointerEvents = "auto";
            if (dragOffset !== null) {
              transformStyle = `translate(${dragOffset}px, 0px) rotate(${dragOffset * 0.03}deg)`;
            } else {
              transformStyle = "translate(0px, 0px) scale(1) rotate(0deg)";
            }
          } else if (pos === 1) {
            zIndex = 30;
            opacity = 0.55;
            transformStyle = "translate(26px, 16px) scale(0.94) rotate(2.2deg)";
          } else if (pos === 2) {
            zIndex = 20;
            opacity = 0.28;
            transformStyle = "translate(48px, 30px) scale(0.88) rotate(4deg)";
          } else {
            zIndex = 10;
            opacity = 0;
            transformStyle = "translate(66px, 42px) scale(0.83) rotate(5.6deg)";
          }

          return (
            <div
              key={dash.id}
              onPointerDown={(e) => handlePointerDown(e, pos)}
              className={`absolute inset-0 bg-[linear-gradient(160deg,var(--panel-2),var(--panel))] border border-[var(--line)] rounded-[22px] p-7 sm:p-8 flex flex-col shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ${
                isFront ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{
                transform: transformStyle,
                opacity,
                zIndex,
                pointerEvents,
                transition:
                  dragOffset !== null && isFront
                    ? "none"
                    : "transform 0.55s cubic-bezier(.19,1,.22,1), opacity 0.5s ease",
              }}
            >
              {/* Card top */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-[44px] h-[44px] rounded-[12px] bg-[rgba(155,92,246,0.12)] border border-[var(--line)] flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-[20px] h-[20px] stroke-[var(--purple-300)]"
                  >
                    {dash.iconType === "chart-bar" ? (
                      <>
                        <path d="M3 3v18h18" />
                        <path d="M18 17V9" />
                        <path d="M13 17V5" />
                        <path d="M8 17v-3" />
                      </>
                    ) : (
                      <>
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </>
                    )}
                  </svg>
                </div>
                <span className="no-bubble-label">{dash.badge}</span>
              </div>

              {/* Card title & description */}
              <div className="font-display font-medium text-[22px] tracking-[-0.01em] text-[var(--text-hi)] mb-2.5">
                {dash.title}
              </div>
              <div className="font-body text-[14px] leading-[1.6] text-[var(--text-mid)] mb-5 grow">
                {dash.desc}
              </div>

              {/* Card tags - no bubble, plain inline text */}
              <div className="no-bubble-tag mb-5.5">
                {dash.tags.map((tag, idx) => (
                  <span key={tag}>
                    {idx > 0 && <span className="text-[var(--line)] mx-2">/</span>}
                    {tag}
                  </span>
                ))}
              </div>

              {/* Card foot */}
              <div className="flex items-center justify-between pt-4.5 border-t border-[var(--line-soft)]">
                <span className="font-mono text-[11px] text-[var(--text-low)]">
                  0{i + 1} / 0{total}
                </span>

                <Link
                  href={dash.href}
                  className="group/link flex items-center gap-1.75 font-body font-medium text-[13.5px] text-[var(--purple-300)] transition-all hover:gap-2.75"
                >
                  <span>Open dashboard</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-[14px] h-[14px] transition-transform duration-200 group-hover/link:translate-x-0.5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stack Controls */}
      <div className="flex items-center gap-5 mt-7.5 z-[3]">
        <button
          onClick={prev}
          aria-label="Previous dashboard"
          className="w-[38px] h-[38px] rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgba(155,92,246,0.12)] hover:border-[var(--purple-500)] hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[15px] h-[15px] stroke-[var(--text-hi)]"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {dashboards.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-[7px] rounded-full border-0 cursor-pointer p-0 transition-all duration-350 ease-[cubic-bezier(.19,1,.22,1)] ${
                i === current
                  ? "w-[22px] bg-[linear-gradient(90deg,var(--purple-400),var(--purple-500))]"
                  : "w-[7px] bg-[var(--line)] hover:bg-[var(--purple-400)]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next dashboard"
          className="w-[38px] h-[38px] rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.02)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgba(155,92,246,0.12)] hover:border-[var(--purple-500)] hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[15px] h-[15px] stroke-[var(--text-hi)]"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
