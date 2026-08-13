from fastapi import Depends, FastAPI
from contextlib import asynccontextmanager
import httpx

from redis.asyncio import Redis

from src.dependencies.services import Services

from src.fetch import fetch_anilist

from src.schemas import MediaFormat, Season

from src.tools.logger import Logger



@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.client = httpx.AsyncClient(timeout=httpx.Timeout(10.0))
    app.state.redis = Redis(host="localhost", port=6379, db=0)
    app.state.logger = Logger(log_file_path="app.log", log_level="INFO").logger
    if app.state.redis.ping() and app.state.client and app.state.logger:
        app.state.logger.info("Application startup: HTTP client, Redis client, and logger initialized.")
    yield
    ...



# ----------------

app = FastAPI(lifespan=lifespan)

# ----------------



"""
NOTE:
    I will work on these endpoints when I find the time.
    Currently the app.py doesn't match the main function of AniLytics.
"""





@app.get("/seasonal_genres")
async def get_seasonal_genres_data(season: Season, seasonYear: int, format: MediaFormat, services = Depends(Services)) -> dict:

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
    
    genre_data = {}
    genre_totals = {}

    for anime in clean_data:
        score = anime["averageScore"]
        popularity = anime["popularity"]
        trending = anime["trending"]

        for genre in anime["genres"]:
            if genre_totals.get(genre, None) is None:
                genre_totals[genre] = {"total_score": 0, "total_popularity": 0, "total_trending": 0}
            if genre_data.get(genre, None) is None:
                genre_data[genre] = {"count": 0, "average_score": 0, "average_popularity": 0, "average_trending": 0, "animes": []}


            genre_data[genre]["count"]                    += 1

            genre_data[genre]["animes"].append({
                "title": anime["title"],
                "score": score,
                "popularity": popularity,
                "trending": trending,
                "siteUrl": anime["siteUrl"]
            })

            genre_totals[genre]["total_score"]            += score
            genre_totals[genre]["total_popularity"]       += popularity
            genre_totals[genre]["total_trending"]         += trending

            genre_data[genre]["average_score"]          =  genre_totals[genre]["total_score"] / genre_data[genre]["count"]
            genre_data[genre]["average_popularity"]     =  genre_totals[genre]["total_popularity"] / genre_data[genre]["count"]
            genre_data[genre]["average_trending"]       =  genre_totals[genre]["total_trending"] / genre_data[genre]["count"]


    services.logger.info(f"Fetched {len(clean_data)} anime entries for season {season} {seasonYear} with format {format}.")


    return  genre_data