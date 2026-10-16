import { SUBJECT_STATUS_LABELS } from "../domain/actions"
import type { PartnerArchiveFilters, PartnerSubject } from "../domain/types"
import {
  CONTACT_PHONE_VERIFY_LABELS,
  resolveContactPhoneVerified,
} from "./contact-phone-verify"
import {
  ROLE_STATUS_LABELS,
  ROLE_TYPE_LABELS,
  SOURCE_TYPE_LABELS,
  SUBJECT_TYPE_LABELS,
} from "../domain/types"

function toRangeBound(value: string, bound: "start" | "end") {
  const trimmed = value.trim()
  if (!trimmed) {
    return ""
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return bound === "end" ? `${trimmed} 23:59:59` : `${trimmed} 00:00:00`
  }
  return toComparableDateTime(trimmed)
}

function toComparableDateTime(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return ""
  }
  if (trimmed.includes("T")) {
    const [datePart, timePart = "00:00:00"] = trimmed.split("T")
    const time =
      timePart.length === 5 ? `${timePart}:00` : timePart.padEnd(8, "0").slice(0, 8)
    return `${datePart} ${time}`
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed} 00:00:00`
  }
  return trimmed
}

function matchesCreateTimeRange(
  createTime: string,
  createTimeStart: string,
  createTimeEnd: string
) {
  if (!createTimeStart && !createTimeEnd) {
    return true
  }
  const current = toComparableDateTime(createTime)
  const start = toRangeBound(createTimeStart, "start")
  const end = toRangeBound(createTimeEnd, "end")
  if (start && current < start) {
    return false
  }
  if (end && current > end) {
    return false
  }
  return true
}

function isAll(value: string) {
  return !value || value === "全部"
}

export function filterPartnerArchives(
  list: PartnerSubject[],
  filters: PartnerArchiveFilters
) {
  let result = [...list]

  if (filters.keyword.trim()) {
    const keyword = filters.keyword.trim().toLowerCase()
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.idNumber.toLowerCase().includes(keyword)
    )
  }

  if (filters.contactPhone.trim()) {
    const phone = filters.contactPhone.trim()
    result = result.filter((item) => item.contactPhone.trim() === phone)
  }

  if (!isAll(filters.contactPhoneVerified)) {
    result = result.filter(
      (item) =>
        CONTACT_PHONE_VERIFY_LABELS[resolveContactPhoneVerified(item)] ===
        filters.contactPhoneVerified
    )
  }

  if (!isAll(filters.subjectType)) {
    result = result.filter(
      (item) => SUBJECT_TYPE_LABELS[item.subjectType] === filters.subjectType
    )
  }

  if (!isAll(filters.roleType)) {
    result = result.filter((item) =>
      item.roles.some((role) => ROLE_TYPE_LABELS[role.roleType] === filters.roleType)
    )
  }

  if (!isAll(filters.subjectStatus)) {
    result = result.filter(
      (item) => SUBJECT_STATUS_LABELS[item.status] === filters.subjectStatus
    )
  }

  if (!isAll(filters.roleStatus)) {
    result = result.filter((item) =>
      item.roles.some(
        (role) => ROLE_STATUS_LABELS[role.roleStatus] === filters.roleStatus
      )
    )
  }

  if (!isAll(filters.source)) {
    result = result.filter(
      (item) => SOURCE_TYPE_LABELS[item.source] === filters.source
    )
  }

  result = result.filter((item) =>
    matchesCreateTimeRange(item.createTime, filters.createTimeStart, filters.createTimeEnd)
  )

  result.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "NORMAL" ? -1 : 1
    }
    const dateCompare = b.createDate.localeCompare(a.createDate)
    if (dateCompare !== 0) {
      return dateCompare
    }
    return b.createTime.localeCompare(a.createTime)
  })

  return result
}

export function paginatePartnerArchives<T>(list: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return list.slice(start, start + pageSize)
}
