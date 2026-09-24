import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import Campo from '../components/Campo'
import { inputCls } from '../utils/clases'
import NavBar from '../components/NavBar'
import { MUNICIPIOS, TIPOS_NEGOCIO } from '../constants/enums'
import { useAuth } from '../context/AuthContext'

// Reglas del OpenAPI
const TELEFONO_RE = /^\+?[0-9]{10,13}$/
const PASS_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

const INIT_PRODUCTOR = {
  correo: '',
  contrasena: '',
  nombre: '',
  nombreFinca: '',
  municipio: '',
  vereda: '',
  telefono: '',
  whatsapp: '',
}

const INIT_COMPRADOR = {
  correo: '',
  contrasena: '',
  nombre: '',
  nombreNegocio: '',
  tipoNegocio: '',
  municipio: '',
  direccion: '',
  horarioRecepcion: '',
  notasAcceso: '',
  telefono: '',
  whatsapp: '',
}

function validarProductor(f) {
  const e = {}
  if (!f.correo) e.correo = 'Obligatorio.'
  else if (f.correo.length > 150) e.correo = 'Máximo 150 caracteres.'
  if (!f.contrasena) e.contrasena = 'Obligatorio.'
  else if (f.contrasena.length < 8) e.contrasena = 'Mínimo 8 caracteres.'
  else if (f.contrasena.length > 64) e.contrasena = 'Máximo 64 caracteres.'
  else if (!PASS_RE.test(f.contrasena)) e.contrasena = 'Debe incluir mayúscula, minúscula y número.'
  if (!f.nombre) e.nombre = 'Obligatorio.'
  else if (f.nombre.length > 120) e.nombre = 'Máximo 120 caracteres.'
  if (!f.nombreFinca) e.nombreFinca = 'Obligatorio.'
  else if (f.nombreFinca.length > 120) e.nombreFinca = 'Máximo 120 caracteres.'
  if (!f.municipio) e.municipio = 'Selecciona un municipio.'
  if (!f.vereda) e.vereda = 'Obligatorio.'
  else if (f.vereda.length > 120) e.vereda = 'Máximo 120 caracteres.'
  if (!f.telefono) e.telefono = 'Obligatorio.'
  else if (!TELEFONO_RE.test(f.telefono)) e.telefono = 'Ej: +573001234567 (10–13 dígitos).'
  if (f.whatsapp && !TELEFONO_RE.test(f.whatsapp)) e.whatsapp = 'Ej: +573001234567 (10–13 dígitos).'
  return e
}

function validarComprador(f) {
  const e = {}
  if (!f.correo) e.correo = 'Obligatorio.'
  else if (f.correo.length > 150) e.correo = 'Máximo 150 caracteres.'
  if (!f.contrasena) e.contrasena = 'Obligatorio.'
  else if (f.contrasena.length < 8) e.contrasena = 'Mínimo 8 caracteres.'
  else if (f.contrasena.length > 64) e.contrasena = 'Máximo 64 caracteres.'
  else if (!PASS_RE.test(f.contrasena)) e.contrasena = 'Debe incluir mayúscula, minúscula y número.'
  if (!f.nombre) e.nombre = 'Obligatorio.'
  else if (f.nombre.length < 2) e.nombre = 'Mínimo 2 caracteres.'
  else if (f.nombre.length > 120) e.nombre = 'Máximo 120 caracteres.'
  if (!f.nombreNegocio) e.nombreNegocio = 'Obligatorio.'
  else if (f.nombreNegocio.length > 120) e.nombreNegocio = 'Máximo 120 caracteres.'
  if (!f.tipoNegocio) e.tipoNegocio = 'Selecciona el tipo de negocio.'
  if (!f.municipio) e.municipio = 'Selecciona un municipio.'
  if (!f.direccion) e.direccion = 'Obligatorio.'
  else if (f.direccion.length > 200) e.direccion = 'Máximo 200 caracteres.'
  if (f.telefono && !TELEFONO_RE.test(f.telefono)) e.telefono = 'Ej: +573001234567 (10–13 dígitos).'
  if (f.whatsapp && !TELEFONO_RE.test(f.whatsapp)) e.whatsapp = 'Ej: +573001234567 (10–13 dígitos).'
  if (f.horarioRecepcion && f.horarioRecepcion.length > 120) e.horarioRecepcion = 'Máximo 120 caracteres.'
  if (f.notasAcceso && f.notasAcceso.length > 500) e.notasAcceso = 'Máximo 500 caracteres.'
  return e
}

function rolValido(r) {
  return r === 'PRODUCTOR' || r === 'COMPRADOR'
}

