export interface Song {
    artImage?: string;
    title?: string;
    artist?: string;
    youtubeUrl?: string;
    date?: string;
}

export async function getSongById(id: string): Promise<Song | null> {
    try {
        const res = await fetch(`/api/search/id?query=${encodeURIComponent(id)}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Ошибка поиска");
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}
