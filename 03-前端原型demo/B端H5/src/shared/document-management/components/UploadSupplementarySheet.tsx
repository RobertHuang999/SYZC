import { useEffect, useState, useRef } from "react"
import {
  AlertCircle,
  Archive,
  Check,
  ChevronRight,
  FileImage,
  FileText,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react"
import { addDocumentItems } from "../mock"
import { getStageOptions } from "../stages"
import type { DocumentItem, DocFileType } from "../types"

type UploadSupplementarySheetProps = {
  open: boolean
  orderNo: string
  approvalId?: string
  orderType?: "inbound" | "outbound"
  /** 从某个节点「+ 本阶段资料」进来时预选该阶段 */
  defaultFlowType?: string
  onClose: () => void
  onSubmitted: (docs: DocumentItem[]) => void
}

type PickedFile = {
  id: string
  name: string
  size: string
  sizeBytes: number
  type: DocFileType
  file?: File
}

const ALLOWED_EXTENSIONS = ["rar", "zip", "doc", "docx", "pdf", "jpg", "jpeg", "png"]
const MAX_DOC_COUNT = 10
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function guessFileType(fileName: string): DocFileType {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? ""
  if (ext === "rar") return "rar"
  if (ext === "zip") return "zip"
  if (ext === "doc") return "doc"
  if (ext === "docx") return "docx"
  if (ext === "pdf") return "pdf"
  if (ext === "jpg" || ext === "jpeg") return "jpg"
  if (ext === "png") return "png"
  return "pdf"
}

function getMobileFileIcon(type: DocFileType) {
  if (type === "jpg" || type === "png") {
    return <FileImage className="size-4 text-emerald-600" />
  }
  if (type === "zip" || type === "rar") {
    return <Archive className="size-4 text-amber-600" />
  }
  if (type === "doc" || type === "docx") {
    return <FileText className="size-4 text-blue-600" />
  }
  return <FileText className="size-4 text-rose-600" />
}

export function UploadSupplementarySheet({
  open,
  orderNo,
  approvalId = "SP202605280001",
  orderType = "inbound",
  defaultFlowType = "2",
  onClose,
  onSubmitted,
}: UploadSupplementarySheetProps) {
  const stageOptions = getStageOptions(orderType)

  const [selectedFlowType, setSelectedFlowType] = useState(defaultFlowType)
  const [stagePickerOpen, setStagePickerOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<PickedFile[]>([])
  const [description, setDescription] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 每次打开时重置表单，并按入口预选阶段
  useEffect(() => {
    if (!open) return
    setSelectedFlowType(defaultFlowType)
    setStagePickerOpen(false)
    setSelectedFiles([])
    setDescription("")
    setErrorMessage(null)
  }, [open, defaultFlowType])

  if (!open) return null

  const matchedStage =
    stageOptions.find((s) => s.value === selectedFlowType) ?? stageOptions[0]

  const processIncomingFiles = (incomingList: FileList | File[]) => {
    const list = Array.from(incomingList)
    if (list.length === 0) return

    const validNewFiles: PickedFile[] = []
    const warnings: string[] = []

    for (const file of list) {
      const ext = file.name.split(".").pop()?.toLowerCase() || ""
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        warnings.push(`【${file.name}】格式不支持，仅支持 .rar、.zip、.doc、.docx、.pdf、.jpg`)
        continue
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        warnings.push(
          `【${file.name}】超过 50MB 限制（当前 ${(file.size / (1024 * 1024)).toFixed(2)} MB）`
        )
        continue
      }
      validNewFiles.push({
        id: `m-file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: formatSize(file.size),
        sizeBytes: file.size,
        type: guessFileType(file.name),
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
        const remaining = MAX_DOC_COUNT - prev.length
        if (remaining <= 0) {
          setErrorMessage(`已达到单次最多 ${MAX_DOC_COUNT} 份文件上传限制`)
          return prev
        }
        if (validNewFiles.length > remaining) {
          setErrorMessage(
            `本次还能添加 ${remaining} 份（最多 ${MAX_DOC_COUNT} 份），已截取前 ${remaining} 份`
          )
          return [...prev, ...validNewFiles.slice(0, remaining)]
        }
        return [...prev, ...validNewFiles]
      })
    }
  }

  const handleSimulateSample = () => {
    setErrorMessage(null)
    const samples: PickedFile[] = [
      {
        id: `m-sample-1-${Date.now()}`,
        name: "20260601_现场情况更正说明函_盖章件.pdf",
        size: "1.82 MB",
        sizeBytes: 1.82 * 1024 * 1024,
        type: "pdf",
      },
      {
        id: `m-sample-2-${Date.now()}`,
        name: "现场理货过磅实物抓拍交接照.jpg",
        size: "3.45 MB",
        sizeBytes: 3.45 * 1024 * 1024,
        type: "jpg",
      },
      {
        id: `m-sample-3-${Date.now()}`,
        name: "权威第三方检验化验单据包.zip",
        size: "4.20 MB",
        sizeBytes: 4.2 * 1024 * 1024,
        type: "zip",
      },
    ]
    setSelectedFiles(samples)
    if (!description) {
      setDescription("移动端现场初审后置补充盖章复磅单与交接实物照片凭据归档。")
    }
  }

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      setErrorMessage("请先上传附件文件")
      return
    }

    if (selectedFiles.length > MAX_DOC_COUNT) {
      setErrorMessage(`最多支持上传 ${MAX_DOC_COUNT} 份文件`)
      return
    }

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

    onSubmitted(inserted)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 遮罩 */}
      <button
        type="button"
        aria-label="关闭上传补充资料"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
      />

      {/* 底部面板 */}
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[430px] flex-col rounded-t-3xl bg-white shadow-2xl animate-slide-up">
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-gray-300" />

        <div className="flex shrink-0 items-center justify-between px-4 pt-2 pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-[#232D39]">上传补充资料</h3>
            <p className="mt-0.5 text-[10px] text-[#232D39]/45">
              单据编号：{orderNo}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#232D39]/40 active:bg-gray-100"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto border-t border-gray-100 px-4 py-3">
          {/* 关联流程阶段 */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-[#232D39]">
              <span className="mr-0.5 text-rose-500">*</span>关联流程阶段
            </p>
            <button
              type="button"
              onClick={() => setStagePickerOpen(true)}
              className="flex w-full items-center justify-between rounded-lg border border-[#232D39]/15 bg-white px-3 py-2.5 text-left active:bg-gray-50"
            >
              <span className="min-w-0">
                <span className="block text-xs font-medium text-[#232D39]">
                  【{matchedStage.label}】
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-[#232D39]/45">
                  {matchedStage.hint}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-[#232D39]/30" />
            </button>
          </div>

          {/* 附件上传 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#232D39]">
                <span className="mr-0.5 text-rose-500">*</span>附件上传
              </p>
              <span className="text-[10px] text-[#232D39]/50">
                已选{" "}
                <strong
                  className={
                    selectedFiles.length >= MAX_DOC_COUNT
                      ? "text-amber-600"
                      : "text-blue-600"
                  }
                >
                  {selectedFiles.length}
                </strong>{" "}
                / {MAX_DOC_COUNT} 份
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files) {
                  processIncomingFiles(e.target.files)
                  e.target.value = ""
                }
              }}
            />

            {/* 上传触碰框 */}
            {selectedFiles.length < MAX_DOC_COUNT && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-dashed border-[#232D39]/20 bg-[#232D39]/[0.02] p-3 text-center cursor-pointer active:bg-blue-50/20"
              >
                <UploadCloud className="mx-auto size-5 text-[#232D39]/30" />
                <p className="mt-1 text-[11px] font-medium text-[#232D39]/70">
                  点击浏览本地文件或拍照上传
                </p>
                <p className="mt-0.5 text-[10px] text-[#232D39]/45 leading-tight">
                  支持 .rar .zip .doc .docx .pdf .jpg，单份 ≤ 50MB，最多 10 份
                </p>
              </div>
            )}

            {/* 样例与继续添加快捷按钮 */}
            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={handleSimulateSample}
                className="text-[11px] font-medium text-blue-600 active:opacity-70"
              >
                载入样例盖章包 (3份)
              </button>

              {selectedFiles.length > 0 && selectedFiles.length < MAX_DOC_COUNT && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-0.5 rounded-full border border-gray-200 px-2 py-0.5 text-[10px] text-gray-700 active:bg-gray-100"
                >
                  <Plus className="size-3" />
                  继续添加
                </button>
              )}
            </div>

            {/* 已选文件清单 */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1.5 max-h-44 overflow-y-auto pt-1">
                {selectedFiles.map((f, i) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-lg border border-[#232D39]/10 bg-[#232D39]/[0.02] p-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded bg-slate-100">
                        {getMobileFileIcon(f.type)}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-400 font-mono">
                            {i + 1}.
                          </span>
                          <p className="truncate text-xs font-medium text-[#232D39] max-w-[220px]">
                            {f.name}
                          </p>
                        </div>
                        <p className="text-[9.5px] text-[#232D39]/45">{f.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFiles((prev) => prev.filter((item) => item.id !== f.id))
                      }
                      className="ml-2 inline-flex shrink-0 items-center p-1 text-gray-400 hover:text-rose-500 active:opacity-70"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 错误提示 */}
          {errorMessage && (
            <div className="flex items-start gap-1 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800">
              <AlertCircle className="size-3.5 shrink-0 mt-0.5 text-amber-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 补充说明 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#232D39]">
                补充说明 <span className="text-[10px] text-[#232D39]/40">(选填)</span>
              </p>
              <span className="text-[10px] text-[#232D39]/35">
                {description.length}/150
              </span>
            </div>
            <textarea
              value={description}
              maxLength={150}
              rows={2}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入本次后置补充原因、出具单位或特殊情况说明"
              className="w-full resize-none rounded-lg border border-[#232D39]/15 bg-white p-2.5 text-xs text-[#232D39] outline-none placeholder:text-[#232D39]/30 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex shrink-0 items-center gap-2.5 border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#232D39]/15 py-2.5 text-center text-xs font-medium text-[#232D39]/70 active:bg-gray-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
            className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-xs font-medium text-white shadow-xs active:bg-blue-700 disabled:opacity-40"
          >
            确认上传 ({selectedFiles.length} 份)
          </button>
        </div>
      </div>

      {/* 阶段选择器 */}
      {stagePickerOpen && (
        <div className="fixed inset-0 z-60 flex items-end justify-center">
          <button
            type="button"
            onClick={() => setStagePickerOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative z-10 w-full max-w-[430px] rounded-t-2xl bg-white p-4 shadow-xl">
            <h4 className="text-xs font-bold text-[#232D39]">选择关联流程阶段</h4>
            <div className="mt-2.5 divide-y divide-gray-100">
              {stageOptions.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => {
                    setSelectedFlowType(st.value)
                    setStagePickerOpen(false)
                  }}
                  className="flex w-full items-center justify-between py-2.5 text-left active:bg-gray-50"
                >
                  <div>
                    <p className="text-xs font-medium text-[#232D39]">{st.label}</p>
                    <p className="mt-0.5 text-[10px] text-[#232D39]/45">{st.hint}</p>
                  </div>
                  {selectedFlowType === st.value && (
                    <Check className="size-4 shrink-0 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
