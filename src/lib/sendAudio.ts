// helpers/send-audio.ts
// Утилита для поиска аудио на YouTube и отправки его в Telegram через backend-роуты
// Используется в компонентах для отправки аудио по запросу пользователя

interface TelegramProps {
  request: string; // текст запроса / название песни
  name: string; // название песни
  artist: string; // автор песни
  icon?: string; // иконка песни
  chatId?: string; // ID чата
  geniusUrl?: string; // URL страницы на Genius
}

/**
 * Функция ищет видео на YouTube по запросу и отправляет аудио в Telegram через backend
 * @param {TelegramProps} props - параметры для поиска и отправки
 */
export default async function sendAudio({ name, artist, icon, request, chatId, geniusUrl }: TelegramProps)  {
  try {
    // 1. Получаем ссылку на YouTube видео по запросу
    const searchRes = await fetch(`/api/youtubesearch?query=${encodeURIComponent(request)}`);
    if (!searchRes.ok) throw new Error("Ошибка поиска видео");

    const searchData = await searchRes.json();
    if (!Array.isArray(searchData) || searchData.length === 0 || !searchData[0].link) {
      throw new Error("Видео не найдено");
    }

    const videoUrl = searchData[0].link
    console.log(videoUrl)

    // 2. Отправляем аудио в Telegram через backend
    const tgRes = await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: videoUrl, name, artist, icon, chatId, geniusUrl }),
    });
    const tgData = await tgRes.json();
    if (!tgData.ok) throw new Error(tgData.error || "Ошибка отправки в Telegram");

    console.log("Audio sent:");
  } catch (err: unknown) {
    console.error(err);
  }
}
