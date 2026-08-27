import type { ReactNode } from "react"

type FilterDrawerProps = {
  open: boolean
  onClose: () => void
  onReset: () => void
  onConfirm: () => void
  children: ReactNode
}

export function FilterDrawer({
  open,
  onClose,
  onReset,
  onConfirm,
  children,
}: FilterDrawerProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="关闭筛选"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[78vh] overflow-hidden rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className="text-base font-semibold text-gray-900">更多筛选</span>
          <button
            type="button"
            className="text-sm text-gray-500"
            onClick={onClose}
          >
            关闭
          </button>
        </div>
        <div className="max-h-[58vh] overflow-y-auto px-4 py-3">{children}</div>
        <div className="flex gap-3 border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm text-gray-700"
            onClick={onReset}
          >
            重置
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white"
            onClick={onConfirm}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}

type DrawerFieldProps = {
  label: string
  children: ReactNode
}

export function DrawerField({ label, children }: DrawerFieldProps) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-xs font-medium text-gray-500">{label}</div>
      {children}
    </div>
  )
}
