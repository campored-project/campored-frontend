import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { MessageCircle, Phone } from 'lucide-react'

import ImagenProducto from '../components/ImagenProducto'
import NavBar from '../components/NavBar'
import { misContactos } from '../api/contactos'
import { ROL } from '../constants/enums'
import { useAuth } from '../context/AuthContext'
import { formatFechaHora } from '../utils/formato'

function BadgeCanal({ canal }) {
  const esWhatsapp = canal === 'WHATSAPP'
  return (
    <span
      className={[
        'inline-flex items-center gap-1 font-mono text-[10.5px] px-2 py-0.5 rounded-full border',
        esWhatsapp
          ? 'bg-ok-bg text-ok border-ok/30'
          : 'bg-line text-ink-faint border-line-strong',
      ].join(' ')}
    >
      {esWhatsapp ? (
        <MessageCircle className="w-3 h-3" aria-hidden="true" />
      ) : (
        <Phone className="w-3 h-3" aria-hidden="true" />
      )}
      {esWhatsapp ? 'WhatsApp' : 'Llamada'}
    </span>
  )
}

function ItemContacto({ contacto }) {
  return (
    <div className="flex gap-4 items-start px-[18px] py-4 border-b border-line last:border-b-0">
      <div className="w-12 h-12 rounded-[4px] overflow-hidden border border-line bg-ok-bg shrink-0 mt-0.5">
        <ImagenProducto
          producto="OTRO"
          productoOtro={contacto.producto}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
          tamanoIcono="w-5 h-5"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <p className="font-display text-[16px] m-0 leading-snug">{contacto.producto}</p>
          <BadgeCanal canal={contacto.canal} />
        </div>

        <p className="font-mono text-[11px] text-ink-faint m-0 mt-0.5">
          {contacto.productorNombre} · {contacto.fincaNombre}
        </p>

        <p className="font-mono text-[11.5px] text-ink-faint m-0 mt-2">
          {formatFechaHora(contacto.fechaContacto)}
        </p>

        {contacto.pedidoId && (
          <Link
            to={`/pedidos/${contacto.pedidoId}`}
            className="inline-block font-mono text-[11.5px] text-accent-dark no-underline mt-2 hover:underline underline-offset-2"
          >
            Ver pedido →
          </Link>
        )}
      </div>
    </div>
  )
}

export default function MisContactosPage() {
  const { usuario } = useAuth()
  const [contactos, setContactos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (usuario?.rol !== ROL.COMPRADOR) return
    misContactos()
      .then(setContactos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [usuario])

  if (usuario?.rol !== ROL.COMPRADOR) return <Navigate to="/catalogo" replace />

  return (
    <>
      <NavBar subtitulo="mis contactos" />

      {/* Hero con imagen del catálogo */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(243,241,232,0.88), rgba(243,241,232,0.88)), url('/img/fondos/catalogo.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[760px] mx-auto px-6 py-10">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint m-0 mb-2">
            Historial
          </p>
          <h1 className="font-display font-medium text-[30px] m-0 leading-tight">
            Mis contactos
          </h1>
          <p className="font-body text-[14px] text-ink-soft m-0 mt-2">
            Productores con los que has comunicado
          </p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-6 pb-16 pt-8">
        {cargando && (
          <p className="font-mono text-[13px] text-ink-faint py-16 text-center">Cargando…</p>
        )}

        {error && (
          <p role="alert" className="text-low text-[13px] py-16 text-center">
            {error}
          </p>
        )}

        {!cargando && !error && contactos.length === 0 && (
          <div className="py-20 text-center border border-dashed border-line-strong rounded-[6px]">
            <p className="font-display text-[20px] text-ink-soft mb-2">
              Aún no has contactado a ningún productor.
            </p>
            <p className="font-mono text-[13px] text-ink-faint mb-6">
              Explora el catálogo para encontrar productores.
            </p>
            <Link to="/catalogo" className="font-mono text-[13px] text-accent-dark no-underline">
              Ir al catálogo →
            </Link>
          </div>
        )}

        {!cargando && !error && contactos.length > 0 && (
          <div className="border border-line rounded-[6px] overflow-hidden bg-card">
            {contactos.map((c) => (
              <ItemContacto key={c.id} contacto={c} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
