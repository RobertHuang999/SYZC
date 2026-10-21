import { useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import { implicitRoleForArchiveMenu } from "@prototype/shared/partner-archives/partner-archive-domain"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
  ROLE_STATUS_LABELS,
  ROLE_TYPE_LABELS,
  type ContactPhoneVerifyStatus,
  type PartnerSubject,
  type RoleType,
} from "../domain/types"
import { resolveContactPhoneVerified } from "../lib/contact-phone-verify"
import { PARTNER_ARCHIVE_EMPTY_FILTERS } from "../lib/partner-archive-empty-filters"
import { filterPartnerArchives } from "../lib/list-utils"
import { cn } from "@/lib/utils"
import { PARTNER_SELECTOR_DEFAULT_PLACEHOLDER } from "../lib/partner-archive-ui-labels"

export type PartnerSelectorValue = {
  partnerId: string
  partnerNo: string
  name: string
  idNumberMasked: string
  subjectType: PartnerSubject["subjectType"]
  roleType: RoleType
  roleStatus: PartnerSubject["roles"][number]["roleStatus"]
  subjectStatus: PartnerSubject["status"]
  contactPhoneVerified: ContactPhoneVerifyStatus
}

type PartnerArchiveSelectorProps = {
  /** 6.3 档案域硬过滤（PA-R12）；与 roleType 二选一或组合，域优先推导隐式角色 */
  archiveMenu?: PartnerArchiveMenuLabel
  roleType?: RoleType
  value?: string
  onChange: (payload: PartnerSelectorValue | null) => void
  placeholder?: string
  className?: string
}

/** 字段清单 §5.2：默认过滤主体正常且引用角色正常；6.3 叠加 archiveMenu 域隔离 */
function toSelectablePartners(
  roleType: RoleType,
  archiveMenu?: PartnerArchiveMenuLabel,
): PartnerSubject[] {
  let list = partnerArchivesMock.filter(
    (item) =>
      item.status === "NORMAL" &&
      item.roles.some(
        (role) => role.roleType === roleType && role.roleStatus === "NORMAL",
      ),
  )
  if (archiveMenu) {
    list = filterPartnerArchives(list, PARTNER_ARCHIVE_EMPTY_FILTERS, archiveMenu)
  }
  return list
}

export function PartnerArchiveSelector({
  archiveMenu,
  roleType: roleTypeProp,
  value,
  onChange,
  placeholder = PARTNER_SELECTOR_DEFAULT_PLACEHOLDER,
  className,
}: PartnerArchiveSelectorProps) {
  const roleType: RoleType =
    roleTypeProp ??
    (archiveMenu
      ? (implicitRoleForArchiveMenu(archiveMenu) as RoleType)
      : "OWNER")

  const options = useMemo(
    () => toSelectablePartners(roleType, archiveMenu),
    [roleType, archiveMenu],
  )

  return (
    <Select
      value={value ?? ""}
      onValueChange={(next) => {
        if (!next) {
          onChange(null)
          return
        }
        const item = options.find((row) => row.id === next)
        if (!item) {
          onChange(null)
          return
        }
        const role = item.roles.find((r) => r.roleType === roleType)!
        onChange({
          partnerId: item.id,
          partnerNo: item.partnerNo,
          name: item.name,
          idNumberMasked: item.idNumberMasked,
          subjectType: item.subjectType,
          roleType,
          roleStatus: role.roleStatus,
          subjectStatus: item.status,
          contactPhoneVerified: resolveContactPhoneVerified(item),
        })
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => {
          const role = item.roles.find((r) => r.roleType === roleType)!
          return (
            <SelectItem key={item.id} value={item.id}>
              {item.name} · {item.idNumberMasked} · {ROLE_TYPE_LABELS[roleType]}·
              {ROLE_STATUS_LABELS[role.roleStatus]}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
