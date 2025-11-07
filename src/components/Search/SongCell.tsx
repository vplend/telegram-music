// SongCell.tsx
import { Button, Cell, Image, Info, Modal, Snackbar, Spinner, Caption, Text, Title } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import React, { useState } from "react";
import { openLink } from '@telegram-apps/sdk';

type SongCellProps = {
    image?: string;
    title?: string;
    artist?: string;
    url?: any;
    year?: string;
    onSend: () => Promise<void> | void;
};

const SongCell: React.FC<SongCellProps> = ({ image, title, artist, url, onSend, year }) => {
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [lyrics, setLyrics] = useState<string>('');
    const [lyricsLoading, setLyricsLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            setSnackbarVisible(false);
            await onSend();
        } finally {
            setLoading(false);
            setSnackbarVisible(true);
        }
    };

    console.log(lyrics)

    return (
        <Modal
            header={<ModalHeader></ModalHeader>}
            trigger={
                <Cell
                    before={<Image src={image} size={48} alt="cover"/>}
                    subtitle={artist}
                    after={
                        <Button size="s" onClick={handleClick} disabled={loading} style={{display: 'flex'}}>
                            {loading ? <Spinner size="s" className="spinner"/> : "Отправить"}
                            {snackbarVisible && <Snackbar onClose={() => {}}>{title} - {artist} отправлено в телеграм</Snackbar>}
                        </Button>
                    }
                >
                    {title}
                </Cell>
            }
        >
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div style={{
                    display: 'flex',
                    width: '90%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '1rem',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingBottom: '1rem',
                    }}>
                        <Image size={96} src={image} alt={`${title} - ${artist}`}/>
                        <Info
                            type="text"
                            style={{
                                marginLeft: "1rem",
                                textAlign: 'left',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <Caption style={{color: 'var(--tgui--hint_color)'}}>
                                {year}
                            </Caption>
                            <br/>
                            <Text caps={true} weight="1">
                                {title}
                            </Text>
                            <br/>
                            <Caption style={{color: 'var(--tgui--hint_color)'}}>
                                {artist}
                            </Caption>
                        </Info>
                    </div>
                    <Button
                        mode="gray"
                        size="s"
                        onClick = {() => {
                            if (openLink.isAvailable()) {
                                openLink(url, {
                                    tryInstantView: true,
                                });
                            }
                        }}
                    >
                        Открыть текст песни
                    </Button>

                </div>
            </div>
        </Modal>
    );
};

export default SongCell;