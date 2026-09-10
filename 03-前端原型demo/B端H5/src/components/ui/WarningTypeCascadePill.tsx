import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, ChevronDown, ChevronRight, Minus, X } from "lucide-react"
import { getOverlayRoot } from "@/shared/lib/overlay-root"

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

export type WarningTypeCascadeGroup = {
  category: string
  subTypes: string[]
}

type WarningTypeCascadePillProps = {
  groups: WarningTypeCascadeGroup[]
  selectedWarningTypes: string[]
  selectedSubTypes: string[]
  onChange: (warningTypes: string[], subTypes: string[]) => void
  placeholder?: string
}

type MenuPosition = {
  top: number
  left: number
  width: number
}

export function WarningTypeCascadePill({
  groups,
  selectedWarningTypes,
  selectedSubTypes,
  onChange,
  placeholder = "预警类型",
}: WarningTypeCascadePillProps) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(groups[0]?.category ?? "")
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const overlayRootRef = useRef<HTMLElement | null>(null)

  const currentGroup = useMemo(
    () => groups.find((group) => group.category === activeCategory) ?? groups[0],
    [activeCategory, groups]
  )

  const getCategoryCheckState = useCallback(
    (group: WarningTypeCascadeGroup): "all" | "some" | "none" => {
      if (group.subTypes.length === 0) {
        return selectedWarningTypes.includes(group.category) ? "all" : "none"
      }

      const checkedCount = group.subTypes.filter((subType) =>
        selectedSubTypes.includes(subType)
      ).length

      // Keep compatibility with the previous H5 single-level filter cache.
      if (checkedCount === 0 && selectedWarningTypes.includes(group.category)) {
        return "all"
      }
      if (checkedCount === group.subTypes.length) return "all"
      if (checkedCount > 0) return "some"
      return "none"
    },
    [selectedSubTypes, selectedWarningTypes]
  )

  const displayLabel = useMemo(() => {
    if (selectedWarningTypes.length === 0 && selectedSubTypes.length === 0) {
      return placeholder
    }

    if (selectedWarningTypes.length === 1) {
      const group = groups.find(
        (item) => item.category === selectedWarningTypes[0]
      )
      if (group && getCategoryCheckState(group) === "all") {
        return group.category
      }
    }

    if (selectedSubTypes.length === 1) {
      return selectedSubTypes[0]
    }
    return `已选 ${selectedSubTypes.length} 项`
  }, [getCategoryCheckState, groups, placeholder, selectedSubTypes, selectedWarningTypes])

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current
    const root = overlayRootRef.current ?? getOverlayRoot(containerRef.current)
    if (!trigger || !root) return

    overlayRootRef.current = root
    const triggerRect = trigger.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()
    const width = Math.min(352, Math.max(280, rootRect.width - 16))
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

    setActiveCategory(
      selectedWarningTypes[0] ?? groups[0]?.category ?? ""
    )
    updateMenuPosition()
    const handleReposition = () => updateMenuPosition()
    window.addEventListener("resize", handleReposition)
    window.addEventListener("scroll", handleReposition, true)
    return () => {
      window.removeEventListener("resize", handleReposition)
      window.removeEventListener("scroll", handleReposition, true)
    }
  }, [groups, open, updateMenuPosition])

  const handleToggleCategory = (group: WarningTypeCascadeGroup) => {
    const state = getCategoryCheckState(group)
    let nextWarningTypes = [...selectedWarningTypes]
    let nextSubTypes = [...selectedSubTypes]

    if (state === "all") {
      nextWarningTypes = nextWarningTypes.filter(
        (type) => type !== group.category
      )
      nextSubTypes = nextSubTypes.filter(
        (subType) => !group.subTypes.includes(subType)
      )
    } else {
      if (!nextWarningTypes.includes(group.category)) {
        nextWarningTypes.push(group.category)
      }
      group.subTypes.forEach((subType) => {
        if (!nextSubTypes.includes(subType)) {
          nextSubTypes.push(subType)
        }
      })
    }

    onChange(nextWarningTypes, nextSubTypes)
  }

  const handleToggleSubType = (
    group: WarningTypeCascadeGroup,
    subType: string
  ) => {
    const nextSubTypes = selectedSubTypes.includes(subType)
      ? selectedSubTypes.filter((item) => item !== subType)
      : [...selectedSubTypes, subType]
    const checkedInGroup = group.subTypes.filter((item) =>
      nextSubTypes.includes(item)
    )
    let nextWarningTypes = [...selectedWarningTypes]

    if (checkedInGroup.length > 0) {
      if (!nextWarningTypes.includes(group.category)) {
        nextWarningTypes.push(group.category)
      }
    } else {
      nextWarningTypes = nextWarningTypes.filter(
        (type) => type !== group.category
      )
    }

    onChange(nextWarningTypes, nextSubTypes)
  }

  const handleClearAll = () => onChange([], [])
  const hasSelection =
    selectedWarningTypes.length > 0 || selectedSubTypes.length > 0
  const overlayRoot =
    overlayRootRef.current ?? getOverlayRoot(containerRef.current)

  return (
    <div className="relative inline-block shrink-0" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!open) {
            overlayRootRef.current = getOverlayRoot(containerRef.current)
          }
          setOpen((current) => !current)
        }}
        className={cn(
          "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
          hasSelection
            ? "border border-blue-200 bg-blue-50 font-semibold text-blue-600"
            : "bg-[#f4f5f7] text-gray-700 hover:bg-gray-200 active:bg-gray-200",
          open && "ring-2 ring-blue-100"
        )}
        aria-expanded={open}
      >
        <span className="max-w-[108px] truncate">{displayLabel}</span>
        {hasSelection && (
          <span
            role="button"
            tabIndex={0}
            className="rounded-full p-0.5 text-blue-500 hover:bg-blue-100"
            aria-label="清空预警类型筛选"
            onClick={(event) => {
              event.stopPropagation()
              handleClearAll()
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                event.stopPropagation()
                handleClearAll()
              }
            }}
          >
            <X className="size-3" />
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-3 text-gray-400 transition-transform",
            open && "rotate-180 text-blue-600"
          )}
        />
      </button>

      {open &&
        menuPosition &&
        createPortal(
          <>
            <button
              type="button"
              className="absolute inset-0 z-40 touch-none"
              aria-label="关闭预警类型筛选"
              onClick={() => setOpen(false)}
            />
            <div
              className="absolute z-50 overflow-hidden rounded-xl border border-gray-100 bg-white text-gray-900 shadow-xl animate-scale-up"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                width: menuPosition.width,
              }}
            >
              <div className="border-b border-gray-100 px-3 py-2 text-xs font-bold text-gray-500">
                预警类型
              </div>

              <div className="flex h-[270px] divide-x divide-gray-100">
                <div className="w-[132px] shrink-0 space-y-0.5 overflow-y-auto p-1.5">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs",
                      !hasSelection
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                    onClick={handleClearAll}
                  >
                    <span>全部类别</span>
                    {!hasSelection && <Check className="size-3.5" />}
                  </button>
                  <div className="my-1 border-t border-gray-100" />

                  {groups.map((group) => {
                    const state = getCategoryCheckState(group)
                    const active = group.category === activeCategory
                    return (
                      <div
                        key={group.category}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-1.5 py-1.5 text-xs",
                          active
                            ? "bg-blue-50 font-semibold text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                        onClick={() => setActiveCategory(group.category)}
                      >
                        <button
                          type="button"
                          className={cn(
                            "flex size-3.5 shrink-0 items-center justify-center rounded border",
                            state === "all"
                              ? "border-blue-600 bg-blue-600 text-white"
                              : state === "some"
                                ? "border-blue-600 bg-blue-100 text-blue-600"
                                : "border-gray-300 bg-white"
                          )}
                          aria-label={`${state === "all" ? "取消" : "选择"}${group.category}`}
                          onClick={(event) => {
                            event.stopPropagation()
                            handleToggleCategory(group)
                          }}
                        >
                          {state === "all" && <Check className="size-2.5 stroke-[3]" />}
                          {state === "some" && <Minus className="size-2.5 stroke-[3]" />}
                        </button>
                        <button
                          type="button"
                          className="min-w-0 flex-1 truncate text-left"
                          onClick={() => setActiveCategory(group.category)}
                        >
                          {group.category}
                        </button>
                        <ChevronRight
                          className={cn(
                            "size-3 shrink-0 text-gray-300",
                            active && "text-blue-600"
                          )}
                        />
                      </div>
                    )
                  })}
                </div>

                <div className="min-w-0 flex-1 overflow-y-auto p-2">
                  {currentGroup ? (
                    <>
                      <div className="mb-1.5 flex items-center justify-between border-b border-gray-100 px-1 pb-1.5">
                        <span className="truncate text-[11px] font-medium text-gray-500">
                          {currentGroup.category} 子项
                        </span>
                        <button
                          type="button"
                          className="shrink-0 text-[11px] text-blue-600"
                          onClick={() => handleToggleCategory(currentGroup)}
                        >
                          {getCategoryCheckState(currentGroup) === "all"
                            ? "取消全选"
                            : "本类全选"}
                        </button>
                      </div>
                      <div className="space-y-0.5">
                        {currentGroup.subTypes.map((subType) => {
                          const checked = selectedSubTypes.includes(subType)
                          return (
                            <label
                              key={subType}
                              className={cn(
                                "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs",
                                checked
                                  ? "bg-blue-50 font-semibold text-blue-700"
                                  : "text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              <input
                                type="checkbox"
                                className="size-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={checked}
                                onChange={() =>
                                  handleToggleSubType(currentGroup, subType)
                                }
                              />
                              <span className="truncate">{subType}</span>
                            </label>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-xs text-gray-400">
                      请选择预警大类
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-3 py-2">
                <span className="text-xs text-gray-500">
                  已选 <strong className="text-gray-800">{selectedSubTypes.length}</strong> 项
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 text-xs text-gray-500"
                    onClick={handleClearAll}
                  >
                    清空
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white"
                    onClick={() => setOpen(false)}
                  >
                    确定
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
