import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FacilityRow } from "../domain/types"

type FacilityFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  initial?: FacilityRow
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: {
    name: string
    quantity: number
    unit: string
    validUntil: string
  }) => void
}

export function FacilityFormDialog({
  open,
  mode,
  initial,
  onOpenChange,
  onSubmit,
}: FacilityFormDialogProps) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("台")
  const [validUntil, setValidUntil] = useState("2027-06-24")

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? "")
    setQuantity(initial?.quantity != null ? String(initial.quantity) : "1")
    setUnit(initial?.unit ?? "台")
    setValidUntil(initial?.validUntil ?? "2027-06-24")
  }, [open, initial])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      quantity: Number(quantity) || 1,
      unit: unit.trim() || "台",
      validUntil: validUntil.trim() || "2027-06-24",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "添加设备设施" : "编辑设备设施"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>
              设备设施名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入设备设施名称，如：二号探、消防喷淋"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                数量 <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>单位</Label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="台 / 套 / 个"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>有效期</Label>
            <Input
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit">
              确定
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
