import { useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
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
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { UnlockApplyStatusBadge } from "../components/UnlockApplyStatusBadge"
import { WithdrawConfirmDialog } from "../components/WithdrawConfirmDialog"
import { MY_APPLY_LIST_PATH } from "../domain/constants"
import {
  formatApplicant,
  maskPhone,
} from "../lib/detail-utils"
import {
  findUnlockApply,
  subscribeUnlockApplies,
  updateUnlockApply,
} from "../lib/unlock-applies-store"
import type { UnlockApply } from "../domain/types"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { myUnlockApplyDetailAnnotations } from "../annotations/my-unlock-apply-detail.annotations"
import { unlockApplyDocuments } from "../documents/unlock-apply-documents"

export function MyUnlockApplyDetailPage() {
  const { applyNo } = useParams()
  const [searchParams] = useSearchParams()
  const [apply, setApply] = useState<UnlockApply | undefined>(() =>
    findUnlockApply(applyNo)
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  useEffect(() => {
    setApply(findUnlockApply(applyNo))
    return subscribeUnlockApplies(() => setApply(findUnlockApply(applyNo)))
  }, [applyNo])

  const returnRoute = searchParams.get("return_route")
  const listPath = returnRoute
    ? `${MY_APPLY_LIST_PATH}?tab=unlock-applies&return_route=${encodeURIComponent(returnRoute)}`
    : `${MY_APPLY_LIST_PATH}?tab=unlock-applies`

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handleWithdraw = () => {
    if (!apply || apply.status !== "PENDING" || !apply.needsApproval) {
      showToast("撤回失败：申请状态已变更")
      return
    }
    updateUnlockApply(apply.applyNo, (item) => ({
      ...item,
      status: "WITHDRAWN",
      finalConclusion: "撤回",
    }))
    setApply(findUnlockApply(applyNo))
    setWithdrawOpen(false)
    showToast("撤回成功")
  }

  const canWithdraw = apply?.status === "PENDING" && apply.needsApproval

  if (!apply) {
    return (
      <PrototypeAnnotationProvider
        title="开锁申请详情 · 原型批注"
        annotations={myUnlockApplyDetailAnnotations}
        documents={unlockApplyDocuments}
      >
        <div className="space-y-4 p-6">
          <Link to={listPath}>
            <Button variant="outline">
              <ArrowLeftIcon />
              返回列表
            </Button>
          </Link>
          <p className="text-muted-foreground">申请单不存在或已不可见</p>
        </div>
      </PrototypeAnnotationProvider>
    )
  }

  return (
    <PrototypeAnnotationProvider
      title="开锁申请详情 · 原型批注"
      annotations={myUnlockApplyDetailAnnotations}
      documents={unlockApplyDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget
          annotationIds={[
            "my-unlock-apply-detail-page",
            "my-unlock-apply-detail-withdraw",
          ]}
        >
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  开锁申请 {apply.applyNo}
                </h1>
                <UnlockApplyStatusBadge apply={apply} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {canWithdraw && (
                <Button variant="outline" onClick={() => setWithdrawOpen(true)}>
                  撤回
                </Button>
              )}
              <Link to={listPath}>
                <Button variant="outline">
                  <ArrowLeftIcon />
                  返回
                </Button>
              </Link>
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <DetailSection title="基础信息">
          <DetailField label="申请单号">{apply.applyNo}</DetailField>
          <DetailField label="申请状态">
            <UnlockApplyStatusBadge apply={apply} />
          </DetailField>
          <DetailField label="提交时间">{apply.submitTime}</DetailField>
          <DetailField label="是否需要审核">{apply.needsApproval ? "是" : "否"}</DetailField>
        </DetailSection>

        <DetailSection title="设备与位置快照">
          <DetailField label="设备编码">{apply.deviceCode}</DetailField>
          <DetailField label="设备名称">{apply.deviceName}</DetailField>
          <DetailField label="设备类型">{apply.deviceType}</DetailField>
          <DetailField label="绑定仓库">{apply.warehouseName}</DetailField>
          <DetailField label="绑定库房">
            {formatEmptyValue(apply.storeroomName ?? apply.roomZone.split("/")[0]?.trim())}
          </DetailField>
          <DetailField label="绑定分区">
            {formatEmptyValue(apply.zoneName ?? apply.roomZone.split("/")[1]?.trim())}
          </DetailField>
          <DetailField label="具体位置">{apply.locationDetail}</DetailField>
        </DetailSection>

        <DetailSection title="申请内容">
          <DetailField label="申请人">{formatApplicant(apply)}</DetailField>
          <DetailField label="申请人所属机构">{apply.applicantOrg}</DetailField>
          <DetailField label="申请人手机号">{maskPhone(apply.applicantPhone)}</DetailField>
          <DetailField label="事由">{apply.reason}</DetailField>
          <DetailField label="备注">{formatEmptyValue(apply.remark)}</DetailField>
          {apply.needsApproval && (
            <DetailField label="预计使用时段">
              <span>{formatEmptyValue(apply.expectedUseWindow)}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                仅供审批参考
              </span>
            </DetailField>
          )}
        </DetailSection>

        {apply.needsApproval && (
          <PrototypeAnnotationTarget annotationIds={["my-unlock-apply-detail-approval"]}>
            <DetailSection title="审批配置快照">
              <DetailField label="配置编号">{apply.configSnapshot.configNo}</DetailField>
              <DetailField label="配置版本">v{apply.configSnapshot.configVersion}</DetailField>
              <DetailField label="审批方式">{apply.configSnapshot.approvalMode}</DetailField>
              {apply.configSnapshot.timeoutHours != null && (
                <DetailField label="审批超时">
                  {apply.configSnapshot.timeoutHours} 小时
                </DetailField>
              )}
              <DetailField label="审批节点">{apply.configSnapshot.approvalNodes}</DetailField>
            </DetailSection>

            <DetailSection title="审批记录">
              {apply.approvalRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground">暂无记录，等待审批</p>
              ) : (
                <div className="col-span-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>节点</TableHead>
                        <TableHead>处理人</TableHead>
                        <TableHead>结果</TableHead>
                        <TableHead>意见/驳回原因</TableHead>
                        <TableHead>处理时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apply.approvalRecords.map((record) => (
                        <TableRow key={`${record.nodeOrder}-${record.handlerAccount}`}>
                          <TableCell>{record.nodeOrder}</TableCell>
                          <TableCell>
                            {record.handlerName}（{record.handlerAccount}）
                          </TableCell>
                          <TableCell>{record.result}</TableCell>
                          <TableCell>{formatEmptyValue(record.opinion)}</TableCell>
                          <TableCell>{formatEmptyValue(record.processedTime)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {apply.finalConclusion && (
                <DetailField label="最终审批结论">{apply.finalConclusion}</DetailField>
              )}
              {apply.rejectReason && (
                <DetailField label="驳回原因">{apply.rejectReason}</DetailField>
              )}
            </DetailSection>
          </PrototypeAnnotationTarget>
        )}

        <WithdrawConfirmDialog
          open={withdrawOpen}
          onOpenChange={setWithdrawOpen}
          onConfirm={handleWithdraw}
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
