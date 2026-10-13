import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Download } from "lucide-react"

type ExportRecordsDialogProps = {
  open: boolean
  orderNo?: string
  onClose: () => void
  onExport: () => void
}

const EXPORT_COLUMNS = [
  "入库单号",
  "入库日期",
  "货主名称",
  "货主标识",
  "入库类型",
  "仓库名称",
  "入库库房",
  "入库分区",
  "具体位置",
  "货品大类",
  "品类",
  "规格",
  "堆放数量",
  "计量单位",
  "存货条码",
  "制单人",
  "制单时间",
]

export function ExportRecordsDialog({
  open,
  orderNo,
  onClose,
  onExport,
}: ExportRecordsDialogProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>([...EXPORT_COLUMNS])

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    )
  }

  const selectAll = () => setSelectedFields([...EXPORT_COLUMNS])
  const clearAll = () => setSelectedFields([])

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-emerald-600" />
            <DialogTitle>下载记录 - 导出明细清单</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-sm">
          {orderNo && (
            <div className="rounded-md bg-muted/40 p-2.5 text-xs text-muted-foreground">
              当前目标单据：<span className="font-mono font-medium text-foreground">{orderNo}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">选择导出字段：</span>
            <div className="space-x-2 text-xs">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={selectAll}
              >
                全选
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                type="button"
                className="text-muted-foreground hover:underline"
                onClick={clearAll}
              >
                清空
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-lg border p-3 text-xs sm:grid-cols-3">
            {EXPORT_COLUMNS.map((col) => {
              const checked = selectedFields.includes(col)
              return (
                <label
                  key={col}
                  className="flex cursor-pointer items-center gap-1.5 rounded p-1 hover:bg-muted/40"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleField(col)}
                    className="size-3.5 rounded border-gray-300 text-primary"
                  />
                  <span className={checked ? "font-medium text-foreground" : "text-muted-foreground"}>
                    {col}
                  </span>
                </label>
              )
            })}
          </div>

          <p className="text-[11px] text-muted-foreground">
            导出格式：.xlsx（包含该入库单完整的多库位理货堆放明细与监管台账条码）
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            取消
          </Button>
          <Button
            size="sm"
            disabled={selectedFields.length === 0}
            onClick={() => {
              onExport()
              onClose()
            }}
          >
            <Download className="mr-1 size-4" />
            确认导出
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
