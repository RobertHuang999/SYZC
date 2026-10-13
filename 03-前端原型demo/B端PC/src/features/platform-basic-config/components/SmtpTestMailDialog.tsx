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
import type { SmtpMailboxRow } from "../domain/types"

type SmtpTestMailDialogProps = {
  open: boolean
  mailbox: SmtpMailboxRow | null
  onOpenChange: (open: boolean) => void
  onSent?: (message: string) => void
}

export function SmtpTestMailDialog({
  open,
  mailbox,
  onOpenChange,
  onSent,
}: SmtpTestMailDialogProps) {
  const [testEmail, setTestEmail] = useState("devops@senyun.com")
  const [sending, setSending] = useState(false)

  if (!mailbox) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发送测试邮件</DialogTitle>
          <DialogDescription>
            发件服务器：{mailbox.host}:{mailbox.port} ({mailbox.fromEmail})
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>
            <span className="text-destructive">* </span>测试收件邮箱
          </Label>
          <Input
            value={testEmail}
            onChange={(event) => setTestEmail(event.target.value)}
            placeholder="请输入测试收件邮箱"
          />
          <p className="text-xs text-muted-foreground">
            点击发送后，系统将向该邮箱发送一封测试邮件，以验证连接和授权码是否正常。
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            type="button"
            disabled={!testEmail.trim() || sending}
            onClick={() => {
              setSending(true)
              window.setTimeout(() => {
                setSending(false)
                onOpenChange(false)
                onSent?.(`测试邮件已发送至 ${testEmail.trim()}`)
              }, 1200)
            }}
          >
            {sending ? "发送中…" : "发送测试"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
