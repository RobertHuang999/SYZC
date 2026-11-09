import { useState, useRef, useEffect } from "react"
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
import { ImagePlus, RefreshCw, Trash2, Info, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import type { DeliveryOrderItem } from "../domain/types"
import { fetchPickupCode, resetPickupCode } from "../mock/delivery-orders.mock"

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
  // 状态机：0 - 首次发送核销码确认；1 - 履约信息录入；2 - 4位PIN码核销
  const [stage, setStage] = useState<0 | 1 | 2>(1)
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

  useEffect(() => {
    if (order) {
      if (order.pickCodeStatus === "未获取") {
        setStage(0)
      } else {
        setStage(1)
      }
      setIsSelfPickup(order.isSelfPickup ?? true)
      setNotes(order.notes || "")
      setPin(order.pickCode ? order.pickCode.split("").slice(0, 4) : ["8", "8", "6", "6"])
      setErrorMsg(null)
    }
  }, [order, open])

  if (!open || !order) return null

  // 处理首次发送提货核销码
  const handleInitialSendCode = () => {
    fetchPickupCode(order.id)
    setStage(1)
  }

  // 上传交接照片（模拟）
  const handleUploadPhoto = () => {
    if (photos.length >= 5) return
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

  // 4位数字输入框跳格与退格
  const handlePinChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1)
    const next = [...pin]
    next[index] = digit
    setPin(next)
    setErrorMsg(null)

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  // 第一步到第二步
  const handleNext = () => {
    if (photos.length === 0) {
      setErrorMsg("请上传提货交接实物照片（必填，单张不超过5M）")
      return
    }
    setErrorMsg(null)
    setStage(2)
    setTimeout(() => {
      inputRefs[0].current?.focus()
    }, 100)
  }

  // 重置提货码二次确认
  const handleConfirmResetCode = () => {
    resetPickupCode(order.id)
    setResetConfirmOpen(false)
    if (onResetCode) onResetCode()
  }

  // 最终确认核销
  const handleConfirmWriteOff = () => {
    const fullPin = pin.join("")
    if (fullPin.length < 4) {
      setErrorMsg("请输入完整的4位数字提货核销码")
      return
    }
    // 校验与当前单据核销码匹配
    if (order.pickCode && fullPin !== order.pickCode) {
      setErrorMsg("提货码错误，请重新输入（测试可用默认码：" + order.pickCode + "）")
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
      {/* 阶段 0：首次获取核销码提示弹窗（未获取状态下触发，对齐 ASCII 1.1） */}
      {stage === 0 && (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
          <DialogContent className="max-w-md font-sans">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <Info className="size-5 text-amber-600" />
                <span>提货码核销</span>
              </DialogTitle>
              <DialogDescription className="pt-2 text-xs leading-relaxed text-foreground">
                <p className="font-medium text-foreground">当前未获取提货码，确认发送提货核销码？</p>
                <p className="text-muted-foreground mt-2">
                  核销码发送后 7 日内有效，请在有效期及时核销，超过有效期请重置提货码。
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                取消
              </Button>
              <Button
                size="sm"
                className="text-xs px-4"
                onClick={handleInitialSendCode}
              >
                确 定
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 阶段 1：履约信息录入（对齐 ASCII 1.2） */}
      {stage === 1 && (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
          <DialogContent className="max-w-lg font-sans">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between pr-4 text-foreground">
                <span>提货码核销</span>
                <span className="text-xs font-normal text-muted-foreground">
                  第一步：录入履约信息
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                提货单号：{order.orderNo} · 提货人：{order.pickupName} ({order.pickupPhone})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* 是否本人提货 */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground whitespace-nowrap">
                  <span className="text-destructive mr-0.5">*</span>是否本人提货：
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="isSelfPickup"
                      checked={isSelfPickup === true}
                      onChange={() => setIsSelfPickup(true)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>是</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="isSelfPickup"
                      checked={isSelfPickup === false}
                      onChange={() => setIsSelfPickup(false)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span>否</span>
                  </label>
                </div>
              </div>

              {/* 提货照片（必填） */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    <span className="text-destructive mr-0.5">*</span>提货照片：
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    支持 jpg、png、jpeg，单张不超过 5M（已传 {photos.length}/5）
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {photos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative size-20 rounded-md border border-border overflow-hidden group bg-muted/20"
                    >
                      <img src={url} alt="提货凭据" className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <button
                      type="button"
                      onClick={handleUploadPhoto}
                      className="flex size-20 flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/40 hover:border-amber-600 hover:text-amber-600 transition-colors bg-muted/10 text-muted-foreground"
                    >
                      <ImagePlus className="size-5 mb-1" />
                      <span className="text-[10px]">上 传</span>
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

            <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setResetConfirmOpen(true)}
                className="text-xs gap-1.5 text-muted-foreground hover:text-amber-700"
              >
                <RefreshCw className="size-3.5" />
                重置提货码
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
                  取消
                </Button>
                <Button
                  size="sm"
                  className="text-xs px-4"
                  onClick={handleNext}
                >
                  下一步
                  <ArrowRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 阶段 2：4位 PIN 码输入格（对齐 ASCII 1.3） */}
      {stage === 2 && (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
          <DialogContent className="max-w-md font-sans">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between pr-4 text-foreground">
                <span>提货码核销</span>
                <span className="text-xs font-normal text-muted-foreground">
                  第二步：输入 4 位核销码
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                请输入提货人手机短信中接收到的 4 位数字核销码（测试码：{order.pickCode || "8866"}）
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={pin[idx] || ""}
                    onChange={(e) => handlePinChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="size-14 text-center text-2xl font-bold rounded-lg border-2 border-border focus:border-amber-600 focus:outline-hidden bg-background text-foreground shadow-2xs transition-all"
                  />
                ))}
              </div>

              {errorMsg && (
                <p className="text-xs text-destructive font-medium">{errorMsg}</p>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setErrorMsg(null)
                  setStage(1)
                }}
                className="text-xs gap-1"
              >
                <ArrowLeft className="size-3.5" />
                上一步
              </Button>
              <Button
                size="sm"
                className="text-xs px-5 shadow-xs"
                onClick={handleConfirmWriteOff}
              >
                <CheckCircle2 className="size-3.5 mr-1" />
                确认核销
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 重置提货码二次确认弹窗（对齐 ASCII 1.2.1） */}
      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent className="max-w-sm font-sans">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Info className="size-4 text-amber-600" />
              <span>确认发送提货核销码</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1.5 leading-relaxed">
              核销码发送后 7 日内有效，请在有效期及时核销，超过有效期请重置提货码。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetConfirmOpen(false)}
              className="text-xs"
            >
              取消
            </Button>
            <Button
              size="sm"
              className="text-xs"
              onClick={handleConfirmResetCode}
            >
              确 定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
