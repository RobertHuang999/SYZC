import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { TransferRecord, DownloadLogItem } from "../domain/types"
import { downloadLogsMock } from "../mock/transfer-records.mock"

interface Props {
  open: boolean
  record: TransferRecord | null
  onClose: () => void
}

export function TransferDownloadRecordsDialog({ open, record, onClose }: Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  if (!record) return null

  const logs: DownloadLogItem[] = downloadLogsMock[record.id] || [
    {
      id: "LOG-DEFAULT",
      fileName: `移库记录_${record.ownerName}_${record.id.slice(-6)}.pdf`,
      operator: `${record.createByName}(${record.createOrgName})`,
      createTime: record.transferTime,
      status: "SUCCESS",
    },
  ]

  const handleDownloadFile = (item: DownloadLogItem) => {
    setDownloadingId(item.id)
    setTimeout(() => {
      setDownloadingId(null)
      const blob = new Blob(
        [
          `森云科技 SYZC 供应链金融存货监管系统 - 移库凭单\n移库单号: ${record.id}\n货主: ${record.ownerName}\n仓库: ${record.warehouseName}\n移库时间: ${record.transferTime}\n移库类型: ${record.transferTypeName}\n移库总数量: ${record.totalAmount} ${record.unit}`,
        ],
        { type: "text/plain;charset=utf-8" }
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = item.fileName.replace(".pdf", ".txt")
      a.click()
      URL.revokeObjectURL(url)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            下载记录 - 移库单号：{record.id}
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800">
                <TableRow>
                  <TableHead className="w-16 text-center">序号</TableHead>
                  <TableHead>文件名</TableHead>
                  <TableHead className="w-48">操作人</TableHead>
                  <TableHead className="w-40">时间</TableHead>
                  <TableHead className="w-20 text-center">状态</TableHead>
                  <TableHead className="w-24 text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((item, idx) => (
                  <TableRow key={item.id} className="text-sm">
                    <TableCell className="text-center text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-normal text-foreground break-all">
                      {item.fileName}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.operator}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.createTime}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-normal bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {item.status === "SUCCESS" ? "成功" : "生成中"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="link"
                        size="sm"
                        disabled={downloadingId === item.id}
                        onClick={() => handleDownloadFile(item)}
                        className="text-primary hover:underline text-xs h-7 px-2 font-normal"
                      >
                        {downloadingId === item.id ? "下载中..." : "下载"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            * 遵循【凭证生成与下载记录审计】(R06)，此处沉淀司法审计历史凭单，点击可直接从对象存储复用下载。
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

