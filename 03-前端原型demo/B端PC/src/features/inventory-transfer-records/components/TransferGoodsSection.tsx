import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Layers,
  QrCode,
} from "lucide-react"
import { PrototypeSpecCallout } from "@/components/form/PrototypeSpecCallout"
import type {
  TransferFormGoodsGroup,
  TransferFormGoodsItem,
} from "../domain/form-types"
import { TransferGoodsPickerModal } from "./TransferGoodsPickerModal"
import { BatchTransferModal } from "./BatchTransferModal"
import { warehouseZonesMock } from "../mock/transfer-form.mock"

interface Props {
  groups: TransferFormGoodsGroup[]
  onChange: (updatedGroups: TransferFormGoodsGroup[]) => void
}

export function TransferGoodsSection({ groups, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [batchTargetGroup, setBatchTargetGroup] =
    useState<TransferFormGoodsGroup | null>(null)

  // 展开/收起主行
  const toggleExpand = (groupId: string) => {
    onChange(
      groups.map((g) => (g.id === groupId ? { ...g, expanded: !g.expanded } : g))
    )
  }

  // 移除一级主行
  const handleRemoveGroup = (groupId: string) => {
    onChange(groups.filter((g) => g.id !== groupId))
  }

  // 移除二级明细
  const handleRemoveDetail = (groupId: string, detailId: string) => {
    const updated = groups
      .map((g) => {
        if (g.id !== groupId) return g
        const filtered = g.details.filter((d) => d.id !== detailId)
        return {
          ...g,
          details: filtered,
        }
      })
      .filter((g) => g.details.length > 0)
    onChange(updated)
  }

  // 修改二级明细移库数量
  const handleDetailAmountChange = (
    groupId: string,
    detailId: string,
    amount: number
  ) => {
    onChange(
      groups.map((g) => {
        if (g.id !== groupId) return g
        return {
          ...g,
          details: g.details.map((d) =>
            d.id === detailId
              ? {
                  ...d,
                  transferAmount: Math.max(0, Math.min(amount, d.availableAmount)),
                }
              : d
          ),
        }
      })
    )
  }

  // 修改二级明细目标储位
  const handleDetailTargetChange = (
    groupId: string,
    detailId: string,
    field: "targetRoomZone" | "targetSpecificLocation",
    val: string
  ) => {
    onChange(
      groups.map((g) => {
        if (g.id !== groupId) return g
        return {
          ...g,
          details: g.details.map((d) =>
            d.id === detailId ? { ...d, [field]: val } : d
          ),
        }
      })
    )
  }

  // 确认选货回填
  const handlePickerConfirm = (selectedItems: TransferFormGoodsItem[]) => {
    const existing = [...groups]

    for (const item of selectedItems) {
      let grp = existing.find(
        (g) =>
          g.goodsName === item.goodsName &&
          g.warehouseId === item.sourceWarehouseId
      )
      if (!grp) {
        grp = {
          id: `GRP-${item.goodsName}-${item.sourceWarehouseId}-${Date.now()}`,
          goodsName: item.goodsName,
          warehouseId: item.sourceWarehouseId,
          warehouseName: item.sourceWarehouseName,
          unit: item.unit,
          expanded: true,
          details: [],
        }
        existing.push(grp)
      }

      // 避免重复添加同一库存明细
      const exists = grp.details.some((d) => d.candidateId === item.candidateId)
      if (!exists) {
        grp.details.push(item)
      }
    }

    onChange(existing)
  }

  // 批量移库一键覆盖
  const handleBatchConfirm = (
    targetRoomZone: string,
    targetSpecificLocation: string
  ) => {
    if (!batchTargetGroup) return

    onChange(
      groups.map((g) => {
        if (g.id !== batchTargetGroup.id) return g
        return {
          ...g,
          details: g.details.map((d) => ({
            ...d,
            targetRoomZone,
            targetSpecificLocation,
          })),
        }
      })
    )
    setBatchTargetGroup(null)
  }

  const existingWarehouseId = groups[0]?.warehouseId

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="py-3 px-6 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            货品明细（普通移库折叠树形）
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            一级为主货品行，二级展开储位明细；支持部分移库与【批量移库】统一覆盖。
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => setPickerOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs font-medium"
        >
          <Plus className="size-4 mr-1" />
          添加货品
        </Button>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <PrototypeSpecCallout>
          【普通移库选货折叠与批量设置】(R03)：一级主行可一键展开/收起；【批量移库】可统一设置目标库房分区及具体位置覆盖全部二级明细。
        </PrototypeSpecCallout>

        {groups.length === 0 ? (
          <div className="py-12 border-2 border-dashed rounded-lg text-center text-muted-foreground text-sm space-y-2">
            <div>暂无移库货物明细</div>
            <div className="text-xs">
              请点击右上角【添加货品】从库存中选择要移库的货品与储位
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group, gIdx) => {
              const currentWarehouse = warehouseZonesMock.find(
                (w) => w.id === group.warehouseId
              )
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

              const groupTotalAmount = group.details.reduce(
                (sum, d) => sum + (Number(d.transferAmount) || 0),
                0
              )

              return (
                <div
                  key={group.id}
                  className="rounded-lg border border-border overflow-hidden bg-card"
                >
                  {/* 一级主行 */}
                  <div className="bg-slate-100/80 dark:bg-slate-800/80 px-4 py-2.5 flex items-center justify-between text-sm border-b border-border">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExpand(group.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {group.expanded ? (
                          <ChevronDown className="size-4" />
                        ) : (
                          <ChevronRight className="size-4" />
                        )}
                      </button>
                      <span className="text-xs text-muted-foreground">
                        #{gIdx + 1}
                      </span>
                      <span className="font-semibold text-foreground">
                        {group.goodsName}
                      </span>
                      <span className="text-xs text-muted-foreground bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-border">
                        所属仓库: {group.warehouseName}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-xs">
                        总移库量：
                        <span className="font-semibold text-primary">
                          {Math.round(groupTotalAmount * 1000) / 1000}{" "}
                          {group.unit}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setBatchTargetGroup(group)}
                        className="h-7 text-xs px-2"
                      >
                        <Layers className="size-3.5 mr-1" />
                        批量移库
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGroup(group.id)}
                        className="h-7 text-xs px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        移除
                      </Button>
                    </div>
                  </div>

                  {/* 二级展开明细表格 */}
                  {group.expanded && (
                    <div className="overflow-x-auto">
                      <Table className="text-xs">
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                          <TableRow>
                            <TableHead className="w-48">原位置 (移出)</TableHead>
                            <TableHead className="w-24">原具体位置</TableHead>
                            <TableHead className="w-32">入库时间</TableHead>
                            <TableHead className="w-24 text-right">可用数量</TableHead>
                            <TableHead className="w-32 text-center">
                              <span className="text-red-500">*</span> 移库数量
                            </TableHead>
                            <TableHead className="w-56">
                              <span className="text-red-500">*</span> 移入库房/分区
                            </TableHead>
                            <TableHead className="w-40">移入具体位置</TableHead>
                            <TableHead className="w-16 text-center">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.details.map((detail) => (
                            <TableRow
                              key={detail.id}
                              className="hover:bg-slate-50/60 transition-colors"
                            >
                              {/* 移出位置 */}
                              <TableCell className="text-muted-foreground font-normal">
                                {detail.sourceRoomZone}
                              </TableCell>
                              {/* 移出具体位置 */}
                              <TableCell className="text-foreground">
                                {detail.sourceSpecificLocation || "--"}
                              </TableCell>
                              {/* 入库时间 */}
                              <TableCell className="text-muted-foreground">
                                {detail.inboundTime}
                              </TableCell>
                              {/* 可用数量 */}
                              <TableCell className="text-right font-medium text-foreground">
                                {detail.availableAmount} {detail.unit}
                              </TableCell>
                              {/* 移库数量 */}
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="0.001"
                                  max={detail.availableAmount}
                                  step="0.001"
                                  value={detail.transferAmount || ""}
                                  onChange={(e) =>
                                    handleDetailAmountChange(
                                      group.id,
                                      detail.id,
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="h-7 text-xs text-center w-24 mx-auto"
                                />
                              </TableCell>
                              {/* 移入库房/分区 */}
                              <TableCell>
                                <Select
                                  value={detail.targetRoomZone}
                                  onValueChange={(val) =>
                                    handleDetailTargetChange(
                                      group.id,
                                      detail.id,
                                      "targetRoomZone",
                                      val
                                    )
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
                              {/* 移入具体位置 */}
                              <TableCell>
                                <Input
                                  value={detail.targetSpecificLocation}
                                  onChange={(e) =>
                                    handleDetailTargetChange(
                                      group.id,
                                      detail.id,
                                      "targetSpecificLocation",
                                      e.target.value.slice(0, 140)
                                    )
                                  }
                                  placeholder="具体架位/垛位"
                                  className="h-7 text-xs"
                                />
                              </TableCell>
                              {/* 操作 */}
                              <TableCell className="text-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveDetail(group.id, detail.id)
                                  }
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 选货弹窗 */}
        <TransferGoodsPickerModal
          open={pickerOpen}
          existingWarehouseId={existingWarehouseId}
          onClose={() => setPickerOpen(false)}
          onConfirm={handlePickerConfirm}
        />

        {/* 批量移库统一覆盖弹窗 */}
        {batchTargetGroup && (
          <BatchTransferModal
            open={!!batchTargetGroup}
            warehouseId={batchTargetGroup.warehouseId}
            goodsName={batchTargetGroup.goodsName}
            onClose={() => setBatchTargetGroup(null)}
            onConfirm={handleBatchConfirm}
          />
        )}
      </CardContent>
    </Card>
  )
}

