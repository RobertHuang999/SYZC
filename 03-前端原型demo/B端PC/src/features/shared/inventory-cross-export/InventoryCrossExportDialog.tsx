import React, { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import {
  ALL_CROSS_EXPORT_TARGETS,
  createCombinedExportRecord,
  createDefaultCrossExportSelection,
  getCrossExportMenuGroups,
  type InventoryCrossExportTargetId,
  type InventoryExportSourceMenu,
} from "./inventoryCrossExportTypes"
import {
  INVENTORY_CROSS_EXPORT_OPTION_LABELS,
  INVENTORY_CROSS_EXPORT_OPTION_LABELS_OTHER_MENU,
  INVENTORY_CROSS_EXPORT_USER_DETAIL_SCOPE_HINT,
  INVENTORY_CROSS_EXPORT_USER_FLOW_SCOPE_HINT,
  INVENTORY_CROSS_EXPORT_USER_ZIP_HINT,
  INVENTORY_CROSS_EXPORT_SPEC_DIALOG_NOTE,
  INVENTORY_CROSS_EXPORT_USER_CANCEL,
  INVENTORY_CROSS_EXPORT_USER_DIALOG_INTRO,
  INVENTORY_CROSS_EXPORT_USER_DIALOG_TITLE,
  INVENTORY_CROSS_EXPORT_USER_HINT_ASYNC,
  INVENTORY_CROSS_EXPORT_USER_HINT_SCOPE,
  INVENTORY_CROSS_EXPORT_USER_SECTION_CURRENT_PREFIX,
  INVENTORY_CROSS_EXPORT_USER_SECTION_OTHER,
  INVENTORY_CROSS_EXPORT_USER_SUBMIT,
  INVENTORY_CROSS_EXPORT_USER_VALIDATION_EMPTY,
} from "./inventory-cross-export-ui-labels"
import { prependInventoryExportRecord } from "./inventoryCrossExportStore"

export interface InventoryCrossExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sourceMenu: InventoryExportSourceMenu
  onSubmitted: () => void
  canExportDetail?: boolean
  canExportFlow?: boolean
}

function isTargetEnabled(
  id: InventoryCrossExportTargetId,
  canExportDetail: boolean,
  canExportFlow: boolean
): boolean {
  if (id === "DETAIL") return canExportDetail
  if (id === "FLOW") return canExportFlow
  return true
}

export const InventoryCrossExportDialog: React.FC<InventoryCrossExportDialogProps> = ({
  open,
  onOpenChange,
  sourceMenu,
  onSubmitted,
  canExportDetail = true,
  canExportFlow = true,
}) => {
  const groups = useMemo(() => getCrossExportMenuGroups(sourceMenu), [sourceMenu])
  const [selection, setSelection] = useState(() => createDefaultCrossExportSelection(sourceMenu))

  useEffect(() => {
    if (open) {
      setSelection(createDefaultCrossExportSelection(sourceMenu))
    }
  }, [open, sourceMenu])

  const selectedTargets = useMemo(
    () => ALL_CROSS_EXPORT_TARGETS.filter((id) => selection[id]),
    [selection]
  )

  const canSubmit = selectedTargets.length > 0

  const toggle = (id: InventoryCrossExportTargetId, enabled: boolean) => {
    if (!enabled) return
    setSelection((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSubmit = () => {
    if (!canSubmit) return
    const record = createCombinedExportRecord(selectedTargets, sourceMenu)
    prependInventoryExportRecord(record)
    onOpenChange(false)
    onSubmitted()
  }

  const renderRow = (
    id: InventoryCrossExportTargetId,
    label: string,
    enabled: boolean,
    disabledReason?: string,
    scopeHint?: string
  ) => (
    <label
      key={id}
      className={`flex cursor-pointer items-start gap-3 rounded-md px-1 py-2 ${
        enabled ? "hover:bg-muted/50" : "cursor-not-allowed opacity-60"
      }`}
    >
      <input
        type="checkbox"
        className="mt-1 size-4 shrink-0 accent-primary"
        checked={selection[id]}
        disabled={!enabled}
        onChange={() => toggle(id, enabled)}
      />
      <span className="text-sm text-foreground">
        {label}
        {scopeHint ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{scopeHint}</span>
        ) : null}
        {disabledReason ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">{disabledReason}</span>
        ) : null}
      </span>
    </label>
  )

  const renderSection = (
    title: string,
    ids: InventoryCrossExportTargetId[],
    labelMap: typeof INVENTORY_CROSS_EXPORT_OPTION_LABELS | typeof INVENTORY_CROSS_EXPORT_OPTION_LABELS_OTHER_MENU
  ) => (
    <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
      <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground">{title}</p>
      <div className="divide-y divide-border/60">
        {ids.map((id) => {
          const enabled = isTargetEnabled(id, canExportDetail, canExportFlow)
          const disabledReason =
            id === "DETAIL" && !canExportDetail
              ? "无库存明细查看权限"
              : id === "FLOW" && !canExportFlow
                ? "无库存流水查看权限"
                : undefined
          const scopeHint =
            id === "DETAIL"
              ? INVENTORY_CROSS_EXPORT_USER_DETAIL_SCOPE_HINT
              : id === "FLOW"
                ? INVENTORY_CROSS_EXPORT_USER_FLOW_SCOPE_HINT
                : undefined
          const rowLabel =
            id === "DETAIL"
              ? INVENTORY_CROSS_EXPORT_OPTION_LABELS_OTHER_MENU.DETAIL
              : labelMap[id]
          return renderRow(id, rowLabel, enabled, disabledReason, scopeHint)
        })}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {INVENTORY_CROSS_EXPORT_USER_DIALOG_TITLE}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="shrink-0 text-sm text-foreground">{INVENTORY_CROSS_EXPORT_USER_DIALOG_INTRO}</p>
            <ProductFieldHint className="min-w-0 flex-1 text-right">
              {INVENTORY_CROSS_EXPORT_USER_HINT_SCOPE}
            </ProductFieldHint>
          </div>

          <div className="space-y-3">
            {renderSection(
              `${INVENTORY_CROSS_EXPORT_USER_SECTION_CURRENT_PREFIX} · ${groups.currentMenuLabel}`,
              groups.current,
              INVENTORY_CROSS_EXPORT_OPTION_LABELS
            )}
            {renderSection(
              INVENTORY_CROSS_EXPORT_USER_SECTION_OTHER,
              groups.other,
              INVENTORY_CROSS_EXPORT_OPTION_LABELS_OTHER_MENU
            )}
            <ProductFieldHint className="pl-0.5">{INVENTORY_CROSS_EXPORT_USER_ZIP_HINT}</ProductFieldHint>
          </div>

          <ProductFieldHint>{INVENTORY_CROSS_EXPORT_USER_HINT_ASYNC}</ProductFieldHint>

          <PrototypeSpecCallout>{INVENTORY_CROSS_EXPORT_SPEC_DIALOG_NOTE}</PrototypeSpecCallout>

          {!canSubmit ? (
            <p className="text-xs text-destructive">{INVENTORY_CROSS_EXPORT_USER_VALIDATION_EMPTY}</p>
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {INVENTORY_CROSS_EXPORT_USER_CANCEL}
          </Button>
          <Button type="button" disabled={!canSubmit} onClick={handleSubmit}>
            {INVENTORY_CROSS_EXPORT_USER_SUBMIT}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
