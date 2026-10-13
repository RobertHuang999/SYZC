import { useMemo, useState, type MouseEvent } from "react"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { FormStoreroomOption } from "../mock/inbound-form.mock"

type StoreroomMultiSelectProps = {
  options: FormStoreroomOption[]
  selected: string[]
  onToggle: (id: string) => void
  disabled?: boolean
}

export function StoreroomMultiSelect({
  options,
  selected,
  onToggle,
  disabled,
}: StoreroomMultiSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedRooms = useMemo(
    () => options.filter((room) => selected.includes(room.id)),
    [options, selected]
  )

  const removeTag = (roomId: string, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    onToggle(roomId)
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
                <span className="truncate">{room.name}</span>
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
        {options.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">无数据</p>
        ) : (
          <ul className="max-h-56 overflow-y-auto">
            {options.map((room) => {
              const checked = selected.includes(room.id)
              return (
                <li key={room.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-muted/60",
                      checked && "bg-primary/5"
                    )}
                    onClick={() => onToggle(room.id)}
                  >
                    <CheckIcon
                      className={cn(
                        "size-4 shrink-0 text-primary",
                        checked ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">
                      {room.name}
                      {room.auditTag === "审核" ? (
                        <span className="text-muted-foreground">（审核）</span>
                      ) : null}
                    </span>
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
