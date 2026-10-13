import { useEffect, useMemo, useState, type MouseEvent } from "react"
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
import { cn } from "@/lib/utils"
import {
  ROLE_STATUS_LABELS,
  ROLE_TYPE_LABELS,
  type PartnerSubject,
  type RoleType,
} from "../domain/types"
import { rolesAllowedForSubjectType } from "../lib/partner-archive-rules"

type PartnerAppendRoleDialogProps = {
  partner: PartnerSubject | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 字段清单 §三：追加业务角色 */
  onConfirm: (roleType: RoleType) => void
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

  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null)

  useEffect(() => {
    if (open) {
      setSelectedRole(availableRoles[0] ?? null)
    }
  }, [open, availableRoles])

  if (!partner) {
    return null
  }

  const confirmDisabled = availableRoles.length === 0 || selectedRole === null

  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (confirmDisabled || !selectedRole) {
      return
    }
    onConfirm(selectedRole)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>追加业务角色</DialogTitle>
          <DialogDescription>
            为主体「{partner.name}」追加合作角色；追加货主时将联动证件地址准入校验。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="rounded-md border bg-muted/40 px-3 py-2.5">
            <div className="text-xs text-muted-foreground">业务角色</div>
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
              该主体已具备全部四类业务角色，无需再次追加。
            </p>
          ) : (
            <div className="space-y-2">
              <Label>
                追加业务角色
                <span className="ml-0.5 font-bold text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableRoles.map((role) => {
                  const isSelected = selectedRole === role
                  return (
                    <Button
                      key={role}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={cn(!isSelected && "bg-background")}
                      onClick={() => setSelectedRole(role)}
                    >
                      {ROLE_TYPE_LABELS[role]}
                    </Button>
                  )
                })}
              </div>
              {selectedRole === "OWNER" && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                    追加货主角色将校验证件地址必填与租户内地址唯一性。
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
