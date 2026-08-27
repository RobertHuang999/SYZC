import { useRef } from "react"
import { ImageIcon, UploadIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  SITUATION_MAX_LENGTH,
  SITE_PHOTO_ACCEPT_EXTENSIONS,
  SITE_PHOTO_MAX_COUNT,
  validateSitePhotoFile,
  type ReleaseFormErrors,
} from "../domain/release-validation"

type ReleaseMaterialFormProps = {
  situationDescription: string
  sitePhotoNames: string[]
  version: number
  triggerCount: number
  errors: ReleaseFormErrors
  onSituationChange: (value: string) => void
  onSitePhotosChange: (names: string[]) => void
}

export function ReleaseMaterialForm({
  situationDescription,
  sitePhotoNames,
  version,
  triggerCount,
  errors,
  onSituationChange,
  onSitePhotosChange,
}: ReleaseMaterialFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (files: FileList | null) => {
    if (!files) {
      return
    }

    const nextNames = [...sitePhotoNames]

    for (const file of Array.from(files)) {
      const error = validateSitePhotoFile(file, nextNames.length)
      if (error) {
        window.alert(error)
        continue
      }

      nextNames.push(file.name)
    }

    onSitePhotosChange(nextNames.slice(0, SITE_PHOTO_MAX_COUNT))
  }

  const removePhoto = (name: string) => {
    onSitePhotosChange(sitePhotoNames.filter((item) => item !== name))
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="situation-description">
          <span className="text-destructive">*</span> 情况说明
        </Label>
        <Textarea
          id="situation-description"
          value={situationDescription}
          onChange={(event) => onSituationChange(event.target.value)}
          placeholder="请填写现场核实情况"
          maxLength={SITUATION_MAX_LENGTH}
          aria-invalid={Boolean(errors.situationDescription)}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>最多 {SITUATION_MAX_LENGTH} 字，必填</span>
          <span>
            {situationDescription.trim().length}/{SITUATION_MAX_LENGTH}
          </span>
        </div>
        {errors.situationDescription && (
          <p className="text-sm text-destructive">{errors.situationDescription}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>现场照片</Label>
        <p className="text-xs text-muted-foreground">
          选填，{SITE_PHOTO_ACCEPT_EXTENSIONS.join("/")}，单张≤5MB，最多{" "}
          {SITE_PHOTO_MAX_COUNT} 张
        </p>
        <div className="flex flex-wrap items-center gap-2">
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
            <UploadIcon className="size-4" />
            上传照片
          </Button>
          {sitePhotoNames.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-sm"
            >
              <ImageIcon className="size-4 text-primary" />
              {name}
              <button
                type="button"
                className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                aria-label={`移除 ${name}`}
                onClick={() => removePhoto(name)}
              >
                <XIcon className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
        {errors.sitePhotos && (
          <p className="text-sm text-destructive">{errors.sitePhotos}</p>
        )}
      </div>

      <div className="space-y-1 text-sm">
        <div className="text-muted-foreground">解除抓拍</div>
        <p>提交时将联动同位置监控即时抓拍，提交后可在详情页查看。</p>
      </div>

      <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        确认解除后将归档整轮 <strong>{triggerCount}</strong>{" "}
        次触发，状态变为「已处理（有效）」。
      </div>

      <input type="hidden" name="version" value={version} readOnly />
    </div>
  )
}
