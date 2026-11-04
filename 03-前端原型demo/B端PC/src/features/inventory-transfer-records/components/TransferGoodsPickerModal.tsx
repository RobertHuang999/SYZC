import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { AlertCircle, QrCode } from "lucide-react"
import type { TransferStockCandidate, TransferFormGoodsItem } from "../domain/form-types"
import { stockCandidatesMock, warehouseZonesMock } from "../mock/transfer-form.mock"

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (selectedItems: TransferFormGoodsItem[]) => void
  existingWarehouseId?: string
}

export function TransferGoodsPickerModal({
  open,
  onClose,
  onConfirm,
  existingWarehouseId,
}: Props) {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>(
    existingWarehouseId || "ALL"
  )
  const [categoryKeyword, setCategoryKeyword] = useState<string>("")
  const [sortField, setSortField] = useState<"inboundTime" | "availableAmount">("inboundTime")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // 记录每个候选货物的选中数量：candidateId -> number
  const [pickedAmounts, setPickedAmounts] = useState<Record<string, number>>({})

  // 候选列表过滤与排序
  const filteredCandidates = useMemo(() => {
    let list = stockCandidatesMock.filter((item) => {
      if (selectedWarehouseId !== "ALL" && item.warehouseId !== selectedWarehouseId) {
        return false
      }
      if (categoryKeyword.trim()) {
        const q = categoryKeyword.trim().toLowerCase()
        if (!item.goodsName.toLowerCase().includes(q)) {
          return false
        }
      }
      return true
    })

    list.sort((a, b) => {
      if (sortField === "inboundTime") {
        const tA = new Date(a.inboundTime).getTime()
        const tB = new Date(b.inboundTime).getTime()
        return sortOrder === "asc" ? tA - tB : tB - tA
      }
      if (sortField === "availableAmount") {
        return sortOrder === "asc"
          ? a.availableAmount - b.availableAmount
          : b.availableAmount - a.availableAmount
      }
      return 0
    })

    return list
  }, [selectedWarehouseId, categoryKeyword, sortField, sortOrder])

  // 校验跨仓情况 (R01)
  const pickedCandidates = useMemo(() => {
    return stockCandidatesMock.filter(
      (c) => pickedAmounts[c.id] && pickedAmounts[c.id] > 0
    )
  }, [pickedAmounts])

  const pickedWarehouseIds = useMemo(() => {
    return Array.from(new Set(pickedCandidates.map((c) => c.warehouseId)))
  }, [pickedCandidates])

  const isCrossWarehouseBlocked = pickedWarehouseIds.length > 1

  const handleSetAmount = (id: string, amount: number, max: number) => {
    const validAmount = Math.max(0, Math.min(amount, max))
    setPickedAmounts((prev) => ({
      ...prev,
      [id]: validAmount,
    }))
  }

  const handleAll = (candidate: TransferStockCandidate) => {
    handleSetAmount(candidate.id, candidate.availableAmount, candidate.availableAmount)
  }

  const handleClear = (id: string) => {
    setPickedAmounts((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  // 统计已选
  const selectedCount = pickedCandidates.length
  const selectedTotalAmount = pickedCandidates.reduce(
    (sum, c) => sum + (pickedAmounts[c.id] || 0),
    0
  )

  const handleConfirmClick = () => {
    if (isCrossWarehouseBlocked) {
      alert("【同仓移库物理边界强约束】(R01)：移库仅限同一仓库内部，严禁跨仓库选择货物！")
      return
    }

    const items: TransferFormGoodsItem[] = pickedCandidates.map((c) => ({
      id: `ITEM-${c.id}-${Date.now()}`,
      candidateId: c.id,
      goodsName: c.goodsName,
      cateName: c.cateName,
      typeName: c.typeName,
      specName: c.specName,
      sourceWarehouseId: c.warehouseId,
      sourceWarehouseName: c.warehouseName,
      sourceRoomZone: c.roomZone,
      sourceSpecificLocation: c.specificLocation,
      inboundTime: c.inboundTime,
      otherInfo: c.otherInfo,
      barcode: c.barcode,
      qrCodeUrl: c.qrCodeUrl,
      availableAmount: c.availableAmount,
      transferAmount: pickedAmounts[c.id] || c.availableAmount,
      unit: c.unit,
      targetRoomZone: "",
      targetSpecificLocation: "",
    }))

    onConfirm(items)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">选择货物</DialogTitle>
        </DialogHeader>

        {/* 顶部筛选区 */}
        <div className="grid grid-cols-3 gap-3 py-2 border-b border-border text-sm">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">仓库筛选</label>
            <Select
              value={selectedWarehouseId}
              onValueChange={setSelectedWarehouseId}
            >
              <SelectTrigger className="h-[34px] text-xs">
                <SelectValue placeholder="全部仓库" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部仓库 (全选)</SelectItem>
                {warehouseZonesMock.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">货物筛选</label>
            <Input
              value={categoryKeyword}
              onChange={(e) => setCategoryKeyword(e.target.value)}
              placeholder="搜索货品大类/品类/规格"
              className="h-[34px] text-xs"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground block mb-1">排序方式</label>
            <Select
              value={`${sortField}-${sortOrder}`}
              onValueChange={(val) => {
                const [f, o] = val.split("-") as [
                  "inboundTime" | "availableAmount",
                  "asc" | "desc"
                ]
                setSortField(f)
                setSortOrder(o)
              }}
            >
              <SelectTrigger className="h-[34px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inboundTime-asc">入库时间 正序 (FIFO 先进先出)</SelectItem>
                <SelectItem value="inboundTime-desc">入库时间 倒序</SelectItem>
                <SelectItem value="availableAmount-desc">可用数量 从多到少</SelectItem>
                <SelectItem value="availableAmount-asc">可用数量 从少到多</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 跨仓强阻断警告 (R01) */}
        {isCrossWarehouseBlocked && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-2.5 rounded text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>
              <strong>【同仓移库物理边界强约束】(R01)</strong>：您勾选了来自多个不同仓库的货物（{pickedCandidates.map(c => c.warehouseName).filter((v, i, a) => a.indexOf(v) === i).join("、")}）。移库仅允许在单个仓库内部进行，禁止跨仓提交！
            </span>
          </div>
        )}

        {/* 候选表格 */}
        <div className="flex-1 overflow-y-auto max-h-[50vh] border rounded-md">
          <Table className="text-xs">
            <TableHeader className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-12 text-center">序号</TableHead>
                <TableHead className="w-48">货物名称</TableHead>
                <TableHead className="w-48">所在位置</TableHead>
                <TableHead className="w-24">具体储位</TableHead>
                <TableHead className="w-24 text-right">可用数量</TableHead>
                <TableHead className="w-36 text-center">移库数量</TableHead>
                <TableHead className="w-24 text-center">快捷操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((cand, idx) => {
                const currentVal = pickedAmounts[cand.id] ?? ""

                return (
                  <TableRow key={cand.id} className="hover:bg-slate-50/80">
                    <TableCell className="text-center text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{cand.goodsName}</div>
                      <div className="text-[11px] text-muted-foreground">{cand.otherInfo}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div>{cand.warehouseName}</div>
                      <div className="text-[11px]">{cand.roomZone.split("-").slice(1).join("-")}</div>
                    </TableCell>
                    <TableCell className="text-foreground">{cand.specificLocation}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {cand.availableAmount} {cand.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="0"
                        max={cand.availableAmount}
                        step="0.001"
                        placeholder="输入数量"
                        value={currentVal}
                        onChange={(e) =>
                          handleSetAmount(
                            cand.id,
                            parseFloat(e.target.value) || 0,
                            cand.availableAmount
                          )
                        }
                        className="h-7 text-xs text-center w-28 mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAll(cand)}
                          className="text-xs text-primary hover:underline"
                        >
                          全部
                        </button>
                        <span className="text-muted-foreground">|</span>
                        <button
                          type="button"
                          onClick={() => handleClear(cand.id)}
                          className="text-xs text-muted-foreground hover:text-red-600"
                        >
                          清空
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* 底栏汇总与确定 */}
        <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-3">
          <div className="text-xs text-muted-foreground">
            已选货品：<span className="font-semibold text-primary">{selectedCount}</span> 批次，
            总数量：<span className="font-semibold text-primary">{Math.round(selectedTotalAmount * 1000) / 1000}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button
              size="sm"
              disabled={selectedCount === 0 || isCrossWarehouseBlocked}
              onClick={handleConfirmClick}
              className="bg-primary hover:bg-primary/90"
            >
              确定选入 ({selectedCount})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

