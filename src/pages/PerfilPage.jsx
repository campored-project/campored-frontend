import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Campo from '../components/Campo'
import { inputCls } from '../utils/clases'
import NavBar from '../components/NavBar'
import { MUNICIPIOS, labelMunicipio } from '../constants/enums'
import { useAuth } from '../context/AuthContext'

// Patrón del OpenAPI para perfil (acepta cadena vacía para borrar)
const TELEFONO_PERFIL_RE = /^(\+?[0-9]{10,13})?$/

// ─── Helpers ──────────────────────────────────────────────────────────────────

function str(v) {
  return v == null ? '' : String(v)
}

function computarDiffProductor(form, usuario) {
  const diff = {}
  for (const campo of ['telefono', 'whatsapp']) {
    if ((form[campo] ?? '') !== str(usuario[campo])) diff[campo] = form[campo] ?? ''
  }
  for (const campo of ['canalWhatsappHabilitado', 'canalLlamadaHabilitado']) {
    if (Boolean(form[campo]) !== Boolean(usuario[campo])) diff[campo] = Boolean(form[campo])
  }
  return diff
}

function computarDiffComprador(form, usuario) {
  const diff = {}
  for (const campo of ['direccion', 'municipio', 'horarioRecepcion', 'notasAcceso', 'telefono', 'whatsapp']) {
    if ((form[campo] ?? '') !== str(usuario[campo])) diff[campo] = form[campo] ?? ''
  }
  return diff
}

function validarDiffProductor(diff, formCompleto) {
  const e = {}
  if ('telefono' in diff && diff.telefono !== '' && !TELEFONO_PERFIL_RE.test(diff.telefono))
    e.telefono = 'Ej: +573001234567 (10–13 dígitos).'
  if ('whatsapp' in diff && diff.whatsapp !== '' && !TELEFONO_PERFIL_RE.test(diff.whatsapp))
    e.whatsapp = 'Ej: +573001234567 (10–13 dígitos).'
  if (formCompleto.canalWhatsappHabilitado && !formCompleto.whatsapp)
    e.whatsapp = 'Ingresa un número de WhatsApp para habilitar este canal.'
  if (formCompleto.canalLlamadaHabilitado && !formCompleto.telefono)
    e.telefono = 'Ingresa un teléfono para habilitar este canal.'
  return e
}

function validarDiffComprador(diff) {
  const e = {}
  if ('direccion' in diff && !diff.direccion.trim())
    e.direccion = 'La dirección no puede quedar vacía.'
  if ('municipio' in diff && !diff.municipio)
    e.municipio = 'Selecciona un municipio.'
  if ('telefono' in diff && diff.telefono !== '' && !TELEFONO_PERFIL_RE.test(diff.telefono))
    e.telefono = 'Ej: +573001234567 (10–13 dígitos).'
  if ('whatsapp' in diff && diff.whatsapp !== '' && !TELEFONO_PERFIL_RE.test(diff.whatsapp))
    e.whatsapp = 'Ej: +573001234567 (10–13 dígitos).'
  if ('horarioRecepcion' in diff && diff.horarioRecepcion.length > 120)
    e.horarioRecepcion = 'Máximo 120 caracteres.'
  if ('notasAcceso' in diff && diff.notasAcceso.length > 500)
    e.notasAcceso = 'Máximo 500 caracteres.'
  return e
}

// ─── Componente toggle accesible ───────────────────────────────────────────

