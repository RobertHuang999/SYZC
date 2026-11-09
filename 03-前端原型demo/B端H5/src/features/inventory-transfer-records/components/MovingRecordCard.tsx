import type { MovingRecordItem } from "../domain/types"
import { h5MovingRecordDetailPath } from "../domain/constants"
import { RecordCard, RecordCardMetricRow } from "@/shared/components/RecordCard"

interface MovingRecordCardProps {
  item: MovingRecordItem
}

/** 移库记录卡：与入库/出库共用 RecordCard 五段式；字段与 PC 移库台账一致 */
export function MovingRecordCard({ item }: MovingRecordCardProps) {
  return (
    <RecordCard
      orderNo={item.id}
      detailTo={h5MovingRecordDetailPath(item.id)}
      typeLabel={item.moveType}
      statusLabel="已通过"
      statusTone="emerald"
      ownerName={item.ownerName}
      ownerIdentifier={item.ownerIdentifier}
      person={item.creatorName}
      personOrg={item.creatorOrg}
      time={item.createTime}
      timeLabel="制单时间"
      metrics={
        <>
          <RecordCardMetricRow label="移库时间" value={item.moveTime} />
          <RecordCardMetricRow label="仓库名称" value={item.warehouseName} />
          <RecordCardMetricRow label="货物名称" value={item.goodsNameSummary} />
          <RecordCardMetricRow
            label="移库数量"
            value={`${item.totalQty.toLocaleString("zh-CN", { maximumFractionDigits: 4 })} ${item.unit}`}
          />
          {item.relatedNo ? (
            <RecordCardMetricRow label="关联单号" value={item.relatedNo} />
          ) : null}
        </>
      }
      actions={[
        {
          key: "detail",
          label: "查看详情",
          to: h5MovingRecordDetailPath(item.id),
        },
      ]}
    />
  )
}
