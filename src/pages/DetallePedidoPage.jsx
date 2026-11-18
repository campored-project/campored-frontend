import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ImagenProducto from '../components/ImagenProducto'
import NavBar from '../components/NavBar'
import { registrarContacto } from '../api/contactos'
import { obtenerPedido } from '../api/pedidos'
import {
  ROL,
  labelJornada,
  labelModalidad,
  labelMunicipio,
  labelProducto,
  labelUnidadCorta,
} from '../constants/enums'
import { useAuth } from '../context/AuthContext'
import { formatCOP, formatFechaLocal } from '../utils/formato'

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

function abrirYRegistrar(href, canal, ofertaId, pedidoId) {
  window.open(href, '_blank', 'noopener,noreferrer')
  registrarContacto({ ofertaId, canal, pedidoId }).catch(() => {})
}

export default function DetallePedidoPage() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const [pedido, setPedido] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerPedido(id)
      .then(setPedido)
      .catch((err) => {
        if (err.status === 404) setError('Este pedido no existe.')
        else if (err.status === 403) setError('No tienes permiso para ver este pedido.')
        else if (err.status === 400) setError('El identificador del pedido no es válido.')
        else setError(err.message)
      })
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) {
    return (
      <>
        <NavBar subtitulo="detalle del pedido" />
        <div className="max-w-[640px] mx-auto px-6 py-20 text-center">
          <p className="font-mono text-[13px] text-ink-soft">Cargando pedido…</p>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <NavBar subtitulo="detalle del pedido" />
        <div className="max-w-[640px] mx-auto px-6 py-20 text-center">
          <p className="font-display text-[22px] text-ink-soft mb-4">{error}</p>
          <Link to="/catalogo" className="font-mono text-[13px] text-accent-dark no-underline">
            ← Catálogo
          </Link>
        </div>
      </>
    )
  }

  const esProductor = usuario?.rol === ROL.PRODUCTOR
  const { oferta, productor, comprador } = pedido
  const nombre = oferta.producto === 'OTRO' ? oferta.productoOtro : labelProducto(oferta.producto)
  const unidad = labelUnidadCorta(oferta.unidadMedida)
  const volverA = esProductor ? '/pedidos/recibidos' : '/catalogo'
  const volverLabel = esProductor ? '← Pedidos recibidos' : '← Catálogo'

  return (
    <>
      <NavBar subtitulo="detalle del pedido" />
      <div className="relative min-h-[calc(100vh-64px)] flex items-start justify-center">
        {/* Fondo: imagen del producto desenfocada */}
        <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
          <ImagenProducto
            producto={oferta.producto}
            productoOtro={oferta.productoOtro}
            alt=""
            loading="eager"
            className="w-full h-full object-cover blur-sm scale-105"
            tamanoIcono="w-24 h-24"
          />
          <div className="absolute inset-0 bg-paper/60" />
        </div>

        <div className="relative w-full max-w-[600px] mx-auto px-6 py-8">
          <Link
            to={volverA}
            className="inline-block font-mono text-[12px] text-ink-soft no-underline bg-paper/80 rounded-[4px] px-2 py-1 mb-6"
          >
            {volverLabel}
          </Link>

          <div className="bg-card border border-line rounded-[6px] p-6 md:p-8">
            {/* Cabecera fotográfica */}
            <div className="aspect-[16/7] w-full rounded-[6px] overflow-hidden relative mb-6 border border-line bg-ok-bg">
              <ImagenProducto
                producto={oferta.producto}
                productoOtro={oferta.productoOtro}
                alt={nombre}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Encabezado */}
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint mb-2">
                  {labelMunicipio(oferta.municipio)} · {oferta.fincaNombre}
                </p>
                <h1 className="font-display text-[26px] font-medium m-0 leading-tight">{nombre}</h1>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full bg-accent/10 text-accent-dark border border-accent/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                Solicitado
              </span>
            </div>

            <hr className="border-none border-t border-dashed border-line-strong my-6" />

            {/* Datos del pedido */}
            <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint mb-4">
              Resumen del pedido
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              <Dato label="Cantidad" valor={`${pedido.cantidadSolicitada} ${unidad}`} />
              <Dato label="Precio" valor={`${formatCOP(pedido.precioUnitario)} / ${unidad}`} />
              <Dato label="Total estimado" valor={formatCOP(pedido.precioTotalEstimado)} />
              <Dato label="Fecha preferida" valor={formatFechaLocal(pedido.fechaPreferida)} />
              <Dato label="Jornada" valor={labelJornada(pedido.jornada)} />
              <Dato label="Modalidad" valor={labelModalidad(pedido.modalidadEntrega)} />
            </div>

            <hr className="border-none border-t border-dashed border-line-strong my-6" />

            <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint mb-4">
              Dirección de entrega
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
              <Dato label="Dirección" valor={pedido.direccionEntrega} />
              <Dato label="Municipio" valor={labelMunicipio(pedido.municipioEntrega)} />
              {pedido.notasAcceso && (
                <div className="sm:col-span-2">
                  <Dato label="Notas de acceso" valor={pedido.notasAcceso} />
                </div>
              )}
            </div>

            <hr className="border-none border-t border-dashed border-line-strong my-6" />

            {/* Sección de contacto — depende del rol */}
            {esProductor ? (
              <>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint mb-4">
                  Datos del comprador
                </p>
                <div className="flex flex-col gap-2">
                  <p className="font-display text-[17px] m-0 mb-1">
                    {comprador.nombre}
                    {comprador.nombreNegocio && (
                      <span className="font-mono text-[12px] text-ink-faint ml-2">
                        · {comprador.nombreNegocio}
                      </span>
                    )}
                  </p>
                  {comprador.whatsapp && (
                    <a
                      href={`https://wa.me/${comprador.whatsapp.replace('+', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-6 border border-ok bg-ok-bg rounded-[6px] px-4 py-3 no-underline"
                    >
                      <span className="font-mono text-[12px] text-ok uppercase tracking-wider">WhatsApp</span>
                      <span className="font-mono text-[14px] text-ink">{comprador.whatsapp}</span>
                    </a>
                  )}
                  {comprador.telefono && (
                    <a
                      href={`tel:${comprador.telefono}`}
                      className="flex items-center justify-between gap-6 border border-line-strong bg-card rounded-[6px] px-4 py-3 no-underline"
                    >
                      <span className="font-mono text-[12px] text-ink-faint uppercase tracking-wider">Llamar</span>
                      <span className="font-mono text-[14px] text-ink">{comprador.telefono}</span>
                    </a>
                  )}
                  {!comprador.whatsapp && !comprador.telefono && (
                    <p className="text-[14px] text-ink-soft">
                      El comprador no ha registrado datos de contacto.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint mb-4">
                  Contactar al productor
                </p>
                {productor.nombreCompleto && (
                  <p className="font-display text-[17px] m-0 mb-3">{productor.nombreCompleto}</p>
                )}
                <div className="flex flex-col gap-2">
                  {productor.whatsappDisponible && productor.whatsappContacto && (
                    <button
                      type="button"
                      onClick={() =>
                        abrirYRegistrar(
                          `https://wa.me/${productor.whatsappContacto.replace('+', '')}`,
                          'WHATSAPP',
                          oferta.id,
                          pedido.id,
                        )
                      }
                      className="flex items-center justify-between gap-6 border border-ok bg-ok-bg rounded-[6px] px-4 py-3 cursor-pointer w-full text-left"
                    >
                      <span className="font-mono text-[12px] text-ok uppercase tracking-wider">WhatsApp</span>
                      <span className="font-mono text-[14px] text-ink">{productor.whatsappContacto}</span>
                    </button>
                  )}
                  {productor.llamadaDisponible && productor.telefonoContacto && (
                    <button
                      type="button"
                      onClick={() =>
                        abrirYRegistrar(
                          `tel:${productor.telefonoContacto}`,
                          'LLAMADA',
                          oferta.id,
                          pedido.id,
                        )
                      }
                      className="flex items-center justify-between gap-6 border border-line-strong bg-card rounded-[6px] px-4 py-3 cursor-pointer w-full text-left"
                    >
                      <span className="font-mono text-[12px] text-ink-faint uppercase tracking-wider">Llamar</span>
                      <span className="font-mono text-[14px] text-ink">{productor.telefonoContacto}</span>
                    </button>
                  )}
                  {!productor.whatsappDisponible && !productor.llamadaDisponible && (
                    <p className="text-[14px] text-ink-soft">
                      El productor no tiene canales de contacto habilitados en este momento.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
