import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { SectionCard } from "@/components/ui/SectionCard"
import { Toast } from "@/components/ui/Toast"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { formatDateTime } from "@/shared/lib/date-utils"
import { UNLOCK_APPLY_STATUS_LABEL } from "../domain/constants"
import { UnlockApplyApprovalDialog } from "../components/UnlockApplyApprovalDialog"
import { getUnlockApplies } from "@/features/my-applies/lib/unlock-applies-store"

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-1.5 text-xs border-b border-gray-50 last:border-0">
      <span className="w-20 shrink-0 text-gray-400">{label}</span>
      <span className="flex-1 text-gray-900 font-medium break-all">{value}</span>
    </div>
  )
}

function maskPhone(phone: string): string {
  if (phone.length < 7) return phone
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

export function UnlockApplyDetailPage() {
  const { applyNo } = useParams<{ applyNo: string }>()
  const navigate = useNavigate()
  const apply = useMemo(
    () => getUnlockApplies().find((item) => item.applyNo === applyNo && item.needsApproval),
    [applyNo]
  )
  const [toast, setToast] = useState<string | null>(null)
  const [configCollapsed, setConfigCollapsed] = useState(true)
  const [recordsCollapsed, setRecordsCollapsed] = useState(true)
  const [approvalOpen, setApprovalOpen] = useState(false)

  if (!apply) {
    return (
      <MobileShell>
        <NavBar title="开锁申请详情" backTo="/m/approval/unlock-applies" />
        <div className="p-6 text-center text-sm text-gray-500">申请单不存在或已不可见</div>
      </MobileShell>
    )
  }

  const canApprove = apply.status === "PENDING" && apply.eligible

  const handleComplete = (message: string) => {
    setToast(message)
    setTimeout(() => navigate("/m/approval/unlock-applies"), 1200)
  }

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["h5-unlock-audit-detail-page"]}>
        <NavBar
          title="开锁申请详情"
          backTo="/m/approval/unlock-applies"
          right={
            canApprove ? (
              <button
                type="button"
                className="text-sm font-semibold text-orange-600 active:opacity-70"
                onClick={() => setApprovalOpen(true)}
              >
                去处理
              </button>
            ) : undefined
          }
        />
      </PrototypeAnnotationTarget>

      <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-3 pb-6 overscroll-contain">
        <div className="rounded-2xl bg-orange-50/80 border border-orange-100 p-3.5">
          <div className="font-mono text-sm font-bold text-gray-900">{apply.applyNo}</div>
          <div className="mt-1 text-xs text-gray-600">{apply.deviceName}</div>
          <div className="mt-2 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-orange-700">
            {UNLOCK_APPLY_STATUS_LABEL[apply.status]}
          </div>
        </div>

        <SectionCard title="设备与位置" collapsible={false}>
          <KeyValue label="设备编码" value={apply.deviceCode} />
          <KeyValue label="设备类型" value={apply.deviceType} />
          <KeyValue label="绑定仓库" value={apply.warehouseName} />
          <KeyValue label="库房/分区" value={apply.roomZone} />
          <KeyValue label="具体位置" value={apply.locationDetail} />
        </SectionCard>

        <SectionCard title="申请信息" collapsible={false}>
          <KeyValue
            label="申请人"
            value={`${apply.applicantName}（${apply.applicantAccount}）`}
          />
          <KeyValue label="手机号" value={maskPhone(apply.applicantPhone)} />
          <KeyValue label="事由" value={apply.reason} />
          {apply.remark && <KeyValue label="备注" value={apply.remark} />}
          {apply.expectedUseWindow && (
            <KeyValue label="预计时段" value={apply.expectedUseWindow} />
          )}
          <KeyValue label="提交时间" value={formatDateTime(apply.submitTime)} />
        </SectionCard>

        <SectionCard
          title="审批配置快照"
          collapsed={configCollapsed}
          onToggleCollapse={setConfigCollapsed}
        >
          <KeyValue label="配置编号" value={apply.configSnapshot.configNo} />
          <KeyValue label="配置版本" value={`v${apply.configSnapshot.configVersion}`} />
          <KeyValue label="审批方式" value={apply.configSnapshot.approvalMode} />
          <KeyValue label="审批节点" value={apply.configSnapshot.approvalNodes} />
        </SectionCard>

        <SectionCard
          title="审批记录"
          collapsed={recordsCollapsed}
          onToggleCollapse={setRecordsCollapsed}
        >
          {apply.approvalRecords.length === 0 ? (
            <p className="text-xs text-gray-500 py-1">暂无记录，等待审批</p>
          ) : (
            apply.approvalRecords.map((record) => (
              <div
                key={`${record.nodeOrder}-${record.handlerAccount}`}
                className="mb-2 rounded-lg bg-slate-50 p-2.5 text-xs last:mb-0"
              >
                <div className="font-medium text-gray-900">
                  节点{record.nodeOrder} · {record.handlerName}（{record.handlerAccount}）
                </div>
                <div className="mt-1 text-gray-600">结果：{record.result}</div>
                {record.opinion && <div className="mt-1 text-gray-600">意见：{record.opinion}</div>}
                {record.processedTime && (
                  <div className="mt-1 text-gray-400">{record.processedTime}</div>
                )}
              </div>
            ))
          )}
          {apply.finalConclusion && (
            <KeyValue label="最终结论" value={apply.finalConclusion} />
          )}
          <KeyValue
            label="凭证状态"
            value={apply.credential.status}
          />
        </SectionCard>

        {apply.status === "PENDING" && !apply.eligible && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            您不是当前审批人，仅可查看。
          </div>
        )}
      </div>

      <UnlockApplyApprovalDialog
        open={approvalOpen}
        apply={apply}
        onClose={() => setApprovalOpen(false)}
        onApprove={(_item, _opinion) => handleComplete("审批通过")}
        onReject={(_item, _reason) => handleComplete("已驳回")}
      />

      {toast && <Toast message={toast} />}
    </MobileShell>
  )
}
