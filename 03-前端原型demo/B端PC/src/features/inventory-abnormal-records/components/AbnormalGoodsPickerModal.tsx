import { useState, useMemo } from "react"
import { X, Search, RotateCcw, AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { inStockItemsMock } from "../mock/abnormal-form.mock"
import type { InStockItem } from "../domain/form-types"

interface AbnormalGoodsPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (item: InStockItem) => void
}

export function AbnormalGoodsPickerModal({
  open,
  onClose,
  onSelect,
}: AbnormalGoodsPickerModalProps) {
  const [inboundNo, setInboundNo] = useState("")
  const [ownerKeyword, setOwnerKeyword] = useState("")
  const [goodsKeyword, setGoodsKeyword] = useState("")
  const [warehouseFilter, setWarehouseFilter] = useState("")

  const filteredItems = useMemo(() => {
    return inStockItemsMock.filter((item) => {
      // 严格风控校验 (R01, R02)：必须是普通入库 + 存货中 + 可用数量 > 0
      if (item.inboundType !== "普通入库" || item.status !== "存货中" || item.availableQty <= 0) {
        return false
      }
      if (inboundNo.trim() && !item.inboundOrderId.includes(inboundNo.trim())) {
        return false
      }
      if (ownerKeyword.trim()) {
        const kw = ownerKeyword.trim().toLowerCase()
        const matchName = item.ownerName.toLowerCase().includes(kw)
        const matchIdentity = item.ownerIdentity.toLowerCase().includes(kw)
        if (!matchName && !matchIdentity) return false
      }
      if (goodsKeyword.trim()) {
        const kw = goodsKeyword.trim().toLowerCase()
        if (!item.goodsTitle.toLowerCase().includes(kw)) return false
      }
      if (warehouseFilter.trim()) {
        if (!item.warehouseName.includes(warehouseFilter.trim())) return false
      }
      return true
    })
  }, [inboundNo, ownerKeyword, goodsKeyword, warehouseFilter])

  const handleReset = () => {
    setInboundNo("")
    setOwnerKeyword("")
    setGoodsKeyword("")
    setWarehouseFilter("")
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-[90vh] w-full max-w-5xl rounded-xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              选择货物（发起异动申报）
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              仅展示状态为【存货中】且类型为【普通入库】的自由存货，严格风控隔离金融抵质押资产。
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 顶部风控警示条 (R01, R02) */}
        <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertTriangle className="size-4 shrink-0 text-amber-600" />
          <span>
            <strong>风控提示：</strong>
            处于抵押、质押或监管状态的在押金融资产严禁在仓储端发起异动。如需调账请至「融资监管 - 抵质押管理」专属通道申报。
          </span>
        </div>

        {/* 筛选区 */}
        <div className="mx-6 mt-3 grid grid-cols-1 gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-4 dark:border-slate-800 dark:bg-slate-950/40">
          <div>
            <label className="text-[11px] font-medium text-slate-500">入库单号</label>
            <Input
              value={inboundNo}
              onChange={(e) => setInboundNo(e.target.value)}
              placeholder="请输入入库单号"
              className="h-8 text-xs mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500">货主名称/标识</label>
            <Input
              value={ownerKeyword}
              onChange={(e) => setOwnerKeyword(e.target.value)}
              placeholder="请输入货主名称/手机号"
              className="h-8 text-xs mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500">货物名称</label>
            <Input
              value={goodsKeyword}
              onChange={(e) => setGoodsKeyword(e.target.value)}
              placeholder="请输入货物名称"
              className="h-8 text-xs mt-1"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[11px] font-medium text-slate-500">入库类型</label>
              <div className="h-8 mt-1 flex items-center rounded-md border border-slate-200 bg-slate-100/80 px-2.5 text-xs text-slate-500 select-none dark:border-slate-800 dark:bg-slate-800">
                普通入库 (系统锁定)
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs px-2.5 cursor-pointer"
            >
              <RotateCcw className="size-3 mr-1" />
              重置
            </Button>
          </div>
        </div>

        {/* 表格内容区 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-medium border-b border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
              <tr>
                <th className="px-3 py-2.5 w-12 text-center">序号</th>
                <th className="px-3 py-2.5 min-w-[150px]">货主</th>
                <th className="px-3 py-2.5 min-w-[200px]">货物信息</th>
                <th className="px-3 py-2.5 min-w-[140px]">入库时间</th>
                <th className="px-3 py-2.5 min-w-[90px]">期初数量</th>
                <th className="px-3 py-2.5 min-w-[90px]">可用数量</th>
                <th className="px-3 py-2.5 min-w-[180px]">仓库库房</th>
                <th className="px-3 py-2.5 min-w-[120px]">存货条码</th>
                <th className="px-3 py-2.5 min-w-[80px]">状态</th>
                <th className="px-3 py-2.5 min-w-[90px] text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="h-32 text-center text-slate-400">
                    暂无可发起异动的普通存货
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr
                    key={item.stockId}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="px-3 py-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {item.ownerName}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.ownerIdentity}</div>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {item.goodsTitle}
                    </td>
                    <td className="px-3 py-3 text-slate-500">{item.inboundTime}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                      {item.initialQty} {item.unit}
                    </td>
                    <td className="px-3 py-3 text-primary font-semibold">
                      {item.availableQty} {item.unit}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {item.warehouseName}-{item.storeroomName}-{item.partitionName}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {item.barcode}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-xs">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          onSelect(item)
                          onClose()
                        }}
                        className="h-7 text-xs px-2.5 cursor-pointer font-medium"
                      >
                        异动申请
                        <ArrowRight className="ml-1 size-3" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/50">
          <span className="text-xs text-slate-500">
            共 {filteredItems.length} 条有效在库普通货物
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs cursor-pointer">
            关闭
          </Button>
        </div>
      </div>
    </div>
  )
}

