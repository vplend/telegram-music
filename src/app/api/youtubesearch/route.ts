import youtubeSearch from "youtube-search";

export async function GET(req: Request) {
  try {
    // Получаем query из параметров запроса
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      console.error("YouTube API: No query provided");
      return Response.json({ error: "No query provided" }, { status: 400 });
    }

    // Опции для поиска
    const opts: youtubeSearch.YouTubeSearchOptions = {
      maxResults: 20,
      key: process.env.YT_API_KEY as string,
      type: "video",
    };

    if (!opts.key) {
      console.error("YouTube API: Missing API key");
      return Response.json({ error: "YouTube API key not configured" }, { status: 500 });
    }

    // Поиск видео на YouTube
    const results = await new Promise<youtubeSearch.YouTubeSearchResults[]>((resolve, reject) => {
      const searchQuery = `${query} audio`;
      youtubeSearch(searchQuery, opts, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results ?? []);
        }
      });
    });

    if (!results || results.length === 0) {
      return Response.json({ error: "No videos found" }, { status: 404 });
    }

    return Response.json(results);
    
  } catch (error: unknown) {
    // Обработка ошибок и возврат статуса
    if (error instanceof Error && error.message?.includes('quotaExceeded')) {
      return Response.json({ error: "YouTube API quota exceeded" }, { status: 429 });
    }
    if (error instanceof Error && error.message?.includes('keyInvalid')) {
      return Response.json({ error: "Invalid YouTube API key" }, { status: 401 });
    }
  }
  
}
