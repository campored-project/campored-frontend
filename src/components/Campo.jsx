export default function Campo({ id, label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[10.5px] uppercase tracking-[0.05em] text-ink-faint"
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          className="text-low text-[12.5px]"
        >
          {error}
        </span>
      )}
    </div>
  )
}
