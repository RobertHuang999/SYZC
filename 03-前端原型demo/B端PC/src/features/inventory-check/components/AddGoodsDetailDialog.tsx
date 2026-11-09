import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Search, QrCode } from "lucide-react"

interface DetailGoodsCandidate {
  id: string
  inventoryNo: string
  ownerName: string
  ownerCode: string
  goodsName: string
  unit: string
  snapshotQty: number
  warehouseName: string
  roomName: string
  partitionName: string
  goodsStatus: string
  barcode: string
  qrCodeUrl?: string
}

// 模拟库存细粒度在库条码候选明细
const CANDIDATE_DETAIL_GOODS: DetailGoodsCandidate[] = [
  {
    id: "cand-det-01",
    inventoryNo: "2026091000010012301",
    ownerName: "无锡市金川特钢实业有限公司",
    ownerCode: "91320200MA1T98762X",
    goodsName: "黑色金属 - 不锈钢冷轧卷板 - 304/2B-0.8*1219*C",
    unit: "吨",
    snapshotQty: 28.5,
    warehouseName: "无锡不锈钢智慧监管仓",
    roomName: "1号板材立体库",
    partitionName: "B区不锈钢卷板区",
    goodsStatus: "质押中",
    barcode: "SN-20260910-304-001",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SN-20260910-304-001",
  },
  {
    id: "cand-det-02",
    inventoryNo: "2026091000010012302",
    ownerName: "无锡市金川特钢实业有限公司",
    ownerCode: "91320200MA1T98762X",
    goodsName: "黑色金属 - 不锈钢热轧平板 - 316L/NO.1-6.0*1500*6000",
    unit: "吨",
    snapshotQty: 42.0,
    warehouseName: "无锡不锈钢智慧监管仓",
    roomName: "1号板材立体库",
    partitionName: "A区精密冷轧区",
    goodsStatus: "存货中",
    barcode: "SN-20260910-316L-002",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SN-20260910-316L-002",
  },
  {
    id: "cand-det-03",
    inventoryNo: "2026091000010012303",
    ownerName: "江苏新华金属材料贸易有限公司",
    ownerCode: "91320500MA2P118833",
    goodsName: "黑色金属 - 不锈钢冷轧卷板 - 304/2B-1.2*1219*C",
    unit: "吨",
    snapshotQty: 35.8,
    warehouseName: "无锡不锈钢智慧监管仓",
    roomName: "1号板材立体库",
    partitionName: "B区不锈钢卷板区",
    goodsStatus: "抵押中",
    barcode: "SN-20260910-304-003",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SN-20260910-304-003",
  },
  {
    id: "cand-det-04",
    inventoryNo: "2026091000010012304",
    ownerName: "上海申铜进出口贸易有限公司",
    ownerCode: "91310115MA1H78650P",
    goodsName: "有色金属 - 高纯阴极铜 - A级 Cu-CATH-1",
    unit: "吨",
    snapshotQty: 50.0,
    warehouseName: "无锡不锈钢智慧监管仓",
    roomName: "2号高架保税库",
    partitionName: "保税暂存A区",
    goodsStatus: "质押中",
    barcode: "SN-20260910-CU-004",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SN-20260910-CU-004",
  },
]

interface AddGoodsDetailDialogProps {
  open: boolean
  warehouseName: string
  alreadySelectedIds: string[]
  onOpenChange: (open: boolean) => void
  onConfirm: (selected: DetailGoodsCandidate[]) => void
}

export function AddGoodsDetailDialog({
  open,
  warehouseName,
  alreadySelectedIds,
  onOpenChange,
  onConfirm,
}: AddGoodsDetailDialogProps) {
  const [filterOwner, setFilterOwner] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [hoveredQrCode, setHoveredQrCode] = useState<string | null>(null)

  const filteredList = CANDIDATE_DETAIL_GOODS.filter((item) => {
    if (filterOwner.trim() && !item.ownerName.includes(filterOwner.trim()) && !item.ownerCode.includes(filterOwner.trim())) {
      return false
    }
    if (filterStatus !== "ALL" && item.goodsStatus !== filterStatus) {
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
    const selected = CANDIDATE_DETAIL_GOODS.filter((item) => selectedIds.includes(item.id))
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
      <DialogContent className="sm:max-w-[960px] font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>添加货品（库存明细模式）</span>
            <span className="text-xs font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              当前绑定仓库：{warehouseName || "请先选择仓库"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* 顶部多条件检索栏 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">货主:</span>
            <Input
              placeholder="货主名称/统一代码"
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">货品状态:</span>
            <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val ?? "ALL")}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部状态</SelectItem>
                <SelectItem value="存货中">存货中</SelectItem>
                <SelectItem value="质押中">质押中</SelectItem>
                <SelectItem value="抵押中">抵押中</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end">
            <Button type="button" size="sm" variant="outline" className="h-8 gap-1 text-xs">
              <Search className="h-3.5 w-3.5" />
              查询
            </Button>
          </div>
        </div>

        {/* 候选明细表格 */}
        <div className="max-h-[380px] overflow-y-auto border border-slate-200 rounded-lg dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 sticky top-0 z-10 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="w-10 px-2.5 py-2 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(c) => toggleSelectAll(!!c)}
                  />
                </th>
                <th className="w-12 px-2.5 py-2">序号</th>
                <th className="px-2.5 py-2">货主</th>
                <th className="px-2.5 py-2">货物名称</th>
                <th className="w-20 px-2.5 py-2 text-right">库存总数</th>
                <th className="w-28 px-2.5 py-2">库房/分区</th>
                <th className="w-18 px-2.5 py-2">状态</th>
                <th className="w-16 px-2.5 py-2 text-center">条码</th>
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
                    <td className="px-2.5 py-2 text-center">
                      <Checkbox
                        checked={checked}
                        disabled={isAlready}
                        onCheckedChange={(c) => toggleSelectOne(item.id, !!c)}
                      />
                    </td>
                    <td className="px-2.5 py-2 text-slate-500">{idx + 1}</td>
                    <td className="px-2.5 py-2">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{item.ownerName}</div>
                      <div className="text-[11px] text-slate-400">{item.ownerCode}</div>
                    </td>
                    <td className="px-2.5 py-2 text-slate-700 dark:text-slate-300 font-medium">
                      {item.goodsName}
                    </td>
                    <td className="px-2.5 py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                      {item.snapshotQty} {item.unit}
                    </td>
                    <td className="px-2.5 py-2 text-slate-600 dark:text-slate-400">
                      <div>{item.roomName}</div>
                      <div className="text-[11px] text-slate-400">{item.partitionName}</div>
                    </td>
                    <td className="px-2.5 py-2">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.goodsStatus}
                      </span>
                    </td>
                    <td className="px-2.5 py-2 text-center relative">
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredQrCode(item.barcode)}
                        onMouseLeave={() => setHoveredQrCode(null)}
                        className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="悬停放大二维码"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>

                      {/* 悬停放大卡片 */}
                      {hoveredQrCode === item.barcode && (
                        <div className="absolute right-8 top-0 z-50 p-2.5 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 w-44 text-center">
                          <img
                            src={item.qrCodeUrl}
                            alt="条码二维码"
                            className="w-28 h-28 mx-auto object-contain border border-slate-100"
                          />
                          <p className="mt-1.5 text-[10px] text-slate-500 break-all">{item.barcode}</p>
                        </div>
                      )}
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

