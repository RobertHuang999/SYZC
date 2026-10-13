import { useState } from "react"
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
} from "lucide-react"
import { ImageViewerModal } from "./ImageViewerModal"
import { PdfViewerDialog } from "./PdfViewerDialog"

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

export function InboundAttachmentDialog({
  open,
  data,
  onClose,
}: InboundAttachmentDialogProps) {
  // 图片大图预览
  const [imagePreview, setImagePreview] = useState<{
    open: boolean
    images: string[]
    initialIndex: number
  }>({
    open: false,
    images: [],
    initialIndex: 0,
  })

  // PDF 预览
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
  const capturePhotos = data.capturePhotos || [
    {
      deviceName: "库区球机01-入库监控",
      time: "2026-09-18 10:25:30",
      url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
    },
    {
      deviceName: "1号库房全景枪机",
      time: "2026-09-18 10:26:12",
      url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&q=80",
    },
  ]

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
        <DialogContent className="max-w-[800px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Paperclip className="size-5 text-primary" />
              <DialogTitle>
                附件信息
                {data.goodsName ? (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({data.goodsName})
                  </span>
                ) : null}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-2 text-xs">
            {/* 1. 现场图片 */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Camera className="size-4 text-primary" />
                <span>现场图片 ({scenePhotos.length} 张)：</span>
              </div>

              {scenePhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {scenePhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-4/3 overflow-hidden rounded-md border bg-muted"
                    >
                      <img
                        src={photo}
                        alt={`现场照片 ${idx + 1}`}
                        className="size-full object-cover"
                      />
                      <div
                        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleOpenImage(scenePhotos, idx)}
                      >
                        <span className="flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-white text-[11px]">
                          <Eye className="size-3.5" />
                          查看大图
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground pl-6">暂无现场图片</p>
              )}
            </div>

            {/* 2. 补充资料（图片 + PDF文档） */}
            <div className="space-y-2.5 border-t pt-4">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <FileText className="size-4 text-primary" />
                <span>补充资料：</span>
              </div>

              {/* 补充图片 */}
              {supplementaryImages.length > 0 && (
                <div className="space-y-1.5 pl-6">
                  <span className="text-muted-foreground">补充凭据照片：</span>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {supplementaryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-4/3 overflow-hidden rounded-md border bg-muted"
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="size-full object-cover"
                        />
                        <div
                          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            handleOpenImage(
                              supplementaryImages.map((i) => i.url),
                              idx
                            )
                          }
                        >
                          <span className="flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-white text-[11px]">
                            <Eye className="size-3.5" />
                            查看大图
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 补充文档 (PDF等) */}
              {supplementaryDocuments.length > 0 ? (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 pl-6 pt-1">
                  {supplementaryDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-md border bg-muted/20 p-2.5 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <FileText className="size-7 text-rose-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 font-medium text-foreground">
                            {doc.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {doc.size || "1.8 MB"} · PDF 文档
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-primary"
                          onClick={() => handleOpenPdf(doc)}
                        >
                          <Eye className="mr-1 size-3.5" />
                          预览
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            window.open(doc.url || "#", "_blank")
                          }}
                        >
                          <Download className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : supplementaryImages.length === 0 ? (
                <p className="text-muted-foreground pl-6">暂无补充资料</p>
              ) : null}
            </div>

            {/* 3. 设备抓拍图 */}
            <div className="space-y-2.5 border-t pt-4">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Video className="size-4 text-primary" />
                <span>设备抓拍图 ({capturePhotos.length} 处监控设备)：</span>
              </div>

              {capturePhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pl-6">
                  {capturePhotos.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col overflow-hidden rounded-md border bg-card shadow-2xs"
                    >
                      <div className="group relative aspect-4/3 overflow-hidden bg-muted">
                        <img
                          src={item.url}
                          alt={item.deviceName}
                          className="size-full object-cover"
                        />
                        <div
                          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            handleOpenImage(
                              capturePhotos.map((c) => c.url),
                              idx
                            )
                          }
                        >
                          <Eye className="size-4 text-white" />
                        </div>
                      </div>
                      <div className="p-1.5 text-[11px]">
                        <p className="line-clamp-1 font-medium text-foreground">
                          {item.deviceName}
                        </p>
                        <p className="text-[10px] text-muted-foreground tabular-nums">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground pl-6">抓图失败 / 无监控设备接入</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button size="sm" onClick={onClose}>
              关 闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 大图预览 */}
      <ImageViewerModal
        open={imagePreview.open}
        images={imagePreview.images}
        initialIndex={imagePreview.initialIndex}
        onClose={() => setImagePreview((prev) => ({ ...prev, open: false }))}
      />

      {/* PDF 预览 */}
      <PdfViewerDialog
        open={pdfPreview.open}
        title={pdfPreview.title}
        fileName={pdfPreview.fileName}
        onClose={() => setPdfPreview((prev) => ({ ...prev, open: false }))}
      />
    </>
  )
}
