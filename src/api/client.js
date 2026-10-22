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

  // 60 s para tolerar el cold start de Render Free
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60_000)

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch (err) {
    const message =
      err.name === 'AbortError'
        ? 'El servidor tardó demasiado en responder. Puede estar iniciando — intenta de nuevo en un momento.'
        : 'No hay conexión con el servidor.'
    throw { status: 0, message, fieldErrors: {} }
  } finally {
    clearTimeout(timeoutId)
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
  get: (path, auth = false) => request(path, { auth }),
  post: (path, body) => request(path, { method: 'POST', body }),
  postAuth: (path, body) => request(path, { method: 'POST', body, auth: true }),
  put: (path, body) => request(path, { method: 'PUT', body, auth: true }),
  patch: (path, body) => request(path, { method: 'PATCH', body, auth: true }),
}
