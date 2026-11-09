import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react"
import {
  TRANSFER_STOCK_CANDIDATES,
} from "../mock/transfer-form.mock"
import type {
  TransferStockCandidate,
  TransferFormGoodsGroup,
} from "../domain/form-types"
import {
  WAREHOUSE_OPTIONS,
  GOODS_OPTIONS,
} from "../domain/constants"

interface TransferGoodsPickerModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (groups: TransferFormGoodsGroup[]) => void
  initialWarehouseId?: string // 若表单已确定单个仓库，锁定该仓库
}

export function TransferGoodsPickerModal({
  open,
  onClose,
  onConfirm,
  initialWarehouseId,
}: TransferGoodsPickerModalProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(
    initialWarehouseId && initialWarehouseId !== "ALL"
      ? initialWarehouseId
      : "ALL"
  )
  const [selectedGoods, setSelectedGoods] = useState<string>("ALL")
  const [sortField, setSortField] = useState<"inbound" | "amount" | "prod">("inbound")
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "水果-香蕉-海南": true,
    "水果-苹果-新疆-特级": true,
  })

  // candidateId -> 转让数量
  const [pickedAmounts, setPickedAmounts] = useState<Record<string, number>>({})

  // 过滤候选库存
  const filteredCandidates = useMemo(() => {
    return TRANSFER_STOCK_CANDIDATES.filter((item) => {
      if (selectedWarehouse !== "ALL" && item.warehouseId !== selectedWarehouse) {
        return false
      }
      if (selectedGoods !== "ALL" && !item.goodsName.includes(selectedGoods.replace("G-", ""))) {
        return false
      }
      return true
    }).sort((a, b) => {
      if (sortField === "inbound") {
        return a.inboundTime.localeCompare(b.inboundTime) // 默认 FIFO 正序
      }
      if (sortField === "amount") {
        return b.availableAmount - a.availableAmount
      }
      return (a.productionDate || "").localeCompare(b.productionDate || "")
    })
  }, [selectedWarehouse, selectedGoods, sortField])

  // 按货物名称 + 仓库分组
  const groupedData = useMemo(() => {
    const map = new Map<string, {
      goodsName: string
      warehouseId: string
      warehouseName: string
      unit: string
      totalAvailable: number
      items: TransferStockCandidate[]
    }>()

    filteredCandidates.forEach((item) => {
      const key = `${item.goodsName}@@${item.warehouseId}`
      if (!map.has(key)) {
        map.set(key, {
          goodsName: item.goodsName,
          warehouseId: item.warehouseId,
          warehouseName: item.warehouseName,
          unit: item.unit,
          totalAvailable: 0,
          items: [],
        })
      }
      const grp = map.get(key)!
      grp.totalAvailable += item.availableAmount
      grp.items.push(item)
    })

    return Array.from(map.values())
  }, [filteredCandidates])

  // 检测已选中的仓库集合（用于 R02 单仓强监管阻断）
  const pickedWarehouseIds = useMemo(() => {
    const whSet = new Set<string>()
    Object.entries(pickedAmounts).forEach(([candId, amt]) => {
      if (amt > 0) {
        const found = TRANSFER_STOCK_CANDIDATES.find((c) => c.id === candId)
        if (found) whSet.add(found.warehouseId)
      }
    })
    return Array.from(whSet)
  }, [pickedAmounts])

  const isCrossWarehouseViolated = pickedWarehouseIds.length > 1

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAmountChange = (candId: string, val: number, max: number) => {
    const clean = Math.max(0, Math.min(val || 0, max))
    setPickedAmounts((prev) => ({
      ...prev,
      [candId]: clean,
    }))
  }

  const handleSelectAllForItem = (cand: TransferStockCandidate) => {
    setPickedAmounts((prev) => ({
      ...prev,
      [cand.id]: cand.availableAmount,
    }))
  }

  const handleClearForItem = (candId: string) => {
    setPickedAmounts((prev) => ({
      ...prev,
      [candId]: 0,
    }))
  }

  // 计算弹窗统计
  const summary = useMemo(() => {
    let typeCount = 0
    let totalQty = 0
    const activeGoodsSet = new Set<string>()

    Object.entries(pickedAmounts).forEach(([candId, amt]) => {
      if (amt > 0) {
        const found = TRANSFER_STOCK_CANDIDATES.find((c) => c.id === candId)
        if (found) {
          activeGoodsSet.add(found.goodsName)
          totalQty += amt
        }
      }
    })

    typeCount = activeGoodsSet.size
    return { typeCount, totalQty: Number(totalQty.toFixed(4)) }
  }, [pickedAmounts])

  const handleConfirmClick = () => {
    if (isCrossWarehouseViolated) return

    // 组织为 TransferFormGoodsGroup[]
    const groupMap = new Map<string, TransferFormGoodsGroup>()

    Object.entries(pickedAmounts).forEach(([candId, amt]) => {
      if (amt <= 0) return
      const cand = TRANSFER_STOCK_CANDIDATES.find((c) => c.id === candId)
      if (!cand) return

      const grpKey = `${cand.goodsName}@@${cand.warehouseId}`
      if (!groupMap.has(grpKey)) {
        groupMap.set(grpKey, {
          id: `GRP-${Date.now()}-${cand.id}`,
          goodsName: cand.goodsName,
          warehouseId: cand.warehouseId,
          warehouseName: cand.warehouseName,
          unit: cand.unit,
          expanded: true,
          details: [],
        })
      }

      const g = groupMap.get(grpKey)!
      g.details.push({
        id: `DT-${Date.now()}-${cand.id}`,
        candidateId: cand.id,
        warehouseId: cand.warehouseId,
        warehouseName: cand.warehouseName,
        roomZone: cand.roomZone,
        specificLocation: cand.specificLocation,
        inboundTime: cand.inboundTime,
        otherInfo: cand.otherInfo,
        barcode: cand.barcode,
        qrCodeUrl: cand.qrCodeUrl,
        availableAmount: cand.availableAmount,
        transferAmount: amt,
        unit: cand.unit,
      })
    })

    onConfirm(Array.from(groupMap.values()))
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl p-6 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-base font-semibold text-slate-900">
            选择货物 (在仓自有存货)
          </DialogTitle>
        </DialogHeader>

        {/* 顶部过滤与排序 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-2 text-xs">
          <div>
            <label className="text-slate-500 font-medium">仓库筛选：</label>
            <Select value={selectedWarehouse} onValueChange={(val) => setSelectedWarehouse(val ?? "ALL")}>
              <SelectTrigger className="h-8 text-xs mt-1">
                <SelectValue placeholder="全部仓库" />
              </SelectTrigger>
              <SelectContent>
                {WAREHOUSE_OPTIONS.map((w) => (
                  <SelectItem key={w.value} value={w.value}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-slate-500 font-medium">货物筛选：</label>
            <Select value={selectedGoods} onValueChange={(val) => setSelectedGoods(val ?? "ALL")}>
              <SelectTrigger className="h-8 text-xs mt-1">
                <SelectValue placeholder="全部货品" />
              </SelectTrigger>
              <SelectContent>
                {GOODS_OPTIONS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-slate-500 font-medium">排序方式：</label>
            <Select value={sortField} onValueChange={(v: any) => setSortField(v)}>
              <SelectTrigger className="h-8 text-xs mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inbound">入库时间排序 (先进先出 FIFO)</SelectItem>
                <SelectItem value="amount">可用数量排序 (从大到小)</SelectItem>
                <SelectItem value="prod">生产日期排序</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 跨仓强阻断警告条（遵循 R02 单仓强监管阻断） */}
        {isCrossWarehouseViolated && (
          <div className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 border border-amber-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>单仓阻断拦截 (R02)：</strong>
              转让仅允许在单个仓库内进行，当前已勾选了跨仓库货物，请清空其他仓库后重试。
            </span>
          </div>
        )}

        {/* 候选库存列表树形 */}
        <div className="max-h-[380px] overflow-y-auto rounded-lg border border-slate-200 bg-white text-xs divide-y">
          {groupedData.length === 0 ? (
            <div className="py-12 text-center text-slate-400">暂无匹配的在库可用库存</div>
          ) : (
            groupedData.map((grp) => {
              const isCrossWh =
                pickedWarehouseIds.length > 0 &&
                !pickedWarehouseIds.includes(grp.warehouseId)

              return (
                <div key={`${grp.goodsName}-${grp.warehouseId}`} className="p-3 space-y-2">
                  {/* 一级规格主行 */}
                  <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded">
                    <div
                      className="flex items-center gap-2 cursor-pointer font-medium text-slate-800"
                      onClick={() => toggleGroup(grp.goodsName)}
                    >
                      {expandedGroups[grp.goodsName] ? (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      )}
                      <span>{grp.goodsName}</span>
                      <span className="text-[11px] text-slate-400">
                        [{grp.warehouseName}]
                      </span>
                      <span className="text-[11px] text-slate-500 ml-2">
                        可用总量: {grp.totalAvailable} {grp.unit}
                      </span>
                    </div>

                    {isCrossWh && (
                      <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        仅允许单个仓库转让 (已选其他仓库)
                      </span>
                    )}
                  </div>

                  {/* 二级储位展开行 */}
                  {expandedGroups[grp.goodsName] && (
                    <div className="pl-6 space-y-1.5">
                      {grp.items.map((item) => {
                        const curAmt = pickedAmounts[item.id] || 0
                        const disabled = isCrossWh

                        return (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between p-2 rounded border transition-colors ${
                              disabled
                                ? "bg-slate-50 text-slate-400 border-slate-100"
                                : "hover:bg-slate-50/60 border-slate-200/80"
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="font-medium text-slate-800">
                                {item.roomZone} {item.specificLocation !== "——" ? `(${item.specificLocation})` : ""}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-3">
                                <span>入库时间: {item.inboundTime}</span>
                                <span>可用量: {item.availableAmount} {item.unit}</span>
                                {item.otherInfo && <span>{item.otherInfo}</span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">转让数量:</span>
                              <Input
                                type="number"
                                disabled={disabled}
                                min={0}
                                max={item.availableAmount}
                                value={curAmt || ""}
                                placeholder="0"
                                onChange={(e) =>
                                  handleAmountChange(
                                    item.id,
                                    parseFloat(e.target.value) || 0,
                                    item.availableAmount
                                  )
                                }
                                className="h-7 w-24 text-right text-xs"
                              />
                              <span className="text-slate-500 w-8">{item.unit}</span>

                              <button
                                type="button"
                                disabled={disabled}
                                onClick={() => handleSelectAllForItem(item)}
                                className="text-primary hover:underline text-xs font-medium disabled:opacity-40"
                              >
                                全部
                              </button>
                              <button
                                type="button"
                                disabled={disabled}
                                onClick={() => handleClearForItem(item.id)}
                                className="text-slate-400 hover:text-slate-700 text-xs disabled:opacity-40"
                              >
                                清空
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* 底部汇总与确认 */}
        <DialogFooter className="flex items-center justify-between border-t pt-3">
          <div className="text-xs text-slate-600">
            已选货品品类: <strong className="text-primary">{summary.typeCount}</strong> |
            已选货品总数量: <strong className="text-primary">{summary.totalQty}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
              取消
            </Button>
            <Button
              size="sm"
              disabled={isCrossWarehouseViolated || summary.totalQty <= 0}
              onClick={handleConfirmClick}
              className="h-8 text-xs font-medium"
            >
              确定选入
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
