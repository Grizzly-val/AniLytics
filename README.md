# Anilytics:
- Backend's (or the API endpoints) function will mainly be to query AniListAPI for specific data for a preset number of pages (e.g. 5 pages of Action animes, sorted by POPULARITY_DESC)
> In other words, Anilytics is an AniListAPI based dataset extractor and visualizer.

### Stack
- FastAPI (Python) for  Heavy **Backend** | Essential **libraries** include: NumPy and Scikit Learn (In the future)
> Just using Python for cheap processing for now (will migrate those processes to NEXT.js in the future for client-side fetching).
- NEXT.js as **BFF** and **client-side AniList API fetching**
- Redis for **Caching**


> AniLytics is incomplete