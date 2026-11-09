import { useState, useEffect, useMemo } from "react"
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ProcessingRecord } from "../domain/types"
import type {
  CompleteInputItemState,
  CompleteOutputItemState,
  CompleteProcessingFormState,
} from "../domain/form-types"
import { formatCurrency, formatQuantity } from "../lib/processing-calculator"

interface CompleteProcessingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: ProcessingRecord | null
  onSuccess: (updatedRecord: ProcessingRecord) => void
}

export function CompleteProcessingDialog({
  open,
  onOpenChange,
  record,
  onSuccess,
}: CompleteProcessingDialogProps) {
  const [inputs, setInputs] = useState<CompleteInputItemState[]>([])
  const [outputs, setOutputs] = useState<CompleteOutputItemState[]>([])
  const [lossRatio, setLossRatio] = useState<string>("1.2")
  const [lossReason, setLossReason] = useState<string>(
    "切割下料氧化烧损与正常切口余料损耗，符合工艺技术标准。"
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 当打开弹窗时，从 record 初始化数据
  useEffect(() => {
    if (!record || !open) return

    // 1. 初始化投入项
    const initialInputs: CompleteInputItemState[] = []
    for (const group of record.inputGoodsGroups) {
      for (const d of group.details) {
        const locked = d.lockedAmount ?? d.planAmount
        initialInputs.push({
          detailId: d.id,
          groupId: group.id,
          goodsName: group.goodsName,
          barcode: d.barcode,
          lockedAmount: locked,
          actualAmount: d.actualAmount ?? locked, // 默认同锁定量
          unit: d.unit,
        })
      }
    }
    setInputs(initialInputs)

    // 2. 初始化产出项
    const initialOutputs: CompleteOutputItemState[] = record.outputGoodsItems.map(
      (item) => ({
        itemId: item.id,
        goodsName: item.goodsName,
        specModel: item.specModel,
        unit: item.unit,
        expectedQty: item.expectedQty,
        actualQty: item.actualQty ?? item.expectedQty,
        warehouseLocation:
          item.warehouseLocation ||
          `${record.warehouseName}-B库房-精加工成品区`,
        specificLocation: item.specificLocation || "B-01-01",
        price: item.price,
        otherInfo: item.otherInfo,
        collectAttrs: item.collectAttrs
          ? item.collectAttrs.map((attr) => ({ ...attr, value: attr.value || "" }))
          : [],
      })
    )
    setOutputs(initialOutputs)

    setLossRatio(record.lossRatio?.toString() || "1.2")
    setLossReason(
      record.lossReason ||
        "切割下料氧化烧损与正常切口余料损耗，符合工艺技术标准。"
    )
    setErrorMessage(null)
  }, [record, open])

  // 校验与输入处理
  const handleInputChange = (index: number, val: string) => {
    setInputs((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], actualAmount: val }
      return copy
    })
  }

  const handleOutputQtyChange = (index: number, val: string) => {
    setOutputs((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], actualQty: val }
      return copy
    })
  }

  const handleOutputSpecificLocationChange = (index: number, val: string) => {
    setOutputs((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], specificLocation: val }
      return copy
    })
  }

  const handleDynamicAttrChange = (
    outputIdx: number,
    attrIdx: number,
    val: string
  ) => {
    setOutputs((prev) => {
      const copy = [...prev]
      const targetItem = { ...copy[outputIdx] }
      const attrs = [...targetItem.collectAttrs]
      attrs[attrIdx] = { ...attrs[attrIdx], value: val }
      targetItem.collectAttrs = attrs
      copy[outputIdx] = targetItem
      return copy
    })
  }

  // 试算实际产出总金额
  const totalActualAmount = useMemo(() => {
    let sum = 0
    let hasUnpriced = false
    for (const out of outputs) {
      const qty = parseFloat(String(out.actualQty)) || 0
      if (typeof out.price === "number" && out.price > 0) {
        sum += qty * out.price
      } else {
        hasUnpriced = true
      }
    }
    return {
      sum: parseFloat(sum.toFixed(2)),
      hasUnpriced,
    }
  }, [outputs])

  // 提交完成加工
  const handleConfirm = () => {
    if (!record) return

    // 1. 校验投入消耗量 (R23)
    for (const inp of inputs) {
      const val = parseFloat(String(inp.actualAmount))
      if (isNaN(val) || val <= 0) {
        setErrorMessage(
          `投入货物「${inp.goodsName}」实际消耗数量必须大于 0，严禁录入 0 或负数。若完全未使用需作废加工单。`
        )
        return
      }
      if (val > inp.lockedAmount) {
        setErrorMessage(
          `投入货物「${inp.goodsName}」实际消耗量 (${val}) 不得超过锁定数量 (${inp.lockedAmount})。`
        )
        return
      }
    }

    // 2. 校验产出数量与具体位置 (R21, R22)
    for (const out of outputs) {
      const qty = parseFloat(String(out.actualQty))
      if (isNaN(qty) || qty <= 0) {
        setErrorMessage(`产出货物「${out.goodsName}」实际产出数量必须大于 0。`)
        return
      }
      if (!out.specificLocation.trim()) {
        setErrorMessage(`产出货物「${out.goodsName}」的具体位置必须填写。`)
        return
      }
      // 动态采集必填属性校验
      for (const attr of out.collectAttrs) {
        if (attr.required && !attr.value?.trim()) {
          setErrorMessage(
            `产出货物「${out.goodsName}」的动态采集属性「${attr.label}」为必填项。`
          )
          return
        }
      }
    }

    // 3. 校验损耗 (R25)
    const ratioNum = parseFloat(lossRatio)
    if (isNaN(ratioNum) || ratioNum < 0 || ratioNum > 100) {
      setErrorMessage("加工损耗比例必须在 0% ~ 100% 之间。")
      return
    }
    if (!lossReason.trim()) {
      setErrorMessage("必须填写加工损耗说明（上限 500 字）。")
      return
    }

    // 构建更新后的加工记录实体
    const updatedInputs = record.inputGoodsGroups.map((group) => {
      return {
        ...group,
        details: group.details.map((d) => {
          const matched = inputs.find((i) => i.detailId === d.id)
          const actual = matched ? parseFloat(String(matched.actualAmount)) : d.planAmount
          const locked = d.lockedAmount ?? d.planAmount
          return {
            ...d,
            actualAmount: actual,
            releasedAmount: parseFloat((locked - actual).toFixed(4)),
          }
        }),
      }
    })

    const updatedOutputs = record.outputGoodsItems.map((item, idx) => {
      const matched = outputs[idx]
      const actualQty = matched ? parseFloat(String(matched.actualQty)) : item.expectedQty
      const lineAmount =
        typeof item.price === "number" ? parseFloat((actualQty * item.price).toFixed(2)) : null

      return {
        ...item,
        actualQty,
        actualAmount: lineAmount,
        warehouseLocation: matched ? matched.warehouseLocation : item.warehouseLocation,
        specificLocation: matched ? matched.specificLocation : item.specificLocation,
        collectAttrs: matched ? matched.collectAttrs : item.collectAttrs,
        barcode: `TM-${Date.now().toString().slice(-8)}-${idx + 1}`,
      }
    })

    const updatedRecord: ProcessingRecord = {
      ...record,
      status: "COMPLETED",
      lossRatio: ratioNum,
      lossReason: lossReason.trim(),
      version: record.version + 1,
      inputGoodsGroups: updatedInputs,
      outputGoodsItems: updatedOutputs,
      modifyRecord: {
        type: "COMPLETED",
        operatorName: "现场监管员-赵铁柱",
        operatorOrg: "森云智能仓储监管部",
        operateTime: new Date().toISOString().replace("T", " ").slice(0, 19),
        lossRatio: ratioNum,
        lossReason: lossReason.trim(),
      },
    }

    onSuccess(updatedRecord)
    onOpenChange(false)
  }

  if (!record) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-foreground">
            完成加工并入库登记
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            加工单号：{record.id} ｜ 实体仓库：{record.warehouseName} ｜ 货主：{record.ownerName}
          </DialogDescription>
        </DialogHeader>

        {/* 顶部警示条 */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span className="font-medium">实际结果确认后不支持业务冲正。</span>
          </div>

          {record.associatedOrderId && (
            <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
              <Info className="h-4 w-4 shrink-0" />
              <span>
                ⓘ 当前投入库存已被锁定，完成后全部产出将自动归类至融资监管单据：
                <strong>{record.associatedOrderId}</strong>（货权无缝继承）。
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1 mt-2">
          {/* 1. 实际投入表 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                实际投入消耗核实
              </h4>
              <span className="text-[11px] text-muted-foreground">
                每条实际消耗必须大于 0 且不超过锁定数量；若完全未使用需作废单据。
              </span>
            </div>

            <div className="border border-border/80 rounded-md overflow-hidden">
              <Table className="text-xs">
                <TableHeader className="bg-slate-50 dark:bg-slate-800">
                  <TableRow className="h-8">
                    <TableHead className="w-12 text-center">序号</TableHead>
                    <TableHead className="w-56">投入货物规格</TableHead>
                    <TableHead className="w-32">存货条码</TableHead>
                    <TableHead className="w-28 text-right">锁定数量</TableHead>
                    <TableHead className="w-36 text-right">实际消耗数量</TableHead>
                    <TableHead className="w-28 text-right">自动释放数量</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inputs.map((inp, idx) => {
                    const consumed = parseFloat(String(inp.actualAmount)) || 0
                    const released = Math.max(0, inp.lockedAmount - consumed)

                    return (
                      <TableRow key={inp.detailId} className="h-11">
                        <TableCell className="text-center text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-foreground">{inp.goodsName}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-foreground">{inp.barcode}</span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground">
                          {formatQuantity(inp.lockedAmount)} {inp.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Input
                              type="number"
                              min={0.0001}
                              max={inp.lockedAmount}
                              step="any"
                              value={inp.actualAmount}
                              className="h-7 w-24 text-right text-xs"
                              onChange={(e) => handleInputChange(idx, e.target.value)}
                            />
                            <span className="text-[11px] text-muted-foreground">
                              {inp.unit}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                          {formatQuantity(parseFloat(released.toFixed(4)))} {inp.unit}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 2. 实际产出及入库表（含动态采集属性） */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                实际产出及入库登记（含动态采集属性）
              </h4>
              <span className="text-[11px] text-muted-foreground">
                产出仓库必须与主表仓库强一致，具体位置必填。
              </span>
            </div>

            <div className="border border-border/80 rounded-md overflow-hidden">
              <Table className="text-xs">
                <TableHeader className="bg-slate-50 dark:bg-slate-800">
                  <TableRow className="h-8">
                    <TableHead className="w-10 text-center">序号</TableHead>
                    <TableHead className="w-44">产出货物 / 规格</TableHead>
                    <TableHead className="w-24 text-right">预计数量</TableHead>
                    <TableHead className="w-32 text-right">实际产出数量</TableHead>
                    <TableHead className="w-72">品类动态采集属性</TableHead>
                    <TableHead className="w-36">入库货位 / 具体位置</TableHead>
                    <TableHead className="w-24 text-right">参考单价</TableHead>
                    <TableHead className="w-28 text-right">产出金额</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outputs.map((out, idx) => {
                    const actualQty = parseFloat(String(out.actualQty)) || 0
                    const lineAmount =
                      typeof out.price === "number"
                        ? parseFloat((actualQty * out.price).toFixed(2))
                        : null

                    return (
                      <TableRow key={out.itemId} className="h-16 align-top">
                        <TableCell className="text-center pt-3 text-muted-foreground">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="pt-2.5">
                          <div className="font-medium text-foreground">{out.goodsName}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {out.specModel}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pt-3 font-normal text-muted-foreground">
                          {formatQuantity(out.expectedQty)} {out.unit}
                        </TableCell>
                        <TableCell className="text-right pt-2.5">
                          <div className="flex items-center justify-end gap-1">
                            <Input
                              type="number"
                              min={0.0001}
                              step="any"
                              value={out.actualQty}
                              className="h-7 w-20 text-right text-xs"
                              onChange={(e) => handleOutputQtyChange(idx, e.target.value)}
                            />
                            <span className="text-[11px] text-muted-foreground">
                              {out.unit}
                            </span>
                          </div>
                        </TableCell>
                        {/* 动态采集属性表单 */}
                        <TableCell className="pt-2">
                          <div className="space-y-1.5 bg-slate-50/80 p-2 rounded border border-border/60 dark:bg-slate-800/40">
                            {out.collectAttrs.length === 0 ? (
                              <span className="text-[11px] text-muted-foreground">
                                无品类专用属性要求
                              </span>
                            ) : (
                              out.collectAttrs.map((attr, aIdx) => (
                                <div
                                  key={attr.key}
                                  className="flex items-center justify-between gap-1 text-[11px]"
                                >
                                  <label className="text-muted-foreground shrink-0 w-24 truncate">
                                    {attr.required && (
                                      <span className="text-rose-500 mr-0.5">*</span>
                                    )}
                                    {attr.label}:
                                  </label>
                                  {attr.type === "select" && attr.options ? (
                                    <Select
                                      value={attr.value}
                                      onValueChange={(val) =>
                                        val && handleDynamicAttrChange(idx, aIdx, val)
                                      }
                                    >
                                      <SelectTrigger className="h-6 text-[11px] py-0 px-2 flex-1">
                                        <SelectValue placeholder="请选择" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {attr.options.map((opt) => (
                                          <SelectItem key={opt} value={opt} className="text-xs">
                                            {opt}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <div className="flex items-center gap-1 flex-1">
                                      <Input
                                        value={attr.value}
                                        type={attr.type === "date" ? "date" : "text"}
                                        placeholder={`请输入${attr.label}`}
                                        className="h-6 text-[11px] px-1.5 flex-1"
                                        onChange={(e) =>
                                          handleDynamicAttrChange(idx, aIdx, e.target.value)
                                        }
                                      />
                                      {attr.unit && (
                                        <span className="text-[10px] text-muted-foreground">
                                          {attr.unit}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </TableCell>
                        {/* 货位位置与具体位置 */}
                        <TableCell className="pt-2 space-y-1">
                          <div className="text-[11px] text-foreground font-medium truncate">
                            {out.warehouseLocation}
                          </div>
                          <Input
                            value={out.specificLocation}
                            placeholder="* 具体库位(必填)"
                            maxLength={20}
                            className="h-6 text-[11px] px-1.5"
                            onChange={(e) =>
                              handleOutputSpecificLocationChange(idx, e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-right pt-3 font-normal text-muted-foreground">
                          {formatCurrency(out.price)}
                        </TableCell>
                        <TableCell className="text-right pt-3 font-medium text-foreground">
                          {formatCurrency(lineAmount)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <div className="text-muted-foreground">
                新存货条码将于入库成功后由系统自动签发生成。
              </div>
              <div className="flex items-center gap-2">
                <span>实际产出总金额：</span>
                <span className="text-sm font-bold text-primary">
                  {formatCurrency(totalActualAmount.sum)}
                </span>
                {totalActualAmount.hasUnpriced && (
                  <span className="text-[11px] text-amber-600">
                    (存在未定价货品，未计入总额)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. 加工损耗信息 */}
          <div className="rounded-md border border-border/80 p-3 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                加工损耗留痕
              </h4>
              <span className="text-[11px] text-muted-foreground">
                完成时记录留痕，不参与库存、金额或抵质押率计算。
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-medium text-foreground">
                  <span className="text-rose-500 mr-0.5">*</span>损耗比例 (%)
                </label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={lossRatio}
                    placeholder="如 1.5"
                    className="h-8 text-xs"
                    onChange={(e) => setLossRatio(e.target.value)}
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    <span className="text-rose-500 mr-0.5">*</span>损耗原因说明
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    {lossReason.length}/500
                  </span>
                </div>
                <Textarea
                  value={lossReason}
                  maxLength={500}
                  rows={2}
                  placeholder="请详细说明加工产生的物理损耗原因（最多500字）"
                  className="text-xs"
                  onChange={(e) => setLossReason(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleConfirm}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            完成加工并入库
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
