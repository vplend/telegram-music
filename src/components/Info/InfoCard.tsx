import { useEffect, useState } from "react";
import { getSongById, Song } from "@/lib/getSongById";
import { openLink, useLaunchParams } from "@telegram-apps/sdk-react";
import { Avatar, Image, Text, Card, Cell, Skeleton, Spinner, Subheadline, Button, Caption, InlineButtons } from "@telegram-apps/telegram-ui";
import React from "react";
import './style.css'
import Icon from "../Icon/Icon";
import sendAudio from "@/lib/sendAudio";
import { InlineButtonsItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem";

interface InfoCardProps {
    id?: string
}

export default function InfoCard({ id }: InfoCardProps) {
    const [chatId, setChatId] = useState<string | null>(null);
    const [song, setSong] = useState<Song | null>(null);
    const [startId, setStartId] = useState<string>('');
    const launchParams = useLaunchParams();

    useEffect(() => {
        if (typeof window !== "undefined" && launchParams?.tgWebAppData?.user?.id) {
            setChatId(String(launchParams.tgWebAppData.user.id));
        }
    }, [launchParams]);

    if (!id) {
        console.log('нут')

        useEffect(() => {
            if (typeof window !== "undefined" && launchParams?.tgWebAppData?.user?.id) {
                setStartId(String(launchParams.tgWebAppData.start_param));
            }
        }, [launchParams]);

        useEffect(() => {
            getSongById(startId).then(setSong);
        }, [startId]);
    }

    useEffect(() => {
        getSongById(id ? id : '').then(setSong);
    }, [id]);

    const handleClick = async () => {
        try {
            await sendAudio({
                request: `${song?.title} - ${song?.artist}`,
                name: `${song?.title}`,
                artist: `${song?.artist}`,
                icon: `${song?.artImage}`,
                chatId: `${chatId}`,
                geniusUrl: `${song?.geniusUrl}`,
                songId: `${id ? id : startId}`
            });
        } finally {

        }
    };

    if (!song) {
        return (
            <Spinner size={"l"} />
        )
    }
    return (
        <div style={{ width: '100vw', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div className="card">

                <div className="title">
                    <Text caps weight="1">
                        {song.title}
                    </Text>
                    <Caption style={{ color: 'var(--tgui--hint_color)' }}>
                        {song.artist}
                    </Caption>
                </div>
                <Image
                    style={{ marginRight: 0 + 'rem', width: 10 + 'rem', height: 10 + 'rem', borderRadius: 1 + 'rem', marginTop: 0.4 + 'rem' }}
                    src={song.artImage}
                />
            </div>
            <InlineButtons style={{ marginTop: 0.6 + 'rem', width: 10 + 'rem' }}>
                <InlineButtonsItem
                    onClick={handleClick}
                    text="В чат"
                    mode="bezeled">
                    <Icon icon="chat" width={24} height={24} />
                </InlineButtonsItem>
                <InlineButtonsItem
                    onClick={() => {
                        if (openLink.isAvailable()) {
                            openLink(song.geniusUrl, {
                                tryInstantView: true,
                            });
                        }
                    }}
                    text="Текст"
                    mode="gray">
                    <Icon icon="text" width={24} height={24} />
                </InlineButtonsItem>
            </InlineButtons>
            {/* <Button
                style={{ marginTop: 0.8 + 'rem' }}
                size="s"
                className="button"
                mode="bezeled"
                onClick={() => {
                    sendAudio({
                        request: `${song.title} - ${song.artist}`,
                        name: `${song.title}`,
                        artist: `${song.artist}`,
                        icon: `${song.artImage}`,
                        chatId: `${chatId}`,
                        geniusUrl: `${song.geniusUrl}`,
                        songId: `${id ? id : startId}`
                    })
                }}
            >
                Отправить трек в чат
            </Button>
            <Button
                size="s"
                className="button"
                mode="gray"
                onClick={() => {
                    if (openLink.isAvailable()) {
                        openLink(song.geniusUrl, {
                            tryInstantView: true,
                        });
                    }
                }}
            >
                Открыть текст трека
            </Button> */}
        </div>
    );
}
