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
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Trash2, Clock, CheckCircle2, ShieldCheck, Eye } from "lucide-react"
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
  const [plateNo, setPlateNo] = useState(order?.pickupPlate || "川A99881")
  const [notes, setNotes] = useState("")
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
  ])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)

  if (!open || !order) return null

  const handleUploadPhoto = () => {
    if (photos.length >= 10) return
    const mockList = [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
    ]
    setPhotos((prev) => [...prev, mockList[prev.length % mockList.length]])
  }

  const handleRemovePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleConfirm = () => {
    if (photos.length === 0) {
      setErrorMsg("请上传提货交接现场照片（必填，最多10张）")
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
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-4 text-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-amber-600" />
                <span>确认提货（免码现场直接确认）</span>
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                提货单号：{order.orderNo}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              适用于仓库弱网或当面交接场景。系统锁定提货人原始档案防篡改，现场比对出库照片并完成交接拍照。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* 提货时间（带出只读） */}
            <div className="flex items-center gap-3">
              <span className="font-medium text-foreground whitespace-nowrap">提货时间：</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded border text-muted-foreground">
                <Clock className="size-3.5" />
                <span>{currentTime}</span>
                <span className="text-[10px] text-muted-foreground/70 ml-1">（系统当前时间·只读）</span>
              </div>
            </div>

            {/* 是否本人提货 */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-foreground whitespace-nowrap">
                <span className="text-destructive mr-0.5">*</span>是否本人提货：
              </span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="confirmSelfPickup"
                    checked={isSelfPickup === true}
                    onChange={() => setIsSelfPickup(true)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>是</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="confirmSelfPickup"
                    checked={isSelfPickup === false}
                    onChange={() => setIsSelfPickup(false)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>否</span>
                </label>
              </div>
              <span className="text-[11px] text-muted-foreground">
                （选“否”下方提货人信息仍灰底锁定只读，严格防篡改）
              </span>
            </div>

            {/* 提货人信息回显（灰底只读带出，防篡改） */}
            <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
              <div className="flex items-center justify-between text-muted-foreground border-b pb-1.5">
                <span className="font-medium text-foreground">预留提货人档案（只读带出）</span>
                <span className="text-[11px]">出库登记原件·不可修改</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div>
                  <span className="text-muted-foreground">提货人类型：</span>
                  <span className="font-medium text-foreground ml-1">{order.pickupPersonType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {order.pickupPersonType === "企业" ? "经办人姓名：" : "提货人姓名："}
                  </span>
                  <span className="font-medium text-foreground ml-1">
                    {order.pickupOperator || order.pickupName}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">联系电话：</span>
                  <span className="font-medium text-foreground ml-1">{order.pickupPhone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">身份证号码：</span>
                  <span className="font-medium text-foreground ml-1">
                    {order.pickupIdCard ? `${order.pickupIdCard.slice(0, 6)}****${order.pickupIdCard.slice(-4)}` : "—"}
                  </span>
                </div>
                {order.pickupPersonType === "企业" && (
                  <>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">企业名称：</span>
                      <span className="font-medium text-foreground ml-1">{order.pickupName}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">统一社会信用代码：</span>
                      <span className="font-medium text-foreground ml-1">{order.pickupIdentity || "—"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 车牌号 */}
            <div className="space-y-1">
              <span className="font-medium text-foreground">车牌号：</span>
              <Input
                placeholder="请输入车牌号（选填）"
                value={plateNo}
                onChange={(e) => setPlateNo(e.target.value)}
                className="h-8 text-xs max-w-xs"
              />
            </div>

            {/* 原出库现场照片（只读比对） */}
            <div className="space-y-1.5">
              <span className="font-medium text-foreground">原出库现场照片（只读比对）：</span>
              <div className="flex flex-wrap gap-2">
                {order.outboundPhotos && order.outboundPhotos.length > 0 ? (
                  order.outboundPhotos.map((url, i) => (
                    <div
                      key={i}
                      className="relative size-16 rounded border overflow-hidden cursor-pointer group bg-muted/20"
                      onClick={() => setPreviewPhoto(url)}
                    >
                      <img src={url} alt="原出库照片" className="size-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Eye className="size-3.5" />
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-muted-foreground text-[11px]">无原出库现场照片</span>
                )}
              </div>
            </div>

            {/* 提货照片（必填，最多10张） */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">
                  <span className="text-destructive mr-0.5">*</span>提货照片：
                </span>
                <span className="text-[11px] text-muted-foreground">
                  最多 10 张，单张不超过 5M（已传 {photos.length}/10）
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {photos.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative size-20 rounded-md border border-border overflow-hidden group bg-muted/20"
                  >
                    <img src={url} alt="现场提货照片" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
                {photos.length < 10 && (
                  <button
                    type="button"
                    onClick={handleUploadPhoto}
                    className="flex size-20 flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/40 hover:border-amber-600 hover:text-amber-600 transition-colors bg-muted/10 text-muted-foreground"
                  >
                    <ImagePlus className="size-5 mb-1" />
                    <span className="text-[10px]">请上传图片</span>
                  </button>
                )}
              </div>
            </div>

            {/* 其他说明 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">其他说明：</span>
                <span className="text-[11px] text-muted-foreground">{notes.length}/50</span>
              </div>
              <Textarea
                placeholder="请输入其他说明（选填，50字以内）"
                maxLength={50}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="text-xs"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                {errorMsg}
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              取消
            </Button>
            <Button
              size="sm"
              className="text-xs px-6 shadow-xs"
              onClick={handleConfirm}
            >
              <CheckCircle2 className="size-3.5 mr-1" />
              确认提货
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 照片放大预览 */}
      {previewPhoto && (
        <Dialog open={true} onOpenChange={() => setPreviewPhoto(null)}>
          <DialogContent className="max-w-3xl p-2">
            <img src={previewPhoto} alt="大图预览" className="w-full max-h-[80vh] object-contain rounded" />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