function Toggle({ id, checked, onChange, disabled, label }) {
  return (
    <div className="flex items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={[
          'relative w-11 h-6 rounded-full border transition-colors shrink-0',
          checked && !disabled ? 'bg-ink border-ink' : 'bg-paper border-line-strong',
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 w-5 h-5 rounded-full bg-card border transition-all',
            checked ? 'left-[18px] border-line' : 'left-0.5 border-line-strong',
          ].join(' ')}
        />
      </button>
      <label
        htmlFor={id}
        className={`font-body text-[14px] ${disabled ? 'text-ink-faint' : 'text-ink cursor-pointer'}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        {label}
      </label>
    </div>
  )
}

// ─── Formulario productor ──────────────────────────────────────────────────

function FormProductor({ usuario, onGuardar, onError401 }) {
  const initForm = () => ({
    telefono: str(usuario.telefono),
    whatsapp: str(usuario.whatsapp),
    canalWhatsappHabilitado: Boolean(usuario.canalWhatsappHabilitado),
    canalLlamadaHabilitado: Boolean(usuario.canalLlamadaHabilitado),
  })

  const [form, setForm] = useState(initForm)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const { actualizarUsuario } = useAuth()

  // Resincronizar si usuario cambia externamente
  const prevUsuario = useRef(usuario)
  useEffect(() => {
    if (prevUsuario.current !== usuario) {
      prevUsuario.current = usuario
      setForm(initForm())
    }
  }, [usuario]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => {
      const sig = { ...prev, [name]: value }
      // Deshabilitar canal automáticamente si se vacía el número
      if (name === 'whatsapp' && !value) sig.canalWhatsappHabilitado = false
      if (name === 'telefono' && !value) sig.canalLlamadaHabilitado = false
      return sig
    })
    setErrores((prev) => ({ ...prev, [name]: undefined }))
    setGuardado(false)
    setErrorGeneral('')
  }

  function handleToggle(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setGuardado(false)
    setErrorGeneral('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const diff = computarDiffProductor(form, usuario)
    if (Object.keys(diff).length === 0) {
      setGuardado(false)
      setErrorGeneral('Sin cambios para guardar.')
      return
    }
    const errs = validarDiffProductor(diff, form)
    if (Object.keys(errs).length > 0) {
      setErrores(errs)
      return
    }
    setCargando(true)
    setErrorGeneral('')
    try {
      await actualizarUsuario(diff)
      setGuardado(true)
      onGuardar?.()
    } catch (err) {
      if (err.status === 401 || err.status === 404) {
        onError401()
        return
      }
      if (err.status === 403) {
        setErrorGeneral('Tu rol no permite esta acción.')
      } else if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrores(err.fieldErrors)
      } else {
        setErrorGeneral(err.message || 'Error al guardar.')
      }
    } finally {
      setCargando(false)
    }
  }

  const puedeWhatsapp = !!form.whatsapp
  const puedeLlamada = !!form.telefono

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-5">
        <Campo id="telefono" label="Teléfono" error={errores.telefono}>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            placeholder="+573001234567 (o vacío para borrar)"
            autoComplete="tel"
            aria-invalid={!!errores.telefono}
            aria-describedby={errores.telefono ? 'telefono-error' : undefined}
            className={inputCls(!!errores.telefono)}
          />
        </Campo>

        <Campo id="whatsapp" label="WhatsApp" error={errores.whatsapp}>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="+573001234567 (o vacío para borrar)"
            aria-invalid={!!errores.whatsapp}
            aria-describedby={errores.whatsapp ? 'whatsapp-error' : undefined}
            className={inputCls(!!errores.whatsapp)}
          />
        </Campo>

        <div className="border border-line bg-card rounded-[6px] p-4 flex flex-col gap-4">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-ink-faint m-0">
            Canales de contacto
          </p>
          <Toggle
            id="canalLlamadaHabilitado"
            checked={form.canalLlamadaHabilitado}
            onChange={(v) => handleToggle('canalLlamadaHabilitado', v)}
            disabled={!puedeLlamada}
            label="Habilitar llamadas (requiere teléfono)"
          />
          <Toggle
            id="canalWhatsappHabilitado"
            checked={form.canalWhatsappHabilitado}
            onChange={(v) => handleToggle('canalWhatsappHabilitado', v)}
            disabled={!puedeWhatsapp}
            label="Habilitar WhatsApp (requiere WhatsApp)"
          />
        </div>

        {errorGeneral && (
          <div role="alert" aria-live="polite" className="text-low text-[13.5px]">
            {errorGeneral}
          </div>
        )}

        {guardado && (
          <div role="status" aria-live="polite" className="text-ok text-[13.5px]">
            Perfil actualizado correctamente.
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="bg-ink text-paper border border-ink rounded-[4px] py-3 font-mono text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

// ─── Formulario comprador ──────────────────────────────────────────────────

function FormComprador({ usuario, onError401 }) {
  const initForm = () => ({
    direccion: str(usuario.direccion),
    municipio: str(usuario.municipio),
    horarioRecepcion: str(usuario.horarioRecepcion),
    notasAcceso: str(usuario.notasAcceso),
    telefono: str(usuario.telefono),
    whatsapp: str(usuario.whatsapp),
  })

  const [form, setForm] = useState(initForm)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const { actualizarUsuario } = useAuth()

  const prevUsuario = useRef(usuario)
  useEffect(() => {
    if (prevUsuario.current !== usuario) {
      prevUsuario.current = usuario
      setForm(initForm())
    }
  }, [usuario]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrores((prev) => ({ ...prev, [name]: undefined }))
    setGuardado(false)
    setErrorGeneral('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const diff = computarDiffComprador(form, usuario)
    if (Object.keys(diff).length === 0) {
      setErrorGeneral('Sin cambios para guardar.')
      return
    }
    const errs = validarDiffComprador(diff)
    if (Object.keys(errs).length > 0) {
      setErrores(errs)
      return
    }
    setCargando(true)
    setErrorGeneral('')
    try {
      await actualizarUsuario(diff)
      setGuardado(true)
    } catch (err) {
      if (err.status === 401 || err.status === 404) {
        onError401()
        return
      }
      if (err.status === 403) {
        setErrorGeneral('Tu rol no permite esta acción.')
      } else if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrores(err.fieldErrors)
      } else {
        setErrorGeneral(err.message || 'Error al guardar.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-5">
        <Campo id="direccion" label="Dirección" error={errores.direccion}>
          <input
            id="direccion"
            name="direccion"
            type="text"
            value={form.direccion}
            onChange={handleChange}
            aria-invalid={!!errores.direccion}
            aria-describedby={errores.direccion ? 'direccion-error' : undefined}
            className={inputCls(!!errores.direccion)}
          />
        </Campo>

        <Campo id="municipio" label="Municipio" error={errores.municipio}>
          <select
            id="municipio"
            name="municipio"
            value={form.municipio}
            onChange={handleChange}
            aria-invalid={!!errores.municipio}
            aria-describedby={errores.municipio ? 'municipio-error' : undefined}
            className={inputCls(!!errores.municipio)}
          >
            {MUNICIPIOS.map(({ valor, label }) => (
              <option key={valor} value={valor}>
                {label}
              </option>
            ))}
          </select>
        </Campo>

        <Campo
          id="horarioRecepcion"
          label="Horario de recepción (opcional)"
          error={errores.horarioRecepcion}
        >
          <input
            id="horarioRecepcion"
            name="horarioRecepcion"
            type="text"
            value={form.horarioRecepcion}
            onChange={handleChange}
            placeholder="Ej. Lunes a sábado, 6:00 a 10:00 a. m."
            aria-invalid={!!errores.horarioRecepcion}
            aria-describedby={errores.horarioRecepcion ? 'horarioRecepcion-error' : undefined}
            className={inputCls(!!errores.horarioRecepcion)}
          />
        </Campo>

        <Campo
          id="notasAcceso"
          label="Notas de acceso (opcional)"
          error={errores.notasAcceso}
        >
          <textarea
            id="notasAcceso"
            name="notasAcceso"
            value={form.notasAcceso}
            onChange={handleChange}
            rows={3}
            placeholder="Ej. Timbre junto a la puerta de carga"
            aria-invalid={!!errores.notasAcceso}
            aria-describedby={errores.notasAcceso ? 'notasAcceso-error' : undefined}
            className={`${inputCls(!!errores.notasAcceso)} resize-y min-h-[72px]`}
          />
        </Campo>

        <Campo id="telefono" label="Teléfono (opcional)" error={errores.telefono}>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            placeholder="+573001234567 (o vacío para borrar)"
            autoComplete="tel"
            aria-invalid={!!errores.telefono}
            aria-describedby={errores.telefono ? 'telefono-error' : undefined}
            className={inputCls(!!errores.telefono)}
          />
        </Campo>

        <Campo id="whatsapp" label="WhatsApp (opcional)" error={errores.whatsapp}>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="+573001234567 (o vacío para borrar)"
            aria-invalid={!!errores.whatsapp}
            aria-describedby={errores.whatsapp ? 'whatsapp-error' : undefined}
            className={inputCls(!!errores.whatsapp)}
          />
        </Campo>

        {errorGeneral && (
          <div role="alert" aria-live="polite" className="text-low text-[13.5px]">
            {errorGeneral}
          </div>
        )}

        {guardado && (
          <div role="status" aria-live="polite" className="text-ok text-[13.5px]">
            Perfil actualizado correctamente.
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="bg-ink text-paper border border-ink rounded-[4px] py-3 font-mono text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

// ─── Página principal ──────────────────────────────────────────────────────

export default function PerfilPage() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleError401() {
    logout()
    navigate('/login', { replace: true })
  }

  const esProductor = usuario?.rol === 'PRODUCTOR'

  return (
    <div>
      <NavBar subtitulo="mi perfil" />
      <div className="max-w-[600px] mx-auto px-6 py-16">
        {/* Encabezado del perfil */}
        <div className="mb-8">
          <h1 className="font-display font-medium text-[28px] tracking-tight mt-0 mb-1">
            {usuario?.nombre}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.07em] text-ink-faint border border-line rounded-full px-3 py-1">
              {esProductor ? 'Productor' : 'Comprador'}
            </span>
            {esProductor && usuario?.municipio && (
              <span className="font-mono text-[11px] text-ink-faint">
                {labelMunicipio(usuario.municipio)}
                {usuario?.vereda ? `, ${usuario.vereda}` : ''}
              </span>
            )}
            {!esProductor && usuario?.nombreNegocio && (
              <span className="font-mono text-[11px] text-ink-faint">
                {usuario.nombreNegocio}
              </span>
            )}
          </div>
        </div>

        {/* Datos de solo lectura */}
        <div className="border border-line bg-card rounded-[6px] p-4 mb-8 flex flex-col gap-2">
          <div className="flex gap-3">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-ink-faint w-24 shrink-0">
              Correo
            </span>
            <span className="font-body text-[13.5px] text-ink">{usuario?.correo}</span>
          </div>
          {esProductor && usuario?.nombreFinca && (
            <div className="flex gap-3">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-ink-faint w-24 shrink-0">
                Finca
              </span>
              <span className="font-body text-[13.5px] text-ink">{usuario.nombreFinca}</span>
            </div>
          )}
          {!esProductor && usuario?.tipoNegocio && (
            <div className="flex gap-3">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-ink-faint w-24 shrink-0">
                Tipo
              </span>
              <span className="font-body text-[13.5px] text-ink capitalize">
                {usuario.tipoNegocio.charAt(0) + usuario.tipoNegocio.slice(1).toLowerCase()}
              </span>
            </div>
          )}
        </div>

        <h2 className="font-display text-[20px] font-medium mt-0 mb-6">
          Editar contacto
        </h2>

        {esProductor ? (
          <FormProductor
            usuario={usuario}
            onError401={handleError401}
          />
        ) : (
          <FormComprador
            usuario={usuario}
            onError401={handleError401}
          />
        )}
      </div>
    </div>
  )
}
