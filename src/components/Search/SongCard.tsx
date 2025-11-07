
// SongCard.tsx
// Карточка результата поиска песни
import React from "react";
import { Card } from '@telegram-apps/telegram-ui';
import { CardCell } from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell";
import { CardChip } from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardChip/CardChip";
import Image from "next/image";

type SongCardProps = {
  image?: string;
  title?: string;
  artist?: string;
  url?: string;
  onSend: () => void;
};

const SongCard: React.FC<SongCardProps> = ({ image, title, artist, url, onSend }) => (
  <Card className="w-[256px] m-4" key={url || title} style={{margin: 2+'rem'}}>
    <CardChip onClick={onSend} className="cursor-pointer">
      Скинуть
    </CardChip>
    {image && (
      <Image
        alt="image"
        src={image}
        style={{
          display: 'block',
          height: 256,
          objectFit: 'cover',
          width: 256
        }}
      />
    )}
    <CardCell readOnly subtitle={artist}>
      {title}
    </CardCell>
  </Card>
);

export default SongCard;
