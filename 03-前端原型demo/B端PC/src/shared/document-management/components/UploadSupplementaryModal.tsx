import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  UploadCloud,
  FileText,
  Trash2,
  AlertCircle,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DocumentItem } from "../types"
import { addDocumentItem } from "../mock"

interface UploadSupplementaryModalProps {
  open: boolean
  orderNo: string
  approvalId?: string
  orderType: "inbound" | "outbound"
  defaultFlowType?: string
  onClose: () => void
  onSuccess: (newDoc: DocumentItem) => void
}

/** 入库业务流程阶段选项 */
export const INBOUND_STAGE_OPTIONS = [
  {
    value: "1",
    label: "入库申请初审",
    stageText: "【入库申请初审】阶段",
    hint: "现场随车送货单、进场交接单、实物照片等",
  },
  {
    value: "2",
    label: "过磅核验",
    stageText: "【过磅核验】阶段",
    hint: "现场地磅过磅单、复磅更正函、称重凭据等",
  },
  {
    value: "3",
    label: "入库终审与质检",
    stageText: "【入库终审与质检】阶段",
    hint: "SGS第三方化验单、商检证书、品质报告等",
  },
  {
    value: "9527",
    label: "事后补充资料",
    stageText: "【事后综合补充】节点",
    hint: "仓储费结算发票、货转协议等通用补充",
  },
]

/** 出库业务流程阶段选项 */
export const OUTBOUND_STAGE_OPTIONS = [
  {
    value: "1",
    label: "出库申请审核",
    stageText: "【出库申请审核】阶段",
    hint: "出库申请单、提货委托书、货权人证明等",
  },
  {
    value: "2",
    label: "出场过磅核验",
    stageText: "【出场过磅核验】阶段",
    hint: "出库地磅单、出场实车交接单据等",
  },
  {
    value: "3",
    label: "出库终审放行",
    stageText: "【出库终审放行】阶段",
    hint: "放行确认单、出库品质检验单据等",
  },
  {
    value: "9527",
    label: "事后补充资料",
    stageText: "【事后综合补充】节点",
    hint: "运费结算单、运单发票等通用补充",
  },
]

export function UploadSupplementaryModal({
  open,
  orderNo,
  approvalId = "SP202605280001",
  orderType,
  defaultFlowType = "2",
  onClose,
  onSuccess,
}: UploadSupplementaryModalProps) {
  const stageOptions = orderType === "outbound" ? OUTBOUND_STAGE_OPTIONS : INBOUND_STAGE_OPTIONS

  const [selectedFlowType, setSelectedFlowType] = useState<string>(defaultFlowType)
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<{
    name: string
    size: string
    type: "pdf" | "jpg" | "png" | "zip" | "docx"
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 当弹窗打开或传入阶段发生变化时同步默认阶段
  useEffect(() => {
    if (open) {
      const initialFlow = defaultFlowType || "2"
      setSelectedFlowType(initialFlow)
      setErrorMessage(null)
    }
  }, [open, defaultFlowType])

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
  }

  const handleSimulateSelectFile = () => {
    if (selectedFlowType === "2") {
      setSelectedFile({
        name: "20260601_海霸王地磅更正情况说明函_盖章件.pdf",
        size: "2.15 MB",
        type: "pdf",
      })
      if (!description) setDescription("现场随车地磅单车牌少录一位，补充地磅站重开并加盖公章说明。")
    } else if (selectedFlowType === "3") {
      setSelectedFile({
        name: "SGS第三方铜锭化验分析单_盖章扫描件.pdf",
        size: "3.40 MB",
        type: "pdf",
      })
      if (!description) setDescription("供应商出具的权威第三方 SGS 质量检测分析报告后置归档。")
    } else {
      setSelectedFile({
        name: "冷链仓储服务费结算单及专用发票.pdf",
        size: "1.18 MB",
        type: "pdf",
      })
      if (!description) setDescription("仓储履约后置结算发票凭证存档。")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedFile) {
      setErrorMessage("请先上传附件文件")
      return
    }

    const matchedStage = stageOptions.find((s) => s.value === selectedFlowType) || stageOptions[0]

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

    onSuccess(newDoc)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md p-6 max-h-[90vh] overflow-y-auto">
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
          {/* 关联流程节点 */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="text-destructive">*</span>
                <span>补充资料挂载至哪个流程节点：</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                当前选中：<strong className="text-blue-600 font-semibold">{stageOptions.find((s) => s.value === selectedFlowType)?.label}</strong>
              </span>
            </Label>

            {/* 4大业务流程节点可视化选择卡片 */}
            <div className="grid grid-cols-2 gap-2">
              {stageOptions.map((st) => {
                const isSelected = selectedFlowType === st.value
                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => {
                      setSelectedFlowType(st.value)
                      setErrorMessage(null)
                    }}
                    className={cn(
                      "p-2.5 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between",
                      isSelected
                        ? "border-blue-600 bg-blue-50/80 ring-1 ring-blue-600 shadow-2xs"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          isSelected ? "text-blue-700" : "text-slate-800"
                        )}
                      >
                        {st.stageText}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-tight line-clamp-2">
                      {st.hint}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 附件上传区域 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">
              <span className="text-destructive mr-1">*</span>附件上传：
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
              <div className="border border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700">
                  点击上传或直接将文件拖拽至此处
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  支持 PDF、JPG、PNG、ZIP、DOCX，单个文件不超过 50MB
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-2">
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

          {/* 补充说明 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-700">
              补充说明（选填）：
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="可输入补充说明备注、出具单位或后置补录原因"
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
