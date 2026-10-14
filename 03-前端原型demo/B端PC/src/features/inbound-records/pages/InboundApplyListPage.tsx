import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Plus, Search, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inboundRecordListAnnotations } from "../annotations/inbound-record-list.annotations"
import { InboundApplyTable } from "../components/InboundApplyTable"
import { RevokeConfirmDialog } from "../components/RevokeConfirmDialog"
import {
  CHECK_STATUS_OPTIONS,
  DEFAULT_INBOUND_APPLY_FILTERS,
  INBOUND_APPLY_ADD_PATH,
  INBOUND_RECORD_LIST_PATH,
  PAGE_SIZE,
} from "../domain/constants"
import type { InboundApply, InboundApplyFilters } from "../domain/types"
import { inboundRecordDocuments } from "../documents/inbound-record-documents"
import {
  filterInboundApplies,
  paginateInboundRecords,
  sortInboundApplies,
} from "../lib/list-utils"
import { rollbackStagingReg } from "@/features/inbound-staging-reg/mock/inbound-staging.mock"
import { inboundAppliesMock } from "../mock/inbound-records.mock"

export function InboundApplyListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [rows, setRows] = useState<InboundApply[]>(() => [...inboundAppliesMock])
  const [draftFilters, setDraftFilters] = useState<InboundApplyFilters>(
    DEFAULT_INBOUND_APPLY_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<InboundApplyFilters>(
    DEFAULT_INBOUND_APPLY_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [revokeTarget, setRevokeTarget] = useState<InboundApply | null>(null)

  useEffect(() => {
    setRows([...inboundAppliesMock])
  }, [location.key])

  const filtered = useMemo(() => {
    const matched = filterInboundApplies(rows, appliedFilters)
    return sortInboundApplies(matched)
  }, [rows, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(
    () => paginateInboundRecords(filtered, currentPage, pageSize),
    [filtered, currentPage, pageSize]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2600)
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_INBOUND_APPLY_FILTERS)
    setAppliedFilters(DEFAULT_INBOUND_APPLY_FILTERS)
    setPage(1)
  }

  const handleReject = (item: InboundApply) => {
    const inMock = inboundAppliesMock.find((r) => r.id === item.id)
    if (inMock) inMock.checkStatus = 3
    setRows((prev) =>
      prev.map((r) =>
        r.id === item.id ? { ...r, checkStatus: 3 as const } : r,
      ),
    )
    if (item.sourceRegId) {
      rollbackStagingReg(
        item.sourceRegId,
        `正式单 ${item.orderNo} 审批驳回，暂存回退待补全（P10 Mock）`,
      )
      window.dispatchEvent(new CustomEvent("staging-reg-updated"))
      showToast(
        `已驳回 ${item.orderNo}；暂存 ${item.sourceRegId} 已回退【待补全】`,
      )
      return
    }
    showToast(`已驳回入库申请 ${item.orderNo}`)
  }

  const handleConfirmRevoke = () => {
    if (!revokeTarget) return
    const now = new Date()
    const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

    const inMock = inboundAppliesMock.find((r) => r.id === revokeTarget.id)
    if (inMock) {
      inMock.checkStatus = 4
      inMock.revokedTime = nowStr
    }
    setRows((prev) =>
      prev.map((r) =>
        r.id === revokeTarget.id
          ? {
              ...r,
              checkStatus: 4,
              revokedTime: nowStr,
            }
          : r
      )
    )
    if (revokeTarget.sourceRegId) {
      rollbackStagingReg(
        revokeTarget.sourceRegId,
        `正式单 ${revokeTarget.orderNo} 申请人撤销，暂存回退待补全（P10 Mock）`,
      )
      window.dispatchEvent(new CustomEvent("staging-reg-updated"))
      showToast(
        `已撤销 ${revokeTarget.orderNo}；暂存 ${revokeTarget.sourceRegId} 已回退【待补全】`,
      )
      setRevokeTarget(null)
      return
    }
    showToast(`入库单 ${revokeTarget.orderNo} 撤销成功`)
    setRevokeTarget(null)
  }

  return (
    <PrototypeAnnotationProvider
      title="入库申请"
      documents={inboundRecordDocuments}
      annotations={inboundRecordListAnnotations}
    >
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <PrototypeAnnotationTarget annotationIds={["inbound-apply-header"]}>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold tracking-tight">入库管理</h1>
              <div className="inline-flex rounded-lg border bg-muted/40 p-0.5 text-xs">
                <button
                  type="button"
                  className="rounded-md bg-background px-3 py-1 font-medium text-foreground shadow-sm"
                >
                  入库申请
                </button>
                <button
                  type="button"
                  className="rounded-md px-3 py-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => navigate(INBOUND_RECORD_LIST_PATH)}
                >
                  入库记录
                </button>
              </div>
            </div>
          </PrototypeAnnotationTarget>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-1.5"
              onClick={() => navigate("/仓储/入库管理/入库暂存登记")}
            >
              入库暂存登记
            </Button>
            <Button
              type="button"
              className="gap-1.5"
              onClick={() => navigate(INBOUND_APPLY_ADD_PATH)}
            >
              <Plus className="size-4" />
              新增入库
            </Button>
          </div>
        </div>

        {/* 顶部筛选表单（对齐 store-apply.vue） */}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                货主名称/标识：
              </label>
              <Input
                placeholder="请输入货主名称/标识"
                value={draftFilters.ownerKeyword}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, ownerKeyword: e.target.value }))
                }
                className="h-8 w-56 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">状态：</label>
              <Select
                value={draftFilters.checkStatus || "ALL"}
                onValueChange={(val) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    checkStatus: !val || val === "ALL" ? "" : val,
                  }))
                }
              >
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {CHECK_STATUS_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value || "ALL"}
                      value={opt.value === "" ? "ALL" : opt.value}
                      className="text-xs"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="h-8 gap-1 px-3 text-xs">
                <Search className="size-3.5" />
                查询
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-3 text-xs"
                onClick={handleReset}
              >
                <RotateCcw className="size-3.5" />
                重置
              </Button>
            </div>
          </form>
        </div>

        {/* 表格区 */}
        <InboundApplyTable
          data={pageData}
          page={currentPage}
          pageSize={pageSize}
          onRevoke={(item) => setRevokeTarget(item)}
          onReject={handleReject}
        />

        {/* 分页区 */}
        <WarningListPagination
          total={filtered.length}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setPage(1)
          }}
        />

        {/* 撤销确认弹窗 */}
        <RevokeConfirmDialog
          open={revokeTarget !== null}
          ownerName={revokeTarget?.ownerName ?? ""}
          orderNo={revokeTarget?.orderNo ?? ""}
          onClose={() => setRevokeTarget(null)}
          onConfirm={handleConfirmRevoke}
        />

        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg border bg-foreground px-4 py-2.5 text-xs text-background shadow-lg animate-in fade-in slide-in-from-bottom-2">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
