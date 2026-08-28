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
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import {
  APPROVAL_MODE_OPTIONS,
  DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS,
  GLOBAL_SWITCH_FILTER_OPTIONS,
  SCOPE_TYPE_OPTIONS,
  STATUS_OPTIONS,
} from "../domain/constants"
import type { UnlockApprovalConfigFilters } from "../domain/types"
import { WAREHOUSE_OPTIONS } from "../mock/reference-data.mock"
import { FieldLabelWithHelp } from "./FieldHelpTooltip"

const GLOBAL_SWITCH_HELP =
  "仅适用于「未绑定位置全局」类型配置：控制未绑定仓库/库房/分区/指定设备的门禁，开锁时是否走审批。关闭=免审直发密码；开启=进入全局审批。"

type UnlockApprovalConfigFiltersPanelProps = {
  value: UnlockApprovalConfigFilters
  onChange: (value: UnlockApprovalConfigFilters) => void
  onSearch: () => void
  onReset: () => void
  onAdd: () => void
}

export function UnlockApprovalConfigFiltersPanel({
  value,
  onChange,
  onSearch,
  onReset,
  onAdd,
}: UnlockApprovalConfigFiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const showGlobalSwitchFilter = value.scopeType === "未绑定位置全局"

  const updateFilters = (patch: Partial<UnlockApprovalConfigFilters>) => {
    const next = { ...value, ...patch }
    if (patch.scopeType && patch.scopeType !== "未绑定位置全局") {
      next.globalSwitch = "全部"
    }
    onChange(next)
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded((current) => !current)}
          onSearch={onSearch}
          onReset={() => {
            onChange({ ...DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS })
            onReset()
          }}
          onAdd={onAdd}
          addLabel="新增配置"
        />

        <div className="grid gap-4 xl:grid-cols-4">
          <FilterField label="配置名称">
            <Input
              placeholder="请输入配置名称"
              value={value.configName}
              onChange={(event) =>
                updateFilters({ configName: event.target.value })
              }
            />
          </FilterField>

          <FilterField
            label={
              <FieldLabelWithHelp
                label="适用范围类型"
                help="选择「未绑定位置全局」后，展开筛选区将出现「全局审批开关」筛选项。"
              />
            }
          >
            <Select
              value={value.scopeType}
              onValueChange={(nextValue) => {
                if (!nextValue) return
                updateFilters({
                  scopeType: nextValue as UnlockApprovalConfigFilters["scopeType"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCOPE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="审批方式">
            <Select
              value={value.approvalMode}
              onValueChange={(nextValue) => {
                if (!nextValue) return
                updateFilters({
                  approvalMode: nextValue as UnlockApprovalConfigFilters["approvalMode"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPROVAL_MODE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="状态">
            <Select
              value={value.status}
              onValueChange={(nextValue) => {
                if (!nextValue) return
                updateFilters({
                  status: nextValue as UnlockApprovalConfigFilters["status"],
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </div>

        {expanded && (
          <div className="grid gap-4 xl:grid-cols-4">
            <FilterField label="配置编号">
              <Input
                placeholder="精确匹配"
                value={value.configNo}
                onChange={(event) =>
                  updateFilters({ configNo: event.target.value })
                }
              />
            </FilterField>

            <FilterField label="适用仓库">
              <Select
                value={value.warehouseName}
                onValueChange={(nextValue) => {
                  if (!nextValue) return
                  updateFilters({ warehouseName: nextValue })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部">全部</SelectItem>
                  {WAREHOUSE_OPTIONS.map((warehouse) => (
                    <SelectItem key={warehouse} value={warehouse}>
                      {warehouse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>

            {showGlobalSwitchFilter ? (
              <FilterField
                label={
                  <FieldLabelWithHelp
                    label="全局审批开关"
                    help={GLOBAL_SWITCH_HELP}
                  />
                }
              >
                <Select
                  value={value.globalSwitch}
                  onValueChange={(nextValue) => {
                    if (!nextValue) return
                    updateFilters({
                      globalSwitch: nextValue as UnlockApprovalConfigFilters["globalSwitch"],
                    })
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GLOBAL_SWITCH_FILTER_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterField>
            ) : (
              <div className="flex items-end">
                <p className="pb-2 text-xs leading-relaxed text-muted-foreground">
                  将「适用范围类型」选为「未绑定位置全局」后，可筛选全局审批开关。
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FilterField({
  label,
  children,
}: {
  label: ReactNode
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
