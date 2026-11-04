import React, { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  UploadCloud,
  FileText,
  FileImage,
  Archive,
  Trash2,
  AlertCircle,
  Plus,
  CheckCircle2,
} from "lucide-react"
import type { DocumentItem, DocFileType } from "../types"
import { addDocumentItems } from "../mock"
import {
  getUploadFlowOptions,
  INBOUND_UPLOAD_FLOW_OPTIONS,
  OUTBOUND_UPLOAD_FLOW_OPTIONS,
  resolveUploadFlowType,
} from "@prototype/shared/document-management/upload-flow-options"

interface UploadSupplementaryModalProps {
  open: boolean
  orderNo: string
  approvalId?: string
  orderType: "inbound" | "outbound"
  defaultFlowType?: string
  onClose: () => void
  onSuccess: (newDocs: DocumentItem[]) => void
}

/** 允许上传的文件格式扩展名 */
export const ALLOWED_EXTENSIONS = ["rar", "zip", "doc", "docx", "pdf", "jpg", "jpeg", "png"]

/** 最大支持上传文件数 */
export const MAX_DOC_COUNT = 10

/** 单个文件最大体积 (50MB) */
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

/** @deprecated 请使用 shared `INBOUND_UPLOAD_FLOW_OPTIONS` */
export const INBOUND_STAGE_OPTIONS = INBOUND_UPLOAD_FLOW_OPTIONS

/** @deprecated 请使用 shared `OUTBOUND_UPLOAD_FLOW_OPTIONS` */
export const OUTBOUND_STAGE_OPTIONS = OUTBOUND_UPLOAD_FLOW_OPTIONS

export interface SelectedFileItem {
  id: string
  name: string
  size: string
  sizeBytes: number
  type: DocFileType
  file?: File
}

function parseFileType(fileName: string): DocFileType {
  const ext = fileName.split(".").pop()?.toLowerCase() || ""
  if (ext === "rar") return "rar"
  if (ext === "zip") return "zip"
  if (ext === "doc") return "doc"
  if (ext === "docx") return "docx"
  if (ext === "pdf") return "pdf"
  if (ext === "jpg" || ext === "jpeg") return "jpg"
  if (ext === "png") return "png"
  return "pdf"
}

function getFileIcon(type: DocFileType) {
  if (type === "jpg" || type === "png") {
    return <FileImage className="w-4 h-4 text-emerald-600" />
  }
  if (type === "zip" || type === "rar") {
    return <Archive className="w-4 h-4 text-amber-600" />
  }
  if (type === "doc" || type === "docx") {
    return <FileText className="w-4 h-4 text-blue-600" />
  }
  return <FileText className="w-4 h-4 text-rose-600" />
}

