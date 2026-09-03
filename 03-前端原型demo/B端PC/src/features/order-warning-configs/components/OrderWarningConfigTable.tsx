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
import {
  getOrderWarningConfigActions,
  ORDER_WARNING_CONFIG_STATUS_BADGE_CLASS,
  ORDER_WARNING_ITEM_BADGE_CLASS,
  type OrderWarningConfigAction,
} from "../domain/actions"
import type { OrderWarningConfig } from "../domain/types"

type OrderWarningConfigTableProps = {
  configs: OrderWarningConfig[]
  page: number
  pageSize: number
  onAction: (action: OrderWarningConfigAction, config: OrderWarningConfig) => void
}

export function OrderWarningConfigTable({
  configs,
  page,
  pageSize,
  onAction,
}: OrderWarningConfigTableProps) {
  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-44">规则名称</TableHead>
            <TableHead className="w-36">订单号</TableHead>
            <TableHead className="w-24">订单类型</TableHead>
            <TableHead className="w-40">货主/货物摘要</TableHead>
            <TableHead className="w-64">已启用预警项摘要</TableHead>
            <TableHead className="w-24">状态</TableHead>
            <TableHead className="w-40">更新时间</TableHead>
            <TableHead className="w-32">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                暂无订单预警规则，点击「+ 新增订单规则」创建
              </TableCell>
            </TableRow>
          ) : (
            configs.map((config, index) => {
              const actions = getOrderWarningConfigActions(config.status)

              return (
                <TableRow key={config.configId}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[176px]"
                      content={config.ruleName}
                      ariaLabel={`规则名称：${config.ruleName}`}
                    >
                      <Link
                        to={`/物联网IOT与预警/预警配置/订单预警配置/详情/${config.configId}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {config.ruleName}
                      </Link>
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[140px]"
                      ariaLabel={`订单号：${config.orderNo}`}
                    >
                      {config.orderNo}
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>{config.orderType}</TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[160px]"
                      ariaLabel={`货主/货物摘要：${config.ownerGoodsSummary}`}
                    >
                      {config.ownerGoodsSummary}
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {config.enabledItems.map((item) => (
                        <Badge
                          key={`${config.configId}-${item.type}`}
                          variant="outline"
                          className={
                            ORDER_WARNING_ITEM_BADGE_CLASS[item.type] ??
                            "border-slate-200 bg-slate-50 text-slate-700"
                          }
                        >
                          {item.type}({item.levels})
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={ORDER_WARNING_CONFIG_STATUS_BADGE_CLASS[config.status]}
                    >
                      {config.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{config.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      {actions.includes("edit") && (
                        <Link
                          to={`/物联网IOT与预警/预警配置/订单预警配置/编辑/${config.configId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          编辑
                        </Link>
                      )}
                      {actions.includes("detail") && (
                        <Link
                          to={`/物联网IOT与预警/预警配置/订单预警配置/详情/${config.configId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          详情
                        </Link>
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
