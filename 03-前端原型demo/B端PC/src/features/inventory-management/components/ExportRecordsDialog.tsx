import React, { useMemo, useState } from "react"
import { Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ExportRecordItem } from "../domain/types"

interface ExportRecordsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  records: ExportRecordItem[]
}

const STATUS_TEXT: Record<ExportRecordItem["status"], string> = {
  SUCCESS: "成功",
  GENERATING: "生成中",
  FAILED: "失败",
}

function getPageNumbers(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)
}

export const ExportRecordsDialog: React.FC<ExportRecordsDialogProps> = ({
  open,
  onOpenChange,
  records,
}) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return records.slice(start, start + pageSize)
  }, [records, currentPage, pageSize])

  const handleDownload = (record: ExportRecordItem) => {
    alert(`【模拟安全下载】正在下载文件：${record.fileName}\n记录行数：${record.recordCount}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">导出记录</DialogTitle>
        </DialogHeader>

        <div className="mt-2 overflow-hidden rounded-md border border-[#ebeef5]">
          <table className="w-full border-collapse text-sm text-[#4e5969]">
            <thead>
              <tr className="h-11 bg-[#f5f7fa] text-[#606266]">
                <th className="w-16 px-3 text-center font-medium">序号</th>
                <th className="px-4 text-left font-medium">文件名</th>
                <th className="w-[190px] px-4 text-left font-medium">操作人</th>
                <th className="w-[180px] px-4 text-left font-medium">时间</th>
                <th className="w-[100px] px-4 text-left font-medium">状态</th>
                <th className="w-[90px] px-4 text-center font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-muted-foreground">
                    暂无历史导出记录
                  </td>
                </tr>
              ) : (
                pageRecords.map((item, index) => (
                  <tr key={item.id} className="border-t border-[#ebeef5] align-middle">
                    <td className="px-3 py-4 text-center">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="whitespace-normal break-all px-4 py-4 text-foreground">
                      {item.fileName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      {item.creator}（{item.creatorOrg}）
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">{item.createTime}</td>
                    <td className="px-4 py-4">{STATUS_TEXT[item.status]}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-center">
                      {item.status === "SUCCESS" ? (
                        <button
                          type="button"
                          onClick={() => handleDownload(item)}
                          className="inline-flex cursor-pointer items-center gap-1 text-primary hover:underline"
                        >
                          <Download className="size-3.5" />
                          下载
                        </button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 弹窗内分页 */}
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3 text-sm text-[#606266]">
          <div>共 {records.length} 条</div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setPage(1)
              }}
            >
              <SelectTrigger className="h-8 w-28 whitespace-nowrap text-sm">
                <SelectValue>{pageSize} 条/页</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} 条/页
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              type="button"
              className="h-8 w-8 cursor-pointer rounded border border-[#ebeef5] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              &lt;
            </button>

            {getPageNumbers(currentPage, totalPages).map((pageNumber, index, list) => {
              const previous = list[index - 1]
              return (
                <React.Fragment key={pageNumber}>
                  {previous !== undefined && pageNumber - previous > 1 && (
                    <span className="px-1 text-muted-foreground">…</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={
                      pageNumber === currentPage
                        ? "h-8 min-w-8 cursor-pointer rounded bg-primary px-2 text-primary-foreground"
                        : "h-8 min-w-8 cursor-pointer rounded border border-[#ebeef5] px-2 hover:border-primary/50"
                    }
                  >
                    {pageNumber}
                  </button>
                </React.Fragment>
              )
            })}

            <button
              type="button"
              className="h-8 w-8 cursor-pointer rounded border border-[#ebeef5] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              &gt;
            </button>

            <span className="ml-2">前往</span>
            <Select value={String(currentPage)} onValueChange={(value) => setPage(Number(value))}>
              <SelectTrigger className="h-8 w-16 text-sm">
                <SelectValue>{currentPage}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <SelectItem key={pageNumber} value={String(pageNumber)}>
                    {pageNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>页</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
