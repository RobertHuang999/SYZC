import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { INBOUND_STAGING_FORM_PATH } from "../domain/constants"

type Props = {
  open: boolean
  onClose: () => void
  onNavigateBlank: () => void
  onNavigateWithCopy: () => void
}

export function InboundStagingSwitchDialog({
  open,
  onClose,
  onNavigateBlank,
  onNavigateWithCopy,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>入库暂存登记说明</DialogTitle>
          <DialogDescription>
            现场备忘：不进审批、不写库存、暂不发短信；已填内容可无损带入暂存单（P09）。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="button" variant="secondary" onClick={onNavigateBlank}>
            去空白登记页
          </Button>
          <Button type="button" onClick={onNavigateWithCopy}>
            带入内容并前往（推荐）
          </Button>
        </DialogFooter>
        <p className="text-center text-[11px] text-muted-foreground">
          路径 Mock：{INBOUND_STAGING_FORM_PATH}
        </p>
      </DialogContent>
    </Dialog>
  )
}
