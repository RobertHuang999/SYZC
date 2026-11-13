import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { QrCodeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { isPartnerChangeReviewMode } from "@/features/partner-synergy/lib/partner-change-review"
import { supervisionHandlingDocuments } from "../documents/supervision-handling-documents"
import { supervisionHandlingAnnotations } from "../annotations/supervision-handling.annotations"
import { SupervisionHandlingForm } from "../components/SupervisionHandlingForm"
import type { SupervisionDocKind } from "../domain/types"

function generate19DocNo(docKind: SupervisionDocKind): string {
  const prefix = docKind === "MORTGAGE" ? "DY" : docKind === "PLEDGE" ? "ZY" : "JG"
  const now = new Date()
  const p = (n: number) => String(n).padStart(2, "0")
  const stamp = `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}${p(now.getHours())}${p(now.getMinutes())}${p(now.getSeconds())}`
  const rand = String(Math.floor(100 + Math.random() * 900))
  return `${prefix}${stamp}${rand}`
}

export function SupervisionHandlingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const partnerReviewActive = isPartnerChangeReviewMode(searchParams.get("review"))
  const partnerMapId = searchParams.get("mapId")

  const [formKey, setFormKey] = useState(0)
  const [qrBarcode, setQrBarcode] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [submittedDocNo, setSubmittedDocNo] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2800)
  }

  return (
    <PrototypeAnnotationProvider
      documents={supervisionHandlingDocuments}
      annotations={supervisionHandlingAnnotations}
    >
      <PrototypeAnnotationTarget annotationIds={["supervision-handling-page"]}>
        <div id="supervision-handling-page" className="space-y-4 p-6">
          <SupervisionHandlingForm
            key={formKey}
            partnerReviewActive={partnerReviewActive}
            partnerMapId={partnerMapId}
            onResetForm={() => {
              setFormKey((k) => k + 1)
              showToast("已重置监管办理表单")
            }}
            onToast={showToast}
            onQrPreview={(code) => setQrBarcode(code)}
            onSubmitRecord={(payload, asDraft) => {
              const newApplyNo = generate19DocNo(payload.docKind)
              if (asDraft) {
                showToast(`已暂存草稿 ${newApplyNo}`)
              } else {
                setSubmittedDocNo(newApplyNo)
                showToast(`提交审核成功！已生成单据号 ${newApplyNo} 并锁定对应货位`)
              }
            }}
          />

          {/* 提交成功引导弹窗（可继续办理或前往监管管理台账查看） */}
          <Dialog
            open={Boolean(submittedDocNo)}
            onOpenChange={(v) => !v && setSubmittedDocNo(null)}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>监管办理提审成功</DialogTitle>
                <DialogDescription>
                  已生成 19 位业务单据号 <strong className="text-foreground">{submittedDocNo}</strong>，底层物理货位已互斥锁定并推入工作中心审批流；存续期订单与办理台账可在「监管管理」中查看。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSubmittedDocNo(null)
                    setFormKey((k) => k + 1)
                  }}
                >
                  继续办理下一笔
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setSubmittedDocNo(null)
                    navigate("/融资/监管/监管业务/监管管理")
                  }}
                >
                  前往监管管理台账
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 存货条码预览弹窗 */}
          <Dialog open={Boolean(qrBarcode)} onOpenChange={(v) => !v && setQrBarcode(null)}>
            <DialogContent className="max-w-xs text-center">
              <DialogHeader>
                <DialogTitle className="text-base">存货防伪数字条码</DialogTitle>
                <DialogDescription>对应货位物权存证哈希编码</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-3 py-3">
                <div className="flex size-36 items-center justify-center rounded-lg border bg-muted/20">
                  <QrCodeIcon className="size-24 text-foreground" />
                </div>
                <div className="text-xs font-medium text-foreground">{qrBarcode}</div>
              </div>
              <DialogFooter className="sm:justify-center">
                <Button type="button" variant="outline" size="sm" onClick={() => setQrBarcode(null)}>
                  关闭
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 全局 Toast 提示 */}
          {toast ? (
            <div className="fixed bottom-6 right-6 z-[60] rounded-lg border border-border bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg">
              {toast}
            </div>
          ) : null}
        </div>
      </PrototypeAnnotationTarget>
    </PrototypeAnnotationProvider>
  )
}
