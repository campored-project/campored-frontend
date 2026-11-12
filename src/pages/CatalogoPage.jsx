import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw, Sprout } from 'lucide-react'

import ImagenProducto from '../components/ImagenProducto'
import NavBar from '../components/NavBar'
import TarjetaOferta from '../components/TarjetaOferta'
import { listarOfertas } from '../api/ofertas'
import {
  ESTADOS_CULTIVO,
  MODALIDADES_LOGISTICA,
  MUNICIPIOS,
  PRODUCTOS,
} from '../constants/enums'

const ESTADO_INICIAL_FILTROS = {
  municipio: '',
  estadoCultivo: '',
  producto: '',
  modalidadLogistica: '',
  page: 0,
  size: 20,
  sort: 'fechaCreacion,desc',
}

export default function CatalogoPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const productoParam = searchParams.get('producto') ?? ''

  const [ofertas, setOfertas] = useState([])
  const [meta, setMeta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [filtros, setFiltros] = useState(() => ({
    ...ESTADO_INICIAL_FILTROS,
    producto: productoParam,
  }))

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

    return () => {
      activo = false
      setCargando(true)
      setError('')
    }
  }, [filtros])

  function cambiarFiltro(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor, page: 0 }))
    if (campo === 'producto') {
      const nuevosParams = new URLSearchParams(searchParams)
      if (valor) {
        nuevosParams.set('producto', valor)
      } else {
        nuevosParams.delete('producto')
      }
      setSearchParams(nuevosParams, { replace: true })
    }
  }

  function limpiarFiltros() {
    setFiltros(ESTADO_INICIAL_FILTROS)
    if (searchParams.has('producto')) {
      const nuevosParams = new URLSearchParams(searchParams)
      nuevosParams.delete('producto')
      setSearchParams(nuevosParams, { replace: true })
    }
  }

  function cambiarPagina(delta) {
    setFiltros((prev) => ({ ...prev, page: prev.page + delta }))
  }

  const totalOfertas = meta?.totalElements ?? ofertas.length
  const hayFiltrosActivos = Boolean(
    filtros.producto ||
      filtros.municipio ||
      filtros.estadoCultivo ||
      filtros.modalidadLogistica,
  )

  return (
    <>
      <NavBar subtitulo="catálogo" />

      {/* Banner superior panorámico */}
      <div
        className="h-44 sm:h-52 w-full bg-cover bg-center relative border-b border-line"
        style={{ backgroundImage: "url('/img/fondos/catalogo.webp')" }}
      >
        <div className="absolute inset-0 bg-paper/85 backdrop-blur-xs flex items-center">
          <div className="max-w-[1180px] w-full mx-auto px-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-accent-dark m-0 mb-1.5">
              Oriente Antioqueño · Venta directa
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink m-0 mb-2">
              Cosechas del Oriente antioqueño
            </h1>
            <p className="font-mono text-[12.5px] text-ink-soft m-0">
              {cargando
                ? 'Consultando ofertas disponibles…'
                : `${totalOfertas} ofertas disponibles`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 pb-16 pt-6">
        {/* Filtro visual de productos (carrusel horizontal) */}
        <div className="mb-4">
          <p className="font-mono text-[10.5px] uppercase tracking-wider text-ink-faint m-0 mb-2">
            Filtrar por cosecha
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
            <button
              type="button"
              onClick={() => cambiarFiltro('producto', '')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-[6px] cursor-pointer flex-shrink-0 transition-all ${
                filtros.producto === ''
                  ? 'border-2 border-ink bg-card shadow-xs text-ink font-medium'
                  : 'border border-line bg-paper hover:bg-card text-ink-soft'
              }`}
            >
              <span className="w-10 h-10 rounded-[4px] bg-ok-bg text-ok flex items-center justify-center flex-shrink-0">
                <Sprout className="w-5 h-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[12px] whitespace-nowrap pr-1">Todos</span>
            </button>

            {PRODUCTOS.map((p) => {
              const activo = filtros.producto === p.valor
              return (
                <button
                  key={p.valor}
                  type="button"
                  onClick={() => cambiarFiltro('producto', p.valor)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-[6px] cursor-pointer flex-shrink-0 transition-all ${
                    activo
                      ? 'border-2 border-ink bg-card shadow-xs text-ink font-medium'
                      : 'border border-line bg-paper hover:bg-card text-ink-soft'
                  }`}
                >
                  <ImagenProducto
                    producto={p.valor}
                    alt={p.label}
                    className="w-10 h-10 object-cover rounded-[4px] flex-shrink-0 bg-ok-bg"
                    tamanoIcono="w-5 h-5"
                  />
                  <span className="font-mono text-[12px] whitespace-nowrap pr-1">
                    {p.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Barra de filtros complementarios */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-3 border-y border-line mb-7">
          <label className="flex items-center gap-2 font-mono text-[11.5px] text-ink-soft">
            <span className="uppercase tracking-wider text-ink-faint text-[10.5px]">
              Municipio:
            </span>
            <select
              value={filtros.municipio}
              onChange={(e) => cambiarFiltro('municipio', e.target.value)}
              className="bg-card border border-line-strong rounded-[4px] px-2.5 py-1.5 font-mono text-[12px] text-ink"
            >
              <option value="">Todos los municipios</option>
              {MUNICIPIOS.map((m) => (
                <option key={m.valor} value={m.valor}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 font-mono text-[11.5px] text-ink-soft">
            <span className="uppercase tracking-wider text-ink-faint text-[10.5px]">
              Estado:
            </span>
            <select
              value={filtros.estadoCultivo}
              onChange={(e) => cambiarFiltro('estadoCultivo', e.target.value)}
              className="bg-card border border-line-strong rounded-[4px] px-2.5 py-1.5 font-mono text-[12px] text-ink"
            >
              <option value="">Todos</option>
              {ESTADOS_CULTIVO.map((e) => (
                <option key={e.valor} value={e.valor}>
                  {e.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 font-mono text-[11.5px] text-ink-soft">
            <span className="uppercase tracking-wider text-ink-faint text-[10.5px]">
              Modalidad:
            </span>
            <select
              value={filtros.modalidadLogistica}
              onChange={(e) => cambiarFiltro('modalidadLogistica', e.target.value)}
              className="bg-card border border-line-strong rounded-[4px] px-2.5 py-1.5 font-mono text-[12px] text-ink"
            >
              <option value="">Todas</option>
              {MODALIDADES_LOGISTICA.map((m) => (
                <option key={m.valor} value={m.valor}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="ml-auto flex items-center gap-1.5 font-mono text-[12px] text-accent-dark hover:text-ink border border-line-strong rounded-[4px] px-3 py-1.5 bg-card cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Limpiar filtros
            </button>
          )}
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
              No hay ofertas con los filtros seleccionados
            </p>
            <p className="font-mono text-[13px] text-ink-faint">
              Prueba cambiando el municipio o el tipo de producto.
            </p>
          </div>
        )}

        {/* Grilla responsiva de tarjetas */}
        {!cargando && !error && ofertas.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
