import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

export const collections = { blog };
