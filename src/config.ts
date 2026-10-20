/** Datos fijos del negocio. Un solo lugar para todo el sitio. */
export const EMPRESA = {
  nombre: 'Rosario Rollos',
  desde: 2005, // el sitio calcula los años solo (nada de "más de 20 años" hardcodeado)
  // WhatsApp en formato internacional para wa.me (54 9 341 3456164)
  whatsapp: '5493413456164',
  whatsappVisible: '341 345-6164',
  telefonoFijo: '299-4785',
  email: 'rosariorollos@gmail.com',
  direccion: 'Lamadrid 102, Rosario, Santa Fe',
  horarios: 'Lunes a viernes de 08:00 a 16:00',
  mapaUrl: 'https://www.google.com/maps/search/?api=1&query=Lamadrid+102+Rosario+Santa+Fe',
};

/** Arma el link de wa.me con un mensaje ya redactado. */
export function urlWhatsapp(mensaje = ''): string {
  const base = `https://wa.me/${EMPRESA.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

export const NAV = [
  { texto: 'Inicio', href: '/' },
  { texto: 'Productos', href: '/productos' },
  { texto: 'Mayorista', href: '/mayorista' },
  { texto: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
  { texto: 'Nosotros', href: '/nosotros' },
  { texto: 'Contacto', href: '/contacto' },
];
