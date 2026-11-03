import React, { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  TableRowActionPanel,
  TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import { InboundDocNoCell } from "@/features/inbound-records/components/InboundDocNoCell"
import type { TallyStackingMainItem } from "@/features/shared/mock/inventory-shared-seed"

interface TallyStackingTableProps {
  data: TallyStackingMainItem[]
  onViewQr: (item: TallyStackingMainItem) => void
  page?: number
  pageSize?: number
}

const NUMERIC = "text-right tabular-nums"
const STICKY_ACTION_CLASS =
  "sticky right-0 z-10 border-l border-border/60 bg-card px-2 py-2 text-center group-hover:bg-[#f7faff]"

export const TallyStackingTable: React.FC<TallyStackingTableProps> = ({
  data,
  onViewQr,
  page = 1,
  pageSize = 10,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(data.map((d) => d.id))
  )

  const toggleExpand = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const actionColStyle = {
    width: TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX,
    minWidth: TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX,
    maxWidth: TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX,
  }

  return (
    <Table className="min-w-[1250px]">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-12 min-w-12 text-center">展开</TableHead>
          <TableHead className="w-[190px] min-w-[190px]">源头入库单号</TableHead>
          <TableHead className="w-[210px] min-w-[210px]">货品全称与规格</TableHead>
          <TableHead className="w-[150px] min-w-[150px]">实体监管仓库</TableHead>
          <TableHead className="w-[170px] min-w-[170px]">权属货主</TableHead>
          <TableHead className={`${NUMERIC} w-[110px] min-w-[110px]`}>批次入库(吨)</TableHead>
          <TableHead className={`${NUMERIC} w-[110px] min-w-[110px]`}>当前可用(吨)</TableHead>
          <TableHead className={`${NUMERIC} w-[110px] min-w-[110px]`}>流转冻结(吨)</TableHead>
          <TableHead className="w-[130px] min-w-[130px]">入库时间</TableHead>
          <TableHead
            className="sticky right-0 z-10 border-l border-border/60 bg-[#f7f8fa] px-2 text-center"
            style={actionColStyle}
          >
            操作
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
              暂无匹配理货堆放数据
            </TableCell>
          </TableRow>
        ) : (
          data.map((mainItem, index) => {
            const isExpanded = expandedIds.has(mainItem.id)
            const actions: TableRowActionItem[] = [
              {
                key: "qr",
                label: "二维码",
                title: "查看该批次垛位的防伪二维码",
                onClick: () => onViewQr(mainItem),
              },
            ]

            return (
              <React.Fragment key={mainItem.id}>
                <TableRow className="group h-[72px]">
                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground"
                      onClick={() => toggleExpand(mainItem.id)}
                      title={isExpanded ? "收起子码明细" : "展开子码明细"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </Button>
                  </TableCell>

                  <TableCell>
                    <InboundDocNoCell docNo={mainItem.inboundOrderNo} wrap />
                    <div className="mt-0.5 text-[13px] text-muted-foreground">
                      主码：{mainItem.mainCode}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-foreground">{mainItem.specification}</div>
                    <div className="mt-0.5 text-[13px] text-muted-foreground">
                      {mainItem.category} / {mainItem.variety}
                    </div>
                  </TableCell>

                  <TableCell className="text-foreground">{mainItem.warehouseName}</TableCell>

                  <TableCell>
                    <div className="text-foreground">{mainItem.ownerName}</div>
                    <div className="mt-0.5 text-[13px] text-muted-foreground">
                      {mainItem.ownerIdentifierMasked}
                    </div>
                  </TableCell>

                  <TableCell className={NUMERIC}>{mainItem.initialQuantity.toFixed(3)}</TableCell>
                  <TableCell className={`${NUMERIC} text-foreground`}>
                    {mainItem.availableQuantity.toFixed(3)}
                  </TableCell>
                  <TableCell className={`${NUMERIC} text-amber-600`}>
                    {mainItem.frozenQuantity.toFixed(3)}
                  </TableCell>

                  <TableCell>
                    <TableDateTimeCell value={mainItem.inboundDate} stackedPlain />
                  </TableCell>

                  <TableCell className={STICKY_ACTION_CLASS} style={actionColStyle}>
                    <TableRowActionPanel actions={actions} fixedCols={1} />
                  </TableCell>
                </TableRow>

                {isExpanded && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={10} className="bg-muted/20 p-0">
                      <div className="px-6 py-4">
                        <div className="overflow-hidden rounded-md border border-border bg-card">
                          <div className="border-b border-border bg-[#f7f8fa] px-4 py-2.5 text-[13px] font-semibold text-foreground">
                            物理货位堆放子码明细（共 {mainItem.subItems.length} 个垛位）
                          </div>
                          <table className="w-full border-collapse text-[13px] text-foreground">
                            <thead>
                              <tr className="h-10 bg-[#f7f8fa] text-left text-[13px] font-semibold text-[#4e5969]">
                                <th className="px-4 font-semibold">货位存货条码（子码）</th>
                                <th className="px-4 font-semibold">物理空间落位（库房 / 分区 / 垛位）</th>
                                <th className="px-4 text-right font-semibold">期初堆放(吨)</th>
                                <th className="px-4 text-right font-semibold">当前可用(吨)</th>
                                <th className="px-4 text-right font-semibold">审批冻结(吨)</th>
                                <th className="px-4 font-semibold">状态说明</th>
                              </tr>
                            </thead>
                            <tbody>
                              {mainItem.subItems.map((sub) => (
                                <tr
                                  key={sub.subId}
                                  className="h-11 border-t border-[#f2f3f5] hover:bg-[#f7faff]"
                                >
                                  <td className="px-4 text-foreground">{sub.subCode}</td>
                                  <td className="px-4">
                                    {sub.isVirtual ? (
                                      <span className="inline-flex rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[13px] text-amber-700">
                                        未指定库房 / 虚拟未分配垛位（兜底）
                                      </span>
                                    ) : (
                                      <span>
                                        {sub.houseName} · {sub.partitionName} ·{" "}
                                        <span className="font-medium text-foreground">
                                          {sub.locationCode}
                                        </span>
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 text-right tabular-nums">
                                    {sub.initialQuantity.toFixed(3)}
                                  </td>
                                  <td className="px-4 text-right tabular-nums text-foreground">
                                    {sub.availableQuantity.toFixed(3)}
                                  </td>
                                  <td className="px-4 text-right tabular-nums text-amber-600">
                                    {sub.frozenQuantity.toFixed(3)}
                                  </td>
                                  <td className="px-4 text-muted-foreground">{sub.statusText}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
