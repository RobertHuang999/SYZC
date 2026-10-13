import { useMemo, useState } from "react"
import { ChevronDownIcon, ChevronRightIcon, SearchIcon, Trash2Icon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  WAREHOUSE_TREE_MOCK,
  formatRoomLabel,
  resolveWarehouseRooms,
} from "../mock/warehouse-tree.mock"

type WarehouseAuditPickerDialogProps = {
  open: boolean
  selectedIds: string[]
  onOpenChange: (open: boolean) => void
  onConfirm: (ids: string[]) => void
}

export function WarehouseAuditPickerDialog({
  open,
  selectedIds,
  onOpenChange,
  onConfirm,
}: WarehouseAuditPickerDialogProps) {
  const [draftIds, setDraftIds] = useState<string[]>(selectedIds)
  const [keyword, setKeyword] = useState("")
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(WAREHOUSE_TREE_MOCK.map((g) => [g.warehouseId, true]))
  )

  const normalizedKeyword = keyword.trim().toLowerCase()

  const filteredTree = useMemo(() => {
    if (!normalizedKeyword) return WAREHOUSE_TREE_MOCK
    return WAREHOUSE_TREE_MOCK.map((group) => {
      const warehouseHit = group.warehouseName.toLowerCase().includes(normalizedKeyword)
      const rooms = group.rooms.filter(
        (room) =>
          warehouseHit || room.name.toLowerCase().includes(normalizedKeyword)
      )
      if (rooms.length === 0) return null
      return { ...group, rooms }
    }).filter(Boolean) as typeof WAREHOUSE_TREE_MOCK
  }, [normalizedKeyword])

  const selectedNodes = resolveWarehouseRooms(draftIds)

  const toggleRoom = (roomId: string) => {
    setDraftIds((current) =>
      current.includes(roomId)
        ? current.filter((id) => id !== roomId)
        : [...current, roomId]
    )
  }

  const toggleWarehouseAll = (roomIds: string[]) => {
    const allSelected = roomIds.every((id) => draftIds.includes(id))
    setDraftIds((current) => {
      if (allSelected) {
        return current.filter((id) => !roomIds.includes(id))
      }
      const merged = new Set([...current, ...roomIds])
      return [...merged]
    })
  }

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraftIds(selectedIds)
      setKeyword("")
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[min(640px,90vh)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>选择需要审核出入库的库房</DialogTitle>
          <DialogDescription>
            支持按仓库折叠/展开，勾选仓库名称可快速全选其下属所有库房。
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden px-6 py-4 lg:grid-cols-2">
          <div className="flex min-h-0 flex-col gap-2">
            <p className="shrink-0 text-xs font-medium text-muted-foreground">
              可选仓库与库房
            </p>
            <div className="relative shrink-0">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索仓库或库房名称"
                className="pl-9"
              />
            </div>
            <div className="min-h-[220px] flex-1 overflow-y-auto rounded-lg border bg-card p-3 text-sm lg:min-h-0">
              {filteredTree.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">无匹配的仓库或库房</p>
              ) : (
                filteredTree.map((group) => {
                  const roomIds = group.rooms.map((r) => r.id)
                  const selectedCount = roomIds.filter((id) => draftIds.includes(id)).length
                  const isExpanded = expanded[group.warehouseId] ?? true
                  const allChecked =
                    roomIds.length > 0 && selectedCount === roomIds.length
                  const partial = selectedCount > 0 && !allChecked

                  return (
                    <div key={group.warehouseId} className="mb-2 last:mb-0">
                      <div className="flex items-center gap-2 py-1">
                        <button
                          type="button"
                          className="text-muted-foreground"
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpanded((c) => ({
                              ...c,
                              [group.warehouseId]: !isExpanded,
                            }))
                          }
                        >
                          {isExpanded ? (
                            <ChevronDownIcon className="size-4" />
                          ) : (
                            <ChevronRightIcon className="size-4" />
                          )}
                        </button>
                        <label className="flex flex-1 cursor-pointer items-center gap-2 font-medium">
                          <input
                            type="checkbox"
                            checked={allChecked}
                            ref={(el) => {
                              if (el) el.indeterminate = partial
                            }}
                            onChange={() => toggleWarehouseAll(roomIds)}
                          />
                          {group.warehouseName}
                          <span className="text-xs font-normal text-muted-foreground">
                            ({selectedCount}/{roomIds.length})
                          </span>
                        </label>
                      </div>
                      {isExpanded && (
                        <div className="ml-8 space-y-1 border-l pl-3">
                          {group.rooms.map((room) => (
                            <label
                              key={room.id}
                              className="flex cursor-pointer items-center gap-2 py-0.5 text-muted-foreground hover:text-foreground"
                            >
                              <input
                                type="checkbox"
                                checked={draftIds.includes(room.id)}
                                onChange={() => toggleRoom(room.id)}
                              />
                              {room.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border bg-muted/20 lg:min-h-[280px]">
            <div className="shrink-0 border-b px-4 py-2 text-sm font-medium">
              已选需要审核的库房（共 {selectedNodes.length} 个）
            </div>
            <div className="min-h-[160px] flex-1 space-y-2 overflow-y-auto p-3 lg:min-h-0">
              {selectedNodes.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  请从左侧勾选库房
                </p>
              ) : (
                selectedNodes.map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2 text-sm"
                  >
                    <span className="min-w-0 truncate">{formatRoomLabel(node)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => toggleRoom(node.id)}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t bg-background px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            type="button"
            disabled={draftIds.length === 0}
            onClick={() => {
              onConfirm(draftIds)
              onOpenChange(false)
            }}
          >
            确认选择
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
