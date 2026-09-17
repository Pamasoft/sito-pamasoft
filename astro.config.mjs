// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { getAlternateUrl } from './src/i18n/utils.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://pamasoft.com',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/blog'),
      serialize(item) {
        const url = new URL(item.url);
        let pathname = url.pathname;
        if (!pathname.endsWith('/')) pathname += '/';

        const isEn = pathname.startsWith('/en/');
        const itPath = isEn ? getAlternateUrl(pathname, 'it') : pathname;
        const enPath = isEn ? pathname : getAlternateUrl(pathname, 'en');

        item.links = [
          { url: `https://pamasoft.com${itPath}`, lang: 'it' },
          { url: `https://pamasoft.com${enPath}`, lang: 'en' },
          { url: `https://pamasoft.com${itPath}`, lang: 'x-default' },
        ];
        return item;
      },
    }),
  ],
});
