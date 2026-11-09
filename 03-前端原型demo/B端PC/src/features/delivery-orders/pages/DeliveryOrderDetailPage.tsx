import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileText,
  KeyRound,
  Eye,
  Camera,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { DetailSection, DetailField } from "@/shared/components/DetailSection"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import { DetailTabShell } from "@/shared/components/DetailTabShell"
import { deliveryOrderDocuments } from "../documents/delivery-order-documents"
import { deliveryOrderDetailAnnotations } from "../annotations/delivery-order-detail.annotations"
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
  DELIVERY_ORDER_LIST_PATH,
  DELIVERY_STATUS_CONFIG,
} from "../domain/constants"

export function DeliveryOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("pickup")
  const [refreshKey, setRefreshKey] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)

  // 弹窗状态
  const [writeOffOpen, setWriteOffOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)

  const record = useMemo(() => {
    return (
      deliveryOrdersMock.find((r) => r.id === id || r.orderNo === id) ||
      deliveryOrdersMock[0]
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refreshKey])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 2800)
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    showToast(`已复制${label}：${text}`)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleWriteOffSuccess = (data: {
    isSelfPickup: boolean
    notes: string
    photos: string[]
  }) => {
    completeDeliveryOrder(record.id, {
      ...data,
      actionName: "核销提货码",
    })
    setRefreshKey((k) => k + 1)
    showToast(`提货单【${record.orderNo}】核销成功，已变迁为【已提货】并回写履约凭证！`)
  }

  const handleConfirmSuccess = (data: {
    isSelfPickup: boolean
    pickupPlate?: string
    notes?: string
    photos: string[]
  }) => {
    completeDeliveryOrder(record.id, {
      ...data,
      actionName: "免码确认提货",
    })
    setRefreshKey((k) => k + 1)
    showToast(`提货单【${record.orderNo}】现场免码确认成功，已变迁为【已提货】！`)
  }

  const handleCancelSuccess = (reason: string) => {
    cancelDeliveryOrder(record.id, reason)
    setRefreshKey((k) => k + 1)
    showToast(`提货单【${record.orderNo}】已取消作废，正在前往退货入库流程...`)
  }

  const isPending = record.status === "未提货"
  const statusCfg = DELIVERY_STATUS_CONFIG[record.status] || DELIVERY_STATUS_CONFIG.未提货

  return (
    <PrototypeAnnotationProvider
      title="提货单详情"
      documents={deliveryOrderDocuments}
      annotations={deliveryOrderDetailAnnotations}
    >
      <div className="space-y-6 p-6 font-sans">
        <PrototypeAnnotationTarget annotationIds={["delivery-detail-header"]}>
          <DetailPageHeader
            title="提货单详情"
            number={record.orderNo}
            numberLabel="提货单号"
            status={
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusCfg.badgeClass}`}
              >
                {record.status}
              </span>
            }
            onBack={() => navigate(DELIVERY_ORDER_LIST_PATH)}
            onCopy={() => handleCopy(record.orderNo, "提货单号")}
            copied={copied === "提货单号"}
            actions={
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={() =>
                    navigate(`/仓储/出库管理/出库记录/详情/${record.outboundOrderNo}`)
                  }
                >
                  <ExternalLink className="size-3.5" />
                  原出库单
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLogOpen(true)}
                  className="h-8 text-xs gap-1.5"
                >
                  <Clock className="size-3.5 text-muted-foreground" />
                  操作记录
                </Button>
                {isPending && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmOpen(true)}
                      className="h-8 text-xs"
                    >
                      <CheckCircle2 className="size-3.5 mr-1" />
                      免码确认提货
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setWriteOffOpen(true)}
                      className="h-8 text-xs shadow-2xs"
                    >
                      <KeyRound className="size-3.5 mr-1" />
                      核销提货码
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCancelOpen(true)}
                      className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                    >
                      取消提货
                    </Button>
                  </>
                )}
              </>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 板块 1：单据基础信息打点 */}
        <PrototypeAnnotationTarget annotationIds={["delivery-detail-base-info"]}>
          <DetailSection title="基础信息">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 text-xs">
              <DetailField label="出库单号">
                <span className="font-medium text-foreground">{record.outboundOrderNo}</span>
              </DetailField>
              <DetailField label="出库业务类型">
                <span className="font-medium text-foreground">{record.outboundType}</span>
              </DetailField>
              <DetailField label="货主主体类型">
                <span className="text-foreground">{record.ownerType}</span>
              </DetailField>
              <DetailField label="货主主体全称">
                <span className="font-medium text-foreground">{record.ownerName}</span>
              </DetailField>
              <DetailField label="货主统一信用代码/脱敏手机号">
                <span className="text-foreground">{record.ownerIdentity}</span>
              </DetailField>
              <DetailField label="出库申请发起人 (制单人)">
                <span className="font-medium text-foreground">
                  {record.operatorName}
                  {record.operatorOrg ? ` (${record.operatorOrg})` : ""}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1.5 block">
                  (R02 固化字段·全生命周期不变)
                </span>
              </DetailField>
              <DetailField label="提货单系统生成时间">
                <span className="text-foreground">{record.createTime}</span>
                <span className="text-[10px] text-muted-foreground ml-1.5 block">
                  (R02 出库审批通过落库时刻)
                </span>
              </DetailField>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <DetailTabShell
          tabs={[
            { key: "pickup", label: "提货人档案" },
            { key: "fulfillment", label: "提货凭证" },
            { key: "goods", label: "出库货品" },
            { key: "logs", label: "操作记录" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        >
        {/* 板块 2：预留提货人主体档案打点 */}
        <PrototypeAnnotationTarget annotationIds={["delivery-detail-pickup-profile"]}>
          {activeTab === "pickup" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 text-xs">
              <DetailField label="提货主体性质">
                <span className="font-medium text-foreground">{record.pickupPersonType}</span>
              </DetailField>
              <DetailField
                label={record.pickupPersonType === "企业" ? "现场提货经办人" : "提货人真实姓名"}
              >
                <span className="font-medium text-foreground">
                  {record.pickupOperator || record.pickupName}
                </span>
              </DetailField>
              <DetailField label="提货人联系电话">
                <span className="text-foreground">{record.pickupPhone}</span>
                <span className="text-[10px] text-muted-foreground ml-1">（4位码短信接收端）</span>
              </DetailField>
              <DetailField label="身份证号码（脱敏）">
                <span className="text-foreground">
                  {record.pickupIdCard
                    ? `${record.pickupIdCard.slice(0, 6)}****${record.pickupIdCard.slice(-4)}`
                    : "—"}
                </span>
              </DetailField>
              <DetailField label="提货车辆牌号">
                <span className="text-foreground">{record.pickupPlate || "—"}</span>
              </DetailField>
              {record.pickupPersonType === "企业" && (
                <>
                  <DetailField label="授权提货企业全称">
                    <span className="font-medium text-foreground">{record.pickupName}</span>
                  </DetailField>
                  <DetailField label="企业统一社会信用代码">
                    <span className="text-foreground">{record.pickupIdentity || "—"}</span>
                  </DetailField>
                </>
              )}
            </div>
          </div>
          )}
        </PrototypeAnnotationTarget>

        {/* 板块 3：现场履约与提货凭证回写打点 */}
        <PrototypeAnnotationTarget annotationIds={["delivery-detail-fulfillment-record"]}>
          {activeTab === "fulfillment" && (
          <div className="space-y-4">
            {isPending ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-xs">
                <Clock className="size-8 text-amber-500/70" />
                <p className="text-sm font-medium text-foreground">暂无提货记录</p>
                <p className="text-muted-foreground max-w-md">
                  当前提货单处于【未提货】待交付状态。现场承运人到达仓库后，可通过【核销提货码】或【免码确认提货】进行交接放行。
                </p>
              </div>
            ) : record.status === "已提货" ? (
              <div className="space-y-4 p-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DetailField label="履约核销通道">
                    <span className="font-medium text-foreground">
                      {record.verifyChannel === "DYNAMIC_CODE"
                        ? "4 位动态提货码短信核销 (通道 A)"
                        : "免码现场直接确认交接 (通道 B)"}
                    </span>
                  </DetailField>
                  <DetailField label="提货完成时间">
                    <span className="font-medium text-foreground">{record.pickupTime || "—"}</span>
                  </DetailField>
                  <DetailField label="是否本人签收提货">
                    <span className="font-medium text-foreground">
                      {record.isSelfPickup ? "是（本人核对一致）" : "否（授权受托人交付）"}
                    </span>
                  </DetailField>
                  <DetailField label="现场放行车辆牌号">
                    <span className="font-medium text-foreground">
                      {record.pickupPlate || "—"}
                    </span>
                  </DetailField>
                  <div className="col-span-full">
                    <DetailField label="现场交接说明">
                      <span className="text-foreground">{record.notes || "—"}</span>
                    </DetailField>
                  </div>
                </div>

                {/* 照片凭据对比区 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
                  {/* 现场提货交接照片 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Camera className="size-4 text-amber-600" />
                      <span>现场实物提货交接照片</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {record.pickupPhotos && record.pickupPhotos.length > 0 ? (
                        record.pickupPhotos.map((url, i) => (
                          <div
                            key={i}
                            className="relative size-20 rounded border overflow-hidden cursor-pointer group bg-muted/20"
                            onClick={() => setPreviewPhoto(url)}
                          >
                            <img src={url} alt="现场提货照片" className="size-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Eye className="size-4" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground">暂无现场照片</span>
                      )}
                    </div>
                  </div>

                  {/* 原出库现场照片 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <FileText className="size-4 text-primary" />
                      <span>原出库申请现场照片（外观比对）</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {record.outboundPhotos && record.outboundPhotos.length > 0 ? (
                        record.outboundPhotos.map((url, i) => (
                          <div
                            key={i}
                            className="relative size-20 rounded border overflow-hidden cursor-pointer group bg-muted/20"
                            onClick={() => setPreviewPhoto(url)}
                          >
                            <img src={url} alt="原出库照片" className="size-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Eye className="size-4" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted-foreground">暂无原出库照片</span>
                      )}
                    </div>
                  </div>

                  {/* IoT 抓拍凭据 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <ShieldAlert className="size-4 text-emerald-600" />
                      <span>监管仓库 IoT 摄像头抓拍图</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {record.iotCapturePhotos && record.iotCapturePhotos.length > 0 ? (
                        record.iotCapturePhotos.map((url, i) => (
                          <div
                            key={i}
                            className="relative size-20 rounded border overflow-hidden cursor-pointer group bg-muted/20"
                            onClick={() => setPreviewPhoto(url)}
                          >
                            <img src={url} alt="抓拍图" className="size-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                              <Eye className="size-4" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-20 w-36 rounded border border-dashed flex items-center justify-center text-[11px] text-muted-foreground bg-muted/10">
                          抓图失败/无监控设备
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 已取消状态
              <div className="p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-destructive font-semibold">
                  <ShieldAlert className="size-4" />
                  <span>提货单已取消作废</span>
                </div>
                <div className="rounded bg-muted/40 p-3 space-y-1">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">取消说明理由：</span>
                    {record.cancelReason || "—"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    逆向闭环状态：已携参联动跳转至【退货入库】流程，重新分配库位后提交审批以恢复库存。
                  </p>
                </div>
              </div>
            )}
          </div>
          )}
        </PrototypeAnnotationTarget>

        {/* 板块 4：出库货品与储位分配明细打点 */}
        <PrototypeAnnotationTarget annotationIds={["delivery-detail-goods-table"]}>
          {activeTab === "goods" && (
          <div className="space-y-4">
            <div className="p-4">
              <div className="rounded-md border overflow-hidden">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/40 h-9">
                      <TableHead className="w-12 text-center">序号</TableHead>
                      <TableHead className="w-28">货品大类</TableHead>
                      <TableHead className="w-28">品类名称</TableHead>
                      <TableHead className="min-w-[140px]">规格/属性</TableHead>
                      <TableHead className="w-28 text-right">提货数量</TableHead>
                      <TableHead className="w-40">存放实体仓库</TableHead>
                      <TableHead className="w-32">库房/分区</TableHead>
                      <TableHead className="w-32">具体储位/条码</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {record.goodsSummaryList.map((g, idx) => (
                      <TableRow key={g.id || idx} className="h-12 hover:bg-muted/20">
                        <TableCell className="text-center text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {g.categoryName}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {g.subCategoryName}
                        </TableCell>
                        <TableCell className="text-foreground">{g.specName}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {g.amount} {g.unit}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {g.warehouseName || "四川省现代智慧物流枢纽仓"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {g.roomName || "1号恒温库"} / {g.areaName || "A区"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {g.locationName || "A-01-01"}
                          {g.barcode ? (
                            <span className="block text-[10px] text-muted-foreground/80">
                              {g.barcode}
                            </span>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          )}
        </PrototypeAnnotationTarget>

        {/* 板块 5：全过程操作审计记录打点 */}
        <PrototypeAnnotationTarget annotationIds={["delivery-detail-audit-logs"]}>
          {activeTab === "logs" && (
          <div className="space-y-4">
            <div className="p-4">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted-foreground/20 text-xs">
                {record.logs.map((log, idx) => (
                  <div key={log.id || idx} className="relative group">
                    <span className="absolute -left-6 top-1 flex size-5 items-center justify-center rounded-full bg-card border-2 border-amber-600 shadow-2xs">
                      <span className="size-1.5 rounded-full bg-amber-600" />
                    </span>
                    <div className="rounded-lg border bg-card p-3 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground text-sm">
                          {log.action}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{log.time}</span>
                      </div>
                      <div className="text-muted-foreground">
                        <span>经办责任人：</span>
                        <span className="text-foreground">{log.operatorName}</span>
                      </div>
                      {log.detail && (
                        <p className="text-foreground/90 pt-1 border-t border-dashed">
                          {log.detail}
                        </p>
                      )}
                      {log.notes && (
                        <div className="bg-muted/30 p-2 rounded text-[11px] text-muted-foreground">
                          <span className="font-medium text-foreground">备注说明：</span>
                          {log.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </PrototypeAnnotationTarget>
        </DetailTabShell>

        {/* 动态码核销弹窗 */}
        <DeliveryOrderWriteOffDialog
          open={writeOffOpen}
          order={record}
          onClose={() => setWriteOffOpen(false)}
          onSuccess={handleWriteOffSuccess}
          onResetCode={() => showToast("已成功重置并向提货人重新发送 4 位提货核销码短信！")}
        />

        {/* 免码确认提货弹窗 */}
        <DeliveryOrderConfirmDialog
          open={confirmOpen}
          order={record}
          onClose={() => setConfirmOpen(false)}
          onSuccess={handleConfirmSuccess}
        />

        {/* 取消提货弹窗 */}
        <DeliveryOrderCancelDialog
          open={cancelOpen}
          order={record}
          onClose={() => setCancelOpen(false)}
          onConfirmCancel={handleCancelSuccess}
        />

        {/* 操作记录弹窗 */}
        <DeliveryOrderLogDialog
          open={logOpen}
          order={record}
          onClose={() => setLogOpen(false)}
        />

        {/* 大图预览 */}
        {previewPhoto && (
          <Dialog open={true} onOpenChange={() => setPreviewPhoto(null)}>
            <DialogContent className="max-w-3xl p-2 font-sans">
              <img
                src={previewPhoto}
                alt="大图预览"
                className="w-full max-h-[80vh] object-contain rounded"
              />
            </DialogContent>
          </Dialog>
        )}

        {/* 轻提示 Toast */}
        {toastMessage && (
          <div className="fixed bottom-16 right-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg animate-in fade-in font-sans">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}

