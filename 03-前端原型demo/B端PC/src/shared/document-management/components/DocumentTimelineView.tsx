import { useState, useMemo } from "react"
import {
  Search,
  Plus,
  FileText,
  Eye,
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  FileImage,
  UploadCloud,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DocumentItem } from "../types"
import { buildTimelineSteps, getDocumentsByOrderNo } from "../mock"
import { UploadSupplementaryModal } from "./UploadSupplementaryModal"
import { PdfViewerDialog } from "@/features/inbound-records/components/PdfViewerDialog"

interface DocumentTimelineViewProps {
  orderNo: string
  approvalId?: string
  orderType?: "inbound" | "outbound"
  className?: string
}

export function DocumentTimelineView({
  orderNo,
  approvalId = "SP202605280001",
  orderType = "inbound",
  className = "",
}: DocumentTimelineViewProps) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadTargetFlowType, setUploadTargetFlowType] = useState<string>("2")
  const [previewPdfOpen, setPreviewPdfOpen] = useState(false)
  const [previewPdfName, setPreviewPdfName] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 基础数据
  const initialSteps = useMemo(() => {
    return buildTimelineSteps(orderNo, approvalId, orderType)
  }, [orderNo, approvalId, orderType, refreshKey])

  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: true,
    5: false,
    6: true,
  })

  const allDocuments = useMemo(() => {
    return getDocumentsByOrderNo(orderNo)
  }, [orderNo, refreshKey])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const toggleStep = (stepIndex: number) => {
    setExpandedMap((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }))
  }

  // 搜索过滤
  const filteredSteps = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase()
    if (!kw) return initialSteps

    return initialSteps.map((step) => {
      const matchedDocs = step.documents.filter(
        (doc) =>
          doc.name.toLowerCase().includes(kw) ||
          doc.uploader.toLowerCase().includes(kw) ||
          doc.fileType.toLowerCase().includes(kw)
      )
      return {
        ...step,
        documents: matchedDocs,
      }
    })
  }, [initialSteps, searchKeyword])

  const totalFilteredDocs = useMemo(() => {
    return filteredSteps.reduce((acc, step) => acc + step.documents.length, 0)
  }, [filteredSteps])

  const handlePreview = (doc: DocumentItem) => {
    setPreviewPdfName(doc.name)
    setPreviewPdfOpen(true)
  }

  const handleDownload = (doc: DocumentItem) => {
    showToast(`正在下载文件：${doc.name}`)
  }

  const handleUploadSuccess = (newDoc: DocumentItem) => {
    setRefreshKey((k) => k + 1)
    showToast(`已成功补充资料：${newDoc.name}`)
  }

  return (
    <div className={`doc-container ${className}`}>
      {/* 顶部轻量汇总与操作栏 (对齐 see-dialog.vue 的 doc-header) */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div className="text-[15px] font-medium text-slate-700">
          全部资料{" "}
          <strong className="text-blue-600 font-bold text-base mx-0.5">
            {searchKeyword ? totalFilteredDocs : allDocuments.length}
          </strong>{" "}
          份
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索资料名称"
              className="h-8 pl-8 text-xs rounded-md border-slate-200 focus-visible:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          <Button
            size="sm"
            className="h-8 px-4 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-2xs cursor-pointer"
            onClick={() => {
              setUploadTargetFlowType("2")
              setUploadOpen(true)
            }}
          >
            上传补充资料
          </Button>
        </div>
      </div>

      {/* 时间轴列表容器 */}
      <div className="space-y-4">
        {filteredSteps.map((step, idx) => {
          const isExpanded = expandedMap[step.stepIndex] ?? (step.documents.length > 0)
          const isSupplementNode = step.flowType === "9527"
          const isLast = idx === filteredSteps.length - 1

          return (
            <div key={step.stepIndex} className="relative flex gap-3.5">
              {/* 左侧时间轴圆点与连接线 */}
              <div className="flex flex-col items-center w-6 shrink-0 pt-2.5">
                {isSupplementNode ? (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-2xs shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
                {!isLast && <div className="w-[1.5px] bg-slate-200 flex-1 my-1" />}
              </div>

              {/* 右侧节点卡片与展开资料 */}
              <div className="flex-1 pb-2">
                {/* 节点标题栏 */}
                <div
                  onClick={() => toggleStep(step.stepIndex)}
                  className="flex items-center justify-between py-2.5 px-4 bg-slate-50/90 hover:bg-slate-100/90 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* 序号徽章 */}
                    <span className="w-5 h-5 rounded bg-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {step.stepIndex}
                    </span>

                    {/* 节点名称 */}
                    <span className="text-sm font-semibold text-slate-800">
                      {step.title.replace(/\s*\(flowType:.*\)/, "")}
                    </span>

                    {/* 状态标签（仅审批流程节点展示已通过） */}
                    {!isSupplementNode && step.statusText && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-normal bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                        {step.statusText}
                      </span>
                    )}

                    {/* 产生/流转时间 */}
                    {step.time && (
                      <span className="text-xs text-slate-400 font-normal">
                        {step.time}
                      </span>
                    )}
                  </div>

                  {/* 右侧资料份数、补充本阶段资料按钮与折叠指示 */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[11px] font-normal text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 cursor-pointer rounded"
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadTargetFlowType(step.flowType)
                        setUploadOpen(true)
                      }}
                    >
                      <Plus className="w-3 h-3 mr-0.5" />
                      补充本阶段资料
                    </Button>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600 border border-blue-100">
                      <FileText className="w-3 h-3 text-blue-500" />
                      {step.documents.length}份资料
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* 展开的单据卡片列表 */}
                {isExpanded && (
                  <div className="mt-2.5 pl-4 sm:pl-7 space-y-2">
                    {step.documents.length > 0 ? (
                      step.documents.map((doc) => {
                        const isImage =
                          doc.fileType.includes("png") ||
                          doc.fileType.includes("jpg") ||
                          doc.fileType.includes("jpeg")

                        return (
                          <div
                            key={doc.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 shadow-2xs transition-all"
                          >
                            {/* 左侧图标与信息 */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-blue-50/80 text-blue-500 flex items-center justify-center shrink-0">
                                {isImage ? (
                                  <FileImage className="w-5 h-5 text-blue-500" />
                                ) : (
                                  <FileText className="w-5 h-5 text-blue-500" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4
                                    className="text-sm font-medium text-slate-800 truncate"
                                    title={doc.name}
                                  >
                                    {doc.name}
                                  </h4>
                                  {doc.nature === "ADDITION" && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-normal bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                      事后补录
                                    </span>
                                  )}
                                </div>

                                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 mt-0.5">
                                  <span>{doc.fileType}</span>
                                  <span>{doc.fileSize}</span>
                                  <span>产生时间：{doc.createTime}</span>
                                  <span>
                                    上传人：{doc.uploader}
                                    {doc.uploaderOrg && ` (${doc.uploaderOrg})`}
                                  </span>
                                </div>
                                {doc.description && (
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-1 bg-slate-50/80 px-2 py-0.5 rounded border border-slate-100/80">
                                    说明：{doc.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* 右侧轻量操作按钮 */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-3 text-xs text-blue-600 bg-blue-50/70 border-blue-200 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
                                onClick={() => handlePreview(doc)}
                              >
                                <Eye className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                预览
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-3 text-xs text-emerald-600 bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer"
                                onClick={() => handleDownload(doc)}
                              >
                                <Download className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                                下载
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="py-4 text-center text-xs text-slate-400">
                        暂无资料
                      </div>
                    )}

                    {/* 补充资料节点的底部快捷上传区域 */}
                    {isSupplementNode && (
                      <div className="pt-1">
                        <div
                          onClick={() => setUploadOpen(true)}
                          className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-lg p-4 text-center cursor-pointer transition-colors bg-slate-50/40 hover:bg-slate-50"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs text-blue-600 border-blue-300 hover:bg-blue-50 cursor-pointer mb-1"
                          >
                            <UploadCloud className="w-3.5 h-3.5 mr-1" />
                            点击上传补充资料
                          </Button>
                          <p className="text-xs text-slate-400">
                            支持 PDF、JPG、PNG、ZIP，单文件不超过 50MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 浮动轻提示 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* 补充资料录入弹窗 */}
      <UploadSupplementaryModal
        open={uploadOpen}
        orderNo={orderNo}
        approvalId={approvalId}
        orderType={orderType}
        defaultFlowType={uploadTargetFlowType}
        onClose={() => setUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      {/* PDF 预览模拟弹窗 */}
      <PdfViewerDialog
        open={previewPdfOpen}
        title="资料文件预览"
        fileName={previewPdfName}
        onClose={() => setPreviewPdfOpen(false)}
      />
    </div>
  )
}
