import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { FileText, Search, X } from "lucide-react"
import { DropdownFilterPill, type DropdownOption } from "@/components/ui/DropdownFilterPill"
import { DEVICE_MANAGEMENT_PATH } from "@/features/access-control-devices/domain/constants"
import {
  CREDENTIAL_STATUS_LABEL,
  CURRENT_APPLICANT_ACCOUNT,
  loadCachedUnlockTabFilters,
  MY_APPLY_STATUS_FILTER_OPTIONS,
  MY_CREDENTIAL_STATUS_FILTER_OPTIONS,
  saveCachedUnlockTabFilters,
  UNLOCK_APPLY_STATUS_LABEL,
  type UnlockTabFilters,
} from "../domain/constants"
import { useUnlockApplies } from "../lib/unlock-applies-store"
import { MyUnlockApplyCard } from "./MyUnlockApplyCard"
import { TabScrollLayout } from "@/components/layout/TabScrollLayout"

const needsApprovalOptions: DropdownOption[] = [
  { label: "全部", value: "全部" },
  { label: "是", value: "是" },
  { label: "否", value: "否" },
]

const applyStatusOptions: DropdownOption[] = [
  { label: "全部", value: "全部" },
  ...MY_APPLY_STATUS_FILTER_OPTIONS.map((status) => ({
    label: UNLOCK_APPLY_STATUS_LABEL[status],
    value: status,
  })),
]

const credentialStatusOptions: DropdownOption[] = [
  { label: "全部", value: "全部" },
  ...MY_CREDENTIAL_STATUS_FILTER_OPTIONS.map((status) => ({
    label: CREDENTIAL_STATUS_LABEL[status],
    value: status,
  })),
]

function FilterBar({
  filters,
  onChange,
}: {
  filters: UnlockTabFilters
  onChange: (next: UnlockTabFilters) => void
}) {
  return (
    <div className="shrink-0 space-y-2 border-b border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索设备名称/设备编码/申请人"
          className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:bg-white"
          value={filters.keyword}
          onChange={(e) => onChange({ ...filters, keyword: e.target.value })}
        />
        {filters.keyword ? (
          <button
            type="button"
            onClick={() => onChange({ ...filters, keyword: "" })}
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
          label="是否需要审核"
          value={filters.needsApproval}
          options={needsApprovalOptions}
          onChange={(val) =>
            onChange({
              ...filters,
              needsApproval: val as UnlockTabFilters["needsApproval"],
            })
          }
        />
        <DropdownFilterPill
          label="申请状态"
          value={filters.applyStatus}
          options={applyStatusOptions}
          onChange={(val) =>
            onChange({
              ...filters,
              applyStatus: val as UnlockTabFilters["applyStatus"],
            })
          }
        />
        <DropdownFilterPill
          label="凭证状态"
          value={filters.credentialStatus}
          options={credentialStatusOptions}
          onChange={(val) =>
            onChange({
              ...filters,
              credentialStatus: val as UnlockTabFilters["credentialStatus"],
            })
          }
        />
      </div>

      <div className="flex items-center gap-2 text-[11px]">
        <span className="text-gray-400 shrink-0">发起日期</span>
        <input
          type="date"
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-gray-700"
          value={filters.dateFrom}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
        />
        <span className="text-gray-300">—</span>
        <input
          type="date"
          className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-gray-700"
          value={filters.dateTo}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
        />
      </div>
    </div>
  )
}

export function UnlockApplyTabPanel() {
  const [filters, setFilters] = useState<UnlockTabFilters>(loadCachedUnlockTabFilters)
  const unlockApplies = useUnlockApplies()

  const updateFilters = (next: UnlockTabFilters) => {
    setFilters(next)
    saveCachedUnlockTabFilters(next)
  }

  const list = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    return unlockApplies.filter((record) => {
      if (record.applicantAccount !== CURRENT_APPLICANT_ACCOUNT) {
        return false
      }

      if (filters.needsApproval === "否" && record.needsApproval) return false
      if (filters.needsApproval === "是" && !record.needsApproval) return false

      if (filters.applyStatus !== "全部" && record.status !== filters.applyStatus) {
        return false
      }

      if (
        filters.credentialStatus !== "全部" &&
        record.credential.status !== filters.credentialStatus
      ) {
        return false
      }

      if (filters.dateFrom || filters.dateTo) {
        if (filters.dateFrom && record.submitTime < `${filters.dateFrom} 00:00:00`) {
          return false
        }
        if (filters.dateTo && record.submitTime > `${filters.dateTo} 23:59:59`) {
          return false
        }
      }

      if (!kw) return true
      return (
        record.deviceName.toLowerCase().includes(kw) ||
        record.deviceCode.toLowerCase().includes(kw) ||
        record.applicantName.toLowerCase().includes(kw)
      )
    })
  }, [filters, unlockApplies])

  return (
    <TabScrollLayout header={<FilterBar filters={filters} onChange={updateFilters} />}>
      <div className="space-y-3 px-3.5 py-3">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
            <FileText className="size-10 text-gray-300 mb-2" />
            <div className="text-sm font-semibold text-gray-600">暂无开锁申请</div>
            <p className="mt-1 text-xs text-gray-400">
              可从
              <Link to={DEVICE_MANAGEMENT_PATH} className="mx-0.5 text-orange-600 font-medium">
                设备管理 → 门禁设备
              </Link>
              发起临时开锁申请
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((apply) => (
              <MyUnlockApplyCard key={apply.applyNo} apply={apply} />
            ))}
          </div>
        )}
      </div>
    </TabScrollLayout>
  )
}