export default function RegistroPage() {
  const [searchParams] = useSearchParams()
  const rolParam = searchParams.get('rol')

  const rolInicial = rolValido(rolParam) ? rolParam : null
  const [rol, setRol] = useState(rolInicial)
  const [form, setForm] = useState(
    rolInicial === 'PRODUCTOR' ? INIT_PRODUCTOR
    : rolInicial === 'COMPRADOR' ? INIT_COMPRADOR
    : {},
  )
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(false)

  const { registrarProductor, registrarComprador } = useAuth()
  const navigate = useNavigate()

  function cambiarRol(nuevoRol) {
    setRol(nuevoRol)
    setForm(nuevoRol === 'PRODUCTOR' ? INIT_PRODUCTOR : INIT_COMPRADOR)
    setErrores({})
    setErrorGeneral('')
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrores((prev) => ({ ...prev, [name]: undefined }))
    setErrorGeneral('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validar = rol === 'PRODUCTOR' ? validarProductor : validarComprador
    const errs = validar(form)
    if (Object.keys(errs).length > 0) {
      setErrores(errs)
      return
    }

    setCargando(true)
    setErrorGeneral('')
    try {
      if (rol === 'PRODUCTOR') {
        const payload = { ...form }
        if (!payload.whatsapp) delete payload.whatsapp
        await registrarProductor(payload)
      } else {
        const payload = { ...form }
        if (!payload.telefono) delete payload.telefono
        if (!payload.whatsapp) delete payload.whatsapp
        if (!payload.horarioRecepcion) delete payload.horarioRecepcion
        if (!payload.notasAcceso) delete payload.notasAcceso
        await registrarComprador(payload)
      }
      navigate('/perfil', { replace: true })
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErrores(err.fieldErrors)
      } else if (err.status === 409) {
        setErrorGeneral('Este correo ya está registrado.')
      } else {
        setErrorGeneral(err.message || 'Error al registrarse. Intenta de nuevo.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>
      <NavBar />
      <div className="max-w-[600px] mx-auto px-6 py-16">
        <h1 className="font-display font-medium text-[32px] tracking-tight mt-0 mb-2">
          Crear cuenta
        </h1>
        <p className="text-ink-soft text-[14px] mt-0 mb-8">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-accent underline">
            Inicia sesión
          </Link>
        </p>

        {/* Selector de rol */}
        {!rol ? (
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-ink-faint mb-4">
              ¿Cómo vas a usar CampoRed?
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => cambiarRol('PRODUCTOR')}
                className="border border-line-strong bg-card rounded-[6px] px-5 py-4 text-left cursor-pointer"
              >
                <div className="font-display text-[17px] font-medium text-ink mb-1">
                  Soy productor
                </div>
                <div className="font-body text-[13.5px] text-ink-soft">
                  Publico mis cosechas y vendo directo a compradores.
                </div>
              </button>
              <button
                type="button"
                onClick={() => cambiarRol('COMPRADOR')}
                className="border border-line-strong bg-card rounded-[6px] px-5 py-4 text-left cursor-pointer"
              >
                <div className="font-display text-[17px] font-medium text-ink mb-1">
                  Soy comprador
                </div>
                <div className="font-body text-[13.5px] text-ink-soft">
                  Compro para mi restaurante, tienda o negocio.
                </div>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.07em] text-ink-faint border border-line rounded-full px-3 py-1">
                {rol === 'PRODUCTOR' ? 'Productor' : 'Comprador'}
              </span>
              <button
                type="button"
                onClick={() => { setRol(null); setForm({}); setErrores({}); setErrorGeneral('') }}
                className="font-mono text-[11px] text-accent underline cursor-pointer border-none bg-transparent p-0"
              >
                Cambiar
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {/* Campos comunes */}
              <Campo id="correo" label="Correo electrónico" error={errores.correo}>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={form.correo ?? ''}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-invalid={!!errores.correo}
                  aria-describedby={errores.correo ? 'correo-error' : undefined}
                  className={inputCls(!!errores.correo)}
                />
              </Campo>

              <Campo id="contrasena" label="Contraseña" error={errores.contrasena}>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  value={form.contrasena ?? ''}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-invalid={!!errores.contrasena}
                  aria-describedby={errores.contrasena ? 'contrasena-error' : undefined}
                  className={inputCls(!!errores.contrasena)}
                />
                <span className="font-mono text-[11px] text-ink-faint">
                  Mínimo 8 caracteres · mayúscula · minúscula · número
                </span>
              </Campo>

              <Campo id="nombre" label="Nombre completo" error={errores.nombre}>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={form.nombre ?? ''}
                  onChange={handleChange}
                  autoComplete="name"
                  aria-invalid={!!errores.nombre}
                  aria-describedby={errores.nombre ? 'nombre-error' : undefined}
                  className={inputCls(!!errores.nombre)}
                />
              </Campo>

              {/* Campos exclusivos del productor */}
              {rol === 'PRODUCTOR' && (
                <>
                  <Campo id="nombreFinca" label="Nombre de la finca" error={errores.nombreFinca}>
                    <input
                      id="nombreFinca"
                      name="nombreFinca"
                      type="text"
                      value={form.nombreFinca ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errores.nombreFinca}
                      aria-describedby={errores.nombreFinca ? 'nombreFinca-error' : undefined}
                      className={inputCls(!!errores.nombreFinca)}
                    />
                  </Campo>

                  <Campo id="municipio" label="Municipio" error={errores.municipio}>
                    <select
                      id="municipio"
                      name="municipio"
                      value={form.municipio ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errores.municipio}
                      aria-describedby={errores.municipio ? 'municipio-error' : undefined}
                      className={inputCls(!!errores.municipio)}
                    >
                      <option value="">Selecciona un municipio</option>
                      {MUNICIPIOS.map(({ valor, label }) => (
                        <option key={valor} value={valor}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Campo>

                  <Campo id="vereda" label="Vereda" error={errores.vereda}>
                    <input
                      id="vereda"
                      name="vereda"
                      type="text"
                      value={form.vereda ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errores.vereda}
                      aria-describedby={errores.vereda ? 'vereda-error' : undefined}
                      className={inputCls(!!errores.vereda)}
                    />
                  </Campo>
                </>
              )}

              {/* Campos exclusivos del comprador */}
              {rol === 'COMPRADOR' && (
                <>
                  <Campo id="nombreNegocio" label="Nombre del negocio" error={errores.nombreNegocio}>
                    <input
                      id="nombreNegocio"
                      name="nombreNegocio"
                      type="text"
                      value={form.nombreNegocio ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errores.nombreNegocio}
                      aria-describedby={errores.nombreNegocio ? 'nombreNegocio-error' : undefined}
                      className={inputCls(!!errores.nombreNegocio)}
                    />
                  </Campo>

                  <Campo id="tipoNegocio" label="Tipo de negocio" error={errores.tipoNegocio}>
                    <select
                      id="tipoNegocio"
                      name="tipoNegocio"
                      value={form.tipoNegocio ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errores.tipoNegocio}
                      aria-describedby={errores.tipoNegocio ? 'tipoNegocio-error' : undefined}
                      className={inputCls(!!errores.tipoNegocio)}
                    >
                      <option value="">Selecciona el tipo</option>
                      {TIPOS_NEGOCIO.map(({ valor, label }) => (
                        <option key={valor} value={valor}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Campo>

                  <Campo id="municipio" label="Municipio" error={errores.municipio}>
                    <select
                      id="municipio"
                      name="municipio"
                      value={form.municipio ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errores.municipio}
                      aria-describedby={errores.municipio ? 'municipio-error' : undefined}
                      className={inputCls(!!errores.municipio)}
                    >
                      <option value="">Selecciona un municipio</option>
                      {MUNICIPIOS.map(({ valor, label }) => (
                        <option key={valor} value={valor}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </Campo>

                  <Campo id="direccion" label="Dirección del negocio" error={errores.direccion}>
                    <input
                      id="direccion"
                      name="direccion"
                      type="text"
                      value={form.direccion ?? ''}
                      onChange={handleChange}
                      aria-invalid={!!errores.direccion}
                      aria-describedby={errores.direccion ? 'direccion-error' : undefined}
                      className={inputCls(!!errores.direccion)}
                    />
                  </Campo>
                </>
              )}

              {/* Teléfono: obligatorio para productor, opcional para comprador */}
              <Campo
                id="telefono"
                label={rol === 'PRODUCTOR' ? 'Teléfono' : 'Teléfono (opcional)'}
                error={errores.telefono}
              >
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={form.telefono ?? ''}
                  onChange={handleChange}
                  autoComplete="tel"
                  placeholder="+573001234567"
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
                  value={form.whatsapp ?? ''}
                  onChange={handleChange}
                  placeholder="+573001234567"
                  aria-invalid={!!errores.whatsapp}
                  aria-describedby={errores.whatsapp ? 'whatsapp-error' : undefined}
                  className={inputCls(!!errores.whatsapp)}
                />
              </Campo>

              {/* Campos opcionales extra del comprador */}
              {rol === 'COMPRADOR' && (
                <>
                  <Campo
                    id="horarioRecepcion"
                    label="Horario de recepción (opcional)"
                    error={errores.horarioRecepcion}
                  >
                    <input
                      id="horarioRecepcion"
                      name="horarioRecepcion"
                      type="text"
                      value={form.horarioRecepcion ?? ''}
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
                      value={form.notasAcceso ?? ''}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Ej. Entrada de proveedores por la parte trasera"
                      aria-invalid={!!errores.notasAcceso}
                      aria-describedby={errores.notasAcceso ? 'notasAcceso-error' : undefined}
                      className={`${inputCls(!!errores.notasAcceso)} resize-y min-h-[72px]`}
                    />
                  </Campo>
                </>
              )}

              {errorGeneral && (
                <div role="alert" aria-live="polite" className="text-low text-[13.5px]">
                  {errorGeneral}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="bg-ink text-paper border border-ink rounded-[4px] py-3 font-mono text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? 'Registrando…' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