function getFileTypeBadge(type: DocFileType) {
  const map: Record<DocFileType, { label: string; cls: string }> = {
    pdf: { label: "PDF", cls: "bg-rose-50 text-rose-700 border-rose-200" },
    jpg: { label: "JPG", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    png: { label: "PNG", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    doc: { label: "DOC", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    docx: { label: "DOCX", cls: "bg-blue-50 text-blue-700 border-blue-200" },
    zip: { label: "ZIP", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    rar: { label: "RAR", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  }
  const badge = map[type] || map.pdf
  return (
    <span
      className={`px-1.5 py-0.2 rounded text-[10px] font-medium border uppercase shrink-0 ${badge.cls}`}
    >
      {badge.label}
    </span>
  )
}

export function UploadSupplementaryModal({
  open,
  orderNo,
  approvalId = "SP202605280001",
  orderType,
  defaultFlowType = "1",
  onClose,
  onSuccess,
}: UploadSupplementaryModalProps) {
  const stageOptions = getUploadFlowOptions(orderType)

  const [selectedFlowType, setSelectedFlowType] = useState<string>(() =>
    resolveUploadFlowType(defaultFlowType),
  )
  const [description, setDescription] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 当弹窗打开或传入阶段发生变化时同步默认阶段并重置状态
  useEffect(() => {
    if (open) {
      setSelectedFlowType(resolveUploadFlowType(defaultFlowType))
      setDescription("")
      setSelectedFiles([])
      setErrorMessage(null)
      setIsDragging(false)
    }
  }, [open, defaultFlowType])

  const processIncomingFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList)
    if (incoming.length === 0) return

    const validNewFiles: SelectedFileItem[] = []
    const warnings: string[] = []

    for (const file of incoming) {
      const ext = file.name.split(".").pop()?.toLowerCase() || ""
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        warnings.push(`【${file.name}】格式不支持，仅支持 .rar、.zip、.doc、.docx、.pdf、.jpg`)
        continue
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        warnings.push(
          `【${file.name}】大小超过 50MB 限制（当前 ${(file.size / (1024 * 1024)).toFixed(2)} MB）`
        )
        continue
      }

      validNewFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        sizeBytes: file.size,
        type: parseFileType(file.name),
        file,
      })
    }

    if (warnings.length > 0) {
      setErrorMessage(warnings.join("；"))
    } else {
      setErrorMessage(null)
    }

    if (validNewFiles.length > 0) {
      setSelectedFiles((prev) => {
        const remainingQuota = MAX_DOC_COUNT - prev.length
        if (remainingQuota <= 0) {
          setErrorMessage(`已达到单次最多 ${MAX_DOC_COUNT} 份文件上传限制`)
          return prev
        }
        if (validNewFiles.length > remainingQuota) {
          setErrorMessage(
            `本次最多还能添加 ${remainingQuota} 份文件（上限 ${MAX_DOC_COUNT} 份），已自动选取前 ${remainingQuota} 份`
          )
          return [...prev, ...validNewFiles.slice(0, remainingQuota)]
        }
        return [...prev, ...validNewFiles]
      })
    }
  }

  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(e.target.files)
      // 清空 input 确保同一个文件改名后或再次选择能触发
      e.target.value = ""
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId))
    setErrorMessage(null)
  }

  const handleSimulateSampleFiles = () => {
    setErrorMessage(null)
    if (selectedFlowType === "2") {
      const samples: SelectedFileItem[] = [
        {
          id: `sample-1-${Date.now()}`,
          name: "20260601_海霸王地磅更正情况说明函_盖章件.pdf",
          size: "2.15 MB",
          sizeBytes: 2.15 * 1024 * 1024,
          type: "pdf",
        },
        {
          id: `sample-2-${Date.now()}`,
          name: "现场初审地磅更正复磅实车单据.jpg",
          size: "3.40 MB",
          sizeBytes: 3.4 * 1024 * 1024,
          type: "jpg",
        },
        {
          id: `sample-3-${Date.now()}`,
          name: "地磅站权威复核数据汇总表.xlsx.zip",
          size: "1.25 MB",
          sizeBytes: 1.25 * 1024 * 1024,
          type: "zip",
        },
      ]
      setSelectedFiles(samples)
      if (!description) {
        setDescription("现场随车地磅单车牌少录一位，补充地磅站重开并加盖公章说明函及复磅码单打包存档。")
      }
    } else if (selectedFlowType === "3") {
      const samples: SelectedFileItem[] = [
        {
          id: `sample-31-${Date.now()}`,
          name: "SGS第三方铜锭化验分析单_盖章扫描件.pdf",
          size: "3.40 MB",
          sizeBytes: 3.4 * 1024 * 1024,
          type: "pdf",
        },
        {
          id: `sample-32-${Date.now()}`,
          name: "商检机构第三方品质检验证书.docx",
          size: "1.85 MB",
          sizeBytes: 1.85 * 1024 * 1024,
          type: "docx",
        },
        {
          id: `sample-33-${Date.now()}`,
          name: "货物物理性能化验分析报告整包.rar",
          size: "6.80 MB",
          sizeBytes: 6.8 * 1024 * 1024,
          type: "rar",
        },
      ]
      setSelectedFiles(samples)
      if (!description) {
        setDescription("供应商出具的权威第三方 SGS 质量检测分析报告与商检品质证书后置归档。")
      }
    } else {
      const samples: SelectedFileItem[] = [
        {
          id: `sample-91-${Date.now()}`,
          name: "冷链仓储服务费结算单及增值税专用发票.pdf",
          size: "1.18 MB",
          sizeBytes: 1.18 * 1024 * 1024,
          type: "pdf",
        },
        {
          id: `sample-92-${Date.now()}`,
          name: "仓储履约现场交接凭证原件.doc",
          size: "2.30 MB",
          sizeBytes: 2.3 * 1024 * 1024,
          type: "doc",
        },
      ]
      setSelectedFiles(samples)
      if (!description) {
        setDescription("仓储履约后置结算发票凭证与权属交接备忘存档。")
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (selectedFiles.length === 0) {
      setErrorMessage("请至少选择 1 份附件文件")
      return
    }

    if (selectedFiles.length > MAX_DOC_COUNT) {
      setErrorMessage(`最多支持上传 ${MAX_DOC_COUNT} 份文件，当前已选 ${selectedFiles.length} 份`)
      return
    }

    const matchedStage = stageOptions.find((s) => s.value === selectedFlowType) || stageOptions[0]

    const newDocsToInsert = selectedFiles.map((f) => ({
      orderNo,
      approvalId,
      orderType,
      flowType: selectedFlowType,
      flowNodeTitle: matchedStage.label,
      nature: "ADDITION" as const,
      category: "OTHER" as const,
      name: f.name,
      version: "V1.0",
      fileType: f.type,
      fileSize: f.size,
      uploader: "当前经办人",
      uploaderOrg: "四川享宇科技有限公司",
      description: description.trim(),
      statusText: "有效补充",
    }))

    const inserted = addDocumentItems(newDocsToInsert)

    onSuccess(inserted)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-base font-semibold text-slate-800">
            上传补充资料
          </DialogTitle>
        </DialogHeader>

        {/* 顶部单据上下文 */}
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-md bg-slate-50 border border-slate-100 text-slate-600">
          <div>
            <span className="text-slate-400">单据编号：</span>
            <span className="font-medium text-slate-800 tabular-nums">{orderNo}</span>
          </div>
          <div>
            <span className="text-slate-400">关联审批单：</span>
            <span className="font-medium text-blue-600 tabular-nums">{approvalId}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* 关联流程 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">
              <span className="text-destructive mr-1">*</span>关联流程：
            </Label>

            <Select
              value={selectedFlowType}
              onValueChange={(value) => {
                setSelectedFlowType(String(value))
                setErrorMessage(null)
              }}
            >
              <SelectTrigger className="w-full text-xs">
                <SelectValue>
                  {(value) => {
                    const matched = stageOptions.find((s) => s.value === value)
                    return matched ? matched.stageText : "请选择关联流程"
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {stageOptions.map((st) => (
                  <SelectItem key={st.value} value={st.value} className="py-2">
                    <span className="flex flex-col gap-0.5 whitespace-normal">
                      <span className="text-xs font-medium text-slate-800">
                        {st.stageText}
                      </span>
                      <span className="text-[10.5px] leading-tight text-slate-500">
                        {st.hint}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 附件上传区域 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-slate-700">
                <span className="text-destructive mr-1">*</span>附件上传：
              </Label>
              <span className="text-[11px] text-slate-500">
                已选{" "}
                <strong
                  className={`font-semibold ${
                    selectedFiles.length >= MAX_DOC_COUNT
                      ? "text-amber-600"
                      : "text-blue-600"
                  }`}
                >
                  {selectedFiles.length}
                </strong>{" "}
                / {MAX_DOC_COUNT} 份
              </span>
            </div>

            {/* 隐藏的本地文件输入 */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"
              onChange={handleNativeFileChange}
            />

            {/* 拖拽与点击触发区域 */}
            {selectedFiles.length < MAX_DOC_COUNT && (
              <div
                className={`border border-dashed rounded-lg p-3.5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-200"
                    : "border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  if (e.dataTransfer.files) {
                    processIncomingFiles(e.dataTransfer.files)
                  }
                }}
              >
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700">
                  点击浏览本地文件，或直接拖拽文件至此处
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  支持 <span className="font-medium text-slate-700">.rar .zip .doc .docx .pdf .jpg</span> 格式，单份不超过 50MB，最多 10 份
                </p>
              </div>
            )}

            {/* 快捷操作条：载入样例与继续选择 */}
            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-blue-600 hover:bg-blue-50 px-2"
                onClick={handleSimulateSampleFiles}
              >
                载入样例盖章件包 (3份)
              </Button>

              {selectedFiles.length > 0 && selectedFiles.length < MAX_DOC_COUNT && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-slate-700 border-slate-200 hover:bg-slate-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  继续添加文件
                </Button>
              )}
            </div>

            {/* 已选文件列表卡片 */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 pt-1">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/80 text-xs shadow-2xs transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 rounded bg-slate-100 shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 text-[11px] font-mono shrink-0">
                            {idx + 1}.
                          </span>
                          <p
                            className="font-medium text-slate-800 truncate max-w-[260px] sm:max-w-[300px]"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          {getFileTypeBadge(file.type)}
                        </div>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          {file.size}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 shrink-0 cursor-pointer"
                      onClick={() => handleRemoveFile(file.id)}
                      title="移除此文件"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 异常错误与合规校验提示 */}
          {errorMessage && (
            <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-md border border-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* 补充说明 (选填) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-slate-700">
                补充说明：
              </Label>
              <span className="text-[10px] text-slate-400">
                {description.length}/150 字
              </span>
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 150))}
              placeholder="请输入本次后置补充原因、出具单位或特殊情况说明（选填，最多 150 字）"
              className="text-xs h-20 resize-none border-slate-200 focus-visible:ring-blue-500"
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs h-8"
            >
              取消
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-2xs"
              disabled={selectedFiles.length === 0}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              确认上传 ({selectedFiles.length} 份)
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
