import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"
import { Building2, CheckIcon, ChevronsUpDownIcon, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type SearchableNameSelectKind = "enterprise" | "personal"

export type SearchableNameSelectItem = {
  id: string
  name: string
  kind?: SearchableNameSelectKind
  description?: string
  extraBadges?: Array<{ label: string; className: string }>
}

type SearchableNameSelectProps = {
  valueId?: string
  valueName: string
  placeholder: string
  catalogTitle: string
  items: SearchableNameSelectItem[]
  disabled?: boolean
  /** 允许手输未建档名称（入库货主 / 转让接收方） */
  allowFreeText?: boolean
  emptyHint?: string
  onPick: (item: SearchableNameSelectItem) => void
  onFreeText?: (name: string) => void
}

export function SearchableNameSelect({
  valueId,
  valueName,
  placeholder,
  catalogTitle,
  items,
  disabled,
  allowFreeText = false,
  emptyHint = "未找到匹配档案",
  onPick,
  onFreeText,
}: SearchableNameSelectProps) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState(valueName)
  const containerRef = useRef<HTMLDivElement>(null)
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({})
  const panelId = useId()

  useEffect(() => {
    setKeyword(valueName)
  }, [valueName])

  useLayoutEffect(() => {
    if (!open || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPanelStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: Math.max(rect.width, 280),
      zIndex: 80,
    })
  }, [open, keyword])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (containerRef.current?.contains(target)) return
      const panel = document.getElementById(panelId)
      if (panel?.contains(target)) return
      setOpen(false)
      if (!allowFreeText) {
        setKeyword(valueName)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [allowFreeText, panelId, valueName])

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw || kw === valueName.trim().toLowerCase()) return items
    return items.filter((item) => {
      const hay = `${item.name} ${item.description ?? ""}`.toLowerCase()
      return hay.includes(kw)
    })
  }, [items, keyword, valueName])

  const handleInputChange = (val: string) => {
    setKeyword(val)
    setOpen(true)
    if (allowFreeText) {
      const exact = items.find((item) => item.name.trim().toLowerCase() === val.trim().toLowerCase())
      if (exact) {
        onPick(exact)
        return
      }
      onFreeText?.(val)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative w-full">
        <Input
          value={keyword}
          disabled={disabled}
          placeholder={placeholder}
          className="pr-8 text-xs font-medium"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (!disabled) setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filtered.length > 0) {
              e.preventDefault()
              onPick(filtered[0])
              setKeyword(filtered[0].name)
              setOpen(false)
            }
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground opacity-60 hover:text-foreground hover:opacity-100"
          onClick={() => {
            if (!disabled) setOpen((prev) => !prev)
          }}
        >
          <ChevronsUpDownIcon className="size-3.5" />
        </button>
      </div>

      {open && !disabled
        ? createPortal(
        <div
          id={panelId}
          style={panelStyle}
          className="max-h-64 min-w-[280px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-2 text-[11px] font-medium text-muted-foreground">
            <span>{catalogTitle}</span>
            <span className="text-[10px] text-muted-foreground/80">{filtered.length} 个匹配</span>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1 text-xs">
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-center text-muted-foreground">
                <p className="text-xs">{emptyHint}</p>
              </li>
            ) : (
              filtered.map((item) => {
                const selected = valueId ? valueId === item.id : valueName === item.name
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-muted/70",
                        selected && "bg-primary/10 font-medium text-primary",
                      )}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        onPick(item)
                        setKeyword(item.name)
                        setOpen(false)
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {item.kind === "personal" ? (
                          <User className="size-3.5 shrink-0 text-amber-600" />
                        ) : (
                          <Building2 className="size-3.5 shrink-0 text-blue-600" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-medium text-foreground">{item.name}</span>
                            {item.kind ? (
                              <span
                                className={cn(
                                  "shrink-0 rounded px-1 py-0.5 text-[10px] font-normal",
                                  item.kind === "enterprise"
                                    ? "border border-blue-200 bg-blue-50 text-blue-700"
                                    : "border border-amber-200 bg-amber-50 text-amber-700",
                                )}
                              >
                                {item.kind === "enterprise" ? "企业" : "个人"}
                              </span>
                            ) : null}
                            {item.extraBadges?.map((badge) => (
                              <span
                                key={badge.label}
                                className={cn(
                                  "shrink-0 rounded border px-1 py-0.5 text-[10px] font-normal",
                                  badge.className,
                                )}
                              >
                                {badge.label}
                              </span>
                            ))}
                          </div>
                          {item.description ? (
                            <p className="truncate text-[11px] text-muted-foreground">{item.description}</p>
                          ) : null}
                        </div>
                      </div>
                      {selected ? <CheckIcon className="size-4 shrink-0 text-primary" /> : null}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
          {allowFreeText &&
          keyword.trim().length > 0 &&
          !filtered.some((item) => item.name === keyword.trim()) ? (
            <div className="border-t bg-muted/10 p-2">
              <button
                type="button"
                className="w-full rounded px-2 py-1.5 text-left text-xs text-primary hover:underline"
                onClick={() => {
                  onFreeText?.(keyword.trim())
                  setOpen(false)
                }}
              >
                ➕ 使用「<span className="font-semibold">{keyword.trim()}</span>」作为新增
              </button>
            </div>
          ) : null}
        </div>,
        document.body,
      )
        : null}
    </div>
  )
}
