/**
 * Mejora lo posible de las fotos de fábrica de baja resolución:
 * reescalado con Lanczos + enfoque suave. NO inventa detalle, solo
 * aprovecha mejor el que hay y evita que se vean lavadas.
 */
import sharp from 'sharp';
import path from 'node:path';

const origen = process.argv[2];
if (!origen) { console.error('Falta la carpeta origen.'); process.exit(1); }

const trabajos = [
  { de: '1.jpg', a: 'fabrica-cuchillas', ancho: 1400 },
  { de: '2.jpg', a: 'fabrica-bobinadora', ancho: 1400 },
];

for (const t of trabajos) {
  const info = await sharp(path.join(origen, t.de))
    .resize({ width: t.ancho, kernel: 'lanczos3', withoutEnlargement: false })
    .sharpen({ sigma: 1.1, m1: 0.6, m2: 0.5 })   // enfoque suave, sin halos
    .modulate({ saturation: 1.06 })               // apenas más color
    .webp({ quality: 88 })
    .toFile(`public/imagenes/${t.a}.webp`);
  console.log(`✓ ${t.a}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}
