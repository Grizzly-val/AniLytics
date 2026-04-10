import httpx
from enum import Enum

# Playground created to optimize k-means clustering function.
# Also used by the dev to learn about sklearn, numpy, and mplib.


class Season(str, Enum):
    spring = "SPRING"
    summer = "SUMMER"
    winter = "WINTER"
    fall = "FALL"

"""
def plot_clusters(data: dict):
    import matplotlib.pyplot as plt
    import numpy as np
    from sklearn.preprocessing import StandardScaler
    from sklearn.cluster import KMeans

    anime_data = data.values()
    
    X = np.array([[a["averageScore"], a["popularity"]] for a in anime_data])

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    kmeans = KMeans(n_clusters=3, random_state=42)
    labels = kmeans.fit_predict(X_scaled)

    for i, anime in enumerate(anime_data):
        anime["cluster"] = int(labels[i])

    scores = np.array([anime["averageScore"] for anime in anime_data])
    popularity = np.array([anime["popularity"] for anime in anime_data])
    clusters = np.array([anime["cluster"] for anime in anime_data])

    # Plot
    popularity = np.log(popularity)
    scores = np.log(scores)

    plt.scatter(x=scores, y=popularity, c=clusters)

    plt.xlabel("Log(Popularity)")
    plt.ylabel("Average Score")
    plt.title("Raw Anime Data (Log Scaled)")

    plt.show()
"""
"""
def plot_clusters(data: dict):
    import matplotlib.pyplot as plt
    import numpy as np
    from sklearn.preprocessing import StandardScaler
    from sklearn.cluster import KMeans

    anime_data = list(data.values())
    
    # 1. Prepare data
    X = np.array([[a["averageScore"], a["popularity"], np.log(a["popularity"]) / a["averageScore"]] for a in anime_data])
    # 2. Scale for Clustering (Crucial so popularity doesn't dominate KMeans)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # 3. Cluster
    kmeans = KMeans(n_clusters=3, n_init='auto', random_state=1)
    labels = kmeans.fit_predict(X_scaled)

    # 4. Visualization logic
    scores = X[:, 0]
    popularity = X[:, 1]

    plt.figure(figsize=(12, 7))
    
    # Use scatter with the raw scores but log the popularity axis visually
    scatter = plt.scatter(scores, popularity, c=labels, cmap='viridis', alpha=0.6)
    
    # Ensure popularity (large range) doesn't dominate the visual scale
    plt.yscale('log') 
    
    plt.xlabel("Average Score (Linear)")
    plt.ylabel("Popularity (Log Scale)")
    plt.title("Anime Clusters: Score vs. Popularity")
    plt.colorbar(scatter, label='Cluster ID')
    plt.grid(True, which="both", ls="-", alpha=0.2)
    
    plt.show()
"""


def new_plot_clusters(data: dict, k = 4):
    import matplotlib.pyplot as plt
    import numpy as np
    from sklearn.preprocessing import StandardScaler
    from sklearn.cluster import KMeans

    anime_data = list(data.values())
    
    # 1. Extract raw values
    scores = np.array([a["averageScore"] for a in anime_data]).reshape(-1, 1)
    # Log transform popularity immediately to handle the long-tail
    popularity = np.log1p([a["popularity"] for a in anime_data]).reshape(-1, 1)

    # 2. Scale them so they are comparable (Mean=0, Std=1)
    scaler = StandardScaler()
    scores_scaled = scaler.fit_transform(scores)
    pop_scaled = scaler.fit_transform(popularity)

    # 3. Create the "Underrated Factor"
    # (High score + Low popularity = High positive number)
    underrated_factor = scores_scaled - pop_scaled

    # Combine into feature matrix for KMeans
    X = np.column_stack([scores_scaled, pop_scaled, underrated_factor])

    # 4. Cluster
    # We use 3 clusters as you requested: Underrated, Well-rated, Overrated
    kmeans = KMeans(n_clusters=k, n_init='auto', random_state=42)
    labels = kmeans.fit_predict(X)

    # 5. Visualization
    plt.figure(figsize=(12, 7))
    
    # We plot raw scores and raw popularity (but keep log scale for Y)
    raw_pop = np.array([a["popularity"] for a in anime_data])
    raw_scores = np.array([a["averageScore"] for a in anime_data])
    
    scatter = plt.scatter(raw_scores, raw_pop, c=labels, cmap='viridis', alpha=0.7, edgecolors='w')
    
    plt.yscale('log')
    plt.xlabel("Average Score")
    plt.ylabel("Popularity (Log Scale)")
    plt.title("Anime Clusters: Identifying Underrated vs. Overrated")
    
    # Adding a colorbar to see which cluster is which
    cbar = plt.colorbar(scatter)
    cbar.set_label('Cluster Group')
    
    plt.grid(True, which="both", ls="-", alpha=0.1)
    plt.show()


def plot_raw_data(data: dict):
    import matplotlib.pyplot as plt
    import numpy as np

    X_anime_data = np.array(
        [
            [a["averageScore"], np.log1p(a["popularity"])] 
                for a in data.values()
        ]
    )

    scores = X_anime_data[:, 0]
    popularity = X_anime_data[:, 1]

    # Plot
    plt.scatter(x=scores, y=popularity)
    
    plt.xlabel("Log(Popularity)")
    plt.ylabel("Average Score")
    plt.title("Raw Anime Data (Log Scaled)")


    plt.show()



def get_anime_data(query: str, variables: dict, client: httpx.Client, limit = 5):
    URL = "https://graphql.anilist.co"
    try:
        result = client.post(url=URL, json={"query": query, "variables": variables})
        result.raise_for_status()

        data = result.json()
        page = 1
        hasNext = data["data"]["Page"]["pageInfo"]["hasNextPage"]

        all_media = data["data"]["Page"]["media"]

        while(hasNext and page <= limit):
            variables["page"] = page
            result = client.post(url=URL, json={"query": query, "variables": variables})
            result.raise_for_status()
            data = result.json()
            print(f"Page #{page} fetched!")
            page += 1

            all_media += (data["data"]["Page"]["media"])
            hasNext = data["data"]["Page"]["pageInfo"]["hasNextPage"]

        print(f"Fetch done! (Total: {len(all_media)})")
        return all_media

    except Exception as e:
        raise e



def get_all_animes() -> dict:
    query = """
            query ($page: Int){
                Page (page: $page, perPage: 50){
                    pageInfo {
                        currentPage
                        hasNextPage
                    }

                    media (type: ANIME, sort: POPULARITY_DESC) {
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

    json_variables = {"currentPage": 1}
    
    data = get_anime_data(query=query, variables=json_variables, client=httpx.Client(), limit=7)
    
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



def get_seasonal_anime_clusters(season: Season, seasonYear: int) -> dict:
    query = """
            query ($page: Int, $season: MediaSeason, $seasonYear: Int){
                Page (page: $page, perPage: 50){
                    pageInfo {
                        currentPage
                        hasNextPage
                    }

                    media (season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY_DESC) {
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
anime_data = get_seasonal_anime_clusters(season=Season.spring, seasonYear=2024)

while True:
    print()
    choice = input("[x]: Terminate program\n[a]: Raw data plotting\n[b]: Plotting of clustered data\nChoice: ")
    match choice.lower():
        case "a":
            plot_raw_data(anime_data)
        case "b":
            new_plot_clusters(anime_data)
        case "x":
            break
        case _:
            print("Invalid input!")