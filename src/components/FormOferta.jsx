import { useState } from 'react'

import {
  ESTADOS_CULTIVO,
  MODALIDADES_LOGISTICA,
  PRODUCTOS,
  UNIDADES_MEDIDA,
} from '../constants/enums'
import { inputCls } from '../utils/clases'
import Campo from './Campo'

const INITIAL = {
  producto: '',
  productoOtro: '',
  descripcion: '',
  cantidadDisponible: '',
  unidadMedida: '',
  precioUnitario: '',
  estadoCultivo: '',
  fechaEstimadaCosecha: '',
  modalidadLogistica: '',
}

function validar(form) {
  const err = {}
  if (!form.producto) err.producto = 'El producto es obligatorio'
  if (form.producto === 'OTRO' && !form.productoOtro.trim())
    err.productoOtro = 'Describe el producto'
  if (form.producto === 'OTRO' && form.productoOtro.length > 100)
    err.productoOtro = 'Máximo 100 caracteres'
  if (form.descripcion.length > 500) err.descripcion = 'Máximo 500 caracteres'
  if (!form.cantidadDisponible || parseFloat(form.cantidadDisponible) < 0.01)
    err.cantidadDisponible = 'Mínimo 0.01'
  if (!form.unidadMedida) err.unidadMedida = 'La unidad es obligatoria'
  if (!form.precioUnitario || parseInt(form.precioUnitario, 10) < 1)
    err.precioUnitario = 'Mínimo $1 COP'
  if (!form.estadoCultivo) err.estadoCultivo = 'El estado del cultivo es obligatorio'
  if (form.estadoCultivo === 'EN_CRECIMIENTO') {
    if (!form.fechaEstimadaCosecha)
      err.fechaEstimadaCosecha = 'Obligatoria para cultivos en crecimiento'
    else if (new Date(form.fechaEstimadaCosecha) <= new Date())
      err.fechaEstimadaCosecha = 'La fecha debe ser futura'
  }
  if (!form.modalidadLogistica) err.modalidadLogistica = 'La modalidad es obligatoria'
  return err
}

function construirBody(form) {
  const body = {
    producto: form.producto,
    cantidadDisponible: parseFloat(form.cantidadDisponible),
    unidadMedida: form.unidadMedida,
    precioUnitario: parseInt(form.precioUnitario, 10),
    estadoCultivo: form.estadoCultivo,
    modalidadLogistica: form.modalidadLogistica,
  }
  if (form.producto === 'OTRO') body.productoOtro = form.productoOtro.trim()
  if (form.descripcion.trim()) body.descripcion = form.descripcion.trim()
  if (form.estadoCultivo === 'EN_CRECIMIENTO')
    body.fechaEstimadaCosecha = form.fechaEstimadaCosecha
  return body
}

function fromOferta(oferta) {
  return {
    producto: oferta.producto ?? '',
    productoOtro: oferta.productoOtro ?? '',
    descripcion: oferta.descripcion ?? '',
    cantidadDisponible: String(oferta.cantidadDisponible ?? ''),
    unidadMedida: oferta.unidadMedida ?? '',
    precioUnitario: String(oferta.precioUnitario ?? ''),
    estadoCultivo: oferta.estadoCultivo ?? '',
    fechaEstimadaCosecha: oferta.fechaEstimadaCosecha ?? '',
    modalidadLogistica: oferta.modalidadLogistica ?? '',
  }
}

