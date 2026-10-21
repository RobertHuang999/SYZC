import { Camera } from "lucide-react"
import { PARTNER_ENTERPRISE_LICENSE_OCR_BUTTON_LABEL } from "@prototype/shared/partner-archives/partner-enterprise-license-ocr.demo"

type Props = {
  disabled?: boolean
  onClick: () => void
}

export function PartnerEnterpriseLicenseOcrButton({ disabled, onClick }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={PARTNER_ENTERPRISE_LICENSE_OCR_BUTTON_LABEL}
      title={PARTNER_ENTERPRISE_LICENSE_OCR_BUTTON_LABEL}
      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#2F6BFF]/35 bg-[#2F6BFF]/5 text-[#2F6BFF] disabled:opacity-40"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <Camera className="size-4" strokeWidth={2} />
    </button>
  )
}
