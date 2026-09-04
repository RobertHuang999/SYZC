import type { UnlockApply } from "../domain/types"

function parseValidTo(validTo: string): Date | null {
  const normalized = validTo.trim().replace(" ", "T")
  const withSeconds = normalized.length === 16 ? `${normalized}:00` : normalized
  const date = new Date(withSeconds)
  return Number.isNaN(date.getTime()) ? null : date
}

/** 凭证超过 validTo 时自动视为已过期（仅 DELIVERED → EXPIRED） */
export function withResolvedCredentialExpiry(apply: UnlockApply): UnlockApply {
  const { credential } = apply
  if (credential.status !== "DELIVERED" || !credential.validTo) {
    return apply
  }
  const end = parseValidTo(credential.validTo)
  if (!end || end.getTime() > Date.now()) {
    return apply
  }
  return {
    ...apply,
    credential: {
      ...credential,
      status: "EXPIRED",
      invalidReason: credential.invalidReason ?? "凭证已过期，无法查看密码",
      password: undefined,
    },
  }
}
