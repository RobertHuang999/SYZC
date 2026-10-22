import { useEffect, useState } from "react"
import {
  AlertCircle,
  Check,
  ChevronRight,
  FileText,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react"
import { addDocumentItem } from "../mock"
import { getStageOptions } from "../stages"
import type { DocumentItem } from "../types"

type UploadSupplementarySheetProps = {
  open: boolean
  orderNo: string
  approvalId?: string
  orderType?: "inbound" | "outbound"
  /** 从某个节点「+ 本阶段资料」进来时预选该阶段 */
  defaultFlowType?: string
  onClose: () => void
  onSubmitted: (doc: DocumentItem) => void
}

type PickedFile = {
  name: string
  size: string
  type: DocumentItem["fileType"]
}

/** 演示用的样例盖章件 */
const SAMPLE_FILE: PickedFile = {
  name: "20260601_现场补充情况说明函_盖章件.pdf",
  size: "1.18 MB",
  type: "pdf",
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function guessFileType(fileName: string): DocumentItem["fileType"] {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? ""
  if (ext === "jpg" || ext === "jpeg") return "jpg"
  if (ext === "png") return "png"
  if (ext === "zip") return "zip"
  if (ext === "docx" || ext === "doc") return "docx"
  return "pdf"
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
  const [selectedFile, setSelectedFile] = useState<PickedFile | null>(null)
  const [description, setDescription] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 每次打开时重置表单，并按入口预选阶段
  useEffect(() => {
    if (!open) return
    setSelectedFlowType(defaultFlowType)
    setStagePickerOpen(false)
    setSelectedFile(null)
    setDescription("")
    setErrorMessage(null)
  }, [open, defaultFlowType])

  if (!open) return null

  const matchedStage =
    stageOptions.find((s) => s.value === selectedFlowType) ?? stageOptions[0]

  const handleSubmit = () => {
    if (!selectedFile) {
      setErrorMessage("请先上传附件文件")
      return
    }

    const newDoc = addDocumentItem({
      orderNo,
      approvalId,
      orderType,
      flowType: selectedFlowType,
      flowNodeTitle: matchedStage.label,
      nature: "ADDITION",
      category: "OTHER",
      name: selectedFile.name,
      version: "V1.0",
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      uploader: "当前经办人",
      uploaderOrg: "四川享宇科技有限公司",
      description: description.trim(),
      statusText: "有效补充",
    })

    onSubmitted(newDoc)
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
            <p className="text-xs font-medium text-[#232D39]">
              <span className="mr-0.5 text-rose-500">*</span>附件上传
            </p>

            {selectedFile ? (
              <div className="flex items-center justify-between rounded-lg border border-[#232D39]/10 bg-[#232D39]/[0.02] p-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[#232D39]">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-[#232D39]/45">{selectedFile.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="ml-2 inline-flex shrink-0 items-center gap-0.5 text-[10px] text-rose-500 active:opacity-70"
                >
                  <Trash2 className="size-3" />
                  删除
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[#232D39]/20 bg-[#232D39]/[0.02] p-3.5 text-center">
                <UploadCloud className="mx-auto size-6 text-[#232D39]/30" />
                <p className="mt-1 text-[11px] font-medium text-[#232D39]/70">
                  点击上传或拖拽文件到此处
                </p>
                <p className="mt-0.5 text-[10px] text-[#232D39]/40">
                  支持 PDF、JPG、PNG、ZIP、DOCX，单个不超过 50MB
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <label className="cursor-pointer rounded-full border border-[#232D39]/15 bg-white px-3 py-1.5 text-[11px] font-medium text-[#232D39]/80 active:bg-gray-50">
                    浏览本地文件
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.zip,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setSelectedFile({
                          name: file.name,
                          size: formatSize(file.size),
                          type: guessFileType(file.name),
                        })
                        setErrorMessage(null)
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(SAMPLE_FILE)
                      if (!description) {
                        setDescription("现场补充情况说明及加盖公章函件，后置归档存证。")
                      }
                      setErrorMessage(null)
                    }}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-600 active:bg-blue-100"
                  >
                    载入样例盖章件
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 补充说明 */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-[#232D39]">补充说明（选填）</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 150))}
              rows={3}
              placeholder="可输入补充说明备注、出具单位或后置补录原因"
              className="w-full resize-none rounded-lg border border-[#232D39]/15 px-3 py-2 text-xs text-[#232D39] placeholder:text-[#232D39]/30 focus:border-blue-400 focus:outline-hidden"
            />
            <p className="text-right text-[10px] text-[#232D39]/35">
              {description.length}/150
            </p>
          </div>

          {errorMessage && (
            <p className="flex items-center gap-1 text-[11px] text-rose-500">
              <AlertCircle className="size-3.5 shrink-0" />
              {errorMessage}
            </p>
          )}
        </div>

        {/* 吸底操作 */}
        <div className="flex shrink-0 gap-2 border-t border-gray-100 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex-1 rounded-lg border border-[#232D39]/20 text-xs font-medium text-[#232D39] active:bg-gray-50"
          >
            取 消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-10 flex-[1.3] rounded-lg bg-blue-600 text-xs font-medium text-white active:bg-blue-700"
          >
            确 定
          </button>
        </div>
      </div>

      {/* 阶段选择：超过 3 项走底部列表 */}
      {stagePickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <button
            type="button"
            aria-label="关闭阶段选择"
            onClick={() => setStagePickerOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative z-10 w-full max-w-[430px] rounded-t-3xl bg-white p-3 shadow-2xl animate-slide-up">
            <p className="mb-2 text-center text-xs font-bold text-[#232D39]">
              选择关联流程阶段
            </p>
            <div className="space-y-1.5">
              {stageOptions.map((stage) => {
                const active = stage.value === selectedFlowType
                return (
                  <button
                    key={stage.value}
                    type="button"
                    onClick={() => {
                      setSelectedFlowType(stage.value)
                      setStagePickerOpen(false)
                    }}
                    className={`flex w-full items-start justify-between gap-2 rounded-xl px-3 py-2.5 text-left active:scale-[0.99] ${
                      active
                        ? "border border-blue-200 bg-blue-50"
                        : "bg-gray-50/80 active:bg-gray-100"
                    }`}
                  >
                    <span className="min-w-0">
                      <span
                        className={`block text-xs font-semibold ${
                          active ? "text-blue-700" : "text-[#232D39]"
                        }`}
                      >
                        【{stage.label}】
                      </span>
                      <span className="mt-0.5 block text-[10px] text-[#232D39]/45">
                        {stage.hint}
                      </span>
                    </span>
                    {active && <Check className="mt-0.5 size-4 shrink-0 text-blue-600" />}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setStagePickerOpen(false)}
              className="mt-2.5 w-full rounded-xl bg-gray-100 py-2.5 text-center text-xs font-semibold text-[#232D39]/70 active:bg-gray-200"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
