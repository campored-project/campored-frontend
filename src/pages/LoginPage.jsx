import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Campo from '../components/Campo'
import { inputCls } from '../utils/clases'
import NavBar from '../components/NavBar'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ correo: '', contrasena: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await login(form.correo, form.contrasena)
      navigate('/catalogo', { replace: true })
    } catch (err) {
      if (err.status === 401) {
        setError('Correo o contraseña incorrectos.')
      } else if (err.status === 0) {
        setError(err.message)
      } else {
        setError(err.message || 'Error al iniciar sesión.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)] flex-1">
        {/* Columna izquierda visual (solo escritorio) */}
        <div className="hidden lg:flex relative bg-[url('/img/fondos/auth.webp')] bg-cover bg-center border-r border-line">
          <div className="w-full h-full bg-linear-to-t from-ink/85 via-ink/35 to-transparent p-12 flex flex-col justify-end text-paper">
            <p className="font-mono text-xs uppercase tracking-wider text-paper/80 m-0 mb-3">
              Red Agrícola Directa
            </p>
            <p className="font-display text-2xl font-semibold leading-snug m-0 mb-3 max-w-[460px]">
              Cosechas frescas del campo antioqueño conectadas directamente con comercios locales,
              sin intermediación.
            </p>
            <p className="font-mono text-xs text-paper/75 m-0">
              Oriente Antioqueño · Colombia
            </p>
          </div>
        </div>

        {/* Columna derecha (formulario) */}
        <div className="flex items-center justify-center p-6 sm:p-10 bg-paper">
          <div className="w-full max-w-md bg-card border border-line rounded-[6px] p-6 sm:p-8">
            <h1 className="font-display font-medium text-[32px] tracking-tight mt-0 mb-2">
              Iniciar sesión
            </h1>
            <p className="text-ink-soft text-[14px] mt-0 mb-8">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-accent underline">
                Regístrate aquí
              </Link>
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-5">
                <Campo id="correo" label="Correo electrónico" error="">
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className={inputCls(false)}
                  />
                </Campo>

                <Campo id="contrasena" label="Contraseña" error="">
                  <input
                    id="contrasena"
                    name="contrasena"
                    type="password"
                    value={form.contrasena}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className={inputCls(false)}
                  />
                </Campo>

                {error && (
                  <div role="alert" aria-live="polite" className="text-low text-[13.5px]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={cargando}
                  className="bg-ink text-paper border border-ink rounded-[4px] py-3 font-mono text-[13px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cargando ? 'Iniciando sesión…' : 'Iniciar sesión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
