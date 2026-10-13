import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  Clock,
  Camera,
  FileCheck2,
  Truck,
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
import { outboundRecordDetailAnnotations } from "../annotations/outbound-record-detail.annotations"
import { ImageViewerModal } from "../components/ImageViewerModal"
import { OUTBOUND_RECORD_LIST_PATH } from "../domain/constants"
import { outboundRecordsMock } from "../mock/outbound-records.mock"

type DetailTab = "goods" | "pickup" | "audit"

export function OutboundRecordDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const record = useMemo(() => {
    return (
      outboundRecordsMock.find((r) => r.id === id || r.orderNo === id) ||
      outboundRecordsMock[0]
    )
  }, [id])

  const [tab, setTab] = useState<DetailTab>("goods")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const isTransferOrAssign =
    record.type === "移库出库" || record.type === "转让出库"

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2400)
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
                  <span className="font-mono text-base font-bold ml-1">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(OUTBOUND_RECORD_LIST_PATH)}
                >
                  <ArrowLeft className="mr-1 size-4" />
                  返 回
                </Button>
              </div>
            </div>

            {/* 基础信息表格（对齐 detailTable 规范两行四列排版） */}
            <PrototypeAnnotationTarget annotationIds={["outbound-detail-basic"]}>
              <div className="mt-4 overflow-hidden rounded-md border text-xs">
                <table className="w-full border-collapse text-left">
                  <tbody>
                    <tr className="border-b">
                      <th className="w-28 bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                        制单人：
                      </th>
                      <td className="w-[35%] p-2.5 font-medium text-foreground border-r">
                        {record.createdByName}
                        {record.createdByOrg && (
                          <span className="text-muted-foreground ml-1">
                            ({record.createdByOrg})
                          </span>
                        )}
                      </td>
                      <th className="w-28 bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                        制单时间：
                      </th>
                      <td className="p-2.5 font-mono text-foreground">
                        {record.createTime}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                        货主名称：
                      </th>
                      <td className="p-2.5 font-medium text-foreground border-r">
                        {record.ownerName}
                      </td>
                      <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                        货主标识：
                      </th>
                      <td className="p-2.5 font-mono text-foreground">
                        {record.ownerIdentifier}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                        出库日期：
                      </th>
                      <td className="p-2.5 font-mono text-foreground border-r">
                        {record.outboundTime}
                      </td>
                      <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                        出库类型：
                      </th>
                      <td className="p-2.5 font-medium text-primary">
                        {record.type}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                        监管仓库：
                      </th>
                      <td className="p-2.5 font-medium text-foreground border-r">
                        {record.warehouseName}
                      </td>
                      <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                        关联业务单：
                      </th>
                      <td className="p-2.5 font-mono text-foreground">
                        {record.relatedNo && record.relatedNo !== "—" ? (
                          <span className="font-semibold text-primary">
                            {record.relatedNo}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>

                    <tr>
                      <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                        出库备注：
                      </th>
                      <td
                        colSpan={3}
                        className="p-2.5 text-muted-foreground leading-relaxed"
                      >
                        {record.notes || "无特别说明"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
              货品明细 ({record.goodsList.length})
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
              提货记录
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
              全流程审核轨迹
            </button>
          </div>

          {/* Tab 1: 货品明细 */}
          {tab === "goods" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>出库品类总数：{record.categoryCount} 种</span>
                <span>
                  本次出库总量：
                  <strong className="text-foreground font-mono text-sm ml-1">
                    {record.totalAmount.toLocaleString()} {record.amountUnit}
                  </strong>
                </span>
              </div>

              <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[1000px] text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-12 text-center">序号</TableHead>
                      <TableHead className="w-[180px]">货品名称</TableHead>
                      <TableHead className="w-[100px]">规格/牌号</TableHead>
                      <TableHead className="w-[180px]">存放位置</TableHead>
                      <TableHead className="w-[120px]">条形码</TableHead>
                      <TableHead className="w-[100px] text-right font-semibold">
                        本次出库量
                      </TableHead>
                      <TableHead className="w-[100px] text-right">
                        出库前库存
                      </TableHead>
                      <TableHead className="w-[100px] text-right">
                        出库后库存
                      </TableHead>
                      <TableHead className="w-[70px] text-center">单位</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {record.goodsList.map((goods, idx) => (
                      <TableRow key={goods.id || idx}>
                        <TableCell className="text-center text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {goods.goodsName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {goods.specName}
                          {goods.extraInfo && (
                            <span className="block text-[11px]">
                              {goods.extraInfo}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {goods.locationPath || "—"}
                        </TableCell>
                        <TableCell className="font-mono">
                          {goods.barcode || "—"}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-foreground">
                          {goods.totalOutboundAmount}
                        </TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">
                          {goods.beforeAmount !== undefined
                            ? goods.beforeAmount
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">
                          {goods.afterAmount !== undefined
                            ? goods.afterAmount
                            : "—"}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {goods.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Tab 2: 提货记录 (回显提货信息与提货记录) */}
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
                <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-6 text-center text-xs text-amber-800 space-y-1.5">
                  <Clock className="size-6 mx-auto text-amber-600 mb-1" />
                  <p className="font-semibold text-sm">待现场提货核销</p>
                  <p className="text-muted-foreground">
                    出库单已通过审批并生成提货单，提货码已生效。提货人完成装车复磅并出场核销后回写提货记录。
                  </p>
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
                              <td className="p-2.5 font-mono text-foreground border-r">
                                {record.pickupInfo.phone}
                              </td>
                              <th className="bg-muted/40 p-2.5 font-medium text-muted-foreground border-r">
                                证件号码：
                              </th>
                              <td className="p-2.5 font-mono text-foreground">
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
                                  className="p-2.5 font-mono font-semibold text-primary"
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
                              <td className="p-2.5 font-mono text-foreground">
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

          {/* Tab 3: 审核轨迹 */}
          {tab === "audit" && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {(record.auditRecord?.nodes || []).map((step, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-6 top-1 size-2.5 rounded-full border-2 border-background bg-emerald-500 shadow-xs" />
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-foreground">
                          {step.nodeName}
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {step.actionTime}
                        </span>
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
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 图片预览弹窗 */}
        <ImageViewerModal
          url={previewImageUrl}
          onClose={() => setPreviewImageUrl(null)}
        />

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
