import { useMemo, useState } from "react"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  DEFAULT_UNLOCK_APPLY_FILTERS,
  PAGE_SIZE,
} from "../domain/constants"
import type { UnlockApply, UnlockApplyFilters } from "../domain/types"
import { UnlockApplyFiltersPanel } from "../components/UnlockApplyFilters"
import { UnlockApplyTable } from "../components/UnlockApplyTable"
import { UnlockApplyApprovalDialog } from "../components/UnlockApplyApprovalDialog"
import {
  filterUnlockApplies,
  paginateUnlockApplies,
} from "../lib/list-utils"
import { useUnlockApplies } from "../lib/unlock-applies-store"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { unlockApplyAuditListAnnotations } from "../annotations/unlock-apply-audit-list.annotations"
import { unlockApplyAuditDocuments } from "../documents/unlock-apply-audit-documents"

const FILTER_CACHE_KEY = "SYZC_PC_UNLOCK_APPLY_FILTERS"

function loadCachedFilters(): UnlockApplyFilters {
  try {
    const raw = sessionStorage.getItem(FILTER_CACHE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_UNLOCK_APPLY_FILTERS
}

function saveCachedFilters(filters: UnlockApplyFilters) {
  try {
    sessionStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(filters))
  } catch {}
}

export function UnlockApplyListPage() {
  const [draftFilters, setDraftFilters] = useState<UnlockApplyFilters>(loadCachedFilters)
  const [appliedFilters, setAppliedFilters] = useState<UnlockApplyFilters>(loadCachedFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [processingApply, setProcessingApply] = useState<UnlockApply | null>(null)
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const openApproval = (apply: UnlockApply) => {
    setProcessingApply(apply)
    setApprovalOpen(true)
  }

  const allApplies = useUnlockApplies()

  const filteredItems = useMemo(
    () =>
      filterUnlockApplies(
        allApplies.filter((item) => item.needsApproval),
        appliedFilters
      ),
    [allApplies, appliedFilters]
  )

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => paginateUnlockApplies(filteredItems, currentPage, pageSize),
    [filteredItems, currentPage, pageSize]
  )

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    saveCachedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_UNLOCK_APPLY_FILTERS)
    setAppliedFilters(DEFAULT_UNLOCK_APPLY_FILTERS)
    saveCachedFilters(DEFAULT_UNLOCK_APPLY_FILTERS)
    setPage(1)
  }

  return (
    <PrototypeAnnotationProvider
      title="开锁审核列表 · 原型交互与 PRD 标注"
      annotations={unlockApplyAuditListAnnotations}
      documents={unlockApplyAuditDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["unlock-apply-audit-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">开锁审核</h1>
            <p className="text-sm text-muted-foreground">
              处理挂锁/人脸门禁临时开锁申请；不进待处理/已处理
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-apply-audit-filter"]}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSearch()
            }}
          >
            <UnlockApplyFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </form>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-apply-audit-table"]}>
          <div className="space-y-4">
            <UnlockApplyTable
              items={pageItems}
              startIndex={(currentPage - 1) * pageSize}
              onProcess={openApproval}
            />

            <WarningListPagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredItems.length}
              onPageChange={setPage}
              onPageSizeChange={(next) => {
                setPageSize(next)
                setPage(1)
              }}
            />
          </div>
        </PrototypeAnnotationTarget>

        <UnlockApplyApprovalDialog
          open={approvalOpen}
          apply={processingApply}
          onOpenChange={setApprovalOpen}
          onApprove={(_apply, _opinion) => showToast("审批通过")}
          onReject={(_apply, _reason) => showToast("已驳回")}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
