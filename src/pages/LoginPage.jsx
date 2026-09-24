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
      navigate('/perfil', { replace: true })
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
    <div>
      <NavBar />
      <div className="max-w-[480px] mx-auto px-6 py-16">
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
  )
}
