import useSWR from "swr";
import {
  Season,
  SeasonalDataResponse,
} from "@/lib/types";

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export function useSeasonalData(
  season: Season | "" | null,
  seasonYear: number | null,
  enabled: boolean = true
) {
  const shouldFetch =
    enabled &&
    Boolean(season) &&
    Boolean(seasonYear) &&
    !isNaN(Number(seasonYear));

  const queryParams = shouldFetch
    ? new URLSearchParams({
        season: season as string,
        seasonYear: (seasonYear as number).toString(),
      }).toString()
    : "";

  const key = shouldFetch ? `/api/easy-anilytics/filter-by/seasonal?${queryParams}` : null;

  const { data, error, isLoading } = useSWR<SeasonalDataResponse>(key, fetcher, {
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