/**
 * ============================================================
 * FEATURE: US-24 — Catálogo de productos ampliado (Sprint 3)
 * Autor: Cristian Diez
 * Fecha: 2026-11-11
 * Descripción: Imagen del producto con respaldo en cadena: su foto, otro.webp
 * y, si ninguna carga, el ícono sobre bg-ok-bg con el mismo tamaño
 * ============================================================
 */

import { useState } from 'react'
import { Sprout } from 'lucide-react'

import { RUTA_IMAGEN_OTRO, imagenProducto } from '../constants/enums'

export default function ImagenProducto({
  producto,
  productoOtro,
  alt,
  className = '',
  loading = 'lazy',
  tamanoIcono = 'w-12 h-12',
}) {
  const src = imagenProducto(producto, productoOtro)
  // Los fallos se guardan junto a la ruta: si cambia el producto, el conteo vuelve a cero
  const [fallos, setFallos] = useState({ src, cantidad: 0 })
  const cantidad = fallos.src === src ? fallos.cantidad : 0

  let actual = null
  if (cantidad === 0) actual = src
  else if (cantidad === 1 && src !== RUTA_IMAGEN_OTRO) actual = RUTA_IMAGEN_OTRO

  if (!actual) {
    const accesibilidad = alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': true }
    return (
      <div {...accesibilidad} className={`${className} bg-ok-bg text-ok flex items-center justify-center`}>
        <Sprout className={tamanoIcono} aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      key={actual}
      src={actual}
      alt={alt}
      loading={loading}
      onError={() => setFallos({ src, cantidad: cantidad + 1 })}
      className={className}
    />
  )
}
