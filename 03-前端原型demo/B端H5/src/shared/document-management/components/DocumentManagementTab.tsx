import { useState } from "react"
import { MobilePdfModal } from "@/features/inbound-records/components/MobilePdfModal"
import { MobileImageModal } from "@/features/inbound-records/components/MobileImageModal"
import { DocumentTimelineMobile } from "./DocumentTimelineMobile"
import { UploadSupplementarySheet } from "./UploadSupplementarySheet"
import { getStageOptions } from "../stages"
import { isImageDocument, type DocumentItem } from "../types"

type DocumentManagementTabProps = {
  orderNo: string
  approvalId?: string
  orderType?: "inbound" | "outbound"
  ownerName?: string
  warehouseName?: string
  /** 交给页面统一提示，避免出现两个浮层 */
  onToast?: (message: string) => void
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60"

/**
 * 资料管理 Tab（H5）：时间轴 + 搜索 + 上传补充资料 + 预览/下载。
 * 只输出内容，外层卡片壳由详情页决定，保证与两套现有详情页风格一致。
 */
export function DocumentManagementTab({
  orderNo,
  approvalId = "SP202605280001",
  orderType = "inbound",
  ownerName,
  warehouseName,
  onToast,
}: DocumentManagementTabProps) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [lastUploadedFlowType, setLastUploadedFlowType] = useState<string | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFlowType, setUploadFlowType] = useState("1")

  const [pdfDoc, setPdfDoc] = useState<DocumentItem | null>(null)
  const [imageDoc, setImageDoc] = useState<DocumentItem | null>(null)

  const [internalToast, setInternalToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    if (onToast) {
      onToast(message)
      return
    }
    setInternalToast(message)
    window.setTimeout(() => setInternalToast(null), 2400)
  }

  const handlePreview = (doc: DocumentItem) => {
    if (isImageDocument(doc)) {
      setImageDoc(doc)
      return
    }
    if (doc.fileType === "zip" || doc.fileType === "rar") {
      showToast("压缩包文件暂不支持在线预览，请下载后查看")
      return
    }
    if (doc.fileType === "doc" || doc.fileType === "docx") {
      showToast("Word 文档请下载后使用本地办公软件查阅，或转 PDF 在线预览")
      return
    }
    setPdfDoc(doc)
  }

  const handleDownload = (doc: DocumentItem) => {
    showToast(`正在下载文件：${doc.name}`)
  }

  const handleUpload = (flowType: string) => {
    setUploadFlowType(flowType)
    setUploadOpen(true)
  }

  const handleSubmitted = (docs: DocumentItem[]) => {
    setRefreshKey((prev) => prev + 1)
    const primary = docs[0]
    if (primary) {
      setLastUploadedFlowType(primary.flowType)
      const stage = getStageOptions(orderType).find((s) => s.value === primary.flowType)
      showToast(
        docs.length > 1
          ? `已批量补充 ${docs.length} 份资料至关联流程「${stage?.label ?? primary.flowNodeTitle}」`
          : `资料已补充挂载至关联流程「${stage?.label ?? primary.flowNodeTitle}」`
      )
    }
  }

  return (
    <div className="relative space-y-3">
      <DocumentTimelineMobile
        orderNo={orderNo}
        orderType={orderType}
        refreshKey={refreshKey}
        lastUploadedFlowType={lastUploadedFlowType}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onUpload={handleUpload}
      />

      <UploadSupplementarySheet
        open={uploadOpen}
        orderNo={orderNo}
        approvalId={approvalId}
        orderType={orderType}
        defaultFlowType={uploadFlowType}
        onClose={() => setUploadOpen(false)}
        onSubmitted={handleSubmitted}
      />

      {pdfDoc && (
        <MobilePdfModal
          open
          title="资料文件预览"
          subtitle={
            orderType === "outbound" ? "出库业务归档资料" : "入库业务归档资料"
          }
          fileName={pdfDoc.name}
          fileSize={pdfDoc.fileSize}
          orderNo={orderNo}
          ownerName={ownerName}
          warehouseName={warehouseName}
          onDownload={(name) => showToast(`正在下载文件：${name}`)}
          onClose={() => setPdfDoc(null)}
        />
      )}

      {imageDoc && (
        <MobileImageModal
          open
          images={
            imageDoc.previewImages && imageDoc.previewImages.length > 0
              ? imageDoc.previewImages
              : [FALLBACK_IMAGE]
          }
          initialIndex={0}
          onClose={() => setImageDoc(null)}
        />
      )}

      {internalToast && (
        <div className="fixed bottom-16 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 text-xs text-white shadow-lg">
          {internalToast}
        </div>
      )}
    </div>
  )
}
