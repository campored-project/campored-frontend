import { client } from './client'

export function actualizarPerfilProductor(datos) {
  return client.patch('/usuarios/perfil/productor', datos)
}

export function actualizarPerfilComprador(datos) {
  return client.patch('/usuarios/perfil/comprador', datos)
}
