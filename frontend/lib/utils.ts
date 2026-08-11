import { AnimeTitle, Season, MediaFormat } from "./types";

export const SEASONS: Season[] = ["WINTER", "SPRING", "SUMMER", "FALL"];
export const FORMATS: MediaFormat[] = [
  "TV",
  "TV_SHORT",
  "MOVIE",
  "SPECIAL",
  "OVA",
  "ONA",
  "MUSIC",
];

export function getPrimaryTitle(title: AnimeTitle): string {
  return title.english || title.romaji || title.native || "Untitled Anime";
}

export function getSecondaryTitle(title: AnimeTitle): string | null {
  if (title.english && title.romaji && title.english !== title.romaji) {
    return title.romaji;
  }
  if (title.native && title.native !== title.english && title.native !== title.romaji) {
    return title.native;
  }
  return null;
}

export function getScoreBadgeClass(score: number): string {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  if (score >= 70) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
  if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  return "bg-rose-500/10 text-rose-400 border-rose-500/30";
}

export function getAnimeDomId(title: string): string {
  return `anime-item-${encodeURIComponent(title)}`;
}

export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth();
  if (month >= 0 && month <= 2) return "WINTER";
  if (month >= 3 && month <= 5) return "SPRING";
  if (month >= 6 && month <= 8) return "SUMMER";
  return "FALL";
}

export function getCurrentYear(date: Date = new Date()): number {
  return date.getFullYear();
}

export const DEFAULT_FORMAT: MediaFormat = "TV";


