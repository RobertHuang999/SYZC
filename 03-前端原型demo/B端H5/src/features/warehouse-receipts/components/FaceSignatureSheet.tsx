import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, Loader2, ScanFace, ShieldCheck } from "lucide-react"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { ReceiptSheet } from "./ReceiptSheet"
import { cn } from "@/lib/utils"

type FaceState = "idle" | "loading" | "done"

export function FaceSignatureSheet({
  open,
  title = "电子签章",
  description = "仓单货权处置须由当事人完成活体人脸识别并输入短信验证码，两项通过后方可提交。",
  agreementLabel = "本人已阅读并同意《电子仓单法律协议》及本次业务办理条款",
  requireAgreement = true,
  confirmLabel = "提交申请",
  theme = "blue",
  annotationIds,
  onClose,
  onConfirm,
}: {
  open: boolean
  title?: string
  description?: string
  agreementLabel?: string
  requireAgreement?: boolean
  confirmLabel?: string
  theme?: "blue" | "gold"
  annotationIds?: string[]
  onClose: () => void
  onConfirm: (meta: { faceVerified: boolean; smsVerified: boolean }) => void
}) {
  const [faceState, setFaceState] = useState<FaceState>("idle")
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [code, setCode] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setFaceState("idle")
    setCodeSent(false)
    setCountdown(0)
    setCode("")
    setAgreed(false)
    setError(null)
  }, [open])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [countdown])

  useEffect(() => {
    if (faceState === "done") setError(null)
  }, [faceState])

  const isGold = theme === "gold"
  const accentText = isGold ? "text-[#C98A1E]" : "text-blue-600"
  const softButton = isGold
    ? "bg-[#FBF4E6] text-[#C98A1E] active:bg-[#F7EAD1]"
    : "bg-blue-50 text-blue-600 active:bg-blue-100"
  const primaryButton = isGold
    ? "bg-[#E0A23C] text-white active:bg-[#CE8F2C]"
    : "bg-blue-600 text-white active:bg-blue-700"
  const checkedRadio = isGold
    ? "border-[#E0A23C] bg-[#E0A23C]"
    : "border-blue-600 bg-blue-600"

  const smsReady = codeSent && code.length === 6
  const canSubmit = faceState === "done" && smsReady && (!requireAgreement || agreed)

  const hint = useMemo(() => {
    if (faceState !== "done") return "请先完成人脸活体识别"
    if (!codeSent) return "人脸已通过，请获取短信验证码"
    if (!smsReady) return "请输入 6 位短信验证码"
    if (requireAgreement && !agreed) return "请勾选协议后提交"
    return "三项已就绪，可以提交"
  }, [faceState, codeSent, smsReady, requireAgreement, agreed])

  const startFace = () => {
    setError(null)
    setFaceState("loading")
    window.setTimeout(() => setFaceState("done"), 1200)
  }

  const sendCode = () => {
    if (faceState !== "done") {
      setError("请先完成人脸活体识别，系统才会下发短信验证码")
      return
    }
    setCodeSent(true)
    setCountdown(60)
    setError(null)
  }

  const submit = () => {
    if (!canSubmit) {
      setError(hint)
      return
    }
    if (requireAgreement && !agreed) {
      setError("请先勾选协议")
      return
    }
    onConfirm({ faceVerified: true, smsVerified: true })
  }

  const content = (
    <div className="space-y-3">
      <div className="rounded-xl border border-[#232D39]/10 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-[#232D39]">
            <ScanFace className={cn("size-4", accentText)} />
            人脸识别
            <span className="text-[#EF3E3E]">*</span>
          </div>
          {faceState === "done" ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="size-3.5" />
              人脸识别已完成
            </span>
          ) : faceState === "loading" ? (
            <span className={cn("inline-flex items-center gap-1 text-xs", accentText)}>
              <Loader2 className="size-3.5 animate-spin" />
              识别中...
            </span>
          ) : (
            <button
              type="button"
              onClick={startFace}
              className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", softButton)}
            >
              开始识别
            </button>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-[#232D39]/45">
          调用公安底库活体检测，请正对镜头并保持光线充足
        </p>
      </div>

      <div
        className={cn(
          "rounded-xl border p-3.5 transition-opacity",
          faceState === "done"
            ? "border-[#232D39]/10"
            : "border-[#232D39]/8 opacity-55",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[#232D39]">
            <ShieldCheck className={cn("size-4", accentText)} />
            短信验证码
            <span className="text-[#EF3E3E]">*</span>
          </div>
          <button
            type="button"
            disabled={faceState !== "done" || countdown > 0}
            onClick={sendCode}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium",
              faceState !== "done" || countdown > 0
                ? "bg-[#232D39]/8 text-[#232D39]/40"
                : softButton,
            )}
          >
            {countdown > 0 ? `${countdown}s 后重发` : "获取验证码"}
          </button>
        </div>
        <input
          inputMode="numeric"
          maxLength={6}
          value={code}
          disabled={faceState !== "done"}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="请输入 6 位验证码"
          className="mt-2.5 w-full rounded-lg bg-[#232D39]/5 px-3 py-2.5 text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
        />
        <p className="mt-1.5 text-[11px] text-[#232D39]/45">
          验证码发送至货主绑定手机；原型演示可输入 123456
        </p>
      </div>

      {requireAgreement ? (
        <button
          type="button"
          onClick={() => setAgreed((prev) => !prev)}
          className="flex w-full items-start gap-2 rounded-xl bg-[#232D39]/4 px-3 py-2.5 text-left"
        >
          <span
            className={cn(
              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
              agreed ? checkedRadio : "border-[#232D39]/30 bg-white",
            )}
          >
            {agreed ? <CheckCircle2 className="size-3 text-white" /> : null}
          </span>
          <span className="text-xs leading-relaxed text-[#232D39]/70">
            {agreementLabel}
          </span>
        </button>
      ) : null}

      <p
        className={cn(
          "text-center text-[11px]",
          canSubmit ? "text-emerald-600" : "text-[#232D39]/45",
        )}
      >
        {error ?? hint}
      </p>
    </div>
  )

  return (
    <ReceiptSheet
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      footer={
        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className={cn(
            "flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium",
            canSubmit ? primaryButton : "bg-[#BBC2D0] text-white",
          )}
        >
          {confirmLabel}
        </button>
      }
    >
      {annotationIds?.length ? (
        <PrototypeAnnotationTarget annotationIds={annotationIds}>
          {content}
        </PrototypeAnnotationTarget>
      ) : (
        content
      )}
    </ReceiptSheet>
  )
}
