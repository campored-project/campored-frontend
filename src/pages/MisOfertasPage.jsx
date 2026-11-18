import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import NavBar from '../components/NavBar'
import ModalConfirmacion from '../components/ModalConfirmacion'
import { eliminarOferta, marcarAgotada, misOfertas } from '../api/ofertas'
import {
  ROL,
  labelMunicipio,
  labelProducto,
  labelUnidadCorta,
} from '../constants/enums'
import { useAuth } from '../context/AuthContext'
import { formatCOP } from '../utils/formato'

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

function FilaOferta({ oferta, onMarcarAgotada, onEliminar }) {
  const nombre =
    oferta.producto === 'OTRO' ? oferta.productoOtro : labelProducto(oferta.producto)
  const activa = oferta.estadoPublicacion === 'ACTIVA'
  const municipio = oferta.finca?.municipio ?? oferta.municipio
  const unidad = labelUnidadCorta(oferta.unidadMedida)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[2.4fr_1fr_1fr_1fr_auto] gap-y-1.5 gap-x-3 items-center px-[18px] py-3.5 border-b border-line last:border-b-0">
      <div>
        <span className="font-display text-[15.5px]">{nombre}</span>
        {municipio && (
          <span className="font-mono text-[11px] text-ink-faint block mt-0.5">
            {labelMunicipio(municipio)}
          </span>
        )}
      </div>
      <span className="font-mono text-[13px] text-ink-soft">
        {oferta.cantidadDisponible} {unidad}
      </span>
      <span className="font-mono text-[13px] text-ink-soft">
        {formatCOP(oferta.precioUnitario)}
      </span>
      <span
        className={`flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full w-fit ${
          activa ? 'bg-ok-bg text-ok' : 'bg-line text-ink-faint'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {activa ? 'Activa' : 'Agotada'}
      </span>
      <div className="flex gap-2">
        {activa && (
          <>
            <Link
              to={`/ofertas/${oferta.id}/editar`}
              title="Editar"
              className="border border-line-strong rounded-[4px] w-8 h-8 flex items-center justify-center text-ink-soft no-underline text-[15px]"
            >
              ✎
            </Link>
            <button
              type="button"
              title="Marcar como agotada"
              onClick={onMarcarAgotada}
              className="border border-line-strong rounded-[4px] w-8 h-8 flex items-center justify-center text-ink-soft cursor-pointer text-[14px]"
            >
              ✕
            </button>
          </>
        )}
        <button
          type="button"
          title="Eliminar oferta"
          onClick={onEliminar}
          className="border border-low/40 rounded-[4px] w-8 h-8 flex items-center justify-center text-low cursor-pointer text-[13px] hover:bg-low-bg transition-colors"
        >
          🗑
        </button>
      </div>
    </div>
  )
}

export default function MisOfertasPage() {
  const { usuario } = useAuth()
  const [ofertas, setOfertas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [pendienteAgotada, setPendienteAgotada] = useState(null)
  const [marcando, setMarcando] = useState(false)
  const [errorModal, setErrorModal] = useState('')
  const [pendienteEliminar, setPendienteEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState('')

  useEffect(() => {
    if (usuario?.rol !== ROL.PRODUCTOR) return
    misOfertas()
      .then(setOfertas)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [usuario])

  if (usuario?.rol !== ROL.PRODUCTOR) return <Navigate to="/catalogo" replace />

  async function confirmarAgotada() {
    setMarcando(true)
    setErrorModal('')
    try {
      const actualizada = await marcarAgotada(pendienteAgotada.id)
      setOfertas((prev) => prev.map((o) => (o.id === actualizada.id ? actualizada : o)))
      setPendienteAgotada(null)
    } catch (err) {
      setErrorModal(err.message)
    } finally {
      setMarcando(false)
    }
  }

  async function confirmarEliminar() {
    setEliminando(true)
    setErrorEliminar('')
    try {
      await eliminarOferta(pendienteEliminar.id)
      setOfertas((prev) => prev.filter((o) => o.id !== pendienteEliminar.id))
      setPendienteEliminar(null)
    } catch (err) {
      setErrorEliminar(err.message)
    } finally {
      setEliminando(false)
    }
  }

  const activas = ofertas.filter((o) => o.estadoPublicacion === 'ACTIVA').length

  const nombrePendienteAgotada =
    pendienteAgotada?.producto === 'OTRO'
      ? pendienteAgotada.productoOtro
      : labelProducto(pendienteAgotada?.producto ?? '')

  const nombrePendienteEliminar =
    pendienteEliminar?.producto === 'OTRO'
      ? pendienteEliminar.productoOtro
      : labelProducto(pendienteEliminar?.producto ?? '')

  return (
    <>
      <NavBar subtitulo="panel del productor" />
      <div className="max-w-[980px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-3 py-6">
          <StatCard label="Publicadas" valor={ofertas.length} />
          <StatCard label="Activas" valor={activas} />
          <StatCard label="Agotadas" valor={ofertas.length - activas} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-[20px] font-medium m-0">Mis ofertas</h2>
          <Link
            to="/ofertas/nueva"
            className="bg-ink text-paper border border-ink rounded-[4px] px-4 py-2.5 font-mono text-[12.5px] no-underline"
          >
            + Nueva oferta
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

        {!cargando && !error && ofertas.length === 0 && (
          <div className="py-20 text-center border border-dashed border-line-strong rounded-[6px]">
            <p className="font-display text-[20px] text-ink-soft mb-2">Sin ofertas publicadas</p>
            <p className="font-mono text-[13px] text-ink-faint">
              Crea tu primera oferta para aparecer en el catálogo.
            </p>
          </div>
        )}

        {!cargando && !error && ofertas.length > 0 && (
          <div className="border border-line rounded-[6px] overflow-hidden bg-card">
            <div className="hidden sm:grid grid-cols-[2.4fr_1fr_1fr_1fr_auto] gap-3 items-center px-[18px] py-2.5 bg-paper border-b border-line">
              {['Producto', 'Cantidad', 'Precio', 'Estado', ''].map((h) => (
                <span
                  key={h}
                  className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-faint"
                >
                  {h}
                </span>
              ))}
            </div>
            {ofertas.map((o) => (
              <FilaOferta
                key={o.id}
                oferta={o}
                onMarcarAgotada={() => {
                  setErrorModal('')
                  setPendienteAgotada(o)
                }}
                onEliminar={() => {
                  setErrorEliminar('')
                  setPendienteEliminar(o)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {pendienteAgotada && (
        <ModalConfirmacion
          titulo="Marcar como agotada"
          mensaje={`¿Confirmas que "${nombrePendienteAgotada}" está agotada? Esta acción no se puede revertir.${errorModal ? `\n\nError: ${errorModal}` : ''}`}
          etiquetaConfirmar="Sí, marcar agotada"
          etiquetaCancelar="Cancelar"
          cargando={marcando}
          onConfirmar={confirmarAgotada}
          onCancelar={() => setPendienteAgotada(null)}
        />
      )}

      {pendienteEliminar && (
        <ModalConfirmacion
          titulo="Eliminar oferta"
          mensaje={`¿Estás seguro de que quieres eliminar "${nombrePendienteEliminar}"? Esta acción es irreversible y no se puede deshacer.${errorEliminar ? `\n\nError: ${errorEliminar}` : ''}`}
          etiquetaConfirmar="Sí, eliminar"
          etiquetaCancelar="Cancelar"
          cargando={eliminando}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setPendienteEliminar(null)}
        />
      )}
    </>
  )
}
