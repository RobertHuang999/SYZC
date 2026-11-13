import { useEffect, useMemo, useRef, useState } from "react"
import { Building2, Check, ChevronsUpDown, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OwnerType } from "../domain/form-types"
import {
  filterOwnerSearchRecords,
  findOwnerSearchRecord,
  getOwnerSearchCatalog,
  type OwnerSearchRecord,
} from "../mock/inbound-form.mock"
import { INBOUND_OWNER_FORM_PLACEHOLDERS } from "@prototype/shared/inbound/owner-ui-labels"
import {
  CONTACT_PHONE_VERIFY_BADGE_CLASS,
  CONTACT_PHONE_VERIFY_LABELS,
} from "@prototype/B端PC/src/features/partner-archives/lib/contact-phone-verify"

function maskIdCardNo(idCard?: string): string {
  if (!idCard) return ""
  if (idCard.includes("*")) return idCard
  if (idCard.length >= 10) {
    return `${idCard.slice(0, 6)}****${idCard.slice(-4)}`
  }
  return idCard
}

export type OwnerNameSelection = {
  ownerName: string
  ownerType?: OwnerType
  ownerIdentifier?: string
  contactPhone?: string
  idCardNo?: string
  isNewOwner?: boolean
  partnerId?: string
  contactPhoneVerified?: OwnerSearchRecord["contactPhoneVerified"]
}

type Props = {
  ownerType: OwnerType | ""
  ownerName: string
  disabled?: boolean
  onSelect: (value: OwnerNameSelection) => void
  onQuickAdd?: () => void
}

export function OwnerNameSearchSelectMobile({
  ownerType,
  ownerName,
  disabled,
  onSelect,
  onQuickAdd,
}: Props) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState(ownerName)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setKeyword(ownerName)
  }, [ownerName])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const options = useMemo(
    () => filterOwnerSearchRecords(ownerType, keyword),
    [ownerType, keyword]
  )

  const handleSelectRecord = (record: OwnerSearchRecord) => {
    setKeyword(record.name)
    onSelect({
      ownerName: record.name.trim(),
      ownerType: record.ownerType,
      ownerIdentifier: record.ownerIdentifier,
      contactPhone: record.contactPhone ?? record.ownerIdentifier,
      idCardNo: record.idCardNo ?? "",
      isNewOwner: false,
      partnerId: record.partnerId ?? "",
      contactPhoneVerified: record.contactPhoneVerified,
    })
    setOpen(false)
  }

  const handleInputChange = (val: string) => {
    setKeyword(val)
    setOpen(true)

    const exactMatch = getOwnerSearchCatalog().find(
      (r) =>
        (!ownerType || r.ownerType === ownerType) &&
        r.name.trim().toLowerCase() === val.trim().toLowerCase()
    )

    if (exactMatch) {
      onSelect({
        ownerName: exactMatch.name,
        ownerType: exactMatch.ownerType,
        ownerIdentifier: exactMatch.ownerIdentifier,
        contactPhone: exactMatch.contactPhone ?? exactMatch.ownerIdentifier,
        idCardNo: exactMatch.idCardNo ?? "",
        isNewOwner: false,
        partnerId: exactMatch.partnerId ?? "",
        contactPhoneVerified: exactMatch.contactPhoneVerified,
      })
      return
    }

    const fallbackType = ownerType || "企业货主"
    if (!val.trim()) {
      onSelect({
        ownerName: "",
        ownerType: fallbackType,
        ownerIdentifier: "",
        contactPhone: "",
        idCardNo: "",
        isNewOwner: false,
        partnerId: "",
      })
      return
    }

    onSelect({
      ownerName: val,
      ownerType: fallbackType,
      isNewOwner: false,
      partnerId: "",
      ownerIdentifier: "",
      contactPhone: "",
      idCardNo: "",
    })
  }

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <div className="relative w-full">
        <input
          value={keyword}
          disabled={disabled}
          placeholder={INBOUND_OWNER_FORM_PLACEHOLDERS.ownerNameSearch}
          className="min-w-0 w-full bg-transparent pr-6 text-right text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30 disabled:text-[#232D39]/50"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (!disabled) setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && options.length > 0) {
              e.preventDefault()
              handleSelectRecord(options[0])
            }
          }}
          onBlur={() => {
            window.setTimeout(() => {
              const archive = findOwnerSearchRecord(ownerType, keyword)
              if (archive) handleSelectRecord(archive)
            }, 150)
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-[#232D39]/40"
          onClick={() => {
            if (!disabled) setOpen((prev) => !prev)
          }}
        >
          <ChevronsUpDown className="size-3.5" />
        </button>
      </div>

      {open && !disabled ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-hidden rounded-lg border border-[#232D39]/10 bg-white text-[#232D39] shadow-lg">
          <div className="flex items-center justify-between border-b border-[#232D39]/10 bg-[#232D39]/[0.03] px-3 py-2 text-[11px] text-[#232D39]/60">
            <span>
              {ownerType ? `系统${ownerType}档案库候选` : "系统货主档案库候选"}
            </span>
            <span className="text-[10px]">{options.length} 个匹配</span>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {options.length === 0 ? (
              <li className="space-y-2 px-3 py-4 text-center text-xs text-[#232D39]/60">
                <p>未找到匹配货主</p>
                {onQuickAdd && keyword.trim() ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-blue-600"
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setOpen(false)
                      onQuickAdd()
                    }}
                  >
                    + 添加货主
                  </button>
                ) : null}
              </li>
            ) : (
              options.map((record) => {
                const selected = ownerName === record.name
                return (
                  <li key={record.id}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left",
                        selected ? "bg-blue-50/80" : "active:bg-[#232D39]/5"
                      )}
                      onPointerDown={(event) => event.preventDefault()}
                      onClick={() => handleSelectRecord(record)}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {record.ownerType === "企业货主" ? (
                          <Building2 className="size-3.5 shrink-0 text-blue-600" />
                        ) : (
                          <User className="size-3.5 shrink-0 text-amber-600" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-sm font-medium text-[#232D39]">
                              {record.name}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 rounded border px-1 text-[10px] font-normal",
                                record.ownerType === "企业货主"
                                  ? "border-blue-200 bg-blue-50 text-blue-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700"
                              )}
                            >
                              {record.ownerType === "企业货主" ? "企业" : "个人"}
                            </span>
                            {record.contactPhoneVerified ? (
                              <span
                                className={cn(
                                  "shrink-0 rounded border px-1 py-0.5 text-[10px] font-normal",
                                  CONTACT_PHONE_VERIFY_BADGE_CLASS[
                                    record.contactPhoneVerified
                                  ]
                                )}
                              >
                                {
                                  CONTACT_PHONE_VERIFY_LABELS[
                                    record.contactPhoneVerified
                                  ]
                                }
                              </span>
                            ) : null}
                          </div>
                          <p className="truncate text-[11px] text-[#232D39]/50">
                            {record.ownerType === "个人货主"
                              ? `手机:${record.identifierMasked} · 身份证:${record.idCardMasked || maskIdCardNo(record.idCardNo) || "无"}`
                              : `税号:${record.identifierMasked}`}
                          </p>
                        </div>
                      </div>
                      {selected ? (
                        <Check className="size-4 shrink-0 text-blue-600" />
                      ) : null}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
