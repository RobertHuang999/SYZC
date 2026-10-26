import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AlertTriangle, ChevronDown } from "lucide-react"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { FaceSignatureSheet } from "../../components/FaceSignatureSheet"
import { ReceiptOpsHeader } from "../../components/ReceiptOpsHeader"
import {
  RECEIPT_H5_LIST_ROUTE,
} from "../../domain/constants"
import { getMobileReceiptById } from "../../mock/warehouse-receipts.mock"
import { backToReceiptDetail } from "../../lib/ops-utils"
import { cn } from "@/lib/utils"

const NOTICE_PARAGRAPHS = [
  "1、仓单注销申请通过后，所有货物将从仓单中释放，仓单下所有货物可通过存货方式出库。",
  "2、仓单注销申请通过后，该仓单将显示注销状态，系统不再允许针对该仓单进行任何操作，包括监管业务或监管。",
  "3、参与了平仓的仓单仅变更了仓单的持有人，货物记录的货主仍然是入库时的货主；仓单注销后通过存货出库时，货主显示为非仓单持有人属于正常现象。",
  "4、注销为不可逆终态。审批通过后，该仓单不可再被抵质押、融资申请、监管办理或线索业务选中。",
]

export function ReceiptCancelPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const receipt = useMemo(() => getMobileReceiptById(id), [id])

  const [step, setStep] = useState<0 | 1>(0)
  const [countdown, setCountdown] = useState(10)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [signOpen, setSignOpen] = useState(false)

  useEffect(() => {
    if (step !== 0) return
    if (countdown <= 0) return
    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [step, countdown])

  if (!receipt) {
    return (
      <MobileShell>
        <NavBar title="仓单注销" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-[#232D39]/50">
          未找到该仓单
        </div>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <div className="flex min-h-0 flex-1 flex-col bg-[#edf2f8]">
        <PrototypeAnnotationTarget
          annotationIds={["receipt-h5-ops-cancel"]}
          className="flex min-h-0 flex-1 flex-col"
        >
          <NavBar
            title="仓单注销"
            onBack={() => (step === 0 ? navigate(-1) : setStep(0))}
          />

          <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3.5 pb-28 pt-3">
            <ReceiptOpsHeader receipt={receipt} />

            {step === 0 ? (
              <section className="rounded-xl border border-amber-200 bg-white p-4 shadow-xs">
                <h2 className="text-center text-sm font-bold text-[#232D39]">
                  重要提醒
                </h2>
                <p className="mt-3 text-xs text-[#232D39]/70">
                  请认真阅读并注意：
                </p>
                <div className="mt-2 space-y-2.5 text-xs leading-relaxed text-[#232D39]/70">
                  {NOTICE_PARAGRAPHS.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-4 flex flex-col items-center text-[11px] text-amber-600">
                  <ChevronDown className="size-4 animate-bounce" />
                  请向下滑动屏幕阅读全文
                </div>
              </section>
            ) : (
              <section className="rounded-xl border border-[#232D39]/10 bg-white p-3.5 shadow-xs">
                <h3 className="text-sm font-semibold text-[#232D39]">注销信息</h3>
                <div className="mt-2.5 space-y-2 rounded-lg bg-[#232D39]/4 px-3 py-2.5 text-xs">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[#232D39]/50">仓单编号</span>
                    <span className="text-right font-medium text-[#232D39]">
                      {receipt.code}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[#232D39]/50">存货人</span>
                    <span className="text-right text-[#232D39]">
                      {receipt.owner.name}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[#232D39]/50">注销方式</span>
                    <span className="text-right text-[#232D39]">
                      电子签章 + 审批流
                    </span>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-[#232D39]/4 px-3 py-2">
                  <textarea
                    value={reason}
                    maxLength={140}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="注销原因（选填，最多 140 字）"
                    className="min-h-[64px] w-full resize-none bg-transparent text-sm text-[#232D39] outline-none placeholder:text-[#232D39]/30"
                  />
                  <p className="text-right text-[11px] text-[#232D39]/30">
                    {reason.length}/140
                  </p>
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2.5 text-[11px] leading-relaxed text-rose-700">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  提交后生成【仓单注销申请】审批单据，审批通过即置为注销终态，不可撤销。
                </div>
              </section>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 flex gap-2 border-t border-[#232D39]/8 bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex h-11 flex-1 items-center justify-center rounded-lg border border-[#232D39]/20 text-sm font-medium text-[#232D39] active:bg-gray-50"
              >
                上一步
              </button>
            ) : null}
            {step === 0 ? (
              <button
                type="button"
                disabled={countdown > 0}
                onClick={() => setConfirmOpen(true)}
                className={cn(
                  "h-11 flex-1 rounded-lg text-sm font-medium",
                  countdown > 0
                    ? "bg-[#BBC2D0] text-white"
                    : "bg-blue-600 text-white active:bg-blue-700",
                )}
              >
                {countdown > 0 ? `下一步（${countdown}s）` : "下一步"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSignOpen(true)}
                className="h-11 flex-[1.4] rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
              >
                继续电子签章
              </button>
            )}
          </div>
        </PrototypeAnnotationTarget>

        {confirmOpen ? (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/45 px-6">
            <div className="w-full max-w-sm rounded-2xl bg-white p-4">
              <h3 className="text-center text-sm font-bold text-[#232D39]">
                仓单注销确认
              </h3>
              <p className="mt-2.5 text-center text-xs leading-relaxed text-[#232D39]/70">
                您是否仔细阅读重要提醒，且已知晓仓单注销后果！若您已确认并仍需注销仓单，请点击继续！
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmOpen(false)
                    navigate(RECEIPT_H5_LIST_ROUTE)
                  }}
                  className="h-10 flex-1 rounded-lg border border-[#232D39]/20 text-sm font-medium text-[#232D39] active:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmOpen(false)
                    setStep(1)
                  }}
                  className="h-10 flex-1 rounded-lg bg-blue-600 text-sm font-medium text-white active:bg-blue-700"
                >
                  继续
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <FaceSignatureSheet
          open={signOpen}
          title="仓单注销 · 电子签章"
          description="注销将终止仓单全部法律效力，须由存货人/法定代表人完成活体人脸识别与短信验证码校验。"
          agreementLabel="本人已仔细阅读重要提醒，知晓注销后果并自愿签署仓单注销确认书"
          confirmLabel="提交注销申请"
          onClose={() => setSignOpen(false)}
          onConfirm={() => {
            setSignOpen(false)
            backToReceiptDetail(
              navigate,
              receipt.id,
              "仓单注销申请已提交，审批通过后仓单将彻底作废",
            )
          }}
        />

      </div>
    </MobileShell>
  )
}
