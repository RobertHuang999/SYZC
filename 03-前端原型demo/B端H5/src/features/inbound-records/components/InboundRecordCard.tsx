import { useState } from "react"
import { ChevronRight, FileCheck, FileText, RotateCcw, User, Clock, Package } from "lucide-react"
import { Link } from "react-router-dom"
import { FLOW_STATUS_LABEL, inboundDetailRoute } from "../domain/constants"
import type { MobileInboundRecord } from "../domain/types"

const STATUS_CLASS: Record<MobileInboundRecord["flowStatus"], string> = {
  PENDING: "bg-orange-50 text-orange-600 border-orange-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
  WITHDRAWN: "bg-gray-100 text-gray-600 border-gray-200",
}

type Props = {
  item: MobileInboundRecord
  onDownload?: (kind: "excel" | "pdf", item: MobileInboundRecord) => void
  onRevoke?: (item: MobileInboundRecord) => void
}

export function InboundRecordCard({ item, onDownload, onRevoke }: Props) {
  const [goodsDetailOpen, setGoodsDetailOpen] = useState(false)

  return (
    <div className="rounded-xl border border-[#232D39]/5 bg-white shadow-sm overflow-hidden mb-3">
      {/* 头部：单号与状态胶囊 (对齐源码 store-record.vue) */}
      <div className="bg-[#232D39]/[0.02] px-3.5 py-2.5 flex items-center justify-between border-b border-[#232D39]/5">
        <span className="font-mono text-xs text-[#232D39]/60">
          入库编号：{item.orderNo}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="rounded-full border border-[#232D39]/10 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-[#232D39]/70">
            {item.inboundType}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASS[item.flowStatus]}`}
          >
            {FLOW_STATUS_LABEL[item.flowStatus]}
          </span>
        </div>
      </div>

      {/* 货主主体信息 */}
      <div className="px-3.5 pt-3 pb-2 flex items-start gap-2.5">
        <div className="size-5 rounded flex items-center justify-center bg-orange-500 text-white text-[11px] font-bold shrink-0 mt-0.5 shadow-xs">
          入
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-[#232D39] leading-snug truncate">
            {item.ownerName}
          </div>
          <div className="font-mono text-xs text-[#232D39]/60 mt-0.5">
            {item.ownerIdentifierMasked}
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
              className="text-orange-600 font-medium text-xs hover:underline cursor-pointer shrink-0"
            >
              详细
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[#232D39]">
          <span className="text-[#232D39]/60">入库数量</span>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-orange-600 text-sm font-mono">
              {item.quantityLabel}
            </span>
            <button
              type="button"
              onClick={() => setGoodsDetailOpen(true)}
              className="text-orange-600 font-medium text-xs hover:underline cursor-pointer shrink-0"
            >
              详细
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[#232D39]">
          <span className="text-[#232D39]/60">仓库名称</span>
          <span className="text-[#232D39] text-right truncate max-w-[200px]">
            {item.warehouseName}
          </span>
        </div>
      </div>

      {/* 制单人与操作时间 */}
      <div className="px-3.5 pt-2 pb-1 text-xs text-[#232D39]/60 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[#232D39]/60">
            <User className="size-3 text-[#232D39]/40" />
            <span>制单人</span>
          </div>
          <span className="text-[#232D39]/80 font-medium">
            赵监管（仓储监管二部）
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[#232D39]/60">
            <Clock className="size-3 text-[#232D39]/40" />
            <span>制单时间</span>
          </div>
          <span className="font-mono text-[#232D39]/70">{item.createdAt}</span>
        </div>
      </div>

      {/* 快捷操作区 */}
      <div className="mt-2 border-t border-[#232D39]/5 px-3.5 py-2.5 flex items-center justify-end gap-2">
        {item.flowStatus === "APPROVED" && onDownload && (
          <>
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-[#232D39]/20 px-3 py-1 text-xs font-medium text-[#232D39]/80 active:bg-gray-50 cursor-pointer"
              onClick={() => onDownload("excel", item)}
            >
              <FileCheck className="size-3 text-[#232D39]/50" />
              下载记录
            </button>
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border border-[#232D39]/20 px-3 py-1 text-xs font-medium text-[#232D39]/80 active:bg-gray-50 cursor-pointer"
              onClick={() => onDownload("pdf", item)}
            >
              <FileText className="size-3 text-[#232D39]/50" />
              单据下载
            </button>
          </>
        )}

        {item.flowStatus === "PROCESSING" && onRevoke && (
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50/50 px-3 py-1 text-xs font-medium text-red-600 active:bg-red-100 cursor-pointer"
            onClick={() => onRevoke(item)}
          >
            <RotateCcw className="size-3" />
            撤销申请
          </button>
        )}

        <Link
          to={inboundDetailRoute(item.id)}
          className="flex items-center gap-0.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600 active:bg-orange-100 cursor-pointer"
        >
          <span>查看详情</span>
          <ChevronRight className="size-3" />
        </Link>
      </div>

      {/* 货物详细弹窗 */}
      {goodsDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#232D39]/10 pb-2">
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#232D39]">
                <Package className="size-4 text-orange-600" />
                <span>货物入库明细</span>
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
                <span className="text-[#232D39]/60">入库数量:</span>
                <span className="font-bold text-orange-600">
                  {item.quantityLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#232D39]/60">入库类型:</span>
                <span>{item.inboundType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#232D39]/60">监管仓库:</span>
                <span>{item.warehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#232D39]/60">审批状态:</span>
                <span className="text-emerald-600 font-medium">
                  {FLOW_STATUS_LABEL[item.flowStatus]}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGoodsDetailOpen(false)}
              className="w-full rounded-xl bg-orange-600 py-2 text-xs font-medium text-white active:bg-orange-700"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
