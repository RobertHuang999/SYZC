import { PlusIcon, Trash2Icon } from "lucide-react"
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
import { OrgUserSelect } from "@/shared/components/OrgUserSelect"
import type { InspectionConfigRow } from "../domain/types"
import {
  createEmptyInspectionRow,
  updateInspectionRow,
} from "../lib/inspection-config-utils"

type InspectionConfigTableProps = {
  rows: InspectionConfigRow[]
  onChange: (rows: InspectionConfigRow[]) => void
}

export function InspectionConfigTable({
  rows,
  onChange,
}: InspectionConfigTableProps) {
  const patchRow = (rowId: string, patch: Partial<InspectionConfigRow>) => {
    onChange(
      rows.map((row) =>
        row.rowId === rowId ? updateInspectionRow(row, patch) : row
      )
    )
  }

  const addRow = () => {
    onChange([...rows, createEmptyInspectionRow()])
  }

  const removeRow = (rowId: string) => {
    if (rows.length <= 1) return
    onChange(rows.filter((row) => row.rowId !== rowId))
  }

  return (
    <div className="space-y-3 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">
            <span className="text-destructive font-bold mr-1">*</span>
            巡检责任人配置
          </p>
          <p className="text-xs text-muted-foreground">
            按组织架构选择巡检人，支持配置多人；每人可设置独立巡检周期（天），超期未巡检分别触发预警
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <PlusIcon className="size-3.5" />
          添加巡检人
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">序号</TableHead>
              <TableHead className="min-w-[260px]">巡检人</TableHead>
              <TableHead className="min-w-[220px]">巡检周期</TableHead>
              <TableHead className="w-20">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.rowId}>
                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <OrgUserSelect
                    value={row.inspector ? [row.inspector] : []}
                    onChange={(targets) =>
                      patchRow(row.rowId, {
                        inspector: targets[targets.length - 1] ?? "",
                      })
                    }
                    maxSelection={1}
                    showSelectedTags={false}
                    placeholder="按组织架构选择巡检人"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm text-muted-foreground">每</span>
                    <Input
                      type="number"
                      min={1}
                      value={row.cycleDays}
                      placeholder="天数"
                      className="h-8 w-24"
                      onChange={(event) =>
                        patchRow(row.rowId, { cycleDays: event.target.value })
                      }
                    />
                    <span className="shrink-0 text-sm text-muted-foreground">
                      天超期预警
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive hover:text-destructive"
                    disabled={rows.length <= 1}
                    onClick={() => removeRow(row.rowId)}
                  >
                    <Trash2Icon className="size-3.5" />
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
