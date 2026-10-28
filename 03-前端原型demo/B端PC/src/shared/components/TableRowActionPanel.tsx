import { type ComponentType, type CSSProperties, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

/** 每格按 4 个汉字宽；单行最多 3 列；最多 9 个直出，超出收入「更多」 */
export const TABLE_ROW_ACTION_MAX_COLS = 3
export const TABLE_ROW_ACTION_SLOT_CH = 4
export const TABLE_ROW_ACTION_MAX_INLINE = 9
const OVERFLOW_KEEP_INLINE = 8

/** 14px 正文下 4 个汉字约 56px，略留余量避免「追加角色」等贴边 */
export const TABLE_ROW_ACTION_SLOT_PX = 58
export const TABLE_ROW_ACTION_GAP_X_PX = 10
export const TABLE_ROW_ACTION_GAP_Y_PX = 8
export const TABLE_ROW_ACTION_ROW_MIN_H_PX = 28

export function panelWidthForActionCols(cols: number): number {
  const safeCols = Math.max(1, Math.min(TABLE_ROW_ACTION_MAX_COLS, cols))
  return (
    TABLE_ROW_ACTION_SLOT_PX * safeCols +
    TABLE_ROW_ACTION_GAP_X_PX * Math.max(0, safeCols - 1)
  )
}

/** 三列满宽时的面板宽度（操作列 sticky 区按此预留） */
export const TABLE_ROW_ACTION_PANEL_WIDTH_PX = panelWidthForActionCols(TABLE_ROW_ACTION_MAX_COLS)

/** 操作列满宽（3 列布局 + px-3 内边距） */
export const TABLE_ROW_ACTION_COL_TOTAL_PX = TABLE_ROW_ACTION_PANEL_WIDTH_PX + 24

/** 2×2 等紧凑布局 + px-2 内边距（合作方档案等 4 钮场景） */
export const TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX =
  panelWidthForActionCols(2) + 16

/**
 * 按单元格数量决定列数，从而控制换行：
 * 4 → 2×2；5 → 3+2；6 → 3×2；7~9 → 每行最多 3 列
 */
export function resolveActionGridCols(cellCount: number): number {
  if (cellCount <= 1) return 1
  if (cellCount === 2) return 2
  if (cellCount === 3) return 3
  if (cellCount === 4) return 2
  return TABLE_ROW_ACTION_MAX_COLS
}

export const TABLE_ROW_ACTION_PANEL_WIDTH_CLASS = cn(
  "min-w-[var(--table-row-action-panel-w)] max-w-[var(--table-row-action-panel-w)] w-[var(--table-row-action-panel-w)]"
)

export type TableRowActionTone = "primary" | "amber" | "danger"

export type TableRowActionItem = {
  key: string
  label: string
  title?: string
  tone?: TableRowActionTone
  onClick?: () => void
  to?: string
  icon?: ComponentType<{ className?: string }>
  isPlaceholder?: boolean
  /** 置灰禁用：仍展示文案，鼠标悬停可见 title 说明（浏览器对 disabled 按钮不触发悬浮，故用外层 span 承载） */
  disabled?: boolean
}

const toneClass: Record<TableRowActionTone, string> = {
  primary: "text-primary hover:text-primary",
  amber: "font-normal text-amber-600 hover:text-amber-700",
  danger: "text-destructive hover:text-destructive",
}

const actionControlClass = (tone: TableRowActionTone = "primary") =>
  cn(
    "inline-flex min-h-[var(--table-row-action-row-h)] w-full items-center justify-center px-0 text-sm font-normal leading-none underline-offset-4 hover:underline",
    toneClass[tone]
  )

function ActionControl({ item }: { item: TableRowActionItem }) {
  if (item.isPlaceholder) {
    return (
      <span className="text-sm font-normal text-muted-foreground/35 select-none" aria-hidden="true">
        {item.label || "——"}
      </span>
    )
  }
  const className = actionControlClass(item.tone)
  const displayTitle = item.title ?? item.label
  if (item.disabled) {
    return (
      <span
        className="inline-flex min-h-[var(--table-row-action-row-h)] w-full cursor-not-allowed items-center justify-center text-sm font-normal leading-none text-muted-foreground/40"
        title={displayTitle}
        aria-disabled="true"
      >
        <span className="block max-w-full truncate text-center">{item.label}</span>
      </span>
    )
  }
  if (item.to) {
    return (
      <Link to={item.to} className={className} title={displayTitle}>
        <span className="block max-w-full truncate text-center">{item.label}</span>
      </Link>
    )
  }
  return (
    <Button
      type="button"
      variant="link"
      className={className}
      title={displayTitle}
      onClick={item.onClick}
    >
      <span className="block max-w-full truncate text-center">{item.label}</span>
    </Button>
  )
}

function OverflowMenuItem({ item }: { item: TableRowActionItem }) {
  const Icon = item.icon
  const rowClass = cn(
    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
    item.tone === "danger" ? "text-destructive" : "text-foreground"
  )

  const content = (
    <>
      {Icon ? <Icon className="size-4 shrink-0 opacity-80" /> : null}
      <span className="truncate">{item.label}</span>
    </>
  )

  if (item.to) {
    return (
      <Link to={item.to} className={rowClass}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={rowClass} onClick={item.onClick}>
      {content}
    </button>
  )
}

function MoreActionsTrigger() {
  return (
    <PopoverTrigger
      type="button"
      className={cn(actionControlClass("primary"), "gap-0.5 hover:no-underline")}
    >
      <span className="truncate">更多</span>
      <ChevronDownIcon className="size-3 shrink-0 opacity-70" />
    </PopoverTrigger>
  )
}

type TableRowActionPanelProps = {
  actions: TableRowActionItem[]
  fixedCols?: number
}

export function TableRowActionPanel({ actions, fixedCols }: TableRowActionPanelProps) {
  if (actions.length === 0) {
    return <span className="text-sm text-muted-foreground">——</span>
  }

  const needsOverflow = actions.length > TABLE_ROW_ACTION_MAX_INLINE
  const inlineActions = needsOverflow
    ? actions.slice(0, OVERFLOW_KEEP_INLINE)
    : actions.slice(0, TABLE_ROW_ACTION_MAX_INLINE)
  const overflowActions = needsOverflow ? actions.slice(OVERFLOW_KEEP_INLINE) : []

  const dangerOverflow = overflowActions.some((item) => item.tone === "danger")
  const firstDangerIndex = overflowActions.findIndex((item) => item.tone === "danger")

  const cells: ReactNode[] = inlineActions.map((item) => (
    <ActionControl key={item.key} item={item} />
  ))

  if (needsOverflow) {
    cells.push(
      <Popover key="more-actions">
        <MoreActionsTrigger />
        <PopoverContent align="end" side="bottom" className="w-44 p-1.5">
          <div className="flex flex-col gap-0.5">
            {overflowActions.map((item, index) => (
              <div key={item.key}>
                {dangerOverflow && index === firstDangerIndex && index > 0 ? (
                  <Separator className="my-1" />
                ) : null}
                <OverflowMenuItem item={item} />
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const gridCols = fixedCols ?? resolveActionGridCols(cells.length)
  const panelWidthPx = panelWidthForActionCols(gridCols)

  const rootStyle = {
    "--table-row-action-panel-w": `${panelWidthPx}px`,
    "--table-row-action-row-h": `${TABLE_ROW_ACTION_ROW_MIN_H_PX}px`,
  } as CSSProperties

  const gridStyle: CSSProperties = {
    width: panelWidthPx,
    gridTemplateColumns: `repeat(${gridCols}, ${TABLE_ROW_ACTION_SLOT_PX}px)`,
    columnGap: TABLE_ROW_ACTION_GAP_X_PX,
    rowGap: TABLE_ROW_ACTION_GAP_Y_PX,
  }

  return (
    <div className={cn("mx-auto py-0.5", TABLE_ROW_ACTION_PANEL_WIDTH_CLASS)} style={rootStyle}>
      <div className="grid justify-items-stretch" style={gridStyle}>
        {cells.map((cell, index) => (
          <div
            key={index}
            className="flex items-center justify-center"
            style={{ minHeight: TABLE_ROW_ACTION_ROW_MIN_H_PX }}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  )
}
