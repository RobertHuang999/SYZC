import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { getSeverityLevelById } from "@/shared/mock/severity-levels"
import { ConfigConfirmDialog } from "../components/ConfigConfirmDialog"
import { DEVICE_WARNING_CONFIG_STATUS_BADGE_CLASS } from "../domain/actions"
import {
  formatMonitorThreshold,
  formatNotifyChannels,
  formatNotifyTargets,
  getDetailHeaderActions,
  getDeviceWarningConfigById,
  isGlobalNewDeviceRule,
} from "../lib/detail-utils"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningConfigDetailAnnotations } from "../annotations/device-warning-config-detail.annotations"
import { deviceWarningConfigDocuments } from "../documents/device-warning-config-documents"

type PendingAction = "disable" | "enable" | "delete" | null

export function DeviceWarningConfigDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [deviceListOpen, setDeviceListOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const config = useMemo(() => getDeviceWarningConfigById(id), [id])
  const headerActions = useMemo(
    () => (config ? getDetailHeaderActions(config.status) : ["back"]),
    [config]
  )
  const severity = config ? getSeverityLevelById(config.severityLevelId) : undefined
  const hideUpgrade = config ? isGlobalNewDeviceRule(config) : false

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handleConfirmAction = () => {
    if (!config || !pendingAction) {
      return
    }

    if (pendingAction === "disable") {
      showToast("停用成功")
    } else if (pendingAction === "enable") {
      showToast("启用成功")
    } else if (pendingAction === "delete") {
      showToast("删除成功")
      navigate("/物联网IOT与预警/预警配置/设备预警配置")
    }

    setPendingAction(null)
  }

  if (!config) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/物联网IOT与预警/预警配置/设备预警配置">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的设备预警配置
        </div>
      </div>
    )
  }

  return (
    <PrototypeAnnotationProvider
      title="设备预警配置详情 · 原型批注"
      annotations={deviceWarningConfigDetailAnnotations}
      documents={deviceWarningConfigDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["device-warning-config-detail-header", "device-warning-config-detail-actions"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{config.ruleName}</h1>
              <Badge
                variant="outline"
                className={DEVICE_WARNING_CONFIG_STATUS_BADGE_CLASS[config.status]}
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
                <Link to="/物联网IOT与预警/预警配置/设备预警配置">
                  <Button variant="outline">
                    <ArrowLeftIcon />
                    返回
                  </Button>
                </Link>
              )}
              {headerActions.includes("edit") && (
                <Link to={`/物联网IOT与预警/预警配置/设备预警配置/编辑/${config.configId}`}>
                  <Button variant="secondary">编辑</Button>
                </Link>
              )}
              {headerActions.includes("disable") && (
                <Button variant="outline" onClick={() => setPendingAction("disable")}>
                  停用
                </Button>
              )}
              {headerActions.includes("enable") && (
                <Button variant="outline" onClick={() => setPendingAction("enable")}>
                  启用
                </Button>
              )}
              {headerActions.includes("delete") && (
                <Button variant="destructive" onClick={() => setPendingAction("delete")}>
                  删除
                </Button>
              )}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-config-detail-base"]}>
          <DetailSection title="基本信息">
            <DetailField label="规则 ID">{config.ruleUuid}</DetailField>
            <DetailField label="规则名称">{config.ruleName}</DetailField>
            <DetailField label="预警类型">{config.warningType}</DetailField>
            <DetailField label="预警子类型">
              {config.warningSubTypes.join("、")}
            </DetailField>
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
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-config-detail-scope"]}>
          <DetailSection title="关联设备">
            <DetailField label="所属仓库">一号大宗钢材仓</DetailField>
            <DetailField label="关联设备范围">
              <div className="space-y-1">
                <span>{config.deviceScope}</span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                  onClick={() => setDeviceListOpen((open) => !open)}
                >
                  查看设备清单
                  {deviceListOpen ? (
                    <ChevronUpIcon className="size-4" />
                  ) : (
                    <ChevronDownIcon className="size-4" />
                  )}
                </button>
                {deviceListOpen && (
                  <p className="text-sm text-muted-foreground">{config.deviceScopeDetail}</p>
                )}
              </div>
            </DetailField>
            <DetailField label="仅针对新设备">{config.newDeviceOnly ? "是" : "否"}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-config-detail-threshold"]}>
          <DetailSection title="触发条件与防抖">
            <DetailField label="监控阈值">
              {formatMonitorThreshold(
                config.monitorThresholdMin,
                config.monitorThresholdMax,
                config.monitorThresholdUnit
              )}
            </DetailField>
            <DetailField label="触发条件摘要">{config.triggerCondition}</DetailField>
            <DetailField label="防抖判定模式">{config.debounceMode}</DetailField>
            <DetailField label="防抖生效条件">{config.debounceConditionDetail}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-config-detail-notify"]}>
          <DetailSection title="通知与升级策略">
            <DetailField label="通知渠道">
              {formatNotifyChannels(config.notifyChannels)}
            </DetailField>
            <DetailField label="预警对象">
              {formatNotifyTargets(config.notifyTargets)}
            </DetailField>
            {!hideUpgrade && (
              <DetailField label="升级预警">
                {formatEmptyValue(config.upgradeStrategy)}
              </DetailField>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        <ConfigConfirmDialog
          open={pendingAction === "disable"}
          title="确认停用"
          description="停用后将暂停事件监听，确认停用？"
          confirmLabel="确认停用"
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={handleConfirmAction}
        />

        <ConfigConfirmDialog
          open={pendingAction === "enable"}
          title="确认启用"
          description="启用后将恢复事件监听，确认启用？"
          confirmLabel="确认启用"
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={handleConfirmAction}
        />

        <ConfigConfirmDialog
          open={pendingAction === "delete"}
          title="确认删除"
          description="删除后不可恢复，关联未处理预警将置为无效，确认删除？"
          confirmLabel="确认删除"
          destructive
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={handleConfirmAction}
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
