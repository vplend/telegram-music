'use client';

import { useTranslations } from 'next-intl';

import { Page } from '@/components/Page';
import Search from '@/components/Search/Search';
import Header from "@/components/Header/Header";
import InfoCard from "@/components/Info/InfoCard";

export default function Home() {
  const t = useTranslations('i18n');
  return (
      <Page back={false}>
            <div style={{width: 100+'vw', height: 100+'vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <InfoCard/>
            </div>
      </Page>
  );
}
