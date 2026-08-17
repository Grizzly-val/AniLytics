"use client";

import { useState, useEffect, useRef } from "react";

const segLists = {
  season: ["SUMMER", "SPRING", "WINTER", "FALL"],
  year: ["2025", "2024", "2023", "2022"],
  format: ["TV", "MOVIE", "OVA"],
};

type SegKey = "season" | "year" | "format";
const segOrder: SegKey[] = ["season", "year", "format"];

export function RotatingEyebrow() {
  const [indices, setIndices] = useState({ season: 0, year: 0, format: 0 });
  const [animatingKey, setAnimatingKey] = useState<SegKey | null>(null);
  const [animState, setAnimState] = useState<"out" | "in" | "idle">("idle");
  const orderPointerRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      const currentKey = segOrder[orderPointerRef.current];
      orderPointerRef.current = (orderPointerRef.current + 1) % segOrder.length;

      setAnimatingKey(currentKey);
      setAnimState("out");

      setTimeout(() => {
        setIndices((prev) => ({
          ...prev,
          [currentKey]: (prev[currentKey] + 1) % segLists[currentKey].length,
        }));
        setAnimState("in");

        setTimeout(() => {
          setAnimatingKey(null);
          setAnimState("idle");
        }, 420);
      }, 420);
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  const getSegmentStyle = (key: SegKey) => {
    if (animatingKey !== key) {
      return { transform: "translateY(0)", opacity: 1 };
    }
    if (animState === "out") {
      return {
        transform: "translateY(-10px)",
        opacity: 0,
        transition:
          "transform 420ms cubic-bezier(.65,0,.35,1), opacity 420ms cubic-bezier(.65,0,.35,1)",
      };
    }
    if (animState === "in") {
      return {
        transform: "translateY(0)",
        opacity: 1,
        transition:
          "transform 420ms cubic-bezier(.65,0,.35,1), opacity 420ms cubic-bezier(.65,0,.35,1)",
      };
    }
    return { transform: "translateY(0)", opacity: 1 };
  };

  return (
    <div className="flex items-center gap-2 mb-6.5 select-none">
      <span className="flex items-baseline gap-1.75 font-mono text-[12px] tracking-[0.12em] text-[var(--purple-300)] uppercase whitespace-nowrap">
        <span className="inline-block overflow-hidden h-[1.5em] leading-[1.5em] px-[1px]">
          <span className="inline-block" style={getSegmentStyle("season")}>
            {segLists.season[indices.season]}
          </span>
        </span>
        <span className="inline-block overflow-hidden h-[1.5em] leading-[1.5em] px-[1px]">
          <span className="inline-block" style={getSegmentStyle("year")}>
            {segLists.year[indices.year]}
          </span>
        </span>
        <span className="opacity-75">·</span>
        <span className="inline-block overflow-hidden h-[1.5em] leading-[1.5em] px-[1px]">
          <span className="inline-block" style={getSegmentStyle("format")}>
            {segLists.format[indices.format]}
          </span>
        </span>
        <span className="opacity-75">— LIVE</span>
      </span>
    </div>
  );
}
