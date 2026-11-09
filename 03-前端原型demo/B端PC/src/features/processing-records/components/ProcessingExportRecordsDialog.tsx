import { useState } from "react"
import { FileSpreadsheet, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProcessingExportRecordsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalCount: number
}

const EXPORT_COLUMNS = [
  "加工单号",
  "货主名称/标识",
  "加工类型",
  "加工日期",
  "仓库名称",
  "关联单号",
  "计划投入货物明细",
  "实际投入货物明细",
  "计划产出货物明细",
  "实际产出货物明细",
  "单据状态",
  "制单人/时间",
  "损耗比例与原因",
  "操作修改记录",
]

export function ProcessingExportRecordsDialog({
  open,
  onOpenChange,
  totalCount,
}: ProcessingExportRecordsDialogProps) {
  const [selectedCols, setSelectedCols] = useState<string[]>([...EXPORT_COLUMNS])
  const [exporting, setExporting] = useState(false)

  const handleToggleCol = (col: string) => {
    setSelectedCols((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    )
  }

  const handleSelectAll = () => {
    if (selectedCols.length === EXPORT_COLUMNS.length) {
      setSelectedCols([])
    } else {
      setSelectedCols([...EXPORT_COLUMNS])
    }
  }

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            导出加工记录台账
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            将当前筛选出的 {totalCount} 条加工单据流水导出为 Excel 电子表格文件。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">选择导出字段列</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-primary"
              onClick={handleSelectAll}
            >
              {selectedCols.length === EXPORT_COLUMNS.length ? "取消全选" : "全选"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-md border border-border/80 p-3 max-h-56 overflow-y-auto">
            {EXPORT_COLUMNS.map((col) => (
              <label
                key={col}
                className="flex items-center gap-2 text-xs text-foreground cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCols.includes(col)}
                  onChange={() => handleToggleCol(col)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={selectedCols.length === 0 || exporting}
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1" />
            {exporting ? "导出生成中..." : "确认导出"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
