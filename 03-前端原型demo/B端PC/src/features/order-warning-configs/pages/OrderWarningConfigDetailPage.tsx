import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DetailField,
  DetailSection,
} from "@/shared/components/DetailSection"
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
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog"
import {
  ORDER_WARNING_CONFIG_STATUS_BADGE_CLASS,
} from "../domain/actions"
import {
  getDetailHeaderActions,
  getOrderWarningConfigById,
} from "../lib/detail-utils"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { orderWarningConfigDetailAnnotations } from "../annotations/order-warning-config-detail.annotations"
import { orderWarningConfigDocuments } from "../documents/order-warning-config-documents"

export function OrderWarningConfigDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const config = useMemo(() => getOrderWarningConfigById(id), [id])
  const headerActions = useMemo(
    () => (config ? getDetailHeaderActions(config.status) : ["back"]),
    [config]
  )

  if (!config) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/物联网IOT与预警/预警配置/订单预警配置">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的订单预警配置
        </div>
      </div>
    )
  }

  return (
    <PrototypeAnnotationProvider
      title="订单预警配置详情 · 原型批注"
      annotations={orderWarningConfigDetailAnnotations}
      documents={orderWarningConfigDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["order-warning-config-detail-header", "order-warning-config-detail-actions"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{config.ruleName}</h1>
              <Badge
                variant="outline"
                className={ORDER_WARNING_CONFIG_STATUS_BADGE_CLASS[config.status]}
              >
                {config.status}
              </Badge>
              {config.invalidReason && (
                <span className="text-sm text-muted-foreground">
                  失效原因：{config.invalidReason}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {headerActions.includes("back") && (
                <Link to="/物联网IOT与预警/预警配置/订单预警配置">
                  <Button variant="outline">
                    <ArrowLeftIcon />
                    返回
                  </Button>
                </Link>
              )}
              {headerActions.includes("edit") && (
                <Link to={`/物联网IOT与预警/预警配置/订单预警配置/编辑/${config.configId}`}>
                  <Button variant="secondary">编辑</Button>
                </Link>
              )}
              {headerActions.includes("delete") && (
                <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                  删除
                </Button>
              )}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["order-warning-config-detail-base"]}>
          <DetailSection title="基础识别">
            <DetailField label="规则 ID">{config.ruleUuid}</DetailField>
            <DetailField label="规则名称">{config.ruleName}</DetailField>
            <DetailField label="关联订单">
              {config.orderNo} - {config.orderCustomer}
            </DetailField>
            <DetailField label="订单类型">{config.orderType}</DetailField>
            <DetailField label="货主">
              {config.ownerName} {config.ownerPhone}
            </DetailField>
            <DetailField label="货物">{config.goodsDetail}</DetailField>
            <DetailField label="版本号">{config.version}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["order-warning-config-detail-strategies"]}>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">
              已激活风控策略详情（共激活 {config.activeStrategies.length} 项策略）
            </h2>
            {config.activeStrategies.map((strategy, index) => {
              const severity = getSeverityLevelById(strategy.severityLevelId)

              return (
                <Card key={strategy.key}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                      <span>【策略 {index + 1}：{strategy.name}】</span>
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        运行中
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {strategy.timeoutRows && strategy.timeoutRows.length > 0 ? (
                      <div className="space-y-2">
                        <DetailField label="超时配置列表">
                          <div className="overflow-x-auto rounded-lg border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>预警类型</TableHead>
                                  <TableHead>二维码/批次</TableHead>
                                  <TableHead>货物</TableHead>
                                  <TableHead>成功时间</TableHead>
                                  <TableHead>超时天数</TableHead>
                                  <TableHead>预计触发</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {strategy.timeoutRows.map((row) => (
                                  <TableRow key={row.rowId}>
                                    <TableCell>{row.warningType}</TableCell>
                                    <TableCell>{row.qrCode}</TableCell>
                                    <TableCell>{row.goodsLabel}</TableCell>
                                    <TableCell>{row.pledgedAt}</TableCell>
                                    <TableCell>{row.timeoutDays} 天</TableCell>
                                    <TableCell>
                                      {row.expectedTriggerAt ?? "—"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </DetailField>
                      </div>
                    ) : (
                      strategy.fields.map((field) => (
                        <DetailField key={field.label} label={field.label}>
                          {field.value}
                        </DetailField>
                      ))
                    )}
                    <DetailField label="预警等级">
                      {severity ? (
                        <SeverityLevelDisplay
                          severityCode={severity.severityCode}
                          severityName={severity.severityName}
                          severityColor={severity.severityColor}
                        />
                      ) : (
                        "—"
                      )}
                    </DetailField>
                    {strategy.notifyChannels && (
                      <DetailField label="通知渠道">
                        {strategy.notifyChannels.join("、")}
                      </DetailField>
                    )}
                    {strategy.notifyTargets && (
                      <DetailField label="预警对象">
                        {strategy.notifyTargets.join("、")}
                      </DetailField>
                    )}
                    {strategy.upgradeStrategy && (
                      <DetailField label="升级策略">{strategy.upgradeStrategy}</DetailField>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <DetailSection title="未启用策略项">
            <ul className="list-inside list-disc space-y-1 text-sm">
              {config.disabledStrategies.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={() => {
            setDeleteOpen(false)
            setToastMessage("删除成功")
            window.setTimeout(() => navigate("/物联网IOT与预警/预警配置/订单预警配置"), 800)
          }}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
