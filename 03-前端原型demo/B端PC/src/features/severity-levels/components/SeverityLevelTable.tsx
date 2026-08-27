import { useState } from "react"
import { GripVerticalIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { Badge } from "@/components/ui/badge"
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
import type { SeverityLevelRecord } from "../domain/types"

type SeverityLevelTableProps = {
  records: SeverityLevelRecord[]
  onEdit: (record: SeverityLevelRecord) => void
  onDelete: (record: SeverityLevelRecord) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
}

export function SeverityLevelTable({
  records,
  onEdit,
  onDelete,
  onReorder,
}: SeverityLevelTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (index: number, event: React.DragEvent) => {
    setDraggedIndex(index)
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", String(index))
  }

  const handleDragOver = (index: number, event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (index: number, event: React.DragEvent) => {
    event.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder?.(draggedIndex, index)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }
  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12" />
            <TableHead className="w-16">序号</TableHead>
            <TableHead className="w-24">等级编码</TableHead>
            <TableHead className="w-28">显示名称</TableHead>
            <TableHead className="w-24">标签颜色</TableHead>
            <TableHead className="w-32">同步至订单预警</TableHead>
            <TableHead className="w-24">是否启用</TableHead>
            <TableHead className="w-40">等级说明</TableHead>
            <TableHead className="w-36">更新人/时间</TableHead>
            <TableHead className="w-28">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                暂无预警等级，点击「+ 新增等级」创建第一档
              </TableCell>
            </TableRow>
          ) : (
            records.map((record, index) => (
              <TableRow
                key={record.levelId}
                draggable
                onDragStart={(e) => handleDragStart(index, e)}
                onDragOver={(e) => handleDragOver(index, e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(index, e)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "transition-colors",
                  draggedIndex === index && "opacity-40 bg-muted/60",
                  dragOverIndex === index && "border-t-2 border-t-primary bg-primary/5"
                )}
              >
                <TableCell className="cursor-grab active:cursor-grabbing">
                  <GripVerticalIcon className="size-4 text-muted-foreground hover:text-foreground" />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Link
                    to={`/预警配置/预警等级/详情/${record.levelId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {record.severityCode}
                  </Link>
                </TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[120px]"
                    content={record.displayName}
                    ariaLabel={`显示名称：${record.displayName}`}
                  >
                    <Link
                      to={`/预警配置/预警等级/详情/${record.levelId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {record.displayName}
                    </Link>
                  </HoverOverflowText>
                </TableCell>
                <TableCell>
                  <span
                    className="inline-block size-3 rounded-full"
                    style={{ backgroundColor: record.labelColor }}
                    aria-label={record.displayName}
                  />
                </TableCell>
                <TableCell>{record.syncToOrderWarning ? "是" : "否"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      record.enabled
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }
                  >
                    {record.enabled ? "是" : "否"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <HoverOverflowText
                    className="max-w-[160px]"
                    ariaLabel={`等级说明：${record.description ?? "—"}`}
                  >
                    {record.description ?? "—"}
                  </HoverOverflowText>
                </TableCell>
                <TableCell>
                  {record.updatedBy} / {record.updatedAt}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => onEdit(record)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-destructive"
                      onClick={() => onDelete(record)}
                    >
                      删除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
