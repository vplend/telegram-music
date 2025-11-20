import { useEffect, useState } from "react";
import { getSongById, Song } from "@/lib/getSongById";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { Card, Skeleton, Spinner } from "@telegram-apps/telegram-ui";
import { CardChip } from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardChip/CardChip";
import { CardCell } from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell";
import React from "react";

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
            <Spinner size={"s"}/>
        )
    }
    return (
        <div>
            <Card type="ambient">
                < React.Fragment key=".0">
                    <CardChip readOnly>
                        {song?.date ? song?.date : 'Дата не найдена'}
                    </CardChip>
                    <img
                        alt="Dog"
                        src={song?.artImage}
                        style={{
                            display: 'block',
                            height: 300,
                            objectFit: 'cover',
                            width: 300
                        }}
                    />
                    <CardCell
                        readOnly
                        subtitle={song?.artist}
                    >
                        {song?.title}
                    </CardCell>
                </React.Fragment>
            </Card>
        </div>
    );
}
