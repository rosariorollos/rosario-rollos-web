/**
 * Formato y lógica de precios.
 * REGLA: si no hay precio cargado, se muestra "Consultar precio". Nunca un número de relleno.
 */

export type TipoPresentacion = 'pack' | 'caja';

export type Variante = {
  tipo: TipoPresentacion;
  /** Cuántos rollos trae la presentación */
  unidadesPorCaja: number;
  precio: number | null;
  precioAnterior: number | null;
};

export const TEXTO_SIN_PRECIO = 'Consultar precio';

export function formatearPrecio(valor: number): string {
  return valor.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/** ¿Esta presentación tiene precio publicado? */
export function tienePrecio(v: Variante): boolean {
  return typeof v.precio === 'number' && v.precio > 0;
}

/** ¿Está en oferta? (precio anterior mayor al actual) */
export function enOferta(v: Variante): boolean {
  return tienePrecio(v) && typeof v.precioAnterior === 'number' && v.precioAnterior > (v.precio as number);
}

/** Texto del precio a mostrar. */
export function textoPrecio(v: Variante): string {
  return tienePrecio(v) ? formatearPrecio(v.precio as number) : TEXTO_SIN_PRECIO;
}

/**
 * Nombre de la presentación: "Pack de 10 rollos" o "Caja de 60 rollos".
 * Siempre visible para que el precio no se confunda con el de un rollo suelto.
 */
export function nombrePresentacion(v: Variante): string {
  const etiqueta = v.tipo === 'pack' ? 'Pack' : 'Caja';
  return `${etiqueta} de ${v.unidadesPorCaja} rollos`;
}

/** Alias histórico usado en algunas vistas. */
export const textoCaja = nombrePresentacion;

/** Precio por rollo, para que el cliente pueda comparar presentaciones. */
export function precioPorRollo(v: Variante): string | null {
  if (!tienePrecio(v) || !v.unidadesPorCaja) return null;
  const unitario = (v.precio as number) / v.unidadesPorCaja;
  return `${formatearPrecio(Math.round(unitario))} por rollo`;
}

/** ¿El producto tiene al menos una presentación con precio publicado? */
export function algunPrecio(variantes: Variante[]): boolean {
  return variantes.some(tienePrecio);
}

/** Presentaciones ordenadas: primero el pack, después las cajas de menor a mayor. */
export function ordenarPresentaciones(variantes: Variante[]): Variante[] {
  return [...variantes].sort((a, b) => {
    if (a.tipo !== b.tipo) return a.tipo === 'pack' ? -1 : 1;
    return a.unidadesPorCaja - b.unidadesPorCaja;
  });
}
