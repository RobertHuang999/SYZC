import { useMemo } from "react"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import { implicitRoleForArchiveMenu } from "@prototype/shared/partner-archives/partner-archive-domain"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
  resolveContactPhoneVerified,
} from "../lib/contact-phone-verify"
import {
  type ContactPhoneVerifyStatus,
  type PartnerSubject,
  type RoleType,
  type SubjectType,
} from "../domain/types"
import { PARTNER_ARCHIVE_EMPTY_FILTERS } from "../lib/partner-archive-empty-filters"
import { filterPartnerArchives } from "../lib/list-utils"
import { PARTNER_SELECTOR_DEFAULT_PLACEHOLDER } from "../lib/partner-archive-ui-labels"
import { resolvePartnerIdentityDisplay } from "../lib/partner-archive-rules"
import {
  SearchableNameSelect,
  type SearchableNameSelectItem,
} from "@/shared/components/SearchableNameSelect"

export type PartnerSelectorValue = {
  partnerId: string
  partnerNo: string
  name: string
  idNumber: string
  idNumberMasked: string
  subjectType: PartnerSubject["subjectType"]
  roleType: RoleType
  roleStatus: PartnerSubject["roles"][number]["roleStatus"]
  subjectStatus: PartnerSubject["status"]
  contactPhoneVerified: ContactPhoneVerifyStatus
}

type PartnerArchiveSelectorProps = {
  /** 6.3 档案域硬过滤（G12）；与 roleType 二选一或组合，域优先推导隐式角色 */
  archiveMenu?: PartnerArchiveMenuLabel
  roleType?: RoleType
  /** 按货主类型过滤企业 / 个人，与入库发起搜索框口径一致 */
  subjectType?: SubjectType
  value?: string
  onChange: (payload: PartnerSelectorValue | null) => void
  placeholder?: string
  className?: string
}

/** 字段清单 §5.2：默认过滤主体正常且引用角色正常；6.3 叠加 archiveMenu 域隔离 */
function toSelectablePartners(
  roleType: RoleType,
  archiveMenu?: PartnerArchiveMenuLabel,
  subjectType?: SubjectType,
): PartnerSubject[] {
  let list = partnerArchivesMock.filter(
    (item) =>
      item.status === "NORMAL" &&
      (!subjectType || item.subjectType === subjectType) &&
      item.roles.some(
        (role) => role.roleType === roleType && role.roleStatus === "NORMAL",
      ),
  )
  if (archiveMenu) {
    list = filterPartnerArchives(list, PARTNER_ARCHIVE_EMPTY_FILTERS, archiveMenu)
  }
  return list
}

function toPayload(item: PartnerSubject, roleType: RoleType): PartnerSelectorValue {
  const role = item.roles.find((r) => r.roleType === roleType)!
  return {
    partnerId: item.id,
    partnerNo: item.partnerNo,
    name: item.name,
    idNumber: item.idNumber,
    idNumberMasked: item.idNumberMasked,
    subjectType: item.subjectType,
    roleType,
    roleStatus: role.roleStatus,
    subjectStatus: item.status,
    contactPhoneVerified: resolveContactPhoneVerified(item),
  }
}

export function PartnerArchiveSelector({
  archiveMenu,
  roleType: roleTypeProp,
  subjectType,
  value,
  onChange,
  placeholder = PARTNER_SELECTOR_DEFAULT_PLACEHOLDER,
}: PartnerArchiveSelectorProps) {
  const roleType: RoleType =
    roleTypeProp ??
    (archiveMenu
      ? (implicitRoleForArchiveMenu(archiveMenu) as RoleType)
      : "OWNER")

  const options = useMemo(
    () => toSelectablePartners(roleType, archiveMenu, subjectType),
    [roleType, archiveMenu, subjectType],
  )

  const selected = options.find((row) => row.id === value)

  const items = useMemo((): SearchableNameSelectItem[] => {
    return options.map((item) => {
      const verified = resolveContactPhoneVerified(item)
      const identity = resolvePartnerIdentityDisplay(item)
      const description =
        item.subjectType === "INDIVIDUAL"
          ? `手机:${identity}`
          : `税号:${identity}`
      return {
        id: item.id,
        name: item.name,
        kind: item.subjectType === "INDIVIDUAL" ? "personal" : "enterprise",
        description,
        extraBadges: [
          {
            label: CONTACT_PHONE_VERIFY_LABELS[verified],
            className: CONTACT_PHONE_VERIFY_BADGE_CLASS[verified],
          },
        ],
      }
    })
  }, [options])

  return (
    <SearchableNameSelect
      valueId={value}
      valueName={selected?.name ?? ""}
      placeholder={placeholder}
      catalogTitle={archiveMenu ? `系统${archiveMenu}档案库候选` : "系统货主档案库候选"}
      emptyHint="未找到匹配档案，可点右侧快捷建档"
      items={items}
      onPick={(item) => {
        const row = options.find((opt) => opt.id === item.id)
        if (!row) {
          onChange(null)
          return
        }
        onChange(toPayload(row, roleType))
      }}
    />
  )
}
