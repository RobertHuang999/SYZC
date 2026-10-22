import { X } from "lucide-react"
import { DocumentManagementTab } from "./DocumentManagementTab"

type DocumentManagementSheetProps = {
  open: boolean
  orderNo: string
  orderType?: "inbound" | "outbound"
  ownerName?: string
  warehouseName?: string
  onClose: () => void
}

/**
 * 资料管理全屏面板：从列表卡片直接查看某张单据的资料时间轴，
 * 不必先进入详情页。
 */
export function DocumentManagementSheet({
  open,
  orderNo,
  orderType = "inbound",
  ownerName,
  warehouseName,
  onClose,
}: DocumentManagementSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#edf2f8]">
      <header className="flex shrink-0 items-center justify-between border-b border-[#232D39]/10 bg-white px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#232D39]">资料管理</h2>
          <p className="mt-0.5 truncate text-[10px] text-[#232D39]/45">
            单据编号：{orderNo}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭资料管理"
          className="rounded-full p-1 text-[#232D39]/40 active:bg-gray-100"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 pb-6">
        <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
          <DocumentManagementTab
            orderNo={orderNo}
            orderType={orderType}
            ownerName={ownerName}
            warehouseName={warehouseName}
          />
        </section>
      </div>
    </div>
  )
}
