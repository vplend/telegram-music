interface TelegramProps {
    request: string; // текст запроса / название песни
    name: string; // название песни
    artist: string; // автор песни
    icon?: string; // иконка песни
    chatId?: string; // ID чата
    geniusUrl?: string; // URL страницы на Genius
    songId?: string
}

export default async function sendAudio({ name, artist, icon, request, chatId, geniusUrl, songId }: TelegramProps)  {
  try {
    const searchRes = await fetch(`/api/youtubesearch?query=${encodeURIComponent(request)}`);
    if (!searchRes.ok) throw new Error("Ошибка поиска видео");

    const searchData = await searchRes.json();
    if (!Array.isArray(searchData) || searchData.length === 0 || !searchData[0].link) {
      throw new Error("Видео не найдено");
    }

    const videoUrl = searchData[0].link
    console.log(videoUrl)

    const tgRes = await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl, name, artist, icon, chatId, geniusUrl, songId }),
    });
    const tgData = await tgRes.json();
    if (!tgData.ok) throw new Error(tgData.error || "Ошибка отправки в Telegram");

    console.log("Audio sent:");
  } catch (err: unknown) {
    console.error(err);
  }
}
