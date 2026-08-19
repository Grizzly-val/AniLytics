import ast
import json

from fastapi import Depends, FastAPI
from contextlib import asynccontextmanager
import httpx

from redis.asyncio import Redis

from src.core import get_seasonal_filtered_data
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


@app.get("/seasonal")
async def get_seasonal(season: Season, seasonYear: int, services: Services = Depends(Services)) -> dict:
    """
    Fetches seasonal anime data from Anilist API based on the provided season and year.
    The data is cached in Redis for 1 hour to reduce API calls.

    Args:
        season (Season): The season for which to fetch anime data (e.g., SPRING, SUMMER, FALL, WINTER).
        seasonYear (int): The year for which to fetch anime data.

        services (Services): Dependency injection for services like HTTP client, Redis client, and logger.

    Returns:
        dict: A dictionary containing the fetched seasonal anime data.
    """
    services.logger.info(f"Fetching seasonal anime data for {season} {seasonYear}...")
    
    # Check if the data is already cached in Redis
    cached_data = await services.redis.get(f"seasonal_genres:{season}:{seasonYear}")
    if cached_data:
        services.logger.info(f"Cache hit for seasonal_genres:{season}:{seasonYear}. Returning cached data.")
        return json.loads(cached_data)
    
    # If not cached, fetch the data from Anilist API
    data = await get_seasonal_filtered_data(services=services, season=season, seasonYear=seasonYear)
    
    # Cache the fetched data in Redis for 1 hour
    await services.redis.set(f"seasonal_genres:{season}:{seasonYear}", json.dumps(data), ex=3600)
    services.logger.info(f"Cached KEY: seasonal_genres:{season}:{seasonYear} in Redis.")
    
    return data