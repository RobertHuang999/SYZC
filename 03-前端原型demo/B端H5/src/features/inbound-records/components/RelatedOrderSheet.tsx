import type { RelatedOrderOption } from "../domain/form-types"

type Props = {
  open: boolean
  title: string
  rows: RelatedOrderOption[]
  onClose: () => void
  onSelect: (row: RelatedOrderOption) => void
}

export function RelatedOrderSheet({ open, title, rows, onClose, onSelect }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <div className="max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <button type="button" className="text-sm text-gray-500" onClick={onClose}>
            关闭
          </button>
        </div>
        <div className="space-y-2">
          {rows.map((row, index) => (
            <button
              key={row.id}
              type="button"
              className="w-full rounded-lg border border-gray-100 p-3 text-left text-sm active:bg-gray-50"
              onClick={() => onSelect(row)}
            >
              <p className="text-xs text-gray-500">
                {index + 1}. {row.orderNo}
              </p>
              <p className="mt-1 font-medium">
                {row.ownerName} · {row.ownerIdentifierMasked}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                {row.goodsSummary.join("；")}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
