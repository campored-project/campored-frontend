import { useEffect, useState } from 'react'

import NavBar from '../components/NavBar'
import TarjetaOferta from '../components/TarjetaOferta'
import { listarOfertas } from '../api/ofertas'
import {
  ESTADOS_CULTIVO,
  MODALIDADES_LOGISTICA,
  MUNICIPIOS,
  PRODUCTOS,
} from '../constants/enums'

function chipCls(activo) {
  return [
    'flex-shrink-0 font-mono text-[12px] px-3 py-1.5 border rounded-full cursor-pointer whitespace-nowrap transition-colors duration-100',
    activo
      ? 'bg-ink border-ink text-paper'
      : 'bg-card border-line-strong text-ink-soft',
  ].join(' ')
}

const FILTROS_ESTADO = [{ valor: '', label: 'Todos' }, ...ESTADOS_CULTIVO]
const FILTROS_PRODUCTO = [{ valor: '', label: 'Todos' }, ...PRODUCTOS]

export default function CatalogoPage() {
  const [ofertas, setOfertas] = useState([])
  const [meta, setMeta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [filtros, setFiltros] = useState({
    municipio: '',
    estadoCultivo: '',
    producto: '',
    modalidadLogistica: '',
    page: 0,
    size: 20,
    sort: 'fechaCreacion,desc',
  })

  useEffect(() => {
    let activo = true

    listarOfertas(filtros)
      .then((data) => {
        if (activo) {
          setOfertas(data.content)
          setMeta(data)
          setCargando(false)
        }
      })
      .catch((err) => {
        if (activo) {
          setError(err.message)
          setCargando(false)
        }
      })

    // Al limpiar (cambio de filtros): marcar como cargando para el próximo ciclo
    return () => {
      activo = false
      setCargando(true)
      setError('')
    }
  }, [filtros])

  function cambiarFiltro(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor, page: 0 }))
  }

  function cambiarPagina(delta) {
    setFiltros((prev) => ({ ...prev, page: prev.page + delta }))
  }

  return (
    <>
      <NavBar subtitulo="catálogo" />

      <div className="max-w-[1180px] mx-auto px-6 pb-16">
        {/* Barra de stats */}
        <div className="border-b border-line py-3 mb-0">
          <p className="font-mono text-[12px] text-ink-faint tracking-wide">
            {meta && !cargando
              ? `${meta.totalElements} oferta${meta.totalElements !== 1 ? 's' : ''} disponibles`
              : ' '}
          </p>
        </div>

        {/* Filtros de municipio */}
        <div className="flex gap-2 py-4 overflow-x-auto border-b border-line">
          <button
            onClick={() => cambiarFiltro('municipio', '')}
            className={chipCls(filtros.municipio === '')}
          >
            Todos
          </button>
          {MUNICIPIOS.map((m) => (
            <button
              key={m.valor}
              onClick={() => cambiarFiltro('municipio', m.valor)}
              className={chipCls(filtros.municipio === m.valor)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Filtros de producto */}
        <div className="flex gap-2 py-3 overflow-x-auto border-b border-line">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint self-center mr-1 flex-shrink-0">
            Producto:
          </span>
          {FILTROS_PRODUCTO.map((p) => (
            <button
              key={p.valor}
              onClick={() => cambiarFiltro('producto', p.valor)}
              className={chipCls(filtros.producto === p.valor)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Filtros secundarios: estado + modalidad */}
        <div className="flex flex-wrap gap-2 py-3 border-b border-line mb-7">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint self-center mr-1">
            Estado:
          </span>
          {FILTROS_ESTADO.map((e) => (
            <button
              key={e.valor}
              onClick={() => cambiarFiltro('estadoCultivo', e.valor)}
              className={chipCls(filtros.estadoCultivo === e.valor)}
            >
              {e.label}
            </button>
          ))}
          <span className="w-px bg-line-strong mx-1 self-stretch" />
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint self-center mr-1">
            Entrega:
          </span>
          <button
            onClick={() => cambiarFiltro('modalidadLogistica', '')}
            className={chipCls(filtros.modalidadLogistica === '')}
          >
            Todas
          </button>
          {MODALIDADES_LOGISTICA.map((m) => (
            <button
              key={m.valor}
              onClick={() => cambiarFiltro('modalidadLogistica', m.valor)}
              className={chipCls(filtros.modalidadLogistica === m.valor)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Estado de carga */}
        {cargando && (
          <p className="font-mono text-[13px] text-ink-faint py-16 text-center">
            Cargando ofertas…
          </p>
        )}

        {!cargando && error && (
          <p role="alert" className="font-mono text-[13px] text-low py-16 text-center">
            {error}
          </p>
        )}

        {/* Estado vacío */}
        {!cargando && !error && ofertas.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display text-[22px] text-ink-soft mb-2">
              Sin ofertas con estos filtros
            </p>
            <p className="font-mono text-[13px] text-ink-faint">
              Prueba cambiando el municipio o el tipo de producto.
            </p>
          </div>
        )}

        {/* Grid de tarjetas */}
        {!cargando && !error && ofertas.length > 0 && (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
              {ofertas.map((o) => (
                <TarjetaOferta key={o.id} oferta={o} />
              ))}
            </div>

            {/* Paginación */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-12 font-mono text-[13px]">
                <button
                  disabled={meta.first}
                  onClick={() => cambiarPagina(-1)}
                  className="border border-line-strong rounded-[4px] px-4 py-2 text-ink-soft disabled:opacity-40 cursor-pointer"
                >
                  ← Anterior
                </button>
                <span className="text-ink-faint">
                  Página {meta.number + 1} de {meta.totalPages}
                </span>
                <button
                  disabled={meta.last}
                  onClick={() => cambiarPagina(1)}
                  className="border border-line-strong rounded-[4px] px-4 py-2 text-ink-soft disabled:opacity-40 cursor-pointer"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
