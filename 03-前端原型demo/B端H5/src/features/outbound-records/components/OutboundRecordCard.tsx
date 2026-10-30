import { useState } from "react"
import { Package } from "lucide-react"
import type { MobileOutboundRecord } from "../domain/types"
import { outboundDetailRoute } from "../domain/constants"
import { RecordCard, RecordCardMetricRow } from "@/shared/components/RecordCard"

interface OutboundRecordCardProps {
  item: MobileOutboundRecord
  onDownload: (kind: "excel" | "pdf", item: MobileOutboundRecord) => void
}

export function OutboundRecordCard({ item, onDownload }: OutboundRecordCardProps) {
  const [goodsDetailOpen, setGoodsDetailOpen] = useState(false)
  return (
    <RecordCard
      orderNo={item.orderNo}
      detailTo={outboundDetailRoute(item.id, "goods")}
      typeLabel={item.type}
      statusLabel={item.status}
      statusTone="emerald"
      ownerName={item.ownerName}
      ownerIdentifier={item.ownerIdentifier}
      person={item.createdByName}
      personOrg={item.createdByOrg}
      time={item.createTime || item.outboundTime}
      metrics={
        <>
          <RecordCardMetricRow
            label="货物名称"
            value={item.goodsSummary}
            onClick={() => setGoodsDetailOpen(true)}
          />
          <RecordCardMetricRow
            label="出库数量"
            value={`${item.totalAmount.toLocaleString()} ${item.amountUnit}`}
          />
          <RecordCardMetricRow
            label="仓库名称"
            value={
              item.relatedNo && item.relatedNo !== "—"
                ? `${item.warehouseName} · ${item.relatedNo}`
                : item.warehouseName
            }
          />
        </>
      }
      actions={[
        {
          key: "doc",
          label: "单据下载",
          onClick: () => onDownload("pdf", item),
        },
        {
          key: "docs",
          label: "资料管理",
          to: outboundDetailRoute(item.id, "documents"),
        },
        {
          key: "detail",
          label: "查看详情",
          to: outboundDetailRoute(item.id, "goods"),
        },
        {
          key: "record",
          label: "下载记录",
          onClick: () => onDownload("excel", item),
        },
      ]}
    >
      {/* 货物出库明细弹窗 */}
      {goodsDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#232D39]/10 pb-2">
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#232D39]">
                <Package className="size-4 text-blue-600" />
                <span>货物出库明细</span>
              </div>
              <button
                type="button"
                className="text-xs text-[#232D39]/50"
                onClick={() => setGoodsDetailOpen(false)}
              >
                关闭
              </button>
            </div>
            <div className="py-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#232D39]/60">品名规格:</span>
                <span className="font-semibold text-[#232D39] text-right">
                  {item.goodsSummary}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#232D39]/60">出库数量:</span>
                <span className="font-bold text-[#232D39]">
                  {item.totalAmount.toLocaleString()} {item.amountUnit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#232D39]/60">出库类型:</span>
                <span>{item.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#232D39]/60">监管仓库:</span>
                <span>{item.warehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#232D39]/60">提货状态:</span>
                <span className="text-emerald-600 font-medium">
                  {item.pickCompleted ? "已完成提货出库" : "待提货司机核验"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGoodsDetailOpen(false)}
              className="w-full rounded-xl bg-blue-600 py-2 text-xs font-medium text-white active:bg-blue-700"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

    </RecordCard>
  )
}
