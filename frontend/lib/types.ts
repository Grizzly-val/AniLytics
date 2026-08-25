export type Season = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export type MediaFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC";

export type FilterCategory = "genre" | "format";

export interface AnimeTitle {
  english?: string | null;
  native?: string | null;
  romaji?: string | null;
}

export interface AnimeItem {
  id?: number;
  title: AnimeTitle;
  score: number;
  popularity: number;
  trending: number;
  favourites?: number;
  genres?: string[];
  format?: MediaFormat;
  siteUrl: string;
  bannerImage?: string | null;
  coverImage?: {
    extraLarge?: string | null;
    large?: string | null;
    medium?: string | null;
  } | null;
}

export interface AggregateStats {
  count: number;
  average_score: number;
  average_popularity: number;
  average_trending: number;
  average_favourites?: number;
}

export interface CategoryData {
  aggregates: Record<string, AggregateStats>;
  animes: Record<string, AnimeItem[]>;
}

export interface SeasonalDataResponse {
  formats: CategoryData;
  genres: CategoryData;
}

// Backwards compatibility types
export type GenreAggregateStats = AggregateStats;
export type GenreAggregatesResponse = Record<string, AggregateStats>;
export type GenreAnimesResponse = Record<string, AnimeItem[]>;

