import { client } from './client'

export function registrarContacto(datos) {
  return client.postAuth('/contactos', datos)
}

export function misContactos() {
  return client.get('/contactos/mios', true)
}
