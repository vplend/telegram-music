import { useState } from "react";

export interface Song {
  image?: string;
  title?: string;
  artist?: string;
  url?: string;
  year?: string;
  songId?: string;
}

export function useSongSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function searchSong(signal: AbortSignal) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
        signal
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
        setError(data.error || "Ошибка поиска");
      }
    } catch (e) {
      setResults([]);
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return {
    query,
    setQuery,
    results,
    error,
    loading,
    searchSong,
  };
}
