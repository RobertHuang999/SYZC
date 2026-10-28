import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { InboundCollectFieldConfig } from "../domain/types"
import { deleteInboundCollectField, countGoodsReferences } from "../lib/store"
import { AlertTriangle, ShieldAlert } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  field: InboundCollectFieldConfig | null
  onSuccess: (message: string) => void
}

export function InboundCollectDeleteDialog({
  open,
  onOpenChange,
  field,
  onSuccess,
}: Props) {
  if (!field) return null

  // 判定分支
  const isEnabled = field.status === "ENABLED"
  const hasRef = field.hasDownstreamRef
  const canDelete = !isEnabled && !hasRef

  const handleConfirmDelete = () => {
    const res = deleteInboundCollectField(field.id)
    if (res.success) {
      onSuccess(`收集项「${field.name}」已彻底删除`)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {canDelete ? (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-destructive" />
            )}
            <DialogTitle className="text-base font-semibold text-slate-900">
              {canDelete ? "确认删除收集项" : "无法删除收集项"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-3">
          {isEnabled ? (
            // 阶段一阻断
            <div className="space-y-2">
              <p className="flex items-start gap-1.5 text-sm font-medium text-slate-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>启用状态下的收集项不可删除，请先停用。</span>
              </p>
              <p className="text-xs text-muted-foreground">
                当前收集项「{field.name}」正处于正常生效状态中。为保障业务连续性，请先在操作列将其手动切换为【停用】状态后再执行安全核验。
              </p>
            </div>
          ) : hasRef ? (
            // 阶段二阻断
            <div className="space-y-2">
              <p className="flex items-start gap-1.5 text-sm font-medium text-slate-900">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>该收集项已被使用，不可删除！请先前往解绑。</span>
              </p>
              <p className="text-xs text-muted-foreground">
                系统后台探测到该收集项「{field.name}」当前被{" "}
                <strong className="text-slate-800">
                  {countGoodsReferences(field.id)} 个货品
                </strong>
                使用。为防范孤儿数据并保障历史账实一致，请先在货品管理里解绑后再执行删除。
              </p>
            </div>
          ) : (
            // 安全删除二次确认
            <div className="space-y-2">
              <p className="flex items-start gap-1.5 text-sm font-medium text-slate-900">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>确定彻底删除该收集项吗？删除后不可恢复。</span>
              </p>
              <p className="text-xs text-muted-foreground">
                收集项名称：<strong className="text-slate-800">{field.name}</strong>（控件类型：{field.controlType}）。
                该项处于停用状态且未产生任何下游业务引用，确认后将从系统中彻底移除。
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 gap-2">
          {canDelete ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取 消
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                确 定
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="default"
              onClick={() => onOpenChange(false)}
            >
              我知道了
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
