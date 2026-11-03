import React from "react"
import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface InventoryMetricCardsProps {
  viewMode: "repo" | "goods" | "owner"
}

const cardStyle = { paddingTop: 10, paddingBottom: 10 }

function MetricCard({
  label,
  value,
  tooltip,
}: {
  label: string
  value: string
  tooltip?: React.ReactNode
}) {
  return (
    <Card className="h-full" style={cardStyle}>
      <CardContent className="flex h-full items-center gap-2 px-3">
        <span className="shrink-0 whitespace-nowrap text-sm text-muted-foreground">{label}</span>
        {tooltip}
        <span className="whitespace-nowrap text-xl font-semibold leading-none tabular-nums text-foreground">
          {value}
        </span>
      </CardContent>
    </Card>
  )
}

export const InventoryMetricCards: React.FC<InventoryMetricCardsProps> = ({ viewMode }) => {
  const totalPriceCard = (
    <MetricCard
      label="总价"
      value="19,753.8750 万元"
      tooltip={
        <Tooltip>
          <TooltipTrigger>
            <AlertCircle className="h-3.5 w-3.5 cursor-help text-amber-500" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            当前存在未定价特种物资（稀有金属-航空钛合金棒材-TC4-X），货值暂未计入总价
          </TooltipContent>
        </Tooltip>
      }
    />
  )

  const varietyCard = <MetricCard label="货品种类(个)" value="8" />
  const warehouseCard = <MetricCard label="仓库数量(个)" value="7" />
  const ownerCard = <MetricCard label="货主数量(位)" value="7" />

  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${
        viewMode === "repo" ? "lg:grid-cols-4" : "lg:grid-cols-5"
      }`}
    >
      {viewMode === "repo" && (
        <>
          <div className="sm:col-span-2">{totalPriceCard}</div>
          {varietyCard}
          {warehouseCard}
        </>
      )}

      {viewMode === "goods" && (
        <>
          <div className="sm:col-span-2">{totalPriceCard}</div>
          {varietyCard}
          {warehouseCard}
          {ownerCard}
        </>
      )}

      {viewMode === "owner" && (
        <>
          <div className="sm:col-span-2">{totalPriceCard}</div>
          {ownerCard}
          {varietyCard}
          {warehouseCard}
        </>
      )}
    </div>
  )
}
