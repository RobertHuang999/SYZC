import { useState } from "react"
import type { MovingRecordItem } from "../domain/types"
import { MOVING_CHECK_STATUS_MAP, getMovingTypeText, h5MovingRecordDetailPath } from "../domain/constants"
import { MovingGoodsDetailModal } from "./MovingGoodsDetailModal"
import {
  RecordCard,
  RecordCardMetricRow,
  type RecordCardStatusTone,
} from "@/shared/components/RecordCard"

interface MovingRecordCardProps {
  item: MovingRecordItem
  onDownloadBill?: (item: MovingRecordItem) => void
  onDownloadHistory?: (item: MovingRecordItem) => void
}

const STATUS_TONE: Record<number, RecordCardStatusTone> = {
  1: "amber",
  2: "emerald",
  3: "rose",
  4: "slate",
}

const movingDetailRoute = (id: string) => h5MovingRecordDetailPath(id)

const movingDetailTabRoute = (id: string, tab: string) =>
  `${movingDetailRoute(id)}?tab=${tab}`

/** 移库记录卡：与入库/出库共用 RecordCard 五段式结构（见《02-移动端列表页设计与交互规范》4.2 节） */
export function MovingRecordCard({
  item,
  onDownloadBill,
  onDownloadHistory,
}: MovingRecordCardProps) {
  const [goodsSheetOpen, setGoodsSheetOpen] = useState(false)
  const typeConfig = getMovingTypeText(item)
  const statusConfig = item.checkStatus ? MOVING_CHECK_STATUS_MAP[item.checkStatus] : null

  return (
    <RecordCard
      orderNo={item.id}
      detailTo={movingDetailRoute(item.id)}
      typeLabel={typeConfig.text}
      statusLabel={statusConfig?.text ?? "已通过"}
      statusTone={item.checkStatus ? STATUS_TONE[item.checkStatus] ?? "emerald" : "emerald"}
      ownerName={item.ownerName}
      ownerIdentifier={item.ownerIdentity}
      person={item.createByName}
      personOrg={item.createOrgName}
      time={item.createTime}
      metrics={
        <>
          <RecordCardMetricRow label="仓库名称" value={item.repoNames} />
          <RecordCardMetricRow
            label="移库货品"
            value={item.goodsInfo}
            onClick={item.respOutStockInfoVoList.length > 1 ? () => setGoodsSheetOpen(true) : undefined}
          />
          <RecordCardMetricRow label="移库日期" value={item.transferTime || item.createTime} />
          <RecordCardMetricRow
            label="移库数量"
            value={`${item.amount}${item.unit ? ` ${item.unit}` : ""}`}
          />
        </>
      }
      actions={[
        {
          key: "doc",
          label: "单据下载",
          onClick: () => onDownloadBill?.(item),
        },
        {
          key: "docs",
          label: "资料管理",
          to: movingDetailTabRoute(item.id, "documents"),
        },
        {
          key: "detail",
          label: "查看详情",
          to: movingDetailRoute(item.id),
        },
        {
          key: "record",
          label: "下载记录",
          onClick: () => onDownloadHistory?.(item),
        },
      ]}
    >
      <MovingGoodsDetailModal
        open={goodsSheetOpen}
        onClose={() => setGoodsSheetOpen(false)}
        goodsList={item.respOutStockInfoVoList}
        transferId={item.id}
      />
    </RecordCard>
  )
}
