import { useEffect, useMemo, useState } from "react"
import { Copy, Loader2 } from "lucide-react"
import { useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { SectionCard } from "@/components/ui/SectionCard"
import { Toast } from "@/components/ui/Toast"
import { formatDateTime } from "@/shared/lib/date-utils"
import {
  myApplyListPathWithTab,
  CREDENTIAL_STATUS_LABEL,
  UNLOCK_APPLY_STATUS_LABEL,
} from "../domain/constants"
import type { UnlockApply } from "../domain/types"
import {
  findUnlockApply,
  subscribeUnlockApplies,
} from "../lib/unlock-applies-store"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

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

function formatRoomZone(apply: UnlockApply): string {
  if (apply.storeroomName && apply.zoneName) {
    return `${apply.storeroomName} · ${apply.zoneName}`
  }
  return apply.roomZone
}

function canShowPassword(apply: UnlockApply): boolean {
  if (apply.status !== "APPROVED") return false
  const { status, password } = apply.credential
  if (status === "DELIVERED" && password) return true
  if (
    apply.deviceType === "挂锁门禁" &&
    status === "DELIVERY_FAILED" &&
    password
  ) {
    return true
  }
  return false
}

function shouldShowCredentialSection(apply: UnlockApply): boolean {
  if (apply.status === "APPROVED") return true
  if (apply.credential.status !== "NOT_GENERATED") return true
  return apply.status === "REJECTED" || apply.status === "PENDING"
}

export function MyUnlockApplyDetailPage() {
  const { applyNo } = useParams<{ applyNo: string }>()
  const [apply, setApply] = useState<UnlockApply | undefined>(() =>
    findUnlockApply(applyNo)
  )
  const [toast, setToast] = useState<string | null>(null)
  const [configCollapsed, setConfigCollapsed] = useState(true)
  const [recordsCollapsed, setRecordsCollapsed] = useState(
    () => apply?.status !== "APPROVED"
  )
  const [credentialCollapsed, setCredentialCollapsed] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  useEffect(() => {
    const found = findUnlockApply(applyNo)
    setApply(found)
    setRecordsCollapsed(found?.status !== "APPROVED")
    return subscribeUnlockApplies(() => {
      const next = findUnlockApply(applyNo)
      setApply(next)
    })
  }, [applyNo])

  const showPassword = useMemo(() => (apply ? canShowPassword(apply) : false), [apply])

  if (!apply) {
    return (
      <MobileShell>
        <NavBar title="开锁申请详情" backTo={myApplyListPathWithTab("unlock")} />
        <div className="p-6 text-center text-sm text-gray-500">申请单不存在或已不可见</div>
      </MobileShell>
    )
  }

  const handleWithdraw = () => {
    if (apply.status !== "PENDING" || !apply.needsApproval) {
      setToast("撤回失败：申请状态已变更")
      return
    }
    setApply({ ...apply, status: "WITHDRAWN", finalConclusion: "撤回" })
    setWithdrawOpen(false)
    setToast("撤回成功")
  }

  const handleCopy = async () => {
    if (!apply.credential.password) return
    try {
      await navigator.clipboard.writeText(apply.credential.password)
      setToast("已复制到剪贴板")
    } catch {
      setToast("复制失败，请手动复制")
    }
  }

  const handleResendSms = () => {
    setApply({
      ...apply,
      credential: {
        ...apply.credential,
        status: "DELIVERED",
        smsStatus: "发送成功",
        smsFailReason: undefined,
      },
    })
    setToast("短信已重新发送")
  }

  const credentialInvalid = ["EXPIRED", "REVOKED", "SUPERSEDED", "USED"].includes(
    apply.credential.status
  )

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["my-unlock-apply-detail-h5-page"]}>
        <NavBar title="开锁申请详情" backTo={myApplyListPathWithTab("unlock")} />
      </PrototypeAnnotationTarget>

      <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-3 pb-24 overscroll-contain">
        <div className="rounded-2xl bg-orange-50/80 border border-orange-100 p-3.5">
          <div className="font-mono text-sm font-bold text-gray-900">{apply.applyNo}</div>
          <div className="mt-1 text-xs text-gray-600">{apply.deviceName}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-orange-700">
              {UNLOCK_APPLY_STATUS_LABEL[apply.status]}
            </span>
            <span className="inline-flex rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700">
              凭证 {CREDENTIAL_STATUS_LABEL[apply.credential.status]}
            </span>
          </div>
        </div>

        <SectionCard title="设备与位置" collapsible={false}>
          <KeyValue label="设备编码" value={apply.deviceCode} />
          <KeyValue label="设备类型" value={apply.deviceType} />
          <KeyValue label="绑定仓库" value={apply.warehouseName} />
          <KeyValue label="库房/分区" value={formatRoomZone(apply)} />
          <KeyValue label="具体位置" value={apply.locationDetail} />
        </SectionCard>

        <SectionCard title="申请内容" collapsible={false}>
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
          {apply.configSnapshot.timeoutHours != null && (
            <KeyValue label="审批超时" value={`${apply.configSnapshot.timeoutHours} 小时`} />
          )}
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
                {record.result && (
                  <div className="mt-1 text-gray-600">结果：{record.result}</div>
                )}
                {record.opinion && (
                  <div className="mt-1 text-gray-600">意见：{record.opinion}</div>
                )}
                {record.processedTime && (
                  <div className="mt-1 text-gray-400">{record.processedTime}</div>
                )}
              </div>
            ))
          )}
          {apply.rejectReason && (
            <KeyValue label="驳回原因" value={apply.rejectReason} />
          )}
          {apply.finalConclusion && apply.status !== "PENDING" && (
            <KeyValue label="最终结论" value={apply.finalConclusion} />
          )}
        </SectionCard>

        {shouldShowCredentialSection(apply) && (
          <PrototypeAnnotationTarget annotationIds={["my-unlock-apply-detail-h5-credential"]}>
          <SectionCard
            title="凭证信息"
            collapsed={credentialCollapsed}
            onToggleCollapse={setCredentialCollapsed}
          >
            <KeyValue
              label="凭证状态"
              value={CREDENTIAL_STATUS_LABEL[apply.credential.status]}
            />
            {apply.credential.validFrom && apply.credential.validTo && (
              <KeyValue
                label="密码有效期"
                value={`${apply.credential.validFrom.slice(5, 16)} ~ ${apply.credential.validTo.slice(5, 16)}`}
              />
            )}
            {apply.deviceType === "挂锁门禁" && apply.credential.smsStatus && (
              <KeyValue label="短信状态" value={apply.credential.smsStatus} />
            )}
            {apply.deviceType === "挂锁门禁" && apply.credential.smsFailReason && (
              <KeyValue label="失败原因" value={apply.credential.smsFailReason} />
            )}

            {apply.credential.status === "GENERATING" && (
              <div className="flex items-center gap-2 py-2 text-xs text-gray-500">
                <Loader2 className="size-4 animate-spin" />
                正在生成凭证，请稍候…
              </div>
            )}

            {apply.credential.status === "GEN_FAILED" && apply.credential.genFailReason && (
              <KeyValue label="失败原因" value={apply.credential.genFailReason} />
            )}

            {showPassword && (
              <div className="mt-2 rounded-xl border bg-slate-50 p-3">
                <p className="text-[10px] text-gray-500 mb-2">临时密码</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xl font-semibold tracking-[0.2em] text-gray-900">
                    {apply.credential.passwordMasked ?? apply.credential.password}
                  </span>
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-lg bg-white border text-gray-600 active:opacity-70"
                    onClick={handleCopy}
                    aria-label="复制密码"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
                {apply.deviceType === "人脸门禁" && (
                  <p className="mt-2 text-[10px] text-gray-500">
                    人脸不下发短信；密码仅页面展示
                  </p>
                )}
              </div>
            )}

            {apply.deviceType === "挂锁门禁" &&
              apply.credential.status === "DELIVERY_FAILED" && (
              <button
                type="button"
                className="mt-3 w-full rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white active:opacity-90"
                onClick={handleResendSms}
              >
                重新下发短信
              </button>
            )}

            {credentialInvalid && (
              <p className="mt-2 text-xs text-gray-500">
                {apply.credential.invalidReason ??
                  (apply.credential.status === "SUPERSEDED"
                    ? "设备密码已被更新，原密码已失效"
                    : "凭证已失效，无法查看密码")}
              </p>
            )}
          </SectionCard>
          </PrototypeAnnotationTarget>
        )}
      </div>

      {apply.status === "PENDING" && apply.needsApproval && (
        <PrototypeAnnotationTarget annotationIds={["my-unlock-apply-detail-h5-withdraw"]}>
        <div className="shrink-0 border-t bg-white px-3.5 py-3 pb-safe">
          {!withdrawOpen ? (
            <button
              type="button"
              className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-800 active:bg-gray-50"
              onClick={() => setWithdrawOpen(true)}
            >
              撤回申请
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-center text-gray-500">
                确认撤回该开锁申请？撤回后审批人将无法继续处理。
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl border py-3 text-sm font-semibold text-gray-700"
                  onClick={() => setWithdrawOpen(false)}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white"
                  onClick={handleWithdraw}
                >
                  确认撤回
                </button>
              </div>
            </div>
          )}
        </div>
        </PrototypeAnnotationTarget>
      )}

      <Toast message={toast} />
    </MobileShell>
  )
}
