import type { ReactNode } from "react"

export type ActionSheetItem = {
  key: string
  label: string
  icon?: ReactNode
  description?: string
  danger?: boolean
  primary?: boolean
  disabled?: boolean
  onClick: () => void
}

type ActionSheetProps = {
  open: boolean
  title?: string
  description?: string
  items: ActionSheetItem[]
  onClose: () => void
}

export function ActionSheet({
  open,
  title,
  description,
  items,
  onClose,
}: ActionSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 遮罩 */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        aria-label="关闭操作面板"
        onClick={onClose}
      />

      {/* 抽屉内容 */}
      <div className="relative z-10 w-full max-w-[430px] rounded-t-3xl bg-white p-4 shadow-2xl animate-slide-up">
        {/* 顶部指示条 */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />

        {/* 标题区 */}
        {(title || description) && (
          <div className="mb-3 border-b border-gray-100 pb-3 text-center">
            {title && (
              <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
          </div>
        )}

        {/* 操作列表 */}
        <div className="space-y-1.5 py-1">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                onClose()
                item.onClick()
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-colors active:scale-[0.99] ${
                item.disabled
                  ? "opacity-40 cursor-not-allowed bg-gray-50 text-gray-400"
                  : item.danger
                  ? "bg-rose-50 text-rose-700 active:bg-rose-100"
                  : item.primary
                  ? "bg-blue-50 text-blue-700 active:bg-blue-100"
                  : "bg-gray-50/80 text-gray-800 hover:bg-gray-100 active:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon && (
                  <span className="size-4 shrink-0 text-current">{item.icon}</span>
                )}
                <div>
                  <div className="font-semibold">{item.label}</div>
                  {item.description && (
                    <div className="text-[11px] font-normal text-gray-500">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400">▸</span>
            </button>
          ))}
        </div>

        {/* 取消按钮 */}
        <div className="mt-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-gray-100 py-3 text-center text-xs font-semibold text-gray-700 active:bg-gray-200"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
