import { useState, useMemo } from "react"
import { Search, AlertTriangle, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  CANDIDATE_STOCKS_MOCK,
  type CandidateStockItem,
} from "../mock/processing-form.mock"
import type { InputGoodsGroup, ProcessingType } from "../domain/types"

interface ProcessingGoodsPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ownerId: string
  ownerName: string
  processingType: ProcessingType
  associatedOrderId?: string
  lockedWarehouseId?: string // 已被第一条锁定的仓库
  onConfirm: (selectedGroups: InputGoodsGroup[]) => void
}

export function ProcessingGoodsPickerModal({
  open,
  onOpenChange,
  ownerId,
  ownerName,
  processingType,
  associatedOrderId,
  lockedWarehouseId,
  onConfirm,
}: ProcessingGoodsPickerModalProps) {
  const [keyword, setKeyword] = useState("")
  // 选中的候选货物ID集合
  const [selectedMap, setSelectedMap] = useState<Record<string, number>>({})

  // 过滤满足条件的候选库存
  const eligibleCandidates = useMemo(() => {
    return CANDIDATE_STOCKS_MOCK.filter((item) => {
      // 1. 货主必须匹配
      if (ownerId && item.ownerId !== ownerId) return false
      // 2. 仓库锁定校验 (R05)
      if (lockedWarehouseId && item.warehouseId !== lockedWarehouseId) return false
      // 3. 加工类型与库存匹配 (R03/R04)
      if (processingType === "INVENTORY") {
        if (item.processingType !== "INVENTORY") return false
      } else {
        if (item.processingType !== processingType) return false
        if (associatedOrderId && item.associatedOrderId !== associatedOrderId) return false
      }
      // 4. 关键字搜索
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase()
        const matchName = item.goodsName.toLowerCase().includes(kw)
        const matchCode = item.barcode.toLowerCase().includes(kw)
        const matchLoc = item.roomZone.toLowerCase().includes(kw)
        if (!matchName && !matchCode && !matchLoc) return false
      }
      return true
    })
  }, [ownerId, lockedWarehouseId, processingType, associatedOrderId, keyword])

  const handleToggleSelect = (item: CandidateStockItem) => {
    if (item.hasReceipt) return // 仓单货物禁止选择 (R04)
    setSelectedMap((prev) => {
      const next = { ...prev }
      if (next[item.id] !== undefined) {
        delete next[item.id]
      } else {
        // 默认计划投入量为可用量的一半或全部
        next[item.id] = Math.min(item.availableAmount, 50)
      }
      return next
    })
  }

  const handleAmountChange = (itemId: string, maxAmount: number, val: string) => {
    const num = parseFloat(val)
    setSelectedMap((prev) => ({
      ...prev,
      [itemId]: isNaN(num) ? 0 : Math.min(maxAmount, Math.max(0, num)),
    }))
  }

  const handleConfirm = () => {
    // 将选中的条目按货品规格（goodsId）聚合成 InputGoodsGroup
    const selectedItems = eligibleCandidates.filter(
      (item) => selectedMap[item.id] !== undefined && selectedMap[item.id] > 0
    )

    const groupMap: Record<string, InputGoodsGroup> = {}

    for (const item of selectedItems) {
      const planQty = selectedMap[item.id]
      if (!groupMap[item.goodsId]) {
        groupMap[item.goodsId] = {
          id: `GRP-${item.goodsId}-${Date.now()}`,
          goodsId: item.goodsId,
          goodsName: item.goodsName,
          specModel: item.specModel,
          unit: item.unit,
          expanded: true,
          details: [],
        }
      }
      groupMap[item.goodsId].details.push({
        id: `DT-${item.id}-${Date.now()}`,
        candidateId: item.id,
        warehouseId: item.warehouseId,
        warehouseName: item.warehouseName,
        roomZone: item.roomZone,
        specificLocation: item.specificLocation,
        inboundTime: item.inboundTime,
        otherInfo: item.otherInfo,
        barcode: item.barcode,
        availableAmount: item.availableAmount,
        planAmount: planQty,
        lockedAmount: planQty,
        unit: item.unit,
      })
    }

    onConfirm(Object.values(groupMap))
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-foreground">
            添加投入货品
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            从货主「{ownerName || "当前货主"}」的实时可用库存中挑选待加工原料。系统严格校验同货主、同仓库及同货权类型。
          </DialogDescription>
        </DialogHeader>

        {/* 提示信息 */}
        {lockedWarehouseId ? (
          <div className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
            <span>ⓘ</span>
            <span>已选定投入仓库并锁定，仅支持选择属于同一实体仓库的在库货物。</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>首条选中的投入货物将自动确定并锁定主表所属实体仓库。</span>
          </div>
        )}

        {/* 搜索框 */}
        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={keyword}
              placeholder="搜索货品名称、条码编号或库房库位..."
              className="h-9 pl-8 text-xs"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        {/* 候选列表表格 */}
        <div className="flex-1 overflow-y-auto border border-border/80 rounded-md mt-2">
          <Table className="text-xs">
            <TableHeader className="bg-slate-50 dark:bg-slate-800">
              <TableRow className="h-9">
                <TableHead className="w-12 text-center">选择</TableHead>
                <TableHead className="w-48">货物名称 / 规格</TableHead>
                <TableHead className="w-44">存放位置</TableHead>
                <TableHead className="w-32">存货条码</TableHead>
                <TableHead className="w-24 text-right">可用数量</TableHead>
                <TableHead className="w-32">计划投入数量</TableHead>
                <TableHead className="w-24 text-center">状态说明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eligibleCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    未检索到符合条件的在库可用货物（可能跨仓、已开仓单或无匹配货权）
                  </TableCell>
                </TableRow>
              ) : (
                eligibleCandidates.map((item) => {
                  const isSelected = selectedMap[item.id] !== undefined
                  const isDisabled = Boolean(item.hasReceipt)

                  return (
                    <TableRow
                      key={item.id}
                      className={`h-12 hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                        isDisabled ? "bg-slate-100/60 opacity-60 dark:bg-slate-900/60" : ""
                      }`}
                    >
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() => handleToggleSelect(item)}
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{item.goodsName}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.specModel}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-foreground">{item.roomZone}</div>
                        <div className="text-[11px] text-muted-foreground">
                          货位：{item.specificLocation || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-foreground">{item.barcode}</span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-foreground">
                        {item.availableAmount} {item.unit}
                      </TableCell>
                      <TableCell>
                        {isSelected ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min={0.0001}
                              max={item.availableAmount}
                              step="any"
                              value={selectedMap[item.id]}
                              className="h-7 w-20 text-xs px-1.5"
                              onChange={(e) =>
                                handleAmountChange(
                                  item.id,
                                  item.availableAmount,
                                  e.target.value
                                )
                              }
                            />
                            <span className="text-[11px] text-muted-foreground">
                              {item.unit}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.hasReceipt ? (
                          <span
                            className="inline-flex items-center gap-0.5 text-[11px] text-rose-600 dark:text-rose-400 font-normal"
                            title="仓单货物不可发起加工，请先解单"
                          >
                            <ShieldAlert className="h-3 w-3" />
                            已开仓单
                          </span>
                        ) : (
                          <span className="inline-flex rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                            可用正常
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-4 flex items-center justify-between sm:justify-between">
          <div className="text-xs text-muted-foreground">
            已勾选 {Object.keys(selectedMap).length} 项批次货位
          </div>
          <div className="flex items-center gap-2">
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
              disabled={Object.keys(selectedMap).length === 0}
              onClick={handleConfirm}
            >
              确认添加
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
