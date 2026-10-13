import { Building2Icon, Trash2Icon, WarehouseIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { WarehouseRoomNode } from "../domain/types"

type AuditedWarehouseListProps = {
  rooms: WarehouseRoomNode[]
  onRemove: (roomId: string) => void
  variant?: "default" | "compact"
}

export function AuditedWarehouseList({
  rooms,
  onRemove,
  variant = "default",
}: AuditedWarehouseListProps) {
  if (rooms.length === 0) {
    return (
      <div
        className={cn(
          "rounded-md border border-dashed text-muted-foreground",
          variant === "compact"
            ? "bg-background/60 px-3 py-4 text-center text-xs"
            : "bg-muted/20 px-4 py-8 text-center text-sm"
        )}
      >
        暂未选择库房，请点击「选择库房」添加
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <ul className="max-h-36 space-y-1 overflow-y-auto rounded-md border bg-background/80 p-1.5">
        {rooms.map((room) => (
          <li
            key={room.id}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-muted/50"
          >
            <span className="min-w-0 flex-1 truncate">
              <span className="text-muted-foreground">{room.warehouseName}</span>
              <span className="text-muted-foreground/70"> / </span>
              <span className="text-foreground">{room.roomName}</span>
            </span>
            <button
              type="button"
              className="shrink-0 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-destructive"
              onClick={() => onRemove(room.id)}
              aria-label={`移除 ${room.warehouseName} ${room.roomName}`}
            >
              <XIcon className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="grid grid-cols-[1fr_auto] gap-2 border-b bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
        <span>仓库 / 库房</span>
        <span className="w-16 text-center">操作</span>
      </div>
      <ul className="divide-y">
        {rooms.map((room) => (
          <li
            key={room.id}
            className="grid grid-cols-[1fr_auto] items-center gap-2 px-3 py-2.5 text-sm"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <WarehouseIcon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Building2Icon className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{room.warehouseName}</span>
                </div>
                <p className="truncate text-muted-foreground">{room.roomName}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(room.id)}
              aria-label={`移除 ${room.warehouseName} ${room.roomName}`}
            >
              <Trash2Icon className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
