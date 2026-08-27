import { useMemo } from "react"
import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DeviceWarningEvent } from "../domain/types"
import { getTriggerTimelineForEvent } from "../lib/timeline-utils"
import { WarningStatusBadge } from "./WarningStatusBadge"

type TriggerHistoryDrawerProps = {
  open: boolean
  event: DeviceWarningEvent | null
  onOpenChange: (open: boolean) => void
  onSnapshotPreview?: (sequence: number) => void
}

export function TriggerHistoryDrawer({
  open,
  event,
  onOpenChange,
  onSnapshotPreview,
}: TriggerHistoryDrawerProps) {
  const timeline = useMemo(
    () => (event ? getTriggerTimelineForEvent(event) : []),
    [event]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="fixed inset-y-0 right-0 left-auto top-0 flex h-full w-full max-w-xl translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-l p-0 sm:max-w-xl"
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>
            触发历史时间轴 — {event?.ruleName ?? "—"} (共{" "}
            {event?.triggerCount ?? 0} 次)
          </DialogTitle>
          {event && (
            <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-3">
              <span>规则: {event.ruleName}</span>
              <span>设备: {event.deviceName}</span>
              <span className="flex items-center gap-2">
                状态: <WarningStatusBadge event={event} />
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-[170px]">触发时间</TableHead>
                <TableHead>采集值/事实</TableHead>
                <TableHead className="w-[100px]">抓拍</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeline.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    暂无触发历史
                  </TableCell>
                </TableRow>
              ) : (
                timeline.map((entry) => (
                  <TableRow key={entry.sequence}>
                    <TableCell>{entry.sequence}</TableCell>
                    <TableCell>{entry.triggeredAt}</TableCell>
                    <TableCell>{entry.collectedValue}</TableCell>
                    <TableCell>
                      {entry.snapshotAvailable ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0"
                          onClick={() => onSnapshotPreview?.(entry.sequence)}
                        >
                          <ImageIcon className="size-4" />
                          预览
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-0 flex-col items-start gap-3 border-t bg-muted/30 px-6 py-4 sm:flex-col sm:items-stretch">
          <p className="text-xs text-muted-foreground">
            频次累加期间不重复发送通知；升级计时以首次预警时间为准。
          </p>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
