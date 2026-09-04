import { Copy } from "lucide-react"
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
  onRetryPassword?: () => void
}

function canShowPassword(apply: UnlockApply): boolean {
  const { credential, status } = apply
  return (
    status === "APPROVED" &&
    credential.status === "DELIVERED" &&
    !!credential.password
  )
}

function canRetryPassword(apply: UnlockApply): boolean {
  const { status } = apply.credential
  return apply.status === "APPROVED" && status === "GEN_FAILED"
}

function isPasswordInvalid(apply: UnlockApply): boolean {
  const { status } = apply.credential
  return status === "EXPIRED" || status === "SUPERSEDED"
}

export function CredentialSection({
  apply,
  onCopyPassword,
  onRetryPassword,
}: CredentialSectionProps) {
  const { credential } = apply
  const showPassword = canShowPassword(apply)
  const showRetry = canRetryPassword(apply)
  const passwordInvalid = isPasswordInvalid(apply)
  const failReason = credential.genFailReason

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
        </DetailField>
      )}

      {failReason && credential.status === "GEN_FAILED" && (
        <DetailField label="失败原因">{failReason}</DetailField>
      )}

      {showPassword && credential.password && (
        <DetailField label="临时密码">
          <div className="space-y-2 rounded-lg border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-semibold tracking-[0.25em]">
                {credential.passwordMasked ?? credential.password}
              </span>
              {credential.status === "DELIVERED" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCopyPassword}
                >
                  <Copy className="size-3.5" />
                  复制
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              密码仅页面展示，关闭详情后清除
            </p>
          </div>
        </DetailField>
      )}

      {showRetry && (
        <DetailField label="操作">
          <Button type="button" variant="outline" size="sm" onClick={onRetryPassword}>
            重新获取密码
          </Button>
        </DetailField>
      )}

      {passwordInvalid && (
        <DetailField label="失效提示">
          <span className="text-muted-foreground">
            {credential.invalidReason ??
              (credential.status === "SUPERSEDED"
                ? "设备密码已被更新，原密码已失效"
                : "凭证已过期，无法查看密码")}
          </span>
        </DetailField>
      )}
    </DetailSection>
  )
}
