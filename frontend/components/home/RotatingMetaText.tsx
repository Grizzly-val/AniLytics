"use client";

import { useState, useEffect } from "react";

const stats = [
  "1,200+ titles indexed",
  "Synced every 15 minutes",
  "Powered by AniList GraphQL",
  "4 modules — more in progress",
];

export function RotatingMetaText() {
  const [index, setIndex] = useState(0);
  const [animState, setAnimState] = useState<"idle" | "out" | "in">("idle");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setAnimState("out");

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % stats.length);
        setAnimState("in");

        setTimeout(() => {
          setAnimState("idle");
        }, 420);
      }, 420);
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  const getTextStyle = () => {
    if (animState === "out") {
      return {
        transform: "translateX(14px)",
        opacity: 0,
        transition:
          "transform 420ms cubic-bezier(.65,0,.35,1), opacity 420ms cubic-bezier(.65,0,.35,1)",
      };
    }
    if (animState === "in") {
      return {
        transform: "translateX(0)",
        opacity: 1,
        transition:
          "transform 420ms cubic-bezier(.65,0,.35,1), opacity 420ms cubic-bezier(.65,0,.35,1)",
      };
    }
    return { transform: "translateX(0)", opacity: 1 };
  };

  return (
    <div className="overflow-hidden py-0.5 pr-4 -ml-0.5 select-none">
      <div className="flex items-center gap-2.25">
        <span className="w-[5px] h-[5px] rounded-full bg-[var(--purple-400)] shrink-0 animate-pulse-dot" />
        <span
          className="inline-block font-mono text-[12px] tracking-[0.02em] text-[var(--text-low)] whitespace-nowrap"
          style={getTextStyle()}
        >
          {stats[index]}
        </span>
      </div>
    </div>
  );
}
