import { useStore } from '@nanostores/preact';
import { useState } from 'preact/hooks';
import {
  items, conPrecio, aCotizar, total, cantidadTotal, rollosTotales, textoBoton,
  cambiarCantidad, quitar, vaciar, linkPedido, marcarEnviado,
  ultimoPedido, repetirUltimoPedido,
  type ItemPedido,
} from '../lib/carrito';
import { formatearPrecio, nombrePresentacion } from '../lib/precios';

/** Panel de pedido. Única isla interactiva del sitio. */
export default function Carrito() {
  const lista = useStore(items);
  const cotizados = useStore(conPrecio);
  const consultas = useStore(aCotizar);
  const suma = useStore(total);
  const bultos = useStore(cantidadTotal);
  const rollos = useStore(rollosTotales);
  const etiquetaBoton = useStore(textoBoton);
  const anterior = useStore(ultimoPedido);

  const [abierto, setAbierto] = useState(false);

  const enviar = () => {
    // Sin formulario: el cliente ya se identifica con su propio WhatsApp.
    const url = linkPedido(lista);

    try {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'pedido_whatsapp',
        productos: lista.length,
        bultos,
        rollos,
        valor_cotizado: suma,
      });
    } catch { /* el tracking nunca debe romper el pedido */ }

    window.open(url, '_blank', 'noopener');
    marcarEnviado();
    setAbierto(false);
  };

  return (
    <>
      <button class="carrito__lanzador" onClick={() => setAbierto(true)}
              aria-label={`Ver pedido (${bultos} bultos, ${rollos} rollos)`}>
        Mi pedido{bultos > 0 && <span class="carrito__burbuja">{bultos}</span>}
      </button>

      {abierto && (
        <div class="carrito__fondo" onClick={() => setAbierto(false)}>
          <aside class="carrito" onClick={(e) => e.stopPropagation()}
                 role="dialog" aria-label="Tu pedido" aria-modal="true">
            <header class="carrito__cab">
              <h2>Tu pedido</h2>
              <button class="carrito__cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar">×</button>
            </header>

            {lista.length === 0 ? (
              <div class="carrito__vacio">
                <p>Todavía no agregaste productos.</p>
                {anterior.length > 0 && (
                  <button class="boton boton--fantasma" onClick={repetirUltimoPedido}>
                    Volver a pedir lo último
                  </button>
                )}
              </div>
            ) : (
              <>
                {cotizados.length > 0 && (
                  <section class="carrito__bloque">
                    <h3 class="carrito__subtit">Con precio</h3>
                    {cotizados.map((i) => <Linea key={i.id} item={i} />)}
                    <p class="carrito__total">Total: <strong>{formatearPrecio(suma)}</strong></p>
                  </section>
                )}

                {consultas.length > 0 && (
                  <section class="carrito__bloque">
                    <h3 class="carrito__subtit">A cotizar</h3>
                    <p class="carrito__nota">
                      Estos no tienen precio publicado: te pasamos la cotización por WhatsApp.
                    </p>
                    {consultas.map((i) => <Linea key={i.id} item={i} />)}
                  </section>
                )}

                <p class="carrito__resumen">{rollos} rollos en total</p>

                <div class="carrito__pie">
                  <button type="button" class="boton boton--wsp carrito__enviar" onClick={enviar}>
                    {etiquetaBoton}
                  </button>
                  <p class="carrito__aclaracion">
                    Se abre WhatsApp con tu pedido ya escrito. No hace falta que cargues tus datos.
                  </p>
                  <button type="button" class="carrito__vaciar" onClick={vaciar}>Vaciar pedido</button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

function Linea({ item }: { item: ItemPedido }) {
  const conPrecio = typeof item.precio === 'number' && item.precio > 0;
  const rollos = item.cantidad * item.unidadesPorCaja;
  return (
    <div class="linea">
      <div class="linea__info">
        <p class="linea__nombre">{item.nombre}</p>
        <p class="linea__caja">
          {nombrePresentacion(item)}
          {conPrecio ? ` · ${formatearPrecio(item.precio as number)} c/u` : ' · Consultar precio'}
        </p>
        <p class="linea__rollos">{rollos} rollos</p>
      </div>
      <div class="linea__controles">
        <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                aria-label="Quitar uno">−</button>
        <span class="linea__cantidad" aria-label="Cantidad">{item.cantidad}</span>
        <button type="button" onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                aria-label="Agregar uno">+</button>
        <button type="button" class="linea__quitar" onClick={() => quitar(item.id)}
                aria-label={`Quitar ${item.nombre}`}>×</button>
      </div>
    </div>
  );
}
