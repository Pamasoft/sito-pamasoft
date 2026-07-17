# Prompt per Cursor — Migrazione pamasoft.com ad Astro con sezione Prodotti

Incolla questo prompt in Cursor come istruzione di progetto (o mettilo in un file `CONTEXT.md` nella root del repo così l'agente lo rilegge sempre).

---

## 1. Contesto

Sto migrando il sito **pamasoft.com** (attualmente HTML/CSS/JS statico, deployato su Netlify) verso **Astro**, mantenendo lo hosting su Netlify e il design attuale identico (pixel-perfect), ma riorganizzando il sito in componenti riusabili per poter aggiungere facilmente nuove pagine prodotto e articoli blog in futuro.

**Regola guida per tutta la migrazione: nessuna reinterpretazione del design.** Il design non va "ridisegnato" né migliorato in questa fase: va estratto 1:1 dal codice sorgente esistente (che trovi nella cartella allegata) e trasformato in componenti Astro. Ogni pagina risultante deve essere visivamente indistinguibile dall'originale (stessi font, spaziature, colori, breakpoint, animazioni/JS come lo switch lingua IT/EN).

## 2. Stato attuale

- File sorgenti HTML/CSS/JS statici disponibili in locale nella cartella **`pamasoft-newsite`** (non ancora versionati con Git)
- Hosting: Netlify
- Sito bilingue IT/EN con language switcher
- Metadata già presenti e curati: canonical, meta description, Open Graph, Twitter Card, robots — vanno preservati e resi *dinamici/templatizzati* (oggi sono statici per pagina)
- Sezioni attuali: Home, Chi Siamo, Servizi (+ sotto-pagine), Industry (+ sotto-pagine), Contatti

## 3. Stack target

- **Astro** (static output, nessun SSR necessario)
- **Content Collections** di Astro per due tipi di contenuto: `prodotti` e `blog`
- **i18n integrato di Astro** per IT/EN (routing tipo `/it/...` e `/en/...`, con IT come lingua di default sulla root se possibile, da valutare in base alla struttura URL attuale per non rompere URL già indicizzati)
- Deploy continuo su Netlify collegato a repo Git (vedi punto 9)

## 4. Prima cosa da fare: setup repository

I file sorgenti sono nella cartella locale **`pamasoft-newsite`**, non ancora in Git. Prima di qualunque refactor:

1. Inizializza un repository Git nella cartella `pamasoft-newsite` (o, se si preferisce partire con un progetto Astro pulito in una cartella separata, importare/copiare al suo interno tutti gli asset — HTML, CSS, JS, immagini — presenti in `pamasoft-newsite` prima di iniziare il refactor, in modo da non perdere nulla del sito originale)
2. Crea `.gitignore` appropriato (node_modules, dist, .env, ecc.)
3. Fai il primo commit dello stato attuale "as-is" (snapshot del sito originale) — questo ci serve come riferimento per il visual diff più avanti
4. Crea un repo remoto (GitHub) e collega Netlify al repo per deploy automatico ad ogni push, invece del deploy manuale attuale

## 5. Architettura dell'informazione (sitemap target)

```
/                          Home
/chi-siamo/
/servizi/
  /servizi/cloud-computing/
  /servizi/intelligenza-artificiale/
  /servizi/blockchain/
  /servizi/cybersecurity/
  /servizi/sviluppo-applicazioni-web/
/prodotti/                 NUOVA sezione — indice di tutti i SaaS Pamasoft
  /prodotti/nome-prodotto/ NUOVA — una pagina per ogni prodotto (contenuto fornito da me)
/industry/                 mantenuta
  /industry/healthcare/
  /industry/retail/
  /industry/manufacturing/
  /industry/travel-logistics/
  /industry/hospitality/
  /industry/media-entertainment/
/blog/                     NUOVA sezione
  /blog/slug-articolo/
/contatti/
```

Ogni versione linguistica replica questa struttura sotto `/en/...`.

**Cross-linking richiesto:**
- Ogni pagina `/prodotti/x/` deve poter referenziare 1+ pagine industry correlate (e viceversa) tramite un campo nello schema (vedi punto 6)
- I prodotti con **dominio esterno proprio** (es. brand autonomi tipo Spoortal) vanno mostrati nella pagina indice `/prodotti/` con un badge/link "Vai al sito" verso il dominio esterno, MA la pagina `/prodotti/nome/` dentro pamasoft.com resta comunque una landing/scheda propria con contenuto originale (non un semplice redirect), per continuare a costruire autorità tematica su pamasoft.com. Il dominio esterno, a sua volta, deve avere nel footer un link "Un prodotto Pamasoft" verso pamasoft.com (questo lo gestirò separatamente sui singoli repo di quei prodotti).

## 6. Content Collections — schema

### Collection `prodotti`

```ts
{
  nome: string,
  slug: string,
  tagline: string,           // frase breve sotto il nome
  descrizione: string,       // per meta description e per la card nell'indice
  logo: image(),
  screenshot: image(),
  dominioEsterno: string | null,   // es. "https://spoortal.it" se ha brand autonomo, altrimenti null
  brandAutonomo: boolean,
  ctaPrincipale: { label: string, url: string },  // es. link a registrazione/demo
  industryCorrelate: string[],    // slug delle industry collegate, per cross-link
  featureHighlights: { titolo: string, descrizione: string, icona?: string }[],
  pubblicato: boolean,
  lingua: "it" | "en"
}
```

### Collection `blog`

```ts
{
  titolo: string,
  slug: string,
  estratto: string,          // per meta description e anteprima card
  immagineCopertina: image(),
  autore: string,
  dataPubblicazione: date,
  dataAggiornamento: date | null,
  categoria: string,         // es. "Cloud", "AI", "Case Study", "Prodotto"
  prodottiCorrelati: string[],   // slug prodotti collegati
  tempoLettura: number,      // minuti, calcolabile automaticamente
  pubblicato: boolean,
  lingua: "it" | "en"
}
```

Il body di ciascun file (Markdown/MDX) è il contenuto della pagina.

## 7. Requisiti SEO tecnici (bloccanti, non opzionali)

- **Sitemap XML** generata automaticamente (`@astrojs/sitemap`), con voci separate per IT/EN
- **robots.txt** che permetta crawling completo e referenzi la sitemap
- **Canonical tag** su ogni pagina (self-referencing), con `hreflang` reciproci tra versione IT e EN della stessa pagina + `hreflang="x-default"`
- **Meta tag dinamici per pagina**: title, description, OG (title/description/image/type/url/locale), Twitter Card — generati da un componente `<SEO />` condiviso che riceve i dati dal frontmatter/collection, non hardcodati pagina per pagina
- **JSON-LD structured data**, uno per tipo di pagina:
  - Homepage → `Organization` (nome, logo, sameAs con social, address)
  - Pagine `/servizi/*` → `Service`
  - Pagine `/prodotti/*` → `SoftwareApplication` (o `Product` se più adatto), con `offers` se applicabile
  - Pagine `/blog/*` → `Article` (con `author`, `datePublished`, `dateModified`, `image`)
  - Tutte le pagine → `BreadcrumbList`
  - Dove presenti FAQ → `FAQPage`
- **Heading gerarchici corretti** (un solo `h1` per pagina, struttura logica h2/h3), niente heading usati solo per stile

## 8. Requisiti per "AI-friendliness" (citabilità da AI Overview / assistenti AI)

- File **`llms.txt`** nella root del sito con una sintesi strutturata di: chi è Pamasoft, cosa fa, elenco prodotti con una riga di descrizione ciascuno, link alle pagine principali
- Contenuto **leggibile senza esecuzione JS** (Astro static output lo garantisce di default: verificare che non ci siano sezioni di contenuto renderizzate solo via client-side JS)
- Paragrafi che aprono con la risposta/definizione diretta prima di espandere (utile sia per featured snippet sia per estrazione da parte di risposte AI)
- Dati fattuali coerenti e ripetuti in modo identico su tutte le pagine (nome legale, anno fondazione, sede) per rinforzare l'entità

## 9. Performance

- Immagini tramite `astro:assets` (ottimizzazione automatica, formati moderni, lazy loading di default tranne hero/LCP image)
- Font preload per i font critici above-the-fold
- Nessun framework JS pesante lato client: solo vanilla JS per interazioni leggere (switch lingua, menu mobile, eventuali carousel) già presenti nel sito originale

## 10. Piano di lavoro per Cursor (fasi in ordine)

1. Setup repo Git + Netlify continuous deployment (punto 4)
2. Inizializzazione progetto Astro, integrazioni: `@astrojs/sitemap`, i18n, image
3. Estrazione dei componenti condivisi dal sito originale: `Header`, `Footer`, `LanguageSwitcher`, `CTAButton`, `TrustLogos`, `ServiceCard`, `IndustryCard`, `Testimonial`, componente `<SEO />`
4. Migrazione pagina per pagina delle sezioni esistenti (Home, Chi Siamo, Servizi, Industry, Contatti) all'interno della nuova struttura a componenti, con **verifica screenshot diff** rispetto al sito originale (desktop + mobile) prima di considerare ogni pagina completata
5. Creazione schema Content Collections `prodotti` e `blog` (punto 6)
6. Creazione template pagina indice `/prodotti/` e pagina singolo prodotto `/prodotti/[slug]/`
7. Creazione template pagina indice `/blog/` e pagina singolo articolo `/blog/[slug]/`
8. Implementazione SEO tecnica completa (punto 7) e file AI-friendliness (punto 8)
9. Audit finale: Lighthouse (performance/SEO/accessibilità), validazione structured data (Rich Results Test), controllo hreflang, controllo sitemap
10. Deploy su Netlify e verifica in produzione

---

**Nota per l'agente:** i contenuti dei singoli prodotti e articoli blog verranno forniti successivamente, uno alla volta — non inventare contenuti prodotto/testi di marketing autonomamente. Costruisci la struttura, gli schema e i template pronti a ricevere quei contenuti.

**Flusso di lavoro per l'aggiunta di ogni prodotto:** per ciascun prodotto ti verrà fornito il path locale della cartella/repo del suo sito o della sua landing page esistente (dominio proprio o sottodominio). Per ogni path ricevuto:

1. Analizza il codice sorgente della landing esistente (contenuti, sezioni, screenshot/immagini, copy, CTA, eventuali dati tecnici come pricing o feature)
2. Se esiste una landing visitabile online, visionala anche live per cogliere eventuali elementi non evidenti dal solo codice (interazioni, stato di deploy, contenuti caricati dinamicamente)
3. Estrai le informazioni rilevanti e mappale nello schema della collection `prodotti` definito al punto 6 (nome, tagline, descrizione, feature highlights, CTA, dominio esterno se il brand resta autonomo, industry correlate — queste ultime da dedurre dal contenuto e da propormi se non ovvie)
4. Crea la pagina `/prodotti/[slug]/` (e la sua versione `/en/prodotti/[slug]/`) usando quei contenuti, senza inventare feature o claim non presenti nella fonte originale
5. Segnala eventuali contenuti mancanti o ambigui (es. CTA non chiara, assenza di descrizione breve) invece di riempirli con testo placeholder
