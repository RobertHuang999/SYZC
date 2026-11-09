import type { CSSProperties } from "react"
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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import { TableRowActionPanel, type TableRowActionItem } from "@/shared/components/TableRowActionPanel"
import type { DeliveryOrderItem } from "../domain/types"
import { DELIVERY_STATUS_CONFIG } from "../domain/constants"

interface DeliveryOrderTableProps {
  rows: DeliveryOrderItem[]
  page: number
  pageSize: number
  onViewDetail: (item: DeliveryOrderItem) => void
  onViewLogs: (item: DeliveryOrderItem) => void
  onWriteOff: (item: DeliveryOrderItem) => void
  onCancel: (item: DeliveryOrderItem) => void
  onConfirm: (item: DeliveryOrderItem) => void
}

/** 列宽对齐提货单 ASCII 列表页：60/240/300/220/100/80/180/160/160 */
const COL = {
  index: "w-[60px] min-w-[60px]",
  owner: "w-[240px] min-w-[240px]",
  goods: "w-[300px] min-w-[300px]",
  pickup: "w-[220px] min-w-[220px]",
  type: "w-[100px] min-w-[100px]",
  status: "w-[80px] min-w-[80px]",
  operator: "w-[180px] min-w-[180px]",
  time: "w-[160px] min-w-[160px]",
  actions: "w-[160px] min-w-[160px]",
} as const

const headCell =
  "h-9 px-3.5 py-0 text-[13px] font-bold text-[#999999] whitespace-nowrap"
const cellBase = "px-3.5 py-0 align-middle text-[13px] text-[#4e5969]"
const stickyLeft = "sticky left-0 z-10 bg-card group-hover:bg-[#F5F7FA]"
const stickyRight =
  "sticky right-0 z-10 bg-card group-hover:bg-[#F5F7FA] shadow-[-6px_0_10px_-6px_rgba(0,0,0,0.12)]"

function outboundTypeBadge(type: string) {
  let badgeClass =
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
  if (type.includes("质押")) {
    badgeClass = "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300"
  } else if (type.includes("抵押")) {
    badgeClass = "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300"
  } else if (type.includes("仓单")) {
    badgeClass = "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300"
  } else if (type.includes("普通")) {
    badgeClass = "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
  } else if (type.includes("移库")) {
    badgeClass = "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300"
  } else if (type.includes("转让") || type.includes("加工")) {
    badgeClass = "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/40 dark:text-cyan-300"
  }
  return (
    <Badge variant="outline" className={cn("shrink-0 px-2 py-0.5 text-[11px] font-normal", badgeClass)}>
      {type}
    </Badge>
  )
}

