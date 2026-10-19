import { useEffect, useMemo, useState } from "react"
import {
  ROLE_STATUS_LABELS,
  ROLE_TYPE_LABELS,
  type PartnerSubject,
  type RoleType,
} from "@prototype/B端PC/src/features/partner-archives/domain/types"
import { partnerArchivesMock } from "@prototype/B端PC/src/features/partner-archives/mock/partner-archives.mock"
import {
  findOwnerAddressConflict,
  ownerAddressConflictMessage,
  rolesAllowedForSubjectType,
} from "@prototype/B端PC/src/features/partner-archives/lib/partner-archive-rules"

type PartnerAppendRoleSheetProps = {
  partner: PartnerSubject | null
  open: boolean
  onClose: () => void
  onConfirm: (roleTypes: RoleType[]) => void
}

export function PartnerAppendRoleSheet({
  partner,
  open,
  onClose,
  onConfirm,
}: PartnerAppendRoleSheetProps) {
  const availableRoles = useMemo(() => {
    if (!partner) {
      return [] as RoleType[]
    }
    const existing = new Set(partner.roles.map((r) => r.roleType))
    return rolesAllowedForSubjectType(partner.subjectType).filter((r) => !existing.has(r))
  }, [partner])

  const [selected, setSelected] = useState<RoleType[]>([])

  useEffect(() => {
    if (open) {
      setSelected([])
    }
  }, [open, partner?.id])

  const ownerAddressMissing = Boolean(
    partner &&
      selected.includes("OWNER") &&
      partner.subjectType === "INDIVIDUAL" &&
      !partner.certAddress.fullAddress.trim(),
  )

  const ownerAddressConflict = useMemo(() => {
    if (!partner || !selected.includes("OWNER")) {
      return false
    }
    if (!partner.certAddress.fullAddress.trim()) {
      return false
    }
    return Boolean(
      findOwnerAddressConflict(
        partnerArchivesMock,
        partner.certAddress.fullAddress,
        partner.subjectType,
        partner.id,
      ),
    )
  }, [partner, selected])

  if (!open || !partner) {
    return null
  }

  const toggle = (role: RoleType) => {
    setSelected((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )
  }

  const canSubmit = selected.length > 0 && !ownerAddressConflict

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button type="button" className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="relative rounded-t-2xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="text-base font-semibold text-gray-900">追加业务角色</p>
          <p className="mt-1 text-xs text-gray-500">
            为主体「{partner.name}」追加合作角色；可多选。追加货主时个人与企业均校 P02 地址唯一；地址必填 P01 仅在档案保存时生效。
          </p>
        </div>
        <div className="space-y-2 px-4 py-3">
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm">
            <div className="text-xs text-gray-500">已有业务角色</div>
            <div className="mt-1 font-medium leading-relaxed text-gray-900">
              {partner.roles.length > 0
                ? partner.roles
                    .map(
                      (role) =>
                        `${ROLE_TYPE_LABELS[role.roleType]}·${ROLE_STATUS_LABELS[role.roleStatus]}`,
                    )
                    .join("、")
                : "——"}
            </div>
          </div>
          {availableRoles.length === 0 ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              该主体在当前类型下已挂接全部可用业务角色，无需再次追加。
            </p>
          ) : (
            <>
              <p className="text-xs font-medium text-gray-700">
                追加业务角色<span className="text-red-500"> *</span>
              </p>
              {availableRoles.map((role) => {
              const active = selected.includes(role)
              return (
                <button
                  key={role}
                  type="button"
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm ${
                    active
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-gray-200 bg-white text-gray-800"
                  }`}
                  onClick={() => toggle(role)}
                >
                  {ROLE_TYPE_LABELS[role]}
                  <span
                    className={`size-4 rounded-full border ${
                      active ? "border-blue-600 bg-blue-600" : "border-gray-300"
                    }`}
                  />
                </button>
              )
            })}
            </>
          )}
          {ownerAddressMissing ? (
            <p className="text-xs text-amber-700">追加货主前请先补全证件登记地址。</p>
          ) : null}
          {ownerAddressConflict ? (
            <p className="text-xs text-red-600">
              {ownerAddressConflictMessage(partner.subjectType)}（无法追加货主角色）
            </p>
          ) : null}
        </div>
        <div className="flex gap-3 border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            onClick={() => onConfirm(selected)}
          >
            确认追加
          </button>
        </div>
      </div>
    </div>
  )
}
