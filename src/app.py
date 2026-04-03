from fastapi import FastAPI
from contextlib import asynccontextmanager





@asynccontextmanager
async def lifespan(app: FastAPI):
    ...
    yield
    ...



# ----------------

app = FastAPI(lifespan=lifespan)

# ----------------





@app.get("/genres_ranking")
async def get_genres_ranking():
    ...


# @app.get("/underrated_anime")
# @app.get("/investigate_{genres}")
