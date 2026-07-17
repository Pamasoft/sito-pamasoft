# Pamasoft Website

Sito web ufficiale di Pamasoft - Società di software specializzata in cloud computing, intelligenza artificiale, blockchain, integrazioni e cybersecurity.

## 🚀 Tecnologie Utilizzate

- **11ty (Eleventy)** - Static Site Generator
- **Nunjucks** - Template Engine
- **Bootstrap 5** - CSS Framework
- **GSAP** - Animazioni
- **Swiper** - Slider e carousel
- **Font Awesome** - Icone

## 📁 Struttura del Progetto

```
├── src/                    # Sorgenti del sito
│   ├── _includes/          # Template componenti (header, footer)
│   ├── _layouts/           # Layout base
│   ├── assets/             # CSS, JS, immagini
│   ├── blog/               # Articoli del blog (Markdown)
│   ├── case-studies/       # Case studies (Markdown)
│   ├── servizi/            # Pagine dei servizi
│   ├── index.njk           # Homepage
│   ├── chi-siamo.njk       # Chi siamo
│   └── contatti.njk        # Contatti
├── _site/                  # Output del build
├── .eleventy.js            # Configurazione 11ty
├── package.json            # Dipendenze Node.js
└── netlify.toml            # Configurazione Netlify
```

## 🛠️ Sviluppo Locale

### Prerequisiti
- Node.js 18+
- npm

### Installazione
```bash
npm install
```

### Avvio Server di Sviluppo
```bash
npm run dev
```
Il sito sarà disponibile su `http://localhost:8080`

### Build di Produzione
```bash
npm run build
```

## 📝 Gestione Contenuti

### Pagine Statiche
Le pagine statiche sono create con template Nunjucks (`.njk`) nella cartella `src/`.

### Blog
Gli articoli del blog sono scritti in Markdown nella cartella `src/blog/` con front matter:

```markdown
---
title: "Titolo Articolo"
description: "Descrizione per SEO"
date: 2024-01-15
author: "Nome Autore"
tags: ["cloud", "ai", "blockchain"]
---

Contenuto dell'articolo...
```

### Case Studies
I case studies sono in Markdown nella cartella `src/case-studies/` con struttura simile al blog.

## 🎨 Personalizzazione

### Header e Footer
Modificare i file:
- `src/_includes/header.njk`
- `src/_includes/footer.njk`

### Stili CSS
I file CSS si trovano in `src/assets/css/`:
- `style.css` - Stili principali
- `responsive.css` - Media queries
- `bootstrap.min.css` - Framework Bootstrap

### JavaScript
I file JavaScript si trovano in `src/assets/js/`:
- `theme-custom.js` - Script personalizzati
- `form1.js` - Gestione form contatti

## 🚀 Deploy

### Netlify (Raccomandato)
1. Collega il repository GitHub a Netlify
2. Impostazioni build:
   - Build command: `npm run build`
   - Publish directory: `_site`
3. Il deploy avverrà automaticamente ad ogni push

### Deploy Manuale
```bash
npm run build
# Carica il contenuto della cartella _site sul server
```

## 📊 SEO e Performance

- Meta tags ottimizzati per ogni pagina
- Structured data Schema.org
- Open Graph e Twitter Cards
- Lazy loading immagini
- Minificazione CSS/JS automatica
- Sitemap.xml generata automaticamente

## 🔧 Configurazione

### Modifica Informazioni Azienda
Aggiorna le informazioni in:
- `src/_layouts/base.njk` - Meta tags e structured data
- `src/_includes/footer.njk` - Informazioni contatto
- `src/_includes/header.njk` - Menu e contatti

### Aggiungere Nuove Pagine
1. Crea un nuovo file `.njk` nella cartella appropriata
2. Aggiungi il front matter con title, description, etc.
3. Aggiorna i menu in `src/_includes/header.njk`

## 📱 Responsive Design

Il sito è completamente responsive e ottimizzato per:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔒 Sicurezza

- Headers di sicurezza configurati in `netlify.toml`
- Form protection tramite Netlify Forms
- Validazione lato client e server per i form

## 📈 Analytics

Per aggiungere Google Analytics, modificare `src/_layouts/base.njk` e inserire il codice di tracking prima del tag `</head>`.

## 🆘 Supporto

Per problemi o domande:
- Email: info@pamasoft.com
- Telefono: +39 012 345 6789

## 📄 Licenza

© 2024 Pamasoft. Tutti i diritti riservati.
