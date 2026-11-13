import { useEffect, useMemo, useState } from "react"
import { ChevronDownIcon, ChevronRightIcon, PackageCheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { GoodsSkuLine, InventorySlotItem } from "../domain/types"

export interface AvailableInventorySku {
  skuId: string
  skuName: string
  unit: string
  unitPriceYuan: number | null
  slots: Omit<InventorySlotItem, "allocatedQty">[]
}

const AVAILABLE_INVENTORY_CATALOG: AvailableInventorySku[] = [
  {
    skuId: "sku-cu-1",
    skuName: "有色金属-电解铜-1#阴极铜(Cu≥99.95%)",
    unit: "吨",
    unitPriceYuan: 74500,
    slots: [
      {
        slotId: "slot-cu-101",
        warehouseName: "华东仓储运营中心",
        storeroomName: "一号库房",
        zoneName: "A区",
        locationCode: "A-01-03",
        inboundTime: "2026-10-18 09:20:15",
        productionDate: "2026-09-25",
        batchExtra: "产地: 江西贵溪 / 批次: CU260925",
        barcode: "QR-CU-261018-01",
        controlStatus: "存货中",
        availableQty: 120.5,
      },
      {
        slotId: "slot-cu-102",
        warehouseName: "华东仓储运营中心",
        storeroomName: "一号库房",
        zoneName: "A区",
        locationCode: "A-02-01",
        inboundTime: "2026-11-02 14:15:40",
        productionDate: "2026-10-15",
        batchExtra: "产地: 安徽铜陵 / 批次: CU261015",
        barcode: "QR-CU-261102-02",
        controlStatus: "存货中",
        availableQty: 85.0,
      },
    ],
  },
  {
    skuId: "sku-steel-2",
    skuName: "黑色金属-热轧卷板-Q235B(5.5mm)",
    unit: "吨",
    unitPriceYuan: 3820,
    slots: [
      {
        slotId: "slot-steel-201",
        warehouseName: "钢铁智慧监管仓",
        storeroomName: "重型钢材库",
        zoneName: "北区",
        locationCode: "N-08-12",
        inboundTime: "2026-10-28 11:05:10",
        productionDate: "2026-10-08",
        batchExtra: "钢厂: 宝钢 / 炉号: BG261008",
        barcode: "QR-ST-261028-01",
        controlStatus: "存货中",
        availableQty: 450.0,
      },
      {
        slotId: "slot-steel-202",
        warehouseName: "钢铁智慧监管仓",
        storeroomName: "审核库房",
        zoneName: "临时分区",
        locationCode: "--",
        inboundTime: "2026-11-05 16:40:22",
        productionDate: "2026-10-20",
        batchExtra: "钢厂: 沙钢 / 车辆: 沪A·89210",
        barcode: "QR-ST-261105-02",
        controlStatus: "存货中",
        availableQty: 320.0,
      },
    ],
  },
  {
    skuId: "sku-al-3",
    skuName: "有色金属-重熔用铝锭-Al99.70",
    unit: "吨",
    unitPriceYuan: 20450,
    slots: [
      {
        slotId: "slot-al-301",
        warehouseName: "华南大宗监管仓",
        storeroomName: "三号恒温库",
        zoneName: "B区",
        locationCode: "B-03-04",
        inboundTime: "2026-11-01 10:12:00",
        productionDate: "2026-10-12",
        batchExtra: "产地: 广西百色 / 批次: AL261012",
        barcode: "QR-AL-261101-01",
        controlStatus: "存货中",
        availableQty: 180.0,
      },
    ],
  },
  {
    skuId: "sku-rubber-4",
    skuName: "化工原料-天然橡胶-SCR WF(全乳胶)",
    unit: "吨",
    unitPriceYuan: null,
    slots: [
      {
        slotId: "slot-rb-401",
        warehouseName: "青岛保税监管仓",
        storeroomName: "二号橡胶库",
        zoneName: "C区",
        locationCode: "C-04-02",
        inboundTime: "2026-10-25 15:30:00",
        productionDate: "2026-09-18",
        batchExtra: "产季: 2026新胶 / 产地: 海南",
        barcode: "QR-RB-261025-01",
        controlStatus: "存货中",
        availableQty: 64.5,
      },
    ],
  },
  {
    skuId: "sku-beef-5",
    skuName: "冻品农产-牛肉丸-36个月冷链规格",
    unit: "公斤",
    unitPriceYuan: 48.5,
    slots: [
      {
        slotId: "slot-bf-501",
        warehouseName: "生鲜冷链1号仓",
        storeroomName: "冷库2号间",
        zoneName: "冻品分区",
        locationCode: "F-01-08",
        inboundTime: "2026-11-06 08:45:10",
        productionDate: "2026-10-28",
        batchExtra: "温区: -18℃ / 检疫证: 齐全",
        barcode: "QR-BF-261106-01",
        controlStatus: "存货中",
        availableQty: 1500.0,
      },
    ],
  },
]

interface SelectGoodsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qtyColumnLabel: string
  initialLines: GoodsSkuLine[]
  onConfirm: (lines: GoodsSkuLine[]) => void
}

