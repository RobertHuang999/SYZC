import { useState, Fragment } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Download,
  History,
  QrCode,
  ChevronDown,
  ChevronRight,
  Camera,
  Video,
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
import { DetailSection, DetailField } from "@/shared/components/DetailSection"
import { QrCodeDialog } from "@/features/inbound-records/components/QrCodeDialog"
import { transferRecordDocuments } from "../documents/transfer-record-documents"
import { transferRecordDetailAnnotations } from "../annotations/transfer-record-detail.annotations"
import { TransferDownloadRecordsDialog } from "../components/TransferDownloadRecordsDialog"
import { TransferPdfDialog } from "../components/TransferPdfDialog"
import { ImageViewerModal } from "../components/ImageViewerModal"
import { TRANSFER_RECORD_LIST_PATH } from "../domain/constants"
import {
  transferRecordsMock,
  auditRecordsMock,
} from "../mock/transfer-records.mock"

type DetailTab = "goods" | "audit"

export function TransferRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const record =
    transferRecordsMock.find((r) => r.id === id) || transferRecordsMock[0]

  const [tab, setTab] = useState<DetailTab>(() => {
    const t = searchParams.get("tab")
    if (t === "audit") return "audit"
    return "goods"
  })

  const [toast, setToast] = useState<string | null>(null)
  const [downloadLogOpen, setDownloadLogOpen] = useState(false)
  const [downloadPdfOpen, setDownloadPdfOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<{
    url: string
    title: string
  } | null>(null)

  const [qrCodeData, setQrCodeData] = useState<{
    open: boolean
    orderNo: string
    goodsName: string
    position: string
    quantityLabel: string
    qrCodeNo: string
    qrCodeUrl?: string
  } | null>(null)

  // 展开控制（针对普通移库的折叠明细）
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "GRP-01": true,
  })

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const handleCopyId = () => {
    void navigator.clipboard.writeText(record.id)
    showToast(`已复制移库单号 ${record.id} 至剪贴板`)
  }

  const audits =
    auditRecordsMock[record.id] ||
    auditRecordsMock["1983029182390192801"] ||
    []

  const isNormalTransfer =
    record.transferType === "NORMAL" || !record.transferType

  // 兜底明细数据，确保双向结构皆可渲染
  const groups = record.groups || [
    {
      id: "GRP-01",
      index: 1,
      goodsName: record.goodsList[0]?.goodsName || "货物明细",
      cateName: record.goodsList[0]?.cateName || "",
      typeName: record.goodsList[0]?.typeName || "",
      specName: record.goodsList[0]?.specName || "",
      warehouseName: record.warehouseName,
      warehouseId: record.warehouseId,
      totalTransferAmount: record.totalAmount,
      unit: record.unit,
      details: [
        {
          id: "D-101",
          goodsName: record.goodsList[0]?.goodsName || "货物明细",
          cateName: record.goodsList[0]?.cateName || "",
          typeName: record.goodsList[0]?.typeName || "",
          specName: record.goodsList[0]?.specName || "",
          sourceWarehouse: record.warehouseName,
          sourceWarehouseId: record.warehouseId,
          sourceRoomZone: `${record.warehouseName}-1号库房-A区`,
          sourceSpecificLocation: "A-01-01",
          inboundTime: record.createTime,
          otherInfo: "标准规格",
          barcode: `SYZC-BAR-${record.id.slice(-6)}-01`,
          status: "存货中",
          availableAmount: record.totalAmount,
          transferAmount: record.totalAmount,
          unit: record.unit,
          targetRoomZone: `${record.warehouseName}-2号库房-B区`,
          targetSpecificLocation: "B-02-01",
        },
      ],
    },
  ]

  const flatDetails =
    record.flatDetails ||
    (record.groups
      ? record.groups.flatMap((g) => g.details)
      : [
          {
            id: "D-001",
            goodsName: record.goodsList[0]?.goodsName || "货物明细",
            cateName: record.goodsList[0]?.cateName || "",
            typeName: record.goodsList[0]?.typeName || "",
            specName: record.goodsList[0]?.specName || "",
            sourceWarehouse: record.warehouseName,
            sourceWarehouseId: record.warehouseId,
            sourceRoomZone: `${record.warehouseName}-1号库房-A区`,
            sourceSpecificLocation: "A-01-08",
            inboundTime: record.createTime,
            otherInfo: "标准批次",
            barcode: `SYZC-BAR-${record.id.slice(-6)}-01`,
            status: "存货中",
            availableAmount: record.totalAmount,
            transferAmount: record.totalAmount,
            unit: record.unit,
            targetRoomZone: `${record.warehouseName}-3号库房-B区`,
            targetSpecificLocation: "B-03-02",
          },
        ])

  return (
    <PrototypeAnnotationProvider
      title="移库单详情"
      documents={transferRecordDocuments}
      annotations={transferRecordDetailAnnotations}
    >
      <div className="space-y-4 p-6 bg-muted/10 min-h-full font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        {/* 卡片 1：顶部标题与单据基础资料卡片（包含现场照片与设备抓拍图） */}
        <PrototypeAnnotationTarget annotationIds={["transfer-detail-header"]}>
          <div className="rounded-lg border bg-card p-5 shadow-xs">
            {/* 顶栏：单号、状态徽标与操作按钮 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  移库单号：
                  <span className="text-base font-bold ml-1">{record.id}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-primary cursor-pointer"
                  title="复制单号"
                  onClick={handleCopyId}
                >
                  <Copy className="size-3.5" />
                </Button>
                <div className="ml-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-2xs">
                    <CheckCircle2 className="size-3.5" />
                    已通过
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDownloadLogOpen(true)}
                  className="h-8 text-xs font-normal cursor-pointer"
                >
                  <History className="size-3.5 mr-1" />
                  下载记录
                </Button>
                <Button
                  size="sm"
                  onClick={() => setDownloadPdfOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs font-medium cursor-pointer"
                >
                  <Download className="size-3.5 mr-1" />
                  单据下载
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(TRANSFER_RECORD_LIST_PATH)}
                  className="h-8 text-xs cursor-pointer"
                >
                  <ArrowLeft className="mr-1 size-4" />
                  返 回
                </Button>
              </div>
            </div>

            {/* 单据基础资料（DetailSection 4 列栅格 + 通栏整行） */}
            <DetailSection title="单据信息">
              <DetailField label="制单人">
                {record.createByName}
                {record.createOrgName ? (
                  <span className="text-muted-foreground ml-1">
                    ({record.createOrgName})
                  </span>
                ) : null}
              </DetailField>
              <DetailField label="制单时间">{record.createTime}</DetailField>
              <DetailField label="货主名称">{record.ownerName}</DetailField>
              <DetailField label="货主类型">
                {record.ownerType === "PERSONAL" ? "个人货主" : "企业货主"}
              </DetailField>
              <DetailField label="货主标识">{record.ownerIdentity}</DetailField>
              <DetailField label="移库日期">{record.transferTime}</DetailField>
              <DetailField label="移库类型">
                <span className="font-medium text-primary">
                  {record.transferTypeName}
                </span>
              </DetailField>
              <DetailField label="仓库名称">{record.warehouseName}</DetailField>
              <DetailField label="移库总数量">
                <span className="font-semibold text-primary">
                  {record.totalAmount} {record.unit}
                </span>
              </DetailField>
              <DetailField label="关联单号">
                {record.relatedId && record.relatedId !== "—" ? (
                  <span className="font-semibold text-primary">
                    {record.relatedId}
                  </span>
                ) : (
                  <span className="text-muted-foreground">——</span>
                )}
              </DetailField>
              <div>
                <DetailField label="备注信息">
                  {record.remark || "——"}
                </DetailField>
              </div>

              {/* 现场照片：在基础资料内通栏展示 */}
              <div className="pt-2 border-t border-border/60">
                <PrototypeAnnotationTarget annotationIds={["transfer-detail-photos"]}>
                  <DetailField
                    label={
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Camera className="size-3.5 text-primary" />
                        <span>
                          现场照片（已上传 {record.scenePhotos.length} 张，最多 10 张）
                        </span>
                      </div>
                    }
                  >
                    {record.scenePhotos.length === 0 ? (
                      <span className="text-muted-foreground text-xs">无现场照片</span>
                    ) : (
                      <div className="flex flex-wrap gap-3 pt-1">
                        {record.scenePhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              setPreviewImage({
                                url: photo,
                                title: `现场作业照片 #${idx + 1}`,
                              })
                            }
                            className="group relative size-24 rounded-lg overflow-hidden border border-border cursor-pointer shadow-xs hover:border-primary transition-all"
                          >
                            <img
                              src={photo}
                              alt="现场照片"
                              className="size-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-medium transition-opacity">
                              点击预览
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">
                              #{idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </DetailField>
                </PrototypeAnnotationTarget>
              </div>

              {/* 设备抓拍图：在基础资料内通栏展示 */}
              <div className="pt-2 border-t border-border/60">
                <DetailField
                  label={
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Video className="size-3.5 text-emerald-600" />
                      <span>
                        设备抓拍图（系统提交落库瞬间自动调度移出/移入库区绑定的球机或枪机抓拍凭据）
                      </span>
                    </div>
                  }
                >
                  {record.capturePhotos.length === 0 ? (
                    <span className="text-muted-foreground text-xs">
                      抓图失败 / 无监控设备
                    </span>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
                      {record.capturePhotos.map((cap, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            setPreviewImage({
                              url: cap.photoUrl,
                              title: `${cap.deviceCustomName} (${cap.zoneName})`,
                            })
                          }
                          className="group cursor-pointer rounded-lg border border-border p-2 bg-card hover:border-primary hover:shadow-xs transition-all text-center flex flex-col justify-between"
                        >
                          <div className="relative aspect-4/3 rounded-md overflow-hidden bg-muted mb-1.5">
                            <img
                              src={cap.photoUrl}
                              alt={cap.deviceName}
                              className="size-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                              IoT 抓拍
                            </div>
                          </div>
                          <div className="space-y-0.5 text-left">
                            <div
                              className="text-xs font-medium text-foreground truncate"
                              title={cap.deviceCustomName}
                            >
                              {cap.deviceCustomName}
                            </div>
                            <div
                              className="text-[11px] text-muted-foreground truncate"
                              title={cap.zoneName}
                            >
                              {cap.zoneName}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {cap.captureTime}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </DetailField>
              </div>
            </DetailSection>
          </div>
        </PrototypeAnnotationTarget>

        {/* 卡片 2：标签页导航与内容主体（仅包含【移库明细】与【审核记录】两个 Tab） */}
        <div className="rounded-lg border bg-card p-5 shadow-xs space-y-4">
          <div className="flex border-b border-border">
            <button
              type="button"
              className={cn(
                "px-5 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer",
                tab === "goods"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("goods")}
            >
              移库明细
            </button>
            <button
              type="button"
              className={cn(
                "px-5 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer",
                tab === "audit"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setTab("audit")}
            >
              审核记录
            </button>
          </div>

          {/* Tab 1: 移库明细 */}
          {tab === "goods" && (
            <PrototypeAnnotationTarget annotationIds={["transfer-detail-goods-tab"]}>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground pb-1">
                  <div className="flex items-center gap-2">
                    <span>
                      移库品类总数：
                      {record.goodsList?.length || groups.length} 种
                    </span>
                    <span className="text-border">|</span>
                    <span className="text-primary font-medium">
                      {isNormalTransfer
                        ? "普通移库（支持点击展开各货品移出/移入位置及条码明细）"
                        : "关联移库（金融在押存货明细平铺展示）"}
                    </span>
                  </div>
                  <span>
                    本次移库总量：
                    <strong className="text-foreground text-sm ml-1">
                      {record.totalAmount} {record.unit}
                    </strong>
                  </span>
                </div>

                {isNormalTransfer ? (
                  /* 普通移库：一级货品主行 + 二级位置明细展开表 */
                  <div className="overflow-x-auto rounded-md border">
                    <Table className="min-w-[1000px] text-xs">
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="w-12 text-center">展开</TableHead>
                          <TableHead className="w-12 text-center">序号</TableHead>
                          <TableHead className="w-[240px]">货物名称</TableHead>
                          <TableHead className="w-[180px]">所属仓库</TableHead>
                          <TableHead className="w-[130px] text-right font-semibold">
                            移库总数量
                          </TableHead>
                          <TableHead className="w-[80px] text-center">单位</TableHead>
                          <TableHead className="min-w-[200px]">
                            移出 → 移入位置概览
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groups.map((group, idx) => {
                          const isExpanded = expandedGroups[group.id] ?? true
                          const firstDetail = group.details?.[0]
                          const summaryPath = firstDetail
                            ? `${firstDetail.sourceRoomZone} → ${firstDetail.targetRoomZone}`
                            : record.warehouseName

                          return (
                            <Fragment key={group.id}>
                              <TableRow className="hover:bg-muted/20">
                                <TableCell className="text-center">
                                  <button
                                    type="button"
                                    onClick={() => toggleGroup(group.id)}
                                    className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                                  {group.goodsName}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {group.warehouseName}
                                </TableCell>
                                <TableCell className="text-right font-bold text-primary">
                                  {group.totalTransferAmount}
                                </TableCell>
                                <TableCell className="text-center text-muted-foreground">
                                  {group.unit}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-[11px] truncate">
                                  {summaryPath}
                                </TableCell>
                              </TableRow>

                              {/* 二级展开明细表格 */}
                              {isExpanded && (
                                <TableRow className="bg-slate-50/70 dark:bg-slate-900/40 hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                                  <TableCell colSpan={7} className="p-3 pl-12">
                                    <div className="rounded border bg-card p-3 space-y-2">
                                      <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                                        <span>
                                          库内实际调拨明细（移出位置 → 移入位置）：
                                        </span>
                                      </div>
                                      <Table className="text-xs">
                                        <TableHeader>
                                          <TableRow className="bg-muted/20 hover:bg-muted/20">
                                            <TableHead className="w-10 text-center text-[11px]">
                                              #
                                            </TableHead>
                                            <TableHead className="w-36 text-[11px]">
                                              原入库时间
                                            </TableHead>
                                            <TableHead className="w-28 text-[11px]">
                                              其他信息
                                            </TableHead>
                                            <TableHead className="w-28 text-[11px] text-center">
                                              存货条码
                                            </TableHead>
                                            <TableHead className="text-[11px]">
                                              移出位置
                                            </TableHead>
                                            <TableHead className="text-[11px]">
                                              移入目标位置
                                            </TableHead>
                                            <TableHead className="w-28 text-[11px] text-right font-semibold">
                                              移库数量
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {group.details.map((item, itemIdx) => (
                                            <TableRow
                                              key={item.id}
                                              className="hover:bg-muted/20"
                                            >
                                              <TableCell className="text-center text-muted-foreground text-[11px]">
                                                {itemIdx + 1}
                                              </TableCell>
                                              <TableCell className="text-muted-foreground text-[11px]">
                                                {item.inboundTime}
                                              </TableCell>
                                              <TableCell className="text-muted-foreground text-[11px]">
                                                {item.otherInfo || "—"}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <button
                                                  type="button"
                                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer"
                                                  title="查看存货条码"
                                                  onClick={() =>
                                                    setQrCodeData({
                                                      open: true,
                                                      orderNo: record.id,
                                                      goodsName: group.goodsName,
                                                      position:
                                                        item.targetRoomZone,
                                                      quantityLabel: `${item.transferAmount} ${group.unit}`,
                                                      qrCodeNo:
                                                        item.barcode ||
                                                        `SYZC-BAR-${item.id.slice(-6)}`,
                                                      qrCodeUrl: item.qrCodeUrl,
                                                    })
                                                  }
                                                >
                                                  <QrCode className="size-3.5 text-primary" />
                                                  <span className="text-[11px]">
                                                    {item.barcode
                                                      ? item.barcode.slice(-8)
                                                      : item.id.slice(-6)}
                                                  </span>
                                                </button>
                                              </TableCell>
                                              <TableCell className="text-foreground text-[11px]">
                                                <div>{item.sourceRoomZone}</div>
                                                {item.sourceSpecificLocation ? (
                                                  <div className="text-xs text-muted-foreground">
                                                    具体位置:{" "}
                                                    {item.sourceSpecificLocation}
                                                  </div>
                                                ) : null}
                                              </TableCell>
                                              <TableCell className="text-foreground text-[11px]">
                                                <div className="text-primary font-medium">
                                                  {item.targetRoomZone}
                                                </div>
                                                {item.targetSpecificLocation ? (
                                                  <div className="text-xs text-muted-foreground">
                                                    具体位置:{" "}
                                                    {item.targetSpecificLocation}
                                                  </div>
                                                ) : null}
                                              </TableCell>
                                              <TableCell className="text-right font-bold text-primary text-[11px]">
                                                {item.transferAmount}{" "}
                                                {group.unit}
                                              </TableCell>
                                            </TableRow>
                                          ))}
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
                  /* 质押 / 抵押 / 仓单移库：平铺明细表格（对齐 PRD ASCII 线框 2） */
                  <div className="overflow-x-auto rounded-md border">
                    <Table className="min-w-[1100px] text-xs">
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="w-12 text-center">序号</TableHead>
                          <TableHead className="w-[200px]">货物名称</TableHead>
                          <TableHead className="w-[180px]">移出位置</TableHead>
                          <TableHead className="w-[110px]">原具体位置</TableHead>
                          <TableHead className="w-[120px] text-right font-semibold">
                            移库数量
                          </TableHead>
                          <TableHead className="w-[180px]">
                            移入库房/分区
                          </TableHead>
                          <TableHead className="w-[110px]">
                            移入具体位置
                          </TableHead>
                          <TableHead className="w-[130px] text-center">
                            存货条码
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flatDetails.map((item, idx) => (
                          <TableRow key={item.id} className="hover:bg-muted/20">
                            <TableCell className="text-center text-muted-foreground">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="font-semibold text-foreground">
                              {item.goodsName}
                            </TableCell>
                            <TableCell className="text-foreground text-[11px]">
                              {item.sourceRoomZone}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-[11px]">
                              {item.sourceSpecificLocation || "—"}
                            </TableCell>
                            <TableCell className="text-right font-bold text-primary">
                              {item.transferAmount} {item.unit}
                            </TableCell>
                            <TableCell className="text-primary font-medium text-[11px]">
                              {item.targetRoomZone}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-[11px]">
                              {item.targetSpecificLocation || "—"}
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer"
                                title="查看存货条码"
                                onClick={() =>
                                  setQrCodeData({
                                    open: true,
                                    orderNo: record.id,
                                    goodsName: item.goodsName,
                                    position: item.targetRoomZone,
                                    quantityLabel: `${item.transferAmount} ${item.unit}`,
                                    qrCodeNo:
                                      item.barcode ||
                                      `SYZC-BAR-${item.id.slice(-6)}`,
                                    qrCodeUrl: item.qrCodeUrl,
                                  })
                                }
                              >
                                <QrCode className="size-3.5 text-primary" />
                                <span className="text-[11px]">
                                  {item.barcode
                                    ? item.barcode.slice(-8)
                                    : item.id.slice(-6)}
                                </span>
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </PrototypeAnnotationTarget>
          )}

          {/* Tab 2: 审核记录 */}
          {tab === "audit" && (
            <PrototypeAnnotationTarget annotationIds={["transfer-detail-audit-tab"]}>
              <div className="space-y-4 py-2">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {audits.map((step, idx) => (
                    <div
                      key={idx}
                      className="relative flex items-start gap-3 text-xs"
                    >
                      <div className="absolute -left-6 mt-1 flex size-5 items-center justify-center rounded-full bg-primary text-white shadow-2xs">
                        <CheckCircle2 className="size-3.5" />
                      </div>
                      <div className="flex-1 rounded-md border bg-muted/20 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground text-sm">
                            {step.nodeName}
                          </span>
                          <span className="text-muted-foreground">
                            {step.actionTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span>
                            处理人：{step.operatorName}
                            {step.operatorRole ? ` (${step.operatorRole})` : ""}
                          </span>
                          <span>
                            操作动作：
                            <strong className="text-foreground">
                              {step.action}
                            </strong>
                          </span>
                        </div>
                        {step.opinion && (
                          <p className="rounded bg-card p-2 text-foreground/90 border border-border/50">
                            审核意见：{step.opinion}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PrototypeAnnotationTarget>
          )}
        </div>

        {/* 复制反馈 Toast */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-md bg-foreground px-4 py-2 text-xs text-background shadow-lg transition-all animate-in fade-in slide-in-from-top-2">
            {toast}
          </div>
        )}

        {/* 弹窗：下载记录与单据下载 */}
        <TransferDownloadRecordsDialog
          open={downloadLogOpen}
          record={record}
          onClose={() => setDownloadLogOpen(false)}
        />

        <TransferPdfDialog
          open={downloadPdfOpen}
          record={record}
          onClose={() => setDownloadPdfOpen(false)}
        />

        {/* 弹窗：存货条码/二维码 */}
        {qrCodeData && (
          <QrCodeDialog
            open={qrCodeData.open}
            orderNo={qrCodeData.orderNo}
            goodsName={qrCodeData.goodsName}
            position={qrCodeData.position}
            quantityLabel={qrCodeData.quantityLabel}
            qrCodeNo={qrCodeData.qrCodeNo}
            qrCodeUrl={qrCodeData.qrCodeUrl}
            onClose={() => setQrCodeData(null)}
            onCopyHint={(code) => showToast(`已复制条码编号 ${code} 至剪贴板`)}
          />
        )}

        {/* 弹窗：图片预览 */}
        <ImageViewerModal
          open={!!previewImage}
          title={previewImage?.title}
          imageUrl={previewImage?.url}
          onClose={() => setPreviewImage(null)}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
