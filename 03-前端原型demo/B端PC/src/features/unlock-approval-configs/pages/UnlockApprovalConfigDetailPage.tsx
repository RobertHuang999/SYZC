import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
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
import { ConfigConfirmDialog } from "@/features/device-warning-configs/components/ConfigConfirmDialog"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { LIST_BASE_PATH } from "../domain/constants"
import {
  getDetailHeaderActions,
  UNLOCK_APPROVAL_CONFIG_STATUS_BADGE_CLASS,
} from "../domain/actions"
import { DisableConfirmDialog } from "../components/DisableConfirmDialog"
import { getUnlockApprovalConfigDetail } from "../lib/detail-utils"
import {
  formatConfigVersion,
  formatTimeoutHours,
} from "../lib/list-utils"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { unlockApprovalConfigDetailAnnotations } from "../annotations/unlock-approval-config-detail.annotations"
import { unlockApprovalConfigDocuments } from "../documents/unlock-approval-config-documents"

type PendingAction = "disable" | "enable" | null

export function UnlockApprovalConfigDetailPage() {
  const { configNo } = useParams()
  const navigate = useNavigate()
  const [deviceListOpen, setDeviceListOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const config = useMemo(() => getUnlockApprovalConfigDetail(configNo), [configNo])
  const headerActions = useMemo(
    () => (config ? getDetailHeaderActions(config.status) : []),
    [config]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handleConfirmAction = () => {
    if (!config || !pendingAction) return

    if (pendingAction === "disable") {
      showToast("停用成功")
    } else if (pendingAction === "enable") {
      showToast("启用成功")
    }

    setPendingAction(null)
  }

  if (!config) {
    return (
      <div className="space-y-4 p-6">
        <Link to={LIST_BASE_PATH}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的开锁审批配置
        </div>
      </div>
    )
  }

  const showWarehouseFields =
    config.scopeType !== "未绑定位置全局"
  const showStoreroom =
    config.scopeType === "库房" ||
    config.scopeType === "分区" ||
    config.scopeType === "指定设备"
  const showZone =
    config.scopeType === "分区" || config.scopeType === "指定设备"
  const showDevices = config.scopeType === "指定设备"
  const showGlobalSwitch = config.scopeType === "未绑定位置全局"

  return (
    <PrototypeAnnotationProvider
      title={`${config.configName} · 原型批注`}
      annotations={unlockApprovalConfigDetailAnnotations}
      documents={unlockApprovalConfigDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget
          annotationIds={[
            "unlock-approval-config-detail-header",
            "unlock-approval-config-detail-actions",
          ]}
        >
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{config.configName}</h1>
              <Badge
                variant="outline"
                className={UNLOCK_APPROVAL_CONFIG_STATUS_BADGE_CLASS[config.status]}
              >
                {config.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to={LIST_BASE_PATH}>
                <Button variant="outline">
                  <ArrowLeftIcon />
                  返回
                </Button>
              </Link>
              {headerActions.includes("edit") && (
                <Link to={`${LIST_BASE_PATH}/编辑/${config.configNo}`}>
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
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-approval-config-detail-base"]}>
          <DetailSection title="基础识别与范围">
            <DetailField label="配置编号">{config.configNo}</DetailField>
            <DetailField label="配置名称">{config.configName}</DetailField>
            <DetailField label="适用范围类型">{config.scopeType}</DetailField>
            {showWarehouseFields && (
              <DetailField label="适用仓库">
                {formatEmptyValue(config.warehouseName ?? undefined)}
              </DetailField>
            )}
            {showStoreroom && (
              <DetailField label="适用库房">
                {config.storeroomNames.length > 0
                  ? config.storeroomNames.join("、")
                  : "—"}
              </DetailField>
            )}
            {showZone && (
              <DetailField label="适用分区">
                {config.zoneNames.length > 0 ? config.zoneNames.join("、") : "—"}
              </DetailField>
            )}
            {showDevices && (
              <DetailField label="适用设备">
                <div className="space-y-1">
                  <span>
                    已选 {config.deviceCount ?? config.deviceCodes.length} 台 ·{" "}
                    {config.deviceCodes.join(" / ")}
                  </span>
                  <button
                    type="button"
                    className="block text-sm text-primary hover:underline"
                    onClick={() => setDeviceListOpen((open) => !open)}
                  >
                    {deviceListOpen ? "收起设备清单" : "查看设备清单 >"}
                  </button>
                  {deviceListOpen && (
                    <p className="text-sm text-muted-foreground">
                      {config.deviceCodes.join("、")}
                    </p>
                  )}
                </div>
              </DetailField>
            )}
            {showGlobalSwitch && (
              <DetailField label="未绑定位置设备全局审批开关">
                {config.globalSwitch}
              </DetailField>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-approval-config-detail-strategy"]}>
          <DetailSection title="审批策略">
            <DetailField label="审批方式">{config.approvalMode}</DetailField>
            <DetailField label="审批超时时间">
              {formatTimeoutHours(config.timeoutHours)}
            </DetailField>
            <DetailField label="配置版本">
              {formatConfigVersion(config.configVersion)}
            </DetailField>
            <div className="space-y-2">
              <div className="detail-field-label">审批节点</div>
              <div className="detail-field-value">
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">节点序号</TableHead>
                        <TableHead className="w-32">审批对象类型</TableHead>
                        <TableHead>指定人员 / 指定角色</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {config.approvalNodes.map((node) => (
                        <TableRow key={node.id}>
                          <TableCell>{node.sequence}</TableCell>
                          <TableCell>{node.objectType}</TableCell>
                          <TableCell>{node.objectLabel}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-approval-config-detail-audit"]}>
          <DetailSection title="系统审计">
            <DetailField label="状态">{config.status}</DetailField>
            <DetailField label="创建人 / 创建时间">
              {config.createdBy} / {config.createdAt}
            </DetailField>
            <DetailField label="更新人 / 更新时间">
              {config.updatedBy} / {config.updatedAt}
            </DetailField>
            {config.status === "已停用" && config.disableReason && (
              <DetailField label="停用原因">{config.disableReason}</DetailField>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        <DisableConfirmDialog
          open={pendingAction === "disable"}
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={() => {
            handleConfirmAction()
            navigate(LIST_BASE_PATH)
          }}
        />

        <ConfigConfirmDialog
          open={pendingAction === "enable"}
          title="确认启用"
          description="启用后新申请将按本配置匹配，确认启用？"
          confirmLabel="确认启用"
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
