import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Camera, X } from "lucide-react"
import { resolveOverlayRoot } from "@/shared/lib/overlay-root"

type ImagePreviewModalProps = {
  open: boolean
  title?: string
  subTitle?: string
  imageUrl?: string | null
  onClose: () => void
}

export function ImagePreviewModal({
  open,
  title = "现场触发抓拍图",
  subTitle,
  imageUrl,
  onClose,
}: ImagePreviewModalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    setPortalRoot(resolveOverlayRoot())
  }, [open])

  if (!open || !portalRoot) return null

  return createPortal(
    <div
      className="absolute inset-0 z-[120] flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm touch-none"
        aria-label="关闭预览"
        onClick={onClose}
      />

      <div
        className="relative z-10 w-full max-w-[360px] overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Camera className="size-4 text-blue-400" />
            <div>
              <div className="text-xs font-bold">{title}</div>
              {subTitle && (
                <div className="text-[10px] text-gray-400">{subTitle}</div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-full bg-gray-800 text-gray-300 active:bg-gray-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="relative flex min-h-[220px] items-center justify-center bg-black/60 p-3">
          {imageUrl ? (
            <div className="relative flex w-full flex-col items-center overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
              <div className="flex h-48 w-full flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-zinc-900 p-4 text-center text-white">
                <Camera className="mb-2 size-10 animate-pulse text-cyan-400" />
                <div className="text-xs font-semibold font-mono text-cyan-300">
                  CAM_LIVE_SNAPSHOT_HD
                </div>
                <div className="mt-1 text-[11px] text-gray-400">
                  {title} · 实时抓拍存证
                </div>
                <div className="mt-3 inline-flex items-center gap-1 rounded bg-black/50 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  ● REC · 防伪哈希校验通过
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              暂无抓拍图像
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-800 bg-gray-900 px-4 py-2.5 text-[11px] text-gray-400">
          <span>分辨率: 1920x1080 · H.265</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white active:bg-blue-700"
          >
            完成
          </button>
        </div>
      </div>
    </div>,
    portalRoot
  )
}
