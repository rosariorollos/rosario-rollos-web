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
