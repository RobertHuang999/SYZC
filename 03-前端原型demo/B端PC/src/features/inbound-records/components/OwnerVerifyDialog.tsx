import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { OwnerType } from "../domain/form-types"

type OwnerVerifyDialogProps = {
  open: boolean
  ownerType: OwnerType
  ownerName: string
  ownerIdentifier: string
  contactOrIdCard: string
  onOpenChange: (open: boolean) => void
  onBack: () => void
  onConfirm: () => void
}

export function OwnerVerifyDialog({
  open,
  ownerType,
  ownerName,
  ownerIdentifier,
  contactOrIdCard,
  onOpenChange,
  onBack,
  onConfirm,
}: OwnerVerifyDialogProps) {
  const [code, setCode] = useState("")
  const [seconds, setSeconds] = useState(60)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setCode("")
      setError(null)
      setSeconds(60)
      return
    }
    setSeconds(60)
    const timer = window.setInterval(() => {
      setSeconds((value) => (value > 0 ? value - 1 : 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [open])

  const handleConfirm = () => {
    if (code.trim() !== "123456" && code.trim().length !== 6) {
      setError("验证码错误或已失效，请重新输入")
      return
    }
    setError(null)
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>货主信息确认</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 rounded-md border bg-muted/20 p-4 text-sm">
          <InfoRow label="货主类型" value={ownerType === "企业货主" ? "企业" : "个人"} />
          <InfoRow label="货主名称" value={ownerName} />
          <InfoRow label="货主标识" value={ownerIdentifier} />
          {ownerType === "个人货主" ? (
            <InfoRow label="货主身份证号" value={contactOrIdCard} />
          ) : (
            <InfoRow label="联系电话" value={contactOrIdCard} />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner-sms-code">请输入验证码</Label>
          <div className="flex items-center gap-2">
            <Input
              id="owner-sms-code"
              placeholder="6 位短信验证码（演示可填 123456）"
              value={code}
              maxLength={6}
              onChange={(event) => setCode(event.target.value)}
            />
            <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
              {seconds > 0 ? `${seconds} s` : "重新获取"}
            </span>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button type="button" variant="outline" onClick={onBack}>
            返回修改
          </Button>
          <Button type="button" onClick={handleConfirm}>
            提交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  )
}
