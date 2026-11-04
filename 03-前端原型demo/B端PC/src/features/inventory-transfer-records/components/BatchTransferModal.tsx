import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Info } from "lucide-react"
import { warehouseZonesMock } from "../mock/transfer-form.mock"

interface Props {
  open: boolean
  warehouseId: string
  goodsName: string
  onClose: () => void
  onConfirm: (targetRoomZone: string, targetSpecificLocation: string) => void
}

export function BatchTransferModal({
  open,
  warehouseId,
  goodsName,
  onClose,
  onConfirm,
}: Props) {
  const [targetRoomZone, setTargetRoomZone] = useState("")
  const [specificLocation, setSpecificLocation] = useState("")

  const currentWarehouse = warehouseZonesMock.find((w) => w.id === warehouseId)

  // 展开所有可用的“库房-分区”
  const zoneOptions: { label: string; value: string }[] = []
  if (currentWarehouse) {
    for (const room of currentWarehouse.rooms) {
      for (const zone of room.zones) {
        const fullPath = `${currentWarehouse.name}-${room.name}-${zone.name}`
        zoneOptions.push({
          label: `${room.name} - ${zone.name}`,
          value: fullPath,
        })
      }
    }
  }

  const handleSubmit = () => {
    if (!targetRoomZone) {
      alert("请选择批量移入库房/分区")
      return
    }
    onConfirm(targetRoomZone, specificLocation.trim())
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            批量移库 - {goodsName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* 提示横幅 */}
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-3 rounded text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <Info className="size-4 shrink-0 mt-0.5" />
            <span>
              <strong>批量设置说明</strong>：批量移库将所选货物的全部明细行一次性统一覆盖移入相同位置，请核对目标库房分区承重与环境规格。
            </span>
          </div>

          {/* 目标库房/分区 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <span className="text-red-500">*</span> 批量移入库房/分区：
            </label>
            <Select value={targetRoomZone} onValueChange={setTargetRoomZone}>
              <SelectTrigger className="h-[36px] text-xs">
                <SelectValue placeholder="请选择目标库房与分区" />
              </SelectTrigger>
              <SelectContent>
                {zoneOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 目标具体位置 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-foreground">
                移入具体位置（架位/垛位）：
              </label>
              <span className="text-[11px] text-muted-foreground">
                {specificLocation.length}/140
              </span>
            </div>
            <Textarea
              value={specificLocation}
              onChange={(e) => setSpecificLocation(e.target.value.slice(0, 140))}
              placeholder="请输入具体货架、垛位或微观储位编号（选填）"
              className="text-xs h-20 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!targetRoomZone}
            className="bg-primary hover:bg-primary/90"
          >
            确定覆盖
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

