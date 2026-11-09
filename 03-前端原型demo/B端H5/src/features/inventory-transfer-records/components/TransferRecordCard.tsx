import type { MobileTransferRecord } from "../domain/types"
import { h5TransferRecordDetailPath } from "../domain/constants"
import { RecordCard, RecordCardMetricRow } from "@/shared/components/RecordCard"

interface TransferRecordCardProps {
  item: MobileTransferRecord
}

/** 转让记录卡：与入库/出库共用 RecordCard 五段式结构（见《02-移动端列表页设计与交互规范》4.2 节） */
export function TransferRecordCard({ item }: TransferRecordCardProps) {
  const goodsSummary =
    item.goodsList.length > 1
      ? `${item.goodsList[0].goodsName} 等 ${item.goodsList.length} 种`
      : item.goodsList[0].goodsName

  return (
    <RecordCard
      orderNo={item.id}
      detailTo={h5TransferRecordDetailPath(item.id)}
      typeLabel="货权转让"
      statusLabel="已通过"
      statusTone="emerald"
      ownerName={item.targetOwner.ownerName}
      ownerIdentifier={`受让方 · ${item.targetOwner.ownerIdentity}`}
      person={item.createByName}
      personOrg={item.createOrgName}
      time={item.transferTime || item.createTime}
      metrics={
        <>
          <RecordCardMetricRow
            label="出让方"
            value={item.sourceOwner.ownerName}
          />
          <RecordCardMetricRow label="转让货物" value={goodsSummary} />
          <RecordCardMetricRow
            label="转让数量"
            value={`${item.totalAmount.toLocaleString()} ${item.unit}`}
          />
          <RecordCardMetricRow label="监管仓库" value={item.warehouseName} />
        </>
      }
      actions={[
        {
          key: "detail",
          label: "查看详情",
          to: h5TransferRecordDetailPath(item.id),
        },
      ]}
    />
  )
}
