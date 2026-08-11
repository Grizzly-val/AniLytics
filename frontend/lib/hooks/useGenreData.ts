import useSWR from "swr";
import { Season, MediaFormat, GenreDataResponse } from "@/lib/types";

const fetcher = async (url: string): Promise<GenreDataResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export function useGenreData(
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

  const key = shouldFetch ? `/api/genre-data?${queryParams}` : null;

  const { data, error, isLoading } = useSWR<GenreDataResponse>(key, fetcher, {
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