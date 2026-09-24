import { client } from './client'

export function registrarProductor(datos) {
  return client.post('/auth/registro/productor', datos)
}

export function registrarComprador(datos) {
  return client.post('/auth/registro/comprador', datos)
}

export function login(correo, contrasena) {
  return client.post('/auth/login', { correo, contrasena })
}
