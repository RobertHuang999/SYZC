import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { deliveryOrderDocuments } from "../documents/delivery-order-documents"
import { deliveryOrderListAnnotations } from "../annotations/delivery-order-list.annotations"
import { DeliveryOrderFiltersPanel } from "../components/DeliveryOrderFiltersPanel"
import { DeliveryOrderTable } from "../components/DeliveryOrderTable"
import { DeliveryOrderWriteOffDialog } from "../components/DeliveryOrderWriteOffDialog"
import { DeliveryOrderConfirmDialog } from "../components/DeliveryOrderConfirmDialog"
import { DeliveryOrderCancelDialog } from "../components/DeliveryOrderCancelDialog"
import { DeliveryOrderLogDialog } from "../components/DeliveryOrderLogDialog"
import {
  deliveryOrdersMock,
  completeDeliveryOrder,
  cancelDeliveryOrder,
} from "../mock/delivery-orders.mock"
import {
  PAGE_SIZE,
  DEFAULT_DELIVERY_ORDER_FILTERS,
  deliveryOrderDetailPath,
} from "../domain/constants"
import type { DeliveryOrderItem, DeliveryOrderFilters } from "../domain/types"

export function DeliveryOrderListPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<DeliveryOrderItem[]>(() => [...deliveryOrdersMock])

  // 筛选状态
  const [draftFilters, setDraftFilters] = useState<DeliveryOrderFilters>(
    DEFAULT_DELIVERY_ORDER_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<DeliveryOrderFilters>(
    DEFAULT_DELIVERY_ORDER_FILTERS
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 弹窗状态
  const [writeOffTarget, setWriteOffTarget] = useState<DeliveryOrderItem | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<DeliveryOrderItem | null>(null)
  const [cancelTarget, setCancelTarget] = useState<DeliveryOrderItem | null>(null)
  const [logTarget, setLogTarget] = useState<DeliveryOrderItem | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 2800)
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  // 过滤
  const filtered = useMemo(() => {
    return rows.filter((item) => {
      if (
        appliedFilters.nameOrIdentity.trim() &&
        !item.ownerName.includes(appliedFilters.nameOrIdentity.trim()) &&
        !item.ownerIdentity.includes(appliedFilters.nameOrIdentity.trim())
      ) {
        return false
      }
      if (
        appliedFilters.pickNameOrMobile.trim() &&
        !item.pickupName.includes(appliedFilters.pickNameOrMobile.trim()) &&
        !item.pickupPhone.includes(appliedFilters.pickNameOrMobile.trim()) &&
        !(item.pickupOperator && item.pickupOperator.includes(appliedFilters.pickNameOrMobile.trim()))
      ) {
        return false
      }
      if (
        appliedFilters.status &&
        appliedFilters.status !== "全部" &&
        item.status !== appliedFilters.status
      ) {
        return false
      }
      return true
    })
  }, [rows, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  // 核销成功回调
  const handleWriteOffSuccess = (data: {
    isSelfPickup: boolean
    notes: string
    photos: string[]
  }) => {
    if (!writeOffTarget) return
    completeDeliveryOrder(writeOffTarget.id, {
      ...data,
      actionName: "核销提货码",
    })
    setRows([...deliveryOrdersMock])
    showToast(`提货单【${writeOffTarget.orderNo}】提货码核销成功，已变迁为已提货终态并回写出库记录！`)
  }

  // 免码提货成功回调
  const handleConfirmPickupSuccess = (data: {
    isSelfPickup: boolean
    pickupPlate?: string
    notes?: string
    photos: string[]
  }) => {
    if (!confirmTarget) return
    completeDeliveryOrder(confirmTarget.id, {
      ...data,
      actionName: "免码确认提货",
    })
    setRows([...deliveryOrdersMock])
    showToast(`提货单【${confirmTarget.orderNo}】现场免码提货确认成功，状态已变迁为已提货！`)
  }

  // 取消提货回调
  const handleCancelSuccess = (reason: string) => {
    if (!cancelTarget) return
    cancelDeliveryOrder(cancelTarget.id, reason)
    setRows([...deliveryOrdersMock])
    showToast(`提货单【${cancelTarget.orderNo}】已取消作废，正在前往退货入库流程...`)
  }

  return (
    <PrototypeAnnotationProvider
      title="提货单"
      documents={deliveryOrderDocuments}
      annotations={deliveryOrderListAnnotations}
    >
      <div className="space-y-4 p-6 font-sans">
        {/* 页面标题打点 */}
        <PrototypeAnnotationTarget annotationIds={["delivery-order-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">提货单</h1>
            <p className="text-sm text-muted-foreground mt-1">
              管理大宗存货出库终审通过后的实物交接核销，支持 4 位动态提货码核销与免码直接确认双通道履约
            </p>
          </div>
        </PrototypeAnnotationTarget>

        {/* 顶部单行水平筛选区（无重置按钮，符合PRD与ASCII规范） */}
        <PrototypeAnnotationTarget annotationIds={["delivery-order-filter"]}>
          <DeliveryOrderFiltersPanel
            filters={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
          />
        </PrototypeAnnotationTarget>

        {/* 9列标准提货单表格 */}
        <PrototypeAnnotationTarget
          annotationIds={[
            "delivery-order-table-r02",
            "delivery-order-pickup-r03",
            "delivery-order-actions-matrix",
            "delivery-order-write-off-r04",
            "delivery-order-confirm-r05",
            "delivery-order-cancel-r06",
            "delivery-order-log-r08",
          ]}
        >
          <DeliveryOrderTable
            rows={pagedList}
            page={currentPage}
            pageSize={pageSize}
            onViewDetail={(item) => navigate(deliveryOrderDetailPath(item.id))}
            onViewLogs={(item) => setLogTarget(item)}
            onWriteOff={(item) => setWriteOffTarget(item)}
            onCancel={(item) => setCancelTarget(item)}
            onConfirm={(item) => setConfirmTarget(item)}
          />
        </PrototypeAnnotationTarget>

        {/* 分页 */}
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

        {/* 核销提货码弹窗 (通道 A) */}
        <DeliveryOrderWriteOffDialog
          open={writeOffTarget !== null}
          order={writeOffTarget}
          onClose={() => setWriteOffTarget(null)}
          onSuccess={handleWriteOffSuccess}
          onResetCode={() => showToast("已成功重置并向提货人重新发送 4 位提货核销码短信！")}
        />

        {/* 免码确认提货弹窗 (通道 B) */}
        <DeliveryOrderConfirmDialog
          open={confirmTarget !== null}
          order={confirmTarget}
          onClose={() => setConfirmTarget(null)}
          onSuccess={handleConfirmPickupSuccess}
        />

        {/* 取消提货弹窗 (逆向闭环) */}
        <DeliveryOrderCancelDialog
          open={cancelTarget !== null}
          order={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirmCancel={handleCancelSuccess}
        />

        {/* 操作记录弹窗 */}
        <DeliveryOrderLogDialog
          open={logTarget !== null}
          order={logTarget}
          onClose={() => setLogTarget(null)}
        />

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-16 right-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg animate-in fade-in font-sans">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
