import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDownIcon, ChevronRightIcon, ExternalLinkIcon, QrCodeIcon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DetailField, DetailSection, formatEmptyValue } from "@/shared/components/DetailSection"
import { cn } from "@/lib/utils"
import {
  DOC_KIND_LABELS,
  GUARANTEE_MODE_LABELS,
  HANDLING_STATUS_META,
  holderLabelsForDocKind,
  isDynamicGuaranteeMode,
  type SupervisionHandlingRecord,
} from "../domain/types"

interface SupervisionDetailDrawerProps {
  record: SupervisionHandlingRecord | null
  open: boolean
  onClose: () => void
  onEdit?: (record: SupervisionHandlingRecord) => void
  onQrPreview?: (barcode: string) => void
}

function formatAmount(val: number | undefined, unit: "WAN" | "YUAN"): string {
  if (val === undefined) return "—"
  return `${val.toLocaleString("zh-CN")}${unit === "WAN" ? "万元" : "元"}`
}

export function SupervisionDetailDrawer({
  record,
  open,
  onClose,
  onEdit,
  onQrPreview,
}: SupervisionDetailDrawerProps) {
  const [expandedSkus, setExpandedSkus] = useState<Record<string, boolean>>({})

  if (!open || !record) return null

  const statusMeta = HANDLING_STATUS_META[record.status]
  const holderLabels = holderLabelsForDocKind(record.docKind)
  const isDynamic = isDynamicGuaranteeMode(record.guaranteeMode)
  const canEdit = record.status === "DRAFT" || record.status === "REJECTED" || record.status === "WITHDRAWN"

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/45" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-4xl flex-col bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 抽屉顶栏 */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-lg font-semibold text-foreground">
                监管办理详情 · {record.applyNo}
              </h2>
              <Badge variant="outline" className={statusMeta.className}>
                {statusMeta.label}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {DOC_KIND_LABELS[record.docKind]}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              发起人：{record.applicantName} · 提交时间：{record.submittedAt}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && onEdit ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  onClose()
                  onEdit(record)
                }}
              >
                重新编辑
              </Button>
            ) : null}
            <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="关闭">
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>

        {/* 抽屉内容区（DetailSection + DetailField 上 label 下 value，4 列栅格） */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {record.status === "REJECTED" && record.rejectReason ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              <span className="font-medium">驳回原因：</span>
              {record.rejectReason}
            </div>
          ) : null}

          <DetailSection title="基础与主体信息">
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField label="货主类型" value={record.ownerType === "ENTERPRISE" ? "企业" : "个人"} />
              <DetailField label="货主名称" value={record.ownerName} />
              <DetailField label="货主标识" value={record.ownerIdentifier} />
              <DetailField
                label={record.ownerType === "ENTERPRISE" ? "联系电话" : "身份证号"}
                value={record.ownerContact}
              />
              <DetailField label="开立单据类型" value={DOC_KIND_LABELS[record.docKind]} />
              <DetailField label="担保方式" value={GUARANTEE_MODE_LABELS[record.guaranteeMode]} />
              <DetailField label={holderLabels.typeLabel} value="企业（只读）" />
              <DetailField label={holderLabels.nameLabel} value={record.holderName} />
              <DetailField label={holderLabels.idLabel} value={record.holderIdentifier} />
              <DetailField label="合同编号" value={formatEmptyValue(record.contractNo)} />
              <DetailField label="关联入库单">
                {record.relatedInboundNo ? (
                  <Link
                    to="/仓储/入库管理/入库记录"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {record.relatedInboundNo}
                    <ExternalLinkIcon className="size-3" />
                  </Link>
                ) : (
                  "—"
                )}
              </DetailField>
              <DetailField label="关联监管台账">
                {record.relatedSupervisionOrderNo ? (
                  <Link
                    to="/融资/监管/监管业务/监管管理"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {record.relatedSupervisionOrderNo}
                    <ExternalLinkIcon className="size-3" />
                  </Link>
                ) : (
                  "—"
                )}
              </DetailField>
            </div>
          </DetailSection>

          <DetailSection title="授信放款与风控参数">
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailField
                label="贷款金额"
                value={formatAmount(record.loanAmount, record.loanUnit)}
              />
              <DetailField
                label="贷款期数"
                value={record.loanPeriods !== undefined ? `${record.loanPeriods} 期` : "—"}
              />
              <DetailField
                label="授信金额"
                value={formatAmount(record.creditAmount, record.creditUnit)}
              />
              <DetailField
                label="授信期数"
                value={record.creditPeriods !== undefined ? `${record.creditPeriods} 期` : "—"}
              />
              {isDynamic ? (
                <>
                  <DetailField
                    label="货值安全线开关"
                    value={record.safetyLineEnabled ? "已开启" : "已关闭"}
                  />
                  <DetailField
                    label="货值安全线"
                    value={
                      record.safetyLineEnabled
                        ? formatAmount(record.safetyLineAmount, record.safetyLineUnit)
                        : "—"
                    }
                  />
                </>
              ) : null}
              <DetailField label="业务备注" value={formatEmptyValue(record.remark)} />
            </div>
          </DetailSection>

          <DetailSection title="货品明细（两级级联）">
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                    <th className="w-10 px-3 py-2 text-center">展开</th>
                    <th className="w-12 px-3 py-2 text-center">序</th>
                    <th className="px-3 py-2">货物名称</th>
                    <th className="px-3 py-2 whitespace-nowrap">{holderLabels.qtyLabel}</th>
                    <th className="px-3 py-2 whitespace-nowrap">基准单价(元)</th>
                    <th className="px-3 py-2 whitespace-nowrap">品类总价(元)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {record.goodsLines.map((line, index) => {
                    const isExpanded = expandedSkus[line.skuId] ?? index === 0
                    const qtySum = line.slots.reduce((s, x) => s + x.allocatedQty, 0)
                    const totalYuan =
                      line.unitPriceYuan !== null ? qtySum * line.unitPriceYuan : null
                    return (
                      <DetailSkuGroup
                        key={line.skuId}
                        index={index + 1}
                        line={line}
                        qtySum={qtySum}
                        totalYuan={totalYuan}
                        qtyLabel={holderLabels.qtyLabel}
                        isExpanded={isExpanded}
                        onToggle={() =>
                          setExpandedSkus((prev) => ({
                            ...prev,
                            [line.skuId]: !isExpanded,
                          }))
                        }
                        onQrPreview={onQrPreview}
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 rounded-md border bg-muted/20 px-4 py-2 text-xs text-muted-foreground">
              <span>
                货品品类数：<strong className="text-foreground">{record.categoryCount}</strong>
              </span>
              <span className="text-border">|</span>
              <span>
                货品总数量：<strong className="text-foreground">{record.totalQtyDisplay}</strong>
              </span>
              <span className="text-border">|</span>
              <span>
                货品总价值：
                <strong className="text-primary">
                  {record.totalValueWan !== null ? `${record.totalValueWan}万元` : "--"}
                </strong>
              </span>
            </div>
          </DetailSection>

          <DetailSection title="流转与审批记录">
            <div className="space-y-3">
              {record.timeline.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-md border border-border bg-muted/10 px-3.5 py-2.5 text-xs"
                >
                  <div>
                    <div className="font-medium text-foreground">
                      {item.action} · <span className="text-primary">{item.result}</span>
                    </div>
                    {item.remark ? (
                      <div className="mt-1 text-muted-foreground">{item.remark}</div>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right text-muted-foreground">
                    <div>{item.operator}</div>
                    <div>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>
        </div>
      </div>
    </div>
  )
}

function DetailSkuGroup({
  index,
  line,
  qtySum,
  totalYuan,
  qtyLabel,
  isExpanded,
  onToggle,
  onQrPreview,
}: {
  index: number
  line: SupervisionHandlingRecord["goodsLines"][number]
  qtySum: number
  totalYuan: number | null
  qtyLabel: string
  isExpanded: boolean
  onToggle: () => void
  onQrPreview?: (barcode: string) => void
}) {
  return (
    <>
      <tr className="hover:bg-muted/20">
        <td className="px-3 py-2.5 text-center">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex size-6 items-center justify-center rounded hover:bg-muted"
          >
            {isExpanded ? (
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRightIcon className="size-4 text-muted-foreground" />
            )}
          </button>
        </td>
        <td className="px-3 py-2.5 text-center text-muted-foreground">{index}</td>
        <td className="px-3 py-2.5 font-medium text-foreground">{line.skuName}</td>
        <td className="px-3 py-2.5 whitespace-nowrap">
          {Number(qtySum.toFixed(4))}
          {line.unit}
        </td>
        <td className="px-3 py-2.5 whitespace-nowrap">
          {line.unitPriceYuan !== null ? line.unitPriceYuan.toLocaleString("zh-CN") : "--"}
        </td>
        <td className="px-3 py-2.5 whitespace-nowrap font-medium">
          {totalYuan !== null ? totalYuan.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--"}
        </td>
      </tr>
      {isExpanded ? (
        <tr>
          <td colSpan={6} className="bg-muted/15 px-4 py-2">
            <div className="overflow-hidden rounded border border-border bg-background">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                    <th className="w-10 px-2 py-1.5 text-center">序</th>
                    <th className="px-2 py-1.5">存放位置</th>
                    <th className="px-2 py-1.5">具体位置</th>
                    <th className="px-2 py-1.5 whitespace-nowrap">入库时间</th>
                    <th className="px-2 py-1.5 whitespace-nowrap">状态</th>
                    <th className="px-2 py-1.5 whitespace-nowrap">存货条码</th>
                    <th className="px-2 py-1.5 whitespace-nowrap">{qtyLabel}</th>
                    <th className="px-2 py-1.5 whitespace-nowrap">货位价值(元)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {line.slots.map((slot, sIdx) => {
                    const slotVal =
                      line.unitPriceYuan !== null ? slot.allocatedQty * line.unitPriceYuan : null
                    return (
                      <tr key={slot.slotId}>
                        <td className="px-2 py-1.5 text-center text-muted-foreground">{sIdx + 1}</td>
                        <td className="px-2 py-1.5">
                          {slot.warehouseName}-{slot.storeroomName}-{slot.zoneName}
                        </td>
                        <td className="px-2 py-1.5 text-muted-foreground">{slot.locationCode}</td>
                        <td className="px-2 py-1.5 whitespace-nowrap text-muted-foreground">
                          {slot.inboundTime}
                        </td>
                        <td className="px-2 py-1.5 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[11px]",
                              slot.controlStatus === "存货中"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-amber-200 bg-amber-50 text-amber-700",
                            )}
                          >
                            {slot.controlStatus}
                          </Badge>
                        </td>
                        <td className="px-2 py-1.5">
                          <button
                            type="button"
                            onClick={() => onQrPreview?.(slot.barcode)}
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <QrCodeIcon className="size-3.5" />
                            <span>查看</span>
                          </button>
                        </td>
                        <td className="px-2 py-1.5 whitespace-nowrap">
                          {slot.allocatedQty}
                          {line.unit}
                        </td>
                        <td className="px-2 py-1.5 whitespace-nowrap">
                          {slotVal !== null ? slotVal.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}

