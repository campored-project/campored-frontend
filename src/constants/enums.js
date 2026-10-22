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

export const PRODUCTOS = [
  { valor: 'TOMATE_CHONTO', label: 'Tomate chonto' },
  { valor: 'CAFE_PERGAMINO', label: 'Café pergamino' },
  { valor: 'MORA_CASTILLA', label: 'Mora de castilla' },
  { valor: 'CILANTRO', label: 'Cilantro' },
  { valor: 'FRIJOL_CARGAMANTO', label: 'Fríjol cargamanto' },
  { valor: 'AGUACATE', label: 'Aguacate' },
  { valor: 'PLATANO', label: 'Plátano' },
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
