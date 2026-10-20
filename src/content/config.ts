import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * CONTENIDO EDITABLE DEL SITIO.
 * Estos datos los edita el dueño desde el panel (Sveltia CMS) sin tocar código.
 * Reglas: nunca inventar precios. Si `precio` está vacío → el sitio muestra "Consultar precio".
 */

// Una presentación = una forma de comprar el producto, con su propio precio.
// Siempre existe el pack de 10 rollos; las cajas varían según el producto
// (ej: el 80x50 viene en cajas de 60 o de 100; el posnet en 100 o 250).
const variante = z.object({
  // 'pack' = pack de 10 rollos · 'caja' = caja cerrada
  tipo: z.enum(['pack', 'caja']).default('caja'),
  // Cuántos rollos trae esta presentación
  unidadesPorCaja: z.number().int().positive(),
  // Precio de la presentación completa. Vacío => se muestra "Consultar precio".
  // NUNCA rellenar con un número de ejemplo.
  precio: z.number().nonnegative().nullable().default(null),
  // Precio anterior tachado cuando hay oferta (opcional).
  precioAnterior: z.number().nonnegative().nullable().default(null),
});

const categorias = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/categorias' }),
  schema: z.object({
    nombre: z.string(),
    slug: z.string(),
    descripcion: z.string().default(''),
    orden: z.number().default(99),
    destacada: z.boolean().default(false),
    icono: z.string().optional(), // nombre de ícono lineal (Lucide)
    foto: z.string().optional(),

    // --- Contenido para posicionar en Google (todo editable desde el panel) ---
    // Título y descripción que ve Google. Si están vacíos se generan automáticos.
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    // Párrafo de apertura debajo del H1.
    intro: z.string().default(''),
    // Secciones de texto. Son las que hacen que la página posicione.
    secciones: z.array(z.object({
      titulo: z.string(),
      texto: z.string(),
    })).default([]),
    // Guía "¿qué medida necesito?": fila = equipo → medida recomendada.
    guiaMedidas: z.array(z.object({
      equipo: z.string(),
      medida: z.string(),
    })).default([]),
    // Preguntas frecuentes propias de la categoría (generan resultado enriquecido en Google).
    preguntas: z.array(z.object({
      pregunta: z.string(),
      respuesta: z.string(),
    })).default([]),
  }),
});

const productos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/productos' }),
  schema: z.object({
    nombre: z.string(),
    slug: z.string(),
    categoria: z.string(), // slug de la categoría
    medida: z.string().default(''),
    // Ficha técnica (se muestra como lista de datos en la página del producto).
    gramaje: z.string().default(''),
    color: z.string().default(''),
    tipoPapel: z.string().default(''),
    // ¿tiene página propia con contenido único? (las 6 térmicos/obra + 2 etiquetas)
    paginaPropia: z.boolean().default(false),
    destacado: z.boolean().default(false),
    agotado: z.boolean().default(false),
    // Precios por tamaño de caja. Vacío mientras el dueño no los cargue.
    variantes: z.array(variante).default([]),
    descripcionCorta: z.string().default(''),
    descripcion: z.string().default(''),
    // Equipos/marcas compatibles. Siempre como compatibilidad, nunca como distribución oficial.
    compatibilidades: z.array(z.string()).default([]),
    usos: z.array(z.string()).default([]),
    foto: z.string().optional(), // ruta bajo /imagenes (se optimiza en el build)
    orden: z.number().default(99),           // orden dentro de su categoría
    ordenDestacado: z.number().default(99),  // orden en "Productos más pedidos" de la portada
    // SEO por página (opcional; si vacío se genera automático)
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faq' }),
  schema: z.object({
    pregunta: z.string(),
    respuesta: z.string(),
    orden: z.number().default(99),
  }),
});

export const collections = { categorias, productos, faq };
