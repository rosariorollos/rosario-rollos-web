/**
 * Optimiza las imágenes nuevas: fotos de fábrica para el carrusel y el logo limpio.
 * Uso: node scripts/optimizar-nuevas.mjs <carpeta-origen>
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const origen = process.argv[2];
if (!origen) { console.error('Falta la carpeta origen.'); process.exit(1); }

await mkdir('public/imagenes', { recursive: true });

const trabajos = [
  // Fotos reales de la fábrica para el carrusel del banner
  { de: '1.jpg', a: 'fabrica-cuchillas', ancho: 1600 },
  { de: '2.jpg', a: 'fabrica-bobinadora', ancho: 1600 },
  // Logo limpio (marca RR con fondo transparente) -> PNG para conservar transparencia
  { de: '3.webp', a: 'logo-rr', ancho: 200, png: true },
  { de: '3.webp', a: 'logo-rr-grande', ancho: 512, png: true },
];

for (const t of trabajos) {
  const entrada = path.join(origen, t.de);
  const ext = t.png ? 'png' : 'webp';
  const salida = `public/imagenes/${t.a}.${ext}`;
  try {
    let img = sharp(entrada).resize({ width: t.ancho, withoutEnlargement: true });
    img = t.png ? img.png({ compressionLevel: 9, palette: true }) : img.webp({ quality: 82 });
    const info = await img.toFile(salida);
    console.log(`✓ ${t.a}.${ext}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
  } catch (e) {
    console.error(`✗ ${t.de}: ${e.message}`);
  }
}
