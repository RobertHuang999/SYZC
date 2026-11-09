import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WarningFilterHeader } from "@/components/business/WarningListPrimitives"
import {
  PROCESSING_RECORD_ADD_PATH,
  PROCESSING_STATUS_OPTIONS,
  PROCESSING_TYPE_OPTIONS,
} from "../domain/constants"
import type { ProcessingRecordFilters } from "../domain/types"

interface ProcessingRecordFiltersPanelProps {
  draftFilters: ProcessingRecordFilters
  onDraftChange: (filters: ProcessingRecordFilters) => void
  onSearch: () => void
  onReset: () => void
}

export function ProcessingRecordFiltersPanel({
  draftFilters,
  onDraftChange,
  onSearch,
  onReset,
}: ProcessingRecordFiltersPanelProps) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardContent className="space-y-4 pt-4">
        {/* 筛选头 */}
        <WarningFilterHeader
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
          onSearch={onSearch}
          onReset={onReset}
          onAdd={() => navigate(PROCESSING_RECORD_ADD_PATH)}
          addLabel="新增加工"
        />

        {/* 默认常驻 4 项筛选 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. 加工单号 */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-muted-foreground">加工单号</label>
            <Input
              value={draftFilters.id || ""}
              placeholder="请输入加工单号"
              className="h-[34px] text-xs"
              onChange={(e) => onDraftChange({ ...draftFilters, id: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 2. 加工日期 */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-muted-foreground">加工日期</label>
            <div className="flex items-center gap-1.5">
              <Input
                type="date"
                value={draftFilters.processingTimeRange?.[0] || ""}
                className="h-[34px] text-xs px-2"
                onChange={(e) =>
                  onDraftChange({
                    ...draftFilters,
                    processingTimeRange: [
                      e.target.value,
                      draftFilters.processingTimeRange?.[1] || "",
                    ],
                  })
                }
              />
              <span className="text-xs text-muted-foreground">至</span>
              <Input
                type="date"
                value={draftFilters.processingTimeRange?.[1] || ""}
                className="h-[34px] text-xs px-2"
                onChange={(e) =>
                  onDraftChange({
                    ...draftFilters,
                    processingTimeRange: [
                      draftFilters.processingTimeRange?.[0] || "",
                      e.target.value,
                    ],
                  })
                }
              />
            </div>
          </div>

          {/* 3. 货主名称/标识 */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-muted-foreground">货主名称/标识</label>
            <Input
              value={draftFilters.ownerKeyword || ""}
              placeholder="请输入货主名称或社会信用代码/手机号"
              className="h-[34px] text-xs"
              onChange={(e) =>
                onDraftChange({ ...draftFilters, ownerKeyword: e.target.value })
              }
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* 4. 加工类型 */}
          <div className="space-y-1.5">
            <label className="text-xs font-normal text-muted-foreground">加工类型</label>
            <Select
              value={draftFilters.processingType || "ALL"}
              onValueChange={(val) =>
                onDraftChange({
                  ...draftFilters,
                  processingType: val === "ALL" ? "" : (val as any),
                })
              }
            >
              <SelectTrigger className="h-[34px] text-xs">
                <SelectValue>
                  {(val) =>
                    PROCESSING_TYPE_OPTIONS.find((item) => (item.value || "ALL") === val)
                      ?.label ?? "全部"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PROCESSING_TYPE_OPTIONS.map((item) => (
                  <SelectItem key={item.value || "ALL"} value={item.value || "ALL"}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 展开区 5 项筛选 */}
        {expanded && (
          <div className="grid gap-4 border-t border-dashed border-border/60 pt-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* 5. 仓库名称 */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">仓库名称</label>
              <Input
                value={draftFilters.warehouseName || ""}
                placeholder="请输入实体仓库名称"
                className="h-[34px] text-xs"
                onChange={(e) =>
                  onDraftChange({ ...draftFilters, warehouseName: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* 6. 货品名称 */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">货品名称</label>
              <Input
                value={draftFilters.goodsKeyword || ""}
                placeholder="请输入投入或产出货品名称"
                className="h-[34px] text-xs"
                onChange={(e) =>
                  onDraftChange({ ...draftFilters, goodsKeyword: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* 7. 单据状态 */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">单据状态</label>
              <Select
                value={draftFilters.status || "ALL"}
                onValueChange={(val) =>
                  onDraftChange({
                    ...draftFilters,
                    status: val === "ALL" ? "" : (val as any),
                  })
                }
              >
                <SelectTrigger className="h-[34px] text-xs">
                  <SelectValue>
                    {(val) =>
                      PROCESSING_STATUS_OPTIONS.find((item) => (item.value || "ALL") === val)
                        ?.label ?? "全部"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PROCESSING_STATUS_OPTIONS.map((item) => (
                    <SelectItem key={item.value || "ALL"} value={item.value || "ALL"}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 8. 制单人 */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground">制单人</label>
              <Input
                value={draftFilters.createBy || ""}
                placeholder="请输入制单人姓名"
                className="h-[34px] text-xs"
                onChange={(e) =>
                  onDraftChange({ ...draftFilters, createBy: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* 9. 制单时间 */}
            <div className="space-y-1.5 lg:col-span-2">
              <label className="text-xs font-normal text-muted-foreground">制单时间</label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={draftFilters.createTimeRange?.[0] || ""}
                  className="h-[34px] text-xs px-2"
                  onChange={(e) =>
                    onDraftChange({
                      ...draftFilters,
                      createTimeRange: [
                        e.target.value,
                        draftFilters.createTimeRange?.[1] || "",
                      ],
                    })
                  }
                />
                <span className="text-xs text-muted-foreground">至</span>
                <Input
                  type="date"
                  value={draftFilters.createTimeRange?.[1] || ""}
                  className="h-[34px] text-xs px-2"
                  onChange={(e) =>
                    onDraftChange({
                      ...draftFilters,
                      createTimeRange: [
                        draftFilters.createTimeRange?.[0] || "",
                        e.target.value,
                      ],
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
