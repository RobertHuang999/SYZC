import { useState, useMemo } from "react"
import { SearchIcon, CheckSquareIcon, SquareIcon } from "lucide-react"
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

import { MOCK_DEVICE_POOL } from "../mock/devices.mock"

type DeviceSelectDialogProps = {
  open: boolean
  warehouseFilter?: string
  currentSelected?: string
  onOpenChange: (open: boolean) => void
  onConfirm: (selectedSummary: string, selectedCodes: string[]) => void
}

export function DeviceSelectDialog({
  open,
  warehouseFilter = "",
  currentSelected = "",
  onOpenChange,
  onConfirm,
}: DeviceSelectDialogProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(warehouseFilter || "all")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [selectedCodes, setSelectedCodes] = useState<string[]>(() => {
    // extract initial codes from currentSelected
    const matches = currentSelected.match(/DEV-[A-Z0-9-]+/g)
    return matches ?? []
  })

  const filteredDevices = useMemo(() => {
    return MOCK_DEVICE_POOL.filter((device) => {
      if (selectedWarehouse && selectedWarehouse !== "all" && device.warehouseName !== selectedWarehouse) {
        return false
      }
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase()
        return (
          device.deviceName.toLowerCase().includes(kw) ||
          device.deviceCode.toLowerCase().includes(kw) ||
          device.location.toLowerCase().includes(kw)
        )
      }
      return true
    })
  }, [selectedWarehouse, searchKeyword])

  const toggleSelect = (code: string) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  const handleSelectAll = () => {
    const allFilteredCodes = filteredDevices.map((d) => d.deviceCode)
    const isAllSelected = allFilteredCodes.every((code) => selectedCodes.includes(code))
    if (isAllSelected) {
      setSelectedCodes((prev) => prev.filter((c) => !allFilteredCodes.includes(c)))
    } else {
      setSelectedCodes((prev) => Array.from(new Set([...prev, ...allFilteredCodes])))
    }
  }

  const handleConfirm = () => {
    if (selectedCodes.length === 0) {
      onConfirm("", [])
    } else {
      const warehousePrefix = selectedWarehouse !== "all" ? `${selectedWarehouse} · ` : ""
      const summary = `${warehousePrefix}${selectedCodes.slice(0, 3).join(", ")}${
        selectedCodes.length > 3 ? ` 等共 ${selectedCodes.length} 台设备` : ` (${selectedCodes.length}台)`
      }`
      onConfirm(summary, selectedCodes)
    }
    onOpenChange(false)
  }

  const allFilteredSelected =
    filteredDevices.length > 0 &&
    filteredDevices.every((d) => selectedCodes.includes(d.deviceCode))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>选择关联设备</DialogTitle>
          <DialogDescription>
            支持按所属仓库与设备关键字筛选，勾选需要纳入此规则监控范围的硬件设备。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="w-full sm:w-48">
              <Select
                value={selectedWarehouse}
                onValueChange={(val) => setSelectedWarehouse(val ?? "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="所属仓库" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部仓库</SelectItem>
                  <SelectItem value="一号大宗钢材仓">一号大宗钢材仓</SelectItem>
                  <SelectItem value="二号冷链仓">二号冷链仓</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1">
              <SearchIcon className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="搜索设备名称、编号或安装位置..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-b pb-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleSelectAll}
              >
                {allFilteredSelected ? (
                  <CheckSquareIcon className="mr-1 size-3.5 text-primary" />
                ) : (
                  <SquareIcon className="mr-1 size-3.5" />
                )}
                {allFilteredSelected ? "取消全选" : "全选当前"}
              </Button>
              <span>共找到 {filteredDevices.length} 台设备</span>
            </div>
            <span>已选 {selectedCodes.length} 台设备</span>
          </div>

          <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
            {filteredDevices.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                未找到匹配的设备
              </div>
            ) : (
              filteredDevices.map((device) => {
                const isChecked = selectedCodes.includes(device.deviceCode)
                return (
                  <div
                    key={device.deviceCode}
                    onClick={() => toggleSelect(device.deviceCode)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                      isChecked
                        ? "border-primary/50 bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(device.deviceCode)}
                        className="size-4 rounded border-gray-300 text-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <span>{device.deviceName}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {device.deviceCode}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {device.warehouseName} · {device.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {device.deviceType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          device.status === "在线"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 text-xs"
                            : "border-slate-200 bg-slate-50 text-slate-600 text-xs"
                        }
                      >
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确认已选 ({selectedCodes.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
