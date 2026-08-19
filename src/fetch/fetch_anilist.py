from src.tools.logger import Logger

import httpx




async def get_all_request_data(query: str, variables: dict, client: httpx.AsyncClient, logger: Logger) -> list:
    URL = "https://graphql.anilist.co"
    try:
        result = await client.post(url=URL, json={"query": query, "variables": variables})
        logger.info(f"[Request 1 headers]: Remaining: {result.headers.get("x-ratelimit-remaining")}, Limit: {result.headers.get("x-ratelimit-limit")}")

        result.raise_for_status()

        data = result.json()
        page = 1
        hasNext = data["data"]["Page"]["pageInfo"]["hasNextPage"]

        all_media = data["data"]["Page"]["media"]

        while(hasNext):

            page += 1
            variables["page"] = page
            result = await client.post(url=URL, json={"query": query, "variables": variables})
            result.raise_for_status()

            logger.info(f"[Request 1 headers]: Remaining: {result.headers.get("x-ratelimit-remaining")}, Limit: {result.headers.get("x-ratelimit-limit")}")

            data = result.json()

            all_media += (data["data"]["Page"]["media"])
            hasNext = data["data"]["Page"]["pageInfo"]["hasNextPage"]

        return all_media
    

    except Exception as e:
        raise e


async def get_single_page_request_data(query: str, variables: dict, client: httpx.AsyncClient, logger: Logger) -> list:
    URL = "https://graphql.anilist.co"
    try:
        result = await client.post(url=URL, json={"query": query, "variables": variables})
        logger.info(f"[Request 1 headers]: Remaining: {result.headers.get("x-ratelimit-remaining")}, Limit: {result.headers.get("x-ratelimit-limit")}")

        result.raise_for_status()

        data = result.json()
        all_media = data["data"]["Page"]["media"]

        return all_media
    

    except Exception as e:
        raise e