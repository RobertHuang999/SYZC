import { LineChartIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableRowActionPanel } from "@/shared/components/TableRowActionPanel"
import type { GoodsSku, PriceDisplayUnit, Subcategory } from "../domain/types"
import { formatPriceDisplay } from "../lib/format"
import { effectiveInvalidReason, isSkuEffectivelyEnabled } from "../lib/store"
import { StatusBadge } from "./StatusBadge"

type GoodsTableProps = {
  subcategory?: Subcategory
  skus: GoodsSku[]
  pageStart: number
  priceUnit: PriceDisplayUnit
  onOpenPriceTrend: (sku: GoodsSku) => void
  onDetail: (sku: GoodsSku) => void
  onEdit: (sku: GoodsSku) => void
  onToggleStatus: (sku: GoodsSku) => void
  onSetPrice: (sku: GoodsSku) => void
  onDelete: (sku: GoodsSku) => void
}

export function GoodsTable({
  subcategory,
  skus,
  pageStart,
  priceUnit,
  onOpenPriceTrend,
  onDetail,
  onEdit,
  onToggleStatus,
  onSetPrice,
  onDelete,
}: GoodsTableProps) {
  const dimensions = subcategory?.specDimensions ?? []
  const columnCount = 8 + dimensions.length

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table className="min-w-[1180px]">
        <TableHeader>
          <TableRow className="h-10 hover:bg-transparent bg-slate-100 dark:bg-slate-800">
            <TableHead className="w-16 px-3 py-2.5 text-center">序号</TableHead>
            <TableHead className="w-28 px-3 py-2.5">品类</TableHead>
            {dimensions.map((dimension) => (
              <TableHead key={dimension} className="min-w-24 px-3 py-2.5">
                {dimension}
              </TableHead>
            ))}
            <TableHead className="w-32 whitespace-nowrap px-3 py-2.5">计量参数</TableHead>
            <TableHead className="min-w-36 px-3 py-2.5">其他收集信息</TableHead>
            <TableHead className="w-40 whitespace-nowrap px-3 py-2.5">单价</TableHead>
            <TableHead className="w-20 px-3 py-2.5 text-center">状态</TableHead>
            <TableHead className="w-52 px-3 py-2.5 text-center sticky right-0 bg-slate-100 dark:bg-slate-800 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)]">
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skus.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columnCount}
                className="h-32 text-center text-muted-foreground"
              >
                当前品类下暂无货品，点击右上角「添加货品」创建第一条
              </TableCell>
            </TableRow>
          ) : (
            skus.map((sku, index) => {
              const effective = isSkuEffectivelyEnabled(sku)
              const invalidReason = effectiveInvalidReason(sku)

              return (
                <TableRow key={sku.id} className="group h-14 hover:bg-muted/40">
                  <TableCell className="px-3 py-2.5 text-center text-muted-foreground">
                    {pageStart + index + 1}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-2.5">
                    {subcategory?.name ?? "—"}
                  </TableCell>
                  {dimensions.map((dimension) => (
                    <TableCell key={dimension} className="whitespace-nowrap px-3 py-2.5">
                      {sku.specValues[dimension] || "—"}
                    </TableCell>
                  ))}
                  <TableCell className="whitespace-nowrap px-3 py-2.5 text-foreground">
                    {sku.measureParam}({sku.measureUnit})
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-foreground">
                    <InboundSummaryCell sku={sku} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-2.5">
                    {sku.price != null ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-left font-medium text-foreground hover:text-primary transition-colors"
                        title="查看价格趋势"
                        onClick={() => onOpenPriceTrend(sku)}
                      >
                        <span>
                          {formatPriceDisplay(sku.price, sku.measureUnit, priceUnit)}
                        </span>
                        <LineChartIcon className="size-3.5 text-primary" />
                      </button>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <StatusBadge status={sku.status} />
                      {sku.status === "ENABLED" && !effective ? (
                        <span className="text-[11px] text-slate-500">
                          {invalidReason ?? "上级停用"}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-center sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-slate-50 z-10 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)]">
                    <TableRowActionPanel
                      actions={[
                        {
                          key: "detail",
                          label: "详情",
                          onClick: () => onDetail(sku),
                        },
                        {
                          key: "edit",
                          label: "编辑",
                          onClick: () => onEdit(sku),
                        },
                        {
                          key: "status",
                          label: sku.status === "ENABLED" ? "停用" : "启用",
                          onClick: () => onToggleStatus(sku),
                        },
                        {
                          key: "price",
                          label: "设置价格",
                          onClick: () => onSetPrice(sku),
                        },
                        {
                          key: "delete",
                          label: "删除",
                          tone: "danger",
                          onClick: () => onDelete(sku),
                        },
                      ]}
                      fixedCols={3}
                    />
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

function InboundSummaryCell({ sku }: { sku: GoodsSku }) {
  if (sku.inboundCollect.length === 0) {
    return <span className="text-muted-foreground">--</span>
  }

  const textSummary = sku.inboundCollect.map((item) => item.label).join("、")

  return (
    <span
      className="text-sm text-foreground/90"
      title={sku.inboundCollect
        .map((item) => `${item.label}${item.required ? "（必填）" : ""}`)
        .join("，")}
    >
      {textSummary}
    </span>
  )
}
