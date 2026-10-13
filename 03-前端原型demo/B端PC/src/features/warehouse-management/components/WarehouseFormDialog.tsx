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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { ManagerType, WarehouseRecord } from "../domain/types"

type WarehouseFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  initial?: WarehouseRecord
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: Partial<WarehouseRecord>) => void
}

export function WarehouseFormDialog({
  open,
  mode,
  initial,
  onOpenChange,
  onSubmit,
}: WarehouseFormDialogProps) {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [area, setArea] = useState("")
  const [managerType, setManagerType] = useState<ManagerType>("ENTERPRISE")
  const [managerName, setManagerName] = useState("")
  const [managerId, setManagerId] = useState("")
  const [managerPhone, setManagerPhone] = useState("")

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? "")
    setAddress(initial?.address ?? "")
    setArea(initial?.area != null ? String(initial.area) : "")
    setManagerType(initial?.managerType ?? "ENTERPRISE")
    setManagerName(initial?.managerName ?? "")
    setManagerId(initial?.managerIdNumber ?? "")
    setManagerPhone(initial?.managerPhone ?? "")
  }, [open, initial])

  const handleSave = () => {
    if (!name.trim()) return
    const parsedArea = Number(area)
    onSubmit({
      name: name.trim(),
      address: address.trim(),
      area: Number.isFinite(parsedArea) && parsedArea > 0 ? parsedArea : 1,
      managerType,
      managerName: managerName.trim(),
      managerIdNumber: managerId.trim(),
      managerPhone: managerPhone.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "添加仓库" : "编辑仓库"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>
              仓库名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="请输入仓库名称"
            />
          </div>
          <div className="space-y-2">
            <Label>
              仓库地址 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="省市区 + 详细地址"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>
              仓库面积（㎡） <span className="text-destructive">*</span>
            </Label>
            <Input
              value={area}
              onChange={(event) => setArea(event.target.value)}
              placeholder="大于 0，保留 2 位小数"
            />
          </div>
          <div className="space-y-2">
            <Label>管理方类型</Label>
            <Select
              value={managerType}
              onValueChange={(value) => {
                if (value === "ENTERPRISE" || value === "INDIVIDUAL") {
                  setManagerType(value)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENTERPRISE">企业</SelectItem>
                <SelectItem value="INDIVIDUAL">个人</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>管理方名称</Label>
            <Input
              value={managerName}
              onChange={(event) => setManagerName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>证件号</Label>
            <Input
              value={managerId}
              onChange={(event) => setManagerId(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>联系电话</Label>
            <Input
              value={managerPhone}
              onChange={(event) => setManagerPhone(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
