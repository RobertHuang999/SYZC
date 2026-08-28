import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { SectionCard } from "@/components/ui/SectionCard"
import { Toast } from "@/components/ui/Toast"
import { formatDateTime } from "@/shared/lib/date-utils"
import { UNLOCK_APPLY_STATUS_LABEL } from "../domain/constants"
import { unlockAppliesMock } from "../mock/unlock-applies.mock"

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-1.5 text-xs border-b border-gray-50 last:border-0">
      <span className="w-20 shrink-0 text-gray-400">{label}</span>
      <span className="flex-1 text-gray-900 font-medium break-all">{value}</span>
    </div>
  )
}

export function UnlockApplyDetailPage() {
  const { applyNo } = useParams<{ applyNo: string }>()
  const navigate = useNavigate()
  const apply = unlockAppliesMock.find((item) => item.applyNo === applyNo)
  const [opinion, setOpinion] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  if (!apply) {
    return (
      <MobileShell>
        <NavBar title="开锁申请详情" backTo="/m/approval/unlock-applies" />
        <div className="p-6 text-center text-sm text-gray-500">申请单不存在或已不可见</div>
      </MobileShell>
    )
  }

  const isPending = apply.status === "PENDING"

  const handleDecision = (decision: "APPROVED" | "REJECTED") => {
    if (decision === "REJECTED" && !opinion.trim()) {
      setToast("驳回须填写审批意见")
      return
    }
    setToast(decision === "APPROVED" ? "已通过，凭证生成中" : "已驳回")
    setTimeout(() => navigate("/m/approval/unlock-applies"), 1200)
  }

  return (
    <MobileShell>
      <NavBar title="开锁申请详情" backTo="/m/approval/unlock-applies" />

      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 pb-6">
        <div className="rounded-2xl bg-orange-50/80 border border-orange-100 p-3.5">
          <div className="font-mono text-sm font-bold text-gray-900">{apply.applyNo}</div>
          <div className="mt-1 text-xs text-gray-600">{apply.deviceName}</div>
          <div className="mt-2 inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-orange-700">
            {UNLOCK_APPLY_STATUS_LABEL[apply.status]}
          </div>
        </div>

        <SectionCard title="设备与位置" collapsible={false}>
          <KeyValue label="设备编码" value={apply.deviceCode} />
          <KeyValue label="绑定仓库" value={apply.warehouseName} />
          <KeyValue label="库房/分区" value={apply.roomZone} />
          <KeyValue label="具体位置" value={apply.locationDetail} />
        </SectionCard>

        <SectionCard title="申请信息" collapsible={false}>
          <KeyValue label="申请人" value={`${apply.applicantName}（${apply.applicantAccount}）`} />
          <KeyValue label="事由" value={apply.reason} />
          {apply.remark && <KeyValue label="备注" value={apply.remark} />}
          {apply.expectedUseWindow && (
            <KeyValue label="预计时段" value={apply.expectedUseWindow} />
          )}
          <KeyValue label="提交时间" value={formatDateTime(apply.submitTime)} />
        </SectionCard>

        {isPending && (
          <SectionCard title="审批处理" collapsible={false} indicatorColor="#f57c00">
            <label className="block text-xs text-gray-500 mb-1.5">审批意见</label>
            <textarea
              className="w-full min-h-[88px] rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 outline-none focus:border-orange-500"
              placeholder="通过可选填；驳回必填"
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDecision("REJECTED")}
                className="rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-50"
              >
                驳回
              </button>
              <button
                type="button"
                onClick={() => handleDecision("APPROVED")}
                className="rounded-xl bg-orange-600 py-2.5 text-xs font-semibold text-white active:bg-orange-700"
              >
                通过
              </button>
            </div>
          </SectionCard>
        )}
      </div>

      {toast && <Toast message={toast} />}
    </MobileShell>
  )
}
