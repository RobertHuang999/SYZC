import React from "react"
import { Download, FileSpreadsheet, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ExportRecordItem } from "../domain/types"

interface ExportRecordsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  records: ExportRecordItem[]
}

export const ExportRecordsDialog: React.FC<ExportRecordsDialogProps> = ({
  open,
  onOpenChange,
  records,
}) => {
  const handleDownload = (record: ExportRecordItem) => {
    alert(`【模拟安全下载】正在下载文件：${record.fileName}\n记录行数：${record.recordCount}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <span>导出记录追溯</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            查看当前租户历史已生成的异步存货报表，任务生成完成后支持安全下载（保留 30 天）。
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[420px] overflow-y-auto mt-2 border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr className="h-10">
                <th className="px-3 py-2 min-w-[200px]">报表文件名</th>
                <th className="px-3 py-2 min-w-[90px]">导出维度</th>
                <th className="px-3 py-2 min-w-[70px] text-right">记录数</th>
                <th className="px-3 py-2 min-w-[80px] text-right">文件大小</th>
                <th className="px-3 py-2 min-w-[130px]">操作人 / 机构</th>
                <th className="px-3 py-2 min-w-[140px]">导出时间</th>
                <th className="px-3 py-2 min-w-[80px] text-center">状态</th>
                <th className="px-3 py-2 w-20 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="h-24 text-center text-slate-400">
                    暂无历史导出记录
                  </td>
                </tr>
              ) : (
                records.map((item) => (
                  <tr key={item.id} className="h-12 hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-900 truncate max-w-[220px]" title={item.fileName}>
                        {item.fileName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                        {item.filterSummary}
                      </div>
                    </td>

                    <td className="px-3 py-2 text-slate-700">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-[11px]">
                        {item.viewDimension}
                      </span>
                    </td>

                    <td className="px-3 py-2 text-right text-slate-800 font-medium">
                      {item.recordCount}
                    </td>

                    <td className="px-3 py-2 text-right text-slate-600">
                      {item.fileSize}
                    </td>

                    <td className="px-3 py-2">
                      <div className="text-slate-800">{item.creator}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[130px]" title={item.creatorOrg}>
                        {item.creatorOrg}
                      </div>
                    </td>

                    <td className="px-3 py-2 text-slate-600 text-[11px]">
                      {item.createTime}
                    </td>

                    <td className="px-3 py-2 text-center">
                      {item.status === "SUCCESS" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          已完成
                        </span>
                      )}
                      {item.status === "GENERATING" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                          <Clock className="h-3.5 w-3.5 animate-spin" />
                          生成中
                        </span>
                      )}
                      {item.status === "FAILED" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-medium">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          失败
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={item.status !== "SUCCESS"}
                        onClick={() => handleDownload(item)}
                        className="h-7 px-2 text-xs text-primary hover:text-primary gap-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        下载
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

