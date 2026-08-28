import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_DEVICES, WAREHOUSE_OPTIONS } from "../mock/reference-data.mock"

type UnlockDeviceSelectDialogProps = {
  open: boolean
  warehouseContext?: string
  selectedIds: string[]
  onOpenChange: (open: boolean) => void
  onConfirm: (selectedIds: string[]) => void
}

export function UnlockDeviceSelectDialog({
  open,
  warehouseContext = "",
  selectedIds,
  onOpenChange,
  onConfirm,
}: UnlockDeviceSelectDialogProps) {
  const [warehouseFilter, setWarehouseFilter] = useState(warehouseContext || "all")
  const [keyword, setKeyword] = useState("")
  const [draftSelected, setDraftSelected] = useState<string[]>(selectedIds)

  const filteredDevices = useMemo(() => {
    return MOCK_DEVICES.filter((device) => {
      if (warehouseFilter !== "all" && device.warehouse !== warehouseFilter) {
        return false
      }
      if (!keyword.trim()) return true
      const kw = keyword.trim().toLowerCase()
      return (
        device.name.toLowerCase().includes(kw) ||
        device.code.toLowerCase().includes(kw) ||
        device.location.toLowerCase().includes(kw)
      )
    })
  }, [warehouseFilter, keyword])

  const toggleDevice = (id: string) => {
    setDraftSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const toggleAllFiltered = () => {
    const ids: string[] = filteredDevices.map((device) => device.id)
    const allSelected = ids.length > 0 && ids.every((id) => draftSelected.includes(id))
    if (allSelected) {
      setDraftSelected((current) => current.filter((id) => !ids.includes(id)))
    } else {
      setDraftSelected((current) => Array.from(new Set([...current, ...ids])))
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftSelected(selectedIds)
      setWarehouseFilter(warehouseContext || "all")
      setKeyword("")
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>选择适用设备</DialogTitle>
          <DialogDescription>
            仅展示挂锁门禁、人脸门禁。可按仓库快速筛选，或输入设备名称/编码/位置关键字定位。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              value={warehouseFilter}
              onValueChange={(value) => setWarehouseFilter(value ?? "all")}
            >
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder="所属仓库" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部仓库</SelectItem>
                {WAREHOUSE_OPTIONS.map((warehouse) => (
                  <SelectItem key={warehouse} value={warehouse}>
                    {warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="搜索设备名称、编码或绑定位置"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              已选 <span className="font-medium text-foreground">{draftSelected.length}</span> 台
            </span>
            <Button type="button" variant="ghost" size="sm" onClick={toggleAllFiltered}>
              {filteredDevices.length > 0 &&
              filteredDevices.every((device) => draftSelected.includes(device.id))
                ? "取消全选当前结果"
                : "全选当前结果"}
            </Button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-2">
            {filteredDevices.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                未找到匹配设备，请调整仓库或搜索关键字
              </p>
            ) : (
              filteredDevices.map((device) => {
                const checked = draftSelected.includes(device.id)
                return (
                  <label
                    key={device.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={checked}
                      onChange={() => toggleDevice(device.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{device.name}</span>
                        <Badge variant="outline">{device.code}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {device.warehouse} · {device.location}
                      </p>
                    </div>
                  </label>
                )
              })
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={() => {
              onConfirm(draftSelected)
              handleOpenChange(false)
            }}
          >
            确认选择（{draftSelected.length} 台）
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
