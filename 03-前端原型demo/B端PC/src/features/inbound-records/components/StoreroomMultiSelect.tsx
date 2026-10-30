import { useMemo, useState, type MouseEvent } from "react"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  canToggleStoreroomSelection,
  resolveStoreroomAuditLock,
} from "../lib/inbound-form-utils"
import type { FormStoreroomOption } from "../mock/inbound-form.mock"

type StoreroomMultiSelectProps = {
  options: FormStoreroomOption[]
  selected: string[]
  onToggle: (id: string) => void
  disabled?: boolean
  /** 暂存登记等弱规则场景：允许需审核与免审库房混选（R06 推迟至转正） */
  allowMixedAuditTags?: boolean
  onAuditConflict?: () => void
}

function auditTagLabel(tag: FormStoreroomOption["auditTag"]) {
  return tag === "审核" ? "需审核" : "免审"
}

export function StoreroomMultiSelect({
  options,
  selected,
  onToggle,
  disabled,
  allowMixedAuditTags = false,
  onAuditConflict,
}: StoreroomMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedRooms = useMemo(
    () => options.filter((room) => selected.includes(room.id)),
    [options, selected]
  )

  const auditLock = useMemo(
    () => (allowMixedAuditTags ? null : resolveStoreroomAuditLock(selected, options)),
    [allowMixedAuditTags, selected, options]
  )

  const removeTag = (roomId: string, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    onToggle(roomId)
  }

  const handleRowClick = (room: FormStoreroomOption) => {
    if (!allowMixedAuditTags) {
      const allowed = canToggleStoreroomSelection(selected, room.id, options)
      if (!allowed) {
        onAuditConflict?.()
        return
      }
    }
    onToggle(room.id)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        disabled={disabled}
        className={cn(
          "flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-background px-2 py-1 text-sm",
          "ring-offset-background hover:border-accent-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {selectedRooms.length === 0 ? (
            <span className="px-1 text-muted-foreground">请选择入库库房</span>
          ) : (
            selectedRooms.map((room) => (
              <Badge
                key={room.id}
                variant="secondary"
                className="h-6 max-w-full gap-0.5 rounded-sm px-1.5 font-normal"
              >
                <span className="truncate">
                  {room.name}
                  <span className="text-muted-foreground">
                    （{auditTagLabel(room.auditTag)}）
                  </span>
                </span>
                <button
                  type="button"
                  className="rounded-sm p-0.5 hover:bg-muted"
                  aria-label={`移除${room.name}`}
                  onClick={(event) => removeTag(room.id, event)}
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-1"
      >
        {auditLock ? (
          <p className="border-b px-2 py-1.5 text-[11px] text-muted-foreground">
            已锁定为「{auditTagLabel(auditLock)}」库房，只能再选审核属性相同的库房
          </p>
        ) : null}
        {options.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">无数据</p>
        ) : (
          <ul className="max-h-56 overflow-y-auto">
            {options.map((room) => {
              const checked = selected.includes(room.id)
              const blocked =
                !allowMixedAuditTags &&
                !checked &&
                !canToggleStoreroomSelection(selected, room.id, options)
              return (
                <li key={room.id}>
                  <button
                    type="button"
                    disabled={blocked}
                    title={
                      blocked
                        ? `与已选「${auditTagLabel(auditLock!)}」库房属性冲突，不可混选`
                        : undefined
                    }
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm",
                      blocked
                        ? "cursor-not-allowed opacity-45"
                        : "hover:bg-muted/60",
                      checked && !blocked && "bg-primary/5"
                    )}
                    onClick={() => handleRowClick(room)}
                  >
                    <CheckIcon
                      className={cn(
                        "size-4 shrink-0 text-primary",
                        checked ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {room.name}
                      <span
                        className={cn(
                          "ml-1",
                          room.auditTag === "审核"
                            ? "text-amber-700/90"
                            : "text-emerald-700/90"
                        )}
                      >
                        （{auditTagLabel(room.auditTag)}）
                      </span>
                    </span>
                    {blocked ? (
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        不可选
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}
