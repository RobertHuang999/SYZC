import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { inboundDetailRoute, FLOW_STATUS_LABEL } from "../domain/constants"
import type { MobileInboundRecord } from "../domain/types"
import { MobileGoodsNamesSheet } from "./MobileGoodsNamesSheet"
import {
  RecordCard,
  RecordCardMetricRow,
  type RecordCardStatusTone,
} from "@/shared/components/RecordCard"

type Props = {
  item: MobileInboundRecord
  onDownload?: (kind: "excel" | "pdf", item: MobileInboundRecord) => void
}

/** 流水状态 → 语义色（见 05 第 3 节） */
const STATUS_TONE: Record<MobileInboundRecord["flowStatus"], RecordCardStatusTone> = {
  PENDING: "amber",
  PROCESSING: "blue",
  APPROVED: "emerald",
  REJECTED: "rose",
  WITHDRAWN: "slate",
}

export function InboundRecordCard({ item, onDownload }: Props) {
  const [goodsSheetOpen, setGoodsSheetOpen] = useState(false)
  const multiGoods = item.goodsNames.length > 1
  // creatorDisplay 形如「张三(森云监管服务有限公司)」
  const creatorMatch = item.creatorDisplay.match(/^(.+?)\((.+)\)$/)

  return (
    <RecordCard
      orderNo={item.orderNo}
      detailTo={inboundDetailRoute(item.id, "goods")}
      typeLabel={item.inboundType}
      statusLabel={FLOW_STATUS_LABEL[item.flowStatus]}
      statusTone={STATUS_TONE[item.flowStatus]}
      ownerName={item.ownerName}
      ownerIdentifier={item.ownerIdentifierMasked}
      person={creatorMatch?.[1] ?? item.creatorDisplay}
      personOrg={creatorMatch?.[2]}
      time={item.createdAt}
      alert={
        item.hasUnprintedQrCode ? (
          <span className="flex items-center text-amber-500" title="未打印二维码">
            <AlertCircle className="size-4 stroke-[2.2]" />
          </span>
        ) : null
      }
      metrics={
        <>
          <RecordCardMetricRow label="仓库名称" value={item.warehouseName} />
          <RecordCardMetricRow
            label="入库货品"
            value={item.goodsSummary}
            onClick={multiGoods ? () => setGoodsSheetOpen(true) : undefined}
          />
          <RecordCardMetricRow label="入库日期" value={item.inboundDate} />
          <RecordCardMetricRow
            label="入库数量"
            value={`${item.quantityLabel}${item.unit ? ` ${item.unit}` : ""}`}
          />
        </>
      }
      actions={[
        {
          key: "doc",
          label: "单据下载",
          onClick: () => onDownload?.("pdf", item),
        },
        {
          key: "docs",
          label: "资料管理",
          to: inboundDetailRoute(item.id, "documents"),
        },
        {
          key: "detail",
          label: "查看详情",
          to: inboundDetailRoute(item.id, "goods"),
        },
        {
          key: "record",
          label: "下载记录",
          onClick: () => onDownload?.("excel", item),
        },
      ]}
    >
      <MobileGoodsNamesSheet
        open={goodsSheetOpen}
        orderNo={item.orderNo}
        goodsNames={item.goodsNames}
        onClose={() => setGoodsSheetOpen(false)}
      />

    </RecordCard>
  )
}
