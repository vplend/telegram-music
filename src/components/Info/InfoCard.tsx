import { useEffect, useState } from "react";
import { getSongById, Song } from "@/lib/getSongById";
import {useLaunchParams} from "@telegram-apps/sdk-react";
import {Card} from "@telegram-apps/telegram-ui";
import {CardChip} from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardChip/CardChip";
import {CardCell} from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell";
import React from "react";

export default function InfoCard() {
    const [song, setSong] = useState<Song | null>(null); // ✅ тип указан
    const [id, setId] = useState<string>('');
    const launchParams = useLaunchParams();

    useEffect(() => {
        if (typeof window !== "undefined" && launchParams?.tgWebAppData?.user?.id) {
            setId(String(launchParams.tgWebAppData.start_param));
        }
    }, [launchParams]);

    useEffect(() => {
        getSongById(id).then(setSong);
    }, [id]);

    if (!song) return (
     <div>
        фыв
     </div>
    );
    return (
        <div>
            <Card type="ambient">
                < React.Fragment key=".0">
                    <CardChip readOnly>
                        {song.date}
                    </CardChip>
                    <img
                        alt="Dog"
                        src={song.artImage}
                        style={{
                            display: 'block',
                            height: 300,
                            objectFit: 'cover',
                            width: 300
                        }}
                    />
                    <CardCell
                        readOnly
                        subtitle={song.artist}
                    >
                        {song.title}
                    </CardCell>
                </React.Fragment>
            </Card>
        </div>
    );
}
