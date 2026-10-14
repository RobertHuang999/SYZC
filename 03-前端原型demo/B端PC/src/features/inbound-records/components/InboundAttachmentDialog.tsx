import { useState, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Camera,
  FileText,
  Eye,
  Download,
  Video,
  Paperclip,
  ImageIcon,
} from "lucide-react"
import { DetailSection } from "@/shared/components/DetailSection"
import { ImageViewerModal } from "./ImageViewerModal"
import { PdfViewerDialog } from "./PdfViewerDialog"
import { cn } from "@/lib/utils"

export type AttachmentDialogData = {
  goodsName: string
  scenePhotos: string[]
  supplementaryImages?: { name: string; url: string }[]
  supplementaryDocuments?: { name: string; url: string; size?: string }[]
  capturePhotos?: {
    deviceName: string
    time: string
    url: string
  }[]
}

type InboundAttachmentDialogProps = {
  open: boolean
  data: AttachmentDialogData | null
  onClose: () => void
}

function AttachmentPhotoGrid({
  photos,
  onOpen,
  className,
}: {
  photos: string[]
  onOpen: (index: number) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5",
        className
      )}
    >
      {photos.map((photo, idx) => (
        <button
          key={`${photo}-${idx}`}
          type="button"
          className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-[#e5e6eb] bg-[#f7f8fa] text-left outline-none ring-primary/30 transition-shadow hover:shadow-md focus-visible:ring-2"
          onClick={() => onOpen(idx)}
        >
          <img
            src={photo}
            alt={`照片 ${idx + 1}`}
            className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-gradient-to-t from-black/55 to-transparent px-2 pb-2 pt-8 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-medium text-[#1d2129] shadow-sm">
              <Eye className="size-3.5 text-primary" />
              查看大图
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}

function EmptyAttachmentHint({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[72px] items-center justify-center rounded-lg border border-dashed border-[#e5e6eb] bg-[#f7f8fa] px-4 py-6 text-sm text-[#86909c]">
      {children}
    </div>
  )
}

function sectionTitleSuffix(count: number, unit: string) {
  if (count <= 0) return ""
  return ` · ${count} ${unit}`
}

export function InboundAttachmentDialog({
  open,
  data,
  onClose,
}: InboundAttachmentDialogProps) {
  const [imagePreview, setImagePreview] = useState<{
    open: boolean
    images: string[]
    initialIndex: number
  }>({
    open: false,
    images: [],
    initialIndex: 0,
  })

  const [pdfPreview, setPdfPreview] = useState<{
    open: boolean
    title: string
    fileName: string
    fileUrl?: string
  }>({
    open: false,
    title: "",
    fileName: "",
  })

  if (!data) return null

  const scenePhotos = data.scenePhotos || []
  const supplementaryImages = data.supplementaryImages || []
  const supplementaryDocuments = data.supplementaryDocuments || []
  const capturePhotos = data.capturePhotos ?? []

  const hasSupplementary =
    supplementaryImages.length > 0 || supplementaryDocuments.length > 0

  const handleOpenImage = (images: string[], index: number) => {
    setImagePreview({
      open: true,
      images,
      initialIndex: index,
    })
  }

  const handleOpenPdf = (doc: { name: string; url: string }) => {
    setPdfPreview({
      open: true,
      title: "补充资料文档预览",
      fileName: doc.name,
      fileUrl: doc.url,
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="flex max-h-[88vh] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[720px]">
          <DialogHeader className="shrink-0 space-y-2 border-b border-[#f0f1f3] bg-white px-6 py-5 text-left">
            <div className="flex items-start gap-3 pr-8">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Paperclip className="size-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <DialogTitle className="text-lg font-semibold leading-snug text-[#1d2129]">
                  附件信息
                </DialogTitle>
                {data.goodsName ? (
                  <p className="text-sm leading-relaxed text-[#86909c]">
                    {data.goodsName}
                  </p>
                ) : null}
              </div>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#f7f8fa] px-6 py-5">
            <DetailSection
              title={`现场图片${sectionTitleSuffix(scenePhotos.length, "张")}`}
            >
              {scenePhotos.length > 0 ? (
                <AttachmentPhotoGrid
                  photos={scenePhotos}
                  onOpen={(idx) => handleOpenImage(scenePhotos, idx)}
                />
              ) : (
                <EmptyAttachmentHint>
                  <span className="inline-flex items-center gap-2">
                    <Camera className="size-4 opacity-60" />
                    暂无现场图片
                  </span>
                </EmptyAttachmentHint>
              )}
            </DetailSection>

            <DetailSection title="补充资料">
              {!hasSupplementary ? (
                <EmptyAttachmentHint>
                  <span className="inline-flex items-center gap-2">
                    <FileText className="size-4 opacity-60" />
                    暂无补充资料
                  </span>
                </EmptyAttachmentHint>
              ) : (
                <div className="space-y-5">
                  {supplementaryImages.length > 0 ? (
                    <div className="space-y-2.5">
                      <p className="text-[13px] font-medium text-[#86909c]">
                        补充凭据照片
                        <span className="ml-1 font-normal">
                          ({supplementaryImages.length} 张)
                        </span>
                      </p>
                      <AttachmentPhotoGrid
                        photos={supplementaryImages.map((i) => i.url)}
                        onOpen={(idx) =>
                          handleOpenImage(
                            supplementaryImages.map((i) => i.url),
                            idx
                          )
                        }
                      />
                    </div>
                  ) : null}

                  {supplementaryDocuments.length > 0 ? (
                    <div className="space-y-2.5">
                      <p className="text-[13px] font-medium text-[#86909c]">
                        文档附件
                        <span className="ml-1 font-normal">
                          ({supplementaryDocuments.length} 份)
                        </span>
                      </p>
                      <ul className="space-y-2">
                        {supplementaryDocuments.map((doc, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-3 rounded-lg border border-[#e5e6eb] bg-white p-3 transition-colors hover:border-primary/20 hover:bg-[#fafbfc]"
                          >
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                              <FileText className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-[#1d2129]">
                                {doc.name}
                              </p>
                              <p className="mt-0.5 text-xs text-[#86909c]">
                                {doc.size || "—"} · PDF 文档
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1 px-2.5 text-xs"
                                onClick={() => handleOpenPdf(doc)}
                              >
                                <Eye className="size-3.5" />
                                预览
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="text-[#86909c]"
                                aria-label="下载"
                                onClick={() => {
                                  window.open(doc.url || "#", "_blank")
                                }}
                              >
                                <Download className="size-4" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}
            </DetailSection>

            <DetailSection
              title={`设备抓拍${sectionTitleSuffix(capturePhotos.length, "处")}`}
            >
              {capturePhotos.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {capturePhotos.map((item, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-lg border border-[#e5e6eb] bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        className="group relative block aspect-[16/10] w-full overflow-hidden bg-[#f2f3f5] outline-none ring-primary/30 focus-visible:ring-2"
                        onClick={() =>
                          handleOpenImage(
                            capturePhotos.map((c) => c.url),
                            idx
                          )
                        }
                      >
                        <img
                          src={item.url}
                          alt={item.deviceName}
                          className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
                          <span className="inline-flex scale-95 items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#1d2129] opacity-0 shadow transition-all group-hover:scale-100 group-hover:opacity-100">
                            <Eye className="size-3.5 text-primary" />
                            查看大图
                          </span>
                        </div>
                      </button>
                      <div className="flex items-start gap-2 border-t border-[#f0f1f3] px-3 py-2.5">
                        <Video className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#1d2129]">
                            {item.deviceName}
                          </p>
                          <p className="mt-0.5 text-xs text-[#86909c]">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyAttachmentHint>
                  <span className="inline-flex items-center gap-2">
                    <ImageIcon className="size-4 opacity-60" />
                    抓图失败或无监控设备接入
                  </span>
                </EmptyAttachmentHint>
              )}
            </DetailSection>
          </div>

          <DialogFooter className="shrink-0 border-t border-[#f0f1f3] bg-white px-6 py-3.5 sm:justify-end">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageViewerModal
        open={imagePreview.open}
        images={imagePreview.images}
        initialIndex={imagePreview.initialIndex}
        onClose={() => setImagePreview((prev) => ({ ...prev, open: false }))}
      />

      <PdfViewerDialog
        open={pdfPreview.open}
        title={pdfPreview.title}
        fileName={pdfPreview.fileName}
        onClose={() => setPdfPreview((prev) => ({ ...prev, open: false }))}
      />
    </>
  )
}
