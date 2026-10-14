import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, Minus } from "lucide-react"
import { getOverlayRoot } from "@/shared/lib/overlay-root"
import type {
  GoodsSpecCategory,
  GoodsSpecVariety,
} from "../mock/inbound-goods-cascade.mock"

type MenuPosition = { top: number; left: number; width: number }

type GoodsSpecCascadePillProps = {
  tree: GoodsSpecCategory[]
  /** 选中的规格 fullKey 列表；空表示全部 */
  selectedFullKeys: string[]
  onChange: (fullKeys: string[]) => void
  placeholder?: string
}

export function GoodsSpecCascadePill({
  tree,
  selectedFullKeys,
  onChange,
  placeholder = "货物",
}: GoodsSpecCascadePillProps) {
  const [open, setOpen] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState(tree[0]?.id ?? "")
  const [activeVarietyId, setActiveVarietyId] = useState("")
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const overlayRootRef = useRef<HTMLElement | null>(null)

  const activeCategory = useMemo(
    () => tree.find((c) => c.id === activeCategoryId) ?? tree[0],
    [activeCategoryId, tree]
  )

  const activeVariety = useMemo(() => {
    if (!activeCategory) return undefined
    return (
      activeCategory.varieties.find((v) => v.id === activeVarietyId) ??
      activeCategory.varieties[0]
    )
  }, [activeCategory, activeVarietyId])

  useEffect(() => {
    if (activeCategory && !activeVarietyId) {
      setActiveVarietyId(activeCategory.varieties[0]?.id ?? "")
    }
  }, [activeCategory, activeVarietyId])

  const hasSelection = selectedFullKeys.length > 0

  const displayLabel = useMemo(() => {
    if (!hasSelection) return placeholder
    if (selectedFullKeys.length === 1) {
      const key = selectedFullKeys[0]!
      const parts = key.split("-")
      if (parts.length >= 3) {
        return parts.slice(2).join("-").length > 8
          ? `${parts[0]}-${parts[1]}…`
          : key.replace(/-/g, "·").slice(0, 12)
      }
      return key.slice(0, 10)
    }
    return `货物(${selectedFullKeys.length})`
  }, [hasSelection, placeholder, selectedFullKeys])

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    const root = overlayRootRef.current ?? getOverlayRoot(containerRef.current)
    if (!trigger || !root) return
    overlayRootRef.current = root
    const triggerRect = trigger.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()
    const width = Math.min(360, Math.max(300, rootRect.width - 16))
    const left = Math.min(
      Math.max(8, triggerRect.left - rootRect.left),
      rootRect.width - width - 8
    )
    setMenuPosition({
      top: triggerRect.bottom - rootRect.top + 4,
      left,
      width,
    })
  }, [])

  useEffect(() => {
    if (!open) {
      setMenuPosition(null)
      return
    }
    updateMenuPosition()
    const handleReposition = () => updateMenuPosition()
    window.addEventListener("resize", handleReposition)
    window.addEventListener("scroll", handleReposition, true)
    return () => {
      window.removeEventListener("resize", handleReposition)
      window.removeEventListener("scroll", handleReposition, true)
    }
  }, [open, updateMenuPosition])

  const toggleSpec = (fullKey: string) => {
    if (selectedFullKeys.includes(fullKey)) {
      onChange(selectedFullKeys.filter((k) => k !== fullKey))
    } else {
      onChange([...selectedFullKeys, fullKey])
    }
  }

  const allKeysUnderVariety = (variety: GoodsSpecVariety) =>
    variety.specs.map((s) => s.fullKey)

  const varietyCheckState = (variety: GoodsSpecVariety): "all" | "some" | "none" => {
    const keys = allKeysUnderVariety(variety)
    const hit = keys.filter((k) => selectedFullKeys.includes(k)).length
    if (hit === 0) return "none"
    if (hit === keys.length) return "all"
    return "some"
  }

  const toggleVariety = (variety: GoodsSpecVariety) => {
    const keys = allKeysUnderVariety(variety)
    const state = varietyCheckState(variety)
    if (state === "all") {
      onChange(selectedFullKeys.filter((k) => !keys.includes(k)))
    } else {
      const merged = new Set([...selectedFullKeys, ...keys])
      onChange([...merged])
    }
  }

  const categoryCheckState = (cat: GoodsSpecCategory): "all" | "some" | "none" => {
    const keys = cat.varieties.flatMap(allKeysUnderVariety)
    const hit = keys.filter((k) => selectedFullKeys.includes(k)).length
    if (hit === 0) return "none"
    if (hit === keys.length) return "all"
    return "some"
  }

  const toggleCategory = (cat: GoodsSpecCategory) => {
    const keys = cat.varieties.flatMap(allKeysUnderVariety)
    const state = categoryCheckState(cat)
    if (state === "all") {
      onChange(selectedFullKeys.filter((k) => !keys.includes(k)))
    } else {
      onChange([...new Set([...selectedFullKeys, ...keys])])
    }
  }

  const overlayRoot =
    overlayRootRef.current ?? getOverlayRoot(containerRef.current)

  const CheckBox = ({
    state,
    onClick,
  }: {
    state: "all" | "some" | "none"
    onClick: () => void
  }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`flex size-3.5 shrink-0 items-center justify-center rounded border ${
        state === "all"
          ? "border-blue-600 bg-blue-600 text-white"
          : state === "some"
            ? "border-blue-600 bg-blue-100 text-blue-600"
            : "border-gray-300 bg-white"
      }`}
    >
      {state === "all" && <Check className="size-2.5 stroke-[3]" />}
      {state === "some" && <Minus className="size-2.5 stroke-[3]" />}
    </button>
  )

  return (
    <div className="relative inline-block shrink-0" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!open) overlayRootRef.current = getOverlayRoot(containerRef.current)
          setOpen((v) => !v)
        }}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
          hasSelection
            ? "border border-blue-200 bg-blue-50 font-semibold text-blue-600"
            : "bg-[#232D39]/5 text-[#232D39]/70 hover:bg-[#232D39]/10"
        }`}
      >
        <span className="max-w-[85px] truncate">{displayLabel}</span>
        <ChevronDown
          className={`size-3 shrink-0 opacity-60 transition-transform ${open ? "rotate-180 text-blue-600" : ""}`}
        />
      </button>

      {open &&
        menuPosition &&
        createPortal(
          <>
            <button
              type="button"
              className="absolute inset-0 z-40 touch-none"
              aria-label="关闭货物筛选"
              onClick={() => setOpen(false)}
            />
            <div
              className="absolute z-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl animate-scale-up"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                width: menuPosition.width,
              }}
            >
              <div className="border-b border-gray-100 px-3 py-2 text-[10px] font-bold text-gray-400">
                货物 · 大类 / 品类 / 规格
              </div>
              <div className="flex h-[240px] divide-x divide-gray-100">
                <div className="w-[30%] shrink-0 overflow-y-auto p-1">
                  {tree.map((cat) => {
                    const active = cat.id === activeCategory?.id
                    const state = categoryCheckState(cat)
                    return (
                      <div
                        key={cat.id}
                        className={`flex items-center gap-1 rounded-lg px-1 py-1.5 text-xs ${
                          active ? "bg-blue-50 font-semibold text-blue-700" : "text-gray-700"
                        }`}
                      >
                        <CheckBox state={state} onClick={() => toggleCategory(cat)} />
                        <button
                          type="button"
                          className="min-w-0 flex-1 truncate text-left"
                          onClick={() => {
                            setActiveCategoryId(cat.id)
                            setActiveVarietyId(cat.varieties[0]?.id ?? "")
                          }}
                        >
                          {cat.name}
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div className="w-[32%] shrink-0 overflow-y-auto p-1">
                  {activeCategory?.varieties.map((variety) => {
                    const active = variety.id === activeVariety?.id
                    const state = varietyCheckState(variety)
                    return (
                      <div
                        key={variety.id}
                        className={`flex items-center gap-1 rounded-lg px-1 py-1.5 text-xs ${
                          active ? "bg-blue-50 font-semibold text-blue-700" : "text-gray-700"
                        }`}
                      >
                        <CheckBox state={state} onClick={() => toggleVariety(variety)} />
                        <button
                          type="button"
                          className="min-w-0 flex-1 truncate text-left"
                          onClick={() => setActiveVarietyId(variety.id)}
                        >
                          {variety.name}
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div className="min-w-0 flex-1 overflow-y-auto p-1">
                  {activeVariety?.specs.map((spec) => {
                    const checked = selectedFullKeys.includes(spec.fullKey)
                    return (
                      <label
                        key={spec.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                          checked ? "bg-blue-50 font-semibold text-blue-700" : "text-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="size-3.5 rounded border-gray-300 text-blue-600"
                          checked={checked}
                          onChange={() => toggleSpec(spec.fullKey)}
                        />
                        <span className="truncate" title={spec.fullKey}>
                          {spec.name}
                        </span>
                      </label>
                    )
                  })}
                  {!activeVariety?.specs.length && (
                    <p className="p-4 text-center text-xs text-gray-400">请选择品类</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-3 py-2">
                <span className="text-xs text-gray-500">
                  已选 <strong className="text-gray-800">{selectedFullKeys.length}</strong> 个规格
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 text-xs text-gray-500"
                    onClick={() => onChange([])}
                  >
                    清空
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white"
                    onClick={() => setOpen(false)}
                  >
                    确认
                  </button>
                </div>
              </div>
            </div>
          </>,
          overlayRoot
        )}
    </div>
  )
}
