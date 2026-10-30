import { useEffect, useMemo, useState } from "react"
import { ChevronRightIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { MajorCategory, Subcategory } from "../domain/types"

type GoodsTreeSidebarProps = {
  categories: MajorCategory[]
  subcategories: Subcategory[]
  selectedSubcategoryId: string
  keyword: string
  showDisabled: boolean
  onKeywordChange: (value: string) => void
  onSelectSubcategory: (id: string) => void
  onShowDisabledChange: (value: boolean) => void
}

export function GoodsTreeSidebar({
  categories,
  subcategories,
  selectedSubcategoryId,
  keyword,
  showDisabled,
  onKeywordChange,
  onSelectSubcategory,
  onShowDisabledChange,
}: GoodsTreeSidebarProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(categories.slice(0, 1).map((category) => category.id))
  )

  const normalizedKeyword = keyword.trim().toLocaleLowerCase()

  const visibleCategories = useMemo(() => {
    return categories
      .map((category) => {
        const children = subcategories.filter(
          (subcategory) => subcategory.categoryId === category.id
        )
        const categoryMatches =
          !normalizedKeyword ||
          category.name.toLocaleLowerCase().includes(normalizedKeyword)
        const matchedChildren = normalizedKeyword
          ? children.filter((subcategory) =>
              subcategory.name.toLocaleLowerCase().includes(normalizedKeyword)
            )
          : children

        if (normalizedKeyword && !categoryMatches && matchedChildren.length === 0) {
          return null
        }

        return {
          category,
          children: categoryMatches && normalizedKeyword ? children : matchedChildren,
        }
      })
      .filter(
        (
          item
        ): item is {
          category: MajorCategory
          children: Subcategory[]
        } => item !== null
      )
  }, [categories, subcategories, normalizedKeyword])

  useEffect(() => {
    setExpandedIds((current) => {
      if (normalizedKeyword) {
        return new Set(visibleCategories.map((item) => item.category.id))
      }
      const stillExists = [...current].some((id) =>
        categories.some((category) => category.id === id)
      )
      if (stillExists) return current
      const firstCategory = categories[0]
      return new Set(firstCategory ? [firstCategory.id] : [])
    })
  }, [categories, normalizedKeyword, visibleCategories])

  const toggleCategory = (categoryId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }


  return (
    <aside className="flex h-full min-h-[calc(100vh-12rem)] w-[220px] shrink-0 flex-col rounded-xl border bg-card">
      <div className="border-b p-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="请输入查询的名称"
            className="pl-8"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {visibleCategories.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            没有匹配的大类或品类
          </div>
        ) : (
          <div className="space-y-1">
            {visibleCategories.map(({ category, children }) => {
              const expanded = expandedIds.has(category.id) || Boolean(normalizedKeyword)
              return (
                <div key={category.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-1.5 rounded-md px-2 py-2 text-left hover:bg-muted/60"
                    aria-expanded={expanded}
                    onClick={() => toggleCategory(category.id)}
                  >
                    <ChevronRightIcon
                      className={cn(
                        "size-3.5 shrink-0 text-muted-foreground transition-transform",
                        expanded && "rotate-90"
                      )}
                    />
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-sm font-medium",
                        category.status === "DISABLED" && "text-muted-foreground"
                      )}
                    >
                      {category.name}
                    </span>
                    {category.status === "DISABLED" ? (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                        停
                      </span>
                    ) : null}
                  </button>

                  {expanded ? (
                    <div className="mt-0.5 space-y-0.5">
                      {children.length === 0 ? (
                        <div className="px-8 py-1.5 text-xs text-muted-foreground">
                          暂无品类
                        </div>
                      ) : (
                        children.map((subcategory) => {
                          const active = subcategory.id === selectedSubcategoryId
                          return (
                            <button
                              key={subcategory.id}
                              type="button"
                              onClick={() => onSelectSubcategory(subcategory.id)}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md border-l-2 py-2 pr-2 pl-7 text-left transition-colors",
                                active
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-transparent hover:bg-muted/60"
                              )}
                            >
                              <span
                                className={cn(
                                  "min-w-0 flex-1 truncate text-sm",
                                  active && "font-medium",
                                  subcategory.status === "DISABLED" &&
                                    !active &&
                                    "text-muted-foreground"
                                )}
                              >
                                {subcategory.name}
                              </span>
                              {subcategory.status === "DISABLED" ? (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                                  停
                                </span>
                              ) : null}
                            </button>
                          )
                        })
                      )}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-t bg-muted/20 p-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={showDisabled}
            onChange={(event) => onShowDisabledChange(event.target.checked)}
          />
          显示已停用货品信息
        </label>
      </div>
    </aside>
  )
}
