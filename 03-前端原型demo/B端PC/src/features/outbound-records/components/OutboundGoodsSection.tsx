import { Fragment, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon, PackageOpen, PlusIcon, QrCode } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { OutboundGoodsItem, OutboundTypeName } from "../domain/types"

interface OutboundGoodsSectionProps {
  type: OutboundTypeName
  goodsList: OutboundGoodsItem[]
  relatedNo?: string
  expanded: boolean
  onToggle: () => void
  onOpenGoodsPicker: () => void
  onRemoveGoodsLine: (goodsId: string) => void
  onToggleGoodsSelect: (goodsId: string, selected: boolean) => void
  onUpdateGoodsAmount: (goodsId: string, amount: number) => void
}

export function OutboundGoodsSection({
  type,
  goodsList,
  relatedNo: _relatedNo,
  expanded,
  onToggle,
  onOpenGoodsPicker,
  onRemoveGoodsLine,
  onToggleGoodsSelect,
  onUpdateGoodsAmount,
}: OutboundGoodsSectionProps) {
  const isNormal = type === "普通出库"

  // 展开的主行 ID
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({})

  const toggleExpandRow = (id: string) => {
    setExpandedRowIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Card className="shadow-xs">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          onClick={onToggle}
        >
          {expanded ? (
            <ChevronUpIcon className="size-4 text-primary" />
          ) : (
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          )}
          货品明细 ({goodsList.length} 项)
        </button>

        {isNormal ? (
          <Button type="button" size="sm" className="gap-1.5" onClick={onOpenGoodsPicker}>
            <PlusIcon className="size-4" />
            添加货品
          </Button>
        ) : null}
      </div>

      {expanded && (
        <CardContent className="space-y-4 pt-5 pb-6 text-xs">
          {/* 普通出库表格 */}
          {isNormal ? (
            <div className="overflow-x-auto rounded-md border">
              <Table className="w-full text-xs">
                <TableHeader className="bg-muted/50 text-muted-foreground">
                  <TableRow>
                    <TableHead className="w-12 text-center">序号</TableHead>
                    <TableHead>货物名称</TableHead>
                    <TableHead className="w-28 text-right">出库数量</TableHead>
                    <TableHead className="w-20 text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goodsList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <PackageOpen className="size-10 text-muted-foreground/50 mb-2" />
                          <p className="text-sm font-medium text-foreground">暂无货品明细</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            请先选择货主，再点击右上角「添加货品」从可用库存选货
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    goodsList.map((item, idx) => {
                      const isRowExpanded = !!expandedRowIds[item.id]

                      return (
                        <Fragment key={item.id}>
                          <TableRow className="hover:bg-muted/30">
                            <TableCell className="text-center text-muted-foreground">
                              {idx + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleExpandRow(item.id)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {isRowExpanded ? (
                                    <ChevronDownIcon className="size-3.5" />
                                  ) : (
                                    <ChevronUpIcon className="size-3.5 rotate-90" />
                                  )}
                                </button>
                                <span className="font-medium text-foreground">
                                  {item.goodsName}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  ({item.locations?.length || 0} 个库位)
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold text-primary">
                              {item.totalOutboundAmount} {item.unit}
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                type="button"
                                onClick={() => onRemoveGoodsLine(item.id)}
                                className="text-primary hover:underline"
                              >
                                移除
                              </button>
                            </TableCell>
                          </TableRow>

                          {isRowExpanded && item.locations && (
                            <TableRow className="bg-muted/20">
                              <TableCell colSpan={4} className="p-3 pl-8">
                                <table className="w-full text-[11px] border rounded-md bg-card">
                                  <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                      <th className="p-1.5 w-10 text-center">序号</th>
                                      <th className="p-1.5 text-left">位置</th>
                                      <th className="p-1.5 text-left">具体位置</th>
                                      <th className="p-1.5 text-left">入库时间</th>
                                      <th className="p-1.5 text-left">其他信息</th>
                                      <th className="p-1.5 text-center">存货条码</th>
                                      <th className="p-1.5 text-center">状态</th>
                                      <th className="p-1.5 text-right w-24">出库数量</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border">
                                    {item.locations.map((loc, lIdx) => (
                                      <tr key={loc.id}>
                                        <td className="p-1.5 text-center text-muted-foreground">
                                          {lIdx + 1}
                                        </td>
                                        <td className="p-1.5 text-foreground">
                                          {loc.locationPath}
                                        </td>
                                        <td className="p-1.5 text-muted-foreground">
                                          {loc.specificLocation || "--"}
                                        </td>
                                        <td className="p-1.5 text-muted-foreground">
                                          {loc.inboundTime}
                                        </td>
                                        <td className="p-1.5 text-muted-foreground">
                                          {loc.extraInfo || "--"}
                                        </td>
                                        <td className="p-1.5 text-center">
                                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                                            <QrCode className="size-3 text-primary" />
                                            {loc.barcode}
                                          </span>
                                        </td>
                                        <td className="p-1.5 text-center">
                                          <span className="text-emerald-600 dark:text-emerald-400">
                                            {loc.status}
                                          </span>
                                        </td>
                                        <td className="p-1.5 text-right font-medium text-primary">
                                          {loc.outboundAmount} {loc.unit}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* 关联出库明细表 (仓单/质押/抵押) */
            <div className="overflow-x-auto rounded-md border">
              <Table className="w-full text-xs">
                <TableHeader className="bg-muted/50 text-muted-foreground">
                  <TableRow>
                    <TableHead className="w-12 text-center">选择</TableHead>
                    <TableHead className="w-12 text-center">序号</TableHead>
                    <TableHead>货物名称</TableHead>
                    <TableHead>货物位置</TableHead>
                    <TableHead className="w-24 text-right">可用数量</TableHead>
                    <TableHead className="w-24 text-right">单价 (元)</TableHead>
                    <TableHead className="w-32 text-center">出库数量</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goodsList.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-28 text-center text-muted-foreground text-xs"
                      >
                        暂无关联货品，请在上文选择关联业务单号
                      </TableCell>
                    </TableRow>
                  ) : (
                    goodsList.map((row, idx) => (
                      <TableRow key={row.id || idx}>
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={!!row.selected}
                            onChange={(e) =>
                              onToggleGoodsSelect(row.id, e.target.checked)
                            }
                            className="size-4 rounded text-primary focus:ring-primary cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {row.goodsName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.locationPath || "—"}
                        </TableCell>
                        <TableCell className="text-right text-foreground">
                          {row.availableAmount} {row.unit}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {row.price ? `¥${row.price.toLocaleString()}` : "未定价"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={0}
                            max={row.availableAmount}
                            disabled={!row.selected}
                            value={row.totalOutboundAmount || ""}
                            onChange={(e) =>
                              onUpdateGoodsAmount(row.id, Number(e.target.value) || 0)
                            }
                            className="h-7 w-20 text-xs text-center mx-auto"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
