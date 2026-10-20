/**
 * Optimiza el logo de Rosario Rollos para el encabezado.
 * Uso: node scripts/optimizar-logo.mjs <ruta-del-logo-original>
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const origen = process.argv[2];
if (!origen) {
  console.error('Falta la ruta del logo original.');
  process.exit(1);
}

await mkdir('public/imagenes', { recursive: true });

// Versión para el encabezado (alto fijo ~96px en pantallas retina).
const cab = await sharp(origen)
  .trim()                               // saca el borde transparente sobrante
  .resize({ height: 96, withoutEnlargement: true })
  .webp({ quality: 90 })
  .toFile('public/imagenes/logo.webp');
console.log(`logo.webp  ${cab.width}x${cab.height}  ${(cab.size / 1024).toFixed(1)} KB`);

// Versión grande para compartir en redes (Open Graph) y usos futuros.
const grande = await sharp(origen)
  .trim()
  .resize({ width: 600, withoutEnlargement: true })
  .webp({ quality: 90 })
  .toFile('public/imagenes/logo-grande.webp');
console.log(`logo-grande.webp  ${grande.width}x${grande.height}  ${(grande.size / 1024).toFixed(1)} KB`);
