export function inputCls(hasError = false) {
  return [
    'border rounded-[4px] px-3 py-2.5 font-body text-[14px] text-ink w-full bg-paper',
    'focus:outline focus:outline-1',
    hasError ? 'border-low focus:outline-low' : 'border-line-strong focus:outline-accent',
  ].join(' ')
}
