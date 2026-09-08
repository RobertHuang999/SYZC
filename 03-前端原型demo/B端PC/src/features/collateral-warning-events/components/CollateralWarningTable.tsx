import { useState } from "react"
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
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { TableDateTimeCell, TableProcessedInfoCell } from "@/shared/components/TableCells"
import { SnapshotImageModal, type SnapshotPreviewData } from "@/shared/components/SnapshotImageModal"
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
  const [previewImage, setPreviewImage] = useState<SnapshotPreviewData | null>(null)

  return (
    <>
      <div className="overflow-visible rounded-md border bg-card">
        <Table className="min-w-[1320px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">序号</TableHead>
              <TableHead className="w-[130px]">预警订单</TableHead>
              <TableHead className="w-[120px]">预警类型</TableHead>
              <TableHead className="w-[110px]">预警等级</TableHead>
              <TableHead className="w-[110px]">预警来源</TableHead>
              <TableHead className="w-[210px]">预警内容</TableHead>
              <TableHead className="w-16 text-center">抓拍</TableHead>
              <TableHead className="w-[130px]">预警时间</TableHead>
              <TableHead className="w-[140px]">处理信息</TableHead>
              <TableHead className="w-[90px]">是否公示</TableHead>
              <TableHead className="w-[110px]">状态</TableHead>
              <TableHead className="w-[140px] min-w-[140px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
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
                        className="font-medium text-primary hover:underline font-mono"
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
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-medium ${
                          event.warningSource === "物联穿透"
                            ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                            : "bg-blue-50 text-blue-700 border border-blue-200/60"
                        }`}
                      >
                        {event.warningSource}
                      </span>
                    </TableCell>
                    <TableCell>
                      <HoverOverflowText
                        className="max-w-[210px]"
                        ariaLabel={`预警内容：${event.warningContent}`}
                      >
                        {event.warningContent}
                      </HoverOverflowText>
                    </TableCell>
                    <TableCell className="text-center">
                      {event.snapshotImageStatus === "available" ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewImage({
                              title: `预警触发监控抓拍图 — 订单 ${event.orderNo}`,
                              desc: `触发类型：${event.warningType} | 触发时间：${event.warningTime}`,
                              time: event.warningTime,
                              location: "质押货位监控区",
                            })
                          }
                          className="inline-flex items-center justify-center p-1 rounded hover:bg-muted text-primary cursor-pointer transition-colors"
                          title="查看抓拍大图"
                        >
                          <ImageIcon className="size-4" />
                        </button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <TableDateTimeCell value={event.warningTime} plain />
                    </TableCell>
                    <TableCell>
                      <TableProcessedInfoCell
                        processedBy={event.processedBy}
                        processedTime={event.processedTime}
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                          event.publicityStatus === "已公示"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {event.publicityStatus}
                      </span>
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

      <SnapshotImageModal
        data={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  )
}
