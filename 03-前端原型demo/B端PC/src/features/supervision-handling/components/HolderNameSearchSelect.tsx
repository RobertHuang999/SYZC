import { useEffect, useMemo, useRef, useState } from "react"
import { Building2, CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import { implicitRoleForArchiveMenu } from "@prototype/shared/partner-archives/partner-archive-domain"
import { partnerArchivesMock } from "@/features/partner-archives/mock/partner-archives.mock"
import { filterPartnerArchives } from "@/features/partner-archives/lib/list-utils"
import { PARTNER_ARCHIVE_EMPTY_FILTERS } from "@/features/partner-archives/lib/partner-archive-empty-filters"
import type { PartnerSelectorValue } from "@/features/partner-archives/components/PartnerArchiveSelector"
import { resolveContactPhoneVerified } from "@/features/partner-archives/lib/contact-phone-verify"

interface HolderNameSearchSelectProps {
  archiveMenu: PartnerArchiveMenuLabel
  selectedId?: string
  selectedName?: string
  placeholder?: string
  onSelect: (payload: PartnerSelectorValue | null) => void
}

function maskPhone(phone?: string): string {
  if (!phone) return ""
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
}

export function HolderNameSearchSelect({
  archiveMenu,
  selectedId,
  selectedName = "",
  placeholder = "请输入企业名称或信用代码搜索",
  onSelect,
}: HolderNameSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState(selectedName)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setKeyword(selectedName)
  }, [selectedName])

  useEffect(() => {
    const onDocMouseDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setKeyword(selectedName)
      }
    }
    document.addEventListener("mousedown", onDocMouseDown)
    return () => document.removeEventListener("mousedown", onDocMouseDown)
  }, [selectedName])

  const implicitRole = implicitRoleForArchiveMenu(archiveMenu)

  const candidates = useMemo(() => {
    const allInDomain = filterPartnerArchives(
      partnerArchivesMock,
      { ...PARTNER_ARCHIVE_EMPTY_FILTERS },
      archiveMenu,
    ).filter(
      (item) =>
        item.status === "NORMAL" &&
        item.subjectType === "ENTERPRISE" &&
        item.roles.some((r) => r.roleType === implicitRole && r.roleStatus === "NORMAL"),
    )

    const kw = keyword.trim().toLowerCase()
    if (!kw || (selectedName && kw === selectedName.toLowerCase())) {
      return allInDomain
    }
    return allInDomain.filter(
      (item) =>
        item.name.toLowerCase().includes(kw) ||
        (item.idNumber && item.idNumber.toLowerCase().includes(kw)) ||
        (item.contactPhone && item.contactPhone.includes(kw)),
    )
  }, [archiveMenu, implicitRole, keyword, selectedName])

  const handleChoose = (item: (typeof partnerArchivesMock)[number]) => {
    const role = item.roles.find((r) => r.roleType === implicitRole)
    if (!role) return
    onSelect({
      partnerId: item.id,
      partnerNo: item.partnerNo,
      name: item.name,
      idNumber: item.idNumber,
      idNumberMasked: item.idNumberMasked,
      subjectType: item.subjectType,
      roleType: implicitRole,
      roleStatus: role.roleStatus,
      subjectStatus: item.status,
      contactPhoneVerified: resolveContactPhoneVerified(item),
    })
    setKeyword(item.name)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          value={keyword}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setKeyword(e.target.value)
            setOpen(true)
          }}
          className="h-9 pr-8 text-sm"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label="展开候选列表"
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <ChevronsUpDownIcon className="size-4" />
        </button>
      </div>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-[280px] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg">
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
            <span>系统{archiveMenu}档案库候选</span>
            <span>{candidates.length} 个匹配</span>
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {candidates.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                未找到匹配的{archiveMenu}档案
              </div>
            ) : (
              candidates.map((item) => {
                const isSelected = selectedId === item.id || selectedName === item.name
                const codeText = item.idNumber || item.idNumberMasked || "暂无信用代码"
                const phoneText = maskPhone(item.contactPhone)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleChoose(item)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent",
                      isSelected && "bg-primary/5",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                      <Building2 className="mt-0.5 size-4 shrink-0 text-blue-600" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="truncate text-sm font-medium text-foreground">
                            {item.name}
                          </span>
                          <span className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-1.5 py-0.2 text-[10px] font-medium text-blue-700">
                            企业
                          </span>
                        </div>
                        <div className="mt-0.5 truncate text-xs text-muted-foreground">
                          信用代码:{codeText}
                          {phoneText ? ` · 手机:${phoneText}` : ""}
                        </div>
                      </div>
                    </div>
                    {isSelected ? <CheckIcon className="size-4 shrink-0 text-primary" /> : null}
                  </button>
                )
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

