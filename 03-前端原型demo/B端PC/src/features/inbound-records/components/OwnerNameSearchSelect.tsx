import { useMemo, useState, useRef, useEffect } from "react"
import { CheckIcon, ChevronsUpDownIcon, User, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { OwnerType } from "../domain/form-types"
import {
  filterOwnerSearchRecords,
  findOwnerSearchRecord,
  OWNER_SEARCH_RECORDS,
  type OwnerSearchRecord,
} from "../mock/inbound-form.mock"

function maskIdCardNo(idCard?: string): string {
  if (!idCard) return ""
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
}

type OwnerNameSearchSelectProps = {
  ownerType: OwnerType | ""
  ownerName: string
  ownerIdentifier: string
  disabled?: boolean
  onSelect: (value: OwnerNameSelection) => void
}

export function OwnerNameSearchSelect({
  ownerType,
  ownerName,
  disabled,
  onSelect,
}: OwnerNameSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState(ownerName)
  const containerRef = useRef<HTMLDivElement>(null)

  // 当外部的 ownerName 变化时同步内部输入框
  useEffect(() => {
    setKeyword(ownerName)
  }, [ownerName])

  // 监听点击外部关闭下拉列表
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
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
    })
    setOpen(false)
  }

  // 用户直接在输入框修改内容
  const handleInputChange = (val: string) => {
    setKeyword(val)
    setOpen(true)

    // 如果用户输入的名字完全精确匹配到某个已有货主，自动反显对应的身份证号和标识
    const exactMatch = OWNER_SEARCH_RECORDS.find(
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
      })
      return
    }

    // 输入过程中仅标记新货主与名称，勿清空已选存量货主带出的标识/身份证号（避免脱敏反显被抹掉）
    onSelect({
      ownerName: val,
      ownerType: fallbackType,
      isNewOwner: true,
    })
  }

  const placeholder =
    ownerType === "企业货主"
      ? "请输入或选择企业全称"
      : ownerType === "个人货主"
      ? "请输入或选择个人货主姓名"
      : "请输入或选择货主名称"

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative w-full">
        <Input
          value={keyword}
          disabled={disabled}
          placeholder={placeholder}
          className="pr-8 text-xs font-medium"
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
              if (archive) {
                handleSelectRecord(archive)
              }
            }, 150)
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100"
          onClick={() => {
            if (!disabled) setOpen((prev) => !prev)
          }}
        >
          <ChevronsUpDownIcon className="size-3.5" />
        </button>
      </div>

      {open && !disabled ? (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full min-w-[280px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="border-b px-3 py-2 text-[11px] font-medium text-muted-foreground flex items-center justify-between bg-muted/30">
            <span>{ownerType ? `系统${ownerType}档案库候选` : "系统货主档案库候选"}</span>
            <span className="text-[10px] text-muted-foreground/80">
              {options.length} 个匹配
            </span>
          </div>

          <ul className="max-h-52 overflow-y-auto py-1 text-xs">
            {options.length === 0 ? (
              <li className="px-3 py-3 text-center text-muted-foreground">
                未找到匹配货主（将作为新货主登记）
              </li>
            ) : (
              options.map((record) => {
                const selected = ownerName === record.name
                return (
                  <li key={record.id}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left hover:bg-muted/70 transition-colors",
                        selected && "bg-primary/10 text-primary font-medium"
                      )}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelectRecord(record)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {record.ownerType === "企业货主" ? (
                          <Building2 className="size-3.5 text-blue-600 shrink-0" />
                        ) : (
                          <User className="size-3.5 text-amber-600 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-medium text-foreground">
                              {record.name}
                            </span>
                            <span
                              className={cn(
                                "rounded px-1 py-0.2 text-[10px] font-normal shrink-0",
                                record.ownerType === "企业货主"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              )}
                            >
                              {record.ownerType === "企业货主" ? "企业" : "个人"}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {record.ownerType === "个人货主"
                              ? `手机:${record.identifierMasked} · 身份证:${maskIdCardNo(record.idCardNo) || "无"}`
                              : `税号:${record.identifierMasked}`}
                          </p>
                        </div>
                      </div>
                      {selected && (
                        <CheckIcon className="size-4 shrink-0 text-primary" />
                      )}
                    </button>
                  </li>
                )
              })
            )}
          </ul>

          {keyword.trim().length > 0 &&
          !options.some((item) => item.name === keyword.trim()) ? (
            <div className="border-t p-2 bg-muted/10">
              <button
                type="button"
                className="w-full text-left px-2 py-1.5 text-xs text-primary hover:underline rounded"
                onClick={() => {
                  const fallbackType = ownerType || "企业货主"
                  onSelect({
                    ownerName: keyword.trim(),
                    ownerType: fallbackType,
                    isNewOwner: true,
                  })
                  setOpen(false)
                }}
              >
                ➕ 使用「<span className="font-semibold">{keyword.trim()}</span>」作为新增货主
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
