import { Copy, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import type { UnlockApply } from "../domain/types"
import { CredentialStatusBadge } from "./CredentialStatusBadge"

type CredentialSectionProps = {
  apply: UnlockApply
  onCopyPassword?: () => void
  onResendSms?: () => void
}

function canShowPassword(apply: UnlockApply): boolean {
  const { credential, status, deviceType } = apply
  if (status !== "APPROVED") return false
  if (credential.status === "DELIVERED") return true
  if (
    deviceType === "挂锁门禁" &&
    credential.status === "DELIVERY_FAILED" &&
    credential.password
  ) {
    return true
  }
  return false
}

function isPasswordInvalid(apply: UnlockApply): boolean {
  const { status } = apply.credential
  return ["EXPIRED", "REVOKED", "SUPERSEDED", "USED"].includes(status)
}

export function CredentialSection({
  apply,
  onCopyPassword,
  onResendSms,
}: CredentialSectionProps) {
  const { credential } = apply
  const showPassword = canShowPassword(apply)
  const passwordInvalid = isPasswordInvalid(apply)

  return (
    <DetailSection title="凭证信息">
      <DetailField label="凭证编号">
        {formatEmptyValue(credential.credentialNo)}
      </DetailField>
      <DetailField label="凭证状态">
        <CredentialStatusBadge status={credential.status} />
      </DetailField>
      {credential.validFrom && credential.validTo && (
        <DetailField label="密码有效期">
          {credential.validFrom.slice(0, 16)} ~ {credential.validTo.slice(0, 16)}
          {apply.deviceType === "挂锁门禁" && (
            <span className="ml-2 text-xs text-muted-foreground">（挂锁默认 3 天）</span>
          )}
        </DetailField>
      )}
      {apply.deviceType === "挂锁门禁" && credential.smsStatus && (
        <DetailField label="短信发送状态">
          <span
            className={
              credential.smsStatus === "发送失败"
                ? "text-destructive"
                : credential.smsStatus === "发送成功"
                ? "text-emerald-600"
                : ""
            }
          >
            {credential.smsStatus}
          </span>
          {credential.smsFailReason && (
            <span className="ml-2 text-xs text-muted-foreground">
              {credential.smsFailReason}
            </span>
          )}
        </DetailField>
      )}

      {credential.status === "GENERATING" && (
        <DetailField label="生成进度">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            正在生成凭证…
          </span>
        </DetailField>
      )}

      {credential.status === "GEN_FAILED" && credential.genFailReason && (
        <DetailField label="失败原因">{credential.genFailReason}</DetailField>
      )}

      {showPassword && credential.password && (
        <DetailField label="临时密码">
          <div className="space-y-2 rounded-lg border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-semibold tracking-[0.25em]">
                {credential.passwordMasked ?? credential.password}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCopyPassword}
              >
                <Copy className="size-3.5" />
                复制
              </Button>
            </div>
            {apply.deviceType === "人脸门禁" && (
              <p className="text-xs text-muted-foreground">
                人脸门禁不下发短信；密码仅页面展示，关闭后清除
              </p>
            )}
          </div>
        </DetailField>
      )}

      {apply.deviceType === "挂锁门禁" &&
        credential.status === "DELIVERY_FAILED" && (
        <DetailField label="操作">
          <Button type="button" variant="outline" size="sm" onClick={onResendSms}>
            重新下发短信
          </Button>
        </DetailField>
      )}

      {passwordInvalid && (
        <DetailField label="失效提示">
          <span className="text-muted-foreground">
            {credential.invalidReason ??
              (credential.status === "SUPERSEDED"
                ? "设备密码已被更新，原密码已失效"
                : "凭证已失效，无法查看密码")}
          </span>
        </DetailField>
      )}
    </DetailSection>
  )
}
