import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PartnerVerifyDialog } from "@/features/partner-archives/components/PartnerVerifyDialog"
import type { SubjectType } from "@/features/partner-archives/domain/types"
import { maskLoginPhone } from "@/features/partner-archives/lib/detail-utils"
import { Loader2, ShieldCheck } from "lucide-react"
import {
  INBOUND_OWNER_VERIFY_DIALOG,
  inboundOwnerTypeDisplay,
} from "@prototype/shared/inbound/owner-ui-labels"
import type { OwnerType } from "../domain/form-types"

type OwnerVerifyDialogProps = {
  open: boolean
  isNewOwner?: boolean
  /** 金融入库等对「已建档但未验证手机」货主强制短信（PA-R04b） */
  requireSmsVerification?: boolean
  ownerType: OwnerType | string
  ownerName: string
  originalOwnerName?: string
  ownerIdentifier: string
  contactPhone?: string
  originalContactPhone?: string
  idCardNo?: string
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onConfirm: () => void
  onSendSmsHint?: (targetPhone: string) => void
  loading?: boolean
}

function maskIdCard(id?: string) {
  if (!id) return "—"
  if (id.length >= 18) {
    return id.replace(/(\d{6})\d{8}(\w{4})/, "$1********$2")
  }
  return id
}

/** 入库货主确认：需短信时复用合作方档案 PartnerVerifyDialog（PA-R04a / R03 共用） */
export function OwnerVerifyDialog({
  open,
  isNewOwner = false,
  requireSmsVerification = false,
  ownerType,
  ownerName,
  ownerIdentifier,
  contactPhone,
  idCardNo,
  onOpenChange,
  onBack,
  onConfirm,
  loading = false,
}: OwnerVerifyDialogProps) {
  const isPersonal = ownerType === "个人货主" || ownerType === "个人"
  const needVerifyCode = Boolean(isNewOwner || requireSmsVerification)

  if (needVerifyCode) {
    const subjectType: SubjectType = isPersonal ? "INDIVIDUAL" : "ENTERPRISE"
    const personalPhone =
      /^1[3-9]\d{9}$/.test(ownerIdentifier) ? ownerIdentifier : contactPhone || ownerIdentifier

    return (
      <PartnerVerifyDialog
        open={open}
        mode={isNewOwner ? "CREATE" : "VERIFY_CONTACT"}
        verifyContext={isNewOwner ? "INBOUND_CREATE" : "INBOUND_SUBMIT"}
        subjectType={subjectType}
        name={ownerName}
        idNumber={isPersonal ? idCardNo || ownerIdentifier : ownerIdentifier}
        contactPhone={isPersonal ? personalPhone : contactPhone || ""}
        fullAddress=""
        onOpenChange={(next) => {
          onOpenChange(next)
          if (!next) {
            onBack()
          }
        }}
        onConfirm={onConfirm}
      />
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <DialogTitle>{INBOUND_OWNER_VERIFY_DIALOG.title}</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            {INBOUND_OWNER_VERIFY_DIALOG.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 rounded-lg border bg-muted/20 p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{INBOUND_OWNER_VERIFY_DIALOG.ownerType}：</span>
            <span className="font-semibold text-foreground">
              {inboundOwnerTypeDisplay(ownerType)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{INBOUND_OWNER_VERIFY_DIALOG.ownerName}：</span>
            <span className="font-medium text-foreground">{ownerName || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{INBOUND_OWNER_VERIFY_DIALOG.ownerIdentifier}：</span>
            <span className="font-medium text-foreground">
              {isPersonal ? maskLoginPhone(ownerIdentifier) : ownerIdentifier || "—"}
            </span>
          </div>
          {isPersonal ? (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{INBOUND_OWNER_VERIFY_DIALOG.idCardNo}：</span>
              <span className="text-foreground">{maskIdCard(idCardNo)}</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{INBOUND_OWNER_VERIFY_DIALOG.contactPhone}：</span>
              <span className="text-foreground">
                {contactPhone ? maskLoginPhone(contactPhone) : "—"}
              </span>
            </div>
          )}
        </div>

        <div className="rounded border border-emerald-200 bg-emerald-50/60 p-2 text-[11px] text-emerald-800">
          {INBOUND_OWNER_VERIFY_DIALOG.existingOwnerHint}
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
            {INBOUND_OWNER_VERIFY_DIALOG.back}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-1.5 size-4 animate-spin" />}
            {INBOUND_OWNER_VERIFY_DIALOG.confirmNext}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
