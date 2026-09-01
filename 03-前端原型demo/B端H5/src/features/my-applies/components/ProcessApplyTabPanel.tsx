import { useMemo, useState } from "react"
import { FileText, Search, X } from "lucide-react"
import {
  loadCachedProcessApplyFilters,
  saveCachedProcessApplyFilters,
  type ProcessApplyFilters,
} from "../domain/constants"
import { processAppliesMock } from "../mock/my-applies.mock"
import { ProcessApplyCard } from "./ProcessApplyCard"

function FilterBar({
  filters,
  onChange,
}: {
  filters: ProcessApplyFilters
  onChange: (next: ProcessApplyFilters) => void
}) {
  return (
    <div className="shrink-0 space-y-2 border-b border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索货主名称/资讯名称"
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

export function ProcessApplyTabPanel() {
  const [filters, setFilters] = useState<ProcessApplyFilters>(loadCachedProcessApplyFilters)

  const updateFilters = (next: ProcessApplyFilters) => {
    setFilters(next)
    saveCachedProcessApplyFilters(next)
  }

  const list = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase()
    return processAppliesMock.filter((record) => {
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
        record.ownerName.toLowerCase().includes(kw) ||
        record.summary.toLowerCase().includes(kw)
      )
    })
  }, [filters])

  return (
    <>
      <FilterBar filters={filters} onChange={updateFilters} />
      <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
            <FileText className="size-10 text-gray-300 mb-2" />
            <div className="text-sm font-semibold text-gray-600">暂无流程申请</div>
            <p className="mt-1 text-xs text-gray-400">请调整搜索或筛选条件</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((record) => (
              <ProcessApplyCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
