// Todos los valores del enum Municipio del OpenAPI — 24 municipios
export const MUNICIPIOS = [
  { valor: 'ABEJORRAL', label: 'Abejorral' },
  { valor: 'ALEJANDRIA', label: 'Alejandría' },
  { valor: 'ARGELIA', label: 'Argelia' },
  { valor: 'COCORNA', label: 'Cocorná' },
  { valor: 'CONCEPCION', label: 'Concepción' },
  { valor: 'EL_CARMEN_DE_VIBORAL', label: 'El Carmen de Viboral' },
  { valor: 'EL_PENOL', label: 'El Peñol' },
  { valor: 'EL_RETIRO', label: 'El Retiro' },
  { valor: 'EL_SANTUARIO', label: 'El Santuario' },
  { valor: 'GRANADA', label: 'Granada' },
  { valor: 'GUARNE', label: 'Guarne' },
  { valor: 'GUATAPE', label: 'Guatapé' },
  { valor: 'LA_CEJA', label: 'La Ceja' },
  { valor: 'LA_UNION', label: 'La Unión' },
  { valor: 'MARINILLA', label: 'Marinilla' },
  { valor: 'MEDELLIN', label: 'Medellín' },
  { valor: 'NARINO', label: 'Nariño' },
  { valor: 'RIONEGRO', label: 'Rionegro' },
  { valor: 'SAN_CARLOS', label: 'San Carlos' },
  { valor: 'SAN_FRANCISCO', label: 'San Francisco' },
  { valor: 'SAN_LUIS', label: 'San Luis' },
  { valor: 'SAN_RAFAEL', label: 'San Rafael' },
  { valor: 'SAN_VICENTE_FERRER', label: 'San Vicente Ferrer' },
  { valor: 'SONSON', label: 'Sonsón' },
]

export const TIPOS_NEGOCIO = [
  { valor: 'RESTAURANTE', label: 'Restaurante' },
  { valor: 'TIENDA', label: 'Tienda' },
  { valor: 'MINIMERCADO', label: 'Minimercado' },
  { valor: 'MAYORISTA', label: 'Mayorista' },
]

export const ROL = {
  PRODUCTOR: 'PRODUCTOR',
  COMPRADOR: 'COMPRADOR',
  ADMINISTRADOR: 'ADMINISTRADOR',
}

// Orden alfabético por etiqueta (US-24, catálogo de 23 productos); OTRO siempre al final
export const PRODUCTOS = [
  { valor: 'AGUACATE', label: 'Aguacate' },
  { valor: 'ARVEJA_VERDE', label: 'Arveja verde' },
  { valor: 'CACAO', label: 'Cacao en grano seco' },
  { valor: 'CAFE_PERGAMINO', label: 'Café pergamino' },
  { valor: 'CEBOLLA', label: 'Cebolla' },
  { valor: 'CILANTRO', label: 'Cilantro' },
  { valor: 'FRIJOL_CARGAMANTO', label: 'Fríjol cargamanto' },
  { valor: 'GRANADILLA', label: 'Granadilla' },
  { valor: 'GULUPA', label: 'Gulupa' },
  { valor: 'LIMON_TAHITI', label: 'Limón Tahití' },
  { valor: 'LULO', label: 'Lulo' },
  { valor: 'MARACUYA', label: 'Maracuyá' },
  { valor: 'MORA_CASTILLA', label: 'Mora de castilla' },
  { valor: 'PANELA', label: 'Panela' },
  { valor: 'PAPA_CAPIRA', label: 'Papa capira' },
  { valor: 'PIMENTON', label: 'Pimentón' },
  { valor: 'PINA', label: 'Piña' },
  { valor: 'PLATANO', label: 'Plátano' },
  { valor: 'TOMATE_CHONTO', label: 'Tomate chonto' },
  { valor: 'TOMATE_ARBOL', label: 'Tomate de árbol' },
  { valor: 'UCHUVA', label: 'Uchuva' },
  { valor: 'YUCA', label: 'Yuca' },
  { valor: 'OTRO', label: 'Otro' },
]

