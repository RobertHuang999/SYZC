import { useEffect, useState, type ReactNode } from "react"
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

export type ApprovalFlowOption = {
  id: string
  name: string
  subName: string
}

export const INBOUND_APPROVAL_FLOWS: ApprovalFlowOption[] = [
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

export const OUTBOUND_APPROVAL_FLOWS: ApprovalFlowOption[] = [
  {
    id: "FLOW-01",
    name: "标准出库流程（库管初审 + 监管风控双签）",
    subName: "适用绝大部分常规出库申报，支持行级锁库存校验与在线签署提货单",
  },
  {
    id: "FLOW-02",
    name: "紧急出库绿色通道（站长直批 + 事后双重复核）",
    subName: "适用于特快配送、现货临期或非质押大宗应急调度",
  },
]

type ApprovalFlowSelectDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: () => void
  onConfirm: (flowId: string) => void
  loading?: boolean
  title?: string
  description?: ReactNode
  flows?: ApprovalFlowOption[]
  confirmLabel?: string
  noticeTitle?: string
  noticeContent?: ReactNode
}

export function ApprovalFlowSelectDialog({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
  loading = false,
  title = "流程确认",
  description = "该条入库申请需系统审批，请选择具体流程。流程审批通过后方能正式入库并生成库存台账！",
  flows = INBOUND_APPROVAL_FLOWS,
  confirmLabel = "确认提交审批",
  noticeTitle = "💡 审批须知：",
  noticeContent = "申请提交后将自动推送至审批人待办任务中心，单据状态置为【待审核】。支持在入库申请列表中随时查看流转进度与撤销。",
}: ApprovalFlowSelectDialogProps) {
  const [selectedFlowId, setSelectedFlowId] = useState(flows[0]?.id ?? "")

  useEffect(() => {
    if (open && flows[0]?.id) {
      setSelectedFlowId(flows[0].id)
    }
  }, [open, flows])

  const handleSubmit = () => {
    onConfirm(selectedFlowId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <GitFork className="size-5 text-primary" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-xs text-muted-foreground leading-relaxed">
            {description}
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
                {flows.map((flow) => (
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
            <p className="font-medium text-foreground">{noticeTitle}</p>
            <p className="mt-1">{noticeContent}</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            取 消
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
