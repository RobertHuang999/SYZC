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
import { Textarea } from "@/components/ui/textarea"

import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { StoreroomNode } from "../domain/types"

type StoreroomFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  initial?: StoreroomNode
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: { name: string; remark: string }) => void
}

export function StoreroomFormDialog({
  open,
  mode,
  initial,
  onOpenChange,
  onSubmit,
}: StoreroomFormDialogProps) {
  const [name, setName] = useState("")
  const [remark, setRemark] = useState("")

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? "")
    setRemark(initial?.remark ?? "")
  }, [open, initial])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "添加库房" : "编辑库房"}</DialogTitle>
        </DialogHeader>
        <PrototypeAnnotationTarget annotationIds={["wh-63-storeroom-form"]}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>
                库房名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="请输入库房名称"
              />
            </div>
            <div className="space-y-2">
              <Label>备注信息</Label>
              <Textarea
                value={remark}
                onChange={(event) => setRemark(event.target.value)}
                placeholder="0~500 字"
                maxLength={500}
                rows={3}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              6.3 起不在此维护「出入库审核」；受控/免审标签由【基础配置 →
              仓储作业参数】统一计算后在树表只读展示。
            </p>
          </div>
        </PrototypeAnnotationTarget>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={() => {
              if (!name.trim()) return
              onSubmit({ name: name.trim(), remark: remark.trim() })
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
