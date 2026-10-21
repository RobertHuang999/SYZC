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
  className?: string
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
  className,
}: PartnerArchiveEmbeddedPickerProps) {
  const [quickOpen, setQuickOpen] = useState(false)
  const quickScene = enableQuickCreate ? quickCreateSceneForArchiveMenu(archiveMenu) : null

  return (
    <div className={className}>
      <div className="space-y-1.5">
        <Label>
          {required ? <span className="text-destructive">* </span> : null}
          {fieldLabel}
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <PartnerArchiveSelector
              archiveMenu={archiveMenu}
              value={value}
              onChange={onChange}
              placeholder={`请选择${fieldLabel}`}
            />
          </div>
          {quickScene ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setQuickOpen(true)}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              快捷建档
            </Button>
          ) : null}
        </div>
        {selection ? (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>
              已选：{selection.name} · {selection.idNumberMasked}
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
        ) : null}
        <ProductFieldHint>{userHint ?? partnerEmbeddedPickerUserHint(archiveMenu)}</ProductFieldHint>
        <PrototypeSpecCallout>{partnerEmbeddedPickerSpecNote(archiveMenu)}</PrototypeSpecCallout>
      </div>

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
