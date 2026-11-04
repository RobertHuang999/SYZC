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
  Archive,
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
  /** 是否允许事后补充资料；质押/抵押/仓单等金融类单据传 false（R33 / O18） */
  allowSupplement?: boolean
  className?: string
}

export function DocumentTimelineView({
  orderNo,
  approvalId = "SP202605280001",
  orderType = "inbound",
  allowSupplement = true,
  className = "",
}: DocumentTimelineViewProps) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadTargetFlowType, setUploadTargetFlowType] = useState<string>("1")
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
    if (doc.fileType === "rar" || doc.fileType === "zip") {
      showToast("压缩包文件暂不支持直接在线预览，请点击下载查阅")
      return
    }
    if (doc.fileType === "doc" || doc.fileType === "docx") {
      showToast("Word 格式凭证请点击下载后通过本地办公软件查阅，或转 PDF 在线预览")
      return
    }
    setPreviewPdfName(doc.name)
    setPreviewPdfOpen(true)
  }

  const handleDownload = (doc: DocumentItem) => {
    showToast(`正在下载文件：${doc.name}`)
  }

  const handleUploadSuccess = (newDocs: DocumentItem[]) => {
    setRefreshKey((k) => k + 1)
    if (newDocs.length > 1) {
      showToast(`已成功批量补充 ${newDocs.length} 份资料`)
    } else if (newDocs[0]) {
      showToast(`已成功补充资料：${newDocs[0].name}`)
    }
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
            className="h-8 px-4 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
            onClick={() => {
              setUploadTargetFlowType("2")
              setUploadOpen(true)
            }}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
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

                {/* 展开的单据批次卡片列表 */}
                {isExpanded && (
                  <div className="mt-3 pl-4 sm:pl-7 space-y-3">
                    {step.documents.length > 0 ? (
                      groupDocumentsIntoBatchesPC(step.documents).map((batch) => {
                        return (
                          <div
                            key={batch.batchKey}
                            className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
                          >
                            {/* 1. 顶部：上传人员与单据属性 */}
                            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800">
                                  上传人：{batch.uploader}
                                </span>
                                {batch.uploaderOrg && (
                                  <span className="text-slate-400">
                                    ({batch.uploaderOrg})
                                  </span>
                                )}
                                {batch.nature === "ADDITION" ? (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                    事后补录
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                    随单提交
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-slate-400">
                                <span className="text-slate-500 font-medium">共 {batch.documents.length} 份文件</span>
                                {batch.documents.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 px-2 text-[11px] text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                                    onClick={() => handleDownload(batch.documents[0])}
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    打包下载全部
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* 2. 中间：格式 ICON 标识平铺区（所有文件均以格式ICON展示，4列平铺自适应网格） */}
                            <div className="p-3.5">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {batch.documents.map((doc) => {
                                  const isImg = doc.fileType === "jpg" || doc.fileType === "png"
                                  const isArchive = doc.fileType === "rar" || doc.fileType === "zip"
                                  const isPdf = doc.fileType === "pdf"

                                  return (
                                    <div
                                      key={doc.id}
                                      className="group relative flex flex-col justify-between rounded-lg border border-slate-200/70 bg-slate-50/50 p-2 hover:border-blue-300 hover:bg-blue-50/20 transition-all"
                                    >
                                      {/* 格式 ICON 容器（统一纯格式ICON标识） */}
                                      <div
                                        onClick={() => handlePreview(doc)}
                                        className="relative aspect-4/3 w-full rounded-md bg-white border border-slate-100 flex items-center justify-center overflow-hidden cursor-pointer"
                                      >
                                        {isImg ? (
                                          <div className="flex flex-col items-center justify-center text-emerald-600">
                                            <FileImage className="w-8 h-8" />
                                            <span className="text-[10px] font-bold tracking-tight mt-1">{doc.fileType.toUpperCase()}</span>
                                          </div>
                                        ) : isPdf ? (
                                          <div className="flex flex-col items-center justify-center text-rose-600">
                                            <FileText className="w-8 h-8" />
                                            <span className="text-[10px] font-bold tracking-tight mt-1">PDF</span>
                                          </div>
                                        ) : isArchive ? (
                                          <div className="flex flex-col items-center justify-center text-amber-600">
                                            <Archive className="w-8 h-8" />
                                            <span className="text-[10px] font-bold tracking-tight mt-1">ZIP</span>
                                          </div>
                                        ) : (
                                          <div className="flex flex-col items-center justify-center text-blue-600">
                                            <FileText className="w-8 h-8" />
                                            <span className="text-[10px] font-bold tracking-tight mt-1">{doc.fileType.toUpperCase()}</span>
                                          </div>
                                        )}

                                        {/* 悬浮轻量快捷查看遮罩 */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                          <span className="p-1.5 rounded-full bg-white/90 text-slate-800 hover:bg-white cursor-pointer shadow-xs" title="在线预览">
                                            <Eye className="w-4 h-4" />
                                          </span>
                                        </div>
                                      </div>

                                      {/* 文件信息 */}
                                      <div className="mt-2 min-w-0">
                                        <h5
                                          className="text-xs font-medium text-slate-800 truncate"
                                          title={doc.name}
                                        >
                                          {doc.name}
                                        </h5>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                                          <span>{doc.fileSize}</span>
                                          <div className="flex items-center gap-1.5">
                                            <button
                                              type="button"
                                              onClick={() => handlePreview(doc)}
                                              className="text-blue-600 hover:underline cursor-pointer"
                                            >
                                              预览
                                            </button>
                                            <span className="text-slate-300">·</span>
                                            <button
                                              type="button"
                                              onClick={() => handleDownload(doc)}
                                              className="text-slate-600 hover:text-blue-600 cursor-pointer"
                                            >
                                              下载
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>

                            {/* 3. 底部：说明样式 + 时间跟在说明下面（补充说明不加图标） */}
                            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                              {batch.description ? (
                                <div className="text-slate-700">
                                  <span className="font-semibold text-slate-800">补充说明：</span>
                                  <span>{batch.description}</span>
                                </div>
                              ) : (
                                <div className="text-slate-400">无补充说明</div>
                              )}
                              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                                <span>上传时间：{batch.createTime}</span>
                              </div>
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
                    {isSupplementNode && allowSupplement && (
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

type DocumentBatchPC = {
  batchKey: string
  uploader: string
  uploaderOrg: string
  createTime: string
  nature: string
  description?: string
  documents: DocumentItem[]
}

function groupDocumentsIntoBatchesPC(docs: DocumentItem[]): DocumentBatchPC[] {
  const map = new Map<string, DocumentBatchPC>()
  for (const doc of docs) {
    const key = `${doc.uploader}__${doc.createTime}__${doc.description || ""}`
    if (!map.has(key)) {
      map.set(key, {
        batchKey: key,
        uploader: doc.uploader,
        uploaderOrg: doc.uploaderOrg,
        createTime: doc.createTime,
        nature: doc.nature,
        description: doc.description,
        documents: [],
      })
    }
    map.get(key)!.documents.push(doc)
  }
  return Array.from(map.values())
}

