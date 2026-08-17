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
  if (score >= 70) return "bg-purple-500/10 text-purple-300 border-purple-500/30";
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

export const ANIME_PLACEHOLDER_BANNER = "/no_banner_placeholder_ANILYTICS.jpg";

export function getScoreStyle(score: number): string {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  let hue: number, sat: number, light: number;
  if (value >= 80) {
    const t = (value - 80) / 20;
    hue = 145;
    sat = 48 + t * 10;
    light = 58 + t * 10;
  } else if (value >= 65) {
    const t = (value - 65) / 15;
    hue = 50;
    sat = 48 + t * 12;
    light = 52 + t * 8;
  } else {
    const t = value / 65;
    hue = 3;
    sat = 50 + t * 12;
    light = 50 + t * 8;
  }
  return `hsl(${hue} ${sat}% ${light}%)`;
}

export function getAnimeBannerImage(anime: { bannerImage?: string | null; coverImage?: { extraLarge?: string | null; large?: string | null } | null }): string {
  if (anime.bannerImage) return anime.bannerImage;
  if (anime.coverImage?.extraLarge) return anime.coverImage.extraLarge;
  if (anime.coverImage?.large) return anime.coverImage.large;

  return ANIME_PLACEHOLDER_BANNER;
}





