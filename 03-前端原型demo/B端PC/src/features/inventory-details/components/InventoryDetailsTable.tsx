import React from "react"
import { useNavigate } from "react-router-dom"
import { Lock, QrCode } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  TableRowActionPanel,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import type { InventoryDetailRecord } from "@/features/shared/mock/inventory-shared-seed"

interface InventoryDetailsTableProps {
  data: InventoryDetailRecord[]
  onViewQr: (item: InventoryDetailRecord) => void
  page?: number
  pageSize?: number
}

const NUMERIC = "text-right tabular-nums"
const STICKY_ACTION_CLASS =
  "sticky right-0 z-10 border-l border-border/60 bg-card px-2 py-2 text-center group-hover:bg-[#f7faff]"

function statusBadge(record: InventoryDetailRecord) {
  if (record.status === "NORMAL") {
    return (
      <span className="inline-flex rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[13px] text-emerald-700">
        {record.goodsStatus}
      </span>
    )
  }
  if (record.status === "FROZEN") {
    return (
      <span className="inline-flex rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[13px] text-amber-700">
        {record.goodsStatus}
      </span>
    )
  }
  return (
    <span className="inline-flex rounded border border-border bg-muted px-2 py-0.5 text-[13px] text-muted-foreground">
      {record.goodsStatus}
    </span>
  )
}

function qty(value: number, unit: string) {
  return `${value.toFixed(3)} ${unit}`
}

export const InventoryDetailsTable: React.FC<InventoryDetailsTableProps> = ({
  data,
  onViewQr,
  page = 1,
  pageSize = 10,
}) => {
  const navigate = useNavigate()

  const actionColStyle = {
    width: 100,
    minWidth: 100,
    maxWidth: 100,
  }

  return (
    <Table className="min-w-[1800px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-16 min-w-16 text-center">序号</TableHead>
          <TableHead className="w-[170px] min-w-[170px]">货主</TableHead>
          <TableHead className="w-[170px] min-w-[170px]">货物名称</TableHead>
          <TableHead className="w-[160px] min-w-[160px]">入库时间</TableHead>
          <TableHead className={`${NUMERIC} w-[120px] min-w-[120px]`}>期初堆放数量</TableHead>
          <TableHead className={`${NUMERIC} w-[120px] min-w-[120px]`}>可用数量</TableHead>
          <TableHead className={`${NUMERIC} w-[120px] min-w-[120px]`}>冻结数量</TableHead>
          <TableHead className="w-[150px] min-w-[150px]">其他信息</TableHead>
          <TableHead className="w-[130px] min-w-[130px]">仓库</TableHead>
          <TableHead className="w-[140px] min-w-[140px]">库房</TableHead>
          <TableHead className="w-[100px] min-w-[100px]">分区</TableHead>
          <TableHead className="w-[110px] min-w-[110px]">具体位置</TableHead>
          <TableHead className="w-[80px] min-w-[80px] text-center">存货条码</TableHead>
          <TableHead className="w-[120px] min-w-[120px] text-center">货品状态</TableHead>
          <TableHead className={STICKY_ACTION_CLASS} style={actionColStyle}>
            操作
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={15} className="h-32 text-center text-muted-foreground">
              暂无匹配货位明细数据
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => {
            const actions: TableRowActionItem[] = [
              {
                key: "detail",
                label: "详情",
                title: "查看存货明细详情",
                onClick: () => navigate(`/仓储/库存查询/库存明细/详情/${row.id}`),
              },
            ]

            return (
              <TableRow key={row.id} className="group h-[72px]">
                <TableCell className="text-center text-muted-foreground">
                  {(page - 1) * pageSize + index + 1}
                </TableCell>

                <TableCell>
                  <div className="text-foreground">{row.ownerName}</div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">
                    {row.ownerIdentifierMasked}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="whitespace-normal break-words text-foreground">
                    {row.specification}
                  </div>
                </TableCell>

                <TableCell>
                  <TableDateTimeCell value={row.inboundDate} stackedPlain />
                </TableCell>

                <TableCell className={NUMERIC}>{qty(row.initialQuantity, row.unit)}</TableCell>
                <TableCell className={`${NUMERIC} text-foreground`}>
                  {qty(row.availableQuantity, row.unit)}
                </TableCell>
                <TableCell className={`${NUMERIC} text-amber-600`}>
                  {row.frozenQuantity > 0 ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="inline-flex cursor-help items-center gap-1 border-b border-dashed border-amber-400">
                          <Lock className="size-3" />
                          {qty(row.frozenQuantity, row.unit)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-xs">
                        冻结原因：{row.freezeReason || "单据审批流转占用"}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    qty(0, row.unit)
                  )}
                </TableCell>

                <TableCell>
                  <HoverOverflowText
                    className="max-w-[150px] text-muted-foreground"
                    ariaLabel={`其他信息：${row.collectInfo}`}
                  >
                    {row.collectInfo}
                  </HoverOverflowText>
                </TableCell>

                <TableCell className="text-foreground">{row.warehouseName}</TableCell>

                <TableCell>
                  <div className="text-foreground">{row.houseName}</div>
                  <div className="mt-0.5 text-[13px] text-muted-foreground">
                    {row.houseAuditStatus === "auditing" ? "（需审核）" : "（不审核）"}
                  </div>
                </TableCell>

                <TableCell className="text-foreground">{row.partitionName}</TableCell>
                <TableCell className="text-foreground">{row.locationCode}</TableCell>

                <TableCell className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-primary"
                    title="查看存货条码二维码"
                    onClick={() => onViewQr(row)}
                  >
                    <QrCode className="size-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center">{statusBadge(row)}</TableCell>

                <TableCell className={STICKY_ACTION_CLASS} style={actionColStyle}>
                  <TableRowActionPanel actions={actions} fixedCols={1} />
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
