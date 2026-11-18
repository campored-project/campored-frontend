import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

import ImagenProducto from '../components/ImagenProducto'
import NavBar from '../components/NavBar'
import { pedidosRecibidos } from '../api/pedidos'
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

function StatCard({ label, valor }) {
  return (
    <div className="border border-line bg-card rounded-[6px] px-4 py-3.5">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-faint m-0 mb-2">
        {label}
      </p>
      <p className="font-display text-[26px] font-medium m-0">{valor}</p>
    </div>
  )
}

function TarjetaPedido({ pedido }) {
  const { oferta, comprador } = pedido
  const nombre = oferta.producto === 'OTRO' ? oferta.productoOtro : labelProducto(oferta.producto)
  const unidad = labelUnidadCorta(oferta.unidadMedida)

  return (
    <Link
      to={`/pedidos/${pedido.id}`}
      className="flex gap-4 items-start px-[18px] py-4 border-b border-line last:border-b-0 no-underline group hover:bg-paper transition-colors"
    >
      <div className="w-12 h-12 rounded-[4px] overflow-hidden border border-line bg-ok-bg shrink-0 mt-0.5">
        <ImagenProducto
          producto={oferta.producto}
          productoOtro={oferta.productoOtro}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          tamanoIcono="w-5 h-5"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-[16px] m-0 leading-snug">{nombre}</p>
          <span className="font-mono text-[13px] font-medium text-ink shrink-0">
            {formatCOP(pedido.precioTotalEstimado)}
          </span>
        </div>

        <p className="font-mono text-[11px] text-ink-faint m-0 mt-0.5">
          {labelMunicipio(oferta.municipio)} · {oferta.fincaNombre}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
          <span className="font-mono text-[12px] text-ink-soft">
            {pedido.cantidadSolicitada} {unidad}
          </span>
          <span className="font-mono text-[12px] text-ink-soft">
            {formatFechaLocal(pedido.fechaPreferida)} · {labelJornada(pedido.jornada)}
          </span>
          <span className="font-mono text-[12px] text-ink-soft">
            {labelModalidad(pedido.modalidadEntrega)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-[11.5px] text-ink">
            {comprador.nombre}
          </span>
          {comprador.nombreNegocio && (
            <span className="font-mono text-[11px] text-ink-faint">
              · {comprador.nombreNegocio}
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-ink-faint shrink-0 mt-1 group-hover:text-ink transition-colors" />
    </Link>
  )
}

export default function PedidosRecibidosPage() {
  const { usuario } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (usuario?.rol !== ROL.PRODUCTOR) return
    pedidosRecibidos()
      .then(setPedidos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [usuario])

  if (usuario?.rol !== ROL.PRODUCTOR) return <Navigate to="/catalogo" replace />

  return (
    <>
      <NavBar subtitulo="panel del productor" />

      {/* Hero con imagen del panel */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(243,241,232,0.88), rgba(243,241,232,0.88)), url('/img/fondos/panel.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[980px] mx-auto px-6 py-10">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint m-0 mb-2">
            Panel del productor
          </p>
          <h1 className="font-display font-medium text-[30px] m-0 leading-tight">
            Pedidos recibidos
          </h1>
          <p className="font-body text-[14px] text-ink-soft m-0 mt-2">
            Compradores interesados en tus ofertas
          </p>
        </div>
      </div>

      <div className="max-w-[980px] mx-auto px-6 pb-16">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-6">
          <StatCard label="Pedidos recibidos" valor={pedidos.length} />
          <StatCard
            label="Productos únicos"
            valor={new Set(pedidos.map((p) => p.oferta.producto)).size}
          />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-[20px] font-medium m-0">Todos los pedidos</h2>
          <Link
            to="/mis-ofertas"
            className="border border-line-strong bg-card text-ink-soft rounded-[4px] px-4 py-2.5 font-mono text-[12.5px] no-underline hover:text-ink transition-colors"
          >
            Mis ofertas
          </Link>
        </div>

        {cargando && (
          <p className="font-mono text-[13px] text-ink-faint py-16 text-center">Cargando…</p>
        )}

        {error && (
          <p role="alert" className="text-low text-[13px] py-16 text-center">
            {error}
          </p>
        )}

        {!cargando && !error && pedidos.length === 0 && (
          <div className="py-20 text-center border border-dashed border-line-strong rounded-[6px]">
            <p className="font-display text-[20px] text-ink-soft mb-2">Sin pedidos aún</p>
            <p className="font-mono text-[13px] text-ink-faint mb-6">
              Cuando un comprador haga un pedido sobre tus ofertas, aparecerá aquí.
            </p>
            <Link
              to="/mis-ofertas"
              className="font-mono text-[13px] text-accent-dark no-underline"
            >
              Ver mis ofertas →
            </Link>
          </div>
        )}

        {!cargando && !error && pedidos.length > 0 && (
          <div className="border border-line rounded-[6px] overflow-hidden bg-card">
            {pedidos.map((p) => (
              <TarjetaPedido key={p.id} pedido={p} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
