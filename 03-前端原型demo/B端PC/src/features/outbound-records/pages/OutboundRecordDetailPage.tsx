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
  Download,
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
import { OutboundPdfDialog } from "../components/OutboundPdfDialog"
import { OUTBOUND_RECORD_LIST_PATH } from "../domain/constants"
import { outboundRecordsMock, OUTBOUND_MODIFY_LOGS } from "../mock/outbound-records.mock"
import { DeliveryOrderWriteOffDialog } from "@/features/delivery-orders/components/DeliveryOrderWriteOffDialog"
import { DeliveryOrderConfirmDialog } from "@/features/delivery-orders/components/DeliveryOrderConfirmDialog"
import {
  deliveryOrdersMock,
  completeDeliveryOrder,
} from "@/features/delivery-orders/mock/delivery-orders.mock"
import type { DeliveryOrderItem } from "@/features/delivery-orders/domain/types"
import {
  DocumentManagementTabContent,
} from "@/shared/document-management"
import { IterationPageTag, useIterationHighlight } from "@/shared/components/IterationHighlight"
import { DetailField, DetailSection } from "@/shared/components/DetailSection"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import { DetailTabShell } from "@/shared/components/DetailTabShell"
import { formatOutboundRecordQuantity } from "../lib/list-utils"

type DetailTab = "goods" | "pickup" | "audit" | "modify" | "documents"

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

  // 现场提货核销弹窗与单据下载弹窗
  const [writeOffOpen, setWriteOffOpen] = useState(false)
  const [directConfirmOpen, setDirectConfirmOpen] = useState(false)
  const [pdfOpen, setPdfOpen] = useState(false)

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
        <IterationPageTag
          version="6.4"
          changeType="新增"
          title="详情顶部新增【单据下载】按钮，支持 A4 / A5 / 针式连续纸二等分三种排版预览与质押单价货值脱敏"
          description="提货人明细与货主证号电话明文展示，单价与货物价值保留列头、数值留空脱敏。"
        />

        {/* 顶部标题与操作卡片（对齐 store-apply-info-detail.vue 结构） */}
        <PrototypeAnnotationTarget annotationIds={["outbound-detail-header"]}>
          <DetailPageHeader
            title="出库单详情"
            number={record.orderNo}
            numberLabel="出库单号"
            status={
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 shadow-2xs">
                <CheckCircle2 className="size-3.5" />
                已通过
              </span>
            }
            onBack={() => navigate(OUTBOUND_RECORD_LIST_PATH)}
            onCopy={() => {
              void navigator.clipboard.writeText(record.orderNo)
              showToast("已复制出库单号至剪贴板")
            }}
            actions={
              <div className="flex items-center gap-2">
                <PrototypeAnnotationTarget annotationIds={["outbound-detail-pdf-export"]}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/40 text-primary hover:bg-primary/5 text-xs h-8 gap-1.5 font-medium"
                    onClick={() => setPdfOpen(true)}
                  >
                    <Download className="size-3.5" />
                    单据下载
                  </Button>
                </PrototypeAnnotationTarget>
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
              </div>
            }
          />

          {/* 基础信息（上标签下取值，4 列栅格） */}
            <PrototypeAnnotationTarget annotationIds={["outbound-detail-basic"]}>
              <DetailSection title="基础信息">
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
                    <span className="text-muted-foreground">—</span>
                  )}
                </DetailField>
                <div>
                  <DetailField label="备注信息">
                    {record.notes || "—"}
                  </DetailField>
                </div>
              </DetailSection>
            </PrototypeAnnotationTarget>
        </PrototypeAnnotationTarget>

        {/* 明细、提货、审核、修改与资料统一按页签展示 */}
        <DetailTabShell
          tabs={[
            { key: "goods", label: "货物明细" },
            { key: "pickup", label: "提货信息" },
            { key: "audit", label: "审核记录" },
            { key: "modify", label: "修改记录" },
            { key: "documents", label: "资料管理" },
          ]}
          active={tab}
          onChange={(key) => setTab(key as DetailTab)}
        >
          {tab === "goods" && (
            <>
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
                    {formatOutboundRecordQuantity(record)}
                  </strong>
                </span>
              </div>

              {record.type === "普通出库" ? (
                /* 普通出库：一级货品主行（序号/货物名称/出库数量）+ 二级库存位置明细 */
                <div className="overflow-x-auto rounded-md border">
                  <Table className="min-w-[760px] text-xs">
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="w-12 text-center">展开</TableHead>
                        <TableHead className="w-12 text-center">序号</TableHead>
                        <TableHead>货物名称</TableHead>
                        <TableHead className="w-[140px] text-right font-semibold">
                          出库数量
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {record.goodsList.map((goods, idx) => {
                        const key = goods.id || String(idx)
                        const isExpanded = expandedGoods[key] ?? true
                        const locations = goods.locations ?? []

                        return (
                          <Fragment key={key}>
                            <TableRow className="hover:bg-muted/30">
                              <TableCell className="text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedGoods((prev) => ({
                                      ...prev,
                                      [key]: !isExpanded,
                                    }))
                                  }
                                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
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
                              <TableCell className="text-right font-bold text-foreground">
                                {goods.totalOutboundAmount}
                                <span className="ml-1 text-xs font-normal text-muted-foreground">
                                  {goods.unit}
                                </span>
                              </TableCell>
                            </TableRow>

                            {isExpanded && (
                              <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 dark:bg-slate-900/40 dark:hover:bg-slate-900/40">
                                <TableCell colSpan={4} className="p-3 pl-12">
                                  <div className="space-y-2 rounded border bg-card p-3">
                                    <div className="text-[11px] font-semibold text-muted-foreground">
                                      各库存位置实际扣减明细：
                                    </div>
                                    <Table className="text-xs">
                                      <TableHeader>
                                        <TableRow className="bg-muted/20">
                                          <TableHead className="w-[150px] text-[11px]">
                                            入库时间
                                          </TableHead>
                                          <TableHead className="w-10 text-center text-[11px]">
                                            序号
                                          </TableHead>
                                          <TableHead className="text-[11px]">位置</TableHead>
                                          <TableHead className="w-[110px] text-[11px]">
                                            具体位置
                                          </TableHead>
                                          <TableHead className="w-[150px] text-[11px]">
                                            其他信息
                                          </TableHead>
                                          <TableHead className="w-[150px] text-center text-[11px]">
                                            存货条码
                                          </TableHead>
                                          <TableHead className="w-[110px] text-right text-[11px] font-semibold">
                                            出库数量
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {(locations.length > 0
                                          ? locations
                                          : [
                                              {
                                                id: `${key}-fallback`,
                                                warehouseName: goods.warehouseName ?? record.warehouseName,
                                                storeroomName: goods.storeroomName ?? "",
                                                partitionName: goods.partitionName ?? "",
                                                locationPath: goods.locationPath ?? "",
                                                specificLocation: "",
                                                inboundTime: "",
                                                extraInfo: goods.extraInfo,
                                                barcode: goods.barcode ?? "",
                                                status: "",
                                                availableAmount: goods.availableAmount ?? 0,
                                                outboundAmount: goods.totalOutboundAmount,
                                                unit: goods.unit,
                                              },
                                            ]
                                        ).map((location, locationIdx) => {
                                          const position =
                                            location.locationPath ||
                                            [
                                              location.warehouseName,
                                              location.storeroomName,
                                              location.partitionName,
                                            ]
                                              .filter(Boolean)
                                              .join("-")

                                          return (
                                            <TableRow key={location.id}>
                                              <TableCell className="text-[11px] text-muted-foreground">
                                                {location.inboundTime || "—"}
                                              </TableCell>
                                              <TableCell className="text-center text-[11px] text-muted-foreground">
                                                {locationIdx + 1}
                                              </TableCell>
                                              <TableCell className="text-[11px] text-foreground">
                                                {position || "—"}
                                              </TableCell>
                                              <TableCell className="text-[11px] text-muted-foreground">
                                                {location.specificLocation || "—"}
                                              </TableCell>
                                              <TableCell className="text-[11px] text-muted-foreground">
                                                {location.extraInfo || "无"}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <span className="inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5 text-[11px]">
                                                  <QrCode className="size-3 text-primary" />
                                                  {location.barcode || "—"}
                                                </span>
                                              </TableCell>
                                              <TableCell className="text-right text-[11px] font-bold text-primary">
                                                {location.outboundAmount}
                                                <span className="ml-1 font-normal text-muted-foreground">
                                                  {location.unit}
                                                </span>
                                              </TableCell>
                                            </TableRow>
                                          )
                                        })}
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
                          <TableCell className="text-[11px] text-muted-foreground">
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
                            <span className="inline-flex items-center gap-1 rounded bg-muted/60 px-2 py-0.5 text-[11px]">
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
            </>
          )}
          {tab === "pickup" && (
            <>
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
            </>
          )}
          {tab === "audit" && (
            <>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {(record.auditRecord?.nodes || []).map((step, idx) => {

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

                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            </>
          )}
          {tab === "modify" && (
            <>
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-md border">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-12 text-center">序号</TableHead>
                      <TableHead>修改字段</TableHead>
                      <TableHead>修改前内容</TableHead>
                      <TableHead>修改后内容</TableHead>
                      <TableHead>操作人</TableHead>
                      <TableHead className="w-40">操作时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(OUTBOUND_MODIFY_LOGS[record.id] ?? []).length > 0 ? (
                      (OUTBOUND_MODIFY_LOGS[record.id] ?? []).map((log, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">{log.fieldLabel}</TableCell>
                          <TableCell className="text-muted-foreground line-through">
                            {log.beforeValue}
                          </TableCell>
                          <TableCell className="font-medium text-primary">
                            {log.afterValue}
                          </TableCell>
                          <TableCell>{log.operator}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {log.operatedAt}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          暂无单据修改记录
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            </>
          )}
          {tab === "documents" && (
            <>
            <DocumentManagementTabContent
              orderNo={record.orderNo}
              approvalId="SP202605290001"
              orderType="outbound"
              allowSupplement={true}
            />
            </>
          )}
        </DetailTabShell>

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

        {/* 单据 PDF 预览与下载弹窗（6.4 多介质排版） */}
        <OutboundPdfDialog
          open={pdfOpen}
          record={record}
          onClose={() => setPdfOpen(false)}
          onSuccess={showToast}
        />

        {/* 提示 Toast */}
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 max-w-sm rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
