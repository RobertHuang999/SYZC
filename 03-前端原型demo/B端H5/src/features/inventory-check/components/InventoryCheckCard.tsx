import { RecordCard, RecordCardMetricRow } from "@/shared/components/RecordCard"
import {
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

  return (
    <RecordCard
      orderNo={item.checkNo}
      detailTo={checkDetailRoute(item.id)}
      typeLabel={CHECK_TYPE_LABEL[item.checkType]}
      statusLabel={statusConfig.label}
      statusTone={statusConfig.tone}
      ownerName={item.taskName}
      ownerIdentifier={item.warehouseName}
      metrics={
        <>
          <RecordCardMetricRow label="盘点模式" value={
            item.checkMode === "SINGLE_PERSON" ? "单人独立盘点" : "多人协作盘点"
          } />
          <RecordCardMetricRow
            label="盘点时间"
            value={`${item.startDate} 至 ${item.endDate}`}
          />
          <RecordCardMetricRow label="实际盘点人" value={item.actualUsers || "——"} />
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
        </>
      }
      person={item.creatorName.split(" / ")[0]}
      personOrg={item.creatorName.split(" / ")[1]}
      time={item.createdTime}
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
