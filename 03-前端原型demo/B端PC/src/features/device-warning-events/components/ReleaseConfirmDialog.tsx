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
import { RELEASE_CONFIRM_MESSAGE } from "../domain/actions"
import type { DeviceWarningEvent } from "../domain/types"
import { ReleaseMaterialForm } from "./ReleaseMaterialForm"
import {
  validateReleaseForm,
  type ReleaseFormErrors,
} from "../domain/release-validation"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"

type ReleaseConfirmDialogProps = {
  open: boolean
  event: DeviceWarningEvent | null
  onOpenChange: (open: boolean) => void
  onConfirm: (event: DeviceWarningEvent) => void
}

export function ReleaseConfirmDialog({
  open,
  event,
  onOpenChange,
  onConfirm,
}: ReleaseConfirmDialogProps) {
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
  }, [event?.eventId, open])

  const message = event
    ? RELEASE_CONFIRM_MESSAGE.replace("N", String(event.triggerCount))
    : RELEASE_CONFIRM_MESSAGE

  const handleSubmit = () => {
    if (!event) {
      return
    }

    const nextErrors = validateReleaseForm({
      situationDescription,
      sitePhotoNames,
      version: event.version,
    })
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onConfirm(event)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <PrototypeAnnotationTarget
          annotationIds={["device-warning-release-confirm"]}
          markerPosition="top-left"
        >
          {step === "confirm" ? (
            <>
              <DialogHeader>
                <DialogTitle>确认解除</DialogTitle>
                <DialogDescription>{message}</DialogDescription>
              </DialogHeader>
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
                <DialogTitle>填写解除说明</DialogTitle>
                <DialogDescription>
                  请填写现场核实情况，提交后将归档本轮 {event?.triggerCount ?? 0} 次预警。
                </DialogDescription>
              </DialogHeader>
              {event && (
                <ReleaseMaterialForm
                  situationDescription={situationDescription}
                  sitePhotoNames={sitePhotoNames}
                  version={event.version}
                  triggerCount={event.triggerCount}
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
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setStep("confirm")}>
                  返回确认
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  取消
                </Button>
                <Button onClick={handleSubmit}>提交解除</Button>
              </DialogFooter>
            </>
          )}
        </PrototypeAnnotationTarget>
      </DialogContent>
    </Dialog>
  )
}
