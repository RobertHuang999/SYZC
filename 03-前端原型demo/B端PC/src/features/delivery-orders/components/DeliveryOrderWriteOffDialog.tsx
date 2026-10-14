import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, RefreshCw, Trash2, CheckCircle2 } from "lucide-react"
import type { DeliveryOrderItem } from "../domain/types"

interface DeliveryOrderWriteOffDialogProps {
  open: boolean
  order: DeliveryOrderItem | null
  onClose: () => void
  onSuccess: (data: {
    isSelfPickup: boolean
    notes: string
    photos: string[]
  }) => void
  onResetCode?: () => void
}

export function DeliveryOrderWriteOffDialog({
  open,
  order,
  onClose,
  onSuccess,
  onResetCode,
}: DeliveryOrderWriteOffDialogProps) {
  // 步骤 1: 录入履约信息；步骤 2: 输入4位PIN码
  const [step, setStep] = useState<1 | 2>(1)
  const [isSelfPickup, setIsSelfPickup] = useState<boolean>(true)
  const [notes, setNotes] = useState("")
  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
  ])
  const [pin, setPin] = useState(["8", "8", "6", "6"])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  if (!open || !order) return null

  const handleUploadPhoto = () => {
    if (photos.length >= 5) return
    const mockList = [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60",
    ]
    setPhotos((prev) => [...prev, mockList[prev.length % mockList.length]])
  }

  const handlePinChange = (index: number, val: string) => {
    const digit = val.slice(-1)
    const next = [...pin]
    next[index] = digit
    setPin(next)
    setErrorMsg(null)

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleNext = () => {
    if (photos.length === 0) {
      setErrorMsg("请上传提货交接实物或签收凭证照片")
      return
    }
    setErrorMsg(null)
    setStep(2)
  }

  const handleConfirmWriteOff = () => {
    const fullPin = pin.join("")
    if (fullPin.length < 4) {
      setErrorMsg("请输入完整的4位数字提货核销码")
      return
    }
    onSuccess({
      isSelfPickup,
      notes,
      photos,
    })
    onClose()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-4">
              <span>提货码核销</span>
              <span className="text-xs font-normal text-muted-foreground">
                单号：{order.orderNo}
              </span>
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? "第 1 步：核对提货人身份，拍摄现场交接照片与凭证"
                : "第 2 步：请输入提货人手机接收到的 4 位动态提货码"}
            </DialogDescription>
          </DialogHeader>

          {step === 1 ? (
            <div className="space-y-4 py-2 text-xs">
              <div className="rounded-md bg-muted/40 p-3 space-y-1 text-muted-foreground">
                <p>
                  • 提货人：
                  <strong className="text-foreground">{order.pickupName}</strong> (
                  {order.pickupPhone})
                </p>
                <p>• 货主：{order.ownerName}</p>
                <p>
                  • 出库货物：
                  {order.goodsSummaryList.map((g) => `${g.categoryName}-${g.subCategoryName} (${g.amount}${g.unit})`).join("、")}
                </p>
              </div>

              {/* 是否本人提货 */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground flex items-center">
                  <span className="text-destructive mr-1">*</span>是否本人提货：
                </Label>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="selfPickup"
                      checked={isSelfPickup}
                      onChange={() => setIsSelfPickup(true)}
                      className="size-4 text-primary"
                    />
                    <span>是（本人提货）</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="selfPickup"
                      checked={!isSelfPickup}
                      onChange={() => setIsSelfPickup(false)}
                      className="size-4 text-primary"
                    />
                    <span>否（委托代领 / 司机代办）</span>
                  </label>
                </div>
              </div>

              {/* 提货交接照片 */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground flex items-center">
                  <span className="text-destructive mr-1">*</span>提货交接照片（至少1张，最多5张）：
                </Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group size-16 rounded border overflow-hidden bg-muted"
                    >
                      <img
                        src={url}
                        alt="提货照片"
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
                  {photos.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleUploadPhoto}
                      className="size-16 flex flex-col items-center justify-center border-dashed text-muted-foreground hover:text-primary gap-1 p-0"
                    >
                      <ImagePlus className="size-4" />
                      <span className="text-[10px]">现场拍照</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* 其他说明 */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">其他说明：</Label>
                <Textarea
                  placeholder="请输入提货交接说明（如装载车辆状态、外观完好等，选填，最多50字）"
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
          ) : (
            <div className="py-6 space-y-6 text-center">
              <div>
                <p className="text-sm font-medium text-foreground">
                  已向提货人手机 ({order.pickupPhone}) 下发 4 位验证码
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  请向司机或现场经办人索取 4 位动态验证码并输入：
                </p>
              </div>

              {/* 4 位独立方格输入框 */}
              <div className="flex justify-center items-center gap-3">
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    className="size-14 text-center text-2xl font-bold rounded-lg border-2 border-primary/40 focus:border-primary focus:outline-none bg-background shadow-xs transition-all"
                  />
                ))}
              </div>

              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>动态提货码有效时限为 7 天（默认演示码：8866）</span>
              </div>

              {errorMsg && (
                <p className="text-xs text-destructive font-medium">{errorMsg}</p>
              )}
            </div>
          )}

          <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
            {step === 1 ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-primary gap-1"
                  onClick={() => setResetConfirmOpen(true)}
                >
                  <RefreshCw className="size-3.5" />
                  重置提货码
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onClose}>
                    取 消
                  </Button>
                  <Button size="sm" onClick={handleNext}>
                    下一步
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(1)}
                >
                  上一步
                </Button>
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleConfirmWriteOff}
                >
                  确认核销
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 重置提货码二次确认弹窗 */}
      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>重置提货核销码</DialogTitle>
            <DialogDescription>
              确定要为提货人【{order.pickupName}】重新生成并发送提货核销码短信吗？重置后原提货码立即失效，新码有效期 7 天。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setResetConfirmOpen(false)}>
              取 消
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setResetConfirmOpen(false)
                onResetCode?.()
              }}
            >
              确认重置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
