import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Trash2 } from "lucide-react"
import type { DeliveryOrderItem } from "../domain/types"

interface DeliveryOrderConfirmDialogProps {
  open: boolean
  order: DeliveryOrderItem | null
  onClose: () => void
  onSuccess: (data: {
    isSelfPickup: boolean
    pickupPlate?: string
    notes?: string
    photos: string[]
  }) => void
}

export function DeliveryOrderConfirmDialog({
  open,
  order,
  onClose,
  onSuccess,
}: DeliveryOrderConfirmDialogProps) {
  const [isSelfPickup, setIsSelfPickup] = useState<boolean>(true)
  const [plateNo, setPlateNo] = useState(order?.pickupPlate || "川A88888")
  const [notes, setNotes] = useState("")
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
  ])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!open || !order) return null

  const handleUploadPhoto = () => {
    if (photos.length >= 10) return
    const mockList = [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60",
    ]
    setPhotos((prev) => [...prev, mockList[prev.length % mockList.length]])
  }

  const handleConfirm = () => {
    if (photos.length === 0) {
      setErrorMsg("请上传现场提货照片（至少1张）")
      return
    }
    setErrorMsg(null)
    onSuccess({
      isSelfPickup,
      pickupPlate: plateNo,
      notes,
      photos,
    })
    onClose()
  }

  const currentTime = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-")

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-4">
            <span>确认提货（免码现场直接提货）</span>
            <span className="text-xs font-normal text-muted-foreground">
              提货单号：{order.orderNo}
            </span>
          </DialogTitle>
          <DialogDescription>
            适用于仓库网络受限或现场直接交接场景。核对出库实物外观，拍摄装车照片并确认放行。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* 两列排版展示基础与提货人锁定信息 */}
          <div className="grid grid-cols-2 gap-3 rounded-md bg-muted/40 p-3">
            <div>
              <span className="text-muted-foreground">提货时间：</span>
              <span className="font-medium text-foreground ml-1">{currentTime}</span>
            </div>
            <div>
              <span className="text-muted-foreground">提货人类型：</span>
              <span className="font-medium text-foreground ml-1">{order.pickupPersonType}</span>
            </div>
            <div>
              <span className="text-muted-foreground">提货人姓名：</span>
              <span className="font-medium text-foreground ml-1">{order.pickupName}</span>
              <span className="text-[11px] text-muted-foreground ml-1">（档案只读锁定）</span>
            </div>
            <div>
              <span className="text-muted-foreground">提货人电话：</span>
              <span className="font-medium text-foreground ml-1">{order.pickupPhone}</span>
            </div>
            {order.pickupIdCard && (
              <div className="col-span-2">
                <span className="text-muted-foreground">提货人身份证号：</span>
                <span className="font-medium text-foreground ml-1">{order.pickupIdCard}</span>
              </div>
            )}
            {order.pickupIdentity && (
              <div className="col-span-2">
                <span className="text-muted-foreground">企业信用代码：</span>
                <span className="font-medium text-foreground ml-1">{order.pickupIdentity}</span>
              </div>
            )}
          </div>

          {/* 原出库照片与外观比对 */}
          {order.outboundPhotos && order.outboundPhotos.length > 0 && (
            <div className="space-y-1.5 rounded-md border p-3 bg-muted/10">
              <Label className="text-xs font-medium text-muted-foreground">
                原出库申报照片对照（核对实物外观与包装完好）：
              </Label>
              <div className="flex gap-2 pt-1 overflow-x-auto">
                {order.outboundPhotos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="原出库申报图"
                    className="size-16 rounded border object-cover shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* 是否本人提货 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground flex items-center">
              <span className="text-destructive mr-1">*</span>是否本人提货：
            </Label>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="confirmSelf"
                  checked={isSelfPickup}
                  onChange={() => setIsSelfPickup(true)}
                  className="size-4 text-primary"
                />
                <span>是（本人提货）</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="confirmSelf"
                  checked={!isSelfPickup}
                  onChange={() => setIsSelfPickup(false)}
                  className="size-4 text-primary"
                />
                <span>否（委托代领 / 司机代提）</span>
              </label>
            </div>
          </div>

          {/* 提货车牌号 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">提货车牌号：</Label>
            <Input
              value={plateNo}
              onChange={(e) => setPlateNo(e.target.value)}
              placeholder="请输入现场提货货车车牌号（如：川A88888）"
              className="text-xs h-8"
            />
          </div>

          {/* 现场提货装车照片 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground flex items-center">
              <span className="text-destructive mr-1">*</span>现场提货照片（装车复核/出库凭证，至少1张，最多10张）：
            </Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {photos.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group size-16 rounded border overflow-hidden bg-muted"
                >
                  <img
                    src={url}
                    alt="现场提货照片"
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos((p) => p.filter((_, i) => i !== idx))}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              {photos.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUploadPhoto}
                  className="size-16 flex flex-col items-center justify-center border-dashed text-muted-foreground hover:text-primary gap-1 p-0"
                >
                  <ImagePlus className="size-4" />
                  <span className="text-[10px]">上传照片</span>
                </Button>
              )}
            </div>
          </div>

          {/* 说明 */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">其他说明：</Label>
            <Textarea
              placeholder="请输入提货交接说明（选填，50字以内）"
              maxLength={50}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="text-xs"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-destructive font-medium">{errorMsg}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            取 消
          </Button>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleConfirm}
          >
            确认提货完成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
