// SongCell.tsx
import { Button, Cell, Image, Info, Modal, Snackbar, Spinner, Caption, Text, Title, IconButton } from "@telegram-apps/telegram-ui";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import React, { useState } from "react";
import { openLink } from '@telegram-apps/sdk';
import Icon from "../Icon/Icon";
import InfoCard from "../Info/InfoCard";

type SongCellProps = {
    image?: string;
    title?: string;
    artist?: string;
    url?: any;
    year?: string;
    onSend: () => Promise<void> | void;
    id?: string
};

const SongCell: React.FC<SongCellProps> = ({ image, title, artist, url, onSend, year, id }) => {
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);

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

    return (
        <div>
            <Cell
                interactiveAnimation="opacity"
                before={<Image src={image} size={48} alt="cover" />}
                subtitle={artist}
                after={
                    <div>
                        <Modal
                            header={<ModalHeader></ModalHeader>}
                            trigger={
                                <IconButton
                                    mode="plain"
                                    size="s"
                                >
                                    <Icon icon="ellipsis_vertical" width={24} height={24} />
                                    {snackbarVisible && <Snackbar onClose={() => { }}>{title} - {artist} отправлено в телеграм</Snackbar>}
                                </IconButton>
                            }
                        >
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

                                <InfoCard id={id} />
                            </div>
                        </Modal>

                        <IconButton
                            mode="plain"
                            size="s"
                        >
                            <Icon icon="add_circle_fill" width={24} height={24} />
                            {snackbarVisible && <Snackbar onClose={() => { }}>{title} - {artist} отправлено в телеграм</Snackbar>}
                        </IconButton>
                    </div>

                    // <Button size="s" onClick={handleClick} disabled={loading} style={{display: 'flex'}}>
                    //     {loading ? <Spinner size="s" className="spinner"/> : "Отправить"}
                    //     {snackbarVisible && <Snackbar onClose={() => {}}>{title} - {artist} отправлено в телеграм</Snackbar>}
                    // </Button>
                }
            >
                {title}
            </Cell>

        </div>

    );
};

export default SongCell;