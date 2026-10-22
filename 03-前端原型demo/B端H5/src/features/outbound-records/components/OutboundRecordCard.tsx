import { useState } from "react"
import { User, Clock, Package } from "lucide-react"
import { Link } from "react-router-dom"
import type { MobileOutboundRecord } from "../domain/types"
import { DocumentManagementSheet } from "@/shared/document-management"

interface OutboundRecordCardProps {
  item: MobileOutboundRecord
  onDownload: (kind: "excel" | "pdf", item: MobileOutboundRecord) => void
}

const TYPE_BADGE_CLASS: Record<string, string> = {
  质押出库: "bg-blue-50 text-blue-700 border-blue-200",
  抵押出库: "bg-indigo-50 text-indigo-700 border-indigo-200",
  仓单出库: "bg-purple-50 text-purple-700 border-purple-200",
  普通出库: "bg-emerald-50 text-emerald-700 border-emerald-200",
  移库出库: "bg-amber-50 text-amber-700 border-amber-200",
  转让出库: "bg-cyan-50 text-cyan-700 border-cyan-200",
}

export function OutboundRecordCard({ item, onDownload }: OutboundRecordCardProps) {
  const [goodsDetailOpen, setGoodsDetailOpen] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const typeBadgeClass =
    TYPE_BADGE_CLASS[item.type] || "bg-gray-50 text-gray-700 border-gray-200"

  return (
    <div className="rounded-xl border border-[#232D39]/5 bg-white shadow-sm overflow-hidden mb-3">
      {/* 头部：单号与出库类型/状态胶囊 (对齐源码 record-item.vue) */}
      <div className="bg-[#232D39]/[0.02] px-3.5 py-2.5 flex items-center justify-between border-b border-[#232D39]/5">
        <span className="text-xs text-[#232D39]/60">
          出库编号：{item.orderNo}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${typeBadgeClass}`}
          >
            {item.type}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            已通过
          </span>
        </div>
      </div>

      {/* 货主主体信息 */}
      <div className="px-3.5 pt-3 pb-2 flex items-start gap-2.5">
        <div className="size-5 rounded flex items-center justify-center bg-blue-600 text-white text-[11px] font-bold shrink-0 mt-0.5 shadow-xs">
          出
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-[#232D39] leading-snug truncate">
            {item.ownerName}
          </div>
          <div className="text-xs text-[#232D39]/60 mt-0.5">
            {item.ownerIdentifier}
          </div>
        </div>
      </div>

      {/* 主体核心指标：浅灰底背景块 (对齐 02 规范与源码 info-view) */}
      <div className="mx-3.5 p-3 rounded-lg bg-[#232D39]/5 space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#232D39]">
          <span className="text-[#232D39]/60">货物名称</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-medium truncate max-w-[180px] text-[#232D39]">
              {item.goodsSummary}
            </span>
            <button
              type="button"
              onClick={() => setGoodsDetailOpen(true)}
              className="text-blue-600 font-medium text-xs hover:underline cursor-pointer shrink-0"
            >
              详细
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[#232D39]">
          <span className="text-[#232D39]/60">出库数量</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-blue-600 text-sm">
              {item.totalAmount.toLocaleString()} {item.amountUnit}
            </span>
            <button
              type="button"
              onClick={() => setGoodsDetailOpen(true)}
              className="text-blue-600 font-medium text-xs hover:underline cursor-pointer shrink-0"
            >
              详细
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[#232D39]">
          <span className="text-[#232D39]/60">仓库名称</span>
          <span className="text-[#232D39] text-right truncate max-w-[200px]">
            {item.warehouseName}
            {item.relatedNo && item.relatedNo !== "—" ? ` · ${item.relatedNo}` : ""}
          </span>
        </div>
      </div>

      {/* 制单人与操作时间 (对齐源码 item-person) */}
      <div className="px-3.5 pt-2 pb-1 text-xs text-[#232D39]/60 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[#232D39]/60">
            <User className="size-3 text-[#232D39]/40" />
            <span>制单人</span>
          </div>
          <span className="text-[#232D39]/80 font-medium">
            李监管（现场监管一部）
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[#232D39]/60">
            <Clock className="size-3 text-[#232D39]/40" />
            <span>操作时间</span>
          </div>
          <span className="text-[#232D39]/70">
            {item.createTime || item.outboundTime}
          </span>
        </div>
      </div>

      {/* 快捷操作区：与入库记录卡片一致，纯文字操作不打边框 */}
      <div className="mx-3.5 mt-2 pb-3.5 flex items-center justify-end gap-4 text-xs font-medium">
        <button
          type="button"
          className="cursor-pointer text-blue-600 active:opacity-75"
          onClick={() => onDownload("excel", item)}
        >
          下载记录
        </button>
        <button
          type="button"
          className="cursor-pointer text-blue-600 active:opacity-75"
          onClick={() => onDownload("pdf", item)}
        >
          单据下载
        </button>
        <button
          type="button"
          className="cursor-pointer text-blue-600 active:opacity-75"
          onClick={() => setDocsOpen(true)}
        >
          资料管理
        </button>
        <Link
          to={`/m/workspace/outbound-records/${item.id}`}
          className="text-blue-600 active:opacity-75"
        >
          查看详情
        </Link>
      </div>

      {/* 货物详细弹窗 (对齐源码 goods-detail) */}
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
                <span className="font-bold text-blue-600">
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

      <DocumentManagementSheet
        open={docsOpen}
        orderNo={item.orderNo}
        orderType="outbound"
        ownerName={item.ownerName}
        warehouseName={item.warehouseName}
        onClose={() => setDocsOpen(false)}
      />
    </div>
  )
}
