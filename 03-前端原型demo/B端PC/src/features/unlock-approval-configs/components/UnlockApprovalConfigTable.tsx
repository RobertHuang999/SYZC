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
import { LIST_BASE_PATH } from "../domain/constants"
import {
  getUnlockApprovalConfigActions,
  UNLOCK_APPROVAL_CONFIG_STATUS_BADGE_CLASS,
  type UnlockApprovalConfigAction,
} from "../domain/actions"
import type { UnlockApprovalConfig } from "../domain/types"
import {
  formatConfigVersion,
  formatPersonTime,
  formatTimeoutHours,
} from "../lib/list-utils"

type UnlockApprovalConfigTableProps = {
  configs: UnlockApprovalConfig[]
  page: number
  pageSize: number
  onAction: (action: UnlockApprovalConfigAction, config: UnlockApprovalConfig) => void
}

export function UnlockApprovalConfigTable({
  configs,
  page,
  pageSize,
  onAction,
}: UnlockApprovalConfigTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-36">配置编号</TableHead>
            <TableHead className="sticky left-0 z-10 w-44 bg-card">配置名称</TableHead>
            <TableHead className="w-28">适用范围类型</TableHead>
            <TableHead className="w-44">适用仓库/设备摘要</TableHead>
            <TableHead className="w-28">审批方式</TableHead>
            <TableHead className="w-24">审批超时</TableHead>
            <TableHead className="w-24">配置版本</TableHead>
            <TableHead className="w-24">状态</TableHead>
            <TableHead className="w-36">创建人/时间</TableHead>
            <TableHead className="sticky right-0 z-10 w-40 bg-card">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                暂无开锁审批配置，点击「+ 新增配置」创建
              </TableCell>
            </TableRow>
          ) : (
            configs.map((config, index) => {
              const actions = getUnlockApprovalConfigActions(config.status)

              return (
                <TableRow key={config.configNo}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>
                    <Link
                      to={`${LIST_BASE_PATH}/详情/${config.configNo}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {config.configNo}
                    </Link>
                  </TableCell>
                  <TableCell className="sticky left-0 z-10 bg-card">
                    <HoverOverflowText
                      className="max-w-[160px]"
                      content={config.configName}
                      ariaLabel={`配置名称：${config.configName}`}
                    >
                      <Link
                        to={`${LIST_BASE_PATH}/详情/${config.configNo}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {config.configName}
                      </Link>
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>{config.scopeType}</TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[180px]"
                      ariaLabel={`适用摘要：${config.scopeSummary}`}
                    >
                      {config.scopeSummary}
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>{config.approvalMode}</TableCell>
                  <TableCell>{formatTimeoutHours(config.timeoutHours)}</TableCell>
                  <TableCell>{formatConfigVersion(config.configVersion)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={UNLOCK_APPROVAL_CONFIG_STATUS_BADGE_CLASS[config.status]}
                    >
                      {config.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatPersonTime(config.createdBy, config.createdAt)}
                  </TableCell>
                  <TableCell className="sticky right-0 z-10 bg-card">
                    <div className="flex flex-wrap items-center gap-2">
                      {actions.includes("edit") && (
                        <Link
                          to={`${LIST_BASE_PATH}/编辑/${config.configNo}`}
                          className="text-sm text-primary hover:underline"
                        >
                          编辑
                        </Link>
                      )}
                      {actions.includes("detail") && (
                        <Link
                          to={`${LIST_BASE_PATH}/详情/${config.configNo}`}
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
