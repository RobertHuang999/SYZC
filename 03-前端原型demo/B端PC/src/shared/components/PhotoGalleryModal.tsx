import { useEffect, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ShieldCheck,
  XIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export type PhotoGalleryPreviewData = {
  title: string
  desc?: string
  photos: string[]
  initialIndex?: number
}

type PhotoGalleryModalProps = {
  data: PhotoGalleryPreviewData | null
  onClose: () => void
}

export function PhotoGalleryModal({ data, onClose }: PhotoGalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(data?.initialIndex ?? 0)

  useEffect(() => {
    setActiveIndex(data?.initialIndex ?? 0)
  }, [data?.initialIndex, data?.photos])

  if (!data || data.photos.length === 0) return null

  const photos = data.photos
  const currentIndex = Math.min(Math.max(0, activeIndex), photos.length - 1)
  const currentPhoto = photos[currentIndex]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{data.title}</h3>
              <span className="rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                厂商自动返回 ({photos.length}张)
              </span>
            </div>
            {data.desc && (
              <p className="mt-0.5 text-xs text-muted-foreground">{data.desc}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="relative flex min-h-[320px] flex-1 items-center justify-center bg-slate-950 p-4">
          <div className="relative flex w-full flex-col items-center overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
            <div className="relative flex h-72 w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 text-center text-white">
              <div className="absolute top-3 left-3 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                <ShieldCheck className="size-3" />
                <span>
                  VENDOR_ATTACHMENT · 第 {currentIndex + 1}/{photos.length} 张
                </span>
              </div>
              <div className="absolute top-3 right-3 rounded bg-indigo-900/80 px-1.5 py-0.5 text-[10px] font-mono text-indigo-200">
                {currentPhoto}
              </div>
              <ImageIcon className="mb-2 size-12 text-indigo-400/80" />
              <div className="text-sm font-semibold text-indigo-200">
                现场照片 · 厂商物联传感器自动回传
              </div>
              <div className="mt-1 max-w-md text-xs text-slate-400">
                告警触发时由硬件设备镜头/传感器主动回传系统，已固化存证快照
              </div>
            </div>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-md hover:bg-black/80 cursor-pointer"
                  aria-label="上一张"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-md hover:bg-black/80 cursor-pointer"
                  aria-label="下一张"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {photos.length > 1 && (
          <div className="border-t bg-muted/20 px-4 py-2">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {photos.map((photo, idx) => (
                <button
                  key={photo + idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition cursor-pointer ${
                    idx === currentIndex
                      ? "border-indigo-500 ring-2 ring-indigo-500/30"
                      : "border-border opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex size-12 flex-col items-center justify-center bg-slate-800 text-[10px] font-mono text-slate-300">
                    <ImageIcon className="mb-0.5 size-3.5 text-indigo-400" />
                    <span>#{idx + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t px-4 py-2.5 bg-muted/30 text-xs text-muted-foreground">
          <span>区分：厂商现场照片 ≠ 监控主动抓拍</span>
          <Button size="sm" variant="outline" onClick={onClose}>
            关闭预览
          </Button>
        </div>
      </div>
    </div>
  )
}
