const BASE_URL = import.meta.env.VITE_API_BASE_URL

function getToken() {
  return localStorage.getItem('campored_token')
}

// Normaliza cualquier error de red o respuesta HTTP a { status, message, fieldErrors }
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw { status: 0, message: 'No hay conexión con el servidor.', fieldErrors: {} }
  }

  if (response.ok) {
    if (response.status === 204) return null
    return response.json()
  }

  let errorData = {}
  try {
    errorData = await response.json()
  } catch {
    // el cuerpo no es JSON
  }

  // ErrorResponse: { timestamp, status, error, mensaje, ruta, errores: { campo: mensaje } }
  throw {
    status: response.status,
    message: errorData.mensaje || `Error ${response.status}`,
    fieldErrors: errorData.errores || {},
  }
}

export const client = {
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body, auth: true }),
}
