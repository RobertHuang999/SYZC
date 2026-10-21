import { CameraIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PARTNER_ENTERPRISE_LICENSE_OCR_BUTTON_LABEL } from "@prototype/shared/partner-archives/partner-enterprise-license-ocr.demo"

type Props = {
  disabled?: boolean
  onClick: () => void
}

/** 企业主体名称旁 OCR 入口（对齐入库制单货主行 Camera 按钮） */
export function PartnerEnterpriseLicenseOcrButton({ disabled, onClick }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={disabled}
      className="shrink-0 border-primary/30 text-primary hover:bg-primary/5"
      title={`${PARTNER_ENTERPRISE_LICENSE_OCR_BUTTON_LABEL}（自动回填）`}
      aria-label={PARTNER_ENTERPRISE_LICENSE_OCR_BUTTON_LABEL}
      onClick={onClick}
    >
      <CameraIcon className="size-4" />
    </Button>
  )
}
