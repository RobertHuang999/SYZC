import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { leafKeysOf, type CascadeNode } from "@/features/shared/lib/inventory-cascade"

type InventoryCascadeSelectProps = {
  tree: CascadeNode[]
  selectedKeys: string[]
  onChange: (keys: string[]) => void
  placeholder: string
  disabled?: boolean
  className?: string
  /** 弹层顶部说明，如「仓库 · 库房 · 分区」 */
  levelHint: string
}

function selectionState(keys: string[], selectedKeys: string[]): "all" | "some" | "none" {
  const hit = keys.filter((key) => selectedKeys.includes(key)).length
  if (hit === 0) return "none"
  if (hit === keys.length) return "all"
  return "some"
}

function CheckBox({
  state,
  onClick,
}: {
  state: "all" | "some" | "none"
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
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
}

/** 仓库 / 货品通用的三级级联多选筛选器 */
export function InventoryCascadeSelect({
  tree,
  selectedKeys,
  onChange,
  placeholder,
  disabled = false,
  className,
  levelHint,
}: InventoryCascadeSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [activeL1, setActiveL1] = useState(tree[0]?.id ?? "")
  const [activeL2, setActiveL2] = useState(tree[0]?.children?.[0]?.id ?? "")

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open])

  const level1Node = tree.find((node) => node.id === activeL1) ?? tree[0]
  const level2List = level1Node?.children ?? []
  const level2Node = level2List.find((node) => node.id === activeL2) ?? level2List[0]
  const level3List = level2Node?.children ?? []

  const displayLabel = useMemo(() => {
    if (selectedKeys.length === 0) return placeholder
    if (selectedKeys.length === 1) {
      return selectedKeys[0]!.split("|").join(" · ")
    }
    const leafNames = selectedKeys.map((key) => key.split("|").slice(-1)[0])
    if (leafNames.length === 2) {
      return leafNames.join("、")
    }
    return `${leafNames[0]} 等 ${leafNames.length} 项`
  }, [placeholder, selectedKeys])

  const displayTitle = useMemo(
    () => selectedKeys.map((key) => key.split("|").join(" · ")).join("\n"),
    [selectedKeys]
  )

  const toggleKeys = (keys: string[]) => {
    const allSelected = keys.every((key) => selectedKeys.includes(key))
    if (allSelected) {
      onChange(selectedKeys.filter((key) => !keys.includes(key)))
    } else {
      onChange([...new Set([...selectedKeys, ...keys])])
    }
  }

  const toggleLeaf = (key: string) => {
    if (selectedKeys.includes(key)) {
      onChange(selectedKeys.filter((item) => item !== key))
    } else {
      onChange([...selectedKeys, key])
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        title={selectedKeys.length > 0 ? displayTitle : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-[34px] w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-[13px] text-foreground shadow-xs transition-colors",
          open && "ring-2 ring-ring/20",
          selectedKeys.length > 0 && "border-primary/40",
          disabled && "cursor-not-allowed bg-muted opacity-70"
        )}
      >
        <span className={cn("truncate text-left", selectedKeys.length === 0 && "text-muted-foreground")}>
          {displayLabel}
        </span>
        <ChevronDown className={cn("size-4 shrink-0 opacity-50", open && "rotate-180")} />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[min(100%,460px)] min-w-[420px] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg">
          <div className="flex items-center justify-between border-b px-3 py-2 text-xs font-medium text-muted-foreground">
            <span>{levelHint}</span>
            <span>可多选</span>
          </div>

          <div className="flex h-[264px] divide-x">
            {/* 一级 */}
            <div className="w-[30%] overflow-y-auto p-1">
              {tree.map((node) => {
                const keys = leafKeysOf(node.children)
                return (
                  <div
                    key={node.id}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-1 py-1.5 text-[13px]",
                      node.id === level1Node?.id && "bg-muted font-medium"
                    )}
                  >
                    <CheckBox
                      state={selectionState(keys, selectedKeys)}
                      onClick={() => toggleKeys(keys)}
                    />
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate text-left"
                      onClick={() => {
                        setActiveL1(node.id)
                        setActiveL2(node.children?.[0]?.id ?? "")
                      }}
                    >
                      {node.name}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* 二级 */}
            <div className="w-[32%] overflow-y-auto p-1">
              {level2List.map((node) => {
                const keys = leafKeysOf(node.children)
                return (
                  <div
                    key={node.id}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-1 py-1.5 text-[13px]",
                      node.id === level2Node?.id && "bg-muted font-medium"
                    )}
                  >
                    <CheckBox
                      state={selectionState(keys, selectedKeys)}
                      onClick={() => toggleKeys(keys)}
                    />
                    <button
                      type="button"
                      className="min-w-0 flex-1 truncate text-left"
                      onClick={() => setActiveL2(node.id)}
                    >
                      {node.name}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* 三级 */}
            <div className="min-w-0 flex-1 overflow-y-auto p-1">
              {level3List.map((node) => (
                <label
                  key={node.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-[13px] hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    checked={selectedKeys.includes(node.id)}
                    onChange={() => toggleLeaf(node.id)}
                  />
                  <span className="truncate" title={node.name}>
                    {node.name}
                  </span>
                </label>
              ))}
              {level3List.length === 0 && (
                <div className="px-2 py-3 text-[13px] text-muted-foreground">暂无可选项</div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-2">
            <button
              type="button"
              className="text-[13px] text-muted-foreground hover:text-foreground"
              onClick={() => onChange([])}
            >
              清空
            </button>
            <button
              type="button"
              className="rounded-md bg-primary px-3 py-1 text-[13px] font-medium text-primary-foreground"
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
