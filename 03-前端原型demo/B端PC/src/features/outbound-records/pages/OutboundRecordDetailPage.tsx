import { useState, useMemo, Fragment, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Clock,
  Camera,
  FileCheck2,
  Truck,
  ChevronDown,
  ChevronRight,
  QrCode,
  KeyRound,
  Paperclip,
  FileText,
  Plus,
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
import { cn } from "@/lib/utils"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { outboundRecordDocuments } from "../documents/outbound-record-documents"
import { parseOutboundRecordDetailTabParam } from "@prototype/shared/outbound/outbound-record-detail-nav"
import {
  outboundRecordDetailGoodsTabLabel,
  OUTBOUND_RECORD_DETAIL_TAB_LABELS,
} from "@prototype/shared/outbound/outbound-record-detail-ui-labels"
import { outboundRecordDetailAnnotations } from "../annotations/outbound-record-detail.annotations"
import { ImageViewerModal } from "../components/ImageViewerModal"
import { OUTBOUND_RECORD_LIST_PATH } from "../domain/constants"
import { outboundRecordsMock } from "../mock/outbound-records.mock"
import { DeliveryOrderWriteOffDialog } from "@/features/delivery-orders/components/DeliveryOrderWriteOffDialog"
import { DeliveryOrderConfirmDialog } from "@/features/delivery-orders/components/DeliveryOrderConfirmDialog"
import {
  deliveryOrdersMock,
  completeDeliveryOrder,
} from "@/features/delivery-orders/mock/delivery-orders.mock"
import type { DeliveryOrderItem } from "@/features/delivery-orders/domain/types"
import {
  DocumentManagementTabContent,
  UploadSupplementaryModal,
  getDocumentsByOrderNo,
} from "@/shared/document-management"
import { useIterationHighlight } from "@/shared/components/IterationHighlight"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"

type DetailTab = "goods" | "pickup" | "audit" | "documents"

export function OutboundRecordDetailPage() {
  const { highlightEnabled } = useIterationHighlight()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [refreshKey, setRefreshKey] = useState(0)

  const record = useMemo(() => {
    return (
      outboundRecordsMock.find((r) => r.id === id || r.orderNo === id) ||
      outboundRecordsMock[0]
    )
  }, [id, refreshKey])

  const [tab, setTab] = useState<DetailTab>(() =>
    parseOutboundRecordDetailTabParam(searchParams.get("tab")) ?? "goods"
  )

  useEffect(() => {
    setTab(parseOutboundRecordDetailTabParam(searchParams.get("tab")) ?? "goods")
  }, [searchParams, id])
  const [expandedGoods, setExpandedGoods] = useState<Record<string, boolean>>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  // 现场提货核销弹窗
  const [writeOffOpen, setWriteOffOpen] = useState(false)
  const [directConfirmOpen, setDirectConfirmOpen] = useState(false)
  const [auditUploadFlowType, setAuditUploadFlowType] = useState<string | null>(null)
  const [docsRefreshKey, setDocsRefreshKey] = useState(0)

  const allOrderDocs = useMemo(() => {
    if (!record) return []
    return getDocumentsByOrderNo(record.orderNo)
  }, [record, docsRefreshKey])

  const isTransferOrAssign =
    record.type === "移库出库" || record.type === "转让出库"

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2400)
  }

  // 匹配对应提货单
  const targetDeliveryOrder = useMemo<DeliveryOrderItem>(() => {
    const matched = deliveryOrdersMock.find(
      (d) => d.outboundOrderNo === record.orderNo || d.outboundOrderNo === record.id
    )
    if (matched) return matched
    return {
      id: `DO-${record.orderNo}`,
      orderNo: `DO${record.orderNo.slice(-11)}`,
      outboundOrderNo: record.orderNo,
      ownerName: record.ownerName,
      ownerIdentity: record.ownerIdentifier,
      ownerType: record.ownerType,
      goodsSummaryList: record.goodsList.map((g) => ({
        categoryName: g.categoryName,
        subCategoryName: g.subCategoryName,
        specName: g.specName,
        amount: g.totalOutboundAmount,
        unit: g.unit,
      })),
      pickupPersonType: record.pickupInfo?.personType || "企业",
      pickupName: record.pickupInfo?.name || "提货经办人",
      pickupPhone: record.pickupInfo?.phone || "13800000000",
      pickupPlate: record.pickupInfo?.plateNo || "川A88888",
      outboundType: record.type,
      status: record.pickCompleted ? "已提货" : "未提货",
      statusCode: record.pickCompleted ? "COMPLETED" : "PENDING",
      operatorName: record.createdByName,
      operatorOrg: record.createdByOrg,
      createTime: record.createTime,
      pickCodeStatus: "已获取",
      pickupPhotos: record.pickupInfo?.sitePhotos || [],
      logs: [
        {
          id: "L1",
          action: "提货单生成",
          operatorName: "系统自动引擎",
          time: record.createTime,
          detail: "出库审批通过，自动生成提货单",
        },
      ],
    }
  }, [record, refreshKey])

  const handleWriteOffSuccess = (data: {
    isSelfPickup: boolean
    notes: string
    photos: string[]
  }) => {
    completeDeliveryOrder(targetDeliveryOrder.id, {
      isSelfPickup: data.isSelfPickup,
      actionName: "核销提货码",
      photos: data.photos,
      notes: data.notes,
    })
    setRefreshKey((k) => k + 1)
    showToast("4位动态提货码核销成功，已回写现场提货记录，货物已出库！")
  }

  const handleDirectConfirmSuccess = (data: {
    isSelfPickup: boolean
    pickupPlate?: string
    notes?: string
    photos: string[]
  }) => {
    completeDeliveryOrder(targetDeliveryOrder.id, {
      isSelfPickup: data.isSelfPickup,
      pickupPlate: data.pickupPlate,
      notes: data.notes,
      photos: data.photos,
      actionName: "免码确认提货",
    })
    setRefreshKey((k) => k + 1)
    showToast("免码现场核验确认提货成功，已回写现场提货记录！")
  }

  return (
    <PrototypeAnnotationProvider
      title="出库单详情"
      documents={outboundRecordDocuments}
      annotations={outboundRecordDetailAnnotations}
    >
      <div className="space-y-4 p-6 bg-muted/10 min-h-full">
        {/* 顶部标题与操作卡片（对齐 store-apply-info-detail.vue 结构） */}
        <PrototypeAnnotationTarget annotationIds={["outbound-detail-header"]}>
          <div className="rounded-lg border bg-card p-5 shadow-xs">
            {/* 顶栏：单号、状态徽标与操作按钮 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  出库单号：
                  <span className="text-base font-bold ml-1">
                    {record.orderNo}
                  </span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-primary"
                  title="复制单号"
                  onClick={() => {
                    void navigator.clipboard.writeText(record.orderNo)
                    showToast("已复制出库单号至剪贴板")
                  }}
                >
                  <Copy className="size-3.5" />
                </Button>
                <div className="ml-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 shadow-2xs">
                    <CheckCircle2 className="size-3.5" />
                    已通过
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!record.pickCompleted && !isTransferOrAssign && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/40 text-primary hover:bg-primary/5 text-xs h-8 gap-1 font-medium"
                      onClick={() => setWriteOffOpen(true)}
                    >
                      <KeyRound className="size-3.5" />
                      提货码核销
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-xs h-8 gap-1 font-medium"
                      onClick={() => setDirectConfirmOpen(true)}
                    >
                      <Truck className="size-3.5" />
                      免码直接提货
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(OUTBOUND_RECORD_LIST_PATH)}
                  className="h-8 text-xs"
                >
                  <ArrowLeft className="mr-1 size-4" />
                  返 回
                </Button>
              </div>
            </div>

            {/* 基础信息（上标签下取值，4 列栅格） */}
            <PrototypeAnnotationTarget annotationIds={["outbound-detail-basic"]}>
              <DetailSection title="单据信息">
                <DetailField label="制单人">
                  {record.createdByName}
                  {record.createdByOrg ? (
                    <span className="text-muted-foreground ml-1">({record.createdByOrg})</span>
                  ) : null}
                </DetailField>
                <DetailField label="制单时间">{record.createTime}</DetailField>
                <DetailField label="货主名称">{record.ownerName}</DetailField>
                <DetailField label="货主类型">{record.ownerType}货主</DetailField>
                <DetailField label="货主标识">{record.ownerIdentifier}</DetailField>
                <DetailField label="出库日期">{record.outboundTime}</DetailField>
                <DetailField label="出库类型">
                  <span className="font-medium text-primary">{record.type}</span>
                </DetailField>
                <DetailField label="仓库名称">{record.warehouseName}</DetailField>
                <DetailField label="关联单号">
                  {record.relatedNo && record.relatedNo !== "—" ? (
                    <span className="font-semibold text-primary">{record.relatedNo}</span>
                  ) : (
                    <span className="text-muted-foreground">——</span>
                  )}
                </DetailField>
                <div>
                  <DetailField label="备注信息">
                    {record.notes || "——"}
                  </DetailField>
                </div>
              </DetailSection>
            </PrototypeAnnotationTarget>
          </div>
        </PrototypeAnnotationTarget>

        {/* 标签栏与主体区域 */}
        <div className="rounded-lg border bg-card p-4 shadow-xs space-y-4">
          <div className="flex border-b border-border">
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer",
                tab === "goods"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("goods")}
            >
              {outboundRecordDetailGoodsTabLabel(record.goodsList.length)}
            </button>
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5",
                tab === "pickup"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("pickup")}
            >
              {OUTBOUND_RECORD_DETAIL_TAB_LABELS.pickup}
              {record.pickCompleted ? (
                <span className="rounded bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.2 font-normal">
                  已完成
                </span>
              ) : isTransferOrAssign ? (
                <span className="rounded bg-muted text-muted-foreground text-[10px] px-1.5 py-0.2 font-normal">
                  免提货
                </span>
              ) : (
                <span className="rounded bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.2 font-normal">
                  待提货
                </span>
              )}
            </button>
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer",
                tab === "audit"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("audit")}
            >
              {OUTBOUND_RECORD_DETAIL_TAB_LABELS.audit}
            </button>
            <button
              type="button"
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer",
                tab === "documents"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("documents")}
            >
              {OUTBOUND_RECORD_DETAIL_TAB_LABELS.documents}
              {highlightEnabled ? (
                <span className="ml-1.5 rounded bg-amber-500 px-1 py-0.5 text-[9px] font-bold leading-none text-white">
                  6.3
                </span>
              ) : null}
            </button>
          </div>

          {/* Tab 1: 货物明细 */}
          {tab === "goods" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>出库品类总数：{record.categoryCount} 种</span>
                  <span className="text-border">|</span>
                  <span className="text-primary font-medium">
                    {record.type === "普通出库"
                      ? "普通出库（支持点击展开各库房垛位明细）"
                      : isTransferOrAssign
                      ? "联动出库（系统原子对冲账目明细）"
                      : "关联出库（金融在押存货明细平铺）"}
                  </span>
                </div>
                <span>
                  本次出库总量：
                  <strong className="text-foreground text-sm ml-1">
                    {record.totalAmount.toLocaleString()} {record.amountUnit}
                  </strong>
                </span>
              </div>

              {record.type === "普通出库" ? (
                /* 普通出库：一级货品主行 + 二级库存位置展开表（对齐 PRD 2.1~2.2 节） */
                <div className="overflow-x-auto rounded-md border">
                  <Table className="min-w-[1000px] text-xs">
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="w-12 text-center">展开</TableHead>
                        <TableHead className="w-12 text-center">序号</TableHead>
                        <TableHead className="w-[200px]">货物名称</TableHead>
                        <TableHead className="w-[120px]">规格型号</TableHead>
                        <TableHead className="w-[160px]">其他信息</TableHead>
                        <TableHead className="w-[120px] text-right font-semibold">
                          出库数量
                        </TableHead>
                        <TableHead className="w-[80px] text-center">单位</TableHead>
                        <TableHead className="w-[140px]">库存位置汇总</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {record.goodsList.map((goods, idx) => {
                        const isExpanded = expandedGoods[goods.id || String(idx)] ?? true
                        return (
                          <Fragment key={goods.id || idx}>
                            <TableRow className="hover:bg-muted/30">
                              <TableCell className="text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedGoods((prev) => ({
                                      ...prev,
                                      [goods.id || String(idx)]: !isExpanded,
                                    }))
                                  }
                                  className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                  title={isExpanded ? "收起位置明细" : "展开位置明细"}
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="size-4" />
                                  ) : (
                                    <ChevronRight className="size-4" />
                                  )}
                                </button>
                              </TableCell>
                              <TableCell className="text-center text-muted-foreground">
                                {idx + 1}
                              </TableCell>
                              <TableCell className="font-semibold text-foreground">
                                {goods.goodsName}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {goods.specName || "—"}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {goods.extraInfo || "无"}
                              </TableCell>
                              <TableCell className="text-right font-bold text-foreground">
                                {goods.totalOutboundAmount}
                              </TableCell>
                              <TableCell className="text-center text-muted-foreground">
                                {goods.unit}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-[11px]">
                                {goods.locationPath || record.warehouseName}
                              </TableCell>
                            </TableRow>

                            {/* 二级展开位置明细表格 */}
                            {isExpanded && (
                              <TableRow className="bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                                <TableCell colSpan={8} className="p-3 pl-12">
                                  <div className="rounded border bg-card p-3 space-y-2">
                                    <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                                      <span>各库存位置实际扣减明细：</span>
                                    </div>
                                    <Table className="text-xs">
                                      <TableHeader>
                                        <TableRow className="bg-muted/20">
                                          <TableHead className="w-10 text-center text-[11px]">#</TableHead>
                                          <TableHead className="text-[11px]">实体仓库</TableHead>
                                          <TableHead className="text-[11px]">监管库房</TableHead>
                                          <TableHead className="text-[11px]">物理分区</TableHead>
                                          <TableHead className="text-[11px] text-right">出库前库存</TableHead>
                                          <TableHead className="text-[11px] text-right font-semibold">扣减出库量</TableHead>
                                          <TableHead className="text-[11px] text-right">出库后剩余</TableHead>
                                          <TableHead className="text-[11px] text-center">存货条码/二维码</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell className="text-center text-muted-foreground text-[11px]">1</TableCell>
                                          <TableCell>{goods.warehouseName || record.warehouseName}</TableCell>
                                          <TableCell>{goods.storeroomName || "1号冷冻库"}</TableCell>
                                          <TableCell>{goods.partitionName || "A区垛位01"}</TableCell>
                                          <TableCell className="text-right text-muted-foreground">
                                            {goods.beforeAmount !== undefined ? `${goods.beforeAmount} ${goods.unit}` : "—"}
                                          </TableCell>
                                          <TableCell className="text-right font-bold text-primary">
                                            {goods.totalOutboundAmount} {goods.unit}
                                          </TableCell>
                                          <TableCell className="text-right text-muted-foreground">
                                            {goods.afterAmount !== undefined ? `${goods.afterAmount} ${goods.unit}` : "—"}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/60 text-[11px]">
                                              <QrCode className="size-3 text-primary" />
                                              {goods.barcode || "SYZC-BC-2026-001"}
                                            </span>
                                          </TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                /* 质押/抵押/仓单/移库/转让出库：平铺明细表格（对齐 PRD 2.3 节） */
                <div className="overflow-x-auto rounded-md border">
                  <Table className="min-w-[1100px] text-xs">
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="w-12 text-center">序号</TableHead>
                        <TableHead className="w-[110px]">仓库</TableHead>
                        <TableHead className="w-[110px]">库房</TableHead>
                        <TableHead className="w-[90px]">分区</TableHead>
                        <TableHead className="w-[180px]">货物名称</TableHead>
                        <TableHead className="w-[140px]">其他信息</TableHead>
                        <TableHead className="w-[100px] text-right">出库前数量</TableHead>
                        <TableHead className="w-[100px] text-right font-semibold text-primary">
                          本次出库量
                        </TableHead>
                        <TableHead className="w-[100px] text-right">出库后数量</TableHead>
                        <TableHead className="w-[60px] text-center">单位</TableHead>
                        <TableHead className="w-[140px] text-center">存货条码</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {record.goodsList.map((goods, idx) => (
                        <TableRow key={goods.id || idx} className="hover:bg-muted/30">
                          <TableCell className="text-center text-muted-foreground">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {goods.warehouseName || record.warehouseName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {goods.storeroomName || "1号库房"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {goods.partitionName || "A区"}
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">
                            {goods.goodsName}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-[11px]">
                            {goods.extraInfo || "无"}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {goods.beforeAmount !== undefined
                              ? goods.beforeAmount
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right font-bold text-primary">
                            {goods.totalOutboundAmount}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {goods.afterAmount !== undefined
                              ? goods.afterAmount
                              : "—"}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {goods.unit}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/60 text-[11px]">
                              <QrCode className="size-3 text-primary" />
                              {goods.barcode || "—"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: 提货信息 (回显提货人与现场提货记录) */}
          {tab === "pickup" && (
            <div className="space-y-4">
              {isTransferOrAssign ? (
                <div className="rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
                  <Truck className="size-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="font-medium text-foreground">
                    {record.type}无需生成提货单
                  </p>
                  <p className="mt-1 text-[11px]">
                    移库出库与转让出库由移库管理与货物转让终审自动联动写入，不生成现场提货单。
                  </p>
                </div>
              ) : !record.pickCompleted ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-6 text-center text-xs text-amber-800 space-y-3">
                  <Clock className="size-7 mx-auto text-amber-600 mb-1" />
                  <div>
                    <p className="font-semibold text-sm text-amber-900">
                      待现场提货核销（提货单已生成）
                    </p>
                    <p className="text-muted-foreground mt-1 max-w-xl mx-auto leading-relaxed">
                      该出库单审批已通过，系统已自动派生提货单【{targetDeliveryOrder.orderNo}】。
                      提货人现场完成装车过磅后，可通过以下两种方式进行出场核销：
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/5 text-xs gap-1.5 h-8 font-medium"
                      onClick={() => setWriteOffOpen(true)}
                    >
                      <KeyRound className="size-3.5" />
                      通道A：4位动态提货码核销
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-xs gap-1.5 h-8 font-medium"
                      onClick={() => setDirectConfirmOpen(true)}
                    >
                      <Truck className="size-3.5" />
                      通道B：免码现场直接提货
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-muted-foreground hover:text-foreground h-8"
                      onClick={() => navigate("/仓储/提货单")}
                    >
                      前往提货单台账 →
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 提货人核准信息 */}
                  {record.pickupInfo && (
                    <div className="rounded-lg border p-4 space-y-3">
                      <div className="font-semibold text-foreground text-xs flex items-center gap-1.5 border-b pb-2">
                        <FileCheck2 className="size-4 text-emerald-600" />
                        提货人核准信息（申请时登记）
                      </div>
                      <div className="overflow-hidden rounded-md border text-xs">
                        <table className="w-full border-collapse text-left">
                          <tbody>
                            <tr className="border-b">
                              <th className="w-28 bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                提货人类型：
                              </th>
                              <td className="w-[35%] p-2.5 font-medium text-foreground border-r">
                                {record.pickupInfo.personType}
                              </td>
                              <th className="w-28 bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                提货人姓名：
                              </th>
                              <td className="p-2.5 font-medium text-foreground">
                                {record.pickupInfo.name}
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                联系电话：
                              </th>
                              <td className="p-2.5 text-foreground border-r">
                                {record.pickupInfo.phone}
                              </td>
                              <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                证件号码：
                              </th>
                              <td className="p-2.5 text-foreground">
                                {record.pickupInfo.idCardNo}
                              </td>
                            </tr>
                            {record.pickupInfo.plateNo && (
                              <tr className="border-t">
                                <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                  提货车牌：
                                </th>
                                <td
                                  colSpan={3}
                                  className="p-2.5 font-semibold text-primary"
                                >
                                  {record.pickupInfo.plateNo}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 现场提货核销记录 */}
                  {record.pickupRecord && (
                    <div className="rounded-lg border p-4 space-y-3">
                      <div className="font-semibold text-foreground text-xs flex items-center justify-between border-b pb-2">
                        <span className="flex items-center gap-1.5">
                          <Truck className="size-4 text-emerald-600" />
                          现场提货核销记录
                        </span>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                          核销完成 · 实物已出场
                        </span>
                      </div>

                      <div className="overflow-hidden rounded-md border text-xs">
                        <table className="w-full border-collapse text-left">
                          <tbody>
                            <tr className="border-b">
                              <th className="w-28 bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                现场操作人：
                              </th>
                              <td className="w-[35%] p-2.5 font-medium text-foreground border-r">
                                {record.pickupRecord.operatorName}
                              </td>
                              <th className="w-28 bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                核销出库时间：
                              </th>
                              <td className="p-2.5 text-foreground">
                                {record.pickupRecord.pickupTime}
                              </td>
                            </tr>
                            <tr className="border-b">
                              <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                提货方式：
                              </th>
                              <td
                                colSpan={3}
                                className="p-2.5 text-foreground font-medium"
                              >
                                {record.pickupRecord.isSelfPickup
                                  ? "客户自提"
                                  : "委托第三方承运"}
                              </td>
                            </tr>
                            <tr>
                              <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                现场核查说明：
                              </th>
                              <td
                                colSpan={3}
                                className="p-2.5 text-muted-foreground leading-relaxed"
                              >
                                {record.pickupRecord.notes || "核验无误，准予放行"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* 现场核实照片 */}
                      {record.pickupRecord.sitePhotos &&
                        record.pickupRecord.sitePhotos.length > 0 && (
                          <div className="space-y-1.5 pt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Camera className="size-3.5" />
                              现场实物照片与装车抓拍（点击查看大图）：
                            </span>
                            <div className="flex gap-2">
                              {record.pickupRecord.sitePhotos.map((url, idx) => (
                                <img
                                  key={idx}
                                  src={url}
                                  alt="现场实物照片"
                                  onClick={() => setPreviewImageUrl(url)}
                                  className="size-16 rounded border object-cover cursor-pointer hover:opacity-85 transition-opacity"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: 审核记录 */}
          {tab === "audit" && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {(record.auditRecord?.nodes || []).map((step, idx) => {
                    const stepFlowType = idx === 0 ? "1" : idx === 1 ? "2" : "3"
                    const stepDocs = allOrderDocs.filter((d) => d.flowType === stepFlowType)

                    return (
                      <div key={idx} className="relative text-xs">
                        <div className="absolute -left-6 top-1 size-2.5 rounded-full border-2 border-background bg-emerald-500 shadow-xs" />
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-foreground">
                            {step.nodeName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-[11px]">
                              {step.actionTime}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-[11px] text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                              onClick={() => setAuditUploadFlowType(stepFlowType)}
                            >
                              <Plus className="size-3 mr-0.5" />
                              补充本阶段资料
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground mt-0.5">
                          经办人：{step.handlerName} ·{" "}
                          <span className="font-medium text-emerald-700">
                            {step.actionName}
                          </span>
                        </p>
                        {step.comment && (
                          <p className="mt-1 rounded bg-muted/40 p-2 text-foreground text-[11px] leading-relaxed">
                            审核意见：{step.comment}
                          </p>
                        )}

                        {/* 节点关联资料穿透展示 */}
                        <div className="mt-2 pt-2 border-t border-border/60">
                          <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                            <Paperclip className="size-3 text-muted-foreground" />
                            <span>本节点关联资料 ({stepDocs.length})：</span>
                          </div>
                          {stepDocs.length > 0 ? (
                            <div className="space-y-1.5">
                              {stepDocs.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="flex items-center justify-between p-2 rounded bg-muted/20 border border-border/40 text-xs hover:border-blue-200 transition-colors"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <FileText className="size-3.5 text-blue-500 shrink-0" />
                                    <span className="font-medium text-foreground truncate">{doc.name}</span>
                                    <span className="text-[10.5px] text-muted-foreground shrink-0">({doc.fileSize})</span>
                                    {doc.nature === "ADDITION" && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200/60 font-medium shrink-0">
                                        事后补录
                                      </span>
                                    )}
                                    {doc.description && (
                                      <span className="text-[11px] text-muted-foreground truncate hidden md:inline">
                                        - {doc.description}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{doc.createTime}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">暂无资料附件</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: 资料管理 */}
          {tab === "documents" && (
            <DocumentManagementTabContent
              orderNo={record.orderNo}
              approvalId="SP202605290001"
              orderType="outbound"
              allowSupplement={record.type === "普通出库"}
            />
          )}
        </div>

        {/* 图片预览弹窗 */}
        <ImageViewerModal
          url={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />

        {/* 提货码核销弹窗（通道 A） */}
        <DeliveryOrderWriteOffDialog
          open={writeOffOpen}
          order={targetDeliveryOrder}
          onClose={() => setWriteOffOpen(false)}
          onSuccess={handleWriteOffSuccess}
        />

        {/* 免码现场提货确认弹窗（通道 B） */}
        <DeliveryOrderConfirmDialog
          open={directConfirmOpen}
          order={targetDeliveryOrder}
          onClose={() => setDirectConfirmOpen(false)}
          onSuccess={handleDirectConfirmSuccess}
        />

        {/* 审核记录中的补充资料弹窗 */}
        {auditUploadFlowType && (
          <UploadSupplementaryModal
            open={auditUploadFlowType !== null}
            orderNo={record.orderNo}
            approvalId="SP202605290001"
            orderType="outbound"
            defaultFlowType={auditUploadFlowType}
            onClose={() => setAuditUploadFlowType(null)}
            onSuccess={(newDoc) => {
              setDocsRefreshKey((k) => k + 1)
              showToast(`资料已成功补充挂载至本流程节点：${newDoc.name}`)
            }}
          />
        )}

        {/* 提示 Toast */}
        {toastMessage && (
          <div className="fixed bottom-16 right-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
