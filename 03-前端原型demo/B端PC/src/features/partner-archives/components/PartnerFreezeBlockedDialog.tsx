import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { AlertCircle, Ban, FileText, Package } from "lucide-react"
import type { PartnerSubject } from "../domain/types"
import type { FreezeBlockReason } from "../lib/partner-archive-rules"

type PartnerFreezeBlockedDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  partner: PartnerSubject | null
  blockInfo: FreezeBlockReason | null
}

export function PartnerFreezeBlockedDialog({
  open,
  onOpenChange,
  partner,
  blockInfo,
}: PartnerFreezeBlockedDialogProps) {
  if (!partner || !blockInfo) {
    return null
  }

  const { title = "无法冻结该合作方主体", reason, detail, guide, blockingDocs } = blockInfo

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-500">
            <div className="flex size-9 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50">
              <Ban className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                {title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                主体名称：{partner.name}（{partner.archiveMenu} · {partner.partnerNo}）
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 py-1 text-sm">
          {/* 阻断理由横幅 */}
          <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-300">{reason}</p>
                {detail && <p className="mt-1 text-amber-700/90 dark:text-amber-400/90">{detail}</p>}
              </div>
            </div>
          </div>

          {/* 关联资产与在途单据清单 */}
          {blockingDocs && blockingDocs.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Package className="size-3.5" />
                  关联资产与在途单据（{blockingDocs.length} 笔）
                </span>
                <span className="text-[11px] text-muted-foreground/80">业务未结清</span>
              </div>
              <div className="max-h-48 overflow-y-auto rounded-md border bg-muted/30 divide-y divide-border/60">
                {blockingDocs.map((doc) => (
                  <div key={doc.id} className="p-2.5 text-xs flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <FileText className="size-3.5 text-muted-foreground" />
                        {doc.docTypeName} · {doc.docNo}
                      </span>
                      <Badge variant="outline" className="text-[10px] shrink-0 border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                        {doc.statusName}
                      </Badge>
                    </div>
                    {doc.remark && (
                      <p className="text-[11px] text-muted-foreground pl-5 line-clamp-2">
                        {doc.remark}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 处置引导说明 */}
          {guide && (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <span className="font-semibold text-foreground">💡 处置建议：</span>
              {guide}
            </div>
          )}

          <PrototypeSpecCallout>
            【分菜单主体冻结与在途在库前置校验规则】(PA-R02)：货主名下有在库货物禁止冻结；提货人名下有待提货单据禁止冻结；资金方/服务方名下有进行中单据禁止冻结。
          </PrototypeSpecCallout>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            我知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
