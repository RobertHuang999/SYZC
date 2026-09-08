import { ImageIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export type SnapshotPreviewData = {
  title: string
  desc: string
  time?: string
  location?: string
}

type SnapshotImageModalProps = {
  data: SnapshotPreviewData | null
  onClose: () => void
}

export function SnapshotImageModal({ data, onClose }: SnapshotImageModalProps) {
  if (!data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border bg-background shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/40">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {data.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.desc}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <XIcon className="size-4" />
          </button>
        </div>
        <div className="p-4 flex flex-col items-center justify-center bg-slate-950">
          <div className="relative w-full aspect-video rounded-lg border border-slate-800 bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-slate-800/40 via-slate-900 to-black opacity-80" />
            <div className="relative z-10 flex flex-col items-center gap-2 text-slate-400">
              <ImageIcon className="size-16 text-slate-600 animate-pulse" />
              <span className="text-sm font-medium text-slate-300">
                大宗存货与监管现场监控抓拍司法存证画面
              </span>
              <span className="text-xs text-slate-500 font-mono">
                CAM-WH01-ZN01 | 1080P HD | H.265 | OSS-SECURE-ENCRYPTED
              </span>
            </div>
            <div className="absolute bottom-3 left-3 text-[10px] font-mono text-emerald-400 bg-black/60 px-2 py-0.5 rounded">
              ● REC {data.time || "2026-08-20 12:00:00"} 25FPS
            </div>
            <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded">
              {data.location || "仓储监管现场"}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-2.5 bg-muted/30 text-xs text-muted-foreground">
          <span>司法存证哈希：sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f</span>
          <Button size="sm" variant="outline" onClick={onClose}>
            关闭预览
          </Button>
        </div>
      </div>
    </div>
  )
}
