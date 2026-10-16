import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { ContactPhoneVerifyStatus } from "../domain/types"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
} from "../lib/contact-phone-verify"

type ContactPhoneVerifyBadgeProps = {
  status: ContactPhoneVerifyStatus
  className?: string
}

export function ContactPhoneVerifyBadge({ status, className }: ContactPhoneVerifyBadgeProps) {
  const Icon = status === "VERIFIED" ? ShieldCheckIcon : ShieldAlertIcon

  return (
    <Badge
      variant="outline"
      className={cn(
        "h-5 w-fit gap-0.5 px-1.5 py-0 text-[10px] font-normal",
        CONTACT_PHONE_VERIFY_BADGE_CLASS[status],
        className
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {CONTACT_PHONE_VERIFY_LABELS[status]}
    </Badge>
  )
}
