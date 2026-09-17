import { site } from '../config/site';
import type { CollectionEntry } from 'astro:content';

type ProductData = CollectionEntry<'prodotti'>['data'];

export function absoluteAssetUrl(src: string | undefined | null): string {
  if (!src) return `${site.url}/assets/images/logo-blu.png`;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  return `${site.url}${src.startsWith('/') ? src : `/${src}`}`;
}

/** Meta description ~155 chars for SERP snippets */
export function metaDescriptionFromProduct(data: ProductData): string {
  const raw = `${data.tagline} ${data.descrizione}`.replace(/\s+/g, ' ').trim();
  if (raw.length <= 155) return raw;
  const cut = raw.slice(0, 152);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export function productKeywords(data: ProductData, lang: 'it' | 'en'): string {
  const industryMap: Record<string, { it: string; en: string }> = {
    healthcare: { it: 'sanità, healthcare, cliniche', en: 'healthcare, clinics' },
    retail: { it: 'retail, negozi, POS', en: 'retail, shops, POS' },
    manufacturing: { it: 'manifattura, PMI', en: 'manufacturing, SME' },
    hospitality: { it: 'hospitality, hotel, booking', en: 'hospitality, hotel, booking' },
    'travel-logistics': { it: 'logistica, travel', en: 'logistics, travel' },
    'media-entertainment': { it: 'sport, entertainment', en: 'sport, entertainment' },
  };

  const slugKeywords: Record<string, { it: string; en: string }> = {
    playten: {
      it: 'tennis, prenotazione campi tennis, circolo tennis, padel, pickleball',
      en: 'tennis, tennis court booking, tennis club, padel, pickleball',
    },
  };

  const industries = data.industryCorrelate
    .map((id) => industryMap[id]?.[lang] ?? id)
    .join(', ');

  const featureWords = data.featureHighlights
    .slice(0, 4)
    .map((f) => f.titolo)
    .join(', ');

  const base =
    lang === 'en'
      ? `Pamasoft, ${data.nome}, SaaS, cloud software`
      : `Pamasoft, ${data.nome}, SaaS, software cloud`;

  return [base, slugKeywords[data.slug]?.[lang], industries, featureWords]
    .filter(Boolean)
    .join(', ');
}

export function productPageTitle(data: ProductData, _lang: 'it' | 'en'): string {
  const clause = data.tagline.split(/[:.]/)[0].trim();
  const short = clause.length > 58 ? `${clause.slice(0, 55).replace(/\s+\S*$/, '').trim()}…` : clause;
  return `${data.nome} | ${short} | Pamasoft`;
}

/** Prefer raster images for Open Graph (some networks skip SVG). */
const OG_RASTER_BY_SLUG: Record<string, string> = {
  cloudstay:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  cloudsuite:
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  cloudpos:
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'pamasoft-healthcare':
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  posway:
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'virtual-clinic':
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  spoortal:
    'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  playten:
    'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
};

export function productOgImage(data: ProductData): string {
  const candidates = [data.heroImage, data.screenshot?.src, data.logo?.src].filter(Boolean) as string[];
  const raster = candidates.find((src) => /\.(jpe?g|png|webp|gif)(\?|$)/i.test(src));
  if (raster) return absoluteAssetUrl(raster);
  if (OG_RASTER_BY_SLUG[data.slug]) return OG_RASTER_BY_SLUG[data.slug];
  return absoluteAssetUrl(candidates[0]);
}

export function buildProductStructuredData(opts: {
  data: ProductData;
  lang: 'it' | 'en';
  pageUrl: string;
  metaDescription: string;
}) {
  const { data, lang, pageUrl, metaDescription } = opts;
  const image = productOgImage(data);
  const screenshot = absoluteAssetUrl(data.screenshot?.src);
  const logo = absoluteAssetUrl(data.logo?.src);
  const featureList = data.featureHighlights.map((f) => f.titolo).join(', ');
  const audience = data.pubblicoTarget.join(', ');

  const provider = {
    '@type': 'Organization',
    name: 'Pamasoft',
    url: site.url,
    logo: `${site.url}/assets/images/logo-blu.png`,
  };

  const softwareId = `${pageUrl}#software`;

  const softwareApplication: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': softwareId,
    name: data.nome,
    description: data.descrizione,
    url: pageUrl,
    image: [image, logo],
    screenshot,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: lang === 'en' ? 'en' : 'it',
    featureList,
    audience: audience
      ? {
          '@type': 'Audience',
          audienceType: audience,
        }
      : undefined,
    provider,
    author: provider,
    publisher: provider,
    offers: {
      '@type': 'Offer',
      url: data.ctaPrincipale.url,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      category: 'SaaS',
    },
  };

  if (data.dominioEsterno) {
    softwareApplication.sameAs = [data.dominioEsterno];
  }

  // Remove undefined keys
  Object.keys(softwareApplication).forEach((key) => {
    if (softwareApplication[key] === undefined) delete softwareApplication[key];
  });

  const webPage: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${data.nome} | Pamasoft`,
    description: metaDescription,
    inLanguage: lang === 'en' ? 'en' : 'it',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Pamasoft',
      url: site.url,
    },
    about: { '@id': softwareId },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: image,
    },
    breadcrumb: {
      '@id': `${pageUrl}#breadcrumb`,
    },
  };

  return [softwareApplication, webPage];
}
