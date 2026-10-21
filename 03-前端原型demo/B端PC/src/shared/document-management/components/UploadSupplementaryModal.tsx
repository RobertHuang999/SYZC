import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
} from "lucide-react"
import type { DocumentItem } from "../types"
import { addDocumentItem } from "../mock"

interface UploadSupplementaryModalProps {
  open: boolean
  orderNo: string
  approvalId?: string
  orderType: "inbound" | "outbound"
  onClose: () => void
  onSuccess: (newDoc: DocumentItem) => void
}

export function UploadSupplementaryModal({
  open,
  orderNo,
  approvalId = "SP202605280001",
  orderType,
  onClose,
  onSuccess,
}: UploadSupplementaryModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<{
    name: string
    size: string
    type: "pdf" | "jpg" | "png" | "zip" | "docx"
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf"
    const validExts = ["pdf", "jpg", "png", "zip", "docx"]
    const matchedType = validExts.includes(ext)
      ? (ext as "pdf" | "jpg" | "png" | "zip" | "docx")
      : "pdf"

    const sizeMb = (file.size / (1024 * 1024)).toFixed(2)
    setSelectedFile({
      name: file.name,
      size: `${sizeMb} MB`,
      type: matchedType,
    })
    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleSimulateSelectFile = () => {
    setSelectedFile({
      name: "SGS第三方铜锭化验分析单_盖章扫描件.pdf",
      size: "3.40 MB",
      type: "pdf",
    })
    if (!name) setName("SGS第三方铜锭化验分析单")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedFile) {
      setErrorMessage("请先上传附件文件")
      return
    }
    if (!name.trim()) {
      setErrorMessage("请输入资料名称")
      return
    }

    const newDoc = addDocumentItem({
      orderNo,
      approvalId,
      orderType,
      flowType: "9527",
      flowNodeTitle: "补充资料",
      nature: "ADDITION",
      category: "INSPECTION",
      name: selectedFile.name,
      version: "V1.0",
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      uploader: "当前经办人",
      uploaderOrg: "四川享宇科技有限公司",
      description: description.trim(),
      statusText: "有效补充",
    })

    onSuccess(newDoc)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-base font-semibold text-slate-800">
            上传补充资料
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* 附件上传区域 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">
              附件上传：
            </Label>

            {selectedFile ? (
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="p-1.5 rounded bg-blue-50 text-blue-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-slate-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {selectedFile.size}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-slate-400 hover:text-red-600 cursor-pointer"
                  onClick={() => setSelectedFile(null)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  删除
                </Button>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-lg p-5 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                <UploadCloud className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-700">
                  点击上传或直接将文件拖拽至此处
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  支持 PDF、JPG、PNG、ZIP、DOCX，单个文件不超过 50MB
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 h-7 px-3 text-slate-700 shadow-2xs">
                      浏览本地文件
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.zip,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-blue-600 hover:bg-blue-50"
                    onClick={handleSimulateSelectFile}
                  >
                    载入样例盖章件
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 资料名称 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">
              资料名称：
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入资料名称"
              className="h-8 text-xs rounded-md"
              maxLength={60}
            />
          </div>

          {/* 补充说明 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">
              补充说明（选填）：
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="可输入补充说明备注"
              rows={2}
              className="text-xs resize-none"
              maxLength={150}
            />
          </div>

          {errorMessage && (
            <div className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs cursor-pointer"
            >
              取 消
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 cursor-pointer"
            >
              确 定
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
