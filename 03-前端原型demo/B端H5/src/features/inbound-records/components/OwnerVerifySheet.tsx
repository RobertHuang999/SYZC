import { useEffect, useState } from "react"
import { maskLoginPhone } from "@prototype/B端PC/src/features/partner-archives/lib/detail-utils"
import { PrototypeSpecCallout } from "@prototype/B端PC/src/components/form/PrototypeSpecCallout"
import {
  INBOUND_OWNER_VERIFY_DIALOG,
  inboundOwnerTypeDisplay,
} from "@prototype/shared/inbound/owner-ui-labels"
import type { OwnerType } from "../domain/form-types"

type Props = {
  open: boolean
  isNewOwner?: boolean
  requireSmsVerification?: boolean
  ownerType: OwnerType | string
  ownerName: string
  ownerIdentifier: string
  contactPhone?: string
  idCardNo?: string
  onClose: () => void
  onConfirm: () => void
}

function maskIdCard(id?: string) {
  if (!id) return "——"
  if (id.length >= 18) {
    return id.replace(/(\d{6})\d{8}(\w{4})/, "$1********$2")
  }
  return id
}

/** 入库货主确认（H5）；需短信时展示验证码，否则对齐 PC 免短信确认态 */
export function OwnerVerifySheet({
  open,
  isNewOwner = false,
  requireSmsVerification = false,
  ownerType,
  ownerName,
  ownerIdentifier,
  contactPhone,
  idCardNo,
  onClose,
  onConfirm,
}: Props) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  const isPersonal = ownerType === "个人货主" || ownerType === "个人"
  const needVerifyCode = Boolean(isNewOwner || requireSmsVerification)

  useEffect(() => {
    if (!open) {
      setCode("")
      setError(null)
    }
  }, [open])

  if (!open) return null

  const handleConfirm = () => {
    if (needVerifyCode) {
      if (code.trim() !== "888888" && code.trim() !== "123456") {
        setError("验证码错误，演示环境请输入 888888 或 123456")
        return
      }
    }
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-4 pb-8">
        <h3 className="text-base font-semibold">{INBOUND_OWNER_VERIFY_DIALOG.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          {needVerifyCode
            ? INBOUND_OWNER_VERIFY_DIALOG.descriptionSmsRequiredUser
            : INBOUND_OWNER_VERIFY_DIALOG.description}
        </p>
        {needVerifyCode && INBOUND_OWNER_VERIFY_DIALOG.descriptionSmsRequiredSpec ? (
          <div className="mt-2">
            <PrototypeSpecCallout>
              {INBOUND_OWNER_VERIFY_DIALOG.descriptionSmsRequiredSpec}
            </PrototypeSpecCallout>
          </div>
        ) : null}
        <dl className="mt-3 space-y-2 rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">{INBOUND_OWNER_VERIFY_DIALOG.ownerType}</dt>
            <dd className="font-medium text-gray-900">{inboundOwnerTypeDisplay(ownerType)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">{INBOUND_OWNER_VERIFY_DIALOG.ownerName}</dt>
            <dd className="text-right font-medium text-gray-900">{ownerName || "——"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-gray-500">{INBOUND_OWNER_VERIFY_DIALOG.ownerIdentifier}</dt>
            <dd className="text-right font-medium text-gray-900">
              {isPersonal ? maskLoginPhone(ownerIdentifier) : ownerIdentifier || "——"}
            </dd>
          </div>
          {isPersonal ? (
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">{INBOUND_OWNER_VERIFY_DIALOG.idCardNo}</dt>
              <dd className="text-right text-gray-900">{maskIdCard(idCardNo)}</dd>
            </div>
          ) : (
            <div className="flex justify-between gap-3">
              <dt className="text-gray-500">{INBOUND_OWNER_VERIFY_DIALOG.contactPhone}</dt>
              <dd className="text-right text-gray-900">
                {contactPhone ? maskLoginPhone(contactPhone) : "——"}
              </dd>
            </div>
          )}
        </dl>

        {!needVerifyCode ? (
          <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/80 p-2 text-[11px] leading-relaxed text-emerald-800">
            {INBOUND_OWNER_VERIFY_DIALOG.existingOwnerHint}
          </p>
        ) : (
          <label className="mt-4 block text-xs text-gray-500">
            {INBOUND_OWNER_VERIFY_DIALOG.smsCode}
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder={INBOUND_OWNER_VERIFY_DIALOG.smsPlaceholder}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
        )}
        {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm"
            onClick={onClose}
          >
            {INBOUND_OWNER_VERIFY_DIALOG.back}
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm text-primary-foreground"
            onClick={handleConfirm}
          >
            {INBOUND_OWNER_VERIFY_DIALOG.confirmNext}
          </button>
        </div>
      </div>
    </div>
  )
}
