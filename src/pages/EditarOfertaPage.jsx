import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import NavBar from '../components/NavBar'
import FormOferta from '../components/FormOferta'
import { editarOferta, obtenerOferta } from '../api/ofertas'
import { ROL } from '../constants/enums'
import { useAuth } from '../context/AuthContext'

export default function EditarOfertaPage() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [oferta, setOferta] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [erroresCampo, setErroresCampo] = useState({})

  // Todos los hooks antes de cualquier return condicional
  useEffect(() => {
    if (usuario?.rol !== ROL.PRODUCTOR) return
    obtenerOferta(id)
      .then(setOferta)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [id, usuario])

  if (usuario?.rol !== ROL.PRODUCTOR) return <Navigate to="/catalogo" replace />

  async function handleSubmit(body) {
    setGuardando(true)
    setError('')
    setErroresCampo({})
    try {
      await editarOferta(id, body)
      navigate('/mis-ofertas')
    } catch (err) {
      if (err.status === 422) {
        setError('Esta oferta está agotada y no se puede editar.')
      } else if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        setErroresCampo(err.fieldErrors)
      } else {
        setError(err.message)
      }
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <>
        <NavBar />
        <div className="max-w-[720px] mx-auto px-6 py-20 text-center">
          <p className="font-mono text-[13px] text-ink-faint">Cargando oferta…</p>
        </div>
      </>
    )
  }

  if (error && !oferta) {
    return (
      <>
        <NavBar />
        <div className="max-w-[720px] mx-auto px-6 py-20 text-center">
          <p className="font-display text-[20px] text-ink-soft mb-4">{error}</p>
          <button
            onClick={() => navigate('/mis-ofertas')}
            className="font-mono text-[13px] text-accent-dark cursor-pointer border-none bg-transparent p-0"
          >
            ← Mis ofertas
          </button>
        </div>
      </>
    )
  }

  if (oferta?.estadoPublicacion === 'AGOTADA') {
    return (
      <>
        <NavBar subtitulo="editar oferta" />
        <div className="max-w-[720px] mx-auto px-6 py-20 text-center">
          <p className="font-display text-[20px] text-ink-soft mb-4">
            Esta oferta está agotada y no se puede editar.
          </p>
          <button
            onClick={() => navigate('/mis-ofertas')}
            className="font-mono text-[13px] text-accent-dark cursor-pointer border-none bg-transparent p-0"
          >
            ← Mis ofertas
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar subtitulo="editar oferta" />
      <div className="max-w-[720px] mx-auto px-6 py-8">
        <h1 className="font-display text-[26px] font-medium mb-6">Editar oferta</h1>
        <div className="bg-card border border-line rounded-[6px] p-6">
          <FormOferta
            valorInicial={oferta}
            cargando={guardando}
            error={error}
            erroresCampo={erroresCampo}
            onSubmit={handleSubmit}
            onCancelar={() => navigate('/mis-ofertas')}
            labelSubmit="Guardar cambios"
          />
        </div>
      </div>
    </>
  )
}
