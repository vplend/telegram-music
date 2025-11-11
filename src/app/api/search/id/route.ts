export async function GET(req: Request) {
    // Получаем id из параметров запроса
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    if (!query) {
        return Response.json({ error: 'No query provided' }, { status: 400 });
    }

    // Токен для доступа к Genius API
    const accessToken = process.env.GENIUS_TOKEN as string;
    const apiUrl = `https://api.genius.com/songs/${encodeURIComponent(query)}`;
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
    const song = data.response.song;

    if (!song || song.length === 0) {
        return Response.json({ error: 'No song found' }, { status: 404 });
    }

    const songJSON = {
        title: song.title.replace(/\s*\(.*?\)/g, '').trim(),
        artist: song.artist_names.replace(/\s*\((?!Ft\.).*?\)/g, '').replace(/(Ft\.[^()]*)\([^()]*\)([^()]*)/g, '$1$2').trim(),
        date: song.release_date_for_display,
        artImage: song.song_art_image_url
    }

    console.log(songJSON)

    return Response.json(songJSON);
}
