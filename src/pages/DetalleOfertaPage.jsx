import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import NavBar from '../components/NavBar'
import { obtenerOferta } from '../api/ofertas'
import {
  ROL,
  labelEstadoCultivo,
  labelModalidad,
  labelMunicipio,
  labelProducto,
  labelUnidadCorta,
} from '../constants/enums'
import { useAuth } from '../context/AuthContext'
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

function Dato({ label, valor }) {
  return (
    <div>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-ink-faint m-0 mb-1">
        {label}
      </p>
      <p className="font-body text-[14px] text-ink m-0">{valor}</p>
    </div>
  )
}

export default function DetalleOfertaPage() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const [oferta, setOferta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerOferta(id)
      .then(setOferta)
      .catch((err) => {
        if (err.status === 404 || err.status === 400 || err.status === 401)
          setError('Esta oferta ya no está disponible.')
        else setError(err.message)
      })
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) {
    return (
      <>
        <NavBar />
        <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
          <p className="font-mono text-[13px] text-ink-faint">Cargando oferta…</p>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
          <p className="font-display text-[22px] text-ink-soft mb-4">{error}</p>
          <Link to="/catalogo" className="font-mono text-[13px] text-accent-dark no-underline">
            ← Volver al catálogo
          </Link>
        </div>
      </>
    )
  }

  const nombre = oferta.producto === 'OTRO' ? oferta.productoOtro : labelProducto(oferta.producto)
  const finca = oferta.finca ?? {}
  const productor = oferta.productor ?? {}
  const esComprador = usuario?.rol === ROL.COMPRADOR
  const tieneContacto = productor.telefonoContacto || productor.whatsappContacto

  return (
    <>
      <NavBar />
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <Link
          to="/catalogo"
          className="font-mono text-[12px] text-ink-faint no-underline"
        >
          ← Catálogo
        </Link>

        <div className="mt-6 bg-card border border-line rounded-[6px] p-6 md:p-8">
          {/* Encabezado */}
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint mb-2">
                {finca.municipio ? labelMunicipio(finca.municipio) : '—'} · {finca.nombre}
                {finca.vereda && ` · Vereda ${finca.vereda}`}
              </p>
              <h1 className="font-display text-[28px] font-medium m-0 leading-tight">{nombre}</h1>
            </div>
            <BadgeEstado estado={oferta.estadoPublicacion ?? 'ACTIVA'} />
          </div>

          {oferta.descripcion && (
            <p className="text-[14px] text-ink-soft leading-relaxed mt-2 mb-0">
              {oferta.descripcion}
            </p>
          )}

          <hr className="border-none border-t border-dashed border-line-strong my-6" />

          {/* Datos de la oferta */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            <Dato
              label="Precio"
              valor={`${formatCOP(oferta.precioUnitario)} / ${labelUnidadCorta(oferta.unidadMedida)}`}
            />
            <Dato
              label="Cantidad"
              valor={`${oferta.cantidadDisponible} ${labelUnidadCorta(oferta.unidadMedida)}`}
            />
            <Dato label="Estado cultivo" valor={labelEstadoCultivo(oferta.estadoCultivo)} />
            <Dato label="Modalidad de entrega" valor={labelModalidad(oferta.modalidadLogistica)} />
            {oferta.diasRestantesCosecha != null && (
              <Dato
                label="Días para cosecha"
                valor={
                  oferta.diasRestantesCosecha === 0 ? 'Hoy' : `${oferta.diasRestantesCosecha} días`
                }
              />
            )}
          </div>

          <hr className="border-none border-t border-dashed border-line-strong my-6" />

          {/* Sección de contacto */}
          <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint mb-4">
            Contactar productor
          </p>

          {!usuario && (
            <div className="border border-line rounded-[4px] bg-ok-bg px-4 py-3">
              <p className="text-[14px] text-ok m-0">
                <Link to="/login" className="text-ok font-medium no-underline underline-offset-2">
                  Inicia sesión como comprador
                </Link>{' '}
                para ver los datos de contacto.
              </p>
            </div>
          )}

          {usuario && !esComprador && (
            <p className="text-[14px] text-ink-soft">
              Solo los compradores pueden ver los datos de contacto del productor.
            </p>
          )}

          {esComprador && !tieneContacto && (
            <p className="text-[14px] text-ink-soft">
              Los datos de contacto no están disponibles en este momento.
            </p>
          )}

          {esComprador && tieneContacto && (
            <div className="flex flex-col gap-2">
              {productor.nombreCompleto && (
                <p className="font-display text-[17px] m-0 mb-2">{productor.nombreCompleto}</p>
              )}
              {productor.whatsappDisponible && productor.whatsappContacto && (
                <a
                  href={`https://wa.me/${productor.whatsappContacto.replace('+', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-6 border border-ok bg-ok-bg rounded-[6px] px-4 py-3 no-underline group"
                >
                  <span className="font-mono text-[12px] text-ok uppercase tracking-wider">WhatsApp</span>
                  <span className="font-mono text-[14px] text-ink">{productor.whatsappContacto}</span>
                </a>
              )}
              {productor.llamadaDisponible && productor.telefonoContacto && (
                <a
                  href={`tel:${productor.telefonoContacto}`}
                  className="flex items-center justify-between gap-6 border border-line-strong bg-card rounded-[6px] px-4 py-3 no-underline"
                >
                  <span className="font-mono text-[12px] text-ink-faint uppercase tracking-wider">Llamar</span>
                  <span className="font-mono text-[14px] text-ink">{productor.telefonoContacto}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
