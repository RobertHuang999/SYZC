import { useMemo, useState, useRef, useEffect } from "react"
import { ChevronDownIcon, ChevronRightIcon, SearchIcon, XIcon, CheckIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type WarningTypeGroup = {
  category: string
  subTypes: string[]
}

export type WarningTypeCascadeSelectProps = {
  groups: WarningTypeGroup[]
  selectedWarningTypes: string[]
  selectedSubTypes: string[]
  onChange: (warningTypes: string[], subTypes: string[]) => void
  placeholder?: string
  className?: string
}

export function WarningTypeCascadeSelect({
  groups,
  selectedWarningTypes,
  selectedSubTypes,
  onChange,
  placeholder = "全部",
  className,
}: WarningTypeCascadeSelectProps) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>(groups[0]?.category ?? "")
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  // 当前高亮的大类
  const currentGroup = useMemo(() => {
    return groups.find((g) => g.category === activeCategory) || groups[0]
  }, [groups, activeCategory])

  // 大类的选中状态计算：'all' | 'some' | 'none'
  const getCategoryCheckState = (group: WarningTypeGroup): "all" | "some" | "none" => {
    if (!group.subTypes || group.subTypes.length === 0) {
      return selectedWarningTypes.includes(group.category) ? "all" : "none"
    }
    const checkedCount = group.subTypes.filter((sub) => selectedSubTypes.includes(sub)).length
    if (checkedCount === 0) return "none"
    if (checkedCount === group.subTypes.length) return "all"
    return "some"
  }

  // 切换大类全选/全不选
  const handleToggleCategory = (group: WarningTypeGroup) => {
    const state = getCategoryCheckState(group)
    let nextWarningTypes = [...selectedWarningTypes]
    let nextSubTypes = [...selectedSubTypes]

    if (state === "all") {
      // 全不选
      nextWarningTypes = nextWarningTypes.filter((t) => t !== group.category)
      nextSubTypes = nextSubTypes.filter((sub) => !group.subTypes.includes(sub))
    } else {
      // 全选该大类
      if (!nextWarningTypes.includes(group.category)) {
        nextWarningTypes.push(group.category)
      }
      group.subTypes.forEach((sub) => {
        if (!nextSubTypes.includes(sub)) {
          nextSubTypes.push(sub)
        }
      })
    }

    onChange(nextWarningTypes, nextSubTypes)
  }

  // 切换单个子类型
  const handleToggleSubType = (group: WarningTypeGroup, subType: string) => {
    let nextSubTypes = selectedSubTypes.includes(subType)
      ? selectedSubTypes.filter((s) => s !== subType)
      : [...selectedSubTypes, subType]

    // 重新校准大类是否选中
    const checkedInGroup = group.subTypes.filter((s) => nextSubTypes.includes(s))
    let nextWarningTypes = [...selectedWarningTypes]

    if (checkedInGroup.length > 0) {
      if (!nextWarningTypes.includes(group.category)) {
        nextWarningTypes.push(group.category)
      }
    } else {
      nextWarningTypes = nextWarningTypes.filter((t) => t !== group.category)
    }

    onChange(nextWarningTypes, nextSubTypes)
  }

  // 一键清空
  const handleClearAll = () => {
    onChange([], [])
  }

  // 搜索过滤
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups
    const query = searchQuery.trim().toLowerCase()
    return groups
      .map((g) => {
        const categoryMatches = g.category.toLowerCase().includes(query)
        const matchedSubs = g.subTypes.filter(
          (sub) => sub.toLowerCase().includes(query) || categoryMatches
        )
        if (matchedSubs.length > 0) {
          return {
            category: g.category,
            subTypes: matchedSubs,
          }
        }
        return null
      })
      .filter((g): g is WarningTypeGroup => g !== null)
  }, [groups, searchQuery])

  // 回显标签生成
  const displayLabel = useMemo(() => {
    if (selectedSubTypes.length === 0 && selectedWarningTypes.length === 0) {
      return placeholder
    }

    // 检查是否恰好只选中了一个大类且该大类下全选
    if (selectedWarningTypes.length === 1) {
      const group = groups.find((g) => g.category === selectedWarningTypes[0])
      if (group && getCategoryCheckState(group) === "all") {
        return `${group.category} (全部)`
      }
    }

    // 若只选了一个具体子类型
    if (selectedSubTypes.length === 1) {
      return selectedSubTypes[0]
    }

    // 多个子类型
    return `已选 ${selectedSubTypes.length} 项`
  }, [selectedWarningTypes, selectedSubTypes, groups, placeholder])

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* 触发按钮 */}
      <button
        type="button"
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-colors",
          "hover:bg-muted/40 focus:outline-hidden focus:ring-1 focus:ring-ring",
          open && "border-primary ring-1 ring-ring"
        )}
        onClick={() => setOpen(!open)}
      >
        <span className="truncate text-foreground font-normal">
          {displayLabel}
        </span>
        <div className="flex items-center gap-1">
          {selectedSubTypes.length > 0 && (
            <span
              role="button"
              tabIndex={0}
              className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation()
                handleClearAll()
              }}
            >
              <XIcon className="size-3.5" />
            </span>
          )}
          <ChevronDownIcon className={cn("size-4 opacity-60 transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {/* 级联下拉面板 */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-[420px] rounded-lg border border-border bg-popover text-popover-foreground shadow-xl">
          {/* 顶部搜索框 */}
          <div className="border-b border-border p-2">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索预警大类或子类型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full rounded-md bg-muted/50 pl-8 pr-3 text-xs focus:outline-hidden focus:bg-background focus:ring-1 focus:ring-ring"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* 两栏级联内容区 */}
          <div className="flex h-[280px] divide-x divide-border">
            {/* 左栏：预警大类列表 */}
            <div className="w-[180px] overflow-y-auto p-1 space-y-0.5">
              <button
                type="button"
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition-colors",
                  selectedSubTypes.length === 0 && selectedWarningTypes.length === 0
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground"
                )}
                onClick={() => {
                  handleClearAll()
                }}
              >
                <span>全部类别</span>
                {selectedSubTypes.length === 0 && (
                  <CheckIcon className="size-3.5 text-primary" />
                )}
              </button>

              <div className="my-1 border-t border-border/50" />

              {filteredGroups.map((group) => {
                const state = getCategoryCheckState(group)
                const isActive = activeCategory === group.category

                return (
                  <div
                    key={group.category}
                    className={cn(
                      "group flex items-center justify-between rounded-md px-2 py-1.5 text-xs cursor-pointer transition-colors",
                      isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted/70 text-foreground"
                    )}
                    onMouseEnter={() => setActiveCategory(group.category)}
                    onClick={() => setActiveCategory(group.category)}
                  >
                    <label
                      className="flex items-center gap-1.5 cursor-pointer flex-1 mr-1 truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={cn(
                          "size-3.5 rounded border flex items-center justify-center transition-colors",
                          state === "all"
                            ? "bg-primary border-primary text-primary-foreground"
                            : state === "some"
                            ? "bg-primary/20 border-primary text-primary"
                            : "border-muted-foreground/40 bg-background"
                        )}
                        onClick={() => handleToggleCategory(group)}
                      >
                        {state === "all" && <CheckIcon className="size-2.5 stroke-[3]" />}
                        {state === "some" && <MinusIcon className="size-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{group.category}</span>
                    </label>

                    <ChevronRightIcon className={cn("size-3.5 opacity-40 shrink-0", isActive && "opacity-100 text-primary")} />
                  </div>
                )
              })}

              {filteredGroups.length === 0 && (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  无匹配大类
                </div>
              )}
            </div>

            {/* 右栏：当前大类下的子类型复选框 */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {currentGroup ? (
                <>
                  <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-border/40 px-1">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {currentGroup.category} 子项 ({currentGroup.subTypes.length})
                    </span>
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline"
                      onClick={() => handleToggleCategory(currentGroup)}
                    >
                      {getCategoryCheckState(currentGroup) === "all" ? "取消全选" : "本类全选"}
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    {currentGroup.subTypes.map((subType) => {
                      const checked = selectedSubTypes.includes(subType)
                      return (
                        <label
                          key={subType}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs cursor-pointer transition-colors",
                            checked ? "bg-primary/5 text-primary font-medium" : "hover:bg-muted text-foreground"
                          )}
                        >
                          <input
                            type="checkbox"
                            className="rounded border-input text-primary focus:ring-primary size-3.5"
                            checked={checked}
                            onChange={() => handleToggleSubType(currentGroup, subType)}
                          />
                          <span className="truncate">{subType}</span>
                        </label>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  请在左侧选择预警大类
                </div>
              )}
            </div>
          </div>

          {/* 底部操作与统计栏 */}
          <div className="flex items-center justify-between border-t border-border px-3 py-2 bg-muted/20">
            <span className="text-xs text-muted-foreground">
              已选 <strong className="text-foreground">{selectedSubTypes.length}</strong> 个子类型
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleClearAll}
              >
                清空
              </button>
              <button
                type="button"
                className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
                onClick={() => setOpen(false)}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
