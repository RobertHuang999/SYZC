import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  DEFAULT_SUPERVISION_FILTERS,
  type SupervisionTabConfig,
} from "../domain/constants"
import type { SupervisionOrderFilters } from "../domain/types"

interface SupervisionFiltersPanelProps {
  filters: SupervisionOrderFilters
  tabConfig: SupervisionTabConfig
  expanded: boolean
  onToggleExpand: () => void
  onChange: (filters: SupervisionOrderFilters) => void
  onSearch: (next?: SupervisionOrderFilters) => void
}

const inputClass = "h-[34px] text-sm"

function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-normal text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

/** 组合查询筛选区：默认 4 项 + 展开 4 项，草稿态与生效态分离 */
export function SupervisionFiltersPanel({
  filters,
  tabConfig,
  expanded,
  onToggleExpand,
  onChange,
  onSearch,
}: SupervisionFiltersPanelProps) {
  return (
    <PrototypeAnnotationTarget annotationIds={["supervision-management-filter"]}>
      <Card>
        <CardContent className="space-y-4 pt-4">
          <WarningFilterHeader
            expanded={expanded}
            onToggle={onToggleExpand}
            onReset={() => {
              onChange({ ...DEFAULT_SUPERVISION_FILTERS })
              onSearch({ ...DEFAULT_SUPERVISION_FILTERS })
            }}
            onSearch={() => onSearch()}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterField label={tabConfig.orderNoLabel}>
              <Input
                value={filters.orderNo}
                onChange={(event) => onChange({ ...filters, orderNo: event.target.value })}
                placeholder={`请输入${tabConfig.orderNoLabel}`}
                className={inputClass}
              />
            </FilterField>

            <FilterField label="货主名称/标识">
              <Input
                value={filters.ownerKeyword}
                onChange={(event) => onChange({ ...filters, ownerKeyword: event.target.value })}
                placeholder="请输入货主名称/标识"
                className={inputClass}
              />
            </FilterField>

            <FilterField label={tabConfig.statusLabel}>
              <Select
                value={filters.status}
                onValueChange={(value) => onChange({ ...filters, status: value || "全部" })}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-sans">
                  <SelectItem value="全部">全部</SelectItem>
                  {tabConfig.statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>

            <FilterField label={tabConfig.modeLabel}>
              <Select
                value={filters.mode}
                onValueChange={(value) => onChange({ ...filters, mode: value || "全部" })}
              >
                <SelectTrigger className={inputClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="font-sans">
                  <SelectItem value="全部">全部</SelectItem>
                  {tabConfig.modeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>
          </div>

          {expanded ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FilterField label="风险预警">
                <Select
                  value={filters.risk}
                  onValueChange={(value) => onChange({ ...filters, risk: value || "全部" })}
                >
                  <SelectTrigger className={inputClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-sans">
                    <SelectItem value="全部">全部</SelectItem>
                    <SelectItem value="有风险">有风险</SelectItem>
                    <SelectItem value="无风险">无风险</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>

              <FilterField label="货品名称">
                <Input
                  value={filters.goodsName}
                  onChange={(event) => onChange({ ...filters, goodsName: event.target.value })}
                  placeholder="请输入货品名称"
                  className={inputClass}
                />
              </FilterField>

              <FilterField label="流程相关机构">
                <Input
                  value={filters.org}
                  onChange={(event) => onChange({ ...filters, org: event.target.value })}
                  placeholder="请输入流程相关机构"
                  className={inputClass}
                />
              </FilterField>

              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-xs font-normal text-muted-foreground">
                  {tabConfig.key === "MORTGAGE"
                    ? "抵押时间"
                    : tabConfig.key === "PLEDGE"
                      ? "质押时间"
                      : "监管时间"}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filters.dateStart}
                    onChange={(event) =>
                      onChange({ ...filters, dateStart: event.target.value })
                    }
                    className={inputClass}
                    aria-label="开始日期"
                  />
                  <span className="shrink-0 text-xs text-muted-foreground">至</span>
                  <Input
                    type="date"
                    value={filters.dateEnd}
                    onChange={(event) => onChange({ ...filters, dateEnd: event.target.value })}
                    className={inputClass}
                    aria-label="结束日期"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </PrototypeAnnotationTarget>
  )
}
