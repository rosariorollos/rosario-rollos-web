/**
 * Optimiza las fotos del sitio: redimensiona y convierte a WebP.
 * Uso: node scripts/optimizar-imagenes.mjs
 *
 * Toma las fotos originales de fotos-nuevas/ y las deja listas en public/imagenes/
 * con nombres claros. Las originales NO se tocan.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ORIGEN = 'fotos-nuevas';
const DESTINO = 'public/imagenes';

// archivo original -> nombre final + ancho máximo
const MAPA = [
  // Banner / portada
  { de: 'de la granja a la mesa.png', a: 'banner-no-te-quedes-sin-rollos', ancho: 1600 },

  // Categorías
  { de: 'Impresora térmica y rollos fiscales.png', a: 'cat-rollos-termicos', ancho: 800 },
  { de: 'ChatGPT Image 5 oct 2026, 04_12_56 p.m..png', a: 'cat-rollos-obra', ancho: 800 },
  { de: 'ROLLO_76MMX30MTS_QUIMICO_DUPLICADO.webp', a: 'cat-rollos-quimicos', ancho: 800 },
  { de: 'ChatGPT Image 5 oct 2026, 04_08_43 p.m..png', a: 'cat-etiquetas', ancho: 800 },

  // Productos térmicos
  { de: 'Impresora térmica en mostrador de cobro.png', a: 'termico-80x50', ancho: 900 },
  { de: 'ChatGPT Image 5 oct 2026, 03_19_45 p.m..png', a: 'termico-80x60', ancho: 900 },
  { de: 'IMG_2053.JPG.jpeg', a: 'termico-80x30', ancho: 900 },
  { de: 'POSNET.jpg', a: 'termico-57x20-posnet', ancho: 900 },
  { de: 'IMG_2325.JPG.jpeg', a: 'termico-57x30', ancho: 900 },

  // Obra
  { de: 'Rollos de papel térmico con números impresos.png', a: 'obra-76x40', ancho: 900 },

  // Etiquetas
  { de: 'ChatGPT Image 5 oct 2026, 03_32_11 p.m..png', a: 'etiqueta-100x150', ancho: 900 },
  { de: 'ChatGPT Image 24 ago 2026, 07_26_58 p.m..png', a: 'etiqueta-55x44', ancho: 900 },

  // Apoyo
  { de: 'IMG_2330.PNG', a: 'rollos-impresos', ancho: 900 },
  { de: 'ChatGPT Image 5 oct 2026, 03_31_20 p.m..png', a: 'fabrica-rollos', ancho: 1400 },
  { de: 'IMG_2049.JPG.jpeg', a: 'caja-rollos', ancho: 900 },
];

await mkdir(DESTINO, { recursive: true });

let ok = 0;
for (const item of MAPA) {
  const entrada = path.join(ORIGEN, item.de);
  const salida = path.join(DESTINO, `${item.a}.webp`);
  try {
    const info = await sharp(entrada)
      .resize({ width: item.ancho, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(salida);
    console.log(`✓ ${item.a}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
    ok++;
  } catch (e) {
    console.error(`✗ ${item.de}: ${e.message}`);
  }
}
console.log(`\n${ok}/${MAPA.length} imágenes optimizadas en ${DESTINO}`);
