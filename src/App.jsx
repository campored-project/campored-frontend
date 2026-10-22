import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import { AuthProvider } from './context/AuthContext'
import CatalogoPage from './pages/CatalogoPage'
import DetalleOfertaPage from './pages/DetalleOfertaPage'
import EditarOfertaPage from './pages/EditarOfertaPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import MisOfertasPage from './pages/MisOfertasPage'
import NuevaOfertaPage from './pages/NuevaOfertaPage'
import PerfilPage from './pages/PerfilPage'
import RegistroPage from './pages/RegistroPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/catalogo/:id" element={<DetalleOfertaPage />} />

          {/* Solo sin sesión */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />
          </Route>

          {/* Solo con sesión */}
          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/mis-ofertas" element={<MisOfertasPage />} />
            <Route path="/ofertas/nueva" element={<NuevaOfertaPage />} />
            <Route path="/ofertas/:id/editar" element={<EditarOfertaPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
