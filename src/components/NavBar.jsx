import { useCallback, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CircleUser } from 'lucide-react'

import MenuUsuario from './MenuUsuario'
import { ROL } from '../constants/enums'
import { useAuth } from '../context/AuthContext'

// Enlaces de navegación según el rol del usuario autenticado
// Roller: aquí puedes agregar 'Panel' (/panel) y 'Mis contactos' (/mis-contactos) directamente
const ENLACES_POR_ROL = {
  PRODUCTOR: [
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/mis-ofertas', label: 'Mis cosechas' },
  ],
  COMPRADOR: [
    { to: '/catalogo', label: 'Catálogo' },
  ],
}

export default function NavBar({ subtitulo = 'mercado local' }) {
  const { usuario } = useAuth()
  const location = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const disparadorRef = useRef(null)

  const cerrarMenu = useCallback(() => {
    setMenuAbierto(false)
  }, [])

  // Al cerrar con Escape el menú se desmonta: el foco vuelve al botón para no quedar en el body
  const cerrarMenuConEscape = useCallback(() => {
    setMenuAbierto(false)
    disparadorRef.current?.focus()
  }, [])

  const enlacesRol = usuario ? ENLACES_POR_ROL[usuario.rol] || [] : []
  const esProductor = usuario?.rol === ROL.PRODUCTOR
  const nombreCorto = usuario?.nombre ? usuario.nombre.trim().split(/\s+/)[0] : ''

  return (
    <header className="sticky top-0 z-40 w-full bg-paper/90 backdrop-blur-md border-b border-line">
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between py-4 gap-4">
        <Link to="/" className="flex items-baseline no-underline">
          <span className="font-display font-bold text-xl text-ink tracking-tight">
            CampoRed
          </span>
          {subtitulo && (
            <>
              <span className="text-ink-faint mx-2 hidden sm:inline">·</span>
              <span className="font-body text-sm text-ink-soft hidden sm:inline">
                {subtitulo}
              </span>
            </>
          )}
        </Link>

        {!usuario ? (
          <div className="flex items-center gap-4">
            <Link
              to="/catalogo"
              className="font-mono text-[12.5px] text-ink-soft hover:text-ink no-underline hidden sm:block"
            >
              Catálogo
            </Link>
            <Link
              to="/login"
              className="border border-ink rounded-[4px] px-4 py-2 font-mono text-[12.5px] bg-card text-ink hover:bg-ink hover:text-paper transition-colors no-underline"
            >
              Ingresar
            </Link>
          </div>
        ) : (
          <div className="relative flex items-center gap-4">
            <nav
              aria-label="Navegación principal"
              className="hidden sm:flex items-center gap-4"
            >
              {enlacesRol.map((enlace) => {
                const activo = location.pathname === enlace.to
                return (
                  <Link
                    key={enlace.to}
                    to={enlace.to}
                    className={`font-mono text-[12.5px] no-underline transition-colors ${
                      activo
                        ? 'text-ink font-medium underline underline-offset-4'
                        : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {enlace.label}
                  </Link>
                )
              })}

              <span
                className={
                  esProductor
                    ? 'bg-ok-bg text-ok border border-ok/30 text-xs px-2 py-0.5 rounded-[4px] font-mono uppercase tracking-wider'
                    : 'bg-accent/10 text-accent-dark border border-accent/20 text-xs px-2 py-0.5 rounded-[4px] font-mono uppercase tracking-wider'
                }
              >
                {usuario.rol}
              </span>

              <span className="font-body text-sm font-medium text-ink">
                {nombreCorto}
              </span>
            </nav>

            <button
              ref={disparadorRef}
              type="button"
              data-menu-trigger="true"
              aria-expanded={menuAbierto}
              aria-haspopup="menu"
              aria-controls={menuAbierto ? 'menu-usuario' : undefined}
              aria-label="Menú de usuario"
              onClick={() => setMenuAbierto((prev) => !prev)}
              className="p-1.5 rounded-[4px] border border-transparent hover:border-line hover:bg-card cursor-pointer bg-transparent flex items-center justify-center"
            >
              <CircleUser className="w-6 h-6 text-ink" aria-hidden="true" />
            </button>

            {menuAbierto && (
              <MenuUsuario
                id="menu-usuario"
                usuario={usuario}
                onCerrar={cerrarMenu}
                onEscape={cerrarMenuConEscape}
                enlaces={enlacesRol}
              />
            )}
          </div>
        )}
      </div>
    </header>
  )
}
