import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { inboundApplyDetailPath } from "../domain/constants"
import type { InboundApply } from "../domain/types"
import { CURRENT_USER_ID } from "../mock/inbound-records.mock"
import { splitDateTime, splitOrderNoForDisplay } from "../lib/list-utils"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] backdrop-blur-md"

type InboundApplyTableProps = {
  data: InboundApply[]
  page: number
  pageSize: number
  onRevoke: (item: InboundApply) => void
}

function StatusBadge({ status }: { status: number }) {
  switch (status) {
    case 0:
      return (
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          待审核
        </span>
      )
    case 1:
      return (
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          审核中
        </span>
      )
    case 2:
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          已通过
        </span>
      )
    case 3:
      return (
        <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700">
          未通过
        </span>
      )
    case 4:
      return (
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          已撤销
        </span>
      )
    default:
      return null
  }
}

export function InboundApplyTable({
  data,
  page,
  pageSize,
  onRevoke,
}: InboundApplyTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table className="min-w-[1100px] table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-12">序号</TableHead>
            <TableHead className="w-[110px]">入库单号</TableHead>
            <TableHead className="w-[120px]">货主名称</TableHead>
            <TableHead className="w-[110px]">货主标识</TableHead>
            <TableHead className="w-[140px]">入库货物</TableHead>
            <TableHead className="w-[85px] text-right">入库数量</TableHead>
            <TableHead className="w-[85px]">入库类型</TableHead>
            <TableHead className="w-[120px]">库存位置</TableHead>
            <TableHead className="w-[95px]">入库时间</TableHead>
            <TableHead className="w-[130px]">操作人</TableHead>
            <TableHead className="w-[95px]">撤销时间</TableHead>
            <TableHead className="w-[85px] text-center">状态</TableHead>
            <TableHead
              className={cn(
                "w-[160px] text-center",
                STICKY_ACTION_CLASS,
                "bg-slate-100/95 dark:bg-slate-800/95 font-semibold text-foreground/90"
              )}
            >
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="h-32 text-center text-muted-foreground">
                暂无匹配的入库申请记录
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const timeParts = splitDateTime(row.inboundTime)
              const orderParts = splitOrderNoForDisplay(row.orderNo)
              const canRevoke =
                (row.checkStatus === 0 || row.checkStatus === 1) &&
                row.createByUserId === CURRENT_USER_ID

              return (
                <TableRow key={row.id} className="group align-top text-xs">
                  <TableCell className="text-muted-foreground">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-medium text-foreground">
                      {orderParts.head}
                      <span className="text-primary">{orderParts.tail}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-2 font-medium text-foreground">
                      {row.ownerName}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.ownerIdentifierMasked}
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-2 text-foreground font-medium" title={row.goodsSpec}>
                      {row.goodsSpec}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {row.amount.toLocaleString("zh-CN", { maximumFractionDigits: 4 })} {row.unit}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.inboundTypeLabel}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground">{row.repoName}</span>
                      <span className="text-muted-foreground">{row.houseName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-muted-foreground">
                      <span>{timeParts.date}</span>
                      <span className="text-[11px] text-muted-foreground/80">{timeParts.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-foreground">
                      <span>{row.createByName}</span>
                      <span className="text-[11px] text-muted-foreground">{row.createOrgName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.revokedTime ? (
                      <div className="flex flex-col">
                        <span>{row.revokedTime.split(" ")[0]}</span>
                        <span className="text-[11px]">{row.revokedTime.split(" ")[1]}</span>
                      </div>
                    ) : (
                      "--"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={row.checkStatus} />
                  </TableCell>
                  <TableCell
                    className={cn(
                      STICKY_ACTION_CLASS,
                      "bg-slate-50/95 dark:bg-slate-900/95 group-hover:bg-slate-100/95 dark:group-hover:bg-slate-850/95 transition-colors text-center py-2"
                    )}
                  >
                    <div className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-muted/65 dark:bg-muted/40 p-1 shadow-2xs backdrop-blur-xs whitespace-nowrap">
                      {canRevoke && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs font-medium rounded-md text-destructive bg-destructive/10 hover:bg-destructive/20 active:bg-destructive/25 transition-all shadow-2xs"
                          onClick={() => onRevoke(row)}
                        >
                          撤销申请
                        </Button>
                      )}
                      <Link to={inboundApplyDetailPath(row.id)}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2.5 text-xs font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 active:bg-primary/25 transition-all shadow-2xs"
                        >
                          查看详情
                        </Button>
                      </Link>
                    </div>
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
