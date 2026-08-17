export type Season = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export type MediaFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC";

export interface AnimeTitle {
  english?: string | null;
  native?: string | null;
  romaji?: string | null;
}

export interface AnimeItem {
  title: AnimeTitle;
  score: number;
  popularity: number;
  trending: number;
  siteUrl: string;
  bannerImage?: string | null;
  coverImage?: {
    extraLarge?: string | null;
    large?: string | null;
    medium?: string | null;
  } | null;
}

export interface GenreAggregateStats {
  count: number;
  average_score: number;
  average_popularity: number;
  average_trending: number;
}

export type GenreAggregatesResponse = Record<string, GenreAggregateStats>;

export type GenreAnimesResponse = Record<string, AnimeItem[]>;

// Deprecated unified interface kept for compatibility
export interface GenreStats extends GenreAggregateStats {
  animes?: AnimeItem[];
}

export type GenreDataResponse = GenreAggregatesResponse;
