async def plot_clusters(data: dict):
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

    plt.scatter(x=scores, y=popularity, c=clusters)

    plt.xlabel("Log(Popularity)")
    plt.ylabel("Average Score")
    plt.title("Raw Anime Data (Log Scaled)")

    plt.show()


async def plot_raw_data(data: dict):
    import matplotlib.pyplot as plt
    import numpy as np

    anime_data = data.values()

    scores = [anime["averageScore"] for anime in anime_data]
    popularity = [anime["popularity"] for anime in anime_data]

    # Plot
    popularity = np.log(popularity)

    plt.scatter(x=scores, y=popularity)

    plt.xlabel("Log(Popularity)")
    plt.ylabel("Average Score")
    plt.title("Raw Anime Data (Log Scaled)")

    plt.show()