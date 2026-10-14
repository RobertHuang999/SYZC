import { useEffect, useMemo, useState } from "react"
import { Check } from "lucide-react"
import {
  buildInboundSkuCascadeTree,
  formatSkuTriggerLabel,
  getSkuById,
  type GoodsSkuRecord,
} from "../../../../../shared/goods/goods-sku-catalog"

type Props = {
  open: boolean
  selectedSkuId?: string
  onClose: () => void
  onSelect: (sku: GoodsSkuRecord) => void
}

export function InboundGoodsSkuCascadeSheet({
  open,
  selectedSkuId,
  onClose,
  onSelect,
}: Props) {
  const tree = useMemo(() => buildInboundSkuCascadeTree(), [])

  const selectedSku = selectedSkuId ? getSkuById(selectedSkuId) : undefined

  const [activeCategory, setActiveCategory] = useState("")
  const [activeVariety, setActiveVariety] = useState("")

  useEffect(() => {
    if (!open) return
    const cat =
      selectedSku?.category ?? tree[0]?.name ?? ""
    const variety =
      selectedSku?.variety ?? tree.find((c) => c.name === cat)?.varieties[0]?.name ?? ""
    setActiveCategory(cat)
    setActiveVariety(variety)
  }, [open, selectedSku?.category, selectedSku?.variety, tree])

  const activeCategoryNode = tree.find((c) => c.name === activeCategory) ?? tree[0]
  const activeVarietyNode =
    activeCategoryNode?.varieties.find((v) => v.name === activeVariety) ??
    activeCategoryNode?.varieties[0]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40">
      <button type="button" className="min-h-0 flex-1" aria-label="关闭" onClick={onClose} />
      <div className="flex max-h-[78vh] flex-col rounded-t-2xl bg-white pb-safe">
        <div className="border-b border-[#232D39]/10 px-4 py-3 text-center text-sm font-medium text-[#232D39]">
          选择货品（大类 / 品类 / 规格）
        </div>
        <div className="flex min-h-[240px] flex-1 divide-x divide-[#232D39]/10">
          <div className="w-[28%] shrink-0 overflow-y-auto py-1">
            {tree.map((cat) => {
              const active = cat.name === activeCategoryNode?.name
              return (
                <button
                  key={cat.name}
                  type="button"
                  className={`block w-full truncate px-3 py-3 text-left text-xs ${
                    active
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-[#232D39]"
                  }`}
                  onClick={() => {
                    setActiveCategory(cat.name)
                    setActiveVariety(cat.varieties[0]?.name ?? "")
                  }}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
          <div className="w-[30%] shrink-0 overflow-y-auto py-1">
            {activeCategoryNode?.varieties.map((variety) => {
              const active = variety.name === activeVarietyNode?.name
              return (
                <button
                  key={variety.name}
                  type="button"
                  className={`block w-full truncate px-3 py-3 text-left text-xs ${
                    active
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-[#232D39]"
                  }`}
                  onClick={() => setActiveVariety(variety.name)}
                >
                  {variety.name}
                </button>
              )
            })}
          </div>
          <div className="min-w-0 flex-1 overflow-y-auto py-1">
            {activeVarietyNode?.skus.map((sku) => {
              const active = sku.skuId === selectedSkuId
              const summary = formatSkuTriggerLabel(sku)
              return (
                <button
                  key={sku.skuId}
                  type="button"
                  className={`flex w-full items-start gap-2 px-3 py-3 text-left text-xs ${
                    active ? "bg-blue-50 text-blue-600" : "text-[#232D39]"
                  }`}
                  onClick={() => {
                    onSelect(sku)
                    onClose()
                  }}
                >
                  {active ? (
                    <Check className="mt-0.5 size-3.5 shrink-0 stroke-[3]" />
                  ) : (
                    <span className="size-3.5 shrink-0" />
                  )}
                  <span className="min-w-0">
                    <span className="block font-medium">{summary}</span>
                    <span className="mt-0.5 block truncate text-[10px] opacity-60">
                      {sku.category} · {sku.variety}
                    </span>
                  </span>
                </button>
              )
            })}
            {!activeVarietyNode?.skus.length ? (
              <p className="px-3 py-6 text-center text-xs text-[#232D39]/40">暂无有效货品</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
