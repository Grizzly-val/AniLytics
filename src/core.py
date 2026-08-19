import json
from typing import Literal

from src.dependencies.services import Services
from src.fetch import fetch_anilist
from src.schemas import MediaFormat, Season


async def get_seasonal_filtered_data(services: Services,
                                   season: Season | None = None, 
                                   seasonYear: int | None = None, 
                                   #type: Literal["ANIME", "MANGA"] = "ANIME",
                                   ) -> dict:

    query = """
            query Media($season: MediaSeason, $seasonYear: Int, $page: Int) {
            
            Page(page: $page) {
                pageInfo {
                    currentPage
                    hasNextPage
                    total
                }

                media(season: $season, seasonYear: $seasonYear) {
                id
                title {
                    english
                    native
                    romaji
                }
                bannerImage

                siteUrl
                genres
                format

                averageScore
                popularity
                trending
                favourites
                
                }
            }
            }
            """

    services.logger.info("...")
    
    json_variables = {"currentPage": 1, "season": season, "seasonYear": seasonYear}

    data = await fetch_anilist.get_all_request_data(query=query, variables=json_variables, client=services.client, logger=services.logger)
    
    clean_data = [
        anime for anime in data
        if anime["averageScore"] and 
        anime["popularity"] and 
        anime["trending"] and 
        anime["genres"] and 
        anime["siteUrl"] and 
        anime["title"] and 
        anime["bannerImage"]
    ]
    
    genre_aggregates = {}
    genre_aggregates_totals = {}

    formats_aggregates = {}
    format_aggregates_totals = {}

    formats_animes = {}
    genres_animes = {}

    for anime in clean_data:
        score = anime["averageScore"]
        popularity = anime["popularity"]
        trending = anime["trending"]
        favourites = anime["favourites"]

        for genre in anime["genres"]:
            if genre_aggregates_totals.get(genre, None) is None:
                genre_aggregates_totals[genre] = {"total_score": 0, "total_popularity": 0, 
                                                  "total_trending": 0, "total_favourites": 0}
            if genre_aggregates.get(genre, None) is None:
                genre_aggregates[genre] = {"count": 0, "average_score": 0,
                                           "average_popularity": 0, "average_trending": 0, "average_favourites": 0}
            if genres_animes.get(genre, None) is None:
                genres_animes[genre] = []


            genre_aggregates[genre]["count"]                    += 1

            genres_animes[genre].append({
                "title": anime["title"],
                "score": score,
                "popularity": popularity,
                "trending": trending,
                "siteUrl": anime["siteUrl"],
                "favourites": favourites,
                "bannerImage": anime["bannerImage"]
            })

            genre_aggregates_totals[genre]["total_score"]            += score
            genre_aggregates_totals[genre]["total_popularity"]       += popularity
            genre_aggregates_totals[genre]["total_trending"]         += trending
            genre_aggregates_totals[genre]["total_favourites"]       += favourites

            genre_aggregates[genre]["average_score"]          =  genre_aggregates_totals[genre]["total_score"] / genre_aggregates[genre]["count"]
            genre_aggregates[genre]["average_popularity"]     =  genre_aggregates_totals[genre]["total_popularity"] / genre_aggregates[genre]["count"]
            genre_aggregates[genre]["average_trending"]       =  genre_aggregates_totals[genre]["total_trending"] / genre_aggregates[genre]["count"]
            genre_aggregates[genre]["average_favourites"]     =  genre_aggregates_totals[genre]["total_favourites"] / genre_aggregates[genre]["count"]

    for anime in clean_data:
        anime_format = anime["format"]
        score = anime["averageScore"]
        popularity = anime["popularity"]
        trending = anime["trending"]
        favourites = anime["favourites"]

        if format_aggregates_totals.get(anime_format, None) is None:
            format_aggregates_totals[anime_format] = {"total_score": 0,"total_popularity": 0, 
                                                "total_trending": 0, "total_favourites": 0}
        if formats_aggregates.get(anime_format, None) is None:
            formats_aggregates[anime_format] = {"count": 0, "average_score": 0, 
                                         "average_popularity": 0, "average_trending": 0, "average_favourites": 0}
        if formats_animes.get(anime_format, None) is None:
            formats_animes[anime_format] = []

        formats_aggregates[anime_format]["count"]                    += 1

        formats_animes[anime_format].append({
            "title": anime["title"],
            "score": score,
            "popularity": popularity,
            "trending": trending,
            "siteUrl": anime["siteUrl"],
            "favourites": favourites,
            "bannerImage": anime["bannerImage"]
        })

        format_aggregates_totals[anime_format]["total_score"]            += score
        format_aggregates_totals[anime_format]["total_popularity"]       += popularity
        format_aggregates_totals[anime_format]["total_trending"]         += trending
        format_aggregates_totals[anime_format]["total_favourites"]       += favourites

        formats_aggregates[anime_format]["average_score"]          =  format_aggregates_totals[anime_format]["total_score"] / formats_aggregates[anime_format]["count"]
        formats_aggregates[anime_format]["average_popularity"]     =  format_aggregates_totals[anime_format]["total_popularity"] / formats_aggregates[anime_format]["count"]
        formats_aggregates[anime_format]["average_trending"]       =  format_aggregates_totals[anime_format]["total_trending"] / formats_aggregates[anime_format]["count"]
        formats_aggregates[anime_format]["average_favourites"]     =  format_aggregates_totals[anime_format]["total_favourites"] / formats_aggregates[anime_format]["count"]

    data = {
        "formats": {
            "aggregates": formats_aggregates,
            "animes": formats_animes
        },
        "genres": {
            "aggregates": genre_aggregates,
            "animes": genres_animes
        }
    }

    services.logger.info(f"Fetched {len(clean_data)} anime entries for season {season} {seasonYear}.")

    await services.redis.set(f"seasonal_genres:{season}:{seasonYear}", json.dumps(data), ex=30)

    services.logger.info(f"Cached KEY: seasonal_genres:{season}:{seasonYear} in Redis.")
    
    return data