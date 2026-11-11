/**
 * ============================================================
 * FEATURE: US-24 — Identidad Visual y Menú de Usuario (Sprint 3)
 * Autor: Cristian Diez
 * Fecha: 2026-11-11
 * Descripción: Menú desplegable accesible con resumen del usuario y acciones
 * ============================================================
 */

import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'

import { ROL, labelMunicipio } from '../constants/enums'
import { useAuth } from '../context/AuthContext'

function construirResumenContexto(usuario) {
  if (!usuario) return ''

  const municipio = usuario.municipio ? labelMunicipio(usuario.municipio) : ''

  if (usuario.rol === ROL.PRODUCTOR) {
    const partes = [
      usuario.nombreFinca,
      usuario.vereda ? `Vereda ${usuario.vereda}` : '',
      municipio,
    ].filter(Boolean)
    return partes.join(' · ')
  }

  if (usuario.rol === ROL.COMPRADOR) {
    const partes = [usuario.nombreNegocio, municipio].filter(Boolean)
    return partes.join(' · ')
  }

  return municipio
}

export default function MenuUsuario({ usuario, onCerrar, enlaces = [] }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef(null)
  const rutaInicialRef = useRef(location.pathname + location.search)

  useEffect(() => {
    const rutaActual = location.pathname + location.search
    if (rutaActual !== rutaInicialRef.current) {
      onCerrar()
    }
  }, [location.pathname, location.search, onCerrar])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCerrar()
      }
    }

    function handlePointerDown(e) {
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target)) return
      if (e.target.closest?.('[data-menu-trigger="true"]')) return
      onCerrar()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [onCerrar])

  function handleLogout() {
    logout()
    onCerrar()
    navigate('/')
  }

  const esProductor = usuario?.rol === ROL.PRODUCTOR
  const etiquetaRol = esProductor ? 'Productor agrícola' : 'Comprador comercial'
  const correo = usuario?.email || usuario?.correo || ''
  const resumenContexto = construirResumenContexto(usuario)

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-orientation="vertical"
      className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-card border border-line rounded-[6px] shadow-lg z-50 p-2"
    >
      {/* Navegación móvil contextual */}
      {enlaces.length > 0 && (
        <div className="sm:hidden border-b border-line pb-1.5 mb-1.5 flex flex-col gap-0.5">
          {enlaces.map((item) => {
            const activo = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                onClick={onCerrar}
                className={`px-3 py-2 rounded-[4px] font-mono text-xs no-underline transition-colors ${
                  activo
                    ? 'bg-ok-bg text-ok font-medium'
                    : 'text-ink hover:bg-paper'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}

      {/* Resumen de la cuenta */}
      <div className="px-3 py-2.5 border-b border-line mb-1.5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="font-display font-semibold text-ink text-sm sm:text-base m-0 leading-snug">
            {usuario?.nombre}
          </p>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[4px] shrink-0 ${
              esProductor
                ? 'bg-ok-bg text-ok border border-ok/30'
                : 'bg-accent/10 text-accent-dark border border-accent/20'
            }`}
          >
            {etiquetaRol}
          </span>
        </div>

        {correo && (
          <p className="text-xs text-ink-soft m-0 truncate">{correo}</p>
        )}

        {resumenContexto && (
          <p className="font-mono text-[11px] text-ink-faint m-0 mt-1.5 leading-relaxed">
            {resumenContexto}
          </p>
        )}
      </div>

      {/* Acciones del usuario */}
      <div className="flex flex-col gap-0.5">
        <Link
          to="/perfil"
          role="menuitem"
          onClick={onCerrar}
          className="flex items-center gap-2.5 px-3 py-2 rounded-[4px] font-body text-sm text-ink no-underline hover:bg-paper transition-colors"
        >
          <User className="w-4 h-4 text-ink-soft shrink-0" aria-hidden="true" />
          <span>Editar perfil</span>
        </Link>

        <button
          type="button"
          role="menuitem"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[4px] font-body text-sm text-ink-soft hover:text-low hover:bg-low-bg/50 transition-colors cursor-pointer bg-transparent border-0 text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}
