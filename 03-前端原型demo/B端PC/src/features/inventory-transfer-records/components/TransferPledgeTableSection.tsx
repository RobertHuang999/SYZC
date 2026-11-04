import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import type { PledgeGoodsFormItem } from "../domain/form-types"
import { warehouseZonesMock } from "../mock/transfer-form.mock"

interface Props {
  items: PledgeGoodsFormItem[]
  relatedId: string
  onChange: (updatedItems: PledgeGoodsFormItem[]) => void
}

export function TransferPledgeTableSection({
  items,
  relatedId,
  onChange,
}: Props) {
  const allSelected = items.length > 0 && items.every((i) => i.selected)

  const handleSelectAll = (checked: boolean) => {
    onChange(items.map((i) => ({ ...i, selected: checked })))
  }

  const handleToggleRow = (id: string, checked: boolean) => {
    onChange(
      items.map((i) => (i.id === id ? { ...i, selected: checked } : i))
    )
  }

  const handleAmountChange = (id: string, amount: number) => {
    onChange(
      items.map((i) =>
        i.id === id
          ? { ...i, transferAmount: Math.max(0, Math.min(amount, i.availableAmount)) }
          : i
      )
    )
  }

  const handleTargetChange = (
    id: string,
    field: "targetRoomZone" | "targetSpecificLocation",
    val: string
  ) => {
    onChange(
      items.map((i) => (i.id === id ? { ...i, [field]: val } : i))
    )
  }

  // 仓库库位下拉选项（仅同仓允许）
  const warehouseId = items[0]?.sourceWarehouseId
  const currentWarehouse = warehouseZonesMock.find((w) => w.id === warehouseId)
  const zoneOptions: { label: string; value: string }[] = []
  if (currentWarehouse) {
    for (const room of currentWarehouse.rooms) {
      for (const zone of room.zones) {
        zoneOptions.push({
          label: `${room.name} - ${zone.name}`,
          value: `${currentWarehouse.name}-${room.name}-${zone.name}`,
        })
      }
    }
  }

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="py-3 px-6 border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="text-base font-semibold text-foreground">
          监管货物明细（质押/抵押关联单平铺表格）
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          由关联监管单号【{relatedId || "未选"}】自动带出在押货物，仅勾选行纳入本次调拨申请。
        </p>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <PrototypeSpecCallout>
          【抵押质押移库关联单号与货权继承】(R04)：抵押/质押移库禁止自行添加无关货品，直接平铺关联单项下所有货物；仅勾选行参与移库与试算。
        </PrototypeSpecCallout>

        {items.length === 0 ? (
          <div className="py-12 border-2 border-dashed rounded-lg text-center text-muted-foreground text-sm">
            请先在基础信息中选择有效的【关联单号】以自动带出受押存货明细
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <Table className="text-xs">
              <TableHeader className="bg-slate-50 dark:bg-slate-800">
                <TableRow>
                  <TableHead className="w-12 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="size-4 rounded border-border text-primary cursor-pointer align-middle"
                    />
                  </TableHead>
                  <TableHead className="w-12 text-center">序号</TableHead>
                  <TableHead className="w-48">货物名称</TableHead>
                  <TableHead className="w-48">原所在位置</TableHead>
                  <TableHead className="w-24">原具体位置</TableHead>
                  <TableHead className="w-24 text-right">可用数量</TableHead>
                  <TableHead className="w-32 text-center">
                    <span className="text-red-500">*</span> 移库数量
                  </TableHead>
                  <TableHead className="w-56">
                    <span className="text-red-500">*</span> 移入库房/分区
                  </TableHead>
                  <TableHead className="w-40">移入具体位置</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      item.selected ? "bg-amber-50/30 dark:bg-amber-950/10" : ""
                    }`}
                  >
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) => handleToggleRow(item.id, e.target.checked)}
                        className="size-4 rounded border-border text-primary cursor-pointer align-middle"
                      />
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {item.goodsName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.sourceRoomZone}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {item.sourceSpecificLocation || "--"}
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {item.availableAmount} {item.unit}
                    </TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        min="0.001"
                        max={item.availableAmount}
                        step="0.001"
                        disabled={!item.selected}
                        value={item.transferAmount || ""}
                        onChange={(e) =>
                          handleAmountChange(
                            item.id,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="h-7 text-xs text-center w-24 mx-auto"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={!item.selected}
                        value={item.targetRoomZone}
                        onValueChange={(val) =>
                          handleTargetChange(item.id, "targetRoomZone", val)
                        }
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="请选择目标库位" />
                        </SelectTrigger>
                        <SelectContent>
                          {zoneOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        disabled={!item.selected}
                        value={item.targetSpecificLocation}
                        onChange={(e) =>
                          handleTargetChange(
                            item.id,
                            "targetSpecificLocation",
                            e.target.value.slice(0, 140)
                          )
                        }
                        placeholder="具体架位/垛位"
                        className="h-7 text-xs"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
