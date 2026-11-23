# Prodotti Pamasoft — repository sorgente

Mappa usata per arricchire le landing `/prodotti/*` confrontando funzionalità reali delle webapp.

| Prodotto | Slug sito | Dominio | Repo locale |
|---|---|---|---|
| Pamasoft CloudStay | `cloudstay` | https://cloudstay.pamasoft.com | `c:\Github\booking-engine` |
| Pamasoft CloudSuite | `cloudsuite` | https://cloudsuite.pamasoft.com | `c:\Github\pamasoft-erp` |
| Pamasoft CloudPos | `cloudpos` | https://cloudpos.pamasoft.com | `c:\Github\square-clone` |
| Pamasoft Healthcare | `pamasoft-healthcare` | https://healthcare.pamasoft.com | `c:\Github\pamasoft-healthcare` |
| Posway | `posway` | https://posway.io | `c:\Github\posway` |
| SPOORTAL | `spoortal` | https://spoortal.it | `c:\Github\sport-asd` |
| Playten | `playten` | https://playten.net | `c:\Github\playten` |
| Virtual Clinic | `virtual-clinic` | https://virtualclinic.it | `c:\Github\virtual-clinic` |
| Pamasoft CloudReviews | `cloudreviews` | app: https://cloudreviews.pamasoft.com/register (no marketing site) | `c:\Github\reviews-ai` |

## Note

- Contenuti sito (dal restyling 2026-11): `src/data/products.ts`, `src/data/cloudstay.ts`, `src/data/cloudpos-{it,en}.ts`
- Viste: `src/views/*View.astro`; le vecchie landing markdown restano nel tag git `legacy-2026-11-23`
- Copy commerciale: niente gergo interno (Stripe, JWT, path `/app/*`, ecc.)
- Posway: non menzionare mai Stripe / Stripe Connect (white label)
- CloudStay: landing arricchita (2026-09) da `booking-engine`
- CloudSuite, CloudPos, Healthcare, Posway, SPOORTAL, Playten, Virtual Clinic: landing arricchite (2026-09-17) da repo in tabella
