import { X } from "lucide-react"

interface ImageViewerModalProps {
  url: string | null
  onClose: () => void
}

export function ImageViewerModal({ url, onClose }: ImageViewerModalProps) {
  if (!url) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/90"
        >
          <X className="size-5" />
        </button>
        <img
          src={url}
          alt="现场影像凭据"
          className="max-h-[85vh] max-w-full rounded-md object-contain shadow-2xl"
        />
      </div>
    </div>
  )
}
