import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { InboundCollectFieldConfig } from "../domain/types"
import {
  deleteInboundCollectField,
  listReferencingSkus,
} from "../lib/store"
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

  const referencingSkus = listReferencingSkus(field.id)
  const isEnabled = field.status === "ENABLED"
  const hasRef = referencingSkus.length > 0 || field.hasDownstreamRef
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
      <DialogContent className="max-w-[520px] p-6">
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
          <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
            {canDelete
              ? "删除后不可恢复，请确认这个收集项确实不再需要。"
              : "当前条件还不满足删除要求，按下面的提示处理后再试。"}
          </DialogDescription>
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
                当前收集项「{field.name}」正处于正常生效状态中。为保障业务连续性，请先在操作列把它切成【停用】，然后再点删除。
              </p>
            </div>
          ) : hasRef ? (
            // 阶段二阻断 + 列出引用货品清单与解绑直达入口
            <div className="space-y-3">
              <p className="flex items-start gap-1.5 text-sm font-medium text-slate-900">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>该收集项已被使用，不可删除！请先前往解绑。</span>
              </p>
              <p className="text-xs text-muted-foreground">
                系统后台探测到该收集项「{field.name}」当前被{" "}
                <strong className="text-slate-800">
                  {referencingSkus.length} 个货品
                </strong>
                正在用。直接删会让这些货品的入库表单缺字段，所以请先到货品管理里把这项从下列货品上取消勾选，再回来删除：
              </p>
              {referencingSkus.length > 0 && (
                <div className="max-h-44 overflow-y-auto rounded-md border bg-slate-50/70 divide-y text-xs">
                  {referencingSkus.map((sku) => (
                    <div
                      key={sku.id}
                      className="flex items-center justify-between gap-2 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-slate-800 truncate">
                          {sku.subcategoryName} · {sku.specSummary}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          所属大类：{sku.categoryName}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
