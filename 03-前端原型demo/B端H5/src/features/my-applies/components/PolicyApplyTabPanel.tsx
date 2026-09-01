import { Newspaper } from "lucide-react"

export function PolicyApplyTabPanel() {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 overscroll-contain">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
        <Newspaper className="size-10 text-gray-300 mb-3" />
        <p className="text-sm font-semibold text-gray-600">功能开发中</p>
        <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-gray-400">
          我的政策资讯申请将在后续版本接入，与 PC 端「我的政策资讯申请」Tab 保持一致
        </p>
      </div>
    </div>
  )
}
