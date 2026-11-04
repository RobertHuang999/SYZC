import { useState } from "react"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  TRANSFER_TYPE_OPTIONS,
} from "../domain/constants"
import type { TransferRecordFilters } from "../domain/types"
import { warehouseZonesMock } from "../mock/transfer-form.mock"

interface Props {
  draftFilters: TransferRecordFilters
  onDraftChange: (filters: TransferRecordFilters) => void
  onSearch: () => void
  onAdd: () => void
}

export function TransferRecordFiltersPanel({
  draftFilters,
  onDraftChange,
  onSearch,
  onAdd,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const updateField = (field: keyof TransferRecordFilters, value: string) => {
    onDraftChange({
      ...draftFilters,
      [field]: value,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <Card className="shadow-sm border-border">
      <CardContent className="space-y-4 pt-4">
        {/* 顶部工具栏：筛选条件标头 + 展开/收起 + 新增移库 + 查询（无重置） */}
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
          onSearch={onSearch}
          onAdd={onAdd}
          addLabel="新增移库"
        />

        {/* 默认露出第 1 行 4 项（业务主维度） */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. 移库单号 */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-muted-foreground">移库单号</label>
            <Input
              value={draftFilters.id}
              onChange={(e) => updateField("id", e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入移库单号"
              className="h-[34px] text-sm"
            />
          </div>

          {/* 2. 移库类型 */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-muted-foreground">移库类型</label>
            <Select
              value={draftFilters.transferType}
              onValueChange={(val) => val != null && updateField("transferType", val)}
            >
              <SelectTrigger className="h-[34px] text-sm">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                {TRANSFER_TYPE_OPTIONS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3. 货主名称/标识 */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-muted-foreground">货主名称/标识</label>
            <Input
              value={draftFilters.ownerNameOrIdentity}
              onChange={(e) => updateField("ownerNameOrIdentity", e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入货主名称或社会信用代码/手机号"
              className="h-[34px] text-sm"
            />
          </div>

          {/* 4. 仓库名称 */}
          <div className="space-y-1">
            <label className="text-xs font-normal text-muted-foreground">仓库名称</label>
            <Select
              value={draftFilters.warehouseId}
              onValueChange={(val) => val != null && updateField("warehouseId", val)}
            >
              <SelectTrigger className="h-[34px] text-sm">
                <SelectValue placeholder="请选择仓库" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">全部仓库</SelectItem>
                {warehouseZonesMock.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 展开筛选：第 2 行 4 项 */}
        {expanded && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-1 border-t border-border/50">
            {/* 5. 货品名称 */}
            <div className="space-y-1">
              <label className="text-xs font-normal text-muted-foreground">货品名称</label>
              <Input
                value={draftFilters.goodsName}
                onChange={(e) => updateField("goodsName", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请输入大类/品类/规格"
                className="h-[34px] text-sm"
              />
            </div>

            {/* 6. 制单人 */}
            <div className="space-y-1">
              <label className="text-xs font-normal text-muted-foreground">制单人</label>
              <Select
                value={draftFilters.createBy}
                onValueChange={(val) => val != null && updateField("createBy", val)}
              >
                <SelectTrigger className="h-[34px] text-sm">
                  <SelectValue placeholder="请选择制单人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">全部制单人</SelectItem>
                  <SelectItem value="USR-0891">王铁柱(中储无锡运营中心)</SelectItem>
                  <SelectItem value="USR-0622">老陈(常州生鲜仓储部)</SelectItem>
                  <SelectItem value="USR-0455">李志刚(青岛港保税运营组)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 7. 移库日期 */}
            <div className="space-y-1">
              <label className="text-xs font-normal text-muted-foreground">移库日期范围</label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={draftFilters.transferStartDate}
                  onChange={(e) => updateField("transferStartDate", e.target.value)}
                  className="h-[34px] text-xs px-2"
                />
                <span className="text-muted-foreground text-xs">至</span>
                <Input
                  type="date"
                  value={draftFilters.transferEndDate}
                  onChange={(e) => updateField("transferEndDate", e.target.value)}
                  className="h-[34px] text-xs px-2"
                />
              </div>
            </div>

            {/* 8. 制单时间 */}
            <div className="space-y-1">
              <label className="text-xs font-normal text-muted-foreground">制单时间范围</label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={draftFilters.createStartDate}
                  onChange={(e) => updateField("createStartDate", e.target.value)}
                  className="h-[34px] text-xs px-2"
                />
                <span className="text-muted-foreground text-xs">至</span>
                <Input
                  type="date"
                  value={draftFilters.createEndDate}
                  onChange={(e) => updateField("createEndDate", e.target.value)}
                  className="h-[34px] text-xs px-2"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

