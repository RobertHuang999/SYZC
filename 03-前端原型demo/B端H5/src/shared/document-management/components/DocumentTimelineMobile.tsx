import { useEffect, useMemo, useState } from "react"
import {
  Archive,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  FileImage,
  FileText,
  Plus,
  Search,
  Upload,
} from "lucide-react"
import { H5_SEARCH_INPUT } from "@/shared/h5-ui-theme"
import { buildTimelineSteps } from "../mock"
import { isImageDocument, type DocumentItem } from "../types"

type DocumentTimelineMobileProps = {
  orderNo: string
  orderType?: "inbound" | "outbound"
  /** 点「预览」时交给页面弹出 PDF / 图片预览 */
  onPreview: (doc: DocumentItem) => void
  /** 点「下载」时交给页面提示 */
  onDownload: (doc: DocumentItem) => void
  /** 点「上传补充资料」，带上预选的阶段；主入口传 "2" */
  onUpload: (defaultFlowType: string) => void
  /** 上传成功后的刷新信号，由页面递增 */
  refreshKey?: number
  /** 刚上传资料所属的阶段，用于自动展开该节点 */
  lastUploadedFlowType?: string | null
}

export function DocumentTimelineMobile({
  orderNo,
  orderType = "inbound",
  onPreview,
  onDownload,
  onUpload,
  refreshKey = 0,
  lastUploadedFlowType = null,
}: DocumentTimelineMobileProps) {
  const [keyword, setKeyword] = useState("")
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({})

  // 上传成功后，把目标阶段自动展开，否则用户看不到刚传的资料
  useEffect(() => {
    if (!lastUploadedFlowType) return
    setExpandedMap((prev) => ({ ...prev, [lastUploadedFlowType]: true }))
  }, [lastUploadedFlowType, refreshKey])

  const steps = useMemo(
    () => buildTimelineSteps(orderNo, orderType),
    // refreshKey 变化时重新取数（mock 是模块级单例）
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderNo, orderType, refreshKey]
  )

  const kw = keyword.trim().toLowerCase()

  const filteredSteps = useMemo(
    () =>
      steps.map((step) => ({
        ...step,
        documents: kw
          ? step.documents.filter((d) =>
              [d.name, d.uploader, d.fileType].some((v) =>
                v.toLowerCase().includes(kw)
              )
            )
          : step.documents,
      })),
    [steps, kw]
  )

  const totalCount = useMemo(
    () => filteredSteps.reduce((sum, s) => sum + s.documents.length, 0),
    [filteredSteps]
  )

  const isExpanded = (step: { flowType: string; documents: DocumentItem[] }) =>
    kw
      ? step.documents.length > 0
      : expandedMap[step.flowType] ?? step.documents.length > 0

  const toggleStep = (flowType: string, next: boolean) =>
    setExpandedMap((prev) => ({ ...prev, [flowType]: next }))

  return (
    <div className="space-y-3">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#232D39]/60">
          全部资料{" "}
          <span className="text-sm font-bold text-[#232D39]">{totalCount}</span> 份
        </p>
        <button
          type="button"
          onClick={() => onUpload("2")}
          className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-600 active:bg-blue-100"
        >
          <Upload className="size-3" />
          上传补充资料
        </button>
      </div>

      {/* 搜索 */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#232D39]/35" />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="搜索资料名称、上传人"
          className={`${H5_SEARCH_INPUT} !pl-8`}
        />
      </div>

      {/* 时间轴 */}
      {kw && totalCount === 0 ? (
        <p className="rounded-xl border border-dashed border-[#232D39]/15 py-8 text-center text-[11px] text-[#232D39]/40">
          没有找到匹配的资料
        </p>
      ) : (
      <div>
        {filteredSteps.map((step, index) => {
          const expanded = isExpanded(step)
          const isSupplement = step.flowType === "9527"
          const isLast = index === filteredSteps.length - 1
          return (
            <div key={step.flowType} className="flex gap-2.5">
              {/* 左侧轴：节点圆点 + 竖线 */}
              <div className="flex w-5 shrink-0 flex-col items-center">
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                    isSupplement
                      ? "bg-amber-50 text-amber-500 ring-1 ring-amber-200"
                      : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                  }`}
                >
                  {isSupplement ? (
                    <Plus className="size-3" strokeWidth={3} />
                  ) : (
                    <Check className="size-3" strokeWidth={3} />
                  )}
                </span>
                {!isLast && <span className="mt-1 w-px flex-1 bg-[#232D39]/10" />}
              </div>

              {/* 节点内容 */}
              <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-3.5"}`}>
                <button
                  type="button"
                  onClick={() => toggleStep(step.flowType, !expanded)}
                  className="flex w-full items-start justify-between gap-2 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#232D39]">
                        {step.stepIndex}. {step.title}
                      </span>
                      {step.statusText && (
                        <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                          {step.statusText}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#232D39]/45">{step.time}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-[10px] text-[#232D39]/50">
                    {step.documents.length} 份
                    {expanded ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </span>
                </button>

                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[10px] text-[#232D39]/40">
                    {step.operator} · {step.org}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpload(step.flowType)}
                    className="shrink-0 text-[10px] font-medium text-blue-600"
                  >
                    + 本阶段资料
                  </button>
                </div>

                {expanded && (
                  <div className="mt-2 space-y-2.5">
                    {step.documents.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-[#232D39]/10 py-3 text-center text-[10px] text-[#232D39]/35">
                        暂无资料
                      </p>
                    ) : (
                      groupDocumentsIntoBatches(step.documents).map((batch) => (
                        <DocumentBatchCardMobile
                          key={batch.batchKey}
                          batch={batch}
                          onPreview={onPreview}
                          onDownload={onDownload}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}

type DocumentBatch = {
  batchKey: string
  uploader: string
  uploaderOrg: string
  createTime: string
  nature: string
  description?: string
  documents: DocumentItem[]
}

function groupDocumentsIntoBatches(docs: DocumentItem[]): DocumentBatch[] {
  const map = new Map<string, DocumentBatch>()
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

function DocumentBatchCardMobile({
  batch,
  onPreview,
  onDownload,
}: {
  batch: DocumentBatch
  onPreview: (doc: DocumentItem) => void
  onDownload: (doc: DocumentItem) => void
}) {
  const isAddition = batch.nature === "ADDITION"

  return (
    <div className="rounded-xl border border-[#232D39]/10 bg-white p-2.5 shadow-2xs">
      {/* 1. 顶部：上传人员与单据属性 */}
      <div className="flex items-center justify-between pb-2 border-b border-[#232D39]/5 text-[11px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-[#232D39] truncate">
            上传人：{batch.uploader}
          </span>
          {batch.uploaderOrg && (
            <span className="text-[10px] text-[#232D39]/45 truncate max-w-[120px]">
              ({batch.uploaderOrg})
            </span>
          )}
          {isAddition ? (
            <span className="shrink-0 rounded border border-amber-200 bg-amber-50 px-1 py-0.5 text-[9px] font-medium text-amber-600">
              事后补录
            </span>
          ) : (
            <span className="shrink-0 rounded border border-blue-200 bg-blue-50 px-1 py-0.5 text-[9px] font-medium text-blue-600">
              随单提交
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 text-[10px] text-[#232D39]/50">
          <span>共 {batch.documents.length} 份</span>
        </div>
      </div>

      {/* 2. 中间：格式 ICON 标识平铺区（所有文件均以格式ICON展示，4列自适应网格） */}
      <div className="pt-2">
        <div className="grid grid-cols-4 gap-1.5">
          {batch.documents.map((doc) => {
            const isImg = isImageDocument(doc)
            const isArchive = doc.fileType === "rar" || doc.fileType === "zip"
            const isPdf = doc.fileType === "pdf"
            const isDoc = doc.fileType === "doc" || doc.fileType === "docx"

            return (
              <div
                key={doc.id}
                onClick={() => onPreview(doc)}
                className="group relative flex flex-col items-center justify-between rounded-lg border border-[#232D39]/10 bg-[#232D39]/[0.02] p-1.5 active:scale-98 transition-transform cursor-pointer"
              >
                {/* 格式 ICON 容器（统一纯格式ICON标识） */}
                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded bg-slate-100">
                  {isImg ? (
                    <div className="flex flex-col items-center justify-center text-emerald-600">
                      <FileImage className="size-5" />
                      <span className="text-[8px] font-bold tracking-tight">
                        {doc.fileType.toUpperCase()}
                      </span>
                    </div>
                  ) : isPdf ? (
                    <div className="flex flex-col items-center justify-center text-rose-600">
                      <FileText className="size-5" />
                      <span className="text-[8px] font-bold tracking-tight">PDF</span>
                    </div>
                  ) : isArchive ? (
                    <div className="flex flex-col items-center justify-center text-amber-600">
                      <Archive className="size-5" />
                      <span className="text-[8px] font-bold tracking-tight">ZIP</span>
                    </div>
                  ) : isDoc ? (
                    <div className="flex flex-col items-center justify-center text-blue-600">
                      <FileText className="size-5" />
                      <span className="text-[8px] font-bold tracking-tight">DOC</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600">
                      <FileText className="size-5" />
                      <span className="text-[8px] font-bold tracking-tight">
                        {doc.fileType.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* 悬停/常驻下载小按钮 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDownload(doc)
                    }}
                    className="absolute right-0.5 bottom-0.5 rounded bg-black/60 p-0.5 text-white active:bg-blue-600"
                    title="下载此文件"
                  >
                    <Download className="size-2.5" />
                  </button>
                </div>

                {/* 文件名与大小 */}
                <p
                  className="mt-1 w-full truncate text-center text-[9.5px] font-medium leading-tight text-[#232D39]"
                  title={doc.name}
                >
                  {doc.name}
                </p>
                <span className="mt-0.5 text-[8.5px] text-[#232D39]/40 leading-none">
                  {doc.fileSize}
                </span>
              </div>
            )
          })}
        </div>

        {/* 批量打包下载入口 */}
        {batch.documents.length > 1 && (
          <div className="mt-2 flex items-center justify-end text-[10px]">
            <button
              type="button"
              onClick={() => onDownload(batch.documents[0])}
              className="inline-flex items-center gap-1 font-medium text-blue-600 active:underline"
            >
              <Download className="size-3" />
              打包下载全部 ({batch.documents.length})
            </button>
          </div>
        )}
      </div>

      {/* 3. 底部：说明样式 + 时间跟在说明下面（补充说明不加图标） */}
      <div className="mt-2 rounded-md border border-[#232D39]/5 bg-slate-50 p-2 text-[10.5px] leading-relaxed">
        {batch.description ? (
          <div className="text-[#232D39]/80">
            <span className="font-semibold text-[#232D39]">补充说明：</span>
            <span>{batch.description}</span>
          </div>
        ) : (
          <div className="text-[#232D39]/40">无补充说明</div>
        )}
        <div className="mt-1.5 pt-1.5 border-t border-[#232D39]/5 flex items-center justify-between text-[9.5px] text-[#232D39]/45">
          <span>上传时间：{batch.createTime}</span>
        </div>
      </div>
    </div>
  )
}
