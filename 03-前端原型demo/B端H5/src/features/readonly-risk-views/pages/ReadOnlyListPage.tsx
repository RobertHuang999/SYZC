import { Search, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { getReadonlyRiskModuleMeta } from "../config"
import { READONLY_RISK_RECORDS } from "../mock/readonly-risk.mock"
import type { ReadonlyRiskModule, ReadonlyRiskRecord, ReadonlyStatusTone } from "../types"
import { useMemo, useState } from "react"

const TONE_CLASS: Record<ReadonlyStatusTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  neutral: "border-gray-200 bg-gray-100 text-gray-600",
}

function StatusBadge({ tone, children }: { tone: ReadonlyStatusTone; children: string }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${TONE_CLASS[tone]}`}>
      {children}
    </span>
  )
}

function SummaryValue({ field }: { field: ReadonlyRiskRecord["summary"][number] }) {
  return field.tone ? (
    <StatusBadge tone={field.tone}>{field.value}</StatusBadge>
  ) : (
    <span className="text-right font-medium text-gray-800">{field.value}</span>
  )
}

export function ReadOnlyListPage({ module }: { module: ReadonlyRiskModule }) {
  const meta = getReadonlyRiskModuleMeta(module)
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState("全部")
  const records = READONLY_RISK_RECORDS[module]
  const statuses = useMemo(
    () => ["全部", ...Array.from(new Set(records.map((record) => record.status)))],
    [records]
  )
  const filteredRecords = useMemo(() => {
    const normalized = keyword.trim().toLowerCase()
    return records.filter(
      (record) =>
        (status === "全部" || record.status === status) &&
        (!normalized || record.searchText.toLowerCase().includes(normalized))
    )
  }, [keyword, records, status])

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={[`h5-${module}-list-page`]}>
        <NavBar
          title={meta.title}
          right={
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
              <ShieldCheck className="size-3" />
              只读
            </span>
          }
        />
      </PrototypeAnnotationTarget>

      <div className="flex flex-1 min-h-0 flex-col bg-[#f4f6f8]">
        <PrototypeAnnotationTarget annotationIds={[`h5-${module}-list-filter`]}>
          <div className="shrink-0 space-y-2 border-b border-gray-200/80 bg-white px-3.5 py-2.5">
            <p className="text-[11px] text-gray-500">{meta.subtitle}</p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="搜索关键词"
                  className="w-full rounded-xl bg-[#f4f5f7] py-2.5 pl-9 pr-3 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="max-w-[104px] rounded-xl border border-gray-200 bg-white px-2 py-2.5 text-xs text-gray-700 outline-hidden"
                aria-label="状态筛选"
              >
                {statuses.map((option) => (
                  <option key={option} value={option}>
                    {option === "全部" ? "全部状态" : option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pb-6 overscroll-contain">
          <div className="flex items-center justify-between px-0.5 text-[11px] text-gray-500">
            <span>共 {filteredRecords.length} 条记录</span>
            <span>移动端仅支持查看</span>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-400">
              {meta.emptyText}
            </div>
          ) : (
            <PrototypeAnnotationTarget annotationIds={[`h5-${module}-list-row`]}>
              <div className="space-y-3">
                {filteredRecords.map((record) => (
                  <Link
                    key={record.id}
                    to={`${meta.detailPath}/${record.id}`}
                    className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-xs active:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-bold text-gray-900">{record.title}</h2>
                        <p className="mt-1 truncate text-xs text-gray-500">{record.subtitle}</p>
                      </div>
                      <StatusBadge tone={record.statusTone}>{record.status}</StatusBadge>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 border-t border-gray-100 pt-3 text-xs">
                      {record.summary.map((field) => (
                        <div key={field.label} className="flex items-start justify-between gap-3">
                          <span className="shrink-0 text-gray-400">{field.label}</span>
                          <SummaryValue field={field} />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-right text-[11px] font-semibold text-blue-600">
                      查看详情
                    </div>
                  </Link>
                ))}
              </div>
            </PrototypeAnnotationTarget>
          )}
        </div>
      </div>
    </MobileShell>
  )
}
