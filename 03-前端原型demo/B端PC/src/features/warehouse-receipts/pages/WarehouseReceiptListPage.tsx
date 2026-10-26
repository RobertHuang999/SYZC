import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import type {
  ReceiptRowAction,
  WarehouseReceipt,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import { receiptFlowConflictMessage } from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  EMPTY_RECEIPT_FILTERS,
  matchReceiptFilters,
  paginateReceipts,
  sortReceiptsByEstablishedDesc,
  type ReceiptFilters,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-filters"
import { RECEIPT_H5_FLOW_HINT } from "@prototype/shared/warehouse-receipts/warehouse-receipt-routes"
import { warehouseReceiptListAnnotations } from "../annotations/warehouse-receipt-list.annotations"
import {
  ReceiptDownloadDialog,
  ReceiptNoticeDialog,
  ReceiptQrGuideDialog,
} from "../components/ReceiptDialogs"
import { ReceiptFiltersPanel } from "../components/ReceiptFiltersPanel"
import { ReceiptTable } from "../components/ReceiptTable"
import { warehouseReceiptDocuments } from "../documents/warehouse-receipt-documents"
import {
  PAGE_SIZE,
  RECEIPT_LIST_STATE_KEY,
  receiptDetailPath,
} from "../domain/constants"
import { warehouseReceiptsMock } from "../mock/warehouse-receipts.mock"

type ListState = {
  filters: ReceiptFilters
  page: number
  pageSize: number
}

function readListState(): ListState | null {
  try {
    const raw = window.sessionStorage.getItem(RECEIPT_LIST_STATE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ListState
  } catch {
    return null
  }
}

const GUIDE_TITLE: Partial<Record<ReceiptRowAction, string>> = {
  replenish: "仓单补货 · 移动端办理",
  outbound: "仓单出库 · 移动端办理",
  inbound: "仓单入库 · 移动端办理",
  relocate: "仓单移库 · 移动端办理",
  remove: "仓单移除 · 移动端办理",
  cancel: "仓单注销 · 移动端办理",
}

export function WarehouseReceiptListPage() {
  const navigate = useNavigate()
  const [restored] = useState<ListState | null>(readListState)

  const [rows] = useState<WarehouseReceipt[]>(() => [...warehouseReceiptsMock])
  const [draftFilters, setDraftFilters] = useState<ReceiptFilters>(
    restored?.filters ?? EMPTY_RECEIPT_FILTERS,
  )
  const [appliedFilters, setAppliedFilters] = useState<ReceiptFilters>(
    restored?.filters ?? EMPTY_RECEIPT_FILTERS,
  )
  const [page, setPage] = useState(restored?.page ?? 1)
  const [pageSize, setPageSize] = useState(restored?.pageSize ?? PAGE_SIZE)
  const [expanded, setExpanded] = useState(false)

  const [issueOpen, setIssueOpen] = useState(false)
  const [guideTarget, setGuideTarget] = useState<{
    receipt: WarehouseReceipt
    action: ReceiptRowAction
  } | null>(null)
  const [downloadTarget, setDownloadTarget] = useState<WarehouseReceipt | null>(null)
  const [notice, setNotice] = useState<{ title: string; description: string } | null>(
    null,
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    window.sessionStorage.setItem(
      RECEIPT_LIST_STATE_KEY,
      JSON.stringify({ filters: appliedFilters, page, pageSize } satisfies ListState),
    )
  }, [appliedFilters, page, pageSize])

  const filtered = useMemo(() => {
    const matched = rows.filter((row) => matchReceiptFilters(row, appliedFilters))
    return sortReceiptsByEstablishedDesc(matched)
  }, [rows, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(
    () => paginateReceipts(filtered, currentPage, pageSize),
    [filtered, currentPage, pageSize],
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2600)
  }

  const handleSearch = () => {
    if (
      draftFilters.establishedStart &&
      draftFilters.establishedEnd &&
      draftFilters.establishedStart > draftFilters.establishedEnd
    ) {
      showToast("开立时间的开始日期不得晚于结束日期")
      return
    }
    if (
      draftFilters.createdStart &&
      draftFilters.createdEnd &&
      draftFilters.createdStart > draftFilters.createdEnd
    ) {
      showToast("制单时间的开始日期不得晚于结束日期")
      return
    }
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(EMPTY_RECEIPT_FILTERS)
    setAppliedFilters(EMPTY_RECEIPT_FILTERS)
    setPage(1)
  }

  const handleRowAction = (action: ReceiptRowAction, item: WarehouseReceipt) => {
    if (action === "detail") {
      navigate(receiptDetailPath(item.id))
      return
    }
    if (action === "download") {
      setDownloadTarget(item)
      return
    }

    // R-DWR-04：补货/出库/移库/注销四类流程在途互斥
    if (
      item.currentFlow &&
      ["replenish", "outbound", "relocate", "cancel"].includes(action)
    ) {
      setNotice({
        title: "暂无法发起新的流程",
        description: receiptFlowConflictMessage(item.currentFlow),
      })
      return
    }

    setGuideTarget({ receipt: item, action })
  }

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      showToast("仓单编号已复制到剪贴板！")
    } catch {
      showToast(`复制失败，请手动选中复制：${code}`)
    }
  }

  const guide = guideTarget ? buildGuide(guideTarget.action) : null

  return (
    <PrototypeAnnotationProvider
      title="仓单管理"
      documents={warehouseReceiptDocuments}
      annotations={warehouseReceiptListAnnotations}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["receipt-list-page"]}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                仓单管理
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                数字资产确权与全生命周期监控台账；按当前账号管辖仓库隔离，最新开立的仓单排在最前。
              </p>
            </div>
            <PrototypeAnnotationTarget annotationIds={["receipt-list-issue-guide"]}>
              <Button type="button" onClick={() => setIssueOpen(true)}>
                <PlusIcon className="size-4" />
                仓单开立
              </Button>
            </PrototypeAnnotationTarget>
          </div>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["receipt-list-filter"]}>
            <ReceiptFiltersPanel
              value={draftFilters}
              expanded={expanded}
              onToggleExpanded={() => setExpanded((prev) => !prev)}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </PrototypeAnnotationTarget>
        </form>

        <div className="space-y-4">
          <PrototypeAnnotationTarget
            annotationIds={["receipt-list-table", "receipt-list-row-actions"]}
          >
            <ReceiptTable
              data={pageData}
              page={currentPage}
              pageSize={pageSize}
              onAction={handleRowAction}
              onCopyCode={copyCode}
            />
          </PrototypeAnnotationTarget>

          <WarningListPagination
            total={filtered.length}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
            totalLabel="条仓单"
          />
        </div>
      </div>

      <ReceiptQrGuideDialog
        open={issueOpen}
        onOpenChange={setIssueOpen}
        title="仓单开立引导"
        description="数字仓单开立须现场核验物理货位并完成实名双因子认证。"
        pathHint={RECEIPT_H5_FLOW_HINT["仓单开立"]}
      />

      <ReceiptQrGuideDialog
        open={Boolean(guide)}
        onOpenChange={(open) => !open && setGuideTarget(null)}
        title={guide?.title ?? ""}
        description={guide?.description}
        pathHint={guide?.pathHint ?? ""}
        receiptCode={guideTarget?.receipt.code}
      />

      <ReceiptDownloadDialog
        open={Boolean(downloadTarget)}
        onOpenChange={(open) => !open && setDownloadTarget(null)}
        receipt={downloadTarget}
        onConfirm={(kind) => {
          showToast(
            `${kind === "original" ? "电子仓单正本" : "仓单变更确认单"} ${
              downloadTarget?.code ?? ""
            }.pdf 生成中`,
          )
          setDownloadTarget(null)
        }}
      />

      <ReceiptNoticeDialog
        open={Boolean(notice)}
        onOpenChange={(open) => !open && setNotice(null)}
        title={notice?.title ?? ""}
        description={notice?.description ?? ""}
      />

      {toastMessage ? (
        <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </PrototypeAnnotationProvider>
  )
}

function buildGuide(action: ReceiptRowAction) {
  const title = GUIDE_TITLE[action] ?? "移动端办理"
  const description =
    action === "cancel"
      ? "仓单注销须先阅读重要提醒并二次确认，再由当事人完成活体人脸识别与电子签章。"
      : "该操作会变更仓单货权或底层物理库存，须由当事人在移动端完成活体人脸识别。"
  const key = title.replace(" · 移动端办理", "")
  const pathHint =
    RECEIPT_H5_FLOW_HINT[key] ?? `工作台 → 仓单管理 → 更多操作 → ${key}`

  return { title, description, pathHint }
}
