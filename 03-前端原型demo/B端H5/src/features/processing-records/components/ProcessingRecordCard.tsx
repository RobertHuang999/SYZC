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

/** 按 PC 列表的「计划 / 实际投入货物」口径汇总：首项名称 + 数量，多项补「等 N 种」 */
function summarizeInput(item: ProcessingRecord, mode: "plan" | "actual"): string {
  const entries = item.inputGroups
    .map((group) => {
      const qty = group.lines.reduce(
        (sum, line) => sum + (mode === "plan" ? line.planAmount : line.actualAmount ?? 0),
        0
      )
      return { name: group.goodsName, qty, unit: group.unit }
    })
    .filter((entry) => entry.qty > 0)
  if (entries.length === 0) return "—"
  const first = `${entries[0].name}：${formatQty(entries[0].qty)}${entries[0].unit}`
  return entries.length > 1 ? `${first} 等 ${entries.length} 种` : first
}

/** 按 PC 列表的「计划 / 实际产出货物」口径汇总 */
function summarizeOutput(item: ProcessingRecord, mode: "expected" | "actual"): string {
  const entries = item.outputItems
    .map((output) => ({
      name: output.goodsName,
      qty: mode === "expected" ? output.expectedQty : output.actualQty,
      unit: output.unit,
    }))
    .filter(
      (entry): entry is { name: string; qty: number; unit: string } =>
        typeof entry.qty === "number" && entry.qty > 0
    )
  if (entries.length === 0) return "—"
  const first = `${entries[0].name}：${formatQty(entries[0].qty)}${entries[0].unit}`
  return entries.length > 1 ? `${first} 等 ${entries.length} 项` : first
}

export function ProcessingRecordCard({
  item,
  onComplete,
  onVoid,
}: ProcessingRecordCardProps) {
  const status = PROCESSING_STATUS_MAP[item.status]
  const isPending = item.status === "PENDING_COMPLETION"
  const isCompleted = item.status === "COMPLETED"

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
          <RecordCardMetricRow label="加工日期" value={item.processingTime} />
          <RecordCardMetricRow label="仓库名称" value={item.warehouseName} />
          <RecordCardMetricRow
            label="关联单号"
            value={item.associatedOrderId || "—"}
          />
          <RecordCardMetricRow
            label="计划投入"
            value={summarizeInput(item, "plan")}
          />
          <RecordCardMetricRow
            label="实际投入"
            value={isCompleted ? summarizeInput(item, "actual") : "—"}
          />
          <RecordCardMetricRow
            label="计划产出"
            value={summarizeOutput(item, "expected")}
          />
          <RecordCardMetricRow
            label="实际产出"
            value={isCompleted ? summarizeOutput(item, "actual") : "—"}
          />
        </>
      }
      person={item.createByName}
      personOrg={item.createOrgName}
      time={item.createTime}
      timeLabel="制单时间"
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
