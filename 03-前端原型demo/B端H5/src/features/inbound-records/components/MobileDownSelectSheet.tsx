type Option = { id: string; label: string }

type Props = {
  open: boolean
  title: string
  options: Option[]
  selectedId?: string
  onClose: () => void
  onSelect: (option: Option) => void
}

export function MobileDownSelectSheet({
  open,
  title,
  options,
  selectedId,
  onClose,
  onSelect,
}: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
      <button type="button" className="min-h-0 flex-1" aria-label="关闭" onClick={onClose} />
      <div className="max-h-[70vh] rounded-t-2xl bg-white pb-safe">
        <div className="border-b border-gray-100 px-4 py-3 text-center text-sm font-medium">
          {title}
        </div>
        <ul className="overflow-y-auto">
          {options.map((opt) => {
            const active = opt.id === selectedId
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  className={`block w-full border-b border-gray-50 px-4 py-3.5 text-left text-sm ${
                    active ? "font-medium text-orange-600" : "text-[#232D39]"
                  }`}
                  onClick={() => {
                    onSelect(opt)
                    onClose()
                  }}
                >
                  {opt.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
