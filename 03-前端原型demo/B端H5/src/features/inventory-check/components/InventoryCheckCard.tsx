import { RecordCard, RecordCardMetricRow } from "@/shared/components/RecordCard"
import {
  ANOMALY_HANDLING_MAP,
  CHECK_STATUS_MAP,
  CHECK_TYPE_LABEL,
  checkDetailRoute,
} from "../domain/constants"
import type { InventoryCheckRecord } from "../domain/types"

type InventoryCheckCardProps = {
  item: InventoryCheckRecord
  canCheck: boolean
  canRevoke: boolean
  onCheck: (item: InventoryCheckRecord) => void
  onRevoke: (item: InventoryCheckRecord) => void
}

export function InventoryCheckCard({
  item,
  canCheck,
  canRevoke,
  onCheck,
  onRevoke,
}: InventoryCheckCardProps) {
  const statusConfig = CHECK_STATUS_MAP[item.status]
  const anomalyConfig = ANOMALY_HANDLING_MAP[item.anomalyHandling]

  return (
    <RecordCard
      orderNo={item.checkNo}
      detailTo={checkDetailRoute(item.id)}
      typeLabel={CHECK_TYPE_LABEL[item.checkType]}
      statusLabel={statusConfig.label}
      statusTone={statusConfig.tone}
      ownerName={item.taskName}
      metrics={
        <>
          <RecordCardMetricRow
            label="盘点时间"
            value={`${item.startDate} 至 ${item.endDate}`}
          />
          <RecordCardMetricRow label="盘点仓库" value={item.warehouseName} />
          <RecordCardMetricRow label="实际盘点人员" value={item.actualUsers || "——"} />
          <RecordCardMetricRow
            label="盘点结果"
            value={
              <span
                className={
                  item.result === "ABNORMAL"
                    ? "font-semibold text-rose-600"
                    : item.result === "NORMAL"
                      ? "font-medium text-emerald-600"
                      : "text-[#232D39]/40"
                }
              >
                {item.result === "ABNORMAL"
                  ? "异常"
                  : item.result === "NORMAL"
                    ? "正常"
                    : "——"}
              </span>
            }
          />
          <RecordCardMetricRow
            label="异常处理"
            value={
              <span
                className={
                  item.anomalyHandling === "UNRESOLVED"
                    ? "font-medium text-amber-600"
                    : item.anomalyHandling === "RESOLVED"
                      ? "font-medium text-emerald-600"
                      : "text-[#232D39]/40"
                }
              >
                {anomalyConfig.label}
              </span>
            }
          />
        </>
      }
      person={item.creatorName.split(" / ")[0]}
      personOrg={item.creatorName.split(" / ")[1]}
      time={item.createdTime}
      timeLabel="制单时间"
      actions={[
        { key: "detail", label: "查看详情", to: checkDetailRoute(item.id) },
        ...(canCheck
          ? [
              {
                key: "check",
                label: "盘点",
                onClick: () => onCheck(item),
              },
            ]
          : []),
        ...(canRevoke
          ? [
              {
                key: "revoke",
                label: "撤销",
                onClick: () => onRevoke(item),
              },
            ]
          : []),
      ]}
    />
  )
}
