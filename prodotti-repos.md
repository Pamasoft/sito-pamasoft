# Prodotti Pamasoft — repository sorgente

Mappa usata per arricchire le landing `/prodotti/*` confrontando funzionalità reali delle webapp.

| Prodotto | Slug sito | Dominio | Repo locale |
|---|---|---|---|
| Pamasoft CloudStay | `cloudstay` | https://cloudstay.pamasoft.com | `c:\Github\booking-engine` |
| Pamasoft CloudSuite | `cloudsuite` | https://cloudsuite.pamasoft.com | `c:\Github\pamasoft-erp` |
| Pamasoft CloudPos | `cloudpos` | https://square.pamasoft.com | `c:\Github\square-clone` |
| Pamasoft Healthcare | `pamasoft-healthcare` | https://healthcare.pamasoft.com | `c:\Github\pamasoft-healthcare` |
| Posway | `posway` | https://posway.io | `c:\Github\posway` |
| SPOORTAL | `spoortal` | https://spoortal.it | `c:\Github\sport-asd` |
| Playten | `playten` | https://playten.net | `c:\Github\playten` |
| Virtual Clinic | `virtual-clinic` | https://virtualclinic.it | `c:\Github\virtual-clinic` |

## Note

- Landing sito: `src/content/prodotti/*-{it,en}.md`
- Template: `src/components/ProductDetail.astro`
- Copy commerciale: niente gergo interno (Stripe, JWT, path `/app/*`, ecc.)
- Posway: non menzionare mai Stripe / Stripe Connect (white label)
- CloudStay: landing arricchita (2026-09) da `booking-engine`
- CloudSuite, CloudPos, Healthcare, Posway, SPOORTAL, Playten, Virtual Clinic: landing arricchite (2026-09-17) da repo in tabella
