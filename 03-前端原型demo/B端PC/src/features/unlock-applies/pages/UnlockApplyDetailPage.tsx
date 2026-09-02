import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { UnlockApplyApprovalDialog } from "../components/UnlockApplyApprovalDialog"
import { UnlockApplyStatusBadge } from "../components/UnlockApplyStatusBadge"
import { LIST_BASE_PATH } from "../domain/constants"
import {
  formatApplicant,
  getUnlockApplyByNo,
  maskPhone,
} from "../lib/detail-utils"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { unlockApplyAuditDetailAnnotations } from "../annotations/unlock-apply-audit-detail.annotations"
import { unlockApplyAuditDocuments } from "../documents/unlock-apply-audit-documents"

export function UnlockApplyDetailPage() {
  const { applyNo } = useParams()
  const navigate = useNavigate()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [approvalOpen, setApprovalOpen] = useState(false)

  const apply = useMemo(() => getUnlockApplyByNo(applyNo), [applyNo])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  if (!apply) {
    return (
      <div className="space-y-4 p-6">
        <Link to={LIST_BASE_PATH}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回列表
          </Button>
        </Link>
        <p className="text-muted-foreground">申请单不存在或已不可见</p>
      </div>
    )
  }

  const canApprove = apply.status === "PENDING" && apply.eligible

  const handleApprove = (_opinion: string) => {
    showToast("审批通过")
    window.setTimeout(() => navigate(LIST_BASE_PATH), 800)
  }

  const handleReject = (_reason: string) => {
    showToast("已驳回")
    window.setTimeout(() => navigate(LIST_BASE_PATH), 800)
  }

  return (
    <PrototypeAnnotationProvider
      title="开锁审核详情 · 原型交互与 PRD 标注"
      annotations={unlockApplyAuditDetailAnnotations}
      documents={unlockApplyAuditDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["unlock-apply-audit-detail-header"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{apply.applyNo}</h1>
                <UnlockApplyStatusBadge apply={apply} />
              </div>
              <p className="text-sm text-muted-foreground">{apply.deviceName}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {canApprove && (
                <Button onClick={() => setApprovalOpen(true)}>去处理</Button>
              )}
              <Link to={LIST_BASE_PATH}>
                <Button variant="outline">
                  <ArrowLeftIcon />
                  返回列表
                </Button>
              </Link>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-apply-audit-detail-device"]}>
          <DetailSection title="设备与位置">
            <DetailField label="设备编码">{apply.deviceCode}</DetailField>
            <DetailField label="设备名称">{apply.deviceName}</DetailField>
            <DetailField label="设备类型">{apply.deviceType}</DetailField>
            <DetailField label="绑定仓库">{apply.warehouseName}</DetailField>
            <DetailField label="绑定库房/分区">{apply.roomZone}</DetailField>
            <DetailField label="具体位置">{apply.locationDetail}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-apply-audit-detail-content"]}>
          <DetailSection title="申请内容">
            <DetailField label="申请人">{formatApplicant(apply)}</DetailField>
            <DetailField label="手机号">{maskPhone(apply.applicantPhone)}</DetailField>
            <DetailField label="事由">{apply.reason}</DetailField>
            <DetailField label="备注">{formatEmptyValue(apply.remark)}</DetailField>
            <DetailField label="预计使用时段">
              {formatEmptyValue(apply.expectedUseWindow)}
            </DetailField>
            <DetailField label="提交时间">{apply.submitTime}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-apply-audit-detail-snapshot"]}>
          <DetailSection title="审批配置快照">
            <DetailField label="配置编号">{apply.configSnapshot.configNo}</DetailField>
            <DetailField label="配置版本">v{apply.configSnapshot.configVersion}</DetailField>
            <DetailField label="审批方式">{apply.configSnapshot.approvalMode}</DetailField>
            <DetailField label="审批节点">{apply.configSnapshot.approvalNodes}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-apply-audit-detail-record"]}>
          <DetailSection title="审批记录">
            {apply.approvalRecords.length === 0 ? (
              <DetailField label="记录">暂无记录，等待审批</DetailField>
            ) : (
              apply.approvalRecords.map((record) => (
                <DetailField
                  key={`${record.nodeOrder}-${record.handlerAccount}`}
                  label={`节点${record.nodeOrder}`}
                >
                  {record.handlerName}（{record.handlerAccount}）· {record.result} ·{" "}
                  {formatEmptyValue(record.opinion)} · {formatEmptyValue(record.processedTime)}
                </DetailField>
              ))
            )}
            {apply.finalConclusion && (
              <DetailField label="最终审批结论">{apply.finalConclusion}</DetailField>
            )}
            <DetailField label="凭证状态">{apply.credential.status}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        {apply.status === "PENDING" && !apply.eligible && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            您不是当前审批人，仅可查看。
          </div>
        )}

        <UnlockApplyApprovalDialog
          open={approvalOpen}
          apply={apply}
          onOpenChange={setApprovalOpen}
          onApprove={(_item, opinion) => handleApprove(opinion)}
          onReject={(_item, reason) => handleReject(reason)}
        />

        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
