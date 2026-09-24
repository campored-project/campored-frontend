import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PublicRoute() {
  const { token } = useAuth()
  return token ? <Navigate to="/perfil" replace /> : <Outlet />
}
