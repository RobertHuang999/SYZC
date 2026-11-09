import type { MobileTransferRecord } from "../domain/types"
import { h5TransferRecordDetailPath } from "../domain/constants"
import { RecordCard, RecordCardMetricRow } from "@/shared/components/RecordCard"

interface TransferRecordCardProps {
  item: MobileTransferRecord
}

/**
 * 转让记录卡：与入库/出库共用 RecordCard 五段式结构。
 * 字段按 PC 列表 10 列口径：转让人为主主体，接收人、转让时间、数量、仓库、货物放指标块；
 * 操作仅【查看详情】（PC R07 明确不设下载入口）。
 */
export function TransferRecordCard({ item }: TransferRecordCardProps) {
  return (
    <RecordCard
      orderNo={item.id}
      detailTo={h5TransferRecordDetailPath(item.id)}
      typeLabel="货权转让"
      statusLabel="已通过"
      statusTone="emerald"
      ownerName={item.sourceOwner.ownerName}
      ownerIdentifier={item.sourceOwner.ownerIdentity}
      person={item.createByName}
      personOrg={item.createOrgName}
      time={item.createTime}
      timeLabel="制单时间"
      metrics={
        <>
          <RecordCardMetricRow label="转让时间" value={item.assignTime} />
          <RecordCardMetricRow
            label="转让数量"
            value={`${item.amount.toLocaleString("zh-CN", { maximumFractionDigits: 3 })} ${item.unit}`}
          />
          <RecordCardMetricRow
            label="接收人"
            value={`${item.targetOwner.ownerName}（${item.targetOwner.ownerIdentity}）`}
          />
          <RecordCardMetricRow label="仓库名称" value={item.warehouseName} />
          <RecordCardMetricRow label="货物名称" value={item.goodsSummaryText} />
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
