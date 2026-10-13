import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GitFork, Loader2 } from "lucide-react"

export const INBOUND_APPROVAL_FLOWS = [
  {
    id: "flow-001",
    name: "存货入库通用审批流程",
    subName: "标准两级审核 (库管初审 + 风控终审)",
  },
  {
    id: "flow-002",
    name: "质押品存货入库流程",
    subName: "高风险专项审核 (业务经理 + 风控经理 + 总监会签)",
  },
  {
    id: "flow-003",
    name: "普通存货免审直通流",
    subName: "快速入库核销 (系统自动归档)",
  },
]

type ApprovalFlowSelectDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: () => void
  onConfirm: (flowId: string) => void
  loading?: boolean
}

export function ApprovalFlowSelectDialog({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
  loading = false,
}: ApprovalFlowSelectDialogProps) {
  const [selectedFlowId, setSelectedFlowId] = useState(INBOUND_APPROVAL_FLOWS[0].id)

  const handleSubmit = () => {
    onConfirm(selectedFlowId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <GitFork className="size-5 text-primary" />
            <DialogTitle>流程确认</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-xs text-muted-foreground leading-relaxed">
            该条入库申请需系统审批，请选择具体流程。流程审批通过后方能正式入库并生成库存台账！
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="flow-select">
              <span className="text-destructive">* </span>审批流程
            </Label>
            <Select
              value={selectedFlowId}
              onValueChange={(val) => val && setSelectedFlowId(val)}
            >
              <SelectTrigger id="flow-select" className="w-full">
                <SelectValue placeholder="请选择审批流程" />
              </SelectTrigger>
              <SelectContent>
                {INBOUND_APPROVAL_FLOWS.map((flow) => (
                  <SelectItem key={flow.id} value={flow.id}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium text-foreground">{flow.name}</span>
                      <span className="text-xs text-muted-foreground">{flow.subName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">💡 审批须知：</p>
            <p className="mt-1">
              申请提交后将自动推送至审批人待办任务中心，单据状态置为【待审核】。支持在入库申请列表中随时查看流转进度与撤销。
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            取 消
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            确认提交审批
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