export function SelectGoodsModal({
  open,
  onOpenChange,
  qtyColumnLabel,
  initialLines,
  onConfirm,
}: SelectGoodsModalProps) {
  const allWarehouses = useMemo(
    () =>
      Array.from(
        new Set(AVAILABLE_INVENTORY_CATALOG.flatMap((s) => s.slots.map((sl) => sl.warehouseName))),
      ),
    [],
  )
  const allSkuNames = useMemo(
    () => AVAILABLE_INVENTORY_CATALOG.map((s) => s.skuName),
    [],
  )

  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>(allWarehouses)
  const [selectedSkuNames, setSelectedSkuNames] = useState<string[]>(allSkuNames)
  const [inboundSort, setInboundSort] = useState<"ASC" | "DESC">("ASC")
  const [qtySort, setQtySort] = useState<"DEFAULT" | "DESC" | "ASC">("DEFAULT")
  const [prodDateSort, setProdDateSort] = useState<"DEFAULT" | "ASC" | "DESC">("DEFAULT")
  const [expandedSkus, setExpandedSkus] = useState<Record<string, boolean>>({
    "sku-cu-1": true,
    "sku-steel-2": true,
  })
  const [allocations, setAllocations] = useState<Record<string, string>>({})
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const next: Record<string, string> = {}
    for (const line of initialLines) {
      for (const slot of line.slots) {
        if (slot.allocatedQty > 0) {
          next[slot.slotId] = String(slot.allocatedQty)
        }
      }
    }
    setAllocations(next)
    setErrorMsg(null)
  }, [open, initialLines])

  const filteredCatalog = useMemo(() => {
    return AVAILABLE_INVENTORY_CATALOG.filter((sku) => selectedSkuNames.includes(sku.skuName))
      .map((sku) => {
        let slots = sku.slots.filter((sl) => selectedWarehouses.includes(sl.warehouseName))
        slots = [...slots].sort((a, b) => {
          if (qtySort !== "DEFAULT") {
            return qtySort === "DESC"
              ? b.availableQty - a.availableQty
              : a.availableQty - b.availableQty
          }
          if (prodDateSort !== "DEFAULT") {
            return prodDateSort === "ASC"
              ? a.productionDate.localeCompare(b.productionDate)
              : b.productionDate.localeCompare(a.productionDate)
          }
          return inboundSort === "ASC"
            ? a.inboundTime.localeCompare(b.inboundTime)
            : b.inboundTime.localeCompare(a.inboundTime)
        })
        return { ...sku, slots }
      })
      .filter((sku) => sku.slots.length > 0)
  }, [selectedWarehouses, selectedSkuNames, inboundSort, qtySort, prodDateSort])

  const hasOverLimitError = useMemo(() => {
    for (const sku of AVAILABLE_INVENTORY_CATALOG) {
      for (const slot of sku.slots) {
        const raw = allocations[slot.slotId]
        if (!raw) continue
        const val = Number(raw)
        if (Number.isNaN(val) || val < 0 || val > slot.availableQty) {
          return true
        }
      }
    }
    return false
  }, [allocations])

  const summary = useMemo(() => {
    let typeCount = 0
    let totalQty = 0
    for (const sku of AVAILABLE_INVENTORY_CATALOG) {
      let skuHasPositive = false
      for (const slot of sku.slots) {
        const val = Number(allocations[slot.slotId] ?? "")
        if (!Number.isNaN(val) && val > 0) {
          skuHasPositive = true
          totalQty += val
        }
      }
      if (skuHasPositive) typeCount += 1
    }
    return { typeCount, totalQty: Number(totalQty.toFixed(4)) }
  }, [allocations])

  const setSlotQty = (slotId: string, val: string) => {
    setErrorMsg(null)
    setAllocations((prev) => ({ ...prev, [slotId]: val }))
  }

  const fillAllForSku = (sku: AvailableInventorySku) => {
    setErrorMsg(null)
    setAllocations((prev) => {
      const next = { ...prev }
      for (const slot of sku.slots) {
        next[slot.slotId] = String(slot.availableQty)
      }
      return next
    })
  }

  const clearAllForSku = (sku: AvailableInventorySku) => {
    setErrorMsg(null)
    setAllocations((prev) => {
      const next = { ...prev }
      for (const slot of sku.slots) {
        delete next[slot.slotId]
      }
      return next
    })
  }

  const handleConfirm = () => {
    if (hasOverLimitError) {
      setErrorMsg("录入失败：抵质押数量不能超过货位可用数量，请修正标红项。")
      return
    }
    if (summary.typeCount === 0 || summary.totalQty <= 0) {
      setErrorMsg("添加失败：请至少选择一个货品并分配大于 0 的数量。")
      return
    }
    const resultLines: GoodsSkuLine[] = []
    for (const sku of AVAILABLE_INVENTORY_CATALOG) {
      const chosenSlots: InventorySlotItem[] = []
      for (const slot of sku.slots) {
        const val = Number(allocations[slot.slotId] ?? "")
        if (!Number.isNaN(val) && val > 0) {
          chosenSlots.push({ ...slot, allocatedQty: Number(val.toFixed(4)) })
        }
      }
      if (chosenSlots.length > 0) {
        resultLines.push({
          skuId: sku.skuId,
          skuName: sku.skuName,
          unit: sku.unit,
          unitPriceYuan: sku.unitPriceYuan,
          slots: chosenSlots,
        })
      }
    }
    onConfirm(resultLines)
    onOpenChange(false)
  }

  const toggleAllWarehouses = (checked: boolean) => {
    setSelectedWarehouses(checked ? allWarehouses : [])
  }

  const toggleAllSkus = (checked: boolean) => {
    setSelectedSkuNames(checked ? allSkuNames : [])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl gap-0 p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <PackageCheckIcon className="size-4 text-primary" />
            选择货物（仅展示「存货中」可用货位）
          </DialogTitle>
          <DialogDescription>
            支持按仓库与货品多维筛选及三维排序；支持父级一键「全部 / 清空」，单货位数量不得超过可用数量。
          </DialogDescription>
        </DialogHeader>

        {/* 筛选与排序栏 */}
        <div className="grid gap-3 border-b border-border bg-muted/20 px-6 py-3 lg:grid-cols-5">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>仓库过滤</span>
              <label className="inline-flex cursor-pointer items-center gap-1 text-foreground">
                <Checkbox
                  checked={selectedWarehouses.length === allWarehouses.length}
                  onCheckedChange={(v) => toggleAllWarehouses(Boolean(v))}
                />
                <span>全选</span>
              </label>
            </div>
            <Select
              items={[
                { value: "ALL", label: `全部仓库（${allWarehouses.length}）` },
                ...allWarehouses.map((w) => ({ value: w, label: w })),
              ]}
              value={selectedWarehouses.length === 1 ? selectedWarehouses[0] : "ALL"}
              onValueChange={(v) =>
                setSelectedWarehouses(!v || v === "ALL" ? allWarehouses : [v])
              }
            >
              <SelectTrigger className="h-8 bg-background text-xs">
                <SelectValue placeholder="请选择仓库" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部仓库（{allWarehouses.length}）</SelectItem>
                {allWarehouses.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>货物过滤</span>
              <label className="inline-flex cursor-pointer items-center gap-1 text-foreground">
                <Checkbox
                  checked={selectedSkuNames.length === allSkuNames.length}
                  onCheckedChange={(v) => toggleAllSkus(Boolean(v))}
                />
                <span>全选</span>
              </label>
            </div>
            <Select
              items={[
                { value: "ALL", label: `全部货物（${allSkuNames.length}）` },
                ...allSkuNames.map((name) => ({ value: name, label: name })),
              ]}
              value={selectedSkuNames.length === 1 ? selectedSkuNames[0] : "ALL"}
              onValueChange={(v) => setSelectedSkuNames(!v || v === "ALL" ? allSkuNames : [v])}
            >
              <SelectTrigger className="h-8 bg-background text-xs">
                <SelectValue placeholder="请选择货物" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部货物（{allSkuNames.length}）</SelectItem>
                {allSkuNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="block text-xs text-muted-foreground">入库时间排序</span>
            <Select
              items={[
                { value: "ASC", label: "正序（先进先出）" },
                { value: "DESC", label: "倒序（最新入库）" },
              ]}
              value={inboundSort}
              onValueChange={(v) => {
                setInboundSort(v as "ASC" | "DESC")
                setQtySort("DEFAULT")
                setProdDateSort("DEFAULT")
              }}
            >
              <SelectTrigger className="h-8 bg-background text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">正序（先进先出）</SelectItem>
                <SelectItem value="DESC">倒序（最新入库）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="block text-xs text-muted-foreground">可用数量排序</span>
            <Select
              items={[
                { value: "DEFAULT", label: "默认排序" },
                { value: "DESC", label: "从大到小" },
                { value: "ASC", label: "从小到大" },
              ]}
              value={qtySort}
              onValueChange={(v) => {
                setQtySort(v as "DEFAULT" | "DESC" | "ASC")
                setProdDateSort("DEFAULT")
              }}
            >
              <SelectTrigger className="h-8 bg-background text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">默认排序</SelectItem>
                <SelectItem value="DESC">从大到小</SelectItem>
                <SelectItem value="ASC">从小到大</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="block text-xs text-muted-foreground">生产日期排序</span>
            <Select
              items={[
                { value: "DEFAULT", label: "默认排序" },
                { value: "ASC", label: "从早到晚" },
                { value: "DESC", label: "从晚到早" },
              ]}
              value={prodDateSort}
              onValueChange={(v) => {
                setProdDateSort(v as "DEFAULT" | "ASC" | "DESC")
                setQtySort("DEFAULT")
              }}
            >
              <SelectTrigger className="h-8 bg-background text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEFAULT">默认排序</SelectItem>
                <SelectItem value="ASC">从早到晚</SelectItem>
                <SelectItem value="DESC">从晚到早</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 两级树形选货表 */}
        <div className="max-h-[420px] overflow-auto px-6 py-4">
          {filteredCatalog.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <p className="text-sm text-muted-foreground">当前筛选条件下暂无「存货中」可用货位</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setSelectedWarehouses(allWarehouses)
                  setSelectedSkuNames(allSkuNames)
                }}
              >
                重置筛选条件
              </Button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                    <th className="w-10 px-3 py-2.5 text-center">展开</th>
                    <th className="whitespace-nowrap px-3 py-2.5">货物名称</th>
                    <th className="w-36 px-3 py-2.5 whitespace-nowrap">可用数量</th>
                    <th className="w-44 px-3 py-2.5 whitespace-nowrap">{qtyColumnLabel}</th>
                    <th className="w-28 px-3 py-2.5 text-center whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCatalog.map((sku) => {
                    const isExpanded = Boolean(expandedSkus[sku.skuId])
                    const skuAvailable = sku.slots.reduce((s, x) => s + x.availableQty, 0)
                    const skuAllocated = sku.slots.reduce((s, x) => {
                      const v = Number(allocations[x.slotId] ?? "")
                      return s + (!Number.isNaN(v) && v > 0 ? v : 0)
                    }, 0)

                    return (
                      <FragmentGroup
                        key={sku.skuId}
                        sku={sku}
                        isExpanded={isExpanded}
                        skuAvailable={skuAvailable}
                        skuAllocated={skuAllocated}
                        qtyColumnLabel={qtyColumnLabel}
                        allocations={allocations}
                        onToggle={() =>
                          setExpandedSkus((prev) => ({
                            ...prev,
                            [sku.skuId]: !prev[sku.skuId],
                          }))
                        }
                        onFillAll={() => fillAllForSku(sku)}
                        onClearAll={() => clearAllForSku(sku)}
                        onChangeSlot={setSlotQty}
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {errorMsg ? (
            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {errorMsg}
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex-row items-center justify-between border-t border-border bg-muted/10 px-6 py-3 sm:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span>
              已选货品类型：<strong className="text-foreground">{summary.typeCount}</strong>
            </span>
            <span>
              已选货品总数量：<strong className="text-primary">{summary.totalQty}</strong>
            </span>
            {hasOverLimitError ? (
              <span className="text-xs font-medium text-rose-600">
                存在超额录入，请修改标红货位数量
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={hasOverLimitError}>
              确定
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FragmentGroup({
  sku,
  isExpanded,
  skuAvailable,
  skuAllocated,
  qtyColumnLabel,
  allocations,
  onToggle,
  onFillAll,
  onClearAll,
  onChangeSlot,
}: {
  sku: AvailableInventorySku
  isExpanded: boolean
  skuAvailable: number
  skuAllocated: number
  qtyColumnLabel: string
  allocations: Record<string, string>
  onToggle: () => void
  onFillAll: () => void
  onClearAll: () => void
  onChangeSlot: (slotId: string, val: string) => void
}) {
  return (
    <>
      <tr className="bg-background hover:bg-muted/20">
        <td className="px-3 py-2.5 text-center">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex size-6 items-center justify-center rounded hover:bg-muted"
            aria-label={isExpanded ? "收起" : "展开"}
          >
            {isExpanded ? (
              <ChevronDownIcon className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRightIcon className="size-4 text-muted-foreground" />
            )}
          </button>
        </td>
        <td className="px-3 py-2.5 font-medium text-foreground">
          <div>{sku.skuName}</div>
          <div className="mt-0.5 text-xs font-normal text-muted-foreground">
            基准参考单价：{sku.unitPriceYuan !== null ? `¥${sku.unitPriceYuan.toLocaleString("zh-CN")}/${sku.unit}` : "--（未维护）"}
          </div>
        </td>
        <td className="px-3 py-2.5 whitespace-nowrap text-foreground">
          {Number(skuAvailable.toFixed(4))} {sku.unit}
        </td>
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <Input
              readOnly
              value={skuAllocated > 0 ? String(Number(skuAllocated.toFixed(4))) : ""}
              placeholder="由子货位自动汇总"
              className="h-8 bg-muted/40 text-xs"
            />
            <span className="shrink-0 text-xs text-muted-foreground">{sku.unit}</span>
          </div>
        </td>
        <td className="px-3 py-2.5 text-center whitespace-nowrap">
          <button
            type="button"
            onClick={onFillAll}
            className="mr-2 text-xs font-medium text-primary hover:underline"
          >
            全部
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            清空
          </button>
        </td>
      </tr>

      {isExpanded ? (
        <tr>
          <td colSpan={5} className="bg-muted/15 px-4 py-2.5">
            <div className="overflow-hidden rounded-md border border-border bg-background">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                    <th className="w-10 whitespace-nowrap px-2.5 py-2 text-center">序</th>
                    <th className="px-2.5 py-2">存放位置</th>
                    <th className="whitespace-nowrap px-2.5 py-2">具体位置</th>
                    <th className="px-2.5 py-2 whitespace-nowrap">入库时间</th>
                    <th className="px-2.5 py-2">批次/其他信息</th>
                    <th className="px-2.5 py-2 whitespace-nowrap">状态</th>
                    <th className="px-2.5 py-2 whitespace-nowrap">可用数量</th>
                    <th className="w-36 px-2.5 py-2 whitespace-nowrap">{qtyColumnLabel}</th>
                    <th className="w-24 px-2.5 py-2 text-center whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sku.slots.map((slot, idx) => {
                    const rawVal = allocations[slot.slotId] ?? ""
                    const numVal = Number(rawVal)
                    const isInvalid =
                      rawVal !== "" &&
                      (Number.isNaN(numVal) || numVal < 0 || numVal > slot.availableQty)
                    return (
                      <tr key={slot.slotId} className="hover:bg-muted/10">
                        <td className="px-2.5 py-2 text-center text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="px-2.5 py-2 text-foreground">
                          {slot.warehouseName}-{slot.storeroomName}-{slot.zoneName}
                        </td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-muted-foreground">
                          {slot.locationCode}
                        </td>
                        <td className="px-2.5 py-2 whitespace-nowrap text-muted-foreground">
                          {slot.inboundTime}
                        </td>
                        <td className="px-2.5 py-2 text-muted-foreground">{slot.batchExtra}</td>
                        <td className="px-2.5 py-2 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700"
                          >
                            {slot.controlStatus}
                          </Badge>
                        </td>
                        <td className="px-2.5 py-2 whitespace-nowrap font-medium text-foreground">
                          {slot.availableQty} {sku.unit}
                        </td>
                        <td className="px-2.5 py-2">
                          <Input
                            type="number"
                            min={0}
                            step="any"
                            value={rawVal}
                            onChange={(e) => onChangeSlot(slot.slotId, e.target.value)}
                            placeholder="请输入数量"
                            className={cn(
                              "h-7 text-xs",
                              isInvalid && "border-rose-500 bg-rose-50/40 focus-visible:ring-rose-500",
                            )}
                          />
                          {isInvalid ? (
                            <p className="mt-0.5 text-[10px] text-rose-600">
                              不可超 {slot.availableQty}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-2.5 py-2 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onChangeSlot(slot.slotId, String(slot.availableQty))}
                            className="mr-2 text-primary hover:underline"
                          >
                            全部
                          </button>
                          <button
                            type="button"
                            onClick={() => onChangeSlot(slot.slotId, "")}
                            className="text-muted-foreground hover:text-foreground hover:underline"
                          >
                            清空
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  )
}
