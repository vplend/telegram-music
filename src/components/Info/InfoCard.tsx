import { useEffect, useState } from "react";
import { getSongById, Song } from "@/lib/getSongById";
import { openLink, useLaunchParams } from "@telegram-apps/sdk-react";
import { Avatar, Image, Text, Card, Cell, Skeleton, Spinner, Subheadline, Button, Caption, InlineButtons } from "@telegram-apps/telegram-ui";
import React from "react";
import './style.css'
import Icon from "../Icon/Icon";
import { InlineButtonsItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/InlineButtons/components/InlineButtonsItem/InlineButtonsItem";

interface InfoCardProps {
    id?: string
}

export default function InfoCard({ id }: InfoCardProps) {
    const [song, setSong] = useState<Song | null>(null);
    const [startId, setStartId] = useState<string>('');
    const launchParams = useLaunchParams();

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
    if (!song) {
        return (
            <Spinner size={"l"} />
        )
    }
    return (
        <div style={{ width: '100vw', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div className="card">
                <Image
                    size={96}
                    style={{ marginRight: 0.8 + 'rem' }}
                    src={song.artImage}
                />
                <div>
                    {/* <Caption style={{ color: 'var(--tgui--hint_color)', width: 12 + 'rem' }}>
                        {song.date}
                    </Caption> <br /> */}
                    <Text weight="1">
                        {song.title}
                    </Text>
                    <br />
                    <Caption style={{ color: 'var(--tgui--hint_color)', width: 12 + 'rem' }}>
                        {song.artist}
                    </Caption>
                </div>
            </div>
            <Button
                style={{ marginTop: 0.8 + 'rem' }}
                size="s"
                className="button"
                mode="bezeled"
                onClick={() => {
                    if (openLink.isAvailable()) {
                        openLink(song.geniusUrl, {
                            tryInstantView: true,
                        });
                    }
                }}
            >
                Отправить в чат
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
            </Button>
        </div>
    );
}
