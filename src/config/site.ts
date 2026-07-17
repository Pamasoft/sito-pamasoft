export const site = {
  name: 'Pamasoft',
  url: 'https://pamasoft.com',
  defaultLocale: 'it' as const,
  locales: {
    it: { code: 'it', label: 'Italiano', hrefLang: 'it', pathPrefix: '' },
    en: { code: 'en', label: 'English', hrefLang: 'en', pathPrefix: '/en' },
  },
} as const;

export type Locale = keyof typeof site.locales;
