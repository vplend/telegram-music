// Search.tsx
// Компонент поиска песен через Genius API и отправки аудио в Telegram
import { useSongSearch } from "@/hooks/useSongSearch";
// ...

import { useState, useRef, useEffect } from 'react';
import sendAudio from "@/lib/sendAudio"
import {Input, IconButton, Button, Avatar} from "@telegram-apps/telegram-ui";
import { Icon16Cancel } from "@telegram-apps/telegram-ui/dist/icons/16/cancel"
import SongCell from "./SongCell";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import Header from "@/components/Header/Header";
/**
 * Компонент поиска песен через Genius API и отправки аудио в Telegram
 * Показывает результаты поиска, позволяет отправить выбранную песню
 * 
 */


function Search() {

  const {
    query,
    setQuery,
    results,
    error,
    searchSong
  } = useSongSearch();

  const [chatId, setChatId] = useState<string | null>(null);
  const launchParams = useLaunchParams();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined" && launchParams?.tgWebAppData?.user?.id) {
      setChatId(String(launchParams.tgWebAppData.user.id));
    }
  }, [launchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    console.log('Input value:', value);
  };

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('прервано')
    }
    abortControllerRef.current = new AbortController();
    console.log('Query updated:', query);
    if (query.trim()) {
      searchSong(abortControllerRef.current.signal);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);


  return(
    <div className="">
      <div className="">
        <Input 
          status="focused"
          className=""
          header={<Header/>}
          placeholder="Введите запрос"
          value={query}
          onChange={handleChange}
          after = { 
            <IconButton mode="bezeled" size="s" onClick={() => {setQuery('')}}>
              <Icon16Cancel/>
            </IconButton>            
          }
        />
      </div>
      {/* Результаты поиска */}
      <div className="">
        {results.length > 0 && results.map((item, idx) => (
          <SongCell
            key={item.url || idx}
            image={item.image}
            title={item.title}
            artist={item.artist}
            url={item.url}
            year={item.year}
            onSend={() => sendAudio({
                request: `${item.title} - ${item.artist}`,
                name: `${item.title}`,
                artist: `${item.artist}`,
                icon: `${item.image}`,
                chatId: `${chatId}`,
                geniusUrl: `${item.url}`,
            })}
          />
        ))}
      </div>
  </div>
  );
}
export default Search;
