import { InfoIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { formatWan } from "../domain/constants"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

interface SupervisionStatsCardsProps {
  total: number
  activeCount: number
  /** 随标签页动态映射：抵押中 / 质押中 / 监管中 */
  activeLabel: string
  valueTotal: number
  unpricedCount: number
  riskCount: number
  onRiskClick: () => void
}

function StatCard({
  label,
  value,
  extra,
  onClick,
  className,
}: {
  label: string
  value: string
  extra?: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  const content = (
    <CardContent className="flex flex-col gap-1 px-4 py-0">
      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <span className="whitespace-nowrap">{label}</span>
        {extra}
      </div>
      <div className="text-2xl font-semibold leading-tight tracking-tight text-foreground tabular-nums">
        {value}
      </div>
    </CardContent>
  )

  if (onClick) {
    return (
      <Card
        size="sm"
        className={cn(
          "cursor-pointer py-3 transition-colors hover:bg-[#F5F7FA]",
          className,
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            onClick()
          }
        }}
      >
        {content}
      </Card>
    )
  }

  return (
    <Card size="sm" className={cn("py-3", className)}>
      {content}
    </Card>
  )
}

/** 顶层四大看板：随业务 Tab 联动刷新 */
export function SupervisionStatsCards({
  total,
  activeCount,
  activeLabel,
  valueTotal,
  unpricedCount,
  riskCount,
  onRiskClick,
}: SupervisionStatsCardsProps) {
  return (
    <PrototypeAnnotationTarget annotationIds={["supervision-management-stats"]}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="全部单据" value={String(total)} />
        <StatCard label={activeLabel} value={String(activeCount)} />
        <StatCard
          label="货物评估价值总额(万)"
          value={formatWan(valueTotal) ?? "0"}
          extra={
            <Tooltip>
              <TooltipTrigger
                render={<span />}
                className="inline-flex cursor-help items-center text-muted-foreground/80 hover:text-foreground"
                aria-label="货物评估价值口径说明"
              >
                <InfoIcon className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                统计当前标签页下所有在押订单的货物评估价值累计总额。
                {unpricedCount > 0
                  ? `其中 ${unpricedCount} 笔订单含未定价货品，未定价部分不计入总额。`
                  : "当前没有未定价货品。"}
              </TooltipContent>
            </Tooltip>
          }
        />
        <StatCard
          label="存在风险"
          value={String(riskCount)}
          onClick={onRiskClick}
          className="group"
          extra={
            <span className="text-xs text-muted-foreground/70 transition-colors group-hover:text-primary">
              点击筛选 ›
            </span>
          }
        />
      </div>
    </PrototypeAnnotationTarget>
  )
}
