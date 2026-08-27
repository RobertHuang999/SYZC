import { PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
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
            按二维码/批次逐条配置超时天数，至少填写一条；未填写的批次不参与触发
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onChange([
              ...rows,
              updateTimeoutRow(
                {
                  rowId: `manual-${Date.now()}`,
                  batchId: `manual-${Date.now()}`,
                  warningType: warningTypeOptions[0] ?? "解抵/质押超时",
                  qrCode: "",
                  goodsLabel: "",
                  pledgedAt: "",
                  timeoutDays: "",
                  expectedTriggerAt: null,
                },
                {}
              ),
            ])
          }}
        >
          <PlusIcon className="size-4" />
          添加批次
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">预警类型</TableHead>
              <TableHead className="min-w-[140px]">二维码/批次</TableHead>
              <TableHead className="min-w-[180px]">货物</TableHead>
              <TableHead className="min-w-[150px]">成功时间</TableHead>
              <TableHead className="min-w-[100px]">超时天数</TableHead>
              <TableHead className="min-w-[150px]">预计触发</TableHead>
              <TableHead className="w-16">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  请先选择关联订单，系统将拉取订单内可识别的二维码/批次
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const isManual = row.batchId.startsWith("manual-")

                return (
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
                    <TableCell>
                      <Input
                        value={row.qrCode}
                        readOnly={!isManual}
                        placeholder="二维码编号"
                        className="h-8"
                        onChange={(event) =>
                          patchRow(row.rowId, { qrCode: event.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.goodsLabel}
                        readOnly={!isManual}
                        placeholder="货物摘要"
                        className="h-8"
                        onChange={(event) =>
                          patchRow(row.rowId, { goodsLabel: event.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.pledgedAt}
                        readOnly={!isManual}
                        placeholder="2026-08-01 08:00"
                        className="h-8"
                        onChange={(event) =>
                          patchRow(row.rowId, { pledgedAt: event.target.value })
                        }
                      />
                    </TableCell>
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
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={rows.length <= 1}
                        onClick={() =>
                          onChange(rows.filter((item) => item.rowId !== row.rowId))
                        }
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
