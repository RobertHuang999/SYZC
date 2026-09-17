import { useRef } from "react"
import { ImageIcon, PlusIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type EditableImageListProps = {
  images: string[]
  maxCount: number
  emptyPlaceholder?: string
  addLabel?: string
  onChange: (images: string[]) => void
  onPreview?: (name: string) => void
}

export function EditableImageList({
  images,
  maxCount,
  emptyPlaceholder = "抓拍失败/无监控设备",
  addLabel = "添加图片",
  onChange,
  onPreview,
}: EditableImageListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (files: FileList | null) => {
    if (!files) return

    const next = [...images]
    for (const file of Array.from(files)) {
      if (next.length >= maxCount) {
        window.alert(`最多上传 ${maxCount} 张图片`)
        break
      }
      next.push(file.name)
    }
    onChange(next)
  }

  const removeImage = (name: string) => {
    onChange(images.filter((item) => item !== name))
  }

  if (images.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{emptyPlaceholder}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,image/jpeg,image/png"
          multiple
          className="hidden"
          onChange={(event) => {
            handleUpload(event.target.files)
            event.target.value = ""
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <PlusIcon className="size-4" />
          {addLabel}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((name) => (
          <span
            key={name}
            className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-sm"
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 text-primary hover:underline"
              onClick={() => onPreview?.(name)}
            >
              <ImageIcon className="size-4" />
              {name}
            </button>
            <button
              type="button"
              className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
              aria-label={`移除 ${name}`}
              onClick={() => removeImage(name)}
            >
              <XIcon className="size-3.5" />
            </button>
          </span>
        ))}
      </div>
      {images.length < maxCount ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            multiple
            className="hidden"
            onChange={(event) => {
              handleUpload(event.target.files)
              event.target.value = ""
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <PlusIcon className="size-4" />
            {addLabel}
          </Button>
        </>
      ) : null}
    </div>
  )
}
