import { client } from './client'

export function crearOferta(datos) {
  return client.postAuth('/ofertas', datos)
}

export function misOfertas() {
  return client.get('/ofertas/mis-ofertas', true)
}

export function editarOferta(id, datos) {
  return client.put(`/ofertas/${id}`, datos)
}

export function marcarAgotada(id) {
  return client.patch(`/ofertas/${id}/estado`, { estadoPublicacion: 'AGOTADA' })
}

export function listarOfertas(params = {}) {
  const limpios = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v != null),
  )
  const qs = new URLSearchParams(limpios).toString()
  return client.get(`/ofertas${qs ? '?' + qs : ''}`)
}

// Envía el token si existe: compradores autenticados reciben datos de contacto
export function obtenerOferta(id) {
  return client.get(`/ofertas/${id}`, true)
}
