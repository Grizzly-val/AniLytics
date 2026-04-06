import httpx
from enum import Enum




class Season(str, Enum):
    spring = "SPRING"
    summer = "SUMMER"
    winter = "WINTER"
    fall = "FALL"


def plot_clusters(data: dict):
    import matplotlib.pyplot as plt
    import numpy as np
    from sklearn.preprocessing import StandardScaler
    from sklearn.cluster import KMeans

    anime_data = data.values()
    
    X = [
    [anime["averageScore"], anime["popularity"]]
    for anime in anime_data
    ]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    kmeans = KMeans(n_clusters=3, random_state=42)
    labels = kmeans.fit_predict(X_scaled)

    for i, anime in enumerate(anime_data):
        anime["cluster"] = int(labels[i])

    scores = [anime["averageScore"] for anime in anime_data]
    popularity = [anime["popularity"] for anime in anime_data]
    clusters = [anime["cluster"] for anime in anime_data]

    # Plot
    popularity = np.log(popularity)
    #scores = np.log(scores)

    plt.scatter(x=scores, y=popularity, c=clusters)

    plt.xlabel("Log(Popularity)")
    plt.ylabel("Average Score")
    plt.title("Raw Anime Data (Log Scaled)")

    plt.show()


def plot_raw_data(data: dict):
    import matplotlib.pyplot as plt
    import numpy as np

    anime_data = data.values()

    scores = [anime["averageScore"] for anime in anime_data]
    popularity = [anime["popularity"] for anime in anime_data]

    # Plot
    popularity = np.log(popularity)
    #scores = np.log(scores)

    plt.scatter(x=scores, y=popularity)

    plt.xlabel("Log(Popularity)")
    plt.ylabel("Average Score")
    plt.title("Raw Anime Data (Log Scaled)")

    plt.show()



def get_anime_data(query: str, variables: dict, client: httpx.Client):
    URL = "https://graphql.anilist.co"
    try:
        result = client.post(url=URL, json={"query": query, "variables": variables})
        result.raise_for_status()

        data = result.json()
        page = 1
        hasNext = data["data"]["Page"]["pageInfo"]["hasNextPage"]

        all_media = data["data"]["Page"]["media"]

        while(hasNext):
            print(f"Page #{page} fetched!")
            page += 1
            variables["page"] = page
            result = client.post(url=URL, json={"query": query, "variables": variables})
            result.raise_for_status()
            data = result.json()

            all_media += (data["data"]["Page"]["media"])
            hasNext = data["data"]["Page"]["pageInfo"]["hasNextPage"]

        print(f"Fetch done! (Total: {len(all_media)})")
        return all_media

    except Exception as e:
        raise e


def get_seasonal_anime_clusters(season: Season, seasonYear: int) -> dict:
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
    
    data = get_anime_data(query=query, variables=json_variables, client=httpx.Client())
    
    clean_anime_data = {
        anime["title"]["romaji"]:
            {"averageScore": anime["averageScore"], 
            "popularity": anime["popularity"], 
            "trending": anime["trending"]
            }
        for anime in data
    if anime["averageScore"] is not None
    and anime["popularity"] is not None
    and anime["trending"] is not None
    }
    
    return clean_anime_data

print()
anime_data = get_seasonal_anime_clusters(season=Season.summer, seasonYear=2021)





while True:
    print()
    choice = input("[x]: Terminate program\n[a]: Raw data plotting\n[b]: Plotting of clustered data\nChoice: ")
    match choice.lower():
        case "a":
            plot_raw_data(anime_data)
        case "b":
            plot_clusters(anime_data)
        case "x":
            break
        case _:
            print("Invalid input!")