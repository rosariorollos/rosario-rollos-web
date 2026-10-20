/**
 * Asigna la foto correspondiente a cada producto y categoría.
 * Uso: node scripts/asignar-fotos.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';

const PRODUCTOS = {
  'termico-80x50.json': '/imagenes/termico-80x50.webp',
  'termico-80x60.json': '/imagenes/termico-80x60.webp',
  'termico-80x30.json': '/imagenes/termico-80x30.webp',
  'termico-57x20-posnet.json': '/imagenes/termico-57x20-posnet.webp',
  'termico-57x30.json': '/imagenes/termico-57x30.webp',
  'obra-76x40.json': '/imagenes/obra-76x40.webp',
  'etiqueta-100x150-mercado-libre.json': '/imagenes/etiqueta-100x150.webp',
  'etiqueta-55x44-balanza.json': '/imagenes/etiqueta-55x44.webp',
  'rollos-impresos.json': '/imagenes/rollos-impresos.webp',
};

const CATEGORIAS = {
  'rollos-termicos.json': '/imagenes/cat-rollos-termicos.webp',
  'rollos-obra.json': '/imagenes/cat-rollos-obra.webp',
  'rollos-quimicos.json': '/imagenes/cat-rollos-quimicos.webp',
  'etiquetas-autoadhesivas.json': '/imagenes/cat-etiquetas.webp',
};

async function asignar(carpeta, mapa) {
  for (const [archivo, foto] of Object.entries(mapa)) {
    const ruta = `src/content/${carpeta}/${archivo}`;
    try {
      const datos = JSON.parse(await readFile(ruta, 'utf8'));
      datos.foto = foto;
      await writeFile(ruta, JSON.stringify(datos, null, 2) + '\n', 'utf8');
      console.log(`✓ ${carpeta}/${archivo} → ${foto}`);
    } catch (e) {
      console.error(`✗ ${ruta}: ${e.message}`);
    }
  }
}

await asignar('productos', PRODUCTOS);
await asignar('categorias', CATEGORIAS);
