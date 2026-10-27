# Migración de rosariorollos.com — plan y rollback

## ⚠️ VALORES DNS ORIGINALES (Wix) — PARA VOLVER ATRÁS

Si algo sale mal, restaurar EXACTAMENTE esto en Wix → Dominios → Registros DNS.
Relevado el 26/10/2026 antes del corte.

### A (host) — rosariorollos.com
| Host | Valor | TTL |
|---|---|---|
| rosariorollos.com | 185.230.63.107 | 1 hora |
| rosariorollos.com | 185.230.63.186 | 1 hora |
| rosariorollos.com | 185.230.63.171 | 1 hora |

### CNAME (alias)
| Host | Valor | TTL |
|---|---|---|
| www.rosariorollos.com | cdn3.wixdns.net | 1 hora |

### Otros
- TXT: ninguno
- SRV: ninguno
- MX: ninguno (el correo es Gmail común, NO depende de este DNS)
- Servidores de nombres: ns0.wixdns.net / ns1.wixdns.net

---

## Estado previo al corte

- Sitio nuevo: https://flourishing-moxie-169e99.netlify.app (Netlify, publicación automática desde GitHub)
- Repositorio: github.com/rosariorollos/rosario-rollos-web
- Wix: sigue pago y activo. **No dar de baja hasta transferir el dominio.**
- Verificación de Google Search Console: por etiqueta HTML, ya incrustada en el sitio nuevo
  (`google-site-verification` en el layout). Sobrevive al cambio de DNS.

## Decisión de dominio

El sitio vive en **www.rosariorollos.com**. El dominio sin www redirige a www.

## ⚠️ Pendiente crítico posterior al corte

El dominio está **registrado dentro de Wix**. Antes de dar de baja la suscripción de Wix
hay que **transferirlo a un registrador independiente**, o se pierde el dominio al vencer.
Wix sigue pago hasta 2028, así que hay tiempo, pero no hay que olvidarlo.

---

## ✅ CORTE EJECUTADO — 27/10/2026

DNS cambiado en Wix (los registros originales siguen arriba, para volver atrás).

### Configuración vigente
| Tipo | Host | Valor | TTL |
|---|---|---|---|
| A | rosariorollos.com | 75.2.60.5 | 30 min |
| CNAME | www.rosariorollos.com | flourishing-moxie-169e99.netlify.app | 30 min |

- Dominio principal en Netlify: **www.rosariorollos.com**
- Certificado Let's Encrypt emitido. HSTS activo (max-age=31536000).

### Verificado el mismo día
- `rosariorollos.com` → 301 → `https://www.rosariorollos.com` (un solo salto)
- `http://` → 301 → `https://` en ambos nombres
- 11 páginas clave responden 200; URL inexistente responde 404
- Redirecciones de Wix OK: `/copia-de-*`, `/product-page/*`, `/service-page/*`,
  los 5 sitemaps viejos y las URLs legales con acento
- `robots.txt` permite rastreo completo y apunta al sitemap
- Canonical de todas las páginas en `www`. **Sin `noindex`** (confirmado en producción)
- Sitemap: 23 URLs, todas en `www`
- Etiqueta de verificación de Search Console presente

### Nota
Las URLs legales viejas con acento hacen 2 saltos (acento → sin acento → barra final).
No tenían tráfico; no se corrige.

## Pendientes tras el corte
1. Search Console: enviar el sitemap y vigilar cobertura las próximas semanas.
2. Google Analytics 4 + conversión de Google Ads (el evento `pedido_whatsapp` ya se dispara).
3. Terminar la autenticación del panel `/admin` (OAuth de GitHub vía Netlify).
4. Cargar precios y fotos reales.
5. **Transferir el dominio fuera de Wix antes de dar de baja la suscripción** (vence 26/06/2027).