/** 货物：与入库/出库台账一致，单行摘要 + 悬停浮层展示全部货品，不设按钮 */
function DeliveryGoodsCell({ list }: { list: DeliveryOrderItem["goodsSummaryList"] }) {
  if (list.length === 0) {
    return <span className="text-[#909399]">—</span>
  }

  const first = list[0]
  const summary = `${first.categoryName}-${first.subCategoryName}-${first.specName} - ${first.amount} ${first.unit}`
  const label = list.length > 1 ? `${summary}（共 ${list.length} 种）` : summary

  return (
    <Tooltip>
      <TooltipTrigger
        render={<div />}
        className="line-clamp-2 cursor-help whitespace-normal break-words text-left leading-snug text-foreground transition-colors hover:text-primary"
      >
        {label}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm text-xs">
        <p className="mb-1 border-b border-border/50 pb-1 font-medium">
          货品清单（共 {list.length} 种）：
        </p>
        <ul className="space-y-1">
          {list.map((g, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span>
                {g.categoryName}-{g.subCategoryName}-{g.specName}
              </span>
              <span className="shrink-0">
                {g.amount} {g.unit}
              </span>
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}

export function DeliveryOrderTable({
  rows,
  page,
  pageSize,
  onViewDetail,
  onViewLogs,
  onWriteOff,
  onCancel,
  onConfirm,
}: DeliveryOrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table
        className="w-full min-w-[1500px] table-fixed text-sm"
        style={{ "--row-hover": "#F5F7FA" } as CSSProperties}
      >
        <colgroup>
          <col style={{ width: 60 }} />
          <col style={{ width: 240 }} />
          <col style={{ width: 300 }} />
          <col style={{ width: 220 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 80 }} />
          <col style={{ width: 180 }} />
          <col style={{ width: 160 }} />
          <col style={{ width: 160 }} />
        </colgroup>
        <TableHeader>
          <TableRow className="bg-[#F2F6FC] hover:bg-[#F2F6FC]">
            <TableHead className={cn(COL.index, headCell, "sticky left-0 z-20 bg-[#F2F6FC] text-center")}>序号</TableHead>
            <TableHead className={cn(COL.owner, headCell)}>货主</TableHead>
            <TableHead className={cn(COL.goods, headCell)}>货物</TableHead>
            <TableHead className={cn(COL.pickup, headCell)}>提货人</TableHead>
            <TableHead className={cn(COL.type, headCell, "text-center")}>出库类型</TableHead>
            <TableHead className={cn(COL.status, headCell, "text-center")}>状态</TableHead>
            <TableHead className={cn(COL.operator, headCell)}>
              <PrototypeAnnotationTarget annotationIds={["delivery-order-table-r02"]}>
                <span>操作人</span>
              </PrototypeAnnotationTarget>
            </TableHead>
            <TableHead className={cn(COL.time, headCell, "text-center")}>时间</TableHead>
            <TableHead className={cn(COL.actions, headCell, "sticky right-0 z-20 bg-[#F2F6FC] text-center")}>
              <PrototypeAnnotationTarget annotationIds={["delivery-order-actions-matrix"]}>
                <span>操作</span>
              </PrototypeAnnotationTarget>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center text-[14px] text-[#909399]">
                暂无符合条件的提货单，可调整筛选条件后重试
              </TableCell>
            </TableRow>
          ) : (
            rows.map((item, idx) => {
              const isPending = item.status === "未提货"
              const statusCfg = DELIVERY_STATUS_CONFIG[item.status] || DELIVERY_STATUS_CONFIG.未提货
              const actionItems: TableRowActionItem[] = [
                {
                  key: "detail",
                  label: "详情",
                  onClick: () => onViewDetail(item),
                },
                {
                  key: "logs",
                  label: "操作记录",
                  onClick: () => onViewLogs(item),
                },
                {
                  key: "writeoff",
                  label: "核销码",
                  disabled: !isPending,
                  title: isPending ? undefined : "仅未提货单据可核销提货码",
                  onClick: () => onWriteOff(item),
                },
                {
                  key: "confirm",
                  label: "确认提货",
                  disabled: !isPending,
                  title: isPending ? undefined : "仅未提货单据可确认提货",
                  onClick: () => onConfirm(item),
                },
                {
                  key: "cancel",
                  label: "取消提货",
                  tone: "danger",
                  disabled: !isPending,
                  title: isPending ? undefined : "仅未提货单据可取消",
                  onClick: () => onCancel(item),
                },
              ]

              return (
                <TableRow
                  key={item.id}
                  className="group h-[72px] border-b border-[#EFEFEF] transition-colors hover:bg-[#F5F7FA]"
                >
                  {/* 序号 */}
                  <TableCell className={cn(cellBase, COL.index, stickyLeft, "text-center text-[#909399]")}>
                    {(page - 1) * pageSize + idx + 1}
                  </TableCell>

                  {/* 货主 */}
                  <TableCell className={cn(cellBase, COL.owner)}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-1 font-medium text-foreground" title={item.ownerName}>
                        {item.ownerName}
                      </span>
                      <span className="line-clamp-1 text-[11px] tabular-nums text-[#606266]">
                        {item.ownerIdentity}
                      </span>
                    </div>
                  </TableCell>

                  {/* 货物 */}
                  <TableCell className={cn(cellBase, COL.goods)}>
                    <DeliveryGoodsCell list={item.goodsSummaryList} />
                  </TableCell>

                  {/* 提货人（含企业悬停 Popover 浮层 R03） */}
                  <TableCell className={cn(cellBase, COL.pickup)}>
                    <PrototypeAnnotationTarget annotationIds={["delivery-order-pickup-r03"]}>
                      {item.pickupPersonType === "企业" ? (
                        <div className="space-y-0.5">
                          <div className="line-clamp-1 text-foreground">
                            {item.pickupOperator || item.pickupName}({item.pickupPhone})经办人
                          </div>
                          <Popover>
                            <PopoverTrigger className="cursor-pointer text-[11px] font-medium text-amber-600 hover:text-amber-700 hover:underline">
                              [更多]
                            </PopoverTrigger>
                            <PopoverContent
                              side="top"
                              align="start"
                              className="w-64 space-y-1.5 border bg-card p-3 text-xs font-sans shadow-md"
                            >
                              <div className="text-muted-foreground">
                                <span className="font-medium text-foreground">企业名称：</span>
                                {item.pickupName}
                              </div>
                              <div className="text-muted-foreground">
                                <span className="font-medium text-foreground">企业标识：</span>
                                {item.pickupIdentity || "—"}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-foreground">{item.pickupName}</div>
                          <div className="text-[11px] text-muted-foreground">({item.pickupPhone})</div>
                        </div>
                      )}
                    </PrototypeAnnotationTarget>
                  </TableCell>

                  {/* 出库类型 */}
                  <TableCell className={cn(cellBase, COL.type, "text-center")}>
                    {outboundTypeBadge(item.outboundType)}
                  </TableCell>

                  {/* 状态徽标 */}
                  <TableCell className={cn(cellBase, COL.status, "text-center")}>
                    <span
                      className={cn(
                        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold border",
                        statusCfg.badgeClass
                      )}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  {/* 操作人（固化出库制单人 R02） */}
                  <TableCell className={cn(cellBase, COL.operator)}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-1 font-medium text-foreground" title={item.operatorName}>
                        {item.operatorName}
                      </span>
                      {item.operatorOrg ? (
                        <span className="line-clamp-1 text-[11px] text-muted-foreground" title={item.operatorOrg}>
                          ({item.operatorOrg})
                        </span>
                      ) : null}
                    </div>
                  </TableCell>

                  {/* 时间（固化单据生成时刻 R02） */}
                  <TableCell className={cn(cellBase, COL.time, "text-center")}>
                    <TableDateTimeCell value={item.createTime} stackedPlain />
                  </TableCell>

                  {/* 操作列（Sticky 右侧防滚动穿透，2×2 紧凑排布） */}
                  <TableCell className={cn(cellBase, COL.actions, stickyRight, "whitespace-normal px-2 py-2 text-center")}>
                    <TableRowActionPanel actions={actionItems} fixedCols={2} />
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
