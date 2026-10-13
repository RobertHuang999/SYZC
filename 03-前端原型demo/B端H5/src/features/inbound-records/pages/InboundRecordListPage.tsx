import { useMemo, useState } from "react"
import { Plus, Search, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { InboundRecordCard } from "../components/InboundRecordCard"
import {
  FLOW_STATUS_FILTER_OPTIONS,
  FLOW_STATUS_LABEL,
  INBOUND_INITIATE_ROUTE,
  WORKSPACE_ROUTE,
} from "../domain/constants"
import type { InboundFlowStatusFilter, MobileInboundRecord } from "../domain/types"
import { mobileInboundRecordsMock } from "../mock/inbound-records.mock"

const STATUS_OPTIONS: DropdownOption[] = FLOW_STATUS_FILTER_OPTIONS.map((value) => ({
  label: value === "全部" ? "全部状态" : FLOW_STATUS_LABEL[value],
  value,
}))

export function InboundRecordListPage() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<MobileInboundRecord[]>(mobileInboundRecordsMock)
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState<InboundFlowStatusFilter>("全部")
  const [toast, setToast] = useState<string | null>(null)

  // 撤销弹窗
  const [revokeTarget, setRevokeTarget] = useState<MobileInboundRecord | null>(null)

  const filtered = useMemo(() => {
    return records.filter((row) => {
      if (status !== "全部" && row.flowStatus !== status) return false
      const q = keyword.trim()
      if (!q) return true
      return (
        row.orderNo.includes(q) ||
        row.ownerName.includes(q) ||
        row.warehouseName.includes(q) ||
        row.goodsSummary.includes(q)
      )
    })
  }, [records, keyword, status])

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  const handleRevokeConfirm = () => {
    if (!revokeTarget) return
    setRecords((prev) =>
      prev.map((r) => (r.id === revokeTarget.id ? { ...r, flowStatus: "WITHDRAWN" } : r))
    )
    showToast(`入库申请 ${revokeTarget.orderNo} 已撤销（P08）`)
    setRevokeTarget(null)
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["inbound-h5-list"]}>
        <NavBar title="入库管理" backTo={WORKSPACE_ROUTE} />
        <p className="shrink-0 border-b border-gray-100 bg-gray-50/90 px-3 py-1.5 text-[11px] text-gray-500">
          全状态流转台账（待审核/审核中/已通过/未通过/已撤销），支持制单人撤销
        </p>
      </PrototypeAnnotationTarget>

      <div className="shrink-0 space-y-2 border-b border-gray-100 bg-white px-3 py-2">
        <DropdownFilterPill
          label="审核状态"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(value) => setStatus(value as InboundFlowStatusFilter)}
        />
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-orange-500 focus:outline-none"
            placeholder="单号 / 货主 / 仓库 / 货品"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 pb-24">
        {filtered.map((item) => (
          <InboundRecordCard
            key={item.id}
            item={item}
            onDownload={(kind, row) => {
              showToast(
                kind === "excel"
                  ? `下载记录 Excel 导出中：${row.orderNo}`
                  : `单据凭证 PDF 生成中：${row.orderNo}`
              )
            }}
            onRevoke={(row) => setRevokeTarget(row)}
          />
        ))}
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">暂无入库记录</p>
        ) : null}
      </div>

      <button
        type="button"
        className="fixed right-4 bottom-20 z-40 flex items-center gap-1.5 rounded-full bg-orange-600 px-4 py-3 text-sm font-medium text-white shadow-lg active:bg-orange-700"
        onClick={() => navigate(INBOUND_INITIATE_ROUTE)}
      >
        <Plus className="size-5" />
        发起入库
      </button>

      {/* 撤销确认弹窗 */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="mt-3 text-base font-bold text-gray-900">确认撤销入库申请？</h3>
            <p className="mt-1 font-mono text-xs text-gray-400">{revokeTarget.orderNo}</p>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              撤销后该入库单将直接作废，不可继续审核。此操作不可逆。
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs text-gray-700 active:bg-gray-50"
                onClick={() => setRevokeTarget(null)}
              >
                取消
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-medium text-white active:bg-red-700"
                onClick={handleRevokeConfirm}
              >
                确认撤销
              </button>
            </div>
          </div>
        </div>
      )}

      {toast ? (
        <div className="fixed bottom-32 left-1/2 z-50 max-w-[90%] -translate-x-1/2 rounded-xl bg-gray-900/95 px-4 py-2 text-xs text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </MobileShell>
  )
}
