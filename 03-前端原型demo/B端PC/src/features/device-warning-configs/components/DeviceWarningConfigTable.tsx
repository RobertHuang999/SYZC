import { Link } from "react-router-dom"
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { getSeverityLevelById } from "@/shared/mock/severity-levels"
import {
  DEVICE_WARNING_CONFIG_STATUS_BADGE_CLASS,
  getDeviceWarningConfigActions,
  type DeviceWarningConfigAction,
} from "../domain/actions"
import type { DeviceWarningConfig } from "../domain/types"
import { formatPersonTime } from "../lib/list-utils"

type DeviceWarningConfigTableProps = {
  configs: DeviceWarningConfig[]
  page: number
  pageSize: number
  onAction: (action: DeviceWarningConfigAction, config: DeviceWarningConfig) => void
}

export function DeviceWarningConfigTable({
  configs,
  page,
  pageSize,
  onAction,
}: DeviceWarningConfigTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-40">规则名称</TableHead>
            <TableHead className="w-36">预警类型</TableHead>
            <TableHead className="w-32">预警等级</TableHead>
            <TableHead className="w-40">关联设备范围</TableHead>
            <TableHead className="w-36">触发条件</TableHead>
            <TableHead className="w-28">防抖条件</TableHead>
            <TableHead className="w-24">状态</TableHead>
            <TableHead className="w-32">创建人/时间</TableHead>
            <TableHead className="w-32">更新人/时间</TableHead>
            <TableHead className="w-44">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                暂无设备预警规则，点击「+ 新增设备规则」创建
              </TableCell>
            </TableRow>
          ) : (
            configs.map((config, index) => {
              const severity = getSeverityLevelById(config.severityLevelId)
              const actions = getDeviceWarningConfigActions(config.status)

              return (
                <TableRow key={config.configId}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[160px]"
                      content={config.ruleName}
                      ariaLabel={`规则名称：${config.ruleName}`}
                    >
                      <Link
                        to={`/预警配置/设备预警配置/详情/${config.configId}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {config.ruleName}
                      </Link>
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>{config.warningType}</TableCell>
                  <TableCell>
                    {severity ? (
                      <SeverityLevelDisplay
                        severityCode={severity.severityCode}
                        severityName={severity.severityName}
                        severityColor={severity.severityColor}
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[160px]"
                      ariaLabel={`关联设备范围：${config.deviceScope}`}
                    >
                      {config.deviceScope}
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[140px]"
                      ariaLabel={`触发条件：${config.triggerCondition}`}
                    >
                      {config.triggerCondition}
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[120px]"
                      ariaLabel={`防抖条件：${config.debounceCondition}`}
                    >
                      {config.debounceCondition}
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={DEVICE_WARNING_CONFIG_STATUS_BADGE_CLASS[config.status]}
                    >
                      {config.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatPersonTime(config.createdBy, config.createdAt)}
                  </TableCell>
                  <TableCell>
                    {formatPersonTime(config.updatedBy, config.updatedAt.slice(5, 16))}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      {actions.includes("edit") && (
                        <Link
                          to={`/预警配置/设备预警配置/编辑/${config.configId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          编辑
                        </Link>
                      )}
                      {actions.includes("detail") && (
                        <Link
                          to={`/预警配置/设备预警配置/详情/${config.configId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          详情
                        </Link>
                      )}
                      {actions.includes("disable") && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => onAction("disable", config)}
                        >
                          停用
                        </Button>
                      )}
                      {actions.includes("enable") && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => onAction("enable", config)}
                        >
                          启用
                        </Button>
                      )}
                      {actions.includes("delete") && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-destructive"
                          onClick={() => onAction("delete", config)}
                        >
                          删除
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
