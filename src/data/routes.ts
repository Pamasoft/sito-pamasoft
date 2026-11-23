import type { Locale } from '../config/site';

export type Lang = Locale;

export const CALENDLY = 'https://calendly.com/pamasoft/30min';
export const EMAIL = 'info@pamasoft.com';
export const LINKEDIN = 'https://www.linkedin.com/company/pamasoft';
export const X_URL = 'https://x.com/pamasoft';

const PAGES = {
  home: ['/', '/en/'],
  products: ['/prodotti/', '/en/prodotti/'],
  services: ['/servizi/', '/en/services/'],
  industry: ['/industry/', '/en/industry/'],
  about: ['/chi-siamo/', '/en/about/'],
  contact: ['/contatti/', '/en/contact/'],
  privacy: ['/privacy-policy/', '/en/privacy-policy/'],
  cookie: ['/cookie-policy/', '/en/cookie-policy/'],
  terms: ['/termini-servizio/', '/en/terms-of-service/'],
  blog: ['/blog/', '/en/blog/'],
} as const;

export type PageKey = keyof typeof PAGES;

export const url = (lang: Lang, key: PageKey) => PAGES[key][lang === 'en' ? 1 : 0];

export const productUrl = (lang: Lang, slug: string) =>
  lang === 'en' ? `/en/prodotti/${slug}/` : `/prodotti/${slug}/`;

/** Service keys are the Italian slugs; EN slugs are the existing English ones. */
export const SERVICE_SLUGS: Record<string, string> = {
  'intelligenza-artificiale': 'artificial-intelligence',
  'cloud-computing': 'cloud-computing',
  blockchain: 'blockchain',
  cybersecurity: 'cybersecurity',
  'sviluppo-applicazioni-web': 'web-application-development',
};

export const serviceUrl = (lang: Lang, key: string) =>
  lang === 'en' ? `/en/services/${SERVICE_SLUGS[key]}/` : `/servizi/${key}/`;

export const industryUrl = (lang: Lang, key: string) =>
  lang === 'en' ? `/en/industry/${key}/` : `/industry/${key}/`;

/** CloudPos business-type pages: key → [IT slug, EN slug] */
export const CP_SLUGS: Record<string, [string, string]> = {
  retail: ['negozi', 'retail'],
  ristorazione: ['ristorazione', 'restaurants'],
  beauty: ['beauty', 'beauty'],
  fitness: ['fitness', 'fitness'],
  servizi: ['servizi', 'services'],
};

export const cpUrl = (lang: Lang, key: string) =>
  lang === 'en'
    ? `/en/prodotti/cloudpos/${CP_SLUGS[key][1]}/`
    : `/prodotti/cloudpos/${CP_SLUGS[key][0]}/`;
