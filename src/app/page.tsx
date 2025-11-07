'use client';

import { useTranslations } from 'next-intl';

import { Page } from '@/components/Page';
import Search from '@/components/Search/Search';
import Header from "@/components/Header/Header";

export default function Home() {
  const t = useTranslations('i18n');

  return (
      <Page back={false}>
        <Search/>
      </Page>
  );
}
