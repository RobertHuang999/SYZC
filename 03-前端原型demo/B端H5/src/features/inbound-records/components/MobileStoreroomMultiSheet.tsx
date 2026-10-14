type Room = { id: string; name: string }

type Props = {
  open: boolean
  title: string
  rooms: Room[]
  selectedIds: string[]
  onClose: () => void
  onConfirm: (ids: string[]) => void
}

export function MobileStoreroomMultiSheet({
  open,
  title,
  rooms,
  selectedIds,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null

  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id]
    onConfirm(next)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
      <button type="button" className="min-h-0 flex-1" aria-label="关闭" onClick={onClose} />
      <div className="max-h-[70vh] rounded-t-2xl bg-white pb-safe">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className="text-sm font-medium">{title}</span>
          <button type="button" className="text-sm text-blue-600" onClick={onClose}>
            完成
          </button>
        </div>
        <ul className="overflow-y-auto">
          {rooms.map((room) => {
            const checked = selectedIds.includes(room.id)
            return (
              <li key={room.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-3.5 text-left text-sm"
                  onClick={() => toggle(room.id)}
                >
                  <span
                    className={`flex size-5 items-center justify-center rounded border ${
                      checked ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300"
                    }`}
                  >
                    {checked ? "✓" : ""}
                  </span>
                  {room.name}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
