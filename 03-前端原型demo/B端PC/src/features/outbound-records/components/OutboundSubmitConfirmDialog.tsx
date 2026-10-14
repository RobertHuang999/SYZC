import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ClipboardCheck } from "lucide-react"
import type { OutboundTypeName } from "../domain/types"

type OutboundSubmitConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  outboundType: OutboundTypeName
  ownerName: string
  relatedNo: string
  totalAmount: number
  unit: string
  categoryCount: number
  pickupName: string
  pickupPhone: string
  plateNo: string
  warehouseName: string
  onBack: () => void
  onConfirm: () => void
}

export function OutboundSubmitConfirmDialog({
  open,
  onOpenChange,
  outboundType,
  ownerName,
  relatedNo,
  totalAmount,
  unit,
  categoryCount,
  pickupName,
  pickupPhone,
  plateNo,
  warehouseName,
  onBack,
  onConfirm,
}: OutboundSubmitConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="size-5 text-primary" />
            <DialogTitle>出库申报确认</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-xs text-muted-foreground leading-relaxed">
            系统将校验可用库存并在审批通过后自动生成提货单，请仔细核对出库关键信息。
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 p-4 text-xs space-y-2.5">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">出库类型</span>
            <span className="font-medium text-foreground text-right">{outboundType}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">货主主体</span>
            <span className="font-medium text-foreground text-right">{ownerName || "—"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">关联业务单号</span>
            <span className="font-medium text-foreground">{relatedNo || "无（普通出库）"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">出库总数量</span>
            <span className="font-semibold text-primary text-right">
              {totalAmount.toFixed(4)} {unit}（共 {categoryCount} 种货品）
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">提货人/企业</span>
            <span className="font-medium text-foreground text-right">
              {pickupName || "—"}（{pickupPhone || "—"}）
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">提货车牌</span>
            <span className="font-medium text-foreground">{plateNo || "—"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">出库仓库</span>
            <span className="font-medium text-foreground">{warehouseName || "—"}</span>
          </div>
        </div>

        <div className="rounded-md border border-amber-200/80 bg-amber-50/80 p-3 text-xs text-amber-900">
          提交后将进入所选出库审批流程，终审通过后将自动生成提货单，现场核销提货后方可装车出场。
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onBack}>
            返回修改
          </Button>
          <Button type="button" onClick={onConfirm}>
            确认无误，选择审批流程
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
