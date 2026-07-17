import { site } from './site';

/** Asset brand serviti dal CDN/sito in produzione — non copiare in repo locale. */
export const assets = {
  logo: `${site.url}/assets/images/logo-blu.png`,
  favicon: `${site.url}/assets/images/pamasoft-favicon.png`,
} as const;
