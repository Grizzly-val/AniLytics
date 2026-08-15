from src.tools.logger import Logger

from fastapi import Request
import httpx
from redis.asyncio import Redis


class Services:
    def __init__(self, request: Request):
        self.client: httpx.AsyncClient = request.app.state.client
        self.redis: Redis = request.app.state.redis

        self.logger: Logger = request.app.state.logger