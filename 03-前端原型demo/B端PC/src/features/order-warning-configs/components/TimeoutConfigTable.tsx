import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { OrderType, TimeoutConfigRow, TimeoutWarningType } from "../domain/types"
import {
  getTimeoutWarningTypeOptions,
  updateTimeoutRow,
} from "../lib/timeout-config-utils"

type TimeoutConfigTableProps = {
  rows: TimeoutConfigRow[]
  orderType: OrderType | ""
  onChange: (rows: TimeoutConfigRow[]) => void
}

export function TimeoutConfigTable({
  rows,
  orderType,
  onChange,
}: TimeoutConfigTableProps) {
  const warningTypeOptions = getTimeoutWarningTypeOptions(orderType)
  const showQrCodeColumn = rows.some((row) => row.qrCode.trim())
  const showPledgedAtColumn = rows.some((row) => row.pledgedAt.trim())
  const columnCount =
    4 + Number(showQrCodeColumn) + Number(showPledgedAtColumn)

  const patchRow = (rowId: string, patch: Partial<TimeoutConfigRow>) => {
    onChange(
      rows.map((row) =>
        row.rowId === rowId ? updateTimeoutRow(row, patch) : row
      )
    )
  }

  return (
    <div className="space-y-3 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">超时配置列表</p>
          <p className="text-xs text-muted-foreground">
            订单选择后自动带出全部货物行，仅填写超时天数；至少填写一条，未填写的货物不参与触发
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">预警类型</TableHead>
              {showQrCodeColumn && (
                <TableHead className="min-w-[140px]">二维码/批次</TableHead>
              )}
              <TableHead className="min-w-[180px]">货物</TableHead>
              {showPledgedAtColumn && (
                <TableHead className="min-w-[150px]">成功时间</TableHead>
              )}
              <TableHead className="min-w-[100px]">超时天数</TableHead>
              <TableHead className="min-w-[150px]">预计触发</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="text-center text-muted-foreground">
                  请先选择关联订单，系统将自动带出订单内的货物行
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.rowId}>
                  <TableCell>
                    <Select
                      value={row.warningType}
                      onValueChange={(value) => {
                        if (value !== null) {
                          patchRow(row.rowId, {
                            warningType: value as TimeoutWarningType,
                          })
                        }
                      }}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {warningTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  {showQrCodeColumn && (
                    <TableCell>
                      {row.qrCode.trim() ? (
                        <Input value={row.qrCode} readOnly className="h-8" />
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Input
                      value={row.goodsLabel}
                      readOnly
                      placeholder="货物摘要"
                      className="h-8"
                    />
                  </TableCell>
                  {showPledgedAtColumn && (
                    <TableCell>
                      {row.pledgedAt.trim() ? (
                        <Input value={row.pledgedAt} readOnly className="h-8" />
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={row.timeoutDays}
                      placeholder="天数"
                      className="h-8"
                      onChange={(event) =>
                        patchRow(row.rowId, { timeoutDays: event.target.value })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.expectedTriggerAt ?? "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
