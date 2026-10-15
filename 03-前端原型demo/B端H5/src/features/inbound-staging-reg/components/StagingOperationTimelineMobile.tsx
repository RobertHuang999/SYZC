import type { InboundStagingReg } from "@prototype/shared/inbound/inbound-staging.mock"
import { resolveStagingOperationLogs } from "@prototype/shared/inbound/staging-operation-logs"
import { mapStagingLogToAuditStep } from "@prototype/shared/inbound/staging-operation-display"

type Props = {
  reg: InboundStagingReg
  /** Tab 内嵌时不重复外层卡片标题 */
  embedded?: boolean
}

/** 排版对齐 H5 入库记录详情 · 审核记录 Tab */
export function StagingOperationTimelineMobile({ reg, embedded = false }: Props) {
  const steps = resolveStagingOperationLogs(reg).map(mapStagingLogToAuditStep)

  const body =
    steps.length === 0 ? (
      <p className="py-6 text-center text-xs text-[#232D39]/40">暂无操作记录</p>
    ) : (
      <div className="space-y-3 text-xs">
        {steps.map((step) => (
          <div key={step.id} className="border-b border-[#232D39]/5 pb-2 last:border-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#232D39]">{step.node}</span>
              <span className="text-[#232D39]/50">{step.time}</span>
            </div>
            <p className="mt-1 text-[#232D39]/70">
              {step.action}
              {step.opinion ? `：${step.opinion}` : ""}
            </p>
            <p className="mt-0.5 text-[11px] text-[#232D39]/50">{step.actor}</p>
          </div>
        ))}
      </div>
    )

  if (embedded) {
    return (
      <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
        {body}
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
      <h3 className="mb-2.5 text-sm font-semibold text-[#232D39]">流转时间轴</h3>
      {body}
    </section>
  )
}
