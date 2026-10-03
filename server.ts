import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/routes/api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TAB_TO_PATH: Record<string, string> = {
  cnic: '/cnic',
  bundle: '/bundle',
  diagnostic: '/diagnostic',
  directory: '/portal-specs',
  guidelines: '/guidelines',
  faq: '/faq',
  privacy: '/privacy',
  terms: '/terms',
  disclaimer: '/disclaimer',
  about: '/about',
  contact: '/contact'
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.use('/api', apiRouter);

  app.get('/ads.txt', (req, res) => {
    res.type('text/plain');
    res.send(`# DocFix Ads.txt File - Ad Network Verification
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
# monetag.com, XXXXXX, DIRECT
# adsterra.com, XXXXXX, DIRECT
`);
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    const baseUrl = process.env.APP_URL || 'http://0.0.0.0:3000';
    res.send(`User-agent: *
Allow: /
Disallow: /api/

User-agent: Mediapartners-Google
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`);
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    const baseUrl = process.env.APP_URL || 'http://0.0.0.0:3000';
    const now = new Date().toISOString().split('T')[0];
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/cnic</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/bundle</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/diagnostic</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/portal-specs</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/guidelines</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/faq</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/disclaimer</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
`);
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));

    app.get('/', (req, res) => {
      const tab = req.query.tab as string | undefined;
      if (tab && TAB_TO_PATH[tab]) {
        return res.redirect(301, TAB_TO_PATH[tab]);
      }
      return res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    app.use((req, res, next) => {
      if (req.path === '/' && req.query.tab) {
        const tab = req.query.tab as string | undefined;
        if (tab && TAB_TO_PATH[tab]) {
          return res.redirect(301, TAB_TO_PATH[tab]);
        }
      }
      next();
    });

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DocFix server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