export default function FormOferta({
  valorInicial = null,
  cargando = false,
  error = '',
  erroresCampo = {},
  onSubmit,
  onCancelar,
  labelSubmit = 'Publicar oferta',
}) {
  const [form, setForm] = useState(() => (valorInicial ? fromOferta(valorInicial) : INITIAL))
  const [errores, setErrores] = useState({})

  function cambiar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
    setErrores((prev) => ({ ...prev, [campo]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = validar(form)
    if (Object.keys(err).length > 0) {
      setErrores(err)
      return
    }
    onSubmit(construirBody(form))
  }

  const todosErrores = { ...errores, ...erroresCampo }
  const hoy = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        <Campo id="producto" label="Producto" error={todosErrores.producto}>
          <select
            id="producto"
            value={form.producto}
            onChange={(e) => {
              cambiar('producto', e.target.value)
              if (e.target.value !== 'OTRO') cambiar('productoOtro', '')
            }}
            aria-describedby={todosErrores.producto ? 'producto-error' : undefined}
            className={inputCls(!!todosErrores.producto)}
          >
            <option value="">Selecciona un producto</option>
            {PRODUCTOS.map((p) => (
              <option key={p.valor} value={p.valor}>
                {p.label}
              </option>
            ))}
          </select>
        </Campo>

        {form.producto === 'OTRO' && (
          <Campo
            id="productoOtro"
            label="Nombre del producto"
            error={todosErrores.productoOtro}
          >
            <input
              id="productoOtro"
              type="text"
              maxLength={100}
              value={form.productoOtro}
              onChange={(e) => cambiar('productoOtro', e.target.value)}
              placeholder="Ej. Lulo"
              aria-describedby={todosErrores.productoOtro ? 'productoOtro-error' : undefined}
              className={inputCls(!!todosErrores.productoOtro)}
            />
          </Campo>
        )}

        <Campo id="estadoCultivo" label="Estado del cultivo" error={todosErrores.estadoCultivo}>
          <select
            id="estadoCultivo"
            value={form.estadoCultivo}
            onChange={(e) => {
              cambiar('estadoCultivo', e.target.value)
              if (e.target.value === 'DISPONIBLE') cambiar('fechaEstimadaCosecha', '')
            }}
            aria-describedby={todosErrores.estadoCultivo ? 'estadoCultivo-error' : undefined}
            className={inputCls(!!todosErrores.estadoCultivo)}
          >
            <option value="">Selecciona el estado</option>
            {ESTADOS_CULTIVO.map((e) => (
              <option key={e.valor} value={e.valor}>
                {e.label}
              </option>
            ))}
          </select>
        </Campo>

        {form.estadoCultivo === 'EN_CRECIMIENTO' && (
          <Campo
            id="fechaEstimadaCosecha"
            label="Fecha estimada de cosecha"
            error={todosErrores.fechaEstimadaCosecha}
          >
            <input
              id="fechaEstimadaCosecha"
              type="date"
              value={form.fechaEstimadaCosecha}
              min={hoy}
              onChange={(e) => cambiar('fechaEstimadaCosecha', e.target.value)}
              aria-describedby={
                todosErrores.fechaEstimadaCosecha ? 'fechaEstimadaCosecha-error' : undefined
              }
              className={inputCls(!!todosErrores.fechaEstimadaCosecha)}
            />
          </Campo>
        )}

        <Campo
          id="cantidadDisponible"
          label="Cantidad disponible"
          error={todosErrores.cantidadDisponible}
        >
          <input
            id="cantidadDisponible"
            type="number"
            min="0.01"
            step="0.01"
            value={form.cantidadDisponible}
            onChange={(e) => cambiar('cantidadDisponible', e.target.value)}
            placeholder="Ej. 250"
            aria-describedby={
              todosErrores.cantidadDisponible ? 'cantidadDisponible-error' : undefined
            }
            className={inputCls(!!todosErrores.cantidadDisponible)}
          />
        </Campo>

        <Campo id="unidadMedida" label="Unidad de medida" error={todosErrores.unidadMedida}>
          <select
            id="unidadMedida"
            value={form.unidadMedida}
            onChange={(e) => cambiar('unidadMedida', e.target.value)}
            aria-describedby={todosErrores.unidadMedida ? 'unidadMedida-error' : undefined}
            className={inputCls(!!todosErrores.unidadMedida)}
          >
            <option value="">Selecciona la unidad</option>
            {UNIDADES_MEDIDA.map((u) => (
              <option key={u.valor} value={u.valor}>
                {u.label}
              </option>
            ))}
          </select>
        </Campo>

        <Campo
          id="precioUnitario"
          label="Precio por unidad (COP)"
          error={todosErrores.precioUnitario}
        >
          <input
            id="precioUnitario"
            type="number"
            min="1"
            step="1"
            value={form.precioUnitario}
            onChange={(e) => cambiar('precioUnitario', e.target.value)}
            placeholder="Ej. 3500"
            aria-describedby={todosErrores.precioUnitario ? 'precioUnitario-error' : undefined}
            className={inputCls(!!todosErrores.precioUnitario)}
          />
        </Campo>

        <Campo
          id="modalidadLogistica"
          label="Modalidad de entrega"
          error={todosErrores.modalidadLogistica}
        >
          <select
            id="modalidadLogistica"
            value={form.modalidadLogistica}
            onChange={(e) => cambiar('modalidadLogistica', e.target.value)}
            aria-describedby={
              todosErrores.modalidadLogistica ? 'modalidadLogistica-error' : undefined
            }
            className={inputCls(!!todosErrores.modalidadLogistica)}
          >
            <option value="">Selecciona la modalidad</option>
            {MODALIDADES_LOGISTICA.map((m) => (
              <option key={m.valor} value={m.valor}>
                {m.label}
              </option>
            ))}
          </select>
        </Campo>

        <div className="sm:col-span-2">
          <Campo id="descripcion" label="Descripción (opcional)" error={todosErrores.descripcion}>
            <textarea
              id="descripcion"
              maxLength={500}
              rows={3}
              value={form.descripcion}
              onChange={(e) => cambiar('descripcion', e.target.value)}
              placeholder="Información adicional sobre el producto"
              aria-describedby={todosErrores.descripcion ? 'descripcion-error' : undefined}
              className={`${inputCls(!!todosErrores.descripcion)} resize-none`}
            />
          </Campo>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-low text-[13px] mt-4">
          {error}
        </p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={cargando}
          className="bg-ink text-paper border border-ink rounded-[4px] px-5 py-2.5 font-mono text-[13px] cursor-pointer disabled:opacity-50"
        >
          {cargando ? 'Guardando…' : labelSubmit}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="border border-line-strong rounded-[4px] px-5 py-2.5 font-mono text-[13px] text-ink-soft bg-card cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
