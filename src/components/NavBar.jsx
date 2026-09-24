import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar({ subtitulo = 'mercado local' }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b border-line">
      <div className="max-w-[1180px] mx-auto px-6 flex items-center justify-between py-5 gap-4 flex-wrap">
        <Link to="/" className="flex items-baseline gap-2.5 no-underline">
          <span className="font-display font-semibold text-[23px] text-ink tracking-tight leading-none">
            CampoRed
          </span>
          <span className="font-mono text-[10.5px] text-ink-faint uppercase tracking-wider">
            {subtitulo}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {usuario ? (
            <>
              <Link
                to="/perfil"
                className="font-mono text-[12.5px] text-ink-soft no-underline"
              >
                {usuario.nombre}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="border border-line-strong rounded-[4px] px-4 py-2 font-mono text-[12.5px] bg-card cursor-pointer text-ink-soft"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="border border-ink rounded-[4px] px-4 py-2 font-mono text-[12.5px] bg-card text-ink no-underline"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
