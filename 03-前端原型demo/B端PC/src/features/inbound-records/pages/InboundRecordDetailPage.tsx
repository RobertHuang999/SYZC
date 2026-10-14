import { Fragment, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Copy,
  QrCode,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Link2 } from "lucide-react"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inboundRecordDetailAnnotations } from "../annotations/inbound-record-detail.annotations"
import { inboundRecordDocuments } from "../documents/inbound-record-documents"
import { getInboundRecordDetailById, type InboundRecordDetail } from "../lib/detail-utils"
import { RevokeConfirmDialog } from "../components/RevokeConfirmDialog"
import { QrCodeDialog } from "../components/QrCodeDialog"
import {
  InboundAttachmentDialog,
  type AttachmentDialogData,
} from "../components/InboundAttachmentDialog"
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
    type: "main" | "sub"
    orderNo: string
    goodsName: string
    position: string
    quantityLabel: string
    qrCodeNo: string
    qrCodeUrl?: string
  } | null>(null)

  // 选项 A：统一查看附件弹窗
  const [attachmentData, setAttachmentData] = useState<AttachmentDialogData | null>(null)
  const [relatedOrderModalOpen, setRelatedOrderModalOpen] = useState(false)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  if (!detail) {
    return (
      <div className="space-y-4 p-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1 size-4" />
          返回列表
        </Button>
        <p className="text-sm text-muted-foreground">未找到该入库单详情数据。</p>
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
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-2xs">
            <Clock className="size-3.5" />
            待审核
          </span>
        )
      case 1:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-700 shadow-2xs">
            <Clock className="size-3.5" />
            审核中
          </span>
        )
      case 2:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 shadow-2xs">
            <CheckCircle2 className="size-3.5" />
            已通过
          </span>
        )
      case 3:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-700 shadow-2xs">
            <AlertCircle className="size-3.5" />
            未通过
          </span>
        )
      case 4:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-3.5 py-1 text-xs font-semibold text-gray-600 shadow-2xs">
            <RotateCcw className="size-3.5" />
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
      <div className="space-y-4 p-6 bg-muted/10 min-h-full">
        {/* 顶部标题与操作卡片（对齐 store-apply-info-detail.vue 结构） */}
        <PrototypeAnnotationTarget annotationIds={["inbound-detail-header"]}>
          <div className="rounded-lg border bg-card p-5 shadow-xs">
            {/* 顶栏：单号、状态徽标与操作按钮 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  入库单号：<span className="text-base font-bold">{detail.orderNo}</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-primary"
                  title="复制单号"
                  onClick={() => {
                    void navigator.clipboard.writeText(detail.orderNo)
                    showToast("已复制入库单号至剪贴板")
                  }}
                >
                  <Copy className="size-3.5" />
                </Button>
                <div className="ml-2">{renderStatusStamp()}</div>
              </div>

              <div className="flex items-center gap-2">
                {canRevoke && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => setRevokeOpen(true)}
                  >
                    撤 销
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                  返 回
                </Button>
              </div>
            </div>

            {/* 基础信息表格（对齐 store-apply-info-detail.vue 的 table.detailTable 规范两行四列排版） */}
            <div className="mt-4 overflow-hidden rounded-md border text-xs">
              <table className="w-full border-collapse text-left">
                <tbody>
                  <tr className="border-b">
                    <th className="w-28 bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                      制单人：
                    </th>
                    <td className="w-[35%] p-2.5 font-medium text-foreground border-r">
                      {detail.creatorDisplay}
                    </td>
                    <th className="w-28 bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                      制单时间：
                    </th>
                    <td className="p-2.5 text-foreground">{detail.createdAt}</td>
                  </tr>

                  <tr className="border-b">
                    <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                      货主名称：
                    </th>
                    <td className="p-2.5 font-medium text-foreground border-r">
                      {detail.ownerName}
                    </td>
                    <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                      货主标识：
                    </th>
                    <td className="p-2.5 text-foreground">
                      {detail.ownerIdentifierMasked}
                    </td>
                  </tr>

                  <tr className="border-b">
                    <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                      入库日期：
                    </th>
                    <td className="p-2.5 text-foreground border-r">
                      {detail.inboundDate}
                    </td>
                    <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                      入库类型：
                    </th>
                    <td className="p-2.5 font-medium text-foreground">{detail.inboundType}</td>
                  </tr>

                  <tr className="border-b">
                    <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                      仓库名称：
                    </th>
                    <td className="p-2.5 font-medium text-foreground border-r">
                      {detail.warehouseName}
                      {detail.houseNames ? ` - ${detail.houseNames}` : ""}
                    </td>
                    <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                      关联单号：
                    </th>
                    <td className="p-2.5 text-foreground">
                      {detail.relatedOrderNo ? (
                        <div className="flex items-center gap-1.5">
                          <span>{detail.relatedOrderNo}</span>
                          <span
                            className="cursor-pointer text-primary hover:underline text-[11px]"
                            onClick={() => setRelatedOrderModalOpen(true)}
                          >
                            【查看】
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                      备注信息：
                    </th>
                    <td colSpan={3} className="p-2.5 text-foreground leading-relaxed">
                      {detail.remark || "--"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        {/* 标签页导航与内容区 */}
        <PrototypeAnnotationTarget annotationIds={["inbound-detail-tabs"]}>
          <div className="rounded-lg border bg-card p-5 shadow-xs space-y-4">
            <div className="flex border-b">
              {(
                [
                  ["goods", "入库明细"],
                  ["audit", "审核记录"],
                  ["modify", "入库信息修改记录"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`border-b-2 px-5 py-2.5 text-xs font-medium transition-colors ${
                    tab === key
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab 1: 入库明细（对齐源码带有两级展开表格、二维码图标与【查看附件】弹窗） */}
            {tab === "goods" && (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-md border bg-card">
                  <Table className="table-fixed w-full">
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs">
                        <TableHead className="w-9 text-center" />
                        <TableHead className="w-10 text-center">序号</TableHead>
                        <TableHead className="w-[22%]">入库货品</TableHead>
                        <TableHead className="w-[22%]">其他信息</TableHead>
                        <TableHead className="w-[11%] text-right">总数量</TableHead>
                        <TableHead className="w-[18%]">备注</TableHead>
                        <TableHead className="w-14 text-center">存货条码</TableHead>
                        <TableHead className="w-[14%] text-center">附件信息</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs">
                      {detail.goodsLines.map((line, index) => {
                        const open = expandedGoods[line.id] ?? index === 0
                        return (
                          <Fragment key={line.id}>
                            <TableRow className="align-middle hover:bg-muted/20">
                              <TableCell className="align-middle text-center p-2">
                                <button
                                  type="button"
                                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                  title={open ? "收起堆放位置" : "展开堆放位置"}
                                  onClick={() => toggleGoods(line.id)}
                                >
                                  {open ? (
                                    <ChevronDown className="size-4" />
                                  ) : (
                                    <ChevronRight className="size-4" />
                                  )}
                                </button>
                              </TableCell>
                              <TableCell className="align-middle text-center text-muted-foreground">
                                {index + 1}
                              </TableCell>
                              <TableCell className="whitespace-normal align-middle py-2.5">
                                <span className="line-clamp-2 font-semibold leading-snug text-foreground">
                                  {line.name}
                                </span>
                              </TableCell>
                              <TableCell className="whitespace-normal align-middle py-2.5 text-muted-foreground">
                                <span className="line-clamp-2 leading-snug break-words">
                                  {line.otherInfo || "--"}
                                </span>
                              </TableCell>
                              <TableCell className="whitespace-normal align-middle py-2.5 text-right font-semibold text-primary">
                                <span className="line-clamp-2 leading-snug">
                                  {line.totalQuantityLabel}
                                </span>
                              </TableCell>
                              <TableCell className="whitespace-normal align-middle py-2.5 text-muted-foreground">
                                <span className="line-clamp-2 leading-snug break-words">
                                  {line.remark || "--"}
                                </span>
                              </TableCell>

                              {/* 存货主条码：未通过(3)与已撤销(4)状态不展示条码，对齐源码 */}
                              <TableCell className="align-middle text-center">
                                {detail.checkStatus !== 3 && detail.checkStatus !== 4 ? (
                                  <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                                    title="查看货品主条码"
                                    onClick={() => {
                                      const firstStack = line.stacks[0]
                                      setQrCodeData({
                                        open: true,
                                        type: "main",
                                        orderNo: detail.orderNo,
                                        goodsName: line.name,
                                        position: firstStack
                                          ? `${firstStack.storeroom} / ${firstStack.zone} / ${firstStack.position}`
                                          : "一楼 A 垛",
                                        quantityLabel: line.totalQuantityLabel,
                                        qrCodeNo: `SYZC-${detail.orderNo.slice(-6)}-MAIN`,
                                        qrCodeUrl: firstStack?.qrCodeUrl,
                                      })
                                    }}
                                  >
                                    <QrCode className="size-5" />
                                  </button>
                                ) : (
                                  <span className="text-muted-foreground">--</span>
                                )}
                              </TableCell>

                              {/* 附件信息：统一【查看附件】操作按钮（选项 A 规范） */}
                              <TableCell className="align-middle text-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-primary hover:underline hover:bg-primary/5"
                                  onClick={() => {
                                    setAttachmentData({
                                      goodsName: line.name,
                                      scenePhotos: line.scenePhotos,
                                      supplementaryImages: line.supplementaryImages,
                                      supplementaryDocuments: line.supplementaryDocuments,
                                      capturePhotos: line.iotCaptures.map((cap) => ({
                                        deviceName: cap.deviceName,
                                        time: cap.capturedAt,
                                        url:
                                          cap.imageUrl ??
                                          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
                                      })),
                                    })
                                  }}
                                >
                                  <Paperclip className="mr-1 size-3.5" />
                                  查看附件
                                </Button>
                              </TableCell>
                            </TableRow>

                            {/* 展开行：二级理货堆放位置明细表格 */}
                            {open && (
                              <TableRow className="bg-muted/10 hover:bg-muted/10">
                                <TableCell colSpan={8} className="p-3 pl-12 pr-6">
                                  <div className="rounded-md border bg-card p-3 shadow-2xs">
                                    <div className="mb-2 flex items-center justify-between text-xs">
                                      <span className="font-semibold text-foreground">
                                        二级堆放货位分配明细 ({line.stacks.length} 处)
                                      </span>
                                      <span className="text-muted-foreground">
                                        合计堆放：{line.stacks.reduce((acc, s) => acc + s.amount, 0).toFixed(4)} {line.unit}
                                      </span>
                                    </div>

                                    <Table className="table-fixed w-full bg-background text-xs">
                                      <TableHeader>
                                        <TableRow className="bg-muted/40 text-[11px]">
                                          <TableHead className="w-10 text-center">序号</TableHead>
                                          <TableHead className="w-[18%]">入库库房</TableHead>
                                          <TableHead className="w-[18%]">入库分区</TableHead>
                                          <TableHead className="w-[28%]">具体堆放位置</TableHead>
                                          <TableHead className="w-[18%] text-right">堆放数量</TableHead>
                                          <TableHead className="w-14 text-center">存货条码</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {line.stacks.map((stack, sIdx) => (
                                          <TableRow key={sIdx} className="align-middle hover:bg-muted/20">
                                            <TableCell className="align-middle text-center text-muted-foreground">
                                              {sIdx + 1}
                                            </TableCell>
                                            <TableCell className="whitespace-normal align-middle py-2">
                                              <span className="line-clamp-2 leading-snug">
                                                {stack.storeroom}
                                              </span>
                                            </TableCell>
                                            <TableCell className="whitespace-normal align-middle py-2">
                                              <span className="line-clamp-2 leading-snug">
                                                {stack.zone}
                                              </span>
                                            </TableCell>
                                            <TableCell className="whitespace-normal align-middle py-2 font-medium text-foreground">
                                              <span className="line-clamp-2 leading-snug break-words">
                                                {stack.position}
                                              </span>
                                            </TableCell>
                                            <TableCell className="whitespace-normal align-middle py-2 text-right font-semibold text-primary">
                                              <span className="line-clamp-2 leading-snug">
                                                {stack.quantityLabel}
                                              </span>
                                            </TableCell>
                                            <TableCell className="align-middle text-center">
                                              {detail.checkStatus !== 3 && detail.checkStatus !== 4 ? (
                                                <button
                                                  type="button"
                                                  className="inline-flex items-center justify-center rounded p-1 text-muted-foreground hover:text-primary transition-colors"
                                                  title="查看子条码"
                                                  onClick={() => {
                                                    setQrCodeData({
                                                      open: true,
                                                      type: "sub",
                                                      orderNo: detail.orderNo,
                                                      goodsName: line.name,
                                                      position: `${stack.storeroom} / ${stack.zone} / ${stack.position}`,
                                                      quantityLabel: stack.quantityLabel,
                                                      qrCodeNo: stack.qrCodeNo,
                                                      qrCodeUrl: stack.qrCodeUrl,
                                                    })
                                                  }}
                                                >
                                                  <QrCode className="size-4" />
                                                </button>
                                              ) : (
                                                <span className="text-muted-foreground">--</span>
                                              )}
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
              </div>
            )}

            {/* Tab 2: 审核记录 */}
            {tab === "audit" && (
              <div className="space-y-4 py-2">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {detail.auditTrail.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 text-xs">
                      <div className="absolute -left-6 mt-1 flex size-5 items-center justify-center rounded-full bg-primary text-white">
                        <CheckCircle2 className="size-3.5" />
                      </div>
                      <div className="flex-1 rounded-md border bg-muted/20 p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground text-sm">
                            {step.node}
                          </span>
                          <span className="text-muted-foreground">{step.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <span>处理人：{step.actor}</span>
                          <span>操作动作：<strong className="text-foreground">{step.action}</strong></span>
                        </div>
                        {step.opinion && (
                          <p className="mt-1.5 rounded bg-card p-2 text-foreground/90 border border-border/50">
                            审核意见：{step.opinion}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: 入库信息修改记录 */}
            {tab === "modify" && (
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
                      {detail.modifyLogs.length > 0 ? (
                        detail.modifyLogs.map((log, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-center text-muted-foreground">
                              {idx + 1}
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
            )}
          </div>
        </PrototypeAnnotationTarget>

        {/* 撤销确认弹窗 */}
        <RevokeConfirmDialog
          open={revokeOpen}
          orderNo={detail.orderNo}
          ownerName={detail.ownerName}
          onClose={() => setRevokeOpen(false)}
          onConfirm={handleRevokeConfirm}
        />

        {/* 存货条码弹窗（支持主条码与子条码） */}
        {qrCodeData && (
          <QrCodeDialog
            open={qrCodeData.open}
            type={qrCodeData.type}
            orderNo={qrCodeData.orderNo}
            goodsName={qrCodeData.goodsName}
            position={qrCodeData.position}
            quantityLabel={qrCodeData.quantityLabel}
            qrCodeNo={qrCodeData.qrCodeNo}
            qrCodeUrl={qrCodeData.qrCodeUrl}
            onClose={() => setQrCodeData(null)}
            onCopyHint={(code) => showToast(`已复制条码编号: ${code}`)}
          />
        )}

        {/* 选项 A：统一查看附件弹窗 */}
        <InboundAttachmentDialog
          open={attachmentData !== null}
          data={attachmentData}
          onClose={() => setAttachmentData(null)}
        />

        {/* 关联业务单据详情弹窗（对齐源码各单据弹窗分类） */}
        <Dialog open={relatedOrderModalOpen} onOpenChange={setRelatedOrderModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Link2 className="size-5 text-primary" />
                <DialogTitle className="text-base font-semibold">
                  {detail.inboundType === "质押入库"
                    ? "质押单据详情 (PLEDGE)"
                    : detail.inboundType === "抵押入库"
                    ? "抵押单据详情 (MORTGAGE)"
                    : detail.inboundType === "监管服务入库"
                    ? "监管服务单据详情 (SUPERVISION)"
                    : "关联业务单据详情"}
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-3 rounded-lg border bg-muted/20 p-4 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">关联业务单号：</span>
                <span className="font-semibold text-primary">{detail.relatedOrderNo || "--"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">单据业务类型：</span>
                <span className="font-medium text-foreground">{detail.inboundType}（存货质押监管）</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">借款货主企业：</span>
                <span className="font-medium text-foreground">{detail.ownerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">货主识别代码：</span>
                <span className="text-muted-foreground">{detail.ownerIdentifierMasked}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">业务发生日期：</span>
                <span className="text-foreground">{detail.inboundDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">监管执行仓库：</span>
                <span className="text-foreground">{detail.warehouseName}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-muted-foreground">关联货品清单：</span>
                <span className="font-semibold text-foreground">
                  {detail.goodsLines.map((g) => g.name).join("、")}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setRelatedOrderModalOpen(false)}>
                确 定
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {toast ? (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-foreground px-4 py-3 text-xs text-background shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
