import { Camera, X } from "lucide-react"

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
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩 */}
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-label="关闭预览"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative z-10 w-full max-w-[360px] overflow-hidden rounded-2xl bg-gray-900 shadow-2xl border border-gray-800">
        {/* 顶部标题与关闭 */}
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

        {/* 图片区域 */}
        <div className="relative flex min-h-[220px] items-center justify-center bg-black/60 p-3">
          {imageUrl ? (
            <div className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800 w-full flex flex-col items-center">
              {/* 模拟摄像头画面 */}
              <div className="w-full h-48 bg-gradient-to-br from-slate-800 via-slate-700 to-zinc-900 flex flex-col items-center justify-center text-center p-4 text-white">
                <Camera className="size-10 text-cyan-400 mb-2 animate-pulse" />
                <div className="text-xs font-mono text-cyan-300 font-semibold">
                  CAM_LIVE_SNAPSHOT_HD
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  {title} · 实时抓拍存证
                </div>
                <div className="mt-3 inline-flex items-center gap-1 rounded bg-black/50 px-2 py-0.5 text-[10px] text-emerald-400 font-mono">
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

        {/* 底部信息 */}
        <div className="bg-gray-900 px-4 py-2.5 text-center text-[11px] text-gray-400 border-t border-gray-800 flex items-center justify-between">
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
    </div>
  )
}
