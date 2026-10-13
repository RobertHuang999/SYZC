import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

type MobileImageModalProps = {
  open: boolean
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export function MobileImageModal({
  open,
  images,
  initialIndex = 0,
  onClose,
}: MobileImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  if (!open || images.length === 0) return null

  const safeIndex = Math.min(Math.max(0, currentIndex), images.length - 1)
  const currentImg = images[safeIndex]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-xs">
          {safeIndex + 1} / {images.length}
        </span>
        <button
          type="button"
          className="rounded-full p-1.5 text-gray-300 active:bg-white/20"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
      </div>

      {/* 图片主体 */}
      <div className="relative flex flex-1 items-center justify-center p-2">
        <img
          src={currentImg}
          alt={`现场照片 ${safeIndex + 1}`}
          className="max-h-full max-w-full rounded-md object-contain"
        />

        {images.length > 1 && safeIndex > 0 && (
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white active:bg-black/70"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {images.length > 1 && safeIndex < images.length - 1 && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white active:bg-black/70"
            onClick={() => setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1))}
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>

      {/* 底部缩略条 */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto p-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`size-12 shrink-0 overflow-hidden rounded-md border-2 ${
                idx === safeIndex ? "border-orange-500 scale-105" : "border-transparent opacity-60"
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              <img src={img} alt={`thumb ${idx}`} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
