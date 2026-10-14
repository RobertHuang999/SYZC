import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  formatGoodsNamesForList,
  splitDateTime,
} from "@/features/inbound-records/lib/list-utils"
import { resolveStagingGoodsNames } from "@prototype/shared/inbound/staging-goods-display"
import type { InboundStagingReg } from "../domain/types"
import { inboundStagingDetailPath, inboundStagingEditPath } from "../domain/constants"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

/** 列宽与入库记录列表对齐：px 锁定 + min-w，不足时横向滚动 */
const COL = {
  index: "w-12 min-w-12",
  regNo: "w-[168px] min-w-[168px]",
  type: "w-[92px] min-w-[92px]",
  owner: "w-[140px] min-w-[140px]",
  warehouse: "w-[100px] min-w-[100px]",
  goods: "w-[152px] min-w-[152px]",
  quantity: "w-[88px] min-w-[88px]",
  status: "w-[88px] min-w-[88px]",
  related: "w-[148px] min-w-[148px]",
  registrant: "w-[128px] min-w-[128px]",
  actions: "w-[148px] min-w-[148px]",
} as const

const cellBase = "whitespace-normal align-middle px-2 py-2"
const actionCell = cn(
  COL.actions,
  STICKY_ACTION_CLASS,
  "whitespace-normal align-middle px-2 py-2.5 text-center",
  "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors",
)

const actionLinkClass = "shrink-0 whitespace-nowrap text-sm text-primary hover:underline"
const actionBtnClass =
  "h-auto shrink-0 whitespace-nowrap p-0 text-sm font-normal text-primary"

function ActionSep() {
  return <span className="shrink-0 text-muted-foreground/30">|</span>
}

function ActionRow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex max-w-full flex-nowrap items-center justify-center gap-1 leading-snug">
      {children}
    </div>
  )
}

type Props = {
  data: InboundStagingReg[]
  page: number
  pageSize: number
  onConvert: (row: InboundStagingReg) => void
  onVoid: (row: InboundStagingReg) => void
}

function typeBadge(type: string) {
  let badgeClass =
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
  if (type.includes("质押")) badgeClass = "border-blue-200 bg-blue-50 text-blue-700"
  else if (type.includes("抵押")) badgeClass = "border-indigo-200 bg-indigo-50 text-indigo-700"
  else if (type.includes("仓单")) badgeClass = "border-purple-200 bg-purple-50 text-purple-700"
  else if (type.includes("普通")) badgeClass = "border-emerald-200 bg-emerald-50 text-emerald-700"
  else if (type.includes("监管")) badgeClass = "border-cyan-200 bg-cyan-50 text-cyan-700"
  return (
    <Badge variant="outline" className={cn("shrink-0 text-[11px] px-1.5 py-0 font-normal", badgeClass)}>
      {type}
    </Badge>
  )
}

function statusBadge(status: InboundStagingReg["status"]) {
  if (status === "待补全")
    return (
      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
        待补全
      </Badge>
    )
  if (status === "已转正式")
    return (
      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800">
        已转正式
      </Badge>
    )
  return (
    <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-600">
      已作废
    </Badge>
  )
}

/** 登记单号 / 正式入库单号：两行展示，缩短横向占用（对齐入库申请单号拆分口径） */
function splitDocNoTwoLines(docNo: string): { line1: string; line2: string } {
  const trimmed = docNo.trim()
  if (!trimmed) return { line1: "", line2: "" }

  const lastDash = trimmed.lastIndexOf("-")
  if (trimmed.startsWith("REG-") && lastDash > 3) {
    return {
      line1: trimmed.slice(0, lastDash),
      line2: trimmed.slice(lastDash + 1),
    }
  }

  if (trimmed.length > 14) {
    return { line1: trimmed.slice(0, 14), line2: trimmed.slice(14) }
  }
  if (trimmed.length > 10) {
    return { line1: trimmed.slice(0, 10), line2: trimmed.slice(10) }
  }
  return { line1: trimmed, line2: "" }
}

function DocNoTwoLineBody({ docNo }: { docNo: string }) {
  const { line1, line2 } = splitDocNoTwoLines(docNo)
  return (
    <span className="flex min-w-0 flex-col gap-0.5 text-sm leading-snug">
      <span className="break-all text-foreground">{line1}</span>
      {line2 ? <span className="break-all font-medium text-primary">{line2}</span> : null}
    </span>
  )
}

function CopyDocNoButton({ docNo }: { docNo: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="shrink-0 p-0.5 text-xs text-muted-foreground opacity-0 transition-opacity group-hover/item:opacity-100 hover:text-foreground"
      title="复制单号"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void navigator.clipboard.writeText(docNo)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? "✓" : "📋"}
    </button>
  )
}

function RegNoCell({ regNo, linkTo }: { regNo: string; linkTo: string }) {
  return (
    <div className="group/item flex items-start gap-1">
      <Link to={linkTo} className="min-w-0 hover:underline" title={regNo}>
        <DocNoTwoLineBody docNo={regNo} />
      </Link>
      <CopyDocNoButton docNo={regNo} />
    </div>
  )
}

function RelatedFormalNoCell({ formalNo }: { formalNo: string }) {
  return (
    <div className="group/item flex items-start gap-1">
      <DocNoTwoLineBody docNo={formalNo} />
      <CopyDocNoButton docNo={formalNo} />
    </div>
  )
}

