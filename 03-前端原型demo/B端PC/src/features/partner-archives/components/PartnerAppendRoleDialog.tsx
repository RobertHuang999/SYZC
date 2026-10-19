import { useEffect, useMemo, useState, type MouseEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductFieldHint } from "@/components/form/ProductFieldHint"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  ROLE_STATUS_LABELS,
  ROLE_TYPE_LABELS,
  type PartnerSubject,
  type RoleType,
} from "../domain/types"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
  PARTNER_APPEND_OWNER_MISSING_ADDRESS_SPEC,
  PARTNER_APPEND_OWNER_MISSING_ADDRESS_USER,
  PARTNER_APPEND_OWNER_WITH_ADDRESS_SPEC,
  PARTNER_APPEND_OWNER_WITH_ADDRESS_USER,
} from "../lib/partner-archive-ui-labels"
import {
  findOwnerAddressConflict,
  ownerAddressConflictMessage,
  rolesAllowedForSubjectType,
} from "../lib/partner-archive-rules"

type PartnerAppendRoleDialogProps = {
  partner: PartnerSubject | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 字段清单：追加业务角色，可多选 */
  onConfirm: (roleTypes: RoleType[]) => void
}

export function PartnerAppendRoleDialog({
  partner,
  open,
  onOpenChange,
  onConfirm,
}: PartnerAppendRoleDialogProps) {
  const availableRoles = useMemo(() => {
    if (!partner) {
      return []
    }
    const existingRoles = new Set(partner.roles.map((role) => role.roleType))
    return rolesAllowedForSubjectType(partner.subjectType).filter(
      (role) => !existingRoles.has(role)
    )
  }, [partner])

  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([])

  useEffect(() => {
    if (open) {
      setSelectedRoles([])
    }
  }, [open, partner?.id])

  const ownerAddressMissing = Boolean(
    partner &&
      selectedRoles.includes("OWNER") &&
      partner.subjectType === "INDIVIDUAL" &&
      !partner.certAddress.fullAddress.trim()
  )

  const ownerAddressConflict = useMemo(() => {
    if (!partner || !selectedRoles.includes("OWNER")) {
      return false
    }
    if (!partner.certAddress.fullAddress.trim()) {
      return false
    }
    return Boolean(
      findOwnerAddressConflict(
        partnerArchivesMock,
        partner.certAddress.fullAddress,
        partner.subjectType,
        partner.id
      )
    )
  }, [partner, selectedRoles])

  if (!partner) {
    return null
  }

  const confirmDisabled =
    availableRoles.length === 0 || selectedRoles.length === 0 || ownerAddressConflict

  const toggleRole = (role: RoleType) => {
    setSelectedRoles((current) =>
      current.includes(role) ? current.filter((item) => item !== role) : [...current, role]
    )
  }

  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (confirmDisabled) {
      return
    }
    onConfirm(selectedRoles)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>追加业务角色</DialogTitle>
          <DialogDescription>
            为主体「{partner.name}」追加合作角色；可多选。追加货主时将联动证件地址准入校验。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="rounded-md border bg-muted/40 px-3 py-2.5">
            <div className="text-xs text-muted-foreground">已有业务角色</div>
            <div className="mt-1 font-medium leading-relaxed">
              {partner.roles.length > 0
                ? partner.roles
                    .map(
                      (role) =>
                        `${ROLE_TYPE_LABELS[role.roleType]}·${ROLE_STATUS_LABELS[role.roleStatus]}`
                    )
                    .join("、")
                : "——"}
            </div>
          </div>

          {availableRoles.length === 0 ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              该主体在当前类型下已挂接全部可用业务角色，无需再次追加。
            </p>
          ) : (
            <div className="space-y-2">
              <Label>
                追加业务角色
                <span className="ml-0.5 font-bold text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableRoles.map((role) => {
                  const isSelected = selectedRoles.includes(role)
                  return (
                    <Button
                      key={role}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={cn(!isSelected && "bg-background")}
                      onClick={() => toggleRole(role)}
                    >
                      {ROLE_TYPE_LABELS[role]}
                    </Button>
                  )
                })}
              </div>
              {selectedRoles.includes("OWNER") && !ownerAddressConflict && (
                <div className="space-y-2">
                  <ProductFieldHint>
                    {ownerAddressMissing
                      ? PARTNER_APPEND_OWNER_MISSING_ADDRESS_USER
                      : PARTNER_APPEND_OWNER_WITH_ADDRESS_USER}
                  </ProductFieldHint>
                  <PrototypeSpecCallout>
                    {ownerAddressMissing
                      ? PARTNER_APPEND_OWNER_MISSING_ADDRESS_SPEC
                      : PARTNER_APPEND_OWNER_WITH_ADDRESS_SPEC}
                  </PrototypeSpecCallout>
                </div>
              )}
              {ownerAddressConflict && (
                <p className="text-xs leading-relaxed text-destructive">
                  {ownerAddressConflictMessage(partner.subjectType)}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button type="button" disabled={confirmDisabled} onClick={handleConfirm}>
            确认追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
