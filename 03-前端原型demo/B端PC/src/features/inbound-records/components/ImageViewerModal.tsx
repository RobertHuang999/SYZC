import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"

type ImageViewerModalProps = {
  open: boolean
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export function ImageViewerModal({
  open,
  images,
  initialIndex = 0,
  onClose,
}: ImageViewerModalProps) {
  const [index, setIndex] = React.useState(initialIndex)

  React.useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex, open])

  if (!images.length) return null

  const currentImage = images[index] || images[0]

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl p-4">
        <DialogHeader className="mb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-5 text-primary" />
            <DialogTitle>照片预览 ({index + 1} / {images.length})</DialogTitle>
          </div>
        </DialogHeader>

        <div className="relative flex max-h-[70vh] min-h-[360px] items-center justify-center overflow-hidden rounded-lg bg-black/90 p-2">
          <img
            src={currentImage}
            alt="大图预览"
            className="max-h-[65vh] max-w-full rounded object-contain shadow-2xl"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 size-10 rounded-full bg-white/20 text-white hover:bg-white/40"
                onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              >
                <ChevronLeft className="size-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 size-10 rounded-full bg-white/20 text-white hover:bg-white/40"
                onClick={() => setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              >
                <ChevronRight className="size-6" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

import * as React from "react"
