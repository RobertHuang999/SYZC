import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { PAGE_SIZE } from "@/features/inbound-records/domain/constants"
import { ConvertToFormalDialog } from "../components/ConvertToFormalDialog"
import { InboundStagingFiltersPanel } from "../components/InboundStagingFiltersPanel"
import { InboundStagingTable } from "../components/InboundStagingTable"
import { StagingVoidDialog } from "../components/StagingVoidDialog"
import { inboundStagingListAnnotations } from "../annotations/inbound-staging-reg.annotations"
import { inboundStagingRegDocuments } from "../documents/inbound-staging-reg-documents"
import { INBOUND_STAGING_FORM_PATH } from "../domain/constants"
import {
  DEFAULT_INBOUND_STAGING_FILTERS,
  type InboundStagingFilters,
} from "../domain/staging-list-types"
import type { InboundStagingReg } from "../domain/types"
import {
  filterStagingRegs,
  paginateStagingRegs,
} from "../lib/staging-list-utils"
import { inboundStagingRegsMock, voidStagingReg } from "../mock/inbound-staging.mock"

export function InboundStagingListPage() {
  const navigate = useNavigate()
  const [convertTarget, setConvertTarget] = useState<InboundStagingReg | null>(null)
  const [voidTarget, setVoidTarget] = useState<InboundStagingReg | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [mockTick, setMockTick] = useState(0)
  const [draftFilters, setDraftFilters] = useState<InboundStagingFilters>(
    DEFAULT_INBOUND_STAGING_FILTERS,
  )
  const [appliedFilters, setAppliedFilters] = useState<InboundStagingFilters>(
    DEFAULT_INBOUND_STAGING_FILTERS,
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  useEffect(() => {
    const bump = () => setMockTick((t) => t + 1)
    window.addEventListener("focus", bump)
    window.addEventListener("staging-reg-updated", bump)
    return () => {
      window.removeEventListener("focus", bump)
      window.removeEventListener("staging-reg-updated", bump)
    }
  }, [])

  const filtered = useMemo(() => {
    void mockTick
    const sorted = [...inboundStagingRegsMock].sort((a, b) =>
      b.registeredAt.localeCompare(a.registeredAt),
    )
    return filterStagingRegs(sorted, appliedFilters)
  }, [mockTick, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(
    () => paginateStagingRegs(filtered, currentPage, pageSize),
    [filtered, currentPage, pageSize],
  )

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_INBOUND_STAGING_FILTERS)
    setAppliedFilters(DEFAULT_INBOUND_STAGING_FILTERS)
    setPage(1)
  }

  return (
    <PrototypeAnnotationProvider
      title="入库暂存登记"
      documents={inboundStagingRegDocuments}
      annotations={inboundStagingListAnnotations}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["inbound-staging-list-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">入库暂存登记</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              现场事实备忘台账，支持弱校验协作补录、一键预填转正与作废留痕（P01/P08）
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["inbound-staging-list-filter"]}>
            <InboundStagingFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              onAdd={() => navigate(INBOUND_STAGING_FORM_PATH)}
            />
          </PrototypeAnnotationTarget>
        </form>

        <div className="space-y-4">
          <PrototypeAnnotationTarget
            annotationIds={["inbound-staging-list-table", "inbound-staging-list-actions"]}
          >
            <InboundStagingTable
              data={pageData}
              page={currentPage}
              pageSize={pageSize}
              onConvert={setConvertTarget}
              onVoid={setVoidTarget}
            />
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["inbound-staging-list-pagination"]}>
            <WarningListPagination
              total={filtered.length}
              page={currentPage}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          </PrototypeAnnotationTarget>
        </div>

        <ConvertToFormalDialog
          open={Boolean(convertTarget)}
          reg={convertTarget}
          onClose={() => setConvertTarget(null)}
          onConfirmPc={(path) => {
            setConvertTarget(null)
            navigate(path)
          }}
          onCopyMobileLink={() => showToast("已复制手机端入库发起链接")}
          onMobileOnly={(h5Path) => {
            setConvertTarget(null)
            const url = `${window.location.origin}${h5Path}`
            void navigator.clipboard.writeText(url)
            showToast("已复制手机端入库发起链接；仓单转正请在手机打开该链接完成")
          }}
        />

        <StagingVoidDialog
          open={Boolean(voidTarget)}
          regNo={voidTarget?.regNo ?? ""}
          onClose={() => setVoidTarget(null)}
          onConfirm={(reason) => {
            if (voidTarget) voidStagingReg(voidTarget.regNo, reason)
            setVoidTarget(null)
            showToast("登记单已作废")
          }}
        />

        {toast ? (
          <div className="fixed right-6 bottom-6 z-50 max-w-sm rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
