import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  INBOUND_GOODS_FILTER_TREE,
  INBOUND_WAREHOUSE_STOREROOM_TREE,
} from "@prototype/shared/inbound/filter-cascade-trees"

type InboundCascadeFilterSelectProps = {
  variant: "warehouse" | "goods"
  selectedKeys: string[]
  onChange: (keys: string[]) => void
  placeholder?: string
  className?: string
}

export function InboundCascadeFilterSelect({
  variant,
  selectedKeys,
  onChange,
  placeholder,
  className,
}: InboundCascadeFilterSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const goodsTree = INBOUND_GOODS_FILTER_TREE
  const warehouseTree = INBOUND_WAREHOUSE_STOREROOM_TREE

  const [activeL1, setActiveL1] = useState(
    variant === "goods" ? goodsTree[0]?.id : warehouseTree[0]?.id ?? ""
  )
  const [activeL2, setActiveL2] = useState("")

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open])

  const displayLabel = useMemo(() => {
    if (selectedKeys.length === 0) {
      return placeholder ?? (variant === "warehouse" ? "全部仓库" : "全部货品")
    }
    if (selectedKeys.length === 1) {
      const k = selectedKeys[0]!
      return k.length > 18 ? `${k.slice(0, 16)}…` : k.replace(/\|/g, " · ")
    }
    return `已选 ${selectedKeys.length} 项`
  }, [placeholder, selectedKeys, variant])

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
      className={cn(
        "flex size-3.5 shrink-0 items-center justify-center rounded border",
        state === "all" && "border-primary bg-primary text-primary-foreground",
        state === "some" && "border-primary bg-primary/15 text-primary",
        state === "none" && "border-input bg-background"
      )}
    >
      {state === "all" && <Check className="size-2.5 stroke-[3]" />}
      {state === "some" && <Minus className="size-2.5 stroke-[3]" />}
    </button>
  )

  const toggleKeys = (keys: string[], mode: "all" | "some" | "none") => {
    if (mode === "all") {
      onChange(selectedKeys.filter((k) => !keys.includes(k)))
    } else {
      onChange([...new Set([...selectedKeys, ...keys])])
    }
  }

  const renderWarehouse = () => {
    const wh = warehouseTree.find((w) => w.id === activeL1) ?? warehouseTree[0]
    return (
      <div className="flex h-[240px] divide-x">
        <div className="w-[40%] overflow-y-auto p-1">
          {warehouseTree.map((item) => {
            const keys = item.storerooms.map((s) => s.fullKey)
            const hit = keys.filter((k) => selectedKeys.includes(k)).length
            const state: "all" | "some" | "none" =
              hit === 0 ? "none" : hit === keys.length ? "all" : "some"
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-1 rounded-md px-1 py-1.5 text-xs",
                  item.id === wh?.id && "bg-muted font-medium"
                )}
              >
                <CheckBox state={state} onClick={() => toggleKeys(keys, state)} />
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left"
                  onClick={() => setActiveL1(item.id)}
                >
                  {item.name}
                </button>
              </div>
            )
          })}
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto p-1">
          {wh?.storerooms.map((sr) => (
            <label
              key={sr.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted/50"
            >
              <input
                type="checkbox"
                checked={selectedKeys.includes(sr.fullKey)}
                onChange={() => {
                  if (selectedKeys.includes(sr.fullKey)) {
                    onChange(selectedKeys.filter((k) => k !== sr.fullKey))
                  } else {
                    onChange([...selectedKeys, sr.fullKey])
                  }
                }}
              />
              <span className="truncate">{sr.name}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  const level2List = useMemo(() => {
    const cat = goodsTree.find((c) => c.id === activeL1)
    return cat?.children ?? []
  }, [activeL1, goodsTree])

  useEffect(() => {
    if (variant !== "goods") return
    const exists = level2List.some((v) => v.id === activeL2)
    if (!exists && level2List[0]) {
      setActiveL2(level2List[0].id)
    }
  }, [activeL2, level2List, variant])

  const level3List = useMemo(() => {
    const l2 = level2List.find((v) => v.id === activeL2) ?? level2List[0]
    return l2?.children ?? []
  }, [activeL2, level2List])

  const renderGoods = () => {
    const cat = goodsTree.find((c) => c.id === activeL1) ?? goodsTree[0]
    const variety = level2List.find((v) => v.id === activeL2) ?? level2List[0]

    return (
      <div className="flex h-[260px] divide-x">
        <div className="w-[28%] overflow-y-auto p-1">
          {goodsTree.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-1 rounded-md px-1 py-1.5 text-xs",
                item.id === cat?.id && "bg-muted font-medium"
              )}
            >
              <CheckBox
                state={
                  (() => {
                    const keys = item.children.flatMap((v) =>
                      v.children.map((s) => s.fullKey)
                    )
                    const hit = keys.filter((k) => selectedKeys.includes(k)).length
                    if (hit === 0) return "none"
                    if (hit === keys.length) return "all"
                    return "some"
                  })()
                }
                onClick={() => {
                  const keys = item.children.flatMap((v) =>
                    v.children.map((s) => s.fullKey)
                  )
                  const hit = keys.filter((k) => selectedKeys.includes(k)).length
                  toggleKeys(keys, hit === keys.length ? "all" : "none")
                }}
              />
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left"
                onClick={() => {
                  setActiveL1(item.id)
                  setActiveL2(item.children[0]?.id ?? "")
                }}
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>
        <div className="w-[32%] overflow-y-auto p-1">
          {level2List.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-1 rounded-md px-1 py-1.5 text-xs",
                item.id === variety?.id && "bg-muted font-medium"
              )}
            >
              <CheckBox
                state={
                  (() => {
                    const keys = item.children.map((s) => s.fullKey)
                    const hit = keys.filter((k) => selectedKeys.includes(k)).length
                    if (hit === 0) return "none"
                    if (hit === keys.length) return "all"
                    return "some"
                  })()
                }
                onClick={() => {
                  const keys = item.children.map((s) => s.fullKey)
                  const hit = keys.filter((k) => selectedKeys.includes(k)).length
                  toggleKeys(keys, hit === keys.length ? "all" : "none")
                }}
              />
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left"
                onClick={() => setActiveL2(item.id)}
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto p-1">
          {level3List.map((spec) => (
            <label
              key={spec.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted/50"
            >
              <input
                type="checkbox"
                checked={selectedKeys.includes(spec.fullKey)}
                onChange={() => {
                  if (selectedKeys.includes(spec.fullKey)) {
                    onChange(selectedKeys.filter((k) => k !== spec.fullKey))
                  } else {
                    onChange([...selectedKeys, spec.fullKey])
                  }
                }}
              />
              <span className="truncate" title={spec.fullKey}>
                {spec.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors",
          open && "ring-2 ring-ring/20",
          selectedKeys.length > 0 && "border-primary/40 bg-primary/5"
        )}
      >
        <span className="truncate text-left">{displayLabel}</span>
        <ChevronDown className={cn("size-4 shrink-0 opacity-50", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[min(100%,420px)] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg">
          <div className="border-b px-3 py-2 text-xs font-medium text-muted-foreground">
            {variant === "warehouse" ? "仓库 · 库房" : "大类 · 品类 · 规格"}
          </div>
          {variant === "warehouse" ? renderWarehouse() : renderGoods()}
          <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-2">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onChange([])}
            >
              清空
            </button>
            <button
              type="button"
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
              onClick={() => setOpen(false)}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
