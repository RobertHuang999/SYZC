import { useEffect, useMemo, useState } from "react"
import { Filter, Plus, RotateCcw, Search, X } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { parsePartnerArchiveMenuFromH5ListPath } from "@prototype/shared/partner-archives/partner-archive-domain"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import {
  DropdownFilterPill,
  type DropdownOption,
} from "@/components/ui/DropdownFilterPill"
import { DrawerField, FilterDrawer } from "@/components/ui/FilterDrawer"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  H5_FILTER_BAR,
  H5_FILTER_PILL_ROW,
  H5_LIST_SCROLL,
  H5_PAGE_BODY,
} from "@/shared/h5-ui-theme"
import { partnerArchivesMock } from "@prototype/B端PC/src/features/partner-archives/mock/partner-archives.mock"
import {
  DEFAULT_PARTNER_ARCHIVE_FILTERS,
  PARTNER_CONTACT_PHONE_VERIFY_FILTER_OPTIONS,
  PARTNER_SOURCE_FILTER_OPTIONS,
  PARTNER_SUBJECT_TYPE_FILTER_OPTIONS,
  partnerSubjectStatusFilterOptions,
} from "@prototype/B端PC/src/features/partner-archives/domain/constants"
import type { PartnerArchiveFilters } from "@prototype/B端PC/src/features/partner-archives/domain/types"
import { filterPartnerArchives } from "@prototype/B端PC/src/features/partner-archives/lib/list-utils"
import {
  PARTNER_LIST_CONTACT_PHONE_PLACEHOLDER,
  PARTNER_LIST_KEYWORD_PLACEHOLDER,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { PartnerArchiveCard } from "../components/PartnerArchiveCard"
import { partnerArchiveFormRoute } from "../domain/constants"
import { WORKSPACE_ROUTE } from "@/features/inbound-records/domain/constants"

const SUBJECT_TYPE_OPTIONS: DropdownOption[] = PARTNER_SUBJECT_TYPE_FILTER_OPTIONS.map(
  (v) => ({ label: v === "全部" ? "全部类型" : v, value: v }),
)
const PHONE_VERIFY_OPTIONS: DropdownOption[] = PARTNER_CONTACT_PHONE_VERIFY_FILTER_OPTIONS.map(
  (v) => ({ label: v === "全部" ? "全部核验" : v, value: v }),
)

function drawerOptions(values: readonly string[], allLabel: string): DropdownOption[] {
  return values.map((v) => ({ label: v === "全部" ? allLabel : v, value: v }))
}

export function PartnerArchiveListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const archiveMenuLabel =
    parsePartnerArchiveMenuFromH5ListPath(location.pathname) ?? "货主信息"
  const [mockTick, setMockTick] = useState(0)
  const [draftFilters, setDraftFilters] = useState<PartnerArchiveFilters>({
    ...DEFAULT_PARTNER_ARCHIVE_FILTERS,
  })
  const [appliedFilters, setAppliedFilters] = useState<PartnerArchiveFilters>({
    ...DEFAULT_PARTNER_ARCHIVE_FILTERS,
  })
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const bump = () => setMockTick((t) => t + 1)
    window.addEventListener("focus", bump)
    window.addEventListener("partner-archive-updated", bump)
    return () => {
      window.removeEventListener("focus", bump)
      window.removeEventListener("partner-archive-updated", bump)
    }
  }, [])

  const subjectStatusOptions: DropdownOption[] = useMemo(() => {
    return partnerSubjectStatusFilterOptions(archiveMenuLabel).map((v) => ({
      label: v === "全部" ? "全部状态" : v,
      value: v,
    }))
  }, [archiveMenuLabel])

  const filtered = useMemo(() => {
    void mockTick
    return filterPartnerArchives(
      [...partnerArchivesMock],
      appliedFilters,
      archiveMenuLabel,
    )
  }, [appliedFilters, mockTick, archiveMenuLabel])

  const drawerActive =
    appliedFilters.source !== "全部" ||
    appliedFilters.contactPhoneVerified !== "全部" ||
    Boolean(appliedFilters.contactPhone.trim()) ||
    Boolean(appliedFilters.createTimeStart) ||
    Boolean(appliedFilters.createTimeEnd)

  const patchDraft = (patch: Partial<PartnerArchiveFilters>) => {
    setDraftFilters((prev) => ({ ...prev, ...patch }))
  }

  const applyDrawer = () => {
    setAppliedFilters({ ...draftFilters })
    setDrawerOpen(false)
  }

  const resetAll = () => {
    const next = { ...DEFAULT_PARTNER_ARCHIVE_FILTERS }
    setDraftFilters(next)
    setAppliedFilters(next)
  }

  return (
    <MobileShell>
      <div className={`relative ${H5_PAGE_BODY} bg-[#edf2f8]`}>
        <PrototypeAnnotationTarget annotationIds={["partner-archive-page"]}>
          <NavBar title={archiveMenuLabel} backTo={WORKSPACE_ROUTE} />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["partner-archive-filter"]}>
        <div className={H5_FILTER_BAR}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDraftFilters({ ...appliedFilters })
                setDrawerOpen(true)
              }}
              className="relative flex size-7 shrink-0 items-center justify-center rounded-md text-[#232D39]/50 active:bg-[#232D39]/5"
              aria-label="更多筛选"
            >
              <Filter className="size-4" />
              {drawerActive ? (
                <span className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  1
                </span>
              ) : null}
            </button>
            <div className="relative min-w-0 flex-1">
              <input
                type="text"
                placeholder={PARTNER_LIST_KEYWORD_PLACEHOLDER}
                className="w-full rounded-xl bg-[#f4f5f7] py-2 pl-3.5 pr-8 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                value={appliedFilters.keyword}
                onChange={(e) => {
                  const keyword = e.target.value
                  setDraftFilters((f) => ({ ...f, keyword }))
                  setAppliedFilters((f) => ({ ...f, keyword }))
                }}
              />
              {appliedFilters.keyword ? (
                <button
                  type="button"
                  onClick={() => {
                    patchDraft({ keyword: "" })
                    setAppliedFilters((f) => ({ ...f, keyword: "" }))
                  }}
                  className="absolute right-2.5 top-1/2 flex size-3.5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-300 text-gray-600"
                >
                  <X className="size-2" />
                </button>
              ) : (
                <Search className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
              )}
            </div>
          </div>

          <div className={H5_FILTER_PILL_ROW}>
            <DropdownFilterPill
              compactRow
              label="主体类型"
              value={appliedFilters.subjectType}
              options={SUBJECT_TYPE_OPTIONS}
              onChange={(subjectType) => {
                const next = { ...appliedFilters, subjectType }
                setDraftFilters(next)
                setAppliedFilters(next)
              }}
            />
            <DropdownFilterPill
              compactRow
              label="主体状态"
              value={appliedFilters.subjectStatus}
              options={subjectStatusOptions}
              onChange={(subjectStatus) => {
                const next = { ...appliedFilters, subjectStatus }
                setDraftFilters(next)
                setAppliedFilters(next)
              }}
            />
            <DropdownFilterPill
              compactRow
              label="联系手机核验"
              value={appliedFilters.contactPhoneVerified}
              options={PHONE_VERIFY_OPTIONS}
              onChange={(contactPhoneVerified) => {
                const next = { ...appliedFilters, contactPhoneVerified }
                setDraftFilters(next)
                setAppliedFilters(next)
              }}
            />
          </div>
        </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget
          flexGrow
          annotationIds={["partner-archive-table", "partner-archive-row-actions"]}
        >
        <div className={`${H5_LIST_SCROLL} space-y-2.5 px-3 pb-24 pt-2`}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-white text-[#232D39]/20 shadow-xs">
                <Search className="size-7" />
              </div>
              <p className="text-xs font-medium text-[#232D39]/60">未找到符合条件的合作方档案</p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-blue-200 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-xs"
              >
                <RotateCcw className="size-3" />
                重置筛选条件
              </button>
            </div>
          ) : (
            filtered.map((row) => <PartnerArchiveCard key={row.id} item={row} />)
          )}
          <PrototypeAnnotationTarget annotationIds={["partner-archive-pagination"]}>
            {filtered.length > 0 ? (
              <p className="pb-2 pt-1 text-center text-[10px] text-[#232D39]/45">
                共 {filtered.length} 条 · 当前筛选结果一次展示
              </p>
            ) : (
              <span className="sr-only">列表分页占位</span>
            )}
          </PrototypeAnnotationTarget>
        </div>
        </PrototypeAnnotationTarget>

        <button
          type="button"
          className="fixed bottom-20 right-4 flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg active:bg-blue-700"
          aria-label="新增合作方"
          onClick={() => navigate(partnerArchiveFormRoute(archiveMenuLabel))}
        >
          <Plus className="size-7" />
        </button>

        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onReset={() => {
            setDraftFilters({
              ...appliedFilters,
              source: "全部",
              contactPhoneVerified: "全部",
              contactPhone: "",
              createTimeStart: "",
              createTimeEnd: "",
            })
          }}
          onConfirm={applyDrawer}
        >
          <DrawerField label="创建来源">
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={draftFilters.source}
              onChange={(e) => patchDraft({ source: e.target.value })}
            >
              {drawerOptions(PARTNER_SOURCE_FILTER_OPTIONS, "全部来源").map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </DrawerField>
          <DrawerField label="联系手机">
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder={PARTNER_LIST_CONTACT_PHONE_PLACEHOLDER}
              value={draftFilters.contactPhone}
              onChange={(e) => patchDraft({ contactPhone: e.target.value })}
            />
          </DrawerField>
          <DrawerField label="创建时间起">
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={draftFilters.createTimeStart}
              onChange={(e) => patchDraft({ createTimeStart: e.target.value })}
            />
          </DrawerField>
          <DrawerField label="创建时间止">
            <input
              type="date"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={draftFilters.createTimeEnd}
              onChange={(e) => patchDraft({ createTimeEnd: e.target.value })}
            />
          </DrawerField>
        </FilterDrawer>
      </div>
    </MobileShell>
  )
}
