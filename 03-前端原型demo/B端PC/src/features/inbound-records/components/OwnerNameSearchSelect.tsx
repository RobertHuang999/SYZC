import { useMemo, useState } from "react"
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { OwnerType } from "../domain/form-types"
import {
  filterOwnerSearchRecords,
  formatOwnerSearchLabel,
  type OwnerSearchRecord,
} from "../mock/inbound-form.mock"

export type OwnerNameSelection = {
  ownerName: string
  ownerIdentifier: string
  contactPhone: string
  idCardNo: string
  isNewOwner: boolean
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
  ownerIdentifier,
  disabled,
  onSelect,
}: OwnerNameSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState("")

  const options = useMemo(
    () => filterOwnerSearchRecords(ownerType, keyword),
    [ownerType, keyword]
  )

  const displayLabel =
    ownerName.trim().length > 0
      ? formatOwnerSearchLabel(ownerName, ownerIdentifier)
      : ""

  const applyRecord = (record: OwnerSearchRecord) => {
    onSelect({
      ownerName: record.name,
      ownerIdentifier: record.identifierMasked,
      contactPhone: record.contactPhone ?? record.identifierMasked,
      idCardNo: record.idCardNo ?? "",
      isNewOwner: false,
    })
    setOpen(false)
    setKeyword("")
  }

  const applyNewOwner = () => {
    const name = keyword.trim()
    if (!name) return
    onSelect({
      ownerName: name,
      ownerIdentifier: "",
      contactPhone: "",
      idCardNo: "",
      isNewOwner: true,
    })
    setOpen(false)
    setKeyword("")
  }

  const placeholder =
    ownerType === "企业货主" ? "请输入公司全称" : "请输入货主名称"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        disabled={disabled || !ownerType}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm",
          "ring-offset-background hover:border-accent-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          (disabled || !ownerType) && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            displayLabel ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {displayLabel || placeholder}
        </span>
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <div className="border-b p-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={placeholder}
              className="h-8 pl-8 text-sm"
            />
          </div>
        </div>
        <ul className="max-h-56 overflow-y-auto py-1">
          {options.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">无匹配货主</li>
          ) : (
            options.map((record) => {
              const label = formatOwnerSearchLabel(
                record.name,
                record.identifierMasked
              )
              const selected =
                ownerName === record.name &&
                ownerIdentifier === record.identifierMasked
              return (
                <li key={record.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted/60",
                      selected && "bg-primary/5 text-primary"
                    )}
                    onClick={() => applyRecord(record)}
                  >
                    <CheckIcon
                      className={cn(
                        "size-4 shrink-0",
                        selected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{label}</span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
        {keyword.trim().length > 0 &&
        !options.some((item) => item.name === keyword.trim()) ? (
          <div className="border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start text-primary"
              onClick={applyNewOwner}
            >
              使用「{keyword.trim()}」作为新货主
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
