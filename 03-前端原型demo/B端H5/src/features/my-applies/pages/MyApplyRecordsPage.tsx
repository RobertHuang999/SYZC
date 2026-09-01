import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { FileText, Search, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { DropdownFilterPill, type DropdownOption } from "@/components/ui/DropdownFilterPill"
import {
  CURRENT_APPLICANT_ACCOUNT,
  loadCachedMyApplyFilters,
  saveCachedMyApplyFilters,
} from "../domain/constants"
import type { MyApplyFilters } from "../domain/types"
import { isUnlockApply } from "../domain/types"
import { processAppliesMock } from "../mock/my-applies.mock"
import { MyUnlockApplyCard } from "../components/MyUnlockApplyCard"
import { ProcessApplyCard } from "../components/ProcessApplyCard"
import { useUnlockApplies } from "../lib/unlock-applies-store"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { DEVICE_MANAGEMENT_PATH } from "@/features/access-control-devices/domain/constants"

const bizTypeOptions: DropdownOption[] = [
  { label: "全部", value: "全部" },
  { label: "流程申请", value: "流程申请" },
  { label: "开锁审批", value: "开锁审批" },
]

const needsApprovalOptions: DropdownOption[] = [
  { label: "全部", value: "全部" },
  { label: "是", value: "是" },
  { label: "否", value: "否" },
]

export function MyApplyRecordsPage() {
  const [filters, setFilters] = useState<MyApplyFilters>(loadCachedMyApplyFilters)
  const unlockApplies = useUnlockApplies()

  const updateFilters = (updater: MyApplyFilters | ((current: MyApplyFilters) => MyApplyFilters)) => {
    setFilters((current) => {
      const next = typeof updater === "function" ? updater(current) : updater
      saveCachedMyApplyFilters(next)
      return next
    })
  }

  const list = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    const records = [...processAppliesMock, ...unlockApplies]
    return records.filter((record) => {
      if (isUnlockApply(record) && record.applicantAccount !== CURRENT_APPLICANT_ACCOUNT) {
        return false
      }

      if (filters.bizType === "流程申请" && !("id" in record)) return false
      if (filters.bizType === "开锁审批" && !isUnlockApply(record)) return false

      if (filters.needsApproval === "否") {
        if (!isUnlockApply(record)) return false
        if (record.needsApproval) return false
      }
      if (filters.needsApproval === "是") {
        if (!isUnlockApply(record)) return false
        if (!record.needsApproval) return false
      }

      if (filters.dateFrom || filters.dateTo) {
        const time = isUnlockApply(record) ? record.submitTime : record.submitTime
        if (filters.dateFrom && time < `${filters.dateFrom} 00:00:00`) return false
        if (filters.dateTo && time > `${filters.dateTo} 23:59:59`) return false
      }

      if (!kw) return true

      if (isUnlockApply(record)) {
        return (
          record.deviceName.toLowerCase().includes(kw) ||
          record.deviceCode.toLowerCase().includes(kw) ||
          record.applicantName.toLowerCase().includes(kw)
        )
      }

      return (
        record.ownerName.toLowerCase().includes(kw) ||
        record.summary.toLowerCase().includes(kw)
      )
    })
  }, [filters, unlockApplies])

  const searchPlaceholder =
    filters.bizType === "开锁审批"
      ? "搜索设备名称/设备编码/申请人"
      : "搜索货主名称/资讯名称"

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["my-apply-records-page"]}>
        <NavBar title="我的申请记录" backTo="/m/tasks" />
      </PrototypeAnnotationTarget>

      <PrototypeAnnotationTarget annotationIds={["my-apply-records-filter"]}>
      <div className="shrink-0 space-y-2 border-b border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs">
        <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:bg-white"
            value={filters.keyword}
            onChange={(e) => updateFilters((c) => ({ ...c, keyword: e.target.value }))}
          />
          {filters.keyword ? (
            <button
              type="button"
              onClick={() => updateFilters((c) => ({ ...c, keyword: "" }))}
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
            label="业务类型"
            value={filters.bizType}
            options={bizTypeOptions}
            onChange={(val) =>
              updateFilters((c) => ({ ...c, bizType: val as MyApplyFilters["bizType"] }))
            }
          />
          <DropdownFilterPill
            label="是否需要审核"
            value={filters.needsApproval}
            options={needsApprovalOptions}
            onChange={(val) =>
              updateFilters((c) => ({
                ...c,
                needsApproval: val as MyApplyFilters["needsApproval"],
              }))
            }
          />
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-gray-400 shrink-0">发起日期</span>
          <input
            type="date"
            className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-gray-700"
            value={filters.dateFrom}
            onChange={(e) => updateFilters((c) => ({ ...c, dateFrom: e.target.value }))}
          />
          <span className="text-gray-300">—</span>
          <input
            type="date"
            className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-gray-700"
            value={filters.dateTo}
            onChange={(e) => updateFilters((c) => ({ ...c, dateTo: e.target.value }))}
          />
        </div>
      </div>
      </PrototypeAnnotationTarget>

      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain">
        <PrototypeAnnotationTarget annotationIds={["my-apply-records-cards"]}>
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
              <FileText className="size-10 text-gray-300 mb-2" />
              <div className="text-sm font-semibold text-gray-600">
                {filters.bizType === "开锁审批" ? "暂无开锁申请" : "暂无申请记录"}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {filters.bizType === "开锁审批" ? (
                  <>
                    可从
                    <Link to={DEVICE_MANAGEMENT_PATH} className="mx-0.5 text-orange-600 font-medium">
                      设备管理 → 门禁设备
                    </Link>
                    发起临时开锁申请
                  </>
                ) : (
                  "请调整搜索或筛选条件"
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((record) =>
                isUnlockApply(record) ? (
                  <MyUnlockApplyCard key={record.applyNo} apply={record} />
                ) : (
                  <ProcessApplyCard key={record.id} record={record} />
                )
              )}
            </div>
          )}
        </PrototypeAnnotationTarget>
      </div>
    </MobileShell>
  )
}