function GoodsSummaryCell({
  summary,
  goodsNames,
}: {
  summary: string
  goodsNames?: string[]
}) {
  const names = resolveStagingGoodsNames({ goodsSummary: summary, goodsNames })
  if (names.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const joined = formatGoodsNamesForList(names)
  const label = names.length > 2 ? `${summary.trim() || joined}（共 ${names.length} 种）` : summary.trim() || joined
  const tooltipBody = (
    <ul className="space-y-1 text-xs">
      {names.map((name) => (
        <li key={name} className="leading-snug">
          {name}
        </li>
      ))}
    </ul>
  )

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span />}
        className="line-clamp-2 cursor-help text-left text-sm font-normal leading-snug break-words text-foreground"
        aria-label={`货品摘要：${joined}`}
      >
        {label}
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">{tooltipBody}</TooltipContent>
    </Tooltip>
  )
}

function RowActions({
  row,
  onConvert,
  onVoid,
}: {
  row: InboundStagingReg
  onConvert: (row: InboundStagingReg) => void
  onVoid: (row: InboundStagingReg) => void
}) {
  const pending = row.status === "待补全"

  return (
    <div className="flex flex-col items-center gap-1">
      <ActionRow>
        <Link to={inboundStagingDetailPath(row.id)} className={actionLinkClass}>
          查看详情
        </Link>
        {pending ? (
          <>
            <ActionSep />
            <Link to={inboundStagingEditPath(row.id)} className={actionLinkClass}>
              编辑
            </Link>
          </>
        ) : null}
      </ActionRow>
      {pending ? (
        <ActionRow>
          <Button
            type="button"
            variant="link"
            size="sm"
            className={actionBtnClass}
            onClick={() => onConvert(row)}
          >
            转为正式入库
          </Button>
          <ActionSep />
          <Button
            type="button"
            variant="link"
            size="sm"
            className={cn(actionBtnClass, "text-destructive")}
            onClick={() => onVoid(row)}
          >
            作废
          </Button>
        </ActionRow>
      ) : null}
    </div>
  )
}

export function InboundStagingTable({ data, page, pageSize, onConvert, onVoid }: Props) {
  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table className="min-w-[1264px] w-full table-fixed text-sm">
        <colgroup>
          <col className="w-12" />
          <col className="w-[168px]" />
          <col className="w-[92px]" />
          <col className="w-[140px]" />
          <col className="w-[100px]" />
          <col className="w-[152px]" />
          <col className="w-[88px]" />
          <col className="w-[88px]" />
          <col className="w-[148px]" />
          <col className="w-[128px]" />
          <col className="w-[148px]" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead
              className={cn(COL.index, "text-center text-xs font-medium text-muted-foreground")}
            >
              序号
            </TableHead>
            <TableHead className={cn(COL.regNo, "text-xs font-medium text-muted-foreground")}>
              登记单号
            </TableHead>
            <TableHead className={cn(COL.type, "text-xs font-medium text-muted-foreground")}>
              入库类型
            </TableHead>
            <TableHead className={cn(COL.owner, "text-xs font-medium text-muted-foreground")}>
              货主/送货说明
            </TableHead>
            <TableHead className={cn(COL.warehouse, "text-xs font-medium text-muted-foreground")}>
              入库仓库
            </TableHead>
            <TableHead className={cn(COL.goods, "text-xs font-medium text-muted-foreground")}>
              货品摘要
            </TableHead>
            <TableHead
              className={cn(COL.quantity, "text-right text-xs font-medium text-muted-foreground")}
            >
              申报数量
            </TableHead>
            <TableHead className={cn(COL.status, "text-xs font-medium text-muted-foreground")}>
              单据状态
            </TableHead>
            <TableHead className={cn(COL.related, "text-xs font-medium text-muted-foreground")}>
              关联正式单号
            </TableHead>
            <TableHead className={cn(COL.registrant, "text-xs font-medium text-muted-foreground")}>
              登记人
            </TableHead>
            <TableHead
              className={cn(
                COL.actions,
                "text-center text-xs font-medium text-foreground/80 bg-slate-100 dark:bg-slate-800",
                STICKY_ACTION_CLASS,
              )}
            >
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-32 text-center text-sm text-muted-foreground">
                暂无匹配的暂存登记
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const registeredParts = splitDateTime(row.registeredAt)

              return (
                <TableRow key={row.id} className="group align-middle hover:bg-muted/50 transition-colors">
                  <TableCell className={cn(cellBase, "text-center text-xs text-muted-foreground")}>
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className={cellBase}>
                    <RegNoCell regNo={row.regNo} linkTo={inboundStagingDetailPath(row.id)} />
                  </TableCell>
                  <TableCell className={cellBase}>{typeBadge(row.inboundType)}</TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-2 text-sm text-foreground">{row.ownerDisplay}</span>
                      {row.ownerTag ? (
                        <span className="line-clamp-1 text-xs text-muted-foreground">{row.ownerTag}</span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className={cellBase}>
                    <span className="line-clamp-2 text-sm leading-snug break-words text-foreground">
                      {row.warehouseName}
                    </span>
                  </TableCell>
                  <TableCell className={cellBase}>
                    <GoodsSummaryCell summary={row.goodsSummary} goodsNames={row.goodsNames} />
                  </TableCell>
                  <TableCell className={cn(cellBase, "text-right text-sm text-foreground tabular-nums")}>
                    <span className="leading-snug">
                      {row.declaredQty.toLocaleString()}
                      <span className="ml-0.5 text-xs text-muted-foreground">{row.unit}</span>
                    </span>
                  </TableCell>
                  <TableCell className={cellBase}>{statusBadge(row.status)}</TableCell>
                  <TableCell className={cellBase}>
                    {row.relatedFormalNo ? (
                      <RelatedFormalNoCell formalNo={row.relatedFormalNo} />
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-2 text-sm text-foreground">{row.registrant}</span>
                      <span className="text-xs text-muted-foreground">{registeredParts.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className={actionCell}>
                    <RowActions row={row} onConvert={onConvert} onVoid={onVoid} />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
