import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
  ShieldCheck,
} from "lucide-react"
import { resolveOverlayRoot } from "@/shared/lib/overlay-root"

type PhotoGalleryModalProps = {
  open: boolean
  title?: string
  subTitle?: string
  photos: string[]
  initialIndex?: number
  onClose: () => void
}

export function PhotoGalleryModal({
  open,
  title = "现场照片",
  subTitle = "设备厂商硬件自动回传附件",
  photos = [],
  initialIndex = 0,
  onClose,
}: PhotoGalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    setPortalRoot(resolveOverlayRoot())
    setActiveIndex(initialIndex)
  }, [open, initialIndex, photos])

  if (!open || photos.length === 0 || !portalRoot) return null

  const currentIndex = Math.min(Math.max(0, activeIndex), photos.length - 1)
  const currentPhoto = photos[currentIndex]

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  return createPortal(
    <div
      className="absolute inset-0 z-[120] flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer touch-none"
        aria-label="关闭预览"
        onClick={onClose}
      />

      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <ImageIcon className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold">{title}</span>
                <span className="rounded border border-indigo-700/60 bg-indigo-950 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-300">
                  厂商自动返回 ({photos.length}张)
                </span>
              </div>
              {subTitle && (
                <div className="mt-0.5 text-[10px] text-gray-400">{subTitle}</div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 active:bg-gray-600"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="relative flex min-h-[220px] flex-1 items-center justify-center bg-black/70 p-3">
          <div className="relative flex w-full flex-col items-center overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
            <div className="relative flex h-52 w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 text-center text-white">
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 font-mono text-[9px] text-emerald-400">
                <ShieldCheck className="size-3 text-emerald-400" />
                <span>
                  VENDOR_ATTACHMENT · 第 {currentIndex + 1}/{photos.length} 张
                </span>
              </div>

              <div className="absolute top-2 right-2 rounded bg-indigo-900/80 px-1.5 py-0.5 font-mono text-[9px] text-indigo-200">
                {currentPhoto}
              </div>

              <ImageIcon className="mb-2 size-10 text-indigo-400/80" />
              <div className="text-xs font-semibold font-mono text-indigo-200">
                现场照片 · 厂商物联传感器自动回传
              </div>
              <div className="mt-1 max-w-[240px] text-[10px] text-slate-400">
                告警触发时由硬件设备镜头/传感器主动回传系统，已固化存证快照
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="rounded bg-black/50 px-2 py-0.5 font-mono text-[9px] text-gray-300">
                  来源: 智能设备硬件随包回传
                </span>
              </div>
            </div>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute top-1/2 left-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white shadow-md hover:bg-black/80 active:scale-95"
                  aria-label="上一张"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white shadow-md hover:bg-black/80 active:scale-95"
                  aria-label="下一张"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {photos.length > 1 && (
          <div className="border-t border-gray-800/80 bg-gray-950 px-3 py-2">
            <div className="scrollbar-none flex items-center gap-2 overflow-x-auto py-1">
              {photos.map((photo, idx) => (
                <button
                  key={photo + idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                    idx === currentIndex
                      ? "border-indigo-500 ring-2 ring-indigo-500/30"
                      : "border-gray-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex size-11 flex-col items-center justify-center bg-slate-800 font-mono text-[9px] text-gray-300">
                    <ImageIcon className="mb-0.5 size-3.5 text-indigo-400" />
                    <span>#{idx + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-800 bg-gray-900 px-4 py-2.5 text-[11px] text-gray-400">
          <span className="text-[10px] text-gray-400">
            区分：厂商现场照片 ≠ 监控主动抓拍
          </span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white active:bg-indigo-700"
          >
            完成
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  )
}
