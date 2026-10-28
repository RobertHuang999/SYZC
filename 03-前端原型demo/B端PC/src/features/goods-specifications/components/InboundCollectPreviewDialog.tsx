import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { InboundCollectFieldConfig } from "../domain/types"
import { InboundCollectPreviewCard } from "./InboundCollectPreviewCard"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  field: InboundCollectFieldConfig | null
}

export function InboundCollectPreviewDialog({ open, onOpenChange, field }: Props) {
  if (!field) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-semibold text-slate-900">
              效果预览 — {field.name}
            </DialogTitle>
          </div>
          <DialogDescription>
            仓储入库单示意（只读，不改变任何配置）
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <InboundCollectPreviewCard field={field} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>控件类型：{field.controlType}</span>
          <span>度量单位 / 选项摘要：{field.summary}</span>
          <span>状态：{field.status === "ENABLED" ? "启用" : "停用"}</span>
        </div>

        <DialogFooter className="pt-1">
          <Button type="button" onClick={() => onOpenChange(false)}>
            我知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
