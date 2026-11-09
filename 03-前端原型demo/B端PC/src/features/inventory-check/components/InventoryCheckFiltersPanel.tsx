import { useState } from "react"
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
import {
  CHECK_STATUS_MAP,
  CHECK_TYPE_OPTIONS,
  MOCK_WAREHOUSES,
  MOCK_SYSTEM_USERS,
  DEFAULT_CHECK_FILTER_PARAMS,
} from "../domain/constants"
import type { CheckListFilterParams } from "../domain/types"

interface InventoryCheckFiltersPanelProps {
  value: CheckListFilterParams
  onChange: (value: CheckListFilterParams) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function InventoryCheckFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: InventoryCheckFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateField = <K extends keyof CheckListFilterParams>(
    field: K,
    val: CheckListFilterParams[K]
  ) => {
    onChange({
      ...value,
      [field]: val,
    })
  }

  return (
    <Card className="rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          onAdd={onAdd}
          addLabel="新增盘点"
          onReset={onReset}
          onSearch={onSearch}
        />

        {/* 默认首行 4 项高频筛选网格 */}
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. 盘点单号 */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-muted-foreground">
              盘点单号
            </label>
            <Input
              placeholder="请输入盘点单号"
              value={value.checkNo}
              onChange={(e) => updateField("checkNo", e.target.value)}
              className="h-[34px] text-sm"
            />
          </div>

          {/* 2. 任务名称 */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-muted-foreground">
              任务名称
            </label>
            <Input
              placeholder="请输入任务名称"
              value={value.taskName}
              onChange={(e) => updateField("taskName", e.target.value)}
              className="h-[34px] text-sm"
            />
          </div>

          {/* 3. 盘点状态 */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-muted-foreground">
              盘点状态
            </label>
            <Select
              value={value.status}
              onValueChange={(val) => updateField("status", val ?? "ALL")}
            >
              <SelectTrigger className="h-[34px] text-sm">
                <SelectValue>
                  {(val) =>
                    !val || val === "ALL"
                      ? "全部状态"
                      : (CHECK_STATUS_MAP[val as keyof typeof CHECK_STATUS_MAP]?.label ?? String(val))
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部状态</SelectItem>
                {Object.entries(CHECK_STATUS_MAP).map(([key, item]) => (
                  <SelectItem key={key} value={key}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 4. 盘点类型 */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-muted-foreground">
              盘点类型
            </label>
            <Select
              value={value.checkType}
              onValueChange={(val) => updateField("checkType", val ?? "ALL")}
            >
              <SelectTrigger className="h-[34px] text-sm">
                <SelectValue>
                  {(val) =>
                    !val || val === "ALL"
                      ? "全部类型"
                      : (CHECK_TYPE_OPTIONS.find((opt) => opt.value === val)?.label ?? String(val))
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部类型</SelectItem>
                {CHECK_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 展开筛选区域 (6项) */}
        {isExpanded && (
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4 pt-1 border-t border-dashed border-slate-100 dark:border-slate-800">
            {/* 5. 仓库名称 */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">
                仓库名称
              </label>
              <Select
                value={value.warehouseName}
                onValueChange={(val) => updateField("warehouseName", val ?? "ALL")}
              >
                <SelectTrigger className="h-[34px] text-sm">
                  <SelectValue>
                    {(val) => (!val || val === "ALL" ? "全部管辖仓库" : String(val))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部管辖仓库</SelectItem>
                  {MOCK_WAREHOUSES.map((wh) => (
                    <SelectItem key={wh.id} value={wh.name}>
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 6. 盘点结果 */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">
                盘点结果
              </label>
              <Select
                value={value.result}
                onValueChange={(val) => updateField("result", val ?? "ALL")}
              >
                <SelectTrigger className="h-[34px] text-sm">
                  <SelectValue>
                    {(val) =>
                      !val || val === "ALL"
                        ? "全部结果"
                        : val === "NORMAL"
                          ? "正常"
                          : val === "ABNORMAL"
                            ? "异常"
                            : String(val)
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部结果</SelectItem>
                  <SelectItem value="NORMAL">正常</SelectItem>
                  <SelectItem value="ABNORMAL">异常</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 7. 实际盘点人 */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">
                实际盘点人
              </label>
              <Select
                value={value.actualUsers[0] || "ALL"}
                onValueChange={(val) =>
                  updateField("actualUsers", !val || val === "ALL" ? [] : [val])
                }
              >
                <SelectTrigger className="h-[34px] text-sm">
                  <SelectValue>
                    {(val) => (!val || val === "ALL" ? "全部人员" : String(val))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部人员</SelectItem>
                  {MOCK_SYSTEM_USERS.map((u) => (
                    <SelectItem key={u.id} value={u.name}>
                      {u.name} ({u.dept})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 8. 制单人 */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">
                制单人
              </label>
              <Select
                value={value.creator}
                onValueChange={(val) => updateField("creator", val ?? "ALL")}
              >
                <SelectTrigger className="h-[34px] text-sm">
                  <SelectValue>
                    {(val) => (!val || val === "ALL" ? "全部制单人" : String(val))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部制单人</SelectItem>
                  {MOCK_SYSTEM_USERS.map((u) => (
                    <SelectItem key={u.id} value={u.name}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 9. 盘点日期起止 */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-normal text-muted-foreground">
                盘点开始日期范围
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={value.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  className="h-[34px] text-sm"
                />
                <span className="text-xs text-slate-400">至</span>
                <Input
                  type="date"
                  value={value.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                  className="h-[34px] text-sm"
                />
              </div>
            </div>

            {/* 10. 制单时间起止 */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-normal text-muted-foreground">
                制单时间范围
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={value.createdStartTime}
                  onChange={(e) => updateField("createdStartTime", e.target.value)}
                  className="h-[34px] text-sm"
                />
                <span className="text-xs text-slate-400">至</span>
                <Input
                  type="date"
                  value={value.createdEndTime}
                  onChange={(e) => updateField("createdEndTime", e.target.value)}
                  className="h-[34px] text-sm"
                />
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}

