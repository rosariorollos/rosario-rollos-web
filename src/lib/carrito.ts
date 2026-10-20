import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import { EMPRESA, urlWhatsapp } from '../config';
import { formatearPrecio, nombrePresentacion, type TipoPresentacion } from './precios';

/**
 * CARRITO / LISTA DE PEDIDO.
 * Se guarda en el navegador (localStorage) → sobrevive a navegar y a refrescar.
 * No hay pago online: el pedido termina en un mensaje de WhatsApp.
 *
 * La unidad que se suma es la PRESENTACIÓN entera (un pack de 10 o una caja),
 * nunca rollos sueltos. Así el total nunca queda mal calculado.
 */

export type ItemPedido = {
  /** id único: slug del producto + presentación */
  id: string;
  nombre: string;
  tipo: TipoPresentacion;
  /** rollos que trae cada pack/caja */
  unidadesPorCaja: number;
  /** precio de la presentación completa. null => va como CONSULTA */
  precio: number | null;
  /** cuántos packs o cajas */
  cantidad: number;
};

export const items = persistentAtom<ItemPedido[]>('rr_pedido_v2', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

/** Copia del último pedido enviado, para "Volver a pedir lo último". */
export const ultimoPedido = persistentAtom<ItemPedido[]>('rr_ultimo_pedido_v2', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// ---------- acciones ----------

export function agregar(item: Omit<ItemPedido, 'cantidad'>, cantidad = 1) {
  const actuales = items.get();
  const existente = actuales.find((i) => i.id === item.id);
  if (existente) {
    items.set(actuales.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad + cantidad } : i)));
  } else {
    items.set([...actuales, { ...item, cantidad }]);
  }
}

export function cambiarCantidad(id: string, cantidad: number) {
  if (cantidad <= 0) return quitar(id);
  items.set(items.get().map((i) => (i.id === id ? { ...i, cantidad } : i)));
}

export function quitar(id: string) {
  items.set(items.get().filter((i) => i.id !== id));
}

export function vaciar() {
  items.set([]);
}

export function repetirUltimoPedido() {
  const ultimo = ultimoPedido.get();
  if (ultimo.length) items.set(ultimo.map((i) => ({ ...i })));
}

// ---------- derivados ----------

const conPrecioReal = (i: ItemPedido) => typeof i.precio === 'number' && i.precio > 0;

export const conPrecio = computed(items, (list) => list.filter(conPrecioReal));
export const aCotizar = computed(items, (list) => list.filter((i) => !conPrecioReal(i)));

export const total = computed(conPrecio, (list) =>
  list.reduce((suma, i) => suma + (i.precio as number) * i.cantidad, 0)
);

/** Cuántos bultos (packs + cajas) hay en el pedido. */
export const cantidadTotal = computed(items, (list) =>
  list.reduce((s, i) => s + i.cantidad, 0)
);

/** Cuántos rollos suman en total. */
export const rollosTotales = computed(items, (list) =>
  list.reduce((s, i) => s + i.cantidad * i.unidadesPorCaja, 0)
);

/** El botón cambia según lo que haya en el carrito. */
export const textoBoton = computed([conPrecio, aCotizar], (conP, aCot) => {
  if (conP.length && aCot.length) return 'Enviar pedido y consulta';
  if (aCot.length) return 'Pedir cotización';
  return 'Enviar pedido';
});

// ---------- mensaje de WhatsApp ----------

export type DatosCliente = { nombre?: string };

const linea = (i: ItemPedido) => {
  const presentacion = nombrePresentacion(i);
  const rollos = i.cantidad * i.unidadesPorCaja;
  const cuantos = i.cantidad === 1 ? presentacion : `${i.cantidad} x ${presentacion}`;
  return { cuantos, rollos };
};

/**
 * Arma el mensaje. Separa lo cotizado de lo que va a consulta para que se
 * entienda qué parte tiene precio y qué parte no.
 */
export function armarMensaje(lista: ItemPedido[]): string {
  const conP = lista.filter(conPrecioReal);
  const aCot = lista.filter((i) => !conPrecioReal(i));
  const suma = conP.reduce((s, i) => s + (i.precio as number) * i.cantidad, 0);

  const l: string[] = ['*Hola! Quiero hacer este pedido:*'];

  if (conP.length) {
    l.push('', '*CON PRECIO:*');
    for (const i of conP) {
      const { cuantos, rollos } = linea(i);
      const sub = (i.precio as number) * i.cantidad;
      l.push(`- ${i.nombre} — ${cuantos} (${rollos} rollos) = ${formatearPrecio(sub)}`);
    }
    l.push(`*Total: ${formatearPrecio(suma)}*`);
  }

  if (aCot.length) {
    l.push('', '*A COTIZAR:*');
    for (const i of aCot) {
      const { cuantos, rollos } = linea(i);
      l.push(`- ${i.nombre} — ${cuantos} (${rollos} rollos)`);
    }
    l.push('_Esta parte te la confirmo por acá._');
  }

  return l.join('\n');
}

/**
 * Límite práctico de la URL de wa.me. Por encima de ~2000 caracteres el mensaje
 * puede cortarse en algunos celulares, así que mandamos una versión resumida.
 */
const LIMITE_URL = 1800;

export function armarMensajeResumido(lista: ItemPedido[]): string {
  const conP = lista.filter(conPrecioReal);
  const aCot = lista.filter((i) => !conPrecioReal(i));
  const suma = conP.reduce((s, i) => s + (i.precio as number) * i.cantidad, 0);
  const rollos = lista.reduce((s, i) => s + i.cantidad * i.unidadesPorCaja, 0);

  const l: string[] = ['*Hola! Quiero hacer este pedido:*', ''];
  l.push(`Pedido grande: ${lista.length} productos distintos, ${rollos} rollos en total.`);
  if (conP.length) l.push(`Con precio: ${conP.length} productos — Total ${formatearPrecio(suma)}`);
  if (aCot.length) l.push(`A cotizar: ${aCot.length} productos`);
  l.push('', 'Te paso el detalle completo por acá.');
  return l.join('\n');
}

/** Devuelve el link final de WhatsApp, cuidando el límite de longitud. */
export function linkPedido(lista: ItemPedido[], _cliente?: DatosCliente): string {
  const url = urlWhatsapp(armarMensaje(lista));
  if (url.length <= LIMITE_URL) return url;
  return urlWhatsapp(armarMensajeResumido(lista));
}

/** Marca el pedido como enviado: guarda copia para repedido y limpia el carrito. */
export function marcarEnviado() {
  const actuales = items.get();
  if (actuales.length) ultimoPedido.set(actuales.map((i) => ({ ...i })));
  vaciar();
}
