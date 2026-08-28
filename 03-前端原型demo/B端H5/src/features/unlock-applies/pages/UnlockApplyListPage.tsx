import { useMemo, useState } from "react"
import { Lock, Search, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { DropdownFilterPill, type DropdownOption } from "@/components/ui/DropdownFilterPill"
import { DEFAULT_UNLOCK_APPLY_FILTERS } from "../domain/constants"
import type { UnlockApplyFilters } from "../domain/types"
import { UnlockApplyCard } from "../components/UnlockApplyCard"
import { unlockAppliesMock } from "../mock/unlock-applies.mock"

const statusOptions: DropdownOption[] = [
  { label: "待审批", value: "待审批" },
  { label: "已处理", value: "已处理" },
  { label: "全部", value: "全部" },
]

export function UnlockApplyListPage() {
  const [filters, setFilters] = useState<UnlockApplyFilters>(DEFAULT_UNLOCK_APPLY_FILTERS)

  const list = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    return unlockAppliesMock.filter((item) => {
      if (filters.status === "待审批" && item.status !== "PENDING") return false
      if (
        filters.status === "已处理" &&
        !["APPROVED", "REJECTED", "WITHDRAWN", "EXPIRED", "VOIDED"].includes(item.status)
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
  }, [filters])

  return (
    <MobileShell>
      <NavBar title="开锁审批" backTo="/m/tasks" />

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

      <div className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
            <Lock className="size-10 text-gray-300 mb-2" />
            <div className="text-sm font-semibold text-gray-600">暂无符合条件的开锁申请</div>
            <p className="mt-1 text-xs text-gray-400">请调整搜索或筛选条件</p>
          </div>
        ) : (
          list.map((apply) => <UnlockApplyCard key={apply.applyNo} apply={apply} />)
        )}
      </div>
    </MobileShell>
  )
}
