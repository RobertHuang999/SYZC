import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, Minus } from "lucide-react"
import { getOverlayRoot } from "@/shared/lib/overlay-root"
import type { WarehouseStoreroomNode } from "@prototype/shared/inbound/filter-cascade-trees"

type MenuPosition = { top: number; left: number; width: number }

type Props = {
  tree: WarehouseStoreroomNode[]
  selectedFullKeys: string[]
  onChange: (fullKeys: string[]) => void
  placeholder?: string
}

export function WarehouseStoreroomCascadePill({
  tree,
  selectedFullKeys,
  onChange,
  placeholder = "仓库",
}: Props) {
  const [open, setOpen] = useState(false)
  const [activeWarehouseId, setActiveWarehouseId] = useState(tree[0]?.id ?? "")
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const overlayRootRef = useRef<HTMLElement | null>(null)

  const activeWarehouse = useMemo(
    () => tree.find((w) => w.id === activeWarehouseId) ?? tree[0],
    [activeWarehouseId, tree]
  )

  const hasSelection = selectedFullKeys.length > 0

  const displayLabel = useMemo(() => {
    if (!hasSelection) return placeholder
    if (selectedFullKeys.length === 1) {
      const parts = selectedFullKeys[0]!.split("|")
      return parts.length === 2 ? `${parts[0]}·${parts[1]}` : selectedFullKeys[0]!
    }
    return `仓库(${selectedFullKeys.length})`
  }, [hasSelection, placeholder, selectedFullKeys])

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    const root = overlayRootRef.current ?? getOverlayRoot(containerRef.current)
    if (!trigger || !root) return
    overlayRootRef.current = root
    const triggerRect = trigger.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()
    const width = Math.min(320, Math.max(260, rootRect.width - 16))
    setMenuPosition({
      top: triggerRect.bottom - rootRect.top + 4,
      left: Math.min(Math.max(8, triggerRect.left - rootRect.left), rootRect.width - width - 8),
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

  const warehouseState = (wh: WarehouseStoreroomNode): "all" | "some" | "none" => {
    const keys = wh.storerooms.map((s) => s.fullKey)
    const hit = keys.filter((k) => selectedFullKeys.includes(k)).length
    if (hit === 0) return "none"
    if (hit === keys.length) return "all"
    return "some"
  }

  const toggleWarehouse = (wh: WarehouseStoreroomNode) => {
    const keys = wh.storerooms.map((s) => s.fullKey)
    if (warehouseState(wh) === "all") {
      onChange(selectedFullKeys.filter((k) => !keys.includes(k)))
    } else {
      onChange([...new Set([...selectedFullKeys, ...keys])])
    }
  }

  const toggleStoreroom = (fullKey: string) => {
    if (selectedFullKeys.includes(fullKey)) {
      onChange(selectedFullKeys.filter((k) => k !== fullKey))
    } else {
      onChange([...selectedFullKeys, fullKey])
    }
  }

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

  const overlayRoot =
    overlayRootRef.current ?? getOverlayRoot(containerRef.current)

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
        <ChevronDown className={`size-3 shrink-0 opacity-60 ${open ? "rotate-180" : ""}`} />
      </button>

      {open &&
        menuPosition &&
        createPortal(
          <>
            <button
              type="button"
              className="absolute inset-0 z-40 touch-none"
              aria-label="关闭仓库筛选"
              onClick={() => setOpen(false)}
            />
            <div
              className="absolute z-50 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                width: menuPosition.width,
              }}
            >
              <div className="border-b border-gray-100 px-3 py-2 text-[10px] font-bold text-gray-400">
                仓库 / 库房
              </div>
              <div className="flex h-[220px] divide-x divide-gray-100">
                <div className="w-[42%] overflow-y-auto p-1">
                  {tree.map((wh) => {
                    const active = wh.id === activeWarehouse?.id
                    return (
                      <div
                        key={wh.id}
                        className={`flex items-center gap-1 rounded-lg px-1 py-1.5 text-xs ${
                          active ? "bg-blue-50 font-semibold text-blue-700" : ""
                        }`}
                      >
                        <CheckBox state={warehouseState(wh)} onClick={() => toggleWarehouse(wh)} />
                        <button
                          type="button"
                          className="min-w-0 flex-1 truncate text-left"
                          onClick={() => setActiveWarehouseId(wh.id)}
                        >
                          {wh.name}
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div className="min-w-0 flex-1 overflow-y-auto p-1">
                  {activeWarehouse?.storerooms.map((sr) => {
                    const checked = selectedFullKeys.includes(sr.fullKey)
                    return (
                      <label
                        key={sr.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                          checked ? "bg-blue-50 font-semibold text-blue-700" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="size-3.5 rounded border-gray-300 text-blue-600"
                          checked={checked}
                          onChange={() => toggleStoreroom(sr.fullKey)}
                        />
                        <span className="truncate">{sr.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-3 py-2">
                <span className="text-xs text-gray-500">
                  已选 <strong>{selectedFullKeys.length}</strong> 个库房
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
