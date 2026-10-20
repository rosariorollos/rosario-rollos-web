// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import preact from '@astrojs/preact';

// URL de producción. El sitio vive en www (rosariorollos.com redirige a www).
const SITE = 'https://www.rosariorollos.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: { format: 'directory' },
  integrations: [
    sitemap(),
    // Carga scripts de terceros (GA4/Ads) fuera del hilo principal → no daña Core Web Vitals.
    partytown({ config: { forward: ['dataLayer.push', 'gtag'] } }),
    // Islas interactivas (solo el carrito) con Preact, mínimo JS.
    preact(),
  ],
});
