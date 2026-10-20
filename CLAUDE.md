# Rosario Rollos — Sitio web

Sitio del negocio **Rosario Rollos** (fábrica de rollos de papel fiscal, Rosario, Argentina).
Reemplaza al sitio actual de Wix. Este archivo guarda el contexto y las reglas fijas para
no perderlas entre sesiones.

## Reglas fijas (no romper)

1. **Dominio y SEO son la prioridad #1.** El sitio vive en `https://www.rosariorollos.com`
   (el dominio sin `www` redirige a `www`). Toda URL que hoy recibe tráfico orgánico se
   preserva o lleva **301**. Ver el mapa de redirecciones en `MIGRACION.md` (pendiente).
2. **No es e-commerce.** No hay pago online ni cuentas de usuario. El cliente arma un pedido
   y lo envía por **WhatsApp** (`5493413456164`), y el dueño sigue la conversación a mano.
3. **Precios mixtos:**
   - Minorista: precio por caja **publicado** (productos destacados).
   - Mayorista / sin precio: se agregan igual, pero como **consulta** (sin total).
   - Un mismo pedido puede mezclar ambos. El botón del carrito cambia según el contenido
     ("Enviar pedido" / "Pedir cotización" / "Enviar pedido y consulta").
4. **NUNCA inventar precios ni cantidades por caja.** Si una variante no tiene `precio`,
   el sitio muestra "Consultar precio". El dueño carga precios y unidades por caja desde el
   panel. Las unidades por caja varían por producto (50 / 60 / 100 / 200).
5. **Edición sin código:** el dueño edita productos, precios, textos, fotos y FAQ desde
   **Sveltia CMS** (`/admin`), que escribe cambios como archivos en `src/content/`. El
   contenido editable vive SIEMPRE en `src/content/` para que el CMS y Claude Code no se pisen.
6. **Marcas de terceros** (Posnet, Mercado Pago, Epson, Hasar, etc.) se nombran solo como
   **compatibilidad**, nunca como distribución oficial. Conservar siempre la aclaración
   "la compatibilidad exacta depende del modelo".
7. **Staging con `noindex`** (prop `noindex` del layout Base) para no duplicar contra el
   dominio real. Quitarlo recién en producción.

## Stack

- **Astro** (SSG, 0 JS por defecto) · **Preact** solo para el carrito · CSS con tokens
  (`src/styles/tokens.css`, sin frameworks pesados).
- Integraciones: `@astrojs/sitemap`, `@astrojs/partytown` (GA4/Ads fuera del hilo principal).
- Hosting: **Netlify** (gratis). Deploy automático desde Git. CMS: **Sveltia** (Git-based).

## Estructura

- `src/content/` — CONTENIDO EDITABLE: `categorias/`, `productos/`, `faq/`. Schema en `src/content/config.ts`.
- `src/config.ts` — datos fijos del negocio (WhatsApp, dirección, nav) + helper `urlWhatsapp()`.
- `src/layouts/Base.astro` — SEO (title/meta/canonical/OG), verificación de Search Console, noindex.
- `src/components/`, `src/pages/`.

## Páginas de producto dedicadas (contenido único, no duplicar)

Térmicos: `80x50`, `80x60`, `80x30`, `57x20-posnet`, `57x30`. Obra: `76x40`.
Etiquetas: `100x150-mercado-libre`, `55x44-balanza`.
El resto de las medidas son filas seleccionables dentro de la página de su tipo de papel.

## Comandos

- `npm run dev` — desarrollo local (http://localhost:4321)
- `npm run build` — build de producción a `dist/`
- `npm run preview` — previsualizar el build

## Estado

Etapas 1-3 (auditoría, arquitectura, plan de migración) aprobadas. Etapa 4 (desarrollo) en curso.
