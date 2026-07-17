import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cardSchema = z.object({
  titolo: z.string(),
  descrizione: z.string(),
  icona: z.string().optional(),
});

const ctaSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

const prodotti = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/prodotti',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      nome: z.string(),
      slug: z.string(),
      tagline: z.string(),
      descrizione: z.string(),
      logo: image(),
      screenshot: image(),
      heroImage: z.string().url().optional(),
      dominioEsterno: z.string().url().nullable().default(null),
      brandAutonomo: z.boolean().default(false),
      ctaPrincipale: ctaSchema,
      industryCorrelate: z.array(z.string()).default([]),
      pubblicoTarget: z.array(z.string()).default([]),
      vantaggi: z.array(cardSchema).default([]),
      featureHighlights: z.array(cardSchema).default([]),
      comeFunziona: z.array(cardSchema).default([]),
      pubblicato: z.boolean().default(false),
      lingua: z.enum(['it', 'en']),
    }),
});

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      titolo: z.string(),
      slug: z.string(),
      estratto: z.string(),
      immagineCopertina: image(),
      autore: z.string(),
      dataPubblicazione: z.coerce.date(),
      dataAggiornamento: z.coerce.date().nullable().default(null),
      categoria: z.string(),
      prodottiCorrelati: z.array(z.string()).default([]),
      tempoLettura: z.number().int().positive().optional(),
      pubblicato: z.boolean().default(false),
      lingua: z.enum(['it', 'en']),
    }),
});

export const collections = { prodotti, blog };
