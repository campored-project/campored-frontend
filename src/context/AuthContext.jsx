import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import * as authApi from '../api/auth'
import * as usuariosApi from '../api/usuarios'

const STORAGE_TOKEN = 'campored_token'
const STORAGE_USUARIO = 'campored_usuario'
const STORAGE_EXPIRA = 'campored_expira'

const AuthContext = createContext(null)

function cargarSesionGuardada() {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN)
    const expira = Number(localStorage.getItem(STORAGE_EXPIRA))
    const usuarioRaw = localStorage.getItem(STORAGE_USUARIO)
    if (!token || !expira || !usuarioRaw || Date.now() >= expira) return null
    return { token, usuario: JSON.parse(usuarioRaw), expira }
  } catch {
    return null
  }
}

function guardarSesion({ token, usuario, expira }) {
  localStorage.setItem(STORAGE_TOKEN, token)
  localStorage.setItem(STORAGE_USUARIO, JSON.stringify(usuario))
  localStorage.setItem(STORAGE_EXPIRA, String(expira))
}

function limpiarSesion() {
  localStorage.removeItem(STORAGE_TOKEN)
  localStorage.removeItem(STORAGE_USUARIO)
  localStorage.removeItem(STORAGE_EXPIRA)
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => cargarSesionGuardada())
  const timerRef = useRef(null)

  const token = sesion?.token ?? null
  const usuario = sesion?.usuario ?? null

  const logout = useCallback(() => {
    clearTimeout(timerRef.current)
    limpiarSesion()
    setSesion(null)
  }, [])

  // Programa el logout automático en un setTimeout; nunca llama setState directamente aquí.
  const programarLogout = useCallback(
    (expira) => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(logout, Math.max(0, expira - Date.now()))
    },
    [logout],
  )

  // Restaurar timer al montar si hay sesión guardada válida.
  // El timer dispara logout fuera del ciclo de render, por lo que no hay setState síncrono.
  useEffect(() => {
    const expira = sesion?.expira
    if (!expira) return
    timerRef.current = setTimeout(logout, Math.max(0, expira - Date.now()))
    return () => clearTimeout(timerRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function aplicarRespuestaAuth({ token: tkn, expiraEnMs, usuario: usr }) {
    const expira = Date.now() + expiraEnMs
    guardarSesion({ token: tkn, usuario: usr, expira })
    setSesion({ token: tkn, usuario: usr, expira })
    programarLogout(expira)
  }

  async function login(correo, contrasena) {
    const data = await authApi.login(correo, contrasena)
    aplicarRespuestaAuth(data)
    return data
  }

  async function registrarProductor(datos) {
    const data = await authApi.registrarProductor(datos)
    aplicarRespuestaAuth(data)
    return data
  }

  async function registrarComprador(datos) {
    const data = await authApi.registrarComprador(datos)
    aplicarRespuestaAuth(data)
    return data
  }

  function actualizarUsuarioEnSesion(usr) {
    setSesion((prev) => {
      if (!prev) return prev
      const usuarioActualizado = { ...prev.usuario, ...usr }
      localStorage.setItem(STORAGE_USUARIO, JSON.stringify(usuarioActualizado))
      return { ...prev, usuario: usuarioActualizado }
    })
  }

  async function actualizarUsuario(datos) {
    const fn =
      usuario?.rol === 'PRODUCTOR'
        ? usuariosApi.actualizarPerfilProductor
        : usuariosApi.actualizarPerfilComprador
    const usr = await fn(datos)
    actualizarUsuarioEnSesion(usr)
    return usr
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        login,
        registrarProductor,
        registrarComprador,
        actualizarUsuario,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
