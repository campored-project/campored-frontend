import { client } from './client'

export function crearPedido(datos) {
  return client.postAuth('/pedidos', datos)
}

export function obtenerPedido(id) {
  return client.get(`/pedidos/${id}`, true)
}

export function pedidosRecibidos() {
  return client.get('/pedidos/recibidos', true)
}
