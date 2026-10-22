import { Link } from 'react-router-dom'

import {
  labelMunicipio,
  labelProducto,
  labelUnidadCorta,
} from '../constants/enums'
import { formatCOP } from '../utils/formato'

function BadgeEstado({ estado }) {
  const activa = estado === 'ACTIVA'
  return (
    <span
      className={`flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full ${
        activa ? 'bg-ok-bg text-ok' : 'bg-line text-ink-faint'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {activa ? 'Disponible' : 'Agotada'}
    </span>
  )
}

// La tarjeta tolera tanto la estructura del catálogo público (finca anidada)
// como la de mis-ofertas (fincaNombre y municipio planos)
function getFinca(oferta) {
  return {
    nombre: oferta.finca?.nombre ?? oferta.fincaNombre ?? '',
    municipio: oferta.finca?.municipio ?? oferta.municipio ?? '',
  }
}

export default function TarjetaOferta({ oferta, acciones = null }) {
  const nombre =
    oferta.producto === 'OTRO' ? oferta.productoOtro : labelProducto(oferta.producto)
  const finca = getFinca(oferta)
  return (
    <div className="bg-card border border-line rounded-[6px] p-[18px] relative flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-200">
<span className="absolute top-3.5 left-3.5 w-[7px] h-[7px] rounded-full bg-paper border border-line-strong" />

      <div className="pl-5">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint mb-2">
          {finca.municipio ? labelMunicipio(finca.municipio) : '—'} ·{' '}
          {labelUnidadCorta(oferta.unidadMedida)}
        </p>
        <p className="font-display text-[19px] font-medium m-0 mb-1 leading-tight">{nombre}</p>
        <p className="text-[13px] text-ink-soft m-0">{finca.nombre}</p>
      </div>

      <hr className="border-none border-t border-dashed border-line-strong my-4" />

      <div className="flex items-end justify-between gap-2">
        <div className="font-mono">
          <span className="text-[21px] font-medium text-accent-dark">
            {formatCOP(oferta.precioUnitario)}
          </span>
          <span className="block text-[11px] text-ink-faint mt-0.5">
            por {labelUnidadCorta(oferta.unidadMedida)}
          </span>
        </div>
        <BadgeEstado estado={oferta.estadoPublicacion ?? 'ACTIVA'} />
      </div>

      {acciones ?? (
        <Link
          to={`/catalogo/${oferta.id}`}
          className="mt-3.5 w-full py-2.5 border border-ink rounded-[4px] font-mono text-[12px] text-ink text-center no-underline block"
        >
          Ver detalle
        </Link>
      )}
    </div>
  )
}
