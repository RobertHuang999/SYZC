import { Fragment, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ChevronDown, ChevronRight, Copy, QrCode, Camera, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inboundRecordDetailAnnotations } from "../annotations/inbound-record-detail.annotations"
import { inboundRecordDocuments } from "../documents/inbound-record-documents"
import { getInboundRecordDetailById, type InboundRecordDetail } from "../lib/detail-utils"
import { RevokeConfirmDialog } from "../components/RevokeConfirmDialog"
import { QrCodeDialog } from "../components/QrCodeDialog"
import { PdfViewerDialog } from "../components/PdfViewerDialog"
import { ImageViewerModal } from "../components/ImageViewerModal"
import { CURRENT_USER_NAME } from "../mock/inbound-records.mock"

type DetailTab = "goods" | "audit" | "modify"

export function InboundRecordDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const initialDetail = useMemo(() => getInboundRecordDetailById(id), [id])
  const [detail, setDetail] = useState<InboundRecordDetail | undefined>(initialDetail)
  const [tab, setTab] = useState<DetailTab>("goods")
  const [expandedGoods, setExpandedGoods] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<string | null>(null)

  // 弹窗状态
  const [revokeOpen, setRevokeOpen] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<{
    open: boolean
    orderNo: string
    goodsName: string
    position: string
    quantityLabel: string
    qrCodeNo: string
    qrCodeUrl?: string
  } | null>(null)
  const [pdfData, setPdfData] = useState<{
    open: boolean
    fileName: string
    fileUrl: string
  } | null>(null)
  const [imageViewerData, setImageViewerData] = useState<{
    open: boolean
    images: string[]
    initialIndex: number
  } | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  if (!detail) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 size-4" />
          返回列表
        </Button>
        <p className="text-sm text-muted-foreground">未找到该入库单详情 Mock 数据。</p>
      </div>
    )
  }

  const toggleGoods = (goodsId: string) => {
    setExpandedGoods((prev) => ({ ...prev, [goodsId]: !prev[goodsId] }))
  }

  const canRevoke =
    (detail.checkStatus === 0 || detail.checkStatus === 1) &&
    detail.creatorDisplay.includes(CURRENT_USER_NAME)

  const handleRevokeConfirm = () => {
    const now = new Date()
    const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

    setDetail((prev) =>
      prev
        ? {
            ...prev,
            checkStatus: 4,
            statusLabel: "已撤销",
            revokedTime: nowStr,
            auditTrail: [
              ...prev.auditTrail,
              {
                node: "单据撤销",
                actor: prev.creatorDisplay,
                time: nowStr,
                action: "撤销申请",
                opinion: "制单人主动撤销申请。",
              },
            ],
          }
        : undefined
    )
    setRevokeOpen(false)
    showToast("入库申请撤销成功，单据状态变更为【已撤销】")
  }

  // 状态样式印章
  const renderStatusStamp = () => {
    switch (detail.checkStatus) {
      case 0:
        return (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700 shadow-sm">
            待审核
          </span>
        )
      case 1:
        return (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-sm font-semibold text-amber-700 shadow-sm">
            审核中
          </span>
        )
      case 2:
        return (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
            已通过
          </span>
        )
      case 3:
        return (
          <span className="rounded-full border border-rose-200 bg-rose-50 px-4 py-1 text-sm font-semibold text-rose-700 shadow-sm">
            未通过
          </span>
        )
      case 4:
        return (
          <span className="rounded-full border border-gray-200 bg-gray-100 px-4 py-1 text-sm font-semibold text-gray-600 shadow-sm">
            已撤销
          </span>
        )
      default:
        return null
    }
  }

  return (
    <PrototypeAnnotationProvider
      title="入库单详情"
      documents={inboundRecordDocuments}
      annotations={inboundRecordDetailAnnotations}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["inbound-detail-header"]}>
          <div className="relative rounded-xl border bg-card p-5 shadow-sm">
            {/* 状态印章与操作栏 */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {renderStatusStamp()}
              {canRevoke && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setRevokeOpen(true)}
                >
                  撤 销
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                返 回
              </Button>
            </div>

            {/* 单号 */}
            <div className="flex flex-wrap items-center gap-2 pr-44">
              <span className="text-sm font-medium text-muted-foreground">入库单号：</span>
              <span className="font-mono text-base font-semibold">{detail.orderNo}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => {
                  void navigator.clipboard.writeText(detail.orderNo)
                  showToast("已复制入库单号")
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>

            {/* 基础信息表格（对齐 store-apply-info-detail.vue） */}
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md bg-muted/20 p-2.5">
                <dt className="text-xs text-muted-foreground">制单人</dt>
                <dd className="mt-0.5 font-medium">{detail.creatorDisplay}</dd>
              </div>
              <div className="rounded-md bg-muted/20 p-2.5">
                <dt className="text-xs text-muted-foreground">制单时间</dt>
                <dd className="mt-0.5 font-medium">{detail.createdAt}</dd>
              </div>
              <div className="rounded-md bg-muted/20 p-2.5">
                <dt className="text-xs text-muted-foreground">货主名称</dt>
                <dd className="mt-0.5 font-medium">{detail.ownerName}</dd>
              </div>
              <div className="rounded-md bg-muted/20 p-2.5">
                <dt className="text-xs text-muted-foreground">货主标识</dt>
                <dd className="mt-0.5 font-medium">{detail.ownerIdentifierMasked}</dd>
              </div>
              <div className="rounded-md bg-muted/20 p-2.5">
                <dt className="text-xs text-muted-foreground">入库日期</dt>
                <dd className="mt-0.5 font-medium">{detail.inboundDate}</dd>
              </div>
              <div className="rounded-md bg-muted/20 p-2.5">
                <dt className="text-xs text-muted-foreground">入库类型</dt>
                <dd className="mt-0.5 font-medium">{detail.inboundType}</dd>
              </div>
              <div className="rounded-md bg-muted/20 p-2.5">
                <dt className="text-xs text-muted-foreground">仓库/库房</dt>
                <dd className="mt-0.5 font-medium">
                  {detail.warehouseName}
                  {detail.houseNames ? ` - ${detail.houseNames}` : ""}
                </dd>
              </div>
              <div className="rounded-md bg-muted/20 p-2.5">
                <dt className="text-xs text-muted-foreground">关联单号</dt>
                <dd className="mt-0.5 font-medium">
                  {detail.relatedOrderNo || "--"}
                  {detail.relatedOrderNo && (
                    <span
                      className="ml-2 cursor-pointer text-primary hover:underline"
                      onClick={() => showToast(`查看关联单据：${detail.relatedOrderNo}`)}
                    >
                      【查看】
                    </span>
                  )}
                </dd>
              </div>
              <div className="col-span-full rounded-md bg-muted/20 p-2.5">
                <dt className="text-xs text-muted-foreground">备注信息</dt>
                <dd className="mt-0.5 text-foreground">{detail.remark || "——"}</dd>
              </div>
            </dl>
          </div>
        </PrototypeAnnotationTarget>

        {/* 标签页导航 */}
        <PrototypeAnnotationTarget annotationIds={["inbound-detail-tabs"]}>
          <div className="flex flex-wrap gap-2 border-b pb-2">
            {(
              [
                ["goods", "入库明细"],
                ["audit", "审核记录"],
                ["modify", "入库信息修改记录"],
              ] as const
            ).map(([key, label]) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={tab === key ? "secondary" : "ghost"}
                onClick={() => setTab(key)}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Tab 1: 入库明细 */}
          {tab === "goods" && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-md border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-10" />
                      <TableHead className="w-12">序号</TableHead>
                      <TableHead>入库货品</TableHead>
                      <TableHead>扩展收集项</TableHead>
                      <TableHead>总数量</TableHead>
                      <TableHead>货品备注</TableHead>
                      <TableHead className="w-24">存货条码</TableHead>
                      <TableHead className="w-24">现场照片</TableHead>
                      <TableHead className="w-28">补充资料</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.goodsLines.map((line, index) => {
                      const open = expandedGoods[line.id] ?? index === 0
                      return (
                        <Fragment key={line.id}>
                          <TableRow className="align-top">
                            <TableCell>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => toggleGoods(line.id)}
                              >
                                {open ? (
                                  <ChevronDown className="size-4" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                              </button>
                            </TableCell>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <span className="font-medium text-foreground">{line.name}</span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {line.otherInfo}
                            </TableCell>
                            <TableCell className="font-semibold text-foreground">
                              {line.totalQuantityLabel}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {line.remark}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 gap-1 px-2 text-xs"
                                onClick={() => {
                                  const firstStack = line.stacks[0]
                                  setQrCodeData({
                                    open: true,
                                    orderNo: detail.orderNo,
                                    goodsName: line.name,
                                    position: firstStack ? `${firstStack.storeroom} / ${firstStack.zone} / ${firstStack.position}` : "一楼 A 垛",
                                    quantityLabel: line.totalQuantityLabel,
                                    qrCodeNo: firstStack?.qrCodeNo || `SYZC-${detail.orderNo.slice(-6)}`,
                                    qrCodeUrl: firstStack?.qrCodeUrl,
                                  })
                                }}
                              >
                                <QrCode className="size-3.5" />
                                查看
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 gap-1 px-2 text-xs text-primary hover:underline"
                                onClick={() =>
                                  setImageViewerData({
                                    open: true,
                                    images: line.scenePhotos,
                                    initialIndex: 0,
                                  })
                                }
                              >
                                <Camera className="size-3.5" />
                                {line.scenePhotos.length} 张
                              </Button>
                            </TableCell>
                            <TableCell>
                              {line.supplementaryDocuments.length > 0 ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 gap-1 px-2 text-xs text-primary hover:underline"
                                  onClick={() =>
                                    setPdfData({
                                      open: true,
                                      fileName: line.supplementaryDocuments[0].name,
                                      fileUrl: line.supplementaryDocuments[0].url,
                                    })
                                  }
                                >
                                  <FileText className="size-3.5 text-red-500" />
                                  PDF预览
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">无</span>
                              )}
                            </TableCell>
                          </TableRow>

                          {/* 嵌套展开二级堆放位置 */}
                          {open && (
                            <TableRow key={`${line.id}-stacks`} className="bg-muted/10">
                              <TableCell colSpan={9} className="p-0">
                                <div className="border-t border-b bg-muted/20 px-6 py-3">
                                  <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-foreground">
                                      二级理货堆放位置明细
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      堆放小计：{line.stacks.reduce((acc, s) => acc + s.amount, 0)} {line.unit}
                                    </span>
                                  </div>
                                  <Table className="bg-card">
                                    <TableHeader>
                                      <TableRow className="bg-muted/50 text-xs">
                                        <TableHead className="w-12">序号</TableHead>
                                        <TableHead>入库库房</TableHead>
                                        <TableHead>入库分区</TableHead>
                                        <TableHead>具体位置</TableHead>
                                        <TableHead className="text-right">堆放数量</TableHead>
                                        <TableHead className="w-24 text-center">条码预览</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody className="text-xs">
                                      {line.stacks.map((stack, sIdx) => (
                                        <TableRow key={`${line.id}-stack-${sIdx}`}>
                                          <TableCell>{sIdx + 1}</TableCell>
                                          <TableCell>{stack.storeroom}</TableCell>
                                          <TableCell>{stack.zone}</TableCell>
                                          <TableCell className="font-medium">{stack.position}</TableCell>
                                          <TableCell className="text-right font-semibold text-primary">
                                            {stack.quantityLabel}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              className="size-7"
                                              onClick={() =>
                                                setQrCodeData({
                                                  open: true,
                                                  orderNo: detail.orderNo,
                                                  goodsName: line.name,
                                                  position: `${stack.storeroom} / ${stack.zone} / ${stack.position}`,
                                                  quantityLabel: stack.quantityLabel,
                                                  qrCodeNo: stack.qrCodeNo,
                                                  qrCodeUrl: stack.qrCodeUrl,
                                                })
                                              }
                                            >
                                              <QrCode className="size-4 text-primary" />
                                            </Button>
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

              {/* IoT 设备异步抓拍存证展示 */}
              <div className="rounded-lg border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">物联网 IoT 摄像头抓拍影像存证（R18）</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      货物过磅与入库卸货时由现场摄像头自动触发抓拍，司法存证固化防伪
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    共 {detail.iotCaptures.length} 个抓拍设备
                  </span>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {detail.iotCaptures.map((cap) => (
                    <div
                      key={cap.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-3 shadow-sm hover:border-primary/50"
                      onClick={() =>
                        cap.imageUrl
                          ? setImageViewerData({
                              open: true,
                              images: [cap.imageUrl],
                              initialIndex: 0,
                            })
                          : showToast("抓拍失败记录，已按业务规则 R18 降级留痕")
                      }
                    >
                      <img
                        src={cap.imageUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300"}
                        alt={cap.thumbnailLabel}
                        className="size-14 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-xs text-foreground">{cap.deviceName}</p>
                        <p className="text-[11px] text-muted-foreground">{cap.capturedAt}</p>
                        <span
                          className={`mt-1 inline-block text-[11px] font-medium ${
                            cap.status === "成功" ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {cap.thumbnailLabel} ({cap.status})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: 审核记录 */}
          {tab === "audit" && (
            <div className="rounded-lg border bg-card p-6">
              <ol className="space-y-6 border-l-2 border-primary/30 pl-5">
                {detail.auditTrail.map((step, idx) => (
                  <li key={`${step.node}-${step.time}-${idx}`} className="relative">
                    <span className="absolute -left-[1.65rem] top-1 size-3 rounded-full border-2 border-card bg-primary ring-2 ring-primary/20" />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        [{step.node}] {step.actor}
                      </span>
                      <span className="text-xs text-muted-foreground">{step.time}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-primary">{step.action}</p>
                    {step.opinion && (
                      <div className="mt-2 rounded bg-muted/40 p-2.5 text-xs text-muted-foreground">
                        审核意见：{step.opinion}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tab 3: 入库信息修改记录 */}
          {tab === "modify" && (
            <div className="overflow-x-auto rounded-lg border bg-card">
              {detail.modifyLogs.length === 0 ? (
                <p className="p-8 text-center text-sm text-muted-foreground">
                  暂无入库信息修改记录（审批流转中特权人员调整信息将在此全量公示）
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>修改字段</TableHead>
                      <TableHead>修改前</TableHead>
                      <TableHead>修改后</TableHead>
                      <TableHead>操作人</TableHead>
                      <TableHead>修改时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {detail.modifyLogs.map((log, idx) => (
                      <TableRow key={`${log.fieldLabel}-${idx}`}>
                        <TableCell className="font-medium">{log.fieldLabel}</TableCell>
                        <TableCell className="max-w-[240px] text-muted-foreground">
                          {log.beforeValue}
                        </TableCell>
                        <TableCell className="max-w-[240px] font-medium text-foreground">
                          {log.afterValue}
                        </TableCell>
                        <TableCell>{log.operator}</TableCell>
                        <TableCell className="text-muted-foreground">{log.operatedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </PrototypeAnnotationTarget>

        {/* 撤销确认弹窗 */}
        <RevokeConfirmDialog
          open={revokeOpen}
          ownerName={detail.ownerName}
          orderNo={detail.orderNo}
          onClose={() => setRevokeOpen(false)}
          onConfirm={handleRevokeConfirm}
        />

        {/* 二维码弹窗 */}
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
          />
        )}

        {/* PDF 预览弹窗 */}
        {pdfData && (
          <PdfViewerDialog
            open={pdfData.open}
            fileName={pdfData.fileName}
            fileUrl={pdfData.fileUrl}
            onClose={() => setPdfData(null)}
          />
        )}

        {/* 图片预览弹窗 */}
        {imageViewerData && (
          <ImageViewerModal
            open={imageViewerData.open}
            images={imageViewerData.images}
            initialIndex={imageViewerData.initialIndex}
            onClose={() => setImageViewerData(null)}
          />
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 rounded-lg border bg-foreground px-4 py-2.5 text-xs text-background shadow-lg animate-in fade-in slide-in-from-bottom-2">
            {toast}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
