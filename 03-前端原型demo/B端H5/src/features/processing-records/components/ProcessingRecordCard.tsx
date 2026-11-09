import { ArrowRight, Package } from "lucide-react"
import { RecordCard, RecordCardMetricRow } from "@/shared/components/RecordCard"
import {
  PROCESSING_STATUS_MAP,
  PROCESSING_TYPE_MAP,
  formatQty,
  processingDetailRoute,
} from "../domain/constants"
import type { ProcessingRecord } from "../domain/types"

interface ProcessingRecordCardProps {
  item: ProcessingRecord
  onComplete: (item: ProcessingRecord) => void
  onVoid: (item: ProcessingRecord) => void
}

/** 投入 / 产出摘要：列表只给一行，详情页再展开到货位与条码 */
function buildFlowSummary(item: ProcessingRecord): string {
  const inputNames = item.inputGroups.map((group) => group.goodsName.replace(/^.*-/, ""))
  const outputNames = item.outputItems.map((output) => output.goodsName.replace(/^.*-/, ""))
  return `${inputNames.join("、") || "—"} ➔ ${outputNames.join("、") || "—"}`
}

function buildQuantitySummary(item: ProcessingRecord): string {
  const unit = item.inputGroups[0]?.unit ?? item.outputItems[0]?.unit ?? ""
  if (item.status === "COMPLETED") {
    const actualInput = item.inputGroups.reduce(
      (sum, group) =>
        sum + group.lines.reduce((lineSum, line) => lineSum + (line.actualAmount ?? 0), 0),
      0
    )
    const actualOutput = item.outputItems.reduce(
      (sum, output) => sum + (output.actualQty ?? 0),
      0
    )
    return `投入 ${formatQty(actualInput)} ${unit} / 产出 ${formatQty(actualOutput)} ${unit}`
  }
  const planInput = item.inputGroups.reduce(
    (sum, group) => sum + group.lines.reduce((lineSum, line) => lineSum + line.planAmount, 0),
    0
  )
  return `计划投入 ${formatQty(planInput)} ${unit}`
}

export function ProcessingRecordCard({
  item,
  onComplete,
  onVoid,
}: ProcessingRecordCardProps) {
  const status = PROCESSING_STATUS_MAP[item.status]
  const isPending = item.status === "PENDING_COMPLETION"

  return (
    <RecordCard
      orderNo={item.id}
      detailTo={processingDetailRoute(item.id)}
      typeLabel={PROCESSING_TYPE_MAP[item.processingType]}
      statusLabel={status.label}
      statusTone={status.tone}
      ownerName={item.ownerName}
      ownerIdentifier={item.ownerIdentity}
      metrics={
        <>
          <RecordCardMetricRow
            label="加工流转"
            value={
              <span className="inline-flex min-w-0 items-center gap-1">
                <Package className="size-3 shrink-0 text-[#232D39]/40" />
                <span className="truncate">{buildFlowSummary(item)}</span>
                <ArrowRight className="size-3 shrink-0 text-blue-600" />
              </span>
            }
          />
          <RecordCardMetricRow label="加工数量" value={buildQuantitySummary(item)} />
          <RecordCardMetricRow
            label="仓库名称"
            value={
              item.associatedOrderId
                ? `${item.warehouseName} · ${item.associatedOrderId}`
                : item.warehouseName
            }
          />
        </>
      }
      person={item.createByName}
      personOrg={item.createOrgName}
      time={item.createTime}
      actions={[
        { key: "detail", label: "查看详情", to: processingDetailRoute(item.id) },
        ...(isPending
          ? [
              {
                key: "complete",
                label: "完成加工",
                onClick: () => onComplete(item),
              },
              {
                key: "void",
                label: "作废",
                onClick: () => onVoid(item),
              },
            ]
          : []),
      ]}
    />
  )
}
