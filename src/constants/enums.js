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

export function labelMunicipio(valor) {
  return MUNICIPIOS.find((m) => m.valor === valor)?.label ?? valor
}
