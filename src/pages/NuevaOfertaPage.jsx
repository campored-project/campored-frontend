import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import NavBar from '../components/NavBar'
import FormOferta from '../components/FormOferta'
import { crearOferta } from '../api/ofertas'
import { ROL } from '../constants/enums'
import { useAuth } from '../context/AuthContext'

export default function NuevaOfertaPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [erroresCampo, setErroresCampo] = useState({})

  if (usuario?.rol !== ROL.PRODUCTOR) return <Navigate to="/catalogo" replace />

  async function handleSubmit(body) {
    setCargando(true)
    setError('')
    setErroresCampo({})
    try {
      await crearOferta(body)
      navigate('/mis-ofertas')
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErroresCampo(err.fieldErrors)
      } else if (err.status === 422) {
        setError('El productor no tiene finca registrada. Completa tu perfil primero.')
      } else {
        setError(err.message)
      }
      setCargando(false)
    }
  }

  return (
    <>
      <NavBar subtitulo="nueva oferta" />
      <div className="max-w-[720px] mx-auto px-6 py-8">
        <h1 className="font-display text-[26px] font-medium mb-6">Publicar oferta</h1>
        <div className="bg-card border border-line rounded-[6px] p-6">
          <FormOferta
            cargando={cargando}
            error={error}
            erroresCampo={erroresCampo}
            onSubmit={handleSubmit}
            onCancelar={() => navigate('/mis-ofertas')}
            labelSubmit="Publicar oferta"
          />
        </div>
      </div>
    </>
  )
}
