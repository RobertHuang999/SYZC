import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BATCH_RELEASE_CONFIRM_MESSAGE } from "../domain/actions"
import type { DeviceWarningEvent } from "../domain/types"
import { ReleaseMaterialForm } from "./ReleaseMaterialForm"
import {
  validateReleaseForm,
  type ReleaseFormErrors,
} from "../domain/release-validation"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

type BatchReleaseConfirmDialogProps = {
  open: boolean
  events: DeviceWarningEvent[]
  onOpenChange: (open: boolean) => void
  onConfirm: (events: DeviceWarningEvent[]) => void
}

export function BatchReleaseConfirmDialog({
  open,
  events,
  onOpenChange,
  onConfirm,
}: BatchReleaseConfirmDialogProps) {
  const [step, setStep] = useState<"confirm" | "materials">("confirm")
  const [situationDescription, setSituationDescription] = useState("")
  const [sitePhotoNames, setSitePhotoNames] = useState<string[]>([])
  const [errors, setErrors] = useState<ReleaseFormErrors>({})

  useEffect(() => {
    if (!open) {
      return
    }

    setStep("confirm")
    setSituationDescription("")
    setSitePhotoNames([])
    setErrors({})
  }, [open, events.map((event) => event.eventId).join(",")])

  const handleSubmit = () => {
    const nextErrors = validateReleaseForm({
      situationDescription,
      sitePhotoNames,
      version: events[0]?.version ?? 1,
    })
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onConfirm(events)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <PrototypeAnnotationTarget
          annotationIds={["device-warning-batch-release"]}
          markerPosition="top-left"
        >
          {step === "confirm" ? (
            <>
              <DialogHeader>
                <DialogTitle>批量解除预警</DialogTitle>
                <DialogDescription>
                  {BATCH_RELEASE_CONFIRM_MESSAGE}
                  <span className="mt-2 block text-foreground">
                    已选 {events.length} 条待处置 · 有效且支持人工解除的预警。
                  </span>
                </DialogDescription>
              </DialogHeader>
              <ul className="max-h-40 overflow-y-auto rounded-md border bg-muted/30 p-3 text-sm">
                {events.map((event) => (
                  <li key={event.eventId} className="py-0.5">
                    {event.ruleName} · {event.deviceName} · {event.warningTime}
                  </li>
                ))}
              </ul>
              <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  取消
                </Button>
                <Button onClick={() => setStep("materials")}>
                  确认并填写说明
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>填写批量解除说明</DialogTitle>
                <DialogDescription>
                  统一情况说明将写入所选 {events.length} 条预警的处置记录；每条仍独立携带 Version 提交。
                </DialogDescription>
              </DialogHeader>
              <ReleaseMaterialForm
                situationDescription={situationDescription}
                sitePhotoNames={sitePhotoNames}
                version={events[0]?.version ?? 1}
                errors={errors}
                onSituationChange={(value) => {
                  setSituationDescription(value)
                  if (errors.situationDescription) {
                    setErrors((current) => ({
                      ...current,
                      situationDescription: undefined,
                    }))
                  }
                }}
                onSitePhotosChange={(names) => {
                  setSitePhotoNames(names)
                  if (errors.sitePhotos) {
                    setErrors((current) => ({ ...current, sitePhotos: undefined }))
                  }
                }}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setStep("confirm")}>
                  返回确认
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  取消
                </Button>
                <Button onClick={handleSubmit}>提交批量解除</Button>
              </DialogFooter>
            </>
          )}
        </PrototypeAnnotationTarget>
      </DialogContent>
    </Dialog>
  )
}
