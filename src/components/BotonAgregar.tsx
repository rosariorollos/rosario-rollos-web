import { useState } from 'preact/hooks';
import { agregar } from '../lib/carrito';
import type { TipoPresentacion } from '../lib/precios';

type Props = {
  id: string;
  nombre: string;
  tipo?: TipoPresentacion;
  unidadesPorCaja: number;
  precio: number | null;
  agotado?: boolean;
  /** Texto alternativo (ej: "Agregar pack") */
  etiqueta?: string;
};

/** Botón para sumar una presentación (un pack o una caja) al pedido. */
export default function BotonAgregar({
  id, nombre, tipo = 'caja', unidadesPorCaja, precio, agotado = false, etiqueta,
}: Props) {
  const [sumado, setSumado] = useState(false);

  if (agotado) {
    return <span class="agregar agregar--agotado">Sin stock</span>;
  }

  const alTocar = () => {
    agregar({ id, nombre, tipo, unidadesPorCaja, precio });
    setSumado(true);
    setTimeout(() => setSumado(false), 1600);
  };

  return (
    <button type="button" class="agregar" onClick={alTocar} aria-live="polite">
      {sumado ? '✓ Agregado' : (etiqueta ?? 'Agregar al pedido')}
    </button>
  );
}
