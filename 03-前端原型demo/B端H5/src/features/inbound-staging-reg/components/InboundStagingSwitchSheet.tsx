type Props = {
  open: boolean
  onClose: () => void
  onNavigateBlank: () => void
  onNavigateWithCopy: () => void
}

export function InboundStagingSwitchSheet({
  open,
  onClose,
  onNavigateBlank,
  onNavigateWithCopy,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <div className="w-full rounded-t-2xl bg-white p-4 pb-8 text-sm">
        <p className="font-medium text-gray-900">入库暂存登记说明</p>
        <p className="mt-2 text-xs leading-relaxed text-gray-600">
          现场备忘：不进审批、不写库存、暂不发短信。已填内容可无损带入暂存单（P09）。
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            className="h-11 rounded-lg bg-blue-600 text-sm font-medium text-white"
            onClick={onNavigateWithCopy}
          >
            带入内容并前往（推荐）
          </button>
          <button
            type="button"
            className="h-11 rounded-lg border border-gray-200 text-sm text-gray-800"
            onClick={onNavigateBlank}
          >
            去空白登记页
          </button>
          <button type="button" className="h-10 text-xs text-gray-500" onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
