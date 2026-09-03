import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { ApprovalCenterCard, ApprovalCenterCardGroup } from "../mock/approval-center-hub.mock"

type ApprovalCenterNavStripProps = {
  groups: ApprovalCenterCardGroup[]
  selectedCardId: string
  onSelectCard: (cardId: string) => void
}

const LABEL_CHARS_PER_LINE = 4

function splitLabelLines(label: string, charsPerLine = LABEL_CHARS_PER_LINE) {
  const lines: string[] = []
  for (let index = 0; index < label.length; index += charsPerLine) {
    lines.push(label.slice(index, index + charsPerLine))
  }
  return lines
}

function NavChip({
  card,
  selected,
  onSelect,
}: {
  card: ApprovalCenterCard
  selected: boolean
  onSelect: (cardId: string) => void
}) {
  const Icon = card.icon
  const labelLines = splitLabelLines(card.label)

  return (
    <button
      type="button"
      onClick={() => onSelect(card.id)}
      title={card.label}
      className={cn(
        "relative mx-auto flex w-full max-w-[56px] flex-col items-center gap-0.5 rounded px-1 py-1.5 text-center transition-colors",
        "hover:bg-muted/60",
        selected
          ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/30"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-3 shrink-0" strokeWidth={1.6} />
      <span className="flex flex-col items-center text-[10px] leading-[14px]">
        {labelLines.map((line, index) => (
          <span key={`${card.id}-${index}`} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </span>
      {card.badge != null && card.badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 min-w-[13px] rounded-full bg-red-500 px-0.5 text-[8px] font-medium leading-[13px] text-white">
          {card.badge}
        </span>
      )}
    </button>
  )
}

function ApprovalCenterGroupColumn({
  group,
  selectedCardId,
  onSelectCard,
}: {
  group: ApprovalCenterCardGroup
  selectedCardId: string
  onSelectCard: (cardId: string) => void
}) {
  return (
    <section
      className="flex min-w-0 flex-col px-3 py-2 last:border-r-0"
      style={{ flex: group.cards.length }}
    >
      <h3 className="mb-1.5 shrink-0 text-[11px] font-semibold text-foreground/85">{group.label}</h3>
      <div
        className="grid w-full gap-x-2 gap-y-1"
        style={{ gridTemplateColumns: `repeat(${group.cards.length}, minmax(0, 1fr))` }}
      >
        {group.cards.map((card) => (
          <NavChip
            key={card.id}
            card={card}
            selected={selectedCardId === card.id}
            onSelect={onSelectCard}
          />
        ))}
      </div>
    </section>
  )
}

export function ApprovalCenterNavStrip({
  groups,
  selectedCardId,
  onSelectCard,
}: ApprovalCenterNavStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const node = scrollRef.current
    if (!node) return

    const { scrollLeft, scrollWidth, clientWidth } = node
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
  }, [])

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return

    updateScrollState()
    node.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)

    return () => {
      node.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [updateScrollState, groups])

  const scrollBy = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="向左滚动"
          onClick={() => scrollBy("left")}
          className="absolute left-1 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border bg-background/95 text-muted-foreground shadow-sm hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          aria-label="向右滚动"
          onClick={() => scrollBy("right")}
          className="absolute right-1 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border bg-background/95 text-muted-foreground shadow-sm hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        className={cn(
          "approval-center-nav-scroll overflow-x-auto",
          canScrollLeft && "pl-8",
          canScrollRight && "pr-8",
        )}
      >
        <div className="flex w-full divide-x divide-border/50">
          {groups.map((group) => (
            <ApprovalCenterGroupColumn
              key={group.id}
              group={group}
              selectedCardId={selectedCardId}
              onSelectCard={onSelectCard}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
