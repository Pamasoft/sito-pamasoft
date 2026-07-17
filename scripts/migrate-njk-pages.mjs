#!/usr/bin/env node
/**
 * Converte pagine Nunjucks (Eleventy) in pagine Astro con BaseLayout.
 * Uso: node scripts/migrate-njk-pages.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, 'pamasoft-newsite', 'src');

const IT_ROUTES = {
  'it/index.njk': 'pages/index.astro',
  'it/chi-siamo.njk': 'pages/chi-siamo/index.astro',
  'it/contatti.njk': 'pages/contatti/index.astro',
  'it/servizi.njk': 'pages/servizi/index.astro',
  'it/industry.njk': 'pages/industry/index.astro',
  'it/privacy-policy.njk': 'pages/privacy-policy/index.astro',
  'it/cookie-policy.njk': 'pages/cookie-policy/index.astro',
  'it/termini-servizio.njk': 'pages/termini-servizio/index.astro',
  'it/servizi/cloud-computing.njk': 'pages/servizi/cloud-computing/index.astro',
  'it/servizi/intelligenza-artificiale.njk': 'pages/servizi/intelligenza-artificiale/index.astro',
  'it/servizi/blockchain.njk': 'pages/servizi/blockchain/index.astro',
  'it/servizi/cybersecurity.njk': 'pages/servizi/cybersecurity/index.astro',
  'it/servizi/sviluppo-applicazioni-web.njk': 'pages/servizi/sviluppo-applicazioni-web/index.astro',
  'it/industry/healthcare.njk': 'pages/industry/healthcare/index.astro',
  'it/industry/retail.njk': 'pages/industry/retail/index.astro',
  'it/industry/manufacturing.njk': 'pages/industry/manufacturing/index.astro',
  'it/industry/travel-logistics.njk': 'pages/industry/travel-logistics/index.astro',
  'it/industry/hospitality.njk': 'pages/industry/hospitality/index.astro',
  'it/industry/media-entertainment.njk': 'pages/industry/media-entertainment/index.astro',
};

const EN_ROUTES = {
  'en/index.njk': 'pages/en/index.astro',
  'en/about.njk': 'pages/en/about/index.astro',
  'en/contact.njk': 'pages/en/contact/index.astro',
  'en/services.njk': 'pages/en/services/index.astro',
  'en/industry.njk': 'pages/en/industry/index.astro',
  'en/privacy-policy.njk': 'pages/en/privacy-policy/index.astro',
  'en/cookie-policy.njk': 'pages/en/cookie-policy/index.astro',
  'en/terms-of-service.njk': 'pages/en/terms-of-service/index.astro',
  'en/services/cloud-computing.njk': 'pages/en/services/cloud-computing/index.astro',
  'en/services/artificial-intelligence.njk': 'pages/en/services/artificial-intelligence/index.astro',
  'en/services/blockchain.njk': 'pages/en/services/blockchain/index.astro',
  'en/services/cybersecurity.njk': 'pages/en/services/cybersecurity/index.astro',
  'en/services/web-application-development.njk': 'pages/en/services/web-application-development/index.astro',
  'en/industry/healthcare.njk': 'pages/en/industry/healthcare/index.astro',
  'en/industry/retail.njk': 'pages/en/industry/retail/index.astro',
  'en/industry/manufacturing.njk': 'pages/en/industry/manufacturing/index.astro',
  'en/industry/travel-logistics.njk': 'pages/en/industry/travel-logistics/index.astro',
  'en/industry/hospitality.njk': 'pages/en/industry/hospitality/index.astro',
  'en/industry/media-entertainment.njk': 'pages/en/industry/media-entertainment/index.astro',
};

function parseFrontmatter(raw) {
  const { data, content } = matter(raw);
  return { data, body: content.trim() };
}

function getPagePathFromOutput(outputPath) {
  const relative = relativePageDir(outputPath);
  if (!relative) return '/';
  return `/${relative}/`;
}

function relativePageDir(outputPath) {
  return outputPath
    .replace(/^pages\//, '')
    .replace(/^index\.astro$/, '')
    .replace(/\/index\.astro$/, '');
}

function layoutImportDepth(outputPath) {
  const relative = relativePageDir(outputPath);
  const depth = (relative ? relative.split('/').filter(Boolean).length : 0) + 1;
  return '../'.repeat(depth) + 'layouts/BaseLayout.astro';
}

function contentImportPath(outputPath, slug) {
  const relative = relativePageDir(outputPath);
  const depth = (relative ? relative.split('/').filter(Boolean).length : 0) + 1;
  return '../'.repeat(depth) + `components/content/${slug}.astro`;
}

function slugFromRoute(routeKey) {
  return routeKey.replace(/\//g, '-').replace(/\.njk$/, '');
}

function escapeForTemplate(value) {
  return value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function generatePage(routeKey, outputPath, data, body, lang) {
  const slug = slugFromRoute(routeKey);
  const pagePath = getPagePathFromOutput(outputPath);
  const layoutImport = layoutImportDepth(outputPath);
  const contentImport = contentImportPath(outputPath, slug);

  const props = [
    `title={\`${escapeForTemplate(data.title || '')}\`}`,
    `description={\`${escapeForTemplate(data.description || '')}\`}`,
    `path="${pagePath}"`,
    `lang="${lang}"`,
  ];

  if (data.keywords) props.push(`keywords={\`${escapeForTemplate(data.keywords)}\`}`);
  if (data.pageClass) props.push(`pageClass="${data.pageClass}"`);
  if (data.ogImage) props.push(`ogImage="${data.ogImage}"`);
  if (data.breadcrumbs?.length) props.push(`breadcrumbs={${JSON.stringify(data.breadcrumbs)}}`);

  let structuredDataBlock = '';
  if (data.structuredData) {
    try {
      const parsed =
        typeof data.structuredData === 'string' ? JSON.parse(data.structuredData) : data.structuredData;
      structuredDataBlock = `const structuredData = ${JSON.stringify(parsed, null, 2)};`;
      props.push('structuredData={structuredData}');
    } catch {
      console.warn(`  ⚠ structuredData non parsabile in ${routeKey}`);
    }
  }

  return `---
import BaseLayout from '${layoutImport}';
import Content from '${contentImport}';
${structuredDataBlock}
---

<BaseLayout
  ${props.join('\n  ')}
>
  <Content />
</BaseLayout>
`;
}

function generateContent(body) {
  return `---\n---\n${body}\n`;
}

const SKIP_CONTENT_SLUGS = new Set([
  'it-industry-hospitality',
  'en-industry-hospitality',
  'it-industry-healthcare',
  'en-industry-healthcare',
  'it-industry-retail',
  'en-industry-retail',
]);

function migrate(routes, lang, skip = new Set()) {
  let count = 0;
  for (const [routeKey, outputPath] of Object.entries(routes)) {
    if (skip.has(outputPath)) continue;

    const sourcePath = path.join(sourceRoot, routeKey.replace(/\//g, path.sep));
    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠ File non trovato: ${sourcePath}`);
      continue;
    }

    const raw = fs.readFileSync(sourcePath, 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const pageData = { ...data };
    delete pageData.layout;
    const slug = slugFromRoute(routeKey);

    const contentOut = path.join(root, 'src', 'components', 'content', `${slug}.astro`);
    const pageOut = path.join(root, 'src', outputPath);

    fs.mkdirSync(path.dirname(contentOut), { recursive: true });
    fs.mkdirSync(path.dirname(pageOut), { recursive: true });

    if (!SKIP_CONTENT_SLUGS.has(slug)) {
      fs.writeFileSync(contentOut, generateContent(body), 'utf8');
    }
    fs.writeFileSync(pageOut, generatePage(routeKey, outputPath, pageData, body, lang), 'utf8');
    count++;
    console.log(`✓ ${routeKey} → ${outputPath}`);
  }
  return count;
}

const skip = new Set();
const itCount = migrate(IT_ROUTES, 'it', skip);
const enCount = migrate(EN_ROUTES, 'en');
console.log(`\nMigrate completata: ${itCount} pagine IT, ${enCount} pagine EN`);
