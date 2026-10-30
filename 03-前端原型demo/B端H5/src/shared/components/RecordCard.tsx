import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, ChevronRight, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { H5_PILL_PRIMARY, H5_PILL_SECONDARY } from "@/shared/h5-ui-theme"

/**
 * H5 台账记录卡（列表页统一结构，见《02-移动端列表页设计与交互规范》4.2 节）：
 * 头部（单号 + 类型 + 状态）→ 主体（名称 + 标识）→ 指标块 → 经办（制单人 / 时间）
 * → 操作行（一行最多 4 个胶囊，超出时第 4 个换成「更多操作」，点击向下展开）。
 * 入库记录与出库记录共用本组件，避免两套卡片漂移。
 */

export type RecordCardAction = {
  key: string
  label: string
  /** 路由跳转；与 onClick 二选一 */
  to?: string
  onClick?: () => void
}

export type RecordCardStatusTone = "emerald" | "amber" | "blue" | "rose" | "slate"

const STATUS_BADGE_CLASS: Record<RecordCardStatusTone, string> = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  slate: "border-slate-200 bg-slate-100 text-slate-600",
}

/** 类型胶囊用中性描边，不参与语义配色（语义色只留给状态） */
const TYPE_BADGE_CLASS = "border-[#232D39]/15 bg-[#232D39]/[0.03] text-[#232D39]/70"
/** 操作区一行最多放 4 个胶囊 */
const MAX_ACTIONS_PER_ROW = 4

type RecordCardProps = {
  /** 业务单号，展示在头部左侧 */
  orderNo: string
  /** 详情路由，头部单号可点 */
  detailTo: string
  /** 业务类型，如「普通入库」「质押出库」 */
  typeLabel: string
  /** 业务状态，如「已通过」「待审核」 */
  statusLabel: string
  statusTone?: RecordCardStatusTone
  ownerName: string
  ownerIdentifier?: string
  /** 指标块内容，用 RecordCardMetricRow 组装 */
  metrics: ReactNode
  /** 制单人姓名 */
  person: string
  /** 制单人所属组织（可选，跟在姓名后） */
  personOrg?: string
  /** 操作时间 */
  time: string
  /** 操作列表：最多 3 个直出，第 4 个起进「更多」 */
  actions: RecordCardAction[]
  /** 头部右侧的提醒图标等 */
  alert?: ReactNode
  /** 卡片内的弹层（货品清单、资料管理、货物明细等） */
  children?: ReactNode
}

export function RecordCard({
  orderNo,
  detailTo,
  typeLabel,
  statusLabel,
  statusTone = "emerald",
  ownerName,
  ownerIdentifier,
  metrics,
  person,
  personOrg,
  time,
  actions,
  alert,
  children,
}: RecordCardProps) {
  const [actionsExpanded, setActionsExpanded] = useState(false)
  const hasOverflow = actions.length > MAX_ACTIONS_PER_ROW
  // 超出时：前 3 个直出，第 4 个位置让给「更多操作」
  const visibleActions = hasOverflow
    ? actions.slice(0, MAX_ACTIONS_PER_ROW - 1)
    : actions
  const hiddenActions = hasOverflow
    ? actions.slice(MAX_ACTIONS_PER_ROW - 1)
    : []

  const renderAction = (action: RecordCardAction) => {
    // 跳转类（查看详情）用主色胶囊，其余用中性胶囊
    const className = action.to ? H5_PILL_PRIMARY : H5_PILL_SECONDARY
    return action.to ? (
      <Link key={action.key} to={action.to} className={className}>
        {action.label}
      </Link>
    ) : (
      <button
        key={action.key}
        type="button"
        onClick={action.onClick}
        className={className}
      >
        {action.label}
      </button>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#232D39]/5 bg-white shadow-sm transition-all active:scale-[0.99]">
      {/* 头部：单号 + 类型 / 状态胶囊 */}
      <div className="flex items-center justify-between gap-2 border-b border-[#232D39]/5 bg-[#232D39]/[0.02] px-3.5 py-2.5">
        <Link
          to={detailTo}
          className="min-w-0 truncate text-xs text-[#232D39]/60"
        >
          {orderNo}
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          {alert}
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-medium",
              TYPE_BADGE_CLASS
            )}
          >
            {typeLabel}
          </span>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-medium",
              STATUS_BADGE_CLASS[statusTone]
            )}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* 主体：首字图标 + 名称 + 标识 */}
      <div className="flex items-start gap-2.5 px-3.5 pb-2 pt-3">
        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded bg-blue-600 text-[11px] font-bold text-white shadow-xs">
          {ownerName ? ownerName.charAt(0) : "货"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold leading-snug text-[#232D39]">
            {ownerName}
          </div>
          {ownerIdentifier ? (
            <div className="mt-0.5 truncate text-xs text-[#232D39]/60">
              {ownerIdentifier}
            </div>
          ) : null}
        </div>
      </div>

      {/* 指标块 */}
      <div className="mx-3.5 space-y-2 rounded-lg bg-[#232D39]/5 p-3 text-xs">
        {metrics}
      </div>

      {/* 经办信息 */}
      <div className="space-y-1 px-3.5 pb-1 pt-2 text-xs">
        <div className="flex items-center justify-between gap-3">
          <span className="flex shrink-0 items-center gap-1 text-[#232D39]/60">
            <User className="size-3 text-[#232D39]/40" />
            制单人
          </span>
          <span className="min-w-0 truncate text-right font-medium text-[#232D39]/80">
            {personOrg ? `${person}（${personOrg}）` : person}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex shrink-0 items-center gap-1 text-[#232D39]/60">
            <Clock className="size-3 text-[#232D39]/40" />
            操作时间
          </span>
          <span className="truncate text-right text-[#232D39]/70">{time}</span>
        </div>
      </div>

      {/* 操作行：一行最多 4 个胶囊；超出时第 4 个换成「更多操作」，点击向下展开全部 */}
      <div className="mx-3.5 mt-2 space-y-2 pb-3.5">
        <div className="flex items-center justify-end gap-1.5">
          {visibleActions.map(renderAction)}
          {hasOverflow ? (
            <button
              type="button"
              aria-expanded={actionsExpanded}
              onClick={() => setActionsExpanded((open) => !open)}
              className={cn(H5_PILL_SECONDARY, "gap-0.5")}
            >
              {actionsExpanded ? "收起" : "更多操作"}
              <ChevronDown
                className={cn(
                  "size-3 transition-transform",
                  actionsExpanded && "rotate-180"
                )}
              />
            </button>
          ) : null}
        </div>

        {actionsExpanded && hiddenActions.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            {hiddenActions.map(renderAction)}
          </div>
        ) : null}
      </div>

      {children}
    </div>
  )
}

/** 指标块里的一行：左字段名、右值；给 onClick 时整行可点并带 `›` */
export function RecordCardMetricRow({
  label,
  value,
  onClick,
}: {
  label: string
  value: ReactNode
  onClick?: () => void
}) {
  if (onClick) {
    return (
      <div className="flex items-baseline justify-between gap-3">
        <span className="shrink-0 text-[#232D39]/60">{label}</span>
        <button
          type="button"
          onClick={onClick}
          className="flex min-w-0 items-center gap-0.5 text-right text-[#232D39] cursor-pointer active:opacity-70"
        >
          <span className="truncate">{value}</span>
          <ChevronRight className="size-3.5 shrink-0 text-[#232D39]/40" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="shrink-0 text-[#232D39]/60">{label}</span>
      <span className="min-w-0 truncate text-right text-[#232D39]">{value}</span>
    </div>
  )
}