export const UNIDADES_MEDIDA = [
  { valor: 'KILOGRAMO', label: 'Kilogramo' },
  { valor: 'ARROBA', label: 'Arroba' },
  { valor: 'CARGA', label: 'Carga' },
  { valor: 'BULTO', label: 'Bulto' },
  { valor: 'CANASTILLA', label: 'Canastilla' },
  { valor: 'TONELADA', label: 'Tonelada' },
  { valor: 'UNIDAD', label: 'Unidad' },
]

export const ESTADOS_CULTIVO = [
  { valor: 'EN_CRECIMIENTO', label: 'En cultivo' },
  { valor: 'DISPONIBLE', label: 'Disponible para entrega inmediata' },
]

export const MODALIDADES_LOGISTICA = [
  { valor: 'RECOGIDA_FINCA', label: 'Recogida en finca' },
  { valor: 'DESPACHO_PRODUCTOR', label: 'Despacho del productor' },
  { valor: 'AMBAS', label: 'Ambas modalidades' },
]

// --- helpers de label ---

export function labelMunicipio(valor) {
  return MUNICIPIOS.find((m) => m.valor === valor)?.label ?? valor
}

export function labelProducto(valor) {
  return PRODUCTOS.find((p) => p.valor === valor)?.label ?? valor
}

export function labelUnidad(valor) {
  return UNIDADES_MEDIDA.find((u) => u.valor === valor)?.label ?? valor
}

export function labelUnidadCorta(valor) {
  const map = {
    KILOGRAMO: 'kg',
    ARROBA: 'arroba',
    CARGA: 'carga',
    BULTO: 'bulto',
    CANASTILLA: 'canastilla',
    TONELADA: 'ton',
    UNIDAD: 'und',
  }
  return map[valor] ?? valor.toLowerCase()
}

export function labelModalidad(valor) {
  return MODALIDADES_LOGISTICA.find((m) => m.valor === valor)?.label ?? valor
}

export function labelEstadoCultivo(valor) {
  return ESTADOS_CULTIVO.find((e) => e.valor === valor)?.label ?? valor
}

export const RUTA_IMAGEN_OTRO = '/img/productos/otro.webp'

function slugProducto(texto) {
  return String(texto)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

// Cada valor del enum tiene su foto en public/img/productos/<valor en minúsculas>.webp
const ARCHIVO_POR_VALOR = new Map(PRODUCTOS.map((p) => [p.valor, `${p.valor.toLowerCase()}.webp`]))

// Fotos que solo usan las ofertas OTRO con ese nombre (no son productos del catálogo)
const ALIAS_OTRO = { cafe: 'cafe.webp', papa: 'papa.webp', limon: 'limon.webp' }

// Lista de fotos adicionales admitidas si existen en public/img/productos/
// Solo claves con su .webp: en Vercel una ruta inexistente devuelve index.html
// y la tarjeta mostraría el ícono en lugar de otro.webp
const ARCHIVO_POR_NOMBRE_OTRO = new Map([
  ...PRODUCTOS.flatMap((p) => [
    [slugProducto(p.label), ARCHIVO_POR_VALOR.get(p.valor)],
    [slugProducto(p.valor), ARCHIVO_POR_VALOR.get(p.valor)],
  ]),
  ...Object.entries(ALIAS_OTRO),
])

/**
 * Retorna la ruta a la imagen WebP optimizada del producto.
 * Si el producto es OTRO, busca el nombre escrito por el productor entre las etiquetas
 * y valores del catálogo y los alias café, papa y limón; en caso de valor desconocido
 * o sin coincidencia, retorna /img/productos/otro.webp.
 *
 * @param {string} valor - Valor del enum Producto (ej. TOMATE_CHONTO, OTRO).
 * @param {string} [productoOtro] - Nombre personalizado cuando valor === 'OTRO'.
 * @returns {string} Ruta absoluta del asset en public/.
 */
export function imagenProducto(valor, productoOtro) {
  if (!valor) return RUTA_IMAGEN_OTRO

  const normalizado = String(valor).trim().toUpperCase()

  if (normalizado === 'OTRO') {
    const archivo = productoOtro ? ARCHIVO_POR_NOMBRE_OTRO.get(slugProducto(productoOtro)) : null
    return archivo ? `/img/productos/${archivo}` : RUTA_IMAGEN_OTRO
  }

  const archivo = ARCHIVO_POR_VALOR.get(normalizado)
  return archivo ? `/img/productos/${archivo}` : RUTA_IMAGEN_OTRO
}

