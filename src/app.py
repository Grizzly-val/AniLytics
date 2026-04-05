from fastapi import Depends, FastAPI
from contextlib import asynccontextmanager
from redis.asyncio import Redis
import httpx

from src.dependencies.services import Services

from src.fetch import fetch_anilist

from src.schemas import Season



@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.redis = Redis(host="localhost", port=6379, decode_responses=True)
    app.state.client = httpx.AsyncClient(timeout=httpx.Timeout(10.0))
    yield
    ...



# ----------------

app = FastAPI(lifespan=lifespan)

# ----------------





@app.get("/seasonal_genres_ranking")
async def get_seasonal_genres_ranking(season: Season, seasonYear: int, services = Depends(Services)) -> dict:
    query = """
            query ($page: Int, $season: MediaSeason, $seasonYear: Int){
                Page (page: $page, perPage: 50){
                    pageInfo {
                        currentPage
                        hasNextPage
                    }

                    media (season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY) {
                        genres
                        averageScore
                        popularity
                        trending
                    }
                }
            }
            """
    
    json_variables = {"currentPage": 1, "season": season, "seasonYear": seasonYear}
    
    data = await fetch_anilist.get_anime_data(query=query, variables=json_variables, client=services.client)
    
    clean_data = [
    anime for anime in data
    if anime["averageScore"] is not None
    and "Hentai" not in anime["genres"]
    ]
    
    print(len(clean_data))

    genre_data = {}

    for anime in clean_data:
        score = anime["averageScore"]
        popularity = anime["popularity"]
        trending = anime["trending"]

        for genre in anime["genres"]:
            if genre_data.get(genre, None) is None:
                genre_data[genre] = {"total_score": 0, "count": 0, "total_popularity": 0, "total_trending": 0, "average_score": 0, "average_popularity": 0, "average_trending": 0}
            genre_data[genre]["count"]                  += 1
            genre_data[genre]["total_score"]            += score
            genre_data[genre]["total_popularity"]       += popularity
            genre_data[genre]["total_trending"]         += trending
            genre_data[genre]["average_score"]          =  genre_data[genre]["total_score"] / genre_data[genre]["count"]
            genre_data[genre]["average_popularity"]     =  genre_data[genre]["total_popularity"] / genre_data[genre]["count"]
            genre_data[genre]["average_trending"]       =  genre_data[genre]["total_trending"] / genre_data[genre]["count"]

    clean_genre_data = {}

    for genre, stats in genre_data.items():
        if stats["count"] < 5:
            continue
        clean_genre_data[genre] = {}
        clean_genre_data[genre]["count"]                = stats["count"]
        clean_genre_data[genre]["average_score"]        = stats["average_score"]
        clean_genre_data[genre]["average_popularity"]   = stats["average_popularity"]
        clean_genre_data[genre]["average_trending"]     = stats["average_trending"]


    return clean_genre_data
    


    # Fetching desired dataset: DONE
    # Next is use Numpy to normalize data into tabular format for processing
    # Then display on frontend


@app.get("/anime_clusters")
async def get_seasonal_anime_clusters(season: Season, seasonYear: int, services = Depends(Services)) -> dict:
    query = """
            query ($page: Int, $season: MediaSeason, $seasonYear: Int){
                Page (page: $page, perPage: 50){
                    pageInfo {
                        currentPage
                        hasNextPage
                    }

                    media (season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY) {
                        title{
                            romaji
                        }
                        averageScore
                        popularity
                        trending
                    }
                }
            }
        """

    json_variables = {"currentPage": 1, "season": season, "seasonYear": seasonYear}
    
    data = await fetch_anilist.get_anime_data(query=query, variables=json_variables, client=services.client)
    
    clean_anime_data = {
        anime["title"]["romaji"]:
            {"averageScore": anime["averageScore"], 
            "popularity": anime["popularity"], 
            "trending": anime["trending"]}
        for anime in data
    if anime["averageScore"] is not None
    and anime["popularity"] is not None
    and anime["trending"] is not None
    }

    return clean_anime_data

# @app.get("/underrated_{seasnon}_anime")
# @app.get("/investigate_{genres}")
