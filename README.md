# Pamasoft Website (Astro)

Sito ufficiale [pamasoft.com](https://pamasoft.com) — static site con Astro, i18n IT/EN, Content Collections per prodotti.

## Sviluppo locale

```sh
npm install
npm run dev
```

Apri http://localhost:4321/

```sh
npm run build    # genera dist/
npm run preview  # anteprima della build
```

## Deploy Netlify (da GitHub)

Il file `netlify.toml` contiene già la configurazione:

| Impostazione | Valore |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22` |

Flusso: push su `main` → Netlify build automatico → publish di `dist/`.
