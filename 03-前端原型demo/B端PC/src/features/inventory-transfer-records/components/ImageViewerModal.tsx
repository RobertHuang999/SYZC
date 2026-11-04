import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  open: boolean
  title?: string
  imageUrl?: string
  onClose: () => void
}

export function ImageViewerModal({ open, title, imageUrl, onClose }: Props) {
  if (!imageUrl) return null

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-sm font-medium">
            {title || "图片查看"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-2 bg-slate-900 rounded-md overflow-hidden min-h-[300px]">
          <img
            src={imageUrl}
            alt={title || "大图"}
            className="max-h-[70vh] max-w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

