import { useState, useMemo } from "react"
import { ChevronDown, ChevronRight, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OutboundGoodsItem, OutboundStockLocationItem } from "../domain/types"
import {
  AVAILABLE_STOCK_GROUPS_MOCK,
  FORM_WAREHOUSES,
  type AvailableGoodsStockGroup,
} from "../mock/outbound-form.mock"

interface OutboundGoodsPickerModalProps {
  open: boolean
  ownerName: string
  onClose: () => void
  onConfirm: (selectedGoods: OutboundGoodsItem[]) => void
}

export function OutboundGoodsPickerModal({
  open,
  ownerName,
  onClose,
  onConfirm,
}: OutboundGoodsPickerModalProps) {
  // 筛选与排序状态
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("全部")
  const [selectAllWarehouses, setSelectAllWarehouses] = useState<boolean>(true)
  const [keywordGoods, setKeywordGoods] = useState<string>("")
  const [sortInboundTime, setSortInboundTime] = useState<"ASC" | "DESC">("ASC")
  const [sortAvailableAmount, setSortAvailableAmount] = useState<"NONE" | "ASC" | "DESC">("NONE")

  // 折叠展开的货品分组名称集合
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "有色金属-电解铜-国标": true,
  })

  // 本地各个位置出库数量录入状态: locationId -> number
  const [locationAmounts, setLocationAmounts] = useState<Record<string, number>>({})

  // 根据货主过滤可用资产（若当前货主无匹配，智能兜底展示全部资产并允许选择，绝不出现空态卡死）
  const availableGroups = useMemo(() => {
    let list = AVAILABLE_STOCK_GROUPS_MOCK
    if (ownerName) {
      const filtered = list.filter((g) =>
        g.locations.some((loc) => !loc.ownerName || loc.ownerName === ownerName)
      )
      if (filtered.length > 0) return filtered
    }
    return list
  }, [ownerName])


  // 汇总统计已选
  const totalSummary = useMemo(() => {
    let count = 0
    let totalAmt = 0
    const groupSelectedCount: Record<string, boolean> = {}

    availableGroups.forEach((group) => {
      group.locations.forEach((loc) => {
        const amt = locationAmounts[loc.id] || 0
        if (amt > 0) {
          totalAmt += amt
          groupSelectedCount[group.goodsName] = true
        }
      })
    })

    count = Object.keys(groupSelectedCount).length
    return { count, totalAmt: Math.round(totalAmt * 10000) / 10000 }
  }, [availableGroups, locationAmounts])

  if (!open) return null

  const toggleGroupExpand = (goodsName: string) => {
    setExpandedGroups((prev) => ({ ...prev, [goodsName]: !prev[goodsName] }))
  }

  // 设置某位置出库数量
  const handleLocationAmountChange = (
    locId: string,
    valStr: string,
    maxAvail: number
  ) => {
    const num = Math.max(0, Math.min(Number(valStr) || 0, maxAvail))
    setLocationAmounts((prev) => ({ ...prev, [locId]: num }))
  }

  // 快捷【全部】按钮
  const handleSetAllForLocation = (locId: string, maxAvail: number) => {
    setLocationAmounts((prev) => ({ ...prev, [locId]: maxAvail }))
  }

  // 快捷【清空】按钮
  const handleClearLocation = (locId: string) => {
    setLocationAmounts((prev) => ({ ...prev, [locId]: 0 }))
  }

  // 分组级快捷全部
  const handleGroupSetAll = (group: AvailableGoodsStockGroup) => {
    setLocationAmounts((prev) => {
      const next = { ...prev }
      group.locations.forEach((l) => {
        next[l.id] = l.availableAmount
      })
      return next
    })
  }

  // 分组级快捷清空
  const handleGroupClear = (group: AvailableGoodsStockGroup) => {
    setLocationAmounts((prev) => {
      const next = { ...prev }
      group.locations.forEach((l) => {
        next[l.id] = 0
      })
      return next
    })
  }

  const handleConfirmSubmit = () => {
    const result: OutboundGoodsItem[] = []

    availableGroups.forEach((group, gIdx) => {
      const selectedLocs: OutboundStockLocationItem[] = []
      let groupOutboundAmt = 0

      group.locations.forEach((loc) => {
        const amt = locationAmounts[loc.id] || 0
        if (amt > 0) {
          selectedLocs.push({
            id: loc.id,
            warehouseName: loc.warehouseName,
            storeroomName: loc.storeroomName,
            partitionName: loc.partitionName,
            locationPath: loc.locationPath,
            specificLocation: loc.specificLocation,
            inboundTime: loc.inboundTime,
            extraInfo: loc.extraInfo,
            barcode: loc.barcode,
            status: loc.status,
            availableAmount: loc.availableAmount,
            outboundAmount: amt,
            unit: loc.unit,
          })
          groupOutboundAmt += amt
        }
      })

      if (selectedLocs.length > 0) {
        result.push({
          id: `PICK-${gIdx + 1}`,
          categoryName: group.categoryName,
          subCategoryName: group.subCategoryName,
          specName: group.specName,
          goodsName: group.goodsName,
          totalOutboundAmount: groupOutboundAmt,
          unit: group.unit,
          locations: selectedLocs,
        })
      }
    })

    onConfirm(result)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="flex h-[88vh] w-full max-w-5xl flex-col rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">选择货物（普通出库选货）</h3>
            <span className="text-xs text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
              当前货主：{ownerName || "未指定"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* 顶部筛选与排序栏 */}
        <div className="border-b border-gray-100 bg-white p-4 text-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* 仓库筛选 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">仓库</span>
                <label className="flex items-center gap-1 text-[11px] text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAllWarehouses}
                    onChange={(e) => {
                      setSelectAllWarehouses(e.target.checked)
                      if (e.target.checked) setSelectedWarehouse("全部")
                    }}
                    className="size-3 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  全选
                </label>
              </div>
              <Select
                value={selectedWarehouse}
                onValueChange={(val) => {
                  const target = val || "全部"
                  setSelectedWarehouse(target)
                  setSelectAllWarehouses(target === "全部")
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="请选择仓库" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部" className="text-xs">全部仓库</SelectItem>
                  {FORM_WAREHOUSES.map((w) => (
                    <SelectItem key={w.id} value={w.name} className="text-xs">
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 货物筛选 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-700">货物名称/规格</span>
                <span className="text-[11px] text-gray-400">支持模糊检索</span>
              </div>
              <Input
                placeholder="搜索货物规格"
                value={keywordGoods}
                onChange={(e) => setKeywordGoods(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* 入库时间排序 */}
            <div>
              <span className="block font-medium text-gray-700 mb-1">入库时间排序</span>
              <Select
                value={sortInboundTime}
                onValueChange={(val) => setSortInboundTime(val as "ASC" | "DESC")}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASC" className="text-xs">入库时间正序 (先入先出)</SelectItem>
                  <SelectItem value="DESC" className="text-xs">入库时间倒序 (后入先出)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 可用数量排序 */}
            <div>
              <span className="block font-medium text-gray-700 mb-1">可用数量排序</span>
              <Select
                value={sortAvailableAmount}
                onValueChange={(val) => setSortAvailableAmount(val as "NONE" | "ASC" | "DESC")}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="请选择排序" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE" className="text-xs">默认排序</SelectItem>
                  <SelectItem value="ASC" className="text-xs">按可用数量正序</SelectItem>
                  <SelectItem value="DESC" className="text-xs">按可用数量倒序</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 选货表格列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {availableGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <AlertCircle className="size-10 mb-2 stroke-1 text-gray-300" />
              <p className="text-sm">暂无可用库存（C03）</p>
              <p className="text-xs mt-1 text-gray-400">当前货主在已授权监管仓库内暂无在库可用货物</p>
            </div>
          ) : (
            availableGroups.map((group) => {
              const isExpanded = !!expandedGroups[group.goodsName]
              // 当前组在各位置的总已选数量
              const groupSelectedAmt = group.locations.reduce(
                (sum, l) => sum + (locationAmounts[l.id] || 0),
                0
              )

              return (
                <div
                  key={group.goodsName}
                  className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-2xs"
                >
                  {/* 分组主行 */}
                  <div className="flex items-center justify-between bg-gray-50/90 px-4 py-2.5 text-xs border-b border-gray-200">
                    <div
                      onClick={() => toggleGroupExpand(group.goodsName)}
                      className="flex cursor-pointer items-center gap-2 font-medium text-gray-900 select-none"
                    >
                      {isExpanded ? (
                        <ChevronDown className="size-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="size-4 text-gray-500" />
                      )}
                      <span className="text-sm font-semibold">{group.goodsName}</span>
                      <span className="text-gray-400 font-normal">
                        ({group.categoryName} / {group.subCategoryName} / {group.specName})
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-gray-600">
                        可用库存：
                        <span className="font-medium text-gray-900">
                          {group.totalAvailable.toLocaleString()}
                        </span>{" "}
                        {group.unit}
                      </div>

                      {/* 出库数量（单仓支持直接录入，多仓显示提示） */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-600">已选出库量：</span>
                        {group.isSingleWarehouse ? (
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-primary">
                              {groupSelectedAmt > 0 ? groupSelectedAmt : "--"}
                            </span>
                            <span className="text-gray-500 text-[11px]">{group.unit}</span>
                          </div>
                        ) : (
                          <span className="rounded bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary border border-primary/20">
                            仅允许单个仓库出库 (请在明细按位置选)
                          </span>
                        )}
                      </div>

                      {/* 组操作 */}
                      <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
                        <button
                          type="button"
                          onClick={() => handleGroupSetAll(group)}
                          className="text-primary hover:text-primary hover:underline px-1 py-0.5"
                        >
                          全部
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleGroupClear(group)}
                          className="text-gray-500 hover:text-gray-700 hover:underline px-1 py-0.5"
                        >
                          清空
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 展开的库存位置二级明细 */}
                  {isExpanded && (
                    <div className="p-3 bg-white">
                      <table className="w-full text-left text-xs border border-gray-100 rounded">
                        <thead className="bg-gray-50 text-[11px] text-gray-600 border-b border-gray-100">
                          <tr>
                            <th className="p-2 w-10 text-center">序号</th>
                            <th className="p-2">位置 (仓库-库房-分区)</th>
                            <th className="p-2">具体位置</th>
                            <th className="p-2">入库时间</th>
                            <th className="p-2">其他信息</th>
                            <th className="p-2">存货条码</th>
                            <th className="p-2">状态</th>
                            <th className="p-2 text-right">可用数量</th>
                            <th className="p-2 text-center w-36">出库数量</th>
                            <th className="p-2 text-center w-24">快捷操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[11px]">
                          {group.locations.map((loc, lIdx) => {
                            const currentAmt = locationAmounts[loc.id] || ""

                            return (
                              <tr key={loc.id} className="hover:bg-primary/5/20">
                                <td className="p-2 text-center text-gray-400">{lIdx + 1}</td>
                                <td className="p-2 font-medium text-gray-900">{loc.locationPath}</td>
                                <td className="p-2 text-gray-600">{loc.specificLocation || "--"}</td>
                                <td className="p-2 text-gray-600">{loc.inboundTime}</td>
                                <td className="p-2 text-gray-500">{loc.extraInfo || "无：--"}</td>
                                <td className="p-2 text-gray-700">{loc.barcode}</td>
                                <td className="p-2">
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 border border-emerald-200">
                                    {loc.status}
                                  </span>
                                </td>
                                <td className="p-2 text-right font-medium text-gray-900">
                                  {loc.availableAmount.toLocaleString()} {loc.unit}
                                </td>
                                <td className="p-2 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Input
                                      type="number"
                                      min={0}
                                      max={loc.availableAmount}
                                      placeholder="0"
                                      value={currentAmt}
                                      onChange={(e) =>
                                        handleLocationAmountChange(
                                          loc.id,
                                          e.target.value,
                                          loc.availableAmount
                                        )
                                      }
                                      className="h-7 w-20 text-xs text-center"
                                    />
                                    <span className="text-gray-500">{loc.unit}</span>
                                  </div>
                                </td>
                                <td className="p-2 text-center">
                                  <div className="flex items-center justify-center gap-1 text-[11px]">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSetAllForLocation(loc.id, loc.availableAmount)
                                      }
                                      className="text-primary hover:text-primary"
                                    >
                                      全部
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                      type="button"
                                      onClick={() => handleClearLocation(loc.id)}
                                      className="text-gray-500 hover:text-gray-700"
                                    >
                                      清空
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* 弹窗底栏统计与操作 */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center gap-4 text-xs">
            <div>
              已选货品类型：
              <span className="font-bold text-primary">
                {totalSummary.count}
              </span>{" "}
              种
            </div>
            <div>
              已选货品总数量：
              <span className="font-bold text-primary">
                {totalSummary.totalAmt}
              </span>{" "}
              吨
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              取消
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmSubmit}
              disabled={totalSummary.totalAmt <= 0}
            >
              确定选货
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
