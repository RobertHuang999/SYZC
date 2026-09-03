import { useMemo } from "react"
import { ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getRowActions } from "../domain/actions"
import type { DeviceWarningEvent } from "../domain/types"
import {
  formatLatestWarningTime,
  formatWarningContent,
} from "../lib/event-utils"
import { WarningStatusBadge } from "./WarningStatusBadge"

type DeviceWarningEventTableProps = {
  events: DeviceWarningEvent[]
  page: number
  pageSize: number
  onRelease: (event: DeviceWarningEvent) => void
  onFrequencyClick: (event: DeviceWarningEvent) => void
}

export function DeviceWarningEventTable({
  events,
  page,
  pageSize,
  onRelease,
  onFrequencyClick,
}: DeviceWarningEventTableProps) {
  const rows = useMemo(() => events, [events])

  return (
    <div className="overflow-visible rounded-md border bg-card">
      <Table className="min-w-[1160px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-[140px]">规则名称</TableHead>
            <TableHead className="w-[100px]">预警等级</TableHead>
            <TableHead className="w-[120px]">预警类型</TableHead>
            <TableHead className="w-[200px]">预警内容/设备</TableHead>
            <TableHead className="w-16 text-center">抓拍</TableHead>
            <TableHead className="w-[100px]">预警次数</TableHead>
            <TableHead className="w-[100px]">状态</TableHead>
            <TableHead className="w-[140px]">最近时间</TableHead>
            <TableHead className="w-[120px] min-w-[120px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            rows.map((event, index) => (
              <DeviceWarningEventRow
                key={event.eventId}
                event={event}
                index={(page - 1) * pageSize + index + 1}
                onRelease={onRelease}
                onFrequencyClick={onFrequencyClick}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function DeviceWarningEventRow({
  event,
  index,
  onRelease,
  onFrequencyClick,
}: {
  event: DeviceWarningEvent
  index: number
  onRelease: (event: DeviceWarningEvent) => void
  onFrequencyClick: (event: DeviceWarningEvent) => void
}) {
  const actions = getRowActions(event)
  const content = formatWarningContent(event)
  const snapshotCount =
    event.snapshotImageStatus === "available" ? event.triggerCount : 0

  return (
    <TableRow>
      <TableCell>{index}</TableCell>
      <TableCell>
        <HoverOverflowText
          className="max-w-[140px]"
          content={event.ruleName}
          ariaLabel={`规则名称：${event.ruleName}`}
        >
          <Link
            to={`/物联网IOT与预警/预警信息/设备预警信息/详情/${event.eventId}`}
            className="font-medium text-primary hover:underline"
          >
            {event.ruleName}
          </Link>
        </HoverOverflowText>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className="inline-block size-2.5 rounded-full"
            style={{ backgroundColor: event.severityColor }}
          />
          <span>
            {event.severityCode} {event.severityName}
          </span>
        </div>
      </TableCell>
      <TableCell>{event.warningType}</TableCell>
      <TableCell>
        <HoverOverflowText
          className="max-w-[200px]"
          ariaLabel={`预警内容/设备：${content}`}
        >
          {content}
        </HoverOverflowText>
      </TableCell>
      <TableCell className="text-center">
        {event.snapshotImageStatus === "available" ? (
          <span className="inline-flex items-center justify-center gap-0.5 text-primary">
            <ImageIcon className="size-4" aria-label="查看大图" />
            {snapshotCount > 1 && (
              <span className="text-xs leading-none">({snapshotCount})</span>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <button
          type="button"
          className={cn(
            "text-left hover:underline",
            event.triggerCount > 1 && "font-semibold text-orange-600"
          )}
          onClick={() => onFrequencyClick(event)}
        >
          {event.triggerCount}次
        </button>
      </TableCell>
      <TableCell>
        <WarningStatusBadge event={event} />
      </TableCell>
      <TableCell>{formatLatestWarningTime(event.latestWarningTime)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {actions.includes("release") && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => onRelease(event)}
            >
              解除
            </Button>
          )}
          <Link
            to={`/物联网IOT与预警/预警信息/设备预警信息/详情/${event.eventId}`}
            className="text-sm text-primary hover:underline"
          >
            详情
          </Link>
        </div>
      </TableCell>
    </TableRow>
  )
}
