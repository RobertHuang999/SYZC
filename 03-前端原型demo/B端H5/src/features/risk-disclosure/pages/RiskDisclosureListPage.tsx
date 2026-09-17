import { useMemo, useState } from "react"
import { Search, ShieldAlert, X } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { DropdownFilterPill } from "@/components/ui/DropdownFilterPill"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { READONLY_RISK_RECORDS } from "@/features/readonly-risk-views/mock/readonly-risk.mock"
import { RiskDisclosureCard } from "../components/RiskDisclosureCard"
import {
  RISK_DISCLOSURE_SEARCH_FIELD_OPTIONS,
  RISK_DISCLOSURE_SEARCH_PLACEHOLDERS,
  type RiskDisclosureSearchField,
} from "../domain/list-filters"
import { matchRiskDisclosureRecordByField } from "../lib/display-utils"

export function RiskDisclosureListPage() {
  const records = useMemo(
    () =>
      READONLY_RISK_RECORDS["risk-disclosure"].filter(
        (record) => record.status === "已公示"
      ),
    []
  )
  const [searchField, setSearchField] =
    useState<RiskDisclosureSearchField>("orderNo")
  const [keyword, setKeyword] = useState("")

  const filteredRecords = useMemo(
    () =>
      records.filter((record) =>
        matchRiskDisclosureRecordByField(record, searchField, keyword)
      ),
    [keyword, records, searchField]
  )

  const resetFilters = () => {
    setSearchField("orderNo")
    setKeyword("")
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["h5-risk-disclosure-list-page"]}>
        <NavBar title="风险公示" />
      </PrototypeAnnotationTarget>

      <div className="flex flex-1 flex-col overflow-hidden">
        <PrototypeAnnotationTarget annotationIds={["h5-risk-disclosure-list-filter"]}>
          <div className="shrink-0 border-b border-gray-200/80 bg-white px-3.5 py-2.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <DropdownFilterPill
                label="搜索字段"
                value={searchField}
                options={[...RISK_DISCLOSURE_SEARCH_FIELD_OPTIONS]}
                onChange={(value) =>
                  setSearchField(value as RiskDisclosureSearchField)
                }
              />

              <div className="relative min-w-0 flex-1">
                <input
                  type="text"
                  placeholder={RISK_DISCLOSURE_SEARCH_PLACEHOLDERS[searchField]}
                  aria-label="风险公示搜索"
                  className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
                {keyword ? (
                  <button
                    type="button"
                    onClick={() => setKeyword("")}
                    className="absolute top-1/2 right-2.5 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-300 text-gray-600"
                  >
                    <X className="size-2.5" />
                  </button>
                ) : (
                  <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3.5 py-3 overscroll-contain">
          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
              <ShieldAlert className="mb-2 size-10 text-gray-300" />
              <div className="text-sm font-semibold text-gray-600">暂无符合条件的风险公示</div>
              <p className="mt-1 text-xs text-gray-400">
                请尝试调整搜索字段或关键词
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 cursor-pointer rounded-xl bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-700 active:bg-gray-200"
              >
                重置所有筛选
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <RiskDisclosureCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileShell>
  )
}
