import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Camera,
  QrCode,
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
import { DetailSection, DetailField } from "@/shared/components/DetailSection"
import { DetailPageHeader } from "@/shared/components/DetailPageHeader"
import { DetailTabShell } from "@/shared/components/DetailTabShell"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { processingRecordDocuments } from "../documents/processing-record-documents"
import { processingRecordDetailAnnotations } from "../annotations/processing-record-detail.annotations"
import { CompleteProcessingDialog } from "../components/CompleteProcessingDialog"
import { ProcessingNullifyDialog } from "../components/ProcessingNullifyDialog"
import {
  PROCESSING_RECORD_LIST_PATH,
  PROCESSING_STATUS_MAP,
  PROCESSING_TYPE_MAP,
} from "../domain/constants"
import type { ProcessingRecord } from "../domain/types"
import { formatCurrency, formatQuantity } from "../lib/processing-calculator"
import { processingRecordsMock } from "../mock/processing-records.mock"

export function ProcessingRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // 寻找匹配记录
  const [record, setRecord] = useState<ProcessingRecord | null>(() => {
    return processingRecordsMock.find((r) => r.id === id) || processingRecordsMock[0]
  })

  const [activeTab, setActiveTab] = useState("photos")
  const [copied, setCopied] = useState(false)
  const [qrCodeModalBarcode, setQrCodeModalBarcode] = useState<string | null>(null)

  // 弹窗状态
  const [completeOpen, setCompleteOpen] = useState(false)
  const [nullifyOpen, setNullifyOpen] = useState(false)

  const handleCopyId = () => {
    if (!record) return
    navigator.clipboard.writeText(record.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!record) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">未找到对应的加工记录</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(PROCESSING_RECORD_LIST_PATH)}
        >
          返回列表
        </Button>
      </div>
    )
  }

  const statusCfg = PROCESSING_STATUS_MAP[record.status]

  return (
    <PrototypeAnnotationProvider
      title="加工记录详情"
      documents={processingRecordDocuments}
      annotations={processingRecordDetailAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* 顶栏摘要卡 */}
        <PrototypeAnnotationTarget annotationIds={["processing-detail-header"]}>
          <DetailPageHeader
            title="加工单详情"
            number={record.id}
            numberLabel="加工单号"
            status={
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusCfg.badgeClass}`}>
                {statusCfg.label}
              </span>
            }
            onBack={() => navigate(PROCESSING_RECORD_LIST_PATH)}
            onCopy={handleCopyId}
            copied={copied}
            actions={
              record.status === "PENDING_COMPLETION" ? (
                <>
                  <Button
                    size="sm"
                    className="gap-1 text-xs"
                    onClick={() => setCompleteOpen(true)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    完成加工
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700 border-rose-200 dark:border-rose-800 gap-1 text-xs"
                    onClick={() => setNullifyOpen(true)}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    作废
                  </Button>
                </>
              ) : undefined
            }
          />
        </PrototypeAnnotationTarget>

        {/* DetailSection 基本信息子板块（4 列网格） */}
        <PrototypeAnnotationTarget annotationIds={["processing-detail-basic-section"]}>
          <DetailSection title="基础信息">
            <DetailField label="制单人 / 制单时间">
              {record.createByName}
              {record.createOrgName ? ` (${record.createOrgName})` : ""} ｜ {record.createTime}
            </DetailField>
            <DetailField label="货主名称">{record.ownerName}</DetailField>
            <DetailField label="货主标识">{record.ownerIdentity}</DetailField>
            <DetailField label="加工日期">{record.processingTime}</DetailField>

            <DetailField label="加工类型">
              {PROCESSING_TYPE_MAP[record.processingType]}
            </DetailField>
            <DetailField label="所属仓库">{record.warehouseName}</DetailField>

            <DetailField label="关联融资单号">
              {record.associatedOrderId ? (
                <span className="inline-flex items-center gap-1 font-medium text-primary hover:underline cursor-pointer">
                  {record.associatedOrderId}
                  <ExternalLink className="h-3 w-3" />
                </span>
              ) : (
                "—"
              )}
            </DetailField>

            <DetailField label="单据业务状态">
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusCfg.badgeClass}`}
              >
                {statusCfg.label}
              </span>
            </DetailField>

            {/* 加工原因 */}
            <div className="col-span-full">
              <DetailField label="加工原因">
                {record.remark || "—"}
              </DetailField>
            </div>

            {/* 若为已完成，展示损耗信息 */}
            {record.status === "COMPLETED" && (
              <>
                <DetailField label="加工损耗比例">
                  {typeof record.lossRatio === "number" ? `${record.lossRatio}%` : "—"}
                </DetailField>
                <div className="col-span-3">
                  <DetailField label="损耗原因说明">
                    {record.lossReason || "—"}
                  </DetailField>
                </div>
              </>
            )}

          </DetailSection>
        </PrototypeAnnotationTarget>

        <DetailTabShell
          tabs={[
            { key: "photos", label: "凭证与附件" },
            { key: "input", label: "投入货物" },
            { key: "output", label: "产出货物" },
            { key: "audit", label: "审核记录" },
            { key: "modify", label: "修改记录" },
          ]}
          active={activeTab}
          onChange={setActiveTab}
        >
        <PrototypeAnnotationTarget annotationIds={["processing-detail-basic-section"]}>
          {activeTab === "photos" && (
            <div className="space-y-1.5">
              <div className="text-[13px] font-normal text-[#86909c]">现场设备抓拍图</div>
              <div className="flex flex-wrap items-center gap-3">
                {record.devicePhotos && record.devicePhotos.length > 0 ? (
                  record.devicePhotos.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      className="rounded-md border border-border/80 p-2 bg-slate-50 dark:bg-slate-800/40 text-center space-y-1"
                    >
                      {photo.status === "SUCCESS" && photo.url ? (
                        <img
                          src={photo.url}
                          alt={photo.deviceName}
                          className="h-20 w-32 object-cover rounded"
                        />
                      ) : (
                        <div className="h-20 w-32 rounded bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center text-muted-foreground text-[11px]">
                          <Camera className="h-5 w-5 mb-1" />
                          抓图失败/无监控设备
                        </div>
                      )}
                      <div className="text-[11px] text-muted-foreground max-w-[128px] truncate">
                        {photo.deviceName}
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">抓图失败/无监控设备</span>
                )}
              </div>
            </div>
          )}
        </PrototypeAnnotationTarget>

            {activeTab === "input" && (
            <>
              <div className="space-y-4">
                <PrototypeAnnotationTarget annotationIds={["processing-detail-tab-input"]}>
                  <div className="rounded-md border border-border/80 overflow-hidden">
                    <Table className="text-xs">
                      <TableHeader className="bg-slate-50 dark:bg-slate-800">
                        <TableRow className="h-9">
                          <TableHead className="w-12 text-center">序号</TableHead>
                          <TableHead className="w-52">货物名称 / 规格</TableHead>
                          <TableHead className="w-48">货物位置</TableHead>
                          <TableHead className="w-24">具体位置</TableHead>
                          <TableHead className="w-36">入库时间</TableHead>
                          <TableHead className="w-40">扩展信息</TableHead>
                          <TableHead className="w-32">存货条码</TableHead>
                          <TableHead className="w-28 text-right">计划投入</TableHead>
                          <TableHead className="w-28 text-right">实际消耗</TableHead>
                          <TableHead className="w-28 text-right">释放数量</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {record.inputGoodsGroups.flatMap((group, gIdx) =>
                          group.details.map((detail, dIdx) => (
                            <TableRow
                              key={detail.id}
                              className="h-12 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                            >
                              <TableCell className="text-center text-muted-foreground">
                                {gIdx + 1}.{dIdx + 1}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-foreground">
                                  {group.goodsName}
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                  {group.specModel || "—"}
                                </div>
                              </TableCell>
                              <TableCell className="text-foreground">
                                {detail.roomZone}
                              </TableCell>
                              <TableCell className="text-foreground">
                                {detail.specificLocation || "—"}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {detail.inboundTime}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {detail.otherInfo || "—"}
                              </TableCell>
                              <TableCell>
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                                  onClick={() => setQrCodeModalBarcode(detail.barcode)}
                                >
                                  <QrCode className="h-3.5 w-3.5" />
                                  {detail.barcode}
                                </button>
                              </TableCell>
                              <TableCell className="text-right font-medium text-foreground">
                                {formatQuantity(detail.planAmount)} {detail.unit}
                              </TableCell>
                              <TableCell className="text-right font-medium text-foreground">
                                {record.status === "COMPLETED" &&
                                typeof detail.actualAmount === "number"
                                  ? `${formatQuantity(detail.actualAmount)} ${detail.unit}`
                                  : "—"}
                              </TableCell>
                              <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                                {record.status === "COMPLETED" &&
                                typeof detail.releasedAmount === "number"
                                  ? `${formatQuantity(detail.releasedAmount)} ${detail.unit}`
                                  : "—"}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </PrototypeAnnotationTarget>
              </div>
            </>)}
            {activeTab === "output" && (
            <>
              <div className="space-y-4">
                <PrototypeAnnotationTarget annotationIds={["processing-detail-tab-output"]}>
                  <div className="rounded-md border border-border/80 overflow-hidden">
                    <Table className="text-xs">
                      <TableHeader className="bg-slate-50 dark:bg-slate-800">
                        <TableRow className="h-9">
                          <TableHead className="w-12 text-center">序号</TableHead>
                          <TableHead className="w-52">产出货物</TableHead>
                          <TableHead className="w-24 text-right">预计数量</TableHead>
                          <TableHead className="w-24 text-right">实际数量</TableHead>
                          <TableHead className="w-24 text-right">行业参考价</TableHead>
                          <TableHead className="w-48">入库位置</TableHead>
                          <TableHead className="w-56">扩展属性 (动态采集)</TableHead>
                          <TableHead className="w-36">新存货条码</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {record.outputGoodsItems.map((item, idx) => (
                          <TableRow
                            key={item.id}
                            className="h-12 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          >
                            <TableCell className="text-center text-muted-foreground">
                              {idx + 1}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-foreground">{item.goodsName}</div>
                              <div className="text-[11px] text-muted-foreground">
                                规格：{item.specModel}
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {formatQuantity(item.expectedQty)} {item.unit}
                            </TableCell>
                            <TableCell className="text-right font-medium text-foreground">
                              {record.status === "COMPLETED" &&
                              typeof item.actualQty === "number"
                                ? `${formatQuantity(item.actualQty)} ${item.unit}`
                                : "—"}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell>
                              <div className="text-foreground">
                                {item.warehouseLocation || "—"}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                库位：{item.specificLocation || "—"}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.collectAttrs && item.collectAttrs.length > 0 ? (
                                <div className="space-y-0.5">
                                  {item.collectAttrs.map((attr) => (
                                    <div
                                      key={attr.key}
                                      className="text-[11px] text-muted-foreground"
                                    >
                                      <span className="font-medium text-foreground">
                                        {attr.label}：
                                      </span>
                                      {attr.value || "—"}
                                      {attr.unit && ` ${attr.unit}`}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">--</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {record.status === "COMPLETED" && item.barcode ? (
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                  onClick={() => setQrCodeModalBarcode(item.barcode!)}
                                >
                                  <QrCode className="h-3.5 w-3.5" />
                                  {item.barcode}
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
                </PrototypeAnnotationTarget>
              </div>
            </>)}
            {activeTab === "audit" && (
            <>
              <div className="space-y-4">
                <PrototypeAnnotationTarget annotationIds={["processing-detail-tab-audit"]}>
                  <div className="space-y-4 py-2">
                    <div className="text-xs font-semibold text-foreground">
                      通用审批任务流转时间轴（流程：仓储存货加工审批流程）
                    </div>

                    <div className="relative border-l-2 border-border/80 ml-4 space-y-6 pl-5">
                      {record.auditNodes && record.auditNodes.length > 0 ? (
                        record.auditNodes.map((node) => (
                          <div key={node.id} className="relative space-y-1">
                            {/* 节点圆圈 */}
                            <div className="absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />

                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-foreground">
                                {node.nodeName}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {node.handleTime}
                              </span>
                            </div>

                            <div className="text-xs text-muted-foreground">
                              处理人：{node.handlerName}
                              {node.handlerOrg && ` (${node.handlerOrg})`}
                            </div>

                            {node.comment && (
                              <div className="rounded bg-slate-50 p-2 text-xs text-foreground dark:bg-slate-800/60">
                                审批意见：{node.comment}
                              </div>
                            )}

                            {node.taskId && (
                              <div className="pt-0.5">
                                <span className="text-[11px] text-primary hover:underline cursor-pointer inline-flex items-center gap-0.5">
                                  查看通用审批中心任务详情 &gt;
                                </span>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">暂无审核历史记录</p>
                      )}
                    </div>
                  </div>
                </PrototypeAnnotationTarget>
              </div>
            </>)}
            {activeTab === "modify" && (
            <>
              <div className="space-y-4">
                <PrototypeAnnotationTarget annotationIds={["processing-detail-tab-modify"]}>
                  {record.modifyRecord ? (
                    <div className="rounded-md border border-border/80 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">
                          {record.modifyRecord.type === "COMPLETED"
                            ? "现场完成加工入库操作记录"
                            : "单据授权作废操作记录"}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {record.modifyRecord.operateTime}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">责任操作人：</span>
                          <span className="font-medium text-foreground">
                            {record.modifyRecord.operatorName}
                            {record.modifyRecord.operatorOrg &&
                              ` (${record.modifyRecord.operatorOrg})`}
                          </span>
                        </div>

                        {record.modifyRecord.type === "COMPLETED" && (
                          <div>
                            <span className="text-muted-foreground">加工损耗比例：</span>
                            <span className="font-medium text-foreground">
                              {record.modifyRecord.lossRatio}%
                            </span>
                          </div>
                        )}

                        {record.modifyRecord.type === "COMPLETED" &&
                          record.modifyRecord.lossReason && (
                            <div className="col-span-full">
                              <span className="text-muted-foreground">损耗原因说明：</span>
                              <span className="text-foreground">
                                {record.modifyRecord.lossReason}
                              </span>
                            </div>
                          )}

                        {record.modifyRecord.type === "VOIDED" &&
                          record.modifyRecord.voidReason && (
                            <div className="col-span-full">
                              <span className="text-muted-foreground">作废成因说明：</span>
                              <span className="text-foreground">
                                {record.modifyRecord.voidReason}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground py-4 text-center">
                      该单据处于未完成状态，暂无最终修改与作废审计记录。
                    </p>
                  )}
                </PrototypeAnnotationTarget>
              </div>
            </>)}
        </DetailTabShell>

        {/* 存货条码二维码弹窗 */}
        {qrCodeModalBarcode && (
          <Dialog
            open={Boolean(qrCodeModalBarcode)}
            onOpenChange={(o) => !o && setQrCodeModalBarcode(null)}
          >
            <DialogContent className="max-w-xs text-center p-6">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold">
                  存货二维码标识
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-4 space-y-2">
                <div className="h-40 w-40 rounded-md border border-border p-2 bg-white flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-slate-800" />
                </div>
                <div className="font-medium text-xs text-foreground">
                  条码：{qrCodeModalBarcode}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* 完成加工弹窗 */}
        <CompleteProcessingDialog
          open={completeOpen}
          onOpenChange={setCompleteOpen}
          record={record}
          onSuccess={(updated) => setRecord(updated)}
        />

        {/* 作废确认弹窗 */}
        <ProcessingNullifyDialog
          open={nullifyOpen}
          onOpenChange={setNullifyOpen}
          record={record}
          onSuccess={(updated) => setRecord(updated)}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
