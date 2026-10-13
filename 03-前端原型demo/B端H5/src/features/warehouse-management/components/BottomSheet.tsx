import type { ReactNode } from "react"

type BottomSheetProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
      <button
        type="button"
        className="flex-1"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="max-h-[70vh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <button
            type="button"
            className="rounded-md bg-gray-100 px-3 py-1 text-sm"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
