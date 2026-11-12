import { Link } from 'react-router-dom'
import { MapPin, Truck } from 'lucide-react'

import ImagenProducto from './ImagenProducto'
import {
  labelModalidad,
  labelMunicipio,
  labelProducto,
  labelUnidadCorta,
} from '../constants/enums'
import { formatCOP } from '../utils/formato'

function BadgeSuperpuesto({ estadoPublicacion, estadoCultivo }) {
  if (estadoPublicacion && estadoPublicacion !== 'ACTIVA') {
    return (
      <span className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full bg-paper/90 text-ink-faint border border-line-strong backdrop-blur-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        Agotada
      </span>
    )
  }

  const enCrecimiento = estadoCultivo === 'EN_CRECIMIENTO'
  return (
    <span
      className={`absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full backdrop-blur-xs ${
        enCrecimiento
          ? 'bg-low-bg/90 text-low border border-low/30'
          : 'bg-ok-bg/90 text-ok border border-ok/30'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {enCrecimiento ? 'En cultivo' : 'Disponible'}
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
    oferta.producto === 'OTRO'
      ? oferta.productoOtro || 'Producto agrícola'
      : labelProducto(oferta.producto)
  const finca = getFinca(oferta)
  const esDespacho =
    oferta.modalidadLogistica === 'DESPACHO_PRODUCTOR' ||
    oferta.modalidadLogistica === 'AMBAS'

  const contenido = (
    <>
      <div className="aspect-[4/3] w-full overflow-hidden relative rounded-t-[6px] bg-ok-bg border-b border-line">
        <ImagenProducto
          producto={oferta.producto}
          productoOtro={oferta.productoOtro}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <BadgeSuperpuesto
          estadoPublicacion={oferta.estadoPublicacion}
          estadoCultivo={oferta.estadoCultivo}
        />
      </div>

      <div className="p-[18px] flex flex-col flex-1 justify-between">
        <div>
          <p className="font-display text-[19px] font-semibold text-ink m-0 mb-1 leading-tight">
            {nombre}
          </p>
          <p className="text-sm text-ink-soft m-0">
            {finca.nombre ? `${finca.nombre} · ` : ''}
            {finca.municipio ? labelMunicipio(finca.municipio) : '—'}
          </p>
        </div>

        <hr className="border-none border-t border-dashed border-line-strong my-3.5" />

        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="font-mono text-[21px] font-medium text-accent-dark">
              {formatCOP(oferta.precioUnitario)}
            </span>
            <span className="text-sm text-ink-soft ml-1">
              / {labelUnidadCorta(oferta.unidadMedida)}
            </span>
          </div>
        </div>

        {oferta.modalidadLogistica && (
          <p className="text-sm text-ink-soft m-0 mt-2.5 flex items-center">
            {esDespacho ? (
              <Truck className="w-4 h-4 inline mr-1.5 text-ink-soft flex-shrink-0" aria-hidden="true" />
            ) : (
              <MapPin className="w-4 h-4 inline mr-1.5 text-ink-soft flex-shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">{labelModalidad(oferta.modalidadLogistica)}</span>
          </p>
        )}

        {acciones ? (
          <div className="mt-3.5">{acciones}</div>
        ) : (
          <span className="mt-3.5 w-full py-2 border border-ink rounded-[4px] font-mono text-[12px] text-ink text-center block group-hover:bg-ink group-hover:text-paper transition-colors">
            Ver detalle
          </span>
        )}
      </div>
    </>
  )

  if (acciones) {
    return (
      <div className="bg-card border border-line rounded-[6px] relative flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
        {contenido}
      </div>
    )
  }

  return (
    <Link
      to={`/catalogo/${oferta.id}`}
      className="bg-card border border-line rounded-[6px] relative flex flex-col overflow-hidden hover:shadow-md transition-shadow group no-underline text-ink"
    >
      {contenido}
    </Link>
  )
}
