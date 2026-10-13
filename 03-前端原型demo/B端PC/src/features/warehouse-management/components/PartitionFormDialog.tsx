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
import type { StoreroomNode } from "../domain/types"

type PartitionFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  storerooms: StoreroomNode[]
  initialStoreroomId?: string
  initialName?: string
  initialRemark?: string
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: {
    storeroomId: string
    name: string
    remark: string
  }) => void
}

export function PartitionFormDialog({
  open,
  mode,
  storerooms,
  initialStoreroomId,
  initialName,
  initialRemark,
  onOpenChange,
  onSubmit,
}: PartitionFormDialogProps) {
  const [storeroomId, setStoreroomId] = useState("")
  const [name, setName] = useState("")
  const [remark, setRemark] = useState("")

  useEffect(() => {
    if (!open) return
    setStoreroomId(
      initialStoreroomId ?? storerooms.find((s) => s.status === "ENABLED")?.id ?? ""
    )
    setName(initialName ?? "")
    setRemark(initialRemark ?? "")
  }, [open, initialStoreroomId, initialName, initialRemark, storerooms])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "添加分区" : "编辑分区"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>
              所属库房 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={storeroomId}
              onValueChange={(value) => value && setStoreroomId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择库房" />
              </SelectTrigger>
              <SelectContent>
                {storerooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>
              分区名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>备注</Label>
            <Textarea
              value={remark}
              onChange={(event) => setRemark(event.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={() => {
              if (!storeroomId || !name.trim()) return
              onSubmit({
                storeroomId,
                name: name.trim(),
                remark: remark.trim(),
              })
              onOpenChange(false)
            }}
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
