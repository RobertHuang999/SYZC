import { useMemo, useState } from "react"
import { Lock, Search, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { DropdownFilterPill, type DropdownOption } from "@/components/ui/DropdownFilterPill"
import { Toast } from "@/components/ui/Toast"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { DEFAULT_UNLOCK_APPLY_FILTERS } from "../domain/constants"
import type { UnlockApply, UnlockApplyFilters } from "../domain/types"
import { UnlockApplyCard } from "../components/UnlockApplyCard"
import { UnlockApplyApprovalDialog } from "../components/UnlockApplyApprovalDialog"
import { useUnlockApplies } from "@/features/my-applies/lib/unlock-applies-store"

const statusOptions: DropdownOption[] = [
  { label: "待审批", value: "待审批" },
  { label: "已处理", value: "已处理" },
  { label: "全部", value: "全部" },
]

export function UnlockApplyListPage() {
  const [filters, setFilters] = useState<UnlockApplyFilters>(DEFAULT_UNLOCK_APPLY_FILTERS)
  const [processingApply, setProcessingApply] = useState<UnlockApply | null>(null)
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const openApproval = (apply: UnlockApply) => {
    setProcessingApply(apply)
    setApprovalOpen(true)
  }

  const unlockApplies = useUnlockApplies()

  const list = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    return unlockApplies
      .filter((item) => item.needsApproval)
      .filter((item) => {
      if (filters.status === "待审批" && item.status !== "PENDING") return false
      if (
        filters.status === "已处理" &&
        !["APPROVED", "REJECTED", "WITHDRAWN", "EXPIRED"].includes(item.status)
      ) {
        return false
      }
      if (!kw) return true
      return (
        item.applyNo.toLowerCase().includes(kw) ||
        item.deviceName.toLowerCase().includes(kw) ||
        item.deviceCode.toLowerCase().includes(kw) ||
        item.applicantName.toLowerCase().includes(kw) ||
        item.reason.toLowerCase().includes(kw)
      )
    })
  }, [filters, unlockApplies])

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["h5-unlock-audit-list-page"]}>
        <NavBar title="开锁审批" backTo="/m/tasks" />
      </PrototypeAnnotationTarget>

      <PrototypeAnnotationTarget annotationIds={["h5-unlock-audit-filter"]}>
        <div className="shrink-0 space-y-2 border-b border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs">
          <div className="relative">
            <input
              type="text"
              placeholder="申请单号 / 设备 / 申请人 / 事由"
              className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:bg-white"
              value={filters.keyword}
              onChange={(e) => setFilters((c) => ({ ...c, keyword: e.target.value }))}
            />
            {filters.keyword ? (
              <button
                type="button"
                onClick={() => setFilters((c) => ({ ...c, keyword: "" }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-4 items-center justify-center rounded-full bg-gray-300 text-gray-600"
              >
                <X className="size-2.5" />
              </button>
            ) : (
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <DropdownFilterPill
              label="状态"
              value={filters.status}
              options={statusOptions}
              onChange={(val) =>
                setFilters((c) => ({ ...c, status: val as UnlockApplyFilters["status"] }))
              }
            />
          </div>
        </div>
      </PrototypeAnnotationTarget>

      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain">
        <PrototypeAnnotationTarget annotationIds={["h5-unlock-audit-card"]}>
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
              <Lock className="size-10 text-gray-300 mb-2" />
              <div className="text-sm font-semibold text-gray-600">暂无符合条件的开锁申请</div>
              <p className="mt-1 text-xs text-gray-400">请调整搜索或筛选条件</p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((apply) => (
                <UnlockApplyCard key={apply.applyNo} apply={apply} onProcess={openApproval} />
              ))}
            </div>
          )}
        </PrototypeAnnotationTarget>
      </div>

      <UnlockApplyApprovalDialog
        open={approvalOpen}
        apply={processingApply}
        onClose={() => setApprovalOpen(false)}
        onApprove={(_apply, _opinion) => setToast("审批通过")}
        onReject={(_apply, _reason) => setToast("已驳回")}
      />

      {toast && <Toast message={toast} />}
    </MobileShell>
  )
}
