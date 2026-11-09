import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "lucide-react"

interface SummaryGoodsCandidate {
  id: string
  goodsName: string
  unit: string
  snapshotQty: number
}

// 模拟货品候选池
const CANDIDATE_SUMMARY_GOODS: SummaryGoodsCandidate[] = [
  { id: "cand-sum-01", goodsName: "有色金属 - 高纯阴极铜 - A级 Cu-CATH-1", unit: "吨", snapshotQty: 1250.85 },
  { id: "cand-sum-02", goodsName: "黑色金属 - 不锈钢冷轧卷板 - 304/2B-0.8*1219*C", unit: "吨", snapshotQty: 860.2 },
  { id: "cand-sum-03", goodsName: "有色金属 - 重熔用铝锭 - Al99.70", unit: "吨", snapshotQty: 2400.0 },
  { id: "cand-sum-04", goodsName: "化工原料 - 天然橡胶 - 全乳胶 SCR-WF", unit: "吨", snapshotQty: 480.5 },
  { id: "cand-sum-05", goodsName: "黑色金属 - 热轧卷板 - Q235B-5.75*1500*C", unit: "吨", snapshotQty: 3100.6 },
  { id: "cand-sum-06", goodsName: "有色金属 - 工业硅 - Si4210", unit: "吨", snapshotQty: 620.0 },
]

interface AddGoodsSummaryDialogProps {
  open: boolean
  warehouseName: string
  alreadySelectedIds: string[]
  onOpenChange: (open: boolean) => void
  onConfirm: (selected: SummaryGoodsCandidate[]) => void
}

export function AddGoodsSummaryDialog({
  open,
  warehouseName,
  alreadySelectedIds,
  onOpenChange,
  onConfirm,
}: AddGoodsSummaryDialogProps) {
  const [filterGoodsName, setFilterGoodsName] = useState<string>("ALL")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 过滤候选列表
  const filteredList = CANDIDATE_SUMMARY_GOODS.filter((item) => {
    if (filterGoodsName !== "ALL" && !item.goodsName.includes(filterGoodsName)) {
      return false
    }
    return true
  })

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectable = filteredList
        .filter((item) => !alreadySelectedIds.includes(item.id))
        .map((i) => i.id)
      setSelectedIds(Array.from(new Set([...selectedIds, ...selectable])))
    } else {
      setSelectedIds([])
    }
  }

  const toggleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    }
  }

  const handleConfirm = () => {
    const selected = CANDIDATE_SUMMARY_GOODS.filter((item) => selectedIds.includes(item.id))
    onConfirm(selected)
    onOpenChange(false)
    setSelectedIds([])
  }

  const isAllSelected =
    filteredList.length > 0 &&
    filteredList
      .filter((i) => !alreadySelectedIds.includes(i.id))
      .every((item) => selectedIds.includes(item.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[760px] font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>添加货品（账面汇总模式）</span>
            <span className="text-xs font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              当前锁定仓库：{warehouseName || "请先选择仓库"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* 顶部检索栏 */}
        <div className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">货品名称:</span>
            <Select value={filterGoodsName} onValueChange={(val) => setFilterGoodsName(val ?? "ALL")}>
              <SelectTrigger className="h-8 w-[240px] text-xs">
                <SelectValue placeholder="全部货物" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部货物品类</SelectItem>
                <SelectItem value="阴极铜">有色金属 - 高纯阴极铜</SelectItem>
                <SelectItem value="不锈钢">黑色金属 - 不锈钢</SelectItem>
                <SelectItem value="铝锭">有色金属 - 重熔用铝锭</SelectItem>
                <SelectItem value="天然橡胶">化工原料 - 天然橡胶</SelectItem>
                <SelectItem value="热轧卷板">黑色金属 - 热轧卷板</SelectItem>
                <SelectItem value="工业硅">有色金属 - 工业硅</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" size="sm" variant="outline" className="h-8 gap-1 text-xs">
            <Search className="h-3.5 w-3.5" />
            查询
          </Button>
        </div>

        {/* 货品候选表格 */}
        <div className="max-h-[360px] overflow-y-auto border border-slate-200 rounded-lg dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 sticky top-0 z-10 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="w-12 px-3 py-2 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(c) => toggleSelectAll(!!c)}
                  />
                </th>
                <th className="w-14 px-3 py-2">序号</th>
                <th className="px-3 py-2">货物名称</th>
                <th className="w-20 px-3 py-2">单位</th>
                <th className="w-36 px-3 py-2 text-right">本批次数量 (全仓总计)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredList.map((item, idx) => {
                const isAlready = alreadySelectedIds.includes(item.id)
                const checked = selectedIds.includes(item.id) || isAlready
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                      isAlready ? "bg-slate-50/50 text-slate-400" : ""
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center">
                      <Checkbox
                        checked={checked}
                        disabled={isAlready}
                        onCheckedChange={(c) => toggleSelectOne(item.id, !!c)}
                      />
                    </td>
                    <td className="px-3 py-2.5 text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                      {item.goodsName}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{item.unit}</td>
                    <td className="px-3 py-2.5 text-right font-medium text-slate-900 dark:text-slate-100">
                      {item.snapshotQty.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>共 {filteredList.length} 条记录，已勾选 {selectedIds.length} 项</span>
        </div>

        <DialogFooter className="mt-2 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs px-4"
          >
            取消
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            className="h-8 text-xs px-4"
          >
            确 定 ({selectedIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

