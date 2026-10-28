import { useState } from "react"
import { ExternalLink, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { resolveContactPhoneVerified } from "../lib/contact-phone-verify"
import { Label } from "@/components/ui/label"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import { partnerArchiveDetailPath } from "@prototype/shared/partner-archives/partner-archive-routes"
import {
  PartnerArchiveSelector,
  type PartnerSelectorValue,
} from "./PartnerArchiveSelector"
import { PartnerQuickCreateSheet } from "./PartnerQuickCreateSheet"
import { quickCreateSceneForArchiveMenu } from "../lib/quick-create-scene-for-menu"
import {
  partnerEmbeddedPickerSpecNote,
  partnerEmbeddedPickerUserHint,
} from "../lib/partner-archive-ui-labels"
import { resolvePartnerIdentityDisplay } from "../lib/partner-archive-rules"
import { cn } from "@/lib/utils"

type PartnerArchiveEmbeddedPickerProps = {
  archiveMenu: PartnerArchiveMenuLabel
  fieldLabel: string
  required?: boolean
  value?: string
  selection?: PartnerSelectorValue | null
  onChange: (payload: PartnerSelectorValue | null) => void
  enableQuickCreate?: boolean
  /** 覆盖默认 archiveMenu 说明（如出库货主仅选已有档案） */
  userHint?: string
  /** 外层已用 PartnerChangeFieldMark 时设为 true，避免重复琥珀说明 */
  hideEmbeddedHints?: boolean
  /**
   * 作业页嵌入（入库货主 / 出库提货经办人）：内层 p-2 + 横排选择器与快捷按钮，与入库新增页一致。
   * 此时外层 FormItem/Field 应自带标签，并设 showFieldLabel=false。
   */
  embedLayout?: "default" | "job-embed"
  showFieldLabel?: boolean
  /** 快捷建档按钮文案；job-embed 默认对齐入库「+ 快速添加货主」风格 */
  quickCreateButtonLabel?: string
  className?: string
}

function SelectionSummary({
  archiveMenu,
  selection,
}: {
  archiveMenu: PartnerArchiveMenuLabel
  selection: PartnerSelectorValue
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span>
        已选：{selection.name} · {resolvePartnerIdentityDisplay(selection)}
      </span>
      <Link
        to={partnerArchiveDetailPath(archiveMenu, selection.partnerId)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center text-primary hover:underline"
      >
        查看档案
        <ExternalLink className="ml-0.5 h-3 w-3" />
      </Link>
    </div>
  )
}

export function PartnerArchiveEmbeddedPicker({
  archiveMenu,
  fieldLabel,
  required,
  value,
  selection,
  onChange,
  enableQuickCreate = true,
  userHint,
  hideEmbeddedHints = false,
  embedLayout = "default",
  showFieldLabel = true,
  quickCreateButtonLabel,
  className,
}: PartnerArchiveEmbeddedPickerProps) {
  const [quickOpen, setQuickOpen] = useState(false)
  const quickScene = enableQuickCreate ? quickCreateSceneForArchiveMenu(archiveMenu) : null
  const isJobEmbed = embedLayout === "job-embed"

  const quickButtonLabel =
    quickCreateButtonLabel ?? (isJobEmbed ? "+ 快捷建档" : "快捷建档")

  const quickCreateButton = quickScene ? (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("shrink-0", isJobEmbed ? "text-xs" : "")}
      onClick={() => setQuickOpen(true)}
    >
      {isJobEmbed || quickCreateButtonLabel ? (
        quickButtonLabel
      ) : (
        <>
          <Plus className="mr-1 h-3.5 w-3.5" />
          {quickButtonLabel}
        </>
      )}
    </Button>
  ) : null

  const selectorRow = (
    <div className={cn(isJobEmbed ? "flex gap-1.5" : "flex flex-col gap-2 sm:flex-row sm:items-center")}>
      <div className="min-w-0 flex-1">
        <PartnerArchiveSelector
          archiveMenu={archiveMenu}
          value={value}
          onChange={onChange}
          placeholder={`请选择${fieldLabel}`}
        />
      </div>
      {quickCreateButton}
    </div>
  )

  const hintsBlock =
    hideEmbeddedHints ? null : (
      <>
        <ProductFieldHint>{userHint ?? partnerEmbeddedPickerUserHint(archiveMenu)}</ProductFieldHint>
        <PrototypeSpecCallout>{partnerEmbeddedPickerSpecNote(archiveMenu)}</PrototypeSpecCallout>
      </>
    )

  const body = isJobEmbed ? (
    <div className="flex flex-col gap-2 p-2">
      {selectorRow}
      {selection ? <SelectionSummary archiveMenu={archiveMenu} selection={selection} /> : null}
      {hintsBlock}
    </div>
  ) : (
    <div className="space-y-1.5">
      {showFieldLabel ? (
        <Label>
          {required ? <span className="text-destructive">* </span> : null}
          {fieldLabel}
        </Label>
      ) : null}
      {selectorRow}
      {selection ? <SelectionSummary archiveMenu={archiveMenu} selection={selection} /> : null}
      {hintsBlock}
    </div>
  )

  return (
    <div className={className}>
      {isJobEmbed && showFieldLabel ? (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">
            {required ? <span className="text-destructive">* </span> : null}
            {fieldLabel}
          </Label>
          {body}
        </div>
      ) : (
        body
      )}

      {quickScene ? (
        <PartnerQuickCreateSheet
          open={quickOpen}
          scene={quickScene}
          onOpenChange={setQuickOpen}
          onCreated={(partner) => {
            const roleType =
              archiveMenu === "货主信息"
                ? "OWNER"
                : archiveMenu === "资金方信息"
                  ? "FUNDER"
                  : archiveMenu === "服务方信息"
                    ? "SERVICE_PROVIDER"
                    : "PICKUP_AGENT"
            const role = partner.roles.find((r) => r.roleType === roleType) ?? partner.roles[0]
            if (!role) return
            onChange({
              partnerId: partner.id,
              partnerNo: partner.partnerNo,
              name: partner.name,
              idNumber: partner.idNumber,
              idNumberMasked: partner.idNumberMasked,
              subjectType: partner.subjectType,
              roleType: role.roleType,
              roleStatus: role.roleStatus,
              subjectStatus: partner.status,
              contactPhoneVerified: resolveContactPhoneVerified(partner),
            })
          }}
        />
      ) : null}
    </div>
  )
}
