import { useEffect, useState } from "react"
import { ShieldCheck } from "lucide-react"
import {
  ROLE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
  type RoleType,
  type SubjectType,
} from "@prototype/B端PC/src/features/partner-archives/domain/types"
import { partnerVerifyDialogCopy } from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-ui-labels"
import { maskLoginPhone } from "@prototype/B端PC/src/features/partner-archives/lib/detail-utils"
import { PrototypeSpecCallout } from "@prototype/B端PC/src/components/form/PrototypeSpecCallout"

const DEFAULT_MOCK_CODE = "888888"

function maskIdNumber(idNumber: string): string {
  if (idNumber.length !== 18) return idNumber
  return `${idNumber.slice(0, 6)}********${idNumber.slice(-4)}`
}

export type PartnerVerifySheetProps = {
  open: boolean
  subjectType: SubjectType
  name: string
  idNumber: string
  contactPhone: string
  fullAddress: string
  roles?: RoleType[]
  mode?: "CREATE" | "CHANGE_PHONE" | "VERIFY_CONTACT"
  verifyContext?: "CREATE_ARCHIVE" | "DETAIL_VERIFY" | "INBOUND_CREATE" | "INBOUND_SUBMIT"
  agentName?: string
  oldPhone?: string
  onClose: () => void
  onConfirm: () => void
}

export function PartnerVerifySheet({
  open,
  subjectType,
  name,
  idNumber,
  contactPhone,
  fullAddress,
  roles = [],
  mode = "CREATE",
  verifyContext = "CREATE_ARCHIVE",
  agentName,
  oldPhone,
  onClose,
  onConfirm,
}: PartnerVerifySheetProps) {
  const [code, setCode] = useState("")
  const [codeError, setCodeError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (open) {
      setCode("")
      setCodeError(null)
      setCountdown(60)
    }
  }, [open])

  useEffect(() => {
    if (!open || countdown <= 0) return
    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [open, countdown])

  if (!open) return null

  const title =
    mode === "CHANGE_PHONE"
      ? "修改联系手机身份确认"
      : verifyContext === "INBOUND_CREATE" || verifyContext === "INBOUND_SUBMIT"
        ? "货主身份信息确认"
        : mode === "VERIFY_CONTACT"
          ? "验证联系手机"
          : "合作方身份信息确认"

  const dialogCopy = partnerVerifyDialogCopy(mode, verifyContext)

  const confirmLabel =
    mode === "CHANGE_PHONE"
      ? "确认修改并生效"
      : mode === "VERIFY_CONTACT"
        ? verifyContext === "DETAIL_VERIFY"
          ? "确认验证"
          : "确认验证并建档"
        : "确认建档并生效"

  const handleSubmit = () => {
    if (!code.trim()) {
      setCodeError("请输入短信验证码")
      return
    }
    if (code.trim().length !== 6 || !/^\d{6}$/.test(code.trim())) {
      setCodeError("请输入 6 位纯数字验证码")
      return
    }
    setCodeError(null)
    onConfirm()
  }

  const maskedPhone = maskLoginPhone(contactPhone)
  const maskedId = maskIdNumber(idNumber)

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button type="button" className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-blue-600" />
            <p className="text-base font-semibold text-gray-900">{title}</p>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{dialogCopy.user}</p>
          {dialogCopy.spec ? (
            <div className="mt-2">
              <PrototypeSpecCallout>{dialogCopy.spec}</PrototypeSpecCallout>
            </div>
          ) : null}
        </div>

        <div className="space-y-3 px-4 py-3 text-xs">
          <div className="rounded-lg border border-gray-100 bg-gray-50/90 p-3 space-y-2">
            <div className="flex justify-between gap-2">
              <span className="text-gray-500">主体类型</span>
              <span className="font-medium text-gray-900">{SUBJECT_TYPE_LABELS[subjectType]}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-500">主体名称</span>
              <span className="text-right font-medium text-gray-900">{name}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-500">
                {subjectType === "INDIVIDUAL" ? "身份证号" : "统一信用代码"}
              </span>
              <span className="font-medium text-gray-900">{maskedId}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-500">
                {mode === "CHANGE_PHONE"
                  ? subjectType === "INDIVIDUAL"
                    ? "新手机号"
                    : "新联系电话"
                  : subjectType === "INDIVIDUAL"
                    ? "业务手机"
                    : "经办人手机"}
              </span>
              <span className="font-medium text-gray-900">
                {maskedPhone}
                {mode === "CHANGE_PHONE" && oldPhone ? (
                  <span className="ml-1 text-[10px] text-gray-400">
                    (原: {maskLoginPhone(oldPhone)})
                  </span>
                ) : null}
              </span>
            </div>
            {subjectType === "ENTERPRISE" && agentName ? (
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">经办人姓名</span>
                <span className="font-medium text-gray-900">{agentName}</span>
              </div>
            ) : null}
            {fullAddress.trim() ? (
              <div>
                <span className="text-gray-500">证件登记地址：</span>
                <span className="font-medium text-gray-900">{fullAddress}</span>
              </div>
            ) : null}
            {roles.length > 0 ? (
              <div className="flex flex-wrap gap-1 border-t border-gray-200/80 pt-2">
                <span className="text-gray-500">业务角色：</span>
                {roles.map((r) => (
                  <span
                    key={r}
                    className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px]"
                  >
                    {ROLE_TYPE_LABELS[r]}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700">
                短信验证码<span className="text-red-500"> *</span>
              </span>
              <span className="text-gray-400">
                已发送至 <span className="text-gray-700">{maskedPhone}</span>
              </span>
            </div>
            <div className="mt-2 flex gap-2">
              <input
                className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm tracking-widest outline-none focus:border-blue-500"
                inputMode="numeric"
                maxLength={6}
                placeholder={`6 位验证码（演示：${DEFAULT_MOCK_CODE}）`}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ""))
                  setCodeError(null)
                }}
              />
              <button
                type="button"
                disabled={countdown > 0}
                className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 disabled:opacity-40"
                onClick={() => setCountdown(60)}
              >
                {countdown > 0 ? `${countdown}s` : "重新获取"}
              </button>
            </div>
            {codeError ? <p className="mt-1 text-xs text-red-600">{codeError}</p> : null}
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm"
            onClick={onClose}
          >
            返回修改
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white"
            onClick={handleSubmit}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
