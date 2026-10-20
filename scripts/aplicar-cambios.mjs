/**
 * Aplica el orden de "Productos más pedidos" y renombra los productos de papel obra.
 * Uso: node scripts/aplicar-cambios.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';

// Orden pedido para la portada.
const ORDEN_DESTACADOS = {
  'termico-80x50.json': 1,
  'termico-80x60.json': 2,
  'etiqueta-55x44-balanza.json': 3,
  'termico-80x30.json': 4,
  'termico-57x30.json': 5,
  'termico-57x20-posnet.json': 6,
  'etiqueta-100x150-mercado-libre.json': 7,
  'obra-76x40.json': 8,
};

const DIR = 'src/content/productos';

for (const archivo of await readdir(DIR)) {
  if (!archivo.endsWith('.json')) continue;
  const ruta = `${DIR}/${archivo}`;
  const datos = JSON.parse(await readFile(ruta, 'utf8'));
  let cambio = false;

  // 1) Orden en la portada
  if (ORDEN_DESTACADOS[archivo]) {
    datos.ordenDestacado = ORDEN_DESTACADOS[archivo];
    cambio = true;
  }

  // 2) "Rollo de obra 76x40" -> "Rollo obra 76x40"
  if (typeof datos.nombre === 'string' && datos.nombre.includes('Rollo de obra')) {
    datos.nombre = datos.nombre.replace('Rollo de obra', 'Rollo obra');
    cambio = true;
  }

  if (cambio) {
    await writeFile(ruta, JSON.stringify(datos, null, 2) + '\n', 'utf8');
    console.log(`✓ ${archivo}  nombre="${datos.nombre}"  ordenDestacado=${datos.ordenDestacado ?? '-'}`);
  }
}
