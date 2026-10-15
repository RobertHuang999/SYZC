import { CheckCircle2 } from "lucide-react"
import { DetailSection } from "@/shared/components/DetailSection"
import type { InboundStagingReg } from "../domain/types"
import { resolveStagingOperationLogs } from "@prototype/shared/inbound/staging-operation-logs"
import { mapStagingLogToAuditStep } from "@prototype/shared/inbound/staging-operation-display"

type Props = {
  reg: InboundStagingReg
  embedded?: boolean
}

function AuditTimelineBody({ reg }: { reg: InboundStagingReg }) {
  const steps = resolveStagingOperationLogs(reg).map(mapStagingLogToAuditStep)

  if (steps.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">暂无操作记录</p>
  }

  return (
    <div className="relative space-y-6 py-2 pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
      {steps.map((step) => (
        <div key={step.id} className="relative flex items-start gap-3 text-xs">
          <div className="absolute -left-6 mt-1 flex size-5 items-center justify-center rounded-full bg-primary text-white">
            <CheckCircle2 className="size-3.5" />
          </div>
          <div className="flex-1 space-y-1 rounded-md border bg-muted/20 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{step.node}</span>
              <span className="text-muted-foreground">{step.time}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>处理人：{step.actor}</span>
              <span>
                操作动作：<strong className="text-foreground">{step.action}</strong>
              </span>
            </div>
            {step.opinion ? (
              <p className="mt-1.5 rounded border border-border/50 bg-card p-2 text-foreground/90">
                情况说明：{step.opinion}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

/** 排版对齐入库记录详情 · 审核记录 Tab */
export function StagingOperationTimeline({ reg, embedded = false }: Props) {
  if (embedded) {
    return (
      <div className="space-y-4">
        <AuditTimelineBody reg={reg} />
      </div>
    )
  }

  return (
    <DetailSection title="操作记录">
      <div className="col-span-full">
        <AuditTimelineBody reg={reg} />
      </div>
    </DetailSection>
  )
}
