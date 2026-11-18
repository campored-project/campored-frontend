import { useMemo, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import ImagenProducto from '../components/ImagenProducto'
import NavBar from '../components/NavBar'
import Campo from '../components/Campo'
import { crearPedido } from '../api/pedidos'
import { obtenerOferta } from '../api/ofertas'
import {
  JORNADA,
  MODALIDADES_LOGISTICA,
  MUNICIPIOS,
  ROL,
  labelMunicipio,
  labelProducto,
  labelUnidadCorta,
} from '../constants/enums'
import { useAuth } from '../context/AuthContext'
import { formatCOP, formatFechaLocal } from '../utils/formato'
import { inputCls } from '../utils/clases'

function hoyEnColombia() {
  return new Intl.DateTimeFormat('sv', { timeZone: 'America/Bogota' }).format(new Date())
}

function ToggleGroup({ opciones, valor, onChange, error, nombre }) {
  return (
    <div className="flex gap-2">
      {opciones.map((op) => (
        <button
          key={op.valor}
          type="button"
          aria-pressed={valor === op.valor}
          onClick={() => onChange(nombre, op.valor)}
          className={[
            'flex-1 py-2.5 font-mono text-[13px] rounded-[4px] border transition-colors cursor-pointer',
            valor === op.valor
              ? 'border-ink bg-ink text-paper'
              : `border-line-strong bg-card text-ink-soft ${error ? 'border-low' : ''}`,
          ].join(' ')}
        >
          {op.label}
        </button>
      ))}
    </div>
  )
}

export default function CheckoutPage() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [oferta, setOferta] = useState(null)
  const [cargandoOferta, setCargandoOferta] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  const [form, setForm] = useState(() => ({
    cantidadSolicitada: '',
    direccionEntrega: usuario?.direccion ?? '',
    municipioEntrega: usuario?.municipio ?? '',
    fechaPreferida: '',
    jornada: '',
    modalidadEntrega: '',
    notasAcceso: usuario?.notasAcceso ?? '',
  }))

  useEffect(() => {
    obtenerOferta(id)
      .then((o) => {
        if (o.estadoPublicacion === 'AGOTADA') {
          setErrorCarga('Esta oferta ya no está disponible para pedidos.')
          return
        }
        setOferta(o)
      })
      .catch((err) => {
        if (err.status === 404 || err.status === 400)
          setErrorCarga('Esta oferta no existe o ya no está disponible.')
        else setErrorCarga(err.message)
      })
      .finally(() => setCargandoOferta(false))
  }, [id])

  const minFecha = useMemo(() => {
    const hoy = hoyEnColombia()
    if (oferta?.estadoCultivo === 'EN_CRECIMIENTO' && oferta?.fechaEstimadaCosecha) {
      return oferta.fechaEstimadaCosecha > hoy ? oferta.fechaEstimadaCosecha : hoy
    }
    return hoy
  }, [oferta])

  const totalEstimado = useMemo(() => {
    const cant = parseFloat(form.cantidadSolicitada)
    if (!isNaN(cant) && cant > 0 && oferta?.precioUnitario) {
      return cant * oferta.precioUnitario
    }
    return null
  }, [form.cantidadSolicitada, oferta])

  // Hooks antes del return condicional de rol
  if (usuario?.rol !== ROL.COMPRADOR) return <Navigate to={`/catalogo/${id}`} replace />

  if (cargandoOferta) {
    return (
      <>
        <NavBar subtitulo="hacer pedido" />
        <div className="max-w-[640px] mx-auto px-6 py-20 text-center">
          <p className="font-mono text-[13px] text-ink-soft">Cargando oferta…</p>
        </div>
      </>
    )
  }

  if (errorCarga) {
    return (
      <>
        <NavBar subtitulo="hacer pedido" />
        <div className="max-w-[640px] mx-auto px-6 py-20 text-center">
          <p className="font-display text-[22px] text-ink-soft mb-4">{errorCarga}</p>
          <Link to="/catalogo" className="font-mono text-[13px] text-accent-dark no-underline">
            ← Volver al catálogo
          </Link>
        </div>
      </>
    )
  }

  const nombre = oferta.producto === 'OTRO' ? oferta.productoOtro : labelProducto(oferta.producto)
  const unidad = labelUnidadCorta(oferta.unidadMedida)
  const finca = oferta.finca ?? {}
  const requiereModalidad = oferta.modalidadLogistica === 'AMBAS'

  const opcionesModalidad = MODALIDADES_LOGISTICA.filter(
    (m) => m.valor !== 'AMBAS',
  )

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrores((prev) => ({ ...prev, [name]: undefined }))
    setErrorGeneral('')
  }

  function handleToggle(nombre, valor) {
    setForm((prev) => ({ ...prev, [nombre]: valor }))
    setErrores((prev) => ({ ...prev, [nombre]: undefined }))
    setErrorGeneral('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const errs = {}
    if (!form.cantidadSolicitada) {
      errs.cantidadSolicitada = 'La cantidad solicitada es obligatoria.'
    } else {
      const cant = parseFloat(form.cantidadSolicitada)
      if (isNaN(cant) || cant <= 0)
        errs.cantidadSolicitada = 'La cantidad solicitada debe ser mayor que cero.'
      else if (cant > oferta.cantidadDisponible)
        errs.cantidadSolicitada = 'La cantidad solicitada supera la disponible.'
    }
    if (!form.direccionEntrega.trim())
      errs.direccionEntrega = 'La dirección de entrega es obligatoria para continuar.'
    if (!form.municipioEntrega) errs.municipioEntrega = 'El municipio de entrega es obligatorio.'
    if (!form.fechaPreferida) errs.fechaPreferida = 'La fecha preferida de entrega es obligatoria.'
    if (!form.jornada) errs.jornada = 'Debes seleccionar la jornada de entrega: Mañana o Tarde.'
    if (requiereModalidad && !form.modalidadEntrega)
      errs.modalidadEntrega = 'Debes seleccionar la modalidad de entrega.'

    if (Object.keys(errs).length > 0) {
      setErrores(errs)
      return
    }

    setEnviando(true)
    setErrores({})
    setErrorGeneral('')

    try {
      const body = {
        ofertaId: id,
        cantidadSolicitada: parseFloat(form.cantidadSolicitada),
        direccionEntrega: form.direccionEntrega.trim(),
        municipioEntrega: form.municipioEntrega,
        fechaPreferida: form.fechaPreferida,
        jornada: form.jornada,
        notasAcceso: form.notasAcceso.trim() || null,
      }
      if (requiereModalidad) body.modalidadEntrega = form.modalidadEntrega

      const pedido = await crearPedido(body)
      navigate(`/pedidos/${pedido.id}`)
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrores(err.fieldErrors)
      } else if (err.status === 422 || err.status === 404) {
        setErrorGeneral(err.message)
      } else if (err.status === 403) {
        setErrorGeneral('Tu rol no permite realizar pedidos.')
      } else {
        setErrorGeneral(err.message)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <NavBar subtitulo="hacer pedido" />
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
          <div className="absolute inset-0 bg-paper/65" />
        </div>

        <div className="relative w-full max-w-[640px] mx-auto px-6 py-8">
          <Link
            to={`/catalogo/${id}`}
            className="inline-block font-mono text-[12px] text-ink-soft no-underline bg-paper/80 rounded-[4px] px-2 py-1 mb-6"
          >
            ← Volver a la oferta
          </Link>

          <div className="bg-card border border-line rounded-[6px] p-6 md:p-8">
            {/* Resumen de la oferta */}
            <div className="flex gap-4 items-start mb-6">
              <div className="w-[72px] h-[72px] rounded-[6px] overflow-hidden border border-line bg-ok-bg shrink-0">
                <ImagenProducto
                  producto={oferta.producto}
                  productoOtro={oferta.productoOtro}
                  alt={nombre}
                  loading="eager"
                  className="w-full h-full object-cover"
                  tamanoIcono="w-8 h-8"
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-[20px] font-medium m-0 leading-tight">{nombre}</h1>
                <p className="font-mono text-[11px] text-ink-faint m-0 mt-1">
                  {finca.municipio ? labelMunicipio(finca.municipio) : '—'}
                  {finca.nombre ? ` · ${finca.nombre}` : ''}
                </p>
                <p className="font-mono text-[12px] text-ink-soft m-0 mt-2">
                  {formatCOP(oferta.precioUnitario)} / {unidad}
                  <span className="text-ink-faint mx-2">·</span>
                  {oferta.cantidadDisponible} {unidad} disponibles
                </p>
                {oferta.estadoCultivo === 'EN_CRECIMIENTO' && oferta.fechaEstimadaCosecha && (
                  <p className="font-mono text-[11px] text-accent-dark m-0 mt-1">
                    Cosecha estimada: {formatFechaLocal(oferta.fechaEstimadaCosecha)}
                  </p>
                )}
              </div>
            </div>

            <hr className="border-none border-t border-dashed border-line-strong mb-6" />

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-5">
                {/* Tu pedido */}
                <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint m-0">
                  Tu pedido
                </p>

                <Campo id="cantidadSolicitada" label={`Cantidad (${unidad})`} error={errores.cantidadSolicitada}>
                  <input
                    id="cantidadSolicitada"
                    name="cantidadSolicitada"
                    type="text"
                    inputMode="decimal"
                    value={form.cantidadSolicitada}
                    onChange={handleChange}
                    placeholder={`Máximo ${oferta.cantidadDisponible} ${unidad}`}
                    aria-invalid={!!errores.cantidadSolicitada}
                    aria-describedby={errores.cantidadSolicitada ? 'cantidadSolicitada-error' : undefined}
                    className={inputCls(!!errores.cantidadSolicitada)}
                  />
                  {totalEstimado !== null && (
                    <p className="font-mono text-[12.5px] text-ink-soft m-0 mt-1.5">
                      Total estimado:{' '}
                      <span className="text-ink font-medium">{formatCOP(totalEstimado)}</span>
                    </p>
                  )}
                </Campo>

                <hr className="border-none border-t border-dashed border-line-strong" />

                {/* Dónde y cuándo */}
                <p className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint m-0">
                  Dónde y cuándo
                </p>

                <Campo id="direccionEntrega" label="Dirección de entrega" error={errores.direccionEntrega}>
                  <input
                    id="direccionEntrega"
                    name="direccionEntrega"
                    type="text"
                    value={form.direccionEntrega}
                    onChange={handleChange}
                    maxLength={200}
                    aria-invalid={!!errores.direccionEntrega}
                    aria-describedby={errores.direccionEntrega ? 'direccionEntrega-error' : undefined}
                    className={inputCls(!!errores.direccionEntrega)}
                  />
                </Campo>

                <Campo id="municipioEntrega" label="Municipio de entrega" error={errores.municipioEntrega}>
                  <select
                    id="municipioEntrega"
                    name="municipioEntrega"
                    value={form.municipioEntrega}
                    onChange={handleChange}
                    aria-invalid={!!errores.municipioEntrega}
                    aria-describedby={errores.municipioEntrega ? 'municipioEntrega-error' : undefined}
                    className={inputCls(!!errores.municipioEntrega)}
                  >
                    <option value="">Selecciona un municipio</option>
                    {MUNICIPIOS.map(({ valor, label }) => (
                      <option key={valor} value={valor}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Campo>

                <Campo id="fechaPreferida" label="Fecha preferida de entrega" error={errores.fechaPreferida}>
                  <input
                    id="fechaPreferida"
                    name="fechaPreferida"
                    type="date"
                    value={form.fechaPreferida}
                    onChange={handleChange}
                    min={minFecha}
                    aria-invalid={!!errores.fechaPreferida}
                    aria-describedby={errores.fechaPreferida ? 'fechaPreferida-error' : undefined}
                    className={inputCls(!!errores.fechaPreferida)}
                  />
                </Campo>

                <Campo id="jornada" label="Jornada preferida" error={errores.jornada}>
                  <ToggleGroup
                    nombre="jornada"
                    opciones={JORNADA}
                    valor={form.jornada}
                    onChange={handleToggle}
                    error={!!errores.jornada}
                  />
                </Campo>

                {requiereModalidad && (
                  <Campo id="modalidadEntrega" label="Modalidad de entrega" error={errores.modalidadEntrega}>
                    <ToggleGroup
                      nombre="modalidadEntrega"
                      opciones={opcionesModalidad}
                      valor={form.modalidadEntrega}
                      onChange={handleToggle}
                      error={!!errores.modalidadEntrega}
                    />
                  </Campo>
                )}

                <Campo id="notasAcceso" label="Notas de acceso (opcional)" error={errores.notasAcceso}>
                  <textarea
                    id="notasAcceso"
                    name="notasAcceso"
                    value={form.notasAcceso}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    placeholder="Ej. Entrada por la puerta de carga, preguntar por Laura"
                    aria-invalid={!!errores.notasAcceso}
                    aria-describedby={errores.notasAcceso ? 'notasAcceso-error' : undefined}
                    className={`${inputCls(!!errores.notasAcceso)} resize-y min-h-[72px]`}
                  />
                </Campo>

                {errorGeneral && (
                  <div role="alert" aria-live="polite" className="border border-low/30 bg-low-bg rounded-[6px] px-4 py-3">
                    <p className="text-[13.5px] text-low m-0">{errorGeneral}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={enviando}
                  className="bg-ink text-paper border border-ink rounded-[4px] py-3 font-mono text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enviando ? 'Enviando pedido…' : 'Confirmar pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
