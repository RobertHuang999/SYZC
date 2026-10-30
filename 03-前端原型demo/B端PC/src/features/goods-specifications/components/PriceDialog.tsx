import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import type { GoodsSku, Subcategory } from "../domain/types"
import {
  formatPriceDisplay,
  formatPriceWan,
  formatPriceYuan,
  formatSpecSummary,
  parsePriceInput,
} from "../lib/format"
import {
  GOODS_SPEC_PRICE_NOTE,
  GOODS_USER_PRICE_HINT,
} from "../lib/goods-spec-ui-labels"

type PriceDialogProps = {
  open: boolean
  sku?: GoodsSku
  subcategory?: Subcategory
  categoryName?: string
  onOpenChange: (open: boolean) => void
  onSave: (price: number) => void
}

export function PriceDialog({
  open,
  sku,
  subcategory,
  categoryName,
  onOpenChange,
  onSave,
}: PriceDialogProps) {
  const [view, setView] = useState<"form" | "history">("form")
  const [priceInput, setPriceInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setView("form")
    setPriceInput(sku?.price != null ? String(sku.price) : "")
    setError(null)
  }, [open, sku])

  const history = useMemo(
    () =>
      sku
        ? [...sku.priceHistory].sort((left, right) =>
          right.operatedAt.localeCompare(left.operatedAt)
        )
        : [],
    [sku]
  )

  const handleSave = () => {
    const parsed = parsePriceInput(priceInput)
    if (parsed == null) {
      setError("请输入不小于 0 的数字，最多保留 2 位小数")
      return
    }
    onSave(parsed)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl sm:max-w-2xl overflow-y-auto">
        <DialogHeader className="pr-10">
          {view === "form" ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                <DialogTitle>设置价格</DialogTitle>
                <DialogDescription className="mt-1">
                  维护该货品在平台中的系统参考单价，设价后自动记录操作留痕。
                </DialogDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 text-xs"
                onClick={() => setView("history")}
              >
                修改记录
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setView("form")}
                  >
                    返回设置
                  </Button>
                  <div className="h-4 w-px bg-border" />
                  <DialogTitle>价格修改记录</DialogTitle>
                </div>
                <Badge variant="outline" className="text-xs font-normal">
                  共 {history.length} 条记录
                </Badge>
              </div>
              <DialogDescription className="mt-1">
                {subcategory?.name ?? "货品"} · {sku ? formatSpecSummary(sku, subcategory) : ""} · 历史单价调整审计留痕
              </DialogDescription>
            </div>
          )}
        </DialogHeader>

        {!sku ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            未找到货品信息
          </div>
        ) : view === "form" ? (
          <div className="space-y-4 py-1">
            <div className="grid gap-3 rounded-lg border bg-muted/20 p-3 sm:grid-cols-2">
              <InfoItem label="所属大类" value={categoryName ?? "—"} />
              <InfoItem label="所属品类" value={subcategory?.name ?? "—"} />
              <InfoItem
                label="规格参数"
                value={formatSpecSummary(sku, subcategory)}
                className="sm:col-span-2"
              />
              <InfoItem
                label="当前参考单价"
                value={formatPriceDisplay(sku.price, sku.measureUnit, "YUAN")}
                className="sm:col-span-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku-price-input">
                <span className="mr-1 font-bold text-destructive">*</span>
                参考单价
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sku-price-input"
                  inputMode="decimal"
                  value={priceInput}
                  placeholder="请输入参考单价，例如：3650.00"
                  onChange={(event) => {
                    setPriceInput(event.target.value)
                    if (error) setError(null)
                  }}
                  aria-invalid={Boolean(error)}
                />
                <span className="shrink-0 text-sm text-muted-foreground">
                  元/{sku.measureUnit}
                </span>
              </div>
              <ProductFieldHint>{GOODS_USER_PRICE_HINT}</ProductFieldHint>
              {error ? <p className="text-xs text-destructive">{error}</p> : null}
            </div>

            <PrototypeSpecCallout>{GOODS_SPEC_PRICE_NOTE}</PrototypeSpecCallout>
          </div>
        ) : (
          <div className="space-y-3 py-1">
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="h-9 hover:bg-transparent bg-slate-100 dark:bg-slate-800">
                    <TableHead className="w-16 text-center">序号</TableHead>
                    <TableHead className="w-60">价格</TableHead>
                    <TableHead className="w-28">操作人</TableHead>
                    <TableHead className="min-w-[170px]">操作时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-28 text-center text-muted-foreground"
                      >
                        暂无修改记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((entry, index) => (
                      <TableRow key={entry.id || index} className="h-10 hover:bg-muted/40">
                        <TableCell className="text-center text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-foreground whitespace-nowrap">
                          <span>
                            {formatPriceYuan(entry.price)} 元/{entry.unit || sku.measureUnit}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground font-normal">
                            ({formatPriceWan(entry.price)} 万元)
                          </span>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {entry.operator || "系统管理员"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          <TableDateTimeCell value={entry.operatedAt} plain />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          {view === "form" ? (
            <>
              <div className="text-xs text-muted-foreground">
                设价后即时生效并写入调价审计历史
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  取消
                </Button>
                <Button size="sm" onClick={handleSave}>
                  保存
                </Button>
              </div>
            </>
          ) : (
            <>
              <span className="text-xs text-muted-foreground">
                共 {history.length} 条修改记录，审计只读留痕。
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setView("form")}
                >
                  返回设置
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  关闭
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  )
}
