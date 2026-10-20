/**
 * Carga las presentaciones de cada producto SIN precios.
 * - Pack de 10 rollos para todos (compra chica).
 * - Cajas: solo las que el dueño confirmó. El resto las agrega él desde el panel.
 * Los precios quedan vacíos a propósito: el sitio muestra "Consultar precio".
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';

const DIR = 'src/content/productos';

// Cajas confirmadas por el dueño, por archivo de producto.
const CAJAS = {
  'termico-80x50.json': [60, 100],
  'termico-57x20-posnet.json': [100, 250],
  'termico-57x30.json': [100, 200],
  'quimico-76x25.json': [50],
  'quimico-76x30.json': [50],
  'obra-76x30.json': [60],
  'obra-76x40.json': [60],
  'etiqueta-55x44-balanza.json': [60],
  'etiqueta-100x150-mercado-libre.json': [20],
};

// Productos que no se venden por rollo (no llevan pack de 10).
const SIN_PACK = ['resma-', 'rollos-impresos'];

let tocados = 0;
for (const archivo of await readdir(DIR)) {
  if (!archivo.endsWith('.json')) continue;
  const ruta = `${DIR}/${archivo}`;
  const d = JSON.parse(await readFile(ruta, 'utf8'));

  // No pisamos presentaciones que ya tengan precio cargado.
  const yaTienePrecio = (d.variantes || []).some((v) => typeof v.precio === 'number' && v.precio > 0);
  if (yaTienePrecio) { console.log(`· ${archivo} tiene precios, no lo toco`); continue; }

  const variantes = [];
  if (!SIN_PACK.some((p) => archivo.startsWith(p) || archivo.includes(p))) {
    variantes.push({ tipo: 'pack', unidadesPorCaja: 10, precio: null, precioAnterior: null });
  }
  for (const u of CAJAS[archivo] ?? []) {
    variantes.push({ tipo: 'caja', unidadesPorCaja: u, precio: null, precioAnterior: null });
  }

  d.variantes = variantes;
  await writeFile(ruta, JSON.stringify(d, null, 2) + '\n', 'utf8');
  tocados++;
  console.log(`✓ ${archivo}  ${variantes.map((v) => `${v.tipo}:${v.unidadesPorCaja}`).join(' ') || '(sin presentaciones)'}`);
}
console.log(`\n${tocados} productos actualizados`);
