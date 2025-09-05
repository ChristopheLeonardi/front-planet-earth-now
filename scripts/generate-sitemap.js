import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// Équivalent de __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://planetearthnow.org';
const API_URL = 'https://admin.planetearthnow.org/api/actions?locale=fr&pagination[pageSize]=100';

const staticRoutes = [
  '/',
  '/qui-sommes-nous',
  '/nos-actions',
  '/contact',
  '/custom-flag',
  '/preview',
  '/mentions-legales',
  '/evenements'
];

try {
  const res = await axios.get(API_URL);
  const actions = res.data.data;

  const urls = staticRoutes.map(route => `${BASE_URL}${route}`);
  const actionUrls = actions.map(action => {
    const slug = action.attributes.slug.replace(/-(en|es)$/, '');
    return `${BASE_URL}/nos-actions/${slug}`;
  });

  const allUrls = [...urls, ...actionUrls];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `<url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemapContent, 'utf8');

  console.log('✅ Sitemap généré avec succès : public/sitemap.xml');
} catch (err) {
  console.error('❌ Erreur lors de la génération du sitemap :', err.message);
}
