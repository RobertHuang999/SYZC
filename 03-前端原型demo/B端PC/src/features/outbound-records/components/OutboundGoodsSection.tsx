import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, Trash2 } from "lucide-react"
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
  const isRelated = type === "仓单出库" || type === "质押出库" || type === "抵押出库"

  // 普通出库展开的主行 ID
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({
    "PICK-1": true,
  })

  const toggleExpandRow = (id: string) => {
    setExpandedRowIds((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Card className="shadow-xs">
      {/* 头部折叠开关 */}
      <div className="flex items-center justify-between border-b px-5 py-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
          onClick={onToggle}
        >
          {expanded ? (
            <ChevronUpIcon className="size-4 text-primary" />
          ) : (
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          )}
          货品明细
          <span className="text-xs text-muted-foreground font-normal">
            {isRelated
              ? "（由关联单据带出，首列独立勾选参与出库）"
              : "（普通选货入库位置扣减明细）"}
          </span>
        </button>

        {/* 普通出库提供添加货品入口，关联出库不提供 (O01 / O02) */}
        {!isRelated && (
          <Button
            type="button"
            size="sm"
            onClick={onOpenGoodsPicker}
            className="h-8 gap-1 text-xs"
          >
            <PlusIcon className="size-3.5" />
            添加货品
          </Button>
        )}
      </div>

      {expanded && (
        <CardContent className="p-5">
          {goodsList.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              {isRelated
                ? "暂无关联货品，请在上文选择关联单号并填充"
                : "暂无货品数据，请点击右上角【添加货品】选择可用库存"}
            </div>
          ) : isRelated ? (
            /* 关联出库明细表 (仓单/质押/抵押) */
            <div className="overflow-x-auto rounded-md border">
              <Table className="min-w-[800px] text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-12 text-center">选择</TableHead>
                    <TableHead className="w-12 text-center">序号</TableHead>
                    <TableHead className="min-w-[160px]">货物名称</TableHead>
                    <TableHead className="min-w-[180px]">货物位置</TableHead>
                    <TableHead className="w-28 text-right">可用数量</TableHead>
                    <TableHead className="w-24 text-right">单价 (元)</TableHead>
                    <TableHead className="w-36 text-center">出库数量</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goodsList.map((row, idx) => (
                    <TableRow
                      key={row.id || idx}
                      className={row.selected ? "bg-muted/20" : "opacity-60"}
                    >
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
                      <TableCell className="text-muted-foreground font-mono">
                        {row.locationPath || "—"}
                      </TableCell>
                      <TableCell className="text-right font-mono text-foreground">
                        {row.availableAmount?.toLocaleString()} {row.unit}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {row.price ? `¥${row.price.toLocaleString()}` : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number"
                            min={0}
                            max={row.availableAmount || 999999}
                            disabled={!row.selected}
                            placeholder="请输入"
                            value={row.totalOutboundAmount || ""}
                            onChange={(e) =>
                              onUpdateGoodsAmount(
                                row.id,
                                Number(e.target.value) || 0
                              )
                            }
                            className={`h-7 w-24 text-xs font-mono text-center ${
                              !row.selected ? "bg-muted/40 text-muted-foreground" : ""
                            }`}
                          />
                          <span className="text-muted-foreground text-[11px]">
                            {row.unit}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* 普通出库明细表 (二级位置分组展开) */
            <div className="space-y-3">
              {goodsList.map((item) => {
                const isItemExpanded = !!expandedRowIds[item.id]
                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-md border"
                  >
                    {/* 一级汇总行 */}
                    <div className="flex items-center justify-between bg-muted/30 px-4 py-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleExpandRow(item.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {isItemExpanded ? (
                            <ChevronDownIcon className="size-4" />
                          ) : (
                            <ChevronUpIcon className="size-4" />
                          )}
                        </button>
                        <span className="font-semibold text-foreground">
                          {item.goodsName}
                        </span>
                        <span className="text-muted-foreground">
                          （共 {item.locations?.length || 0} 个存放位置）
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          出库小计：
                          <strong className="font-mono text-primary ml-1">
                            {item.totalOutboundAmount} {item.unit}
                          </strong>
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveGoodsLine(item.id)}
                          className="size-7 text-muted-foreground hover:text-destructive"
                          title="移除该货品"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* 二级库位明细表格 */}
                    {isItemExpanded && item.locations && (
                      <Table className="text-xs">
                        <TableHeader>
                          <TableRow className="bg-muted/10 text-[11px]">
                            <TableHead className="w-12 text-center">序号</TableHead>
                            <TableHead>库位路径</TableHead>
                            <TableHead>条码</TableHead>
                            <TableHead className="text-right">可用库存</TableHead>
                            <TableHead className="w-36 text-center">
                              本次出库量
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item.locations.map((loc, lIdx) => (
                            <TableRow key={loc.id}>
                              <TableCell className="text-center text-muted-foreground">
                                {lIdx + 1}
                              </TableCell>
                              <TableCell className="font-mono text-muted-foreground">
                                {loc.locationPath}
                              </TableCell>
                              <TableCell className="font-mono">
                                {loc.barcode}
                              </TableCell>
                              <TableCell className="text-right font-mono text-foreground">
                                {loc.availableAmount} {loc.unit}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Input
                                    type="number"
                                    min={0}
                                    max={loc.availableAmount}
                                    value={loc.outboundAmount || ""}
                                    onChange={(e) => {
                                      const val = Number(e.target.value) || 0
                                      loc.outboundAmount = val
                                      const sum = item.locations!.reduce(
                                        (s, l) => s + (l.outboundAmount || 0),
                                        0
                                      )
                                      onUpdateGoodsAmount(item.id, sum)
                                    }}
                                    className="h-7 w-20 text-xs font-mono text-center"
                                  />
                                  <span className="text-muted-foreground text-[11px]">
                                    {loc.unit}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
