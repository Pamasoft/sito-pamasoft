import { site } from '../config/site';
import type { Lang } from '../data/routes';

/** Open Graph images (raster, so every network shows them). */
const OG_RASTER_BY_SLUG: Record<string, string> = {
  cloudstay: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  cloudsuite: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  cloudpos: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'pamasoft-healthcare': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  posway: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'virtual-clinic': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  spoortal: 'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  playten: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  cloudreviews: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
};

export const productOgImage = (slug: string) => OG_RASTER_BY_SLUG[slug] ?? `${site.url}/assets/images/logo-blu.png`;

/** Meta description ~155 chars for SERP snippets */
export function clampDescription(raw: string): string {
  const s = raw.replace(/\s+/g, ' ').trim();
  if (s.length <= 155) return s;
  const cut = s.slice(0, 152);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

const abs = (path: string) => (path.startsWith('http') ? path : `${site.url}${path}`);

const provider = {
  '@type': 'Organization',
  name: 'Pamasoft',
  url: site.url,
  logo: `${site.url}/assets/images/logo-blu.png`,
};

export interface ProductSeoInput {
  name: string;
  description: string;
  path: string;
  lang: Lang;
  slug: string;
  appUrl?: string;
  features?: string[];
  audience?: string[];
  /** Used for the CloudPos business-type pages, which describe a configuration of CloudPos */
  isPartOfPath?: string;
}

/** SoftwareApplication + WebPage for product pages (including the CloudPos hub and its business-type pages). */
export function buildProductStructuredData(o: ProductSeoInput) {
  const pageUrl = abs(o.path);
  const softwareId = `${pageUrl}#software`;
  const inLanguage = o.lang === 'en' ? 'en' : 'it';
  const app: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': softwareId,
    name: o.name,
    description: o.description,
    url: pageUrl,
    image: productOgImage(o.slug),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage,
    provider,
    publisher: provider,
  };
  if (o.features?.length) app.featureList = o.features.join(', ');
  if (o.audience?.length) app.audience = { '@type': 'Audience', audienceType: o.audience.join(', ') };
  if (o.appUrl) app.sameAs = [o.appUrl];
  if (o.isPartOfPath) app.isPartOf = { '@id': `${abs(o.isPartOfPath)}#software` };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${o.name} | Pamasoft`,
    description: clampDescription(o.description),
    inLanguage,
    isPartOf: { '@type': 'WebSite', name: 'Pamasoft', url: site.url },
    about: { '@id': softwareId },
  };
  return [app, webPage];
}

const strip = (html: string) => html.replace(/<[^>]+>/g, '');

export function buildFaqStructuredData(items: [string, string][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([q, a]) => ({
      '@type': 'Question',
      name: strip(q),
      acceptedAnswer: { '@type': 'Answer', text: strip(a) },
    })),
  };
}

export function buildServiceStructuredData(o: { name: string; description: string; path: string; lang: Lang; offers: string[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: o.name,
    serviceType: o.name,
    description: o.description,
    url: abs(o.path),
    inLanguage: o.lang === 'en' ? 'en' : 'it',
    provider: { '@type': 'Organization', name: 'Pamasoft', url: site.url },
    areaServed: { '@type': 'Country', name: 'Italy' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: o.name,
      itemListElement: o.offers.map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
    },
  };
}

export function buildItemList(name: string, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: abs(p.path) })),
  };
}
