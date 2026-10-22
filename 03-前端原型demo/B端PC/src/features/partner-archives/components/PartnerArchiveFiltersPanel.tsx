import { useState, type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import {
  DEFAULT_PARTNER_ARCHIVE_FILTERS,
  PARTNER_CONTACT_PHONE_VERIFY_FILTER_OPTIONS,
  PARTNER_SUBJECT_TYPE_FILTER_OPTIONS,
  partnerSubjectStatusFilterOptions,
} from "../domain/constants"
import type { PartnerArchiveFilters } from "../domain/types"

type PartnerArchiveFiltersPanelProps = {
  value: PartnerArchiveFilters
  onChange: (value: PartnerArchiveFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
  addLabel?: string
  archiveMenu?: string
}

export function PartnerArchiveFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
  addLabel = "新增合作方",
  archiveMenu,
}: PartnerArchiveFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const subjectStatusOptions = partnerSubjectStatusFilterOptions(archiveMenu)

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onSearch={onSearch}
          onReset={() => {
            onChange({ ...DEFAULT_PARTNER_ARCHIVE_FILTERS })
            onReset()
          }}
          onAdd={onAdd}
          addLabel={addLabel}
        />

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField label="主体名称/身份标识">
            <Input
              placeholder="请输入主体名称或证件号码"
              value={value.keyword}
              onChange={(event) => onChange({ ...value, keyword: event.target.value })}
              onKeyDown={(event) => event.key === "Enter" && onSearch()}
            />
          </FilterField>

          <FilterField label="主体类型">
            <Select
              value={value.subjectType}
              onValueChange={(next) => {
                if (!next) return
                onChange({ ...value, subjectType: next })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARTNER_SUBJECT_TYPE_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "全部" ? "全部主体类型" : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="联系手机核验">
            <Select
              value={value.contactPhoneVerified}
              onValueChange={(next) => {
                if (!next) return
                onChange({ ...value, contactPhoneVerified: next })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARTNER_CONTACT_PHONE_VERIFY_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "全部" ? "全部核验状态" : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="主体状态">
            <Select
              value={value.subjectStatus}
              onValueChange={(next) => {
                if (!next) return
                onChange({ ...value, subjectStatus: next })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjectStatusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "全部" ? "全部主体状态" : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        {expanded && (
          <div className="grid gap-4 border-t pt-4 lg:grid-cols-4">
            <FilterField label="联系手机">
              <Input
                placeholder="11 位手机号精确匹配"
                maxLength={11}
                value={value.contactPhone}
                onChange={(event) =>
                  onChange({ ...value, contactPhone: event.target.value })
                }
                onKeyDown={(event) => event.key === "Enter" && onSearch()}
              />
            </FilterField>

            <FilterField label="创建时间范围">
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={
                    value.createTimeStart
                      ? value.createTimeStart.split(" ")[0].split("T")[0]
                      : ""
                  }
                  aria-label="开始日期"
                  className="h-9 min-w-0 flex-1 px-2 text-xs"
                  onChange={(event) =>
                    onChange({ ...value, createTimeStart: event.target.value })
                  }
                />
                <span className="shrink-0 text-xs text-muted-foreground">至</span>
                <Input
                  type="date"
                  value={
                    value.createTimeEnd
                      ? value.createTimeEnd.split(" ")[0].split("T")[0]
                      : ""
                  }
                  aria-label="结束日期"
                  className="h-9 min-w-0 flex-1 px-2 text-xs"
                  onChange={(event) =>
                    onChange({ ...value, createTimeEnd: event.target.value })
                  }
                />
              </div>
            </FilterField>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FilterField({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}
