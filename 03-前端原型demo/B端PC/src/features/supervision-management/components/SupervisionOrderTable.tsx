import { useState, type CSSProperties } from "react"
import { AlertTriangleIcon, EyeIcon, EyeOffIcon, LockIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { DocNoCell } from "@/shared/components/DocNoCell"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  TableRowActionPanel,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import {
  SUPERVISION_INLINE_ACTIONS,
  SUPERVISION_MORE_ACTIONS,
  calcSupervisionRate,
  formatSupervisionRate,
  formatWan,
  resolveActionLabel,
  type SupervisionActionDef,
  type SupervisionTabConfig,
} from "../domain/constants"
import type { SupervisionOrderItem } from "../domain/types"

interface SupervisionOrderTableProps {
  rows: SupervisionOrderItem[]
  page: number
  pageSize: number
  tabConfig: SupervisionTabConfig
  onAction: (item: SupervisionOrderItem, action: SupervisionActionDef) => void
  onResetFilters: () => void
}

const COL = {
  index: 60,
  orderNo: 150,
  owner: 210,
  goods: 240,
  time: 110,
  status: 120,
  loan: 150,
  safety: 110,
  industry: 140,
  appraised: 140,
  rate: 100,
  process: 130,
  orgs: 200,
  actions: 218,
} as const

const headCell =
  "h-[45px] px-4 py-0 text-[13px] font-semibold text-[#4e5969] whitespace-nowrap"
const cellBase = "px-4 py-0 align-middle text-[13px] text-[#4e5969]"
const stickyLeft = "sticky left-0 z-10 bg-card group-hover:bg-[#f7faff]"
const stickyRight =
  "sticky right-0 z-10 bg-card group-hover:bg-[#f7faff] border-l border-[#f0f1f3] shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

function AmountCell({
  value,
  linkLabel,
  unpriced,
  onOpen,
}: {
  value?: number
  linkLabel?: string
  unpriced?: boolean
  onOpen?: () => void
}) {
  const formatted = formatWan(value)
  return (
    <div className="flex flex-col items-end gap-0.5 leading-snug">
      <span className="inline-flex items-center gap-1 tabular-nums text-foreground">
        {formatted ? `${formatted}万元` : "—"}
        {unpriced ? (
          <Tooltip>
            <TooltipTrigger
              render={<span />}
              className="inline-flex cursor-help items-center text-amber-500"
              aria-label="未定价说明"
            >
              <AlertTriangleIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[220px] text-xs leading-relaxed">
              该订单存在未定价货品，未定价部分不计入货值总额。
            </TooltipContent>
          </Tooltip>
        ) : null}
      </span>
      {linkLabel ? (
        <button
          type="button"
          onClick={onOpen}
          className="text-[11px] font-medium text-primary hover:underline"
        >
          {linkLabel} ›
        </button>
      ) : null}
    </div>
  )
}

function GoodsCell({ list }: { list: SupervisionOrderItem["goodsList"] }) {
  if (list.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }
  const visible = list.slice(0, 2)
  return (
    <div className="flex flex-col gap-0.5 leading-snug">
      {visible.map((goods, index) => (
        <span key={`${goods.name}-${index}`} className="line-clamp-1" title={goods.name}>
          {goods.name}
        </span>
      ))}
      {list.length > 2 ? (
        <Popover>
          <PopoverTrigger className="w-fit cursor-pointer text-left text-[11px] font-medium text-primary hover:underline">
            更多...
          </PopoverTrigger>
          <PopoverContent align="start" side="top" className="w-72 space-y-1.5 p-3 text-xs">
            <p className="border-b border-border/60 pb-1 font-medium text-foreground">
              货品清单（共 {list.length} 种）
            </p>
            <ul className="max-h-56 space-y-1 overflow-y-auto">
              {list.map((goods, index) => (
                <li key={`${goods.name}-all-${index}`} className="text-[#4e5969]">
                  {goods.name}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  )
}

function LoanInfoCell({ item }: { item: SupervisionOrderItem }) {
  const amount = formatWan(item.loanAmount)
  const balance = formatWan(item.loanBalance)
  return (
    <div className="flex flex-col gap-0.5 text-[12px] leading-snug text-muted-foreground">
      <span>贷款金额:{amount ? `${amount}万元` : "—"}</span>
      <span>贷款期数:{item.loanPeriods ?? "—"}</span>
      <span>贷款余额:{balance ? `${balance}万元` : "—"}</span>
    </div>
  )
}

export function SupervisionOrderTable({
  rows,
  page,
  pageSize,
  tabConfig,
  onAction,
  onResetFilters,
}: SupervisionOrderTableProps) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const buildActions = (item: SupervisionOrderItem): TableRowActionItem[] => {
    const isReleased = item.status.startsWith("解")
    const defs = isReleased
      ? SUPERVISION_INLINE_ACTIONS.slice(0, 2)
      : [...SUPERVISION_INLINE_ACTIONS, ...SUPERVISION_MORE_ACTIONS]

    return defs.map((def) => {
      const label = resolveActionLabel(def.key, def.label, item.tab)
      const disabledByLock =
        Boolean(item.lockedTask) && (def.kind === "mutate" || def.kind === "danger")
      return {
        key: def.key,
        label,
        tone: def.kind === "danger" ? "danger" : undefined,
        disabled: disabledByLock,
        title: disabledByLock
          ? `正在进行【${item.lockedTask}】审批，审核前不能发起其他操作`
          : undefined,
        onClick: () => onAction(item, { ...def, label }),
      }
    })
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table
        className="w-full min-w-[1980px] table-fixed text-sm"
        style={{ "--row-hover": "#f7faff" } as CSSProperties}
      >
        <colgroup>
          <col style={{ width: COL.index }} />
          <col style={{ width: COL.orderNo }} />
          <col style={{ width: COL.owner }} />
          <col style={{ width: COL.goods }} />
          <col style={{ width: COL.time }} />
          <col style={{ width: COL.status }} />
          <col style={{ width: COL.loan }} />
          <col style={{ width: COL.safety }} />
          <col style={{ width: COL.industry }} />
          <col style={{ width: COL.appraised }} />
          <col style={{ width: COL.rate }} />
          <col style={{ width: COL.process }} />
          <col style={{ width: COL.orgs }} />
          <col style={{ width: COL.actions }} />
        </colgroup>

        <TableHeader>
          <TableRow className="bg-[#f7f8fa] hover:bg-[#f7f8fa]">
            <TableHead className={cn(headCell, "sticky left-0 z-20 bg-[#f7f8fa] text-center")}>
              序号
            </TableHead>
            <TableHead className={headCell}>
              <PrototypeAnnotationTarget annotationIds={["supervision-management-order-no"]}>
                <span>{tabConfig.orderNoLabel}</span>
              </PrototypeAnnotationTarget>
            </TableHead>
            <TableHead className={headCell}>货主名称/标识</TableHead>
            <TableHead className={headCell}>货物</TableHead>
            <TableHead className={cn(headCell, "text-center")}>
              {tabConfig.key === "MORTGAGE"
                ? "抵押时间"
                : tabConfig.key === "PLEDGE"
                  ? "质押时间"
                  : "监管时间"}
            </TableHead>
            <TableHead className={cn(headCell, "text-center")}>{tabConfig.statusLabel}</TableHead>
            <TableHead className={headCell}>
              <PrototypeAnnotationTarget annotationIds={["supervision-management-loan"]}>
                <span>贷款信息</span>
              </PrototypeAnnotationTarget>
            </TableHead>
            <TableHead className={cn(headCell, "text-right")}>货值安全线</TableHead>
            <TableHead className={cn(headCell, "text-right")}>行业参考价</TableHead>
            <TableHead className={cn(headCell, "text-right")}>货物评估价值</TableHead>
            <TableHead className={cn(headCell, "text-right")}>
              <PrototypeAnnotationTarget annotationIds={["supervision-management-rate"]}>
                <Tooltip>
                  <TooltipTrigger
                    render={<span />}
                    className="inline-flex cursor-help items-center gap-0.5"
                  >
                    {tabConfig.rateLabel}
                    <span className="inline-flex size-3.5 items-center justify-center rounded-full border border-[#c9cdd4] text-[9px] font-normal text-[#86909c]">
                      ?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                    {tabConfig.rateLabel} =（贷款余额 ÷ 货物评估价值）× 100%；
                    未放款或未估值时显示“—”。
                  </TooltipContent>
                </Tooltip>
              </PrototypeAnnotationTarget>
            </TableHead>
            <TableHead className={headCell}>关联总流程</TableHead>
            <TableHead className={headCell}>流程相关机构</TableHead>
            <TableHead
              className={cn(
                headCell,
                "sticky right-0 z-20 bg-[#f7f8fa] text-center",
              )}
            >
              <PrototypeAnnotationTarget annotationIds={["supervision-management-actions"]}>
                <span>操作</span>
              </PrototypeAnnotationTarget>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} className="h-32 text-center text-[14px] text-[#909399]">
                <div className="flex flex-col items-center gap-2">
                  <span>暂无符合条件的监管订单，可调整筛选条件后重试</span>
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-[13px] font-medium text-primary hover:underline"
                  >
                    重置筛选
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((item, index) => {
              const isReleased = item.status.startsWith("解")
              const actions = buildActions(item)
              const rate = formatSupervisionRate(calcSupervisionRate(item))
              const showedFull = revealed.has(item.id)
              const ownerIdentity =
                item.ownerType === "个人" && item.ownerIdentityFull && showedFull
                  ? item.ownerIdentityFull
                  : item.ownerIdentity

              return (
                <TableRow
                  key={item.id}
                  className="group h-[72px] border-b border-[#f2f3f5] transition-colors hover:bg-[#f7faff]"
                >
                  <TableCell className={cn(cellBase, stickyLeft, "text-center text-[#909399]")}>
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>

                  <TableCell className={cn(cellBase, "py-2")}>
                    <div className="flex flex-col gap-1">
                      <DocNoCell
                        docNo={item.orderNo}
                        wrap
                        onClick={() =>
                          onAction(item, { key: "detail", label: "查看详情", kind: "readonly" })
                        }
                      />
                      {item.hasRisk || item.lockedTask ? (
                        <div className="flex flex-wrap items-center gap-1">
                          {item.hasRisk ? (
                            <span className="inline-flex items-center gap-0.5 rounded border border-rose-200 bg-rose-50 px-1 py-0.5 text-[10px] font-medium text-rose-600">
                              <AlertTriangleIcon className="size-2.5" />
                              风险
                            </span>
                          ) : null}
                          {item.lockedTask ? (
                            <span className="inline-flex items-center gap-0.5 rounded border border-amber-200 bg-amber-50 px-1 py-0.5 text-[10px] font-medium text-amber-700">
                              <LockIcon className="size-2.5" />
                              在途：{item.lockedTask}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </TableCell>

                  <TableCell className={cn(cellBase, "py-2")}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-1 font-medium text-foreground" title={item.ownerName}>
                        {item.ownerName}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#86909c]">
                        <span className="tabular-nums">{ownerIdentity}</span>
                        {item.ownerType === "个人" && item.ownerIdentityFull ? (
                          <button
                            type="button"
                            onClick={() => toggleReveal(item.id)}
                            className="inline-flex text-[#86909c] hover:text-primary"
                            title={showedFull ? "隐藏完整手机号" : "显示完整手机号"}
                            aria-label={showedFull ? "隐藏完整手机号" : "显示完整手机号"}
                          >
                            {showedFull ? (
                              <EyeOffIcon className="size-3" />
                            ) : (
                              <EyeIcon className="size-3" />
                            )}
                          </button>
                        ) : null}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className={cn(cellBase, "py-2")}>
                    <GoodsCell list={item.goodsList} />
                  </TableCell>

                  <TableCell className={cn(cellBase, "text-center")}>
                    <TableDateTimeCell value={item.pledgeTime} stackedPlain />
                  </TableCell>

                  <TableCell className={cn(cellBase, "text-center")}>
                    <span
                      className={cn(
                        "inline-flex items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-[11px] font-medium leading-tight",
                        isReleased
                          ? "border-slate-200 bg-slate-50 text-slate-600"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700",
                      )}
                    >
                      {item.status}-{item.businessMode}
                    </span>
                  </TableCell>

                  <TableCell className={cn(cellBase, "py-2")}>
                    <LoanInfoCell item={item} />
                  </TableCell>

                  <TableCell className={cn(cellBase, "text-right tabular-nums")}>
                    {formatWan(item.safetyLine) ? `${formatWan(item.safetyLine)}万元` : "—"}
                  </TableCell>

                  <TableCell className={cn(cellBase, "py-2")}>
                    <AmountCell
                      value={item.industryPrice}
                      linkLabel="行业参考价"
                      unpriced={item.unpriced}
                      onOpen={() =>
                        onAction(item, {
                          key: "industryPrice",
                          label: "行业参考价",
                          kind: "readonly",
                        })
                      }
                    />
                  </TableCell>

                  <TableCell className={cn(cellBase, "py-2")}>
                    <AmountCell
                      value={item.appraisedValue}
                      linkLabel="货物评估价值"
                      unpriced={item.unpriced}
                      onOpen={() =>
                        onAction(item, {
                          key: "appraisedValue",
                          label: "货物评估价值",
                          kind: "readonly",
                        })
                      }
                    />
                  </TableCell>

                  <TableCell
                    className={cn(cellBase, "text-right font-medium tabular-nums text-foreground")}
                  >
                    {rate ?? "—"}
                  </TableCell>

                  <TableCell className={cn(cellBase, "py-2")}>
                    <span className="line-clamp-2 leading-snug" title={item.processName}>
                      {item.processName}
                    </span>
                  </TableCell>

                  <TableCell className={cn(cellBase, "py-2")}>
                    <span
                      className="line-clamp-3 leading-snug"
                      title={item.relatedOrgs.join("，")}
                    >
                      {item.relatedOrgs.length > 0 ? item.relatedOrgs.join("，") : "—"}
                    </span>
                  </TableCell>

                  <TableCell
                    className={cn(
                      cellBase,
                      stickyRight,
                      "whitespace-normal px-2 py-0 text-center",
                    )}
                  >
                    <TableRowActionPanel
                      actions={actions}
                      maxInline={isReleased ? 2 : 6}
                      fixedCols={isReleased ? 2 : 3}
                      overflowColumns={2}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
