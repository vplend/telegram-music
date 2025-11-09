export async function GET(req: Request) {
  // Получаем query из параметров запроса
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  if (!query) {
    return Response.json({ error: 'No query provided' }, { status: 400 });
  }

  // Токен для доступа к Genius API
  const accessToken = process.env.GENIUS_TOKEN as string;
  const apiUrl = `https://api.genius.com/search?q=${encodeURIComponent(query)}`;
  // Запрос к Genius API
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    return Response.json({ error: 'Genius API error' }, { status: res.status });
  }

  const data = await res.json();
  const hits = data.response.hits;

  if (!hits || hits.length === 0) {
    return Response.json({ error: 'No song found' }, { status: 404 });
  }
  
  type Song = {
    title: string;
    artist: string;
    image: string;
    url: string;
    year: string;
  };
  // Приводим результат к нужному формату
  const songs = hits.map((hit: {
      result: {
          title: string;
          artist_names?: string;
          song_art_image_thumbnail_url?: string;
          url: string;
          release_date_components?: {
              year: string
          };
          id: string;
      }
  }) => {
    const result = hit.result;

    return {
        title: result.title.replace(/\s*\(.*?\)/g, '').trim(),
        artist: result.artist_names ? result.artist_names.replace(/\s*\((?!Ft\.).*?\)/g, '').replace(/(Ft\.[^()]*)\([^()]*\)([^()]*)/g, '$1$2').trim() : 'Unknown',
        image: result.song_art_image_thumbnail_url || '',
        url: result.url,
        year: result.release_date_components?.year,
        id: result.id,
    };
  }).filter((song: Song) => !/\bgenius\b/i.test(song.artist || ''))

  console.log(songs)

  return Response.json(songs);
}
