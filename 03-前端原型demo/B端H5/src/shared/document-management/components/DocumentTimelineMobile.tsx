import { useEffect, useMemo, useState } from "react"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
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
                  <div className="mt-2 space-y-2">
                    {step.documents.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-[#232D39]/10 py-3 text-center text-[10px] text-[#232D39]/35">
                        暂无资料
                      </p>
                    ) : (
                      step.documents.map((doc) => (
                        <DocumentCard
                          key={doc.id}
                          doc={doc}
                          onPreview={() => onPreview(doc)}
                          onDownload={() => onDownload(doc)}
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

function DocumentCard({
  doc,
  onPreview,
  onDownload,
}: {
  doc: DocumentItem
  onPreview: () => void
  onDownload: () => void
}) {
  const isImage = isImageDocument(doc)

  return (
    <div className="rounded-lg border border-[#232D39]/10 bg-[#232D39]/[0.02] p-2.5">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
          {isImage ? <FileImage className="size-4" /> : <FileText className="size-4" />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-1.5">
            <p className="min-w-0 flex-1 break-all text-xs font-medium leading-snug text-[#232D39]">
              {doc.name}
            </p>
            {doc.nature === "ADDITION" && (
              <span className="shrink-0 rounded border border-amber-200 bg-amber-50 px-1 py-0.5 text-[9px] font-medium text-amber-600">
                事后补录
              </span>
            )}
          </div>

          <p className="mt-0.5 text-[10px] text-[#232D39]/45">
            {doc.fileType.toUpperCase()} · {doc.fileSize} · {doc.createTime}
          </p>
          <p className="text-[10px] text-[#232D39]/45">
            上传人：{doc.uploader}（{doc.uploaderOrg}）
          </p>
          {doc.description && (
            <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-[#232D39]/55">
              说明：{doc.description}
            </p>
          )}

          <div className="mt-1.5 flex items-center gap-2">
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex items-center gap-0.5 rounded-md border border-blue-200 bg-white px-2 py-1 text-[10px] font-medium text-blue-600 active:bg-blue-50"
            >
              <Eye className="size-3" />
              预览
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-0.5 rounded-md border border-[#232D39]/15 bg-white px-2 py-1 text-[10px] font-medium text-[#232D39]/70 active:bg-gray-50"
            >
              <Download className="size-3" />
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
