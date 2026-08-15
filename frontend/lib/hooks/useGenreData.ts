import useSWR from "swr";
import {
  Season,
  MediaFormat,
  GenreAggregatesResponse,
  GenreAnimesResponse,
} from "@/lib/types";

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export function useGenreAggregates(
  season: Season | "" | null,
  seasonYear: number | null,
  format: MediaFormat | "" | null,
  enabled: boolean = true
) {
  const shouldFetch =
    enabled &&
    Boolean(season) &&
    Boolean(seasonYear) &&
    Boolean(format);

  const queryParams = shouldFetch
    ? new URLSearchParams({
        season: season as string,
        seasonYear: (seasonYear as number).toString(),
        format: format as string,
      }).toString()
    : "";

  const key = shouldFetch ? `/api/seasonal_genres/aggregates?${queryParams}` : null;

  const { data, error, isLoading } = useSWR<GenreAggregatesResponse>(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ?? null,
    error: error?.message ?? null,
    loading: isLoading && shouldFetch,
  };
}

export function useGenreAnimes(
  season: Season | "" | null,
  seasonYear: number | null,
  format: MediaFormat | "" | null,
  enabled: boolean = true
) {
  const shouldFetch =
    enabled &&
    Boolean(season) &&
    Boolean(seasonYear) &&
    Boolean(format);

  const queryParams = shouldFetch
    ? new URLSearchParams({
        season: season as string,
        seasonYear: (seasonYear as number).toString(),
        format: format as string,
      }).toString()
    : "";

  const key = shouldFetch ? `/api/seasonal_genres/animes?${queryParams}` : null;

  const { data, error, isLoading } = useSWR<GenreAnimesResponse>(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data ?? null,
    error: error?.message ?? null,
    loading: isLoading && shouldFetch,
  };
}

// Backwards compatibility alias for aggregates hook
export function useGenreData(
  season: Season | "" | null,
  seasonYear: number | null,
  format: MediaFormat | "" | null,
  enabled: boolean = true
) {
  return useGenreAggregates(season, seasonYear, format, enabled);
}