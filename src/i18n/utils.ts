import { site, type Locale } from '../config/site';

/** IT path (no /en) → EN path (with /en). Same-slug pages omitted (handled by prefix). */
const IT_TO_EN: Record<string, string> = {
  '/chi-siamo/': '/en/about/',
  '/contatti/': '/en/contact/',
  '/servizi/': '/en/services/',
  '/servizi/cloud-computing/': '/en/services/cloud-computing/',
  '/servizi/intelligenza-artificiale/': '/en/services/artificial-intelligence/',
  '/servizi/blockchain/': '/en/services/blockchain/',
  '/servizi/cybersecurity/': '/en/services/cybersecurity/',
  '/servizi/sviluppo-applicazioni-web/': '/en/services/web-application-development/',
  '/termini-servizio/': '/en/terms-of-service/',
};

const EN_TO_IT: Record<string, string> = Object.fromEntries(
  Object.entries(IT_TO_EN).map(([it, en]) => [en, it]),
);

function normalizePath(path: string): string {
  let p = path.startsWith('/') ? path : `/${path}`;
  if (!p.endsWith('/')) p = `${p}/`;
  if (p !== '/' && p.endsWith('//')) p = p.replace(/\/+$/, '/');
  return p;
}

export function getAlternateUrl(path: string, targetLang: Locale): string {
  const currentPath = normalizePath(path);

  if (targetLang === 'en') {
    if (currentPath === '/') return '/en/';
    if (IT_TO_EN[currentPath]) return IT_TO_EN[currentPath];
    if (currentPath.startsWith('/en/')) return currentPath;
    return `/en${currentPath}`;
  }

  // targetLang === 'it'
  if (currentPath === '/en/' || currentPath === '/en') return '/';
  if (EN_TO_IT[currentPath]) return EN_TO_IT[currentPath];
  if (currentPath.startsWith('/en/')) {
    const stripped = currentPath.replace(/^\/en/, '') || '/';
    return normalizePath(stripped);
  }
  return currentPath;
}

export function getCanonicalUrl(path: string): string {
  const normalized = normalizePath(path);
  // Home: site.url already without trailing path; prefer trailing slash
  if (normalized === '/') return `${site.url}/`;
  return `${site.url}${normalized}`;
}

export function detectLocale(path: string): Locale {
  return path.startsWith('/en') ? 'en' : site.defaultLocale;
}

/** For sitemap serialize: list of [itPath, enPath] pairs that differ by more than locale prefix */
export function getLocalePathPairs(): Array<[string, string]> {
  return Object.entries(IT_TO_EN);
}
