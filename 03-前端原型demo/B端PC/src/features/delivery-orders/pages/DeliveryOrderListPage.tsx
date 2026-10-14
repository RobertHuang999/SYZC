import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { DeliveryOrderWriteOffDialog } from "../components/DeliveryOrderWriteOffDialog"
import { DeliveryOrderConfirmDialog } from "../components/DeliveryOrderConfirmDialog"
import { DeliveryOrderCancelDialog } from "../components/DeliveryOrderCancelDialog"
import { DeliveryOrderLogDialog } from "../components/DeliveryOrderLogDialog"
import {
  deliveryOrdersMock,
  completeDeliveryOrder,
  cancelDeliveryOrder,
} from "../mock/delivery-orders.mock"
import type { DeliveryOrderItem, DeliveryOrderFilters } from "../domain/types"

export function DeliveryOrderListPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<DeliveryOrderItem[]>(() => [...deliveryOrdersMock])

  // 筛选状态
  const [filters, setFilters] = useState<DeliveryOrderFilters>({
    nameOrIdentity: "",
    pickNameOrMobile: "",
    status: "全部",
  })

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
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

  // 过滤
  const filtered = useMemo(() => {
    return rows.filter((item) => {
      if (
        filters.nameOrIdentity.trim() &&
        !item.ownerName.includes(filters.nameOrIdentity.trim()) &&
        !item.ownerIdentity.includes(filters.nameOrIdentity.trim())
      ) {
        return false
      }
      if (
        filters.pickNameOrMobile.trim() &&
        !item.pickupName.includes(filters.pickNameOrMobile.trim()) &&
        !item.pickupPhone.includes(filters.pickNameOrMobile.trim())
      ) {
        return false
      }
      if (filters.status && filters.status !== "全部" && item.status !== filters.status) {
        return false
      }
      return true
    })
  }, [rows, filters])

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
    <div className="space-y-4 p-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">提货单</h1>
        <p className="text-sm text-muted-foreground mt-1">
          管理大宗存货出库终审通过后的实物交接核销，支持 4 位动态提货码核销与免码直接确认双通道履约
        </p>
      </div>

      {/* 顶部单行筛选区（无重置按钮，符合PRD与ASCII规范） */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-foreground whitespace-nowrap">货主名称/标识：</span>
          <Input
            value={filters.nameOrIdentity}
            onChange={(e) => setFilters((f) => ({ ...f, nameOrIdentity: e.target.value }))}
            placeholder="请输入货主名称/标识"
            className="w-48 h-8 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-foreground whitespace-nowrap">提货人姓名/手机号：</span>
          <Input
            value={filters.pickNameOrMobile}
            onChange={(e) => setFilters((f) => ({ ...f, pickNameOrMobile: e.target.value }))}
            placeholder="请输入提货人姓名或手机号"
            className="w-48 h-8 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-foreground whitespace-nowrap">提货状态：</span>
          <Select
            value={filters.status}
            onValueChange={(val) => setFilters((f) => ({ ...f, status: val || "全部" }))}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部" className="text-xs">全部状态</SelectItem>
              <SelectItem value="未提货" className="text-xs">未提货</SelectItem>
              <SelectItem value="已提货" className="text-xs">已提货</SelectItem>
              <SelectItem value="已取消" className="text-xs">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          size="sm"
          className="h-8 bg-amber-600 hover:bg-amber-700 text-white text-xs px-4 ml-auto"
          onClick={() => setPage(1)}
        >
          查 询
        </Button>
      </div>

      {/* 9列标准提货单表格 */}
      <div className="rounded-md border bg-card shadow-2xs overflow-x-auto">
        <Table className="min-w-[1100px] text-xs">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-14 text-center">序号</TableHead>
              <TableHead className="w-56">货主</TableHead>
              <TableHead className="min-w-[200px]">货物</TableHead>
              <TableHead className="w-48">提货人</TableHead>
              <TableHead className="w-24 text-center">出库类型</TableHead>
              <TableHead className="w-20 text-center">状态</TableHead>
              <TableHead className="w-44">操作人</TableHead>
              <TableHead className="w-36 text-center">时间</TableHead>
              <TableHead className="w-48 text-center sticky right-0 bg-muted/40 shadow-xs">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-12 text-center text-xs text-muted-foreground">
                  暂无匹配的提货单数据
                </TableCell>
              </TableRow>
            ) : (
              pagedList.map((item, idx) => {
                const isPending = item.status === "未提货"

                return (
                  <TableRow key={item.id} className="hover:bg-muted/20">
                    <TableCell className="text-center text-muted-foreground">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </TableCell>

                    {/* 货主 */}
                    <TableCell>
                      <div className="font-medium text-foreground">{item.ownerName}</div>
                      <div className="text-[11px] text-muted-foreground">{item.ownerIdentity}</div>
                    </TableCell>

                    {/* 货物 */}
                    <TableCell>
                      <div className="space-y-1">
                        {item.goodsSummaryList.map((g, i) => (
                          <div key={i} className="text-foreground">
                            {g.categoryName}-{g.subCategoryName}-{g.specName}：
                            <strong className="text-primary ml-1">{g.amount} {g.unit}</strong>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    {/* 提货人 */}
                    <TableCell>
                      {item.pickupPersonType === "企业" ? (
                        <div>
                          <div>{item.pickupOperator || item.pickupName}({item.pickupPhone})经办人</div>
                          <Popover>
                            <PopoverTrigger className="text-amber-600 hover:underline text-[11px] mt-0.5 cursor-pointer">
                              更多
                            </PopoverTrigger>
                            <PopoverContent className="w-64 text-xs space-y-1 p-3">
                              <p>• 企业名称：{item.pickupName}</p>
                              <p>• 企业信用码：{item.pickupIdentity || "—"}</p>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-foreground">{item.pickupName}</div>
                          <div className="text-[11px] text-muted-foreground">({item.pickupPhone})</div>
                        </div>
                      )}
                    </TableCell>

                    {/* 出库类型 */}
                    <TableCell className="text-center font-medium">
                      {item.outboundType}
                    </TableCell>

                    {/* 状态 */}
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          item.status === "未提货"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : item.status === "已提货"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>

                    {/* 操作人 */}
                    <TableCell>
                      <div>{item.operatorName}</div>
                      {item.operatorOrg && (
                        <div className="text-[11px] text-muted-foreground">({item.operatorOrg})</div>
                      )}
                    </TableCell>

                    {/* 时间 */}
                    <TableCell className="text-center text-muted-foreground">
                      {item.createTime}
                    </TableCell>

                    {/* 操作列（未提货全量可点，已提货/已取消置灰不可点） */}
                    <TableCell className="text-center sticky right-0 bg-card shadow-xs">
                      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                        {/* 查看详情（跳转至关联的出库单详情） */}
                        <button
                          type="button"
                          onClick={() => navigate(`/仓储/出库管理/出库记录/详情/${item.outboundOrderNo}`)}
                          className="text-primary hover:underline"
                        >
                          查看详情
                        </button>

                        <span className="text-muted-foreground/30">|</span>

                        {/* 操作记录 */}
                        <button
                          type="button"
                          onClick={() => setLogTarget(item)}
                          className="text-primary hover:underline"
                        >
                          操作记录
                        </button>

                        <span className="text-muted-foreground/30">|</span>

                        {/* 核销提货码 */}
                        <button
                          type="button"
                          disabled={!isPending}
                          onClick={() => setWriteOffTarget(item)}
                          className={
                            isPending
                              ? "text-amber-600 hover:underline"
                              : "text-muted-foreground/40 cursor-not-allowed"
                          }
                        >
                          核销提货码
                        </button>

                        <span className="text-muted-foreground/30">|</span>

                        {/* 取消提货 */}
                        <button
                          type="button"
                          disabled={!isPending}
                          onClick={() => setCancelTarget(item)}
                          className={
                            isPending
                              ? "text-destructive hover:underline"
                              : "text-muted-foreground/40 cursor-not-allowed"
                          }
                        >
                          取消提货
                        </button>

                        <span className="text-muted-foreground/30">|</span>

                        {/* 确认提货 */}
                        <button
                          type="button"
                          disabled={!isPending}
                          onClick={() => setConfirmTarget(item)}
                          className={
                            isPending
                              ? "text-emerald-600 hover:underline font-medium"
                              : "text-muted-foreground/40 cursor-not-allowed"
                          }
                        >
                          确认提货
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

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

      {/* 核销提货码弹窗 */}
      <DeliveryOrderWriteOffDialog
        open={writeOffTarget !== null}
        order={writeOffTarget}
        onClose={() => setWriteOffTarget(null)}
        onSuccess={handleWriteOffSuccess}
        onResetCode={() => showToast("已成功重置并向提货人重新发送 4 位提货核销码短信！")}
      />

      {/* 免码确认提货弹窗 */}
      <DeliveryOrderConfirmDialog
        open={confirmTarget !== null}
        order={confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onSuccess={handleConfirmPickupSuccess}
      />

      {/* 取消提货弹窗 */}
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
        <div className="fixed bottom-16 right-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg animate-in fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
