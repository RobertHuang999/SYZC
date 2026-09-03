import { ImageIcon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
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
import { formatDateTime } from "@/shared/lib/date-utils"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { getRowActions } from "../domain/actions"
import type { CollateralWarningEvent } from "../domain/types"
import { CollateralWarningStatusBadge } from "./CollateralWarningStatusBadge"

type CollateralWarningTableProps = {
  events: CollateralWarningEvent[]
  page: number
  pageSize: number
  onPublish: (event: CollateralWarningEvent) => void
  onRelease: (event: CollateralWarningEvent) => void
}

export function CollateralWarningTable({
  events,
  page,
  pageSize,
  onPublish,
  onRelease,
}: CollateralWarningTableProps) {
  const navigate = useNavigate()

  return (
    <div className="overflow-visible rounded-md border bg-card">
      <Table className="min-w-[1440px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-[120px]">预警订单</TableHead>
            <TableHead className="w-[120px]">预警类型</TableHead>
            <TableHead className="w-[100px]">预警等级</TableHead>
            <TableHead className="w-[110px]">预警来源</TableHead>
            <TableHead className="w-[200px]">预警内容</TableHead>
            <TableHead className="w-16 text-center">抓拍</TableHead>
            <TableHead className="w-[110px]">预警时间</TableHead>
            <TableHead className="w-[110px]">处理时间</TableHead>
            <TableHead className="w-[80px]">是否公示</TableHead>
            <TableHead className="w-[120px]">处理人</TableHead>
            <TableHead className="w-[110px]">状态</TableHead>
            <TableHead className="w-[140px] min-w-[140px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={13}
                className="h-32 text-center text-muted-foreground"
              >
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            events.map((event, index) => {
              const actions = getRowActions(event)

              return (
                <TableRow key={event.eventId}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>
                    <Link
                      to={`/物联网IOT与预警/预警信息/押品预警信息/详情/${event.eventId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {event.orderNo}
                    </Link>
                  </TableCell>
                  <TableCell>{event.warningType}</TableCell>
                  <TableCell>
                    <SeverityLevelDisplay
                      severityCode={event.severityCode}
                      severityName={event.severityName}
                      severityColor={event.severityColor}
                    />
                  </TableCell>
                  <TableCell>{event.warningSource}</TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[200px]"
                      ariaLabel={`预警内容：${event.warningContent}`}
                    >
                      {event.warningContent}
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell className="text-center">
                    {event.snapshotImageStatus === "available" ? (
                      <ImageIcon
                        className="mx-auto size-4 text-primary"
                        aria-label="查看大图"
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(event.warningTime)}</TableCell>
                  <TableCell>{formatDateTime(event.processedTime)}</TableCell>
                  <TableCell>{event.publicityStatus}</TableCell>
                  <TableCell>
                    <HoverOverflowText
                      className="max-w-[120px]"
                      ariaLabel={`处理人：${event.processedBy ?? "—"}`}
                    >
                      {event.processedBy ?? "—"}
                    </HoverOverflowText>
                  </TableCell>
                  <TableCell>
                    <CollateralWarningStatusBadge event={event} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      {actions.includes("release") && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => onRelease(event)}
                        >
                          解除预警
                        </Button>
                      )}
                      {actions.includes("viewDevice") && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => {
                            const deviceEventId = event.deviceEventId ?? "evt-017"
                            const returnRoute = `/物联网IOT与预警/预警信息/押品预警信息/详情/${event.eventId}`
                            navigate(
                              `/物联网IOT与预警/预警信息/设备预警信息/详情/${deviceEventId}?device_event_id=${encodeURIComponent(deviceEventId)}&warn_id=${encodeURIComponent(event.eventId)}&return_route=${encodeURIComponent(returnRoute)}`
                            )
                          }}
                        >
                          看设备
                        </Button>
                      )}
                      {actions.includes("publish") && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => onPublish(event)}
                        >
                          公示风险
                        </Button>
                      )}
                      <Link
                        to={`/物联网IOT与预警/预警信息/押品预警信息/详情/${event.eventId}`}
                        className="text-sm text-primary hover:underline"
                      >
                        详情
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
