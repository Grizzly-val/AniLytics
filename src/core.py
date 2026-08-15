import json

from src.dependencies.services import Services
from src.fetch import fetch_anilist
from src.schemas import MediaFormat, Season


async def get_seasonal_genres_data(season: Season, seasonYear: int, format: MediaFormat, services: Services) -> dict:

    query = """
            query ($page: Int, $season: MediaSeason, $seasonYear: Int, $format: MediaFormat){
                Page (page: $page, perPage: 50){
                    pageInfo {
                        currentPage
                        hasNextPage
                    }

                    media (season: $season, seasonYear: $seasonYear, type: ANIME, format: $format, sort: POPULARITY) {
                        genres
                        averageScore
                        popularity
                        trending
                        siteUrl
                        title {
                            english
                            native
                            romaji
                        }
                    }
                }
            }
            """

    services.logger.info("...")
    
    json_variables = {"currentPage": 1, "season": season, "seasonYear": seasonYear, "format": format}

    
    data = await fetch_anilist.get_anime_data(query=query, variables=json_variables, client=services.client, logger=services.logger)
    
    clean_data = [
        anime for anime in data
        if anime["averageScore"] and 
        anime["popularity"] and 
        anime["trending"] and 
        anime["genres"] and 
        anime["siteUrl"] and 
        anime["title"]
    ]
    
    genre_aggregates = {}
    genre_aggregates_totals = {}
    genre_animes = {}

    for anime in clean_data:
        score = anime["averageScore"]
        popularity = anime["popularity"]
        trending = anime["trending"]

        for genre in anime["genres"]:
            if genre_aggregates_totals.get(genre, None) is None:
                genre_aggregates_totals[genre] = {"total_score": 0, "total_popularity": 0, "total_trending": 0}
            if genre_aggregates.get(genre, None) is None:
                genre_aggregates[genre] = {"count": 0, "average_score": 0, "average_popularity": 0, "average_trending": 0}
            if genre_animes.get(genre, None) is None:
                genre_animes[genre] = []


            genre_aggregates[genre]["count"]                    += 1

            genre_animes[genre].append({
                "title": anime["title"],
                "score": score,
                "popularity": popularity,
                "trending": trending,
                "siteUrl": anime["siteUrl"]
            })

            genre_aggregates_totals[genre]["total_score"]            += score
            genre_aggregates_totals[genre]["total_popularity"]       += popularity
            genre_aggregates_totals[genre]["total_trending"]         += trending

            genre_aggregates[genre]["average_score"]          =  genre_aggregates_totals[genre]["total_score"] / genre_aggregates[genre]["count"]
            genre_aggregates[genre]["average_popularity"]     =  genre_aggregates_totals[genre]["total_popularity"] / genre_aggregates[genre]["count"]
            genre_aggregates[genre]["average_trending"]       =  genre_aggregates_totals[genre]["total_trending"] / genre_aggregates[genre]["count"]

    data = {
        "aggregates": genre_aggregates,
        "animes": genre_animes
    }

    services.logger.info(f"Fetched {len(clean_data)} anime entries for season {season} {seasonYear} with format {format}.")

    await services.redis.msetex(mapping=
                                {
                                    f"seasonal_genres:aggregates:{season}:{seasonYear}:{format}": json.dumps(genre_aggregates), 
                                    f"seasonal_genres:anime_list:{season}:{seasonYear}:{format}": json.dumps(genre_animes)
                                },
                                ex=20
                                )
    services.logger.info(f"Cached KEY: seasonal_genres:{season}:{seasonYear}:{format} in Redis.")
    
    return data