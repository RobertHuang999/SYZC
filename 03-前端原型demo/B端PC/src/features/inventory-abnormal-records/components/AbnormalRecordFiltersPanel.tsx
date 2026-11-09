import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { Input } from "@/components/ui/input"
import {
  ORDER_TYPE_OPTIONS,
  ABNORMAL_TYPE_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "../domain/constants"
import type { AbnormalRecordFilters, AbnormalOrderTypeLabel, AbnormalTypeLabel } from "../domain/types"

interface AbnormalRecordFiltersPanelProps {
  filters: AbnormalRecordFilters
  onChange: (filters: AbnormalRecordFilters) => void
  onSearch: () => void
  onReset: () => void
  onExport: () => void
  onAdd: () => void
}

export function AbnormalRecordFiltersPanel({
  filters,
  onChange,
  onSearch,
  onReset,
  onExport,
  onAdd,
}: AbnormalRecordFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateField = <K extends keyof AbnormalRecordFilters>(
    field: K,
    value: AbnormalRecordFilters[K]
  ) => {
    onChange({
      ...filters,
      [field]: value,
    })
  }

  const toggleOrderType = (type: AbnormalOrderTypeLabel) => {
    const next = filters.orderTypes.includes(type)
      ? filters.orderTypes.filter((t) => t !== type)
      : [...filters.orderTypes, type]
    updateField("orderTypes", next)
  }

  const toggleAbnormalType = (type: AbnormalTypeLabel) => {
    const next = filters.abnormalTypes.includes(type)
      ? filters.abnormalTypes.filter((t) => t !== type)
      : [...filters.abnormalTypes, type]
    updateField("abnormalTypes", next)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900">
      <WarningFilterHeader
        expanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onAdd={onAdd}
        addLabel="新增异动"
        extraActions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExport}
            className="cursor-pointer"
          >
            <Download className="mr-1.5 size-4" />
            导出记录
          </Button>
        }
        onReset={onReset}
        onSearch={onSearch}
      />

      {/* 第一行：4列标准网格 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 异动单号 */}
        <div className="space-y-1">
          <label className="text-xs font-normal text-muted-foreground">
            异动单号
          </label>
          <Input
            value={filters.abnormalNo}
            onChange={(e) => updateField("abnormalNo", e.target.value)}
            placeholder="请输入异动单号"
            className="h-9 text-xs"
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>

        {/* 关联单据 */}
        <div className="space-y-1">
          <label className="text-xs font-normal text-muted-foreground">
            关联单据
          </label>
          <Input
            value={filters.relateNo}
            onChange={(e) => updateField("relateNo", e.target.value)}
            placeholder="监管业务单号或入库单号"
            className="h-9 text-xs"
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>

        {/* 单据类型 */}
        <div className="space-y-1">
          <label className="text-xs font-normal text-muted-foreground">
            单据类型
          </label>
          <div className="flex h-9 items-center gap-1 overflow-x-auto rounded-md border border-slate-200 bg-slate-50/50 p-1 dark:border-slate-800 dark:bg-slate-950/50">
            {ORDER_TYPE_OPTIONS.map((type) => {
              const active = filters.orderTypes.includes(type)
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleOrderType(type)}
                  className={`cursor-pointer whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {/* 货主名称/标识 */}
        <div className="space-y-1">
          <label className="text-xs font-normal text-muted-foreground">
            货主名称/标识
          </label>
          <Input
            value={filters.ownerKeyword}
            onChange={(e) => updateField("ownerKeyword", e.target.value)}
            placeholder="请输入货主名称或识别码"
            className="h-9 text-xs"
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </div>
      </div>

      {/* 展开的第二行筛选条件 */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800 animate-in fade-in">
          {/* 异动类型 */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-muted-foreground">
              异动类型
            </label>
            <div className="flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-slate-50/50 p-1 dark:border-slate-800 dark:bg-slate-950/50">
              {ABNORMAL_TYPE_OPTIONS.map((type) => {
                const active = filters.abnormalTypes.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleAbnormalType(type)}
                    className={`cursor-pointer whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                      active
                        ? "bg-primary text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 仓库 */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-muted-foreground">
              仓库/库房
            </label>
            <select
              value={filters.warehouseCascade[0] || ""}
              onChange={(e) => updateField("warehouseCascade", e.target.value ? [e.target.value] : [])}
              className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs shadow-xs focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-800 dark:bg-slate-950"
            >
              <option value="">全部仓库</option>
              {WAREHOUSE_OPTIONS.map((wh) => (
                <option key={wh.value} value={wh.value}>
                  {wh.label}
                </option>
              ))}
            </select>
          </div>

          {/* 货物 */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-muted-foreground">
              货物
            </label>
            <Input
              value={filters.goodsKeyword}
              onChange={(e) => updateField("goodsKeyword", e.target.value)}
              placeholder="请输入货物名称/规格"
              className="h-9 text-xs"
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </div>

          {/* 申请时间 */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-muted-foreground">
              申请时间范围
            </label>
            <div className="flex items-center gap-1">
              <Input
                type="date"
                value={filters.dateRange.startDate}
                onChange={(e) =>
                  updateField("dateRange", { ...filters.dateRange, startDate: e.target.value })
                }
                className="h-9 text-xs"
              />
              <span className="text-slate-400 text-xs">至</span>
              <Input
                type="date"
                value={filters.dateRange.endDate}
                onChange={(e) =>
                  updateField("dateRange", { ...filters.dateRange, endDate: e.target.value })
                }
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

