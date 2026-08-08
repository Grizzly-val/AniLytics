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
  season: Season,
  seasonYear: number,
  format: MediaFormat
) {
  const queryParams = new URLSearchParams({
    season,
    seasonYear: seasonYear.toString(),
    format,
  });
  const key = `/api/genre-data?${queryParams.toString()}`;

  const { data, error, isLoading } = useSWR<GenreDataResponse>(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return { data: data ?? null, error: error?.message ?? null, loading: isLoading };
}