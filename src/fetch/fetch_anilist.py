import httpx




async def get_anime_data(query: str, variables: dict, client: httpx.AsyncClient):
    URL = "https://graphql.anilist.co"
    try:
        result = await client.post(url=URL, json={"query": query, "variables": variables})
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
            data = result.json()

            all_media += (data["data"]["Page"]["media"])
            hasNext = data["data"]["Page"]["pageInfo"]["hasNextPage"]
            print(variables)

        return all_media
    

    except Exception as e:
        raise e