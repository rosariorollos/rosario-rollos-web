import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Índice de búsqueda que consume el buscador del encabezado.
 * Se genera en el build: es un archivo estático, no hay servidor detrás.
 */
export const GET: APIRoute = async () => {
  const productos = await getCollection('productos');
  const categorias = await getCollection('categorias');

  const limpiar = (t: string) =>
    (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const items = [
    ...productos.map((p) => ({
      t: 'Producto',
      n: p.data.nombre,
      m: p.data.medida || '',
      // Los que no tienen página propia llevan a su categoría.
      u: p.data.paginaPropia
        ? `/${p.data.categoria}/${p.data.slug}`
        : `/${p.data.categoria}`,
      f: p.data.foto || '',
      d: p.data.destacado ? p.data.ordenDestacado : 99,
      b: limpiar([
        p.data.nombre, p.data.medida, p.data.slug, p.data.descripcionCorta,
        ...p.data.usos, ...p.data.compatibilidades,
      ].join(' ')),
    })),
    ...categorias.map((c) => ({
      t: 'Categoría',
      n: c.data.nombre,
      m: '',
      u: `/${c.data.slug}`,
      f: c.data.foto || '',
      d: 50,
      b: limpiar([c.data.nombre, c.data.descripcion, c.data.slug].join(' ')),
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
