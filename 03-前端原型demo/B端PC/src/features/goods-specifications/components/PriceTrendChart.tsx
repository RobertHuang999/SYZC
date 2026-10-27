import { useId, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatTrendDate } from "../lib/format"
import type { PriceTrendPoint } from "../domain/types"

const PERIOD_OPTIONS = [
  { value: 7, label: "近 7 天" },
  { value: 15, label: "近 15 天" },
  { value: 30, label: "近 30 天" },
] as const

type PriceTrendChartProps = {
  points: PriceTrendPoint[]
  unit: string
  className?: string
  initialPeriod?: 7 | 15 | 30
}

export function PriceTrendChart({
  points,
  unit,
  className,
  initialPeriod = 15,
}: PriceTrendChartProps) {
  const [period, setPeriod] = useState<7 | 15 | 30>(initialPeriod)
  const gradientId = useId()

  const visiblePoints = useMemo(
    () => points.slice(-period),
    [points, period]
  )

  const chart = useMemo(() => {
    if (visiblePoints.length === 0) return null
    const width = 760
    const height = 280
    const padding = { top: 18, right: 24, bottom: 32, left: 72 }
    const innerWidth = width - padding.left - padding.right
    const innerHeight = height - padding.top - padding.bottom

    const values = visiblePoints.map((point) => point.price)
    const rawMin = Math.min(...values)
    const rawMax = Math.max(...values)
    const span = Math.max(rawMax - rawMin, rawMax * 0.01, 0.01)
    const min = rawMin - span * 0.15
    const max = rawMax + span * 0.15

    const xOf = (index: number) =>
      padding.left +
      (visiblePoints.length === 1
        ? innerWidth / 2
        : (index / (visiblePoints.length - 1)) * innerWidth)
    const yOf = (price: number) =>
      padding.top + ((max - price) / (max - min)) * innerHeight

    const coordinates = visiblePoints.map((point, index) => ({
      ...point,
      x: xOf(index),
      y: yOf(point.price),
    }))

    const linePath = coordinates
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
      .join(" ")
    const areaPath = `${linePath} L${coordinates[coordinates.length - 1].x},${
      padding.top + innerHeight
    } L${coordinates[0].x},${padding.top + innerHeight} Z`

    const gridLines = [0, 1, 2, 3, 4].map((index) => {
      const ratio = index / 4
      const value = max - (max - min) * ratio
      return {
        y: padding.top + innerHeight * ratio,
        value,
      }
    })

    return {
      width,
      height,
      padding,
      innerHeight,
      coordinates,
      linePath,
      areaPath,
      gridLines,
      lastPoint: coordinates[coordinates.length - 1],
    }
  }, [visiblePoints])

  const valueFormatter = new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          价格单位：元/{unit}，最多展示近 30 天
        </div>
        <div className="inline-flex rounded-lg border bg-background p-0.5">
          {PERIOD_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="xs"
              variant={period === option.value ? "secondary" : "ghost"}
              className="rounded-md"
              onClick={() => setPeriod(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {!chart ? (
        <div className="flex h-56 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          暂无价格趋势数据，设置价格后自动生成
        </div>
      ) : (
        <div className="rounded-lg border bg-background p-3">
          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            className="h-auto w-full"
            role="img"
            aria-label={`近 ${period} 天参考单价趋势`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {chart.gridLines.map((line) => (
              <g key={line.y}>
                <line
                  x1={chart.padding.left}
                  x2={chart.width - chart.padding.right}
                  y1={line.y}
                  y2={line.y}
                  stroke="var(--border)"
                  strokeDasharray="3 4"
                />
                <text
                  x={chart.padding.left - 10}
                  y={line.y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--muted-foreground)"
                >
                  {valueFormatter.format(line.value)}
                </text>
              </g>
            ))}

            <path d={chart.areaPath} fill={`url(#${gradientId})`} />
            <path
              d={chart.linePath}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chart.coordinates.map((point, index) => {
              const isLast = index === chart.coordinates.length - 1
              return (
                <g key={point.date}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isLast ? 4.5 : 3}
                    fill="var(--background)"
                    stroke="var(--primary)"
                    strokeWidth="2"
                  >
                    <title>{`${point.date}：${valueFormatter.format(point.price)} 元/${unit}`}</title>
                  </circle>
                  {isLast ? (
                    <text
                      x={point.x - 6}
                      y={point.y - 12}
                      textAnchor="end"
                      fontSize="11"
                      fontWeight="600"
                      fill="var(--foreground)"
                    >
                      {valueFormatter.format(point.price)}
                    </text>
                  ) : null}
                </g>
              )
            })}

            <line
              x1={chart.padding.left}
              x2={chart.width - chart.padding.right}
              y1={chart.height - chart.padding.bottom}
              y2={chart.height - chart.padding.bottom}
              stroke="var(--border)"
            />

            {[0, Math.floor(chart.coordinates.length / 2), chart.coordinates.length - 1]
              .filter((index, position, array) => array.indexOf(index) === position)
              .map((index) => {
                const point = chart.coordinates[index]
                return (
                  <text
                    key={`label-${point.date}`}
                    x={point.x}
                    y={chart.height - 10}
                    textAnchor={
                      index === 0
                        ? "start"
                        : index === chart.coordinates.length - 1
                          ? "end"
                          : "middle"
                    }
                    fontSize="11"
                    fill="var(--muted-foreground)"
                  >
                    {formatTrendDate(point.date)}
                  </text>
                )
              })}
          </svg>
        </div>
      )}
    </div>
  )
}
