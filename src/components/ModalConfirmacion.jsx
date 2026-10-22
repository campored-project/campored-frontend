export default function ModalConfirmacion({
  titulo,
  mensaje,
  etiquetaConfirmar = 'Confirmar',
  etiquetaCancelar = 'Cancelar',
  cargando = false,
  onConfirmar,
  onCancelar,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(36,41,31,0.45)' }}
    >
      <div className="bg-card border border-line rounded-[6px] p-6 max-w-[400px] w-full">
        <h2
          id="modal-titulo"
          className="font-display text-[18px] font-medium m-0 mb-3"
        >
          {titulo}
        </h2>
        <p className="text-ink-soft text-[14px] leading-relaxed m-0 mb-6">{mensaje}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            disabled={cargando}
            onClick={onCancelar}
            className="border border-line-strong rounded-[4px] px-4 py-2 font-mono text-[12.5px] bg-card text-ink-soft cursor-pointer disabled:opacity-50"
          >
            {etiquetaCancelar}
          </button>
          <button
            type="button"
            disabled={cargando}
            onClick={onConfirmar}
            className="border border-low bg-low-bg rounded-[4px] px-4 py-2 font-mono text-[12.5px] text-low cursor-pointer disabled:opacity-50"
          >
            {cargando ? 'Guardando…' : etiquetaConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
