import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type {
  AppendPlanItem,
  CompositePrecheckFailure,
  CompositeSaveResultLine,
} from "../lib/composite-append-save"
import { planActionLabel, resultOutcomeLabel } from "../lib/composite-append-save"
import {
  PARTNER_COMPOSITE_SAVE_CONFIRM_SPEC,
  PARTNER_COMPOSITE_SAVE_CONFIRM_USER,
  PARTNER_COMPOSITE_ROW_APPEND_CONFIRM_USER,
  PARTNER_COMPOSITE_ROW_APPEND_FAILURE_INTRO,
  PARTNER_COMPOSITE_ROW_APPEND_SUCCESS_INTRO,
  PARTNER_COMPOSITE_SAVE_FAILURE_INTRO,
  PARTNER_COMPOSITE_SAVE_SUCCESS_INTRO,
} from "../lib/partner-archive-ui-labels"

export type PartnerCompositeSaveDialogMode = "confirm" | "failure" | "success"
export type PartnerCompositeSaveFlowKind = "create" | "rowAppend"

type PartnerCompositeSaveDialogProps = {
  open: boolean
  mode: PartnerCompositeSaveDialogMode
  flowKind?: PartnerCompositeSaveFlowKind
  currentMenu: PartnerArchiveMenuLabel
  plan?: AppendPlanItem[]
  appendMenus?: PartnerArchiveMenuLabel[]
  failures?: CompositePrecheckFailure[]
  successLines?: CompositeSaveResultLine[]
  verifiedOnCreate?: boolean
  onOpenChange: (open: boolean) => void
  onConfirmComposite?: () => void
  onViewDetail?: () => void
  onBackToList?: () => void
}

export function PartnerCompositeSaveDialog({
  open,
  mode,
  flowKind = "create",
  currentMenu,
  plan = [],
  appendMenus = [],
  failures = [],
  successLines = [],
  verifiedOnCreate,
  onOpenChange,
  onConfirmComposite,
  onViewDetail,
  onBackToList,
}: PartnerCompositeSaveDialogProps) {
  const isRowAppend = flowKind === "rowAppend"

  if (mode === "confirm") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isRowAppend ? "确认一并追加合作方档案" : "确认一并保存合作方档案"}
            </DialogTitle>
            <DialogDescription>
              {isRowAppend
                ? PARTNER_COMPOSITE_ROW_APPEND_CONFIRM_USER
                : PARTNER_COMPOSITE_SAVE_CONFIRM_USER}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            {!isRowAppend ? (
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                  本页（当前菜单）
                </div>
                <div className="rounded-md border bg-muted/30 px-3 py-2">
                  · 【{currentMenu}】 → 新建档案（隐式身份）
                </div>
              </div>
            ) : null}
            {plan.length > 0 && (
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                  {isRowAppend ? "将要追加的目标菜单" : "同时追加的其他合作档案"}
                </div>
                <ul className="space-y-1.5 rounded-md border px-3 py-2">
                  {plan.map((item) => (
                    <li key={item.targetMenu}>
                      · 【{item.targetMenu}】 → {planActionLabel(item.action)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <PrototypeSpecCallout>{PARTNER_COMPOSITE_SAVE_CONFIRM_SPEC}</PrototypeSpecCallout>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="button" onClick={onConfirmComposite}>
              {isRowAppend ? "确认一并追加" : "确认一并保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (mode === "failure") {
    const scopes = isRowAppend
      ? appendMenus.map((menu) => ({
          label: `【${menu}（追加）】`,
          failed: true,
        }))
      : [
          { label: `【${currentMenu}（本页）】`, failed: true },
          ...appendMenus.map((menu) => ({
            label: `【${menu}（追加）】`,
            failed: true,
          })),
        ]
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isRowAppend ? "追加未成功" : "保存未成功"}</DialogTitle>
            <DialogDescription>
              {isRowAppend
                ? PARTNER_COMPOSITE_ROW_APPEND_FAILURE_INTRO
                : PARTNER_COMPOSITE_SAVE_FAILURE_INTRO}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[min(50vh,320px)] space-y-3 overflow-y-auto text-sm">
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">处理结果</div>
              <ul className="space-y-1 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2">
                {scopes.map((row) => (
                  <li key={row.label}>
                    · {row.label} ✗ {isRowAppend ? "未更新" : "未保存"}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-1 text-xs font-medium text-muted-foreground">失败原因</div>
              <ol className="list-decimal space-y-2 pl-5">
                {failures.map((item) => (
                  <li key={`${item.scopeLabel}-${item.reason}`}>
                    <span className="font-medium">{item.scopeLabel}</span>
                    <div className="text-muted-foreground">{item.reason}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => onOpenChange(false)}>
              我知道了
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isRowAppend ? "追加成功" : "保存成功"}</DialogTitle>
          <DialogDescription>
            {isRowAppend
              ? PARTNER_COMPOSITE_ROW_APPEND_SUCCESS_INTRO
              : PARTNER_COMPOSITE_SAVE_SUCCESS_INTRO}
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm">
          {successLines.map((line) => (
            <li
              key={line.scopeLabel}
              className="rounded-md border border-emerald-200/80 bg-emerald-50/80 px-3 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/30"
            >
              · {line.scopeLabel} ✓ {resultOutcomeLabel(line.outcome)}
              {line.detail ? (
                <div className="mt-0.5 text-xs text-muted-foreground">{line.detail}</div>
              ) : null}
            </li>
          ))}
        </ul>
        {verifiedOnCreate && (
          <ProductFieldHint>本页联系手机已完成短信验证。</ProductFieldHint>
        )}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onBackToList}>
            返回列表
          </Button>
          <Button type="button" onClick={onViewDetail}>
            {isRowAppend ? "查看详情" : "查看本菜单详情"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
