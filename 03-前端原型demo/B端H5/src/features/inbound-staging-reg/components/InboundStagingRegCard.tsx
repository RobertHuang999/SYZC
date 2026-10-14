import { Clock, User } from "lucide-react"
import { Link } from "react-router-dom"
import type { InboundStagingReg } from "@prototype/shared/inbound/inbound-staging.mock"
import { inboundStagingDetailPath } from "../domain/constants"
import { H5_CARD } from "@/shared/h5-ui-theme"

type Props = {
  row: InboundStagingReg
  onEdit?: (row: InboundStagingReg) => void
  onConvert?: (row: InboundStagingReg) => void
  onViewFormal?: (row: InboundStagingReg) => void
}

function statusBadge(status: InboundStagingReg["status"]) {
  if (status === "待补全") {
    return (
      <span className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-600">
        待补全
      </span>
    )
  }
  if (status === "已转正式") {
    return (
      <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-600">
        已转正式
      </span>
    )
  }
  return (
    <span className="rounded bg-gray-100 border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
      已作废
    </span>
  )
}

const actionLink =
  "cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700 active:opacity-75"

export function InboundStagingRegCard({
  row,
  onEdit,
  onConvert,
  onViewFormal,
}: Props) {
  const ownerFirstChar = row.ownerDisplay ? row.ownerDisplay.charAt(0) : "货"

  return (
    <div className={`${H5_CARD} mb-3 hover:border-blue-200 hover:shadow-sm`}>
      <div className="flex items-center justify-between border-b border-gray-100/80 bg-[#f8fafc]/80 px-3.5 py-2">
        <span className="text-xs font-medium text-gray-700">暂存·{row.inboundType}</span>
        {statusBadge(row.status)}
      </div>

      <div className="space-y-2.5 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-5 shrink-0 items-center justify-center rounded bg-blue-600 text-[11px] font-bold text-white">
              {ownerFirstChar}
            </div>
            <div className="min-w-0 truncate text-sm font-semibold text-gray-900">
              {row.ownerDisplay}
              {row.ownerTag ? (
                <span className="ml-1 text-xs font-medium text-gray-500">[{row.ownerTag}]</span>
              ) : null}
            </div>
          </div>
          {row.status === "待补全" && onConvert ? (
            <button type="button" className={`shrink-0 ${actionLink}`} onClick={() => onConvert(row)}>
              转正式
            </button>
          ) : null}
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-baseline justify-between">
            <span className="shrink-0 text-gray-500">登记单号</span>
            <Link
              to={inboundStagingDetailPath(row.id)}
              className="max-w-[65%] truncate pl-2 text-right font-medium text-blue-600"
            >
              {row.regNo}
            </Link>
          </div>
          {row.relatedOrderNo ? (
            <div className="flex items-baseline justify-between">
              <span className="shrink-0 text-gray-500">关联单号</span>
              <span className="max-w-[65%] truncate pl-2 text-right text-gray-900">
                {row.relatedOrderNo}
              </span>
            </div>
          ) : null}
          <div className="flex items-baseline justify-between">
            <span className="shrink-0 text-gray-500">仓库名称</span>
            <span className="truncate pl-2 text-right text-gray-900">{row.warehouseName}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="shrink-0 text-gray-500">货品摘要</span>
            <span className="max-w-[65%] line-clamp-2 pl-2 text-right text-sm leading-snug text-gray-900">
              {row.goodsSummary}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="shrink-0 text-gray-500">申报数量</span>
            <span className="pl-2 text-right font-medium text-gray-900">
              {row.declaredQty.toLocaleString()} {row.unit}
            </span>
          </div>
          {row.locationHint ? (
            <div className="flex items-baseline justify-between">
              <span className="shrink-0 text-gray-500">库位提示</span>
              <span className="pl-2 text-right text-gray-900">{row.locationHint}</span>
            </div>
          ) : null}
          {row.relatedFormalNo ? (
            <div className="flex items-baseline justify-between">
              <span className="shrink-0 text-gray-500">关联正式单</span>
              <span className="max-w-[65%] truncate pl-2 text-right font-medium text-emerald-700">
                {row.relatedFormalNo}
              </span>
            </div>
          ) : null}
        </div>

        <div className="space-y-1 border-t border-gray-100 pt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <User className="size-3 shrink-0 text-gray-400" />
            <span className="truncate">登记人: {row.registrant}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3 shrink-0 text-gray-400" />
            <span>登记时间: {row.registeredAt}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-4 pt-2 text-xs font-medium">
          {row.status === "待补全" && onEdit ? (
            <button type="button" className={actionLink} onClick={() => onEdit(row)}>
              编辑暂存
            </button>
          ) : null}
          {row.status === "已转正式" && row.relatedFormalNo && onViewFormal ? (
            <button type="button" className={actionLink} onClick={() => onViewFormal(row)}>
              查看正式单
            </button>
          ) : null}
          <Link to={inboundStagingDetailPath(row.id)} className={actionLink}>
            查看详情
          </Link>
        </div>
      </div>
    </div>
  )
}
