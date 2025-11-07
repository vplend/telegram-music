import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts');

const nextConfig: NextConfig = {
    reactStrictMode: true,
    assetPrefix: process.env.NODE_ENV === 'production' ? 'https://music.plshchkv.ru' : '',
};

export default withNextIntl(nextConfig);