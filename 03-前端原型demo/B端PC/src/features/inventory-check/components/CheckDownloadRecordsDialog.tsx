import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import type { CheckDownloadRecord } from "../domain/types"

interface CheckDownloadRecordsDialogProps {
  open: boolean
  records: CheckDownloadRecord[]
  onOpenChange: (open: boolean) => void
  onDownload: (record: CheckDownloadRecord) => void
}

export function CheckDownloadRecordsDialog({
  open,
  records,
  onOpenChange,
  onDownload,
}: CheckDownloadRecordsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-50 text-amber-600">
                <FileText className="h-4 w-4" />
              </span>
              盘点报告下载记录
            </span>
            <span className="text-xs font-normal text-slate-400">
              共 {records.length} 个文件
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[380px] overflow-y-auto border border-slate-200 rounded-lg dark:border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 sticky top-0 z-10 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th className="w-12 px-3 py-2 text-center">序号</th>
                <th className="px-3 py-2">文件名称</th>
                <th className="w-24 px-3 py-2">生成人员</th>
                <th className="w-36 px-3 py-2">生成时间</th>
                <th className="w-20 px-3 py-2">大小</th>
                <th className="w-20 px-3 py-2 text-center">状态</th>
                <th className="w-20 px-3 py-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    暂无生成记录，请点击右上角【生成报告】
                  </td>
                </tr>
              ) : (
                records.map((rec, index) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-center text-slate-500">{index + 1}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                        <span className="break-all">{rec.fileName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{rec.creator}</td>
                    <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{rec.createTime}</td>
                    <td className="px-3 py-2.5 text-slate-500">{rec.fileSize}</td>
                    <td className="px-3 py-2.5 text-center">
                      {rec.status === "SUCCESS" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          已就绪
                        </span>
                      ) : rec.status === "GENERATING" ? (
                        <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          生成中
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                          <AlertCircle className="h-3.5 w-3.5" />
                          失败
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={rec.status !== "SUCCESS"}
                        onClick={() => onDownload(rec)}
                        className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
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

