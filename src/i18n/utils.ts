import { site, type Locale } from '../config/site';

export function getAlternateUrl(path: string, targetLang: Locale): string {
  const currentPath = path.startsWith('/') ? path : `/${path}`;

  if (targetLang === 'en') {
    if (currentPath === '/') return '/en/';
    return `/en${currentPath}`;
  }

  if (currentPath.startsWith('/en')) {
    const stripped = currentPath.replace(/^\/en/, '') || '/';
    return stripped === '/' ? '/' : stripped;
  }

  return currentPath;
}

export function getCanonicalUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${site.url}${normalized}`;
}

export function detectLocale(path: string): Locale {
  return path.startsWith('/en') ? 'en' : site.defaultLocale;
}
