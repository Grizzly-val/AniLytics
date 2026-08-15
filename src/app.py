import ast
import json

from fastapi import Depends, FastAPI
from contextlib import asynccontextmanager
import httpx

from redis.asyncio import Redis

from src.core import get_seasonal_genres_data
from src.dependencies.services import Services

from src.fetch import fetch_anilist

from src.schemas import MediaFormat, Season

from src.tools.logger import Logger



@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.client = httpx.AsyncClient(timeout=httpx.Timeout(10.0))
    app.state.redis = Redis(host="localhost", port=6379, db=0, decode_responses=True)
    app.state.logger = Logger(log_file_path="app.log", log_level="INFO").logger

    if await app.state.redis.ping() and app.state.client and app.state.logger:
        app.state.logger.info("Application startup: HTTP client, Redis client, and logger initialized.")
    yield
    ...
    if app.state.redis:
        await app.state.redis.close()
    if app.state.client:
        await app.state.client.aclose()


# ----------------

app = FastAPI(lifespan=lifespan)

# ----------------



"""
NOTE:
    I will work on these endpoints when I find the time.
    Currently the app.py doesn't match the main function of AniLytics.
"""


@app.get("/seasonal_genres/aggregates")
async def get_seasonal_genres_aggregates(season: Season, seasonYear: int, format: MediaFormat, services: Services = Depends(Services)) -> dict:
    cached_data = await services.redis.get(f"seasonal_genres:aggregates:{season}:{seasonYear}:{format}")
    if cached_data:
        services.logger.info(f"Retrieved cached data for seasonal genres aggregates for season {season} {seasonYear} with format {format}.")
        return json.loads(cached_data)
        
    else:
        data = await get_seasonal_genres_data(season, seasonYear, format, services)
        return data.get("aggregates", {})


@app.get("/seasonal_genres/animes")
async def get_seasonal_genres_animes(season: Season, seasonYear: int, format: MediaFormat, services: Services = Depends(Services)) -> dict:
    cached_data = await services.redis.get(f"seasonal_genres:anime_list:{season}:{seasonYear}:{format}")
    if cached_data:
        services.logger.info(f"Retrieved cached data for seasonal genres animes for season {season} {seasonYear} with format {format}.")
        return json.loads(cached_data)
    else:
        data = await get_seasonal_genres_data(season, seasonYear, format, services)
        return data.get("animes", {})