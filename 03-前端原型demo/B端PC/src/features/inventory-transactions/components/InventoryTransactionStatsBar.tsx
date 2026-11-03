import React from "react"
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface InventoryTransactionStatsBarProps {
  inTotalQty: number
  inCount: number
  outTotalQty: number
  outCount: number
}

const cardStyle = { paddingTop: 10, paddingBottom: 10 }

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  meta,
  valueClassName,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  unit: string
  meta: string
  valueClassName?: string
}) {
  return (
    <Card style={cardStyle}>
      <CardContent className="flex flex-col gap-1 px-4">
        <div className="flex items-center gap-2">
          <Icon className="size-4 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap text-sm text-muted-foreground">{label}</span>
          <span
            className={`whitespace-nowrap text-xl font-semibold leading-none tabular-nums ${
              valueClassName ?? "text-foreground"
            }`}
          >
            {value}
          </span>
          <span className="whitespace-nowrap text-sm text-muted-foreground">{unit}</span>
        </div>
        <div className="pl-6 text-[13px] text-muted-foreground">{meta}</div>
      </CardContent>
    </Card>
  )
}

export const InventoryTransactionStatsBar: React.FC<InventoryTransactionStatsBarProps> = ({
  inTotalQty,
  inCount,
  outTotalQty,
  outCount,
}) => {
  const netQty = inTotalQty - outTotalQty

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        icon={ArrowDownLeft}
        label="入库单届数"
        value={`${inCount}`}
        unit="笔"
        meta={`入库数量 ${inTotalQty.toFixed(4)} 吨`}
      />
      <StatCard
        icon={ArrowUpRight}
        label="出库单届数"
        value={`${outCount}`}
        unit="笔"
        meta={`出库数量 ${outTotalQty.toFixed(4)} 吨`}
      />
      <StatCard
        icon={TrendingUp}
        label="存量净变动"
        value={netQty >= 0 ? `+${netQty.toFixed(3)}` : netQty.toFixed(3)}
        unit="吨"
        meta={`总计 ${inCount + outCount} 笔流水`}
        valueClassName={netQty >= 0 ? "text-emerald-700" : "text-rose-600"}
      />
    </div>
  )
}
