import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Lock } from "lucide-react"
import { UnlockApplyTable } from "../components/UnlockApplyTable"
import { UnlockApplyApprovalDialog } from "../components/UnlockApplyApprovalDialog"
import { LIST_BASE_PATH, MY_APPLY_LIST_PATH } from "../domain/constants"
import type { UnlockApply } from "../domain/types"
import { countPendingForCurrentUser, filterUnlockApplies } from "../lib/list-utils"
import { useUnlockApplies } from "../lib/unlock-applies-store"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { approvalCenterHubAnnotations } from "../annotations/approval-center-hub.annotations"
import { unlockApplyAuditDocuments } from "../documents/unlock-apply-audit-documents"

export function ApprovalCenterPage() {
  const [selectedOtherApproval, setSelectedOtherApproval] = useState<
    "policy" | "unlock"
  >("unlock")
  const [processingApply, setProcessingApply] = useState<UnlockApply | null>(null)
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const openApproval = (apply: UnlockApply) => {
    setProcessingApply(apply)
    setApprovalOpen(true)
  }

  const allApplies = useUnlockApplies()

  const pendingCount = useMemo(
    () => countPendingForCurrentUser(allApplies.filter((item) => item.needsApproval)),
    [allApplies]
  )

  const previewItems = useMemo(
    () =>
      filterUnlockApplies(
        allApplies.filter((item) => item.needsApproval),
        {
        applyNo: "",
        deviceKeyword: "",
        warehouseName: "全部",
        applicantKeyword: "",
        reason: "全部",
        applyStatus: "待审批",
        submitTimeFrom: "",
        submitTimeTo: "",
      }
      ).slice(0, 5),
    [allApplies]
  )

  return (
    <PrototypeAnnotationProvider
      title="审批中心 · 原型交互与 PRD 标注"
      annotations={approvalCenterHubAnnotations}
      documents={unlockApplyAuditDocuments}
    >
      <div className="space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">审批中心</h1>
            <p className="text-sm text-muted-foreground">
              聚合入口 · 其他审批独立处理，不进待处理/已处理
            </p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>待确认合计 45</span>
            <span>今日新增 0</span>
          </div>
        </div>

        <PrototypeAnnotationTarget annotationIds={["approval-center-hub-page"]}>
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground">其他审批</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                to={MY_APPLY_LIST_PATH}
                className="flex min-w-[120px] flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <FileText className="size-5 text-blue-600" />
                <span className="text-sm font-medium">我的申请管理</span>
              </Link>
              <button
                type="button"
                onClick={() => setSelectedOtherApproval("policy")}
                className={`flex min-w-[120px] flex-col items-center gap-2 rounded-xl border p-4 ${
                  selectedOtherApproval === "policy"
                    ? "border-primary bg-primary/5"
                    : "bg-card"
                }`}
              >
                <span className="text-sm font-medium">政策资讯审核</span>
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">1</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOtherApproval("unlock")}
                className={`flex min-w-[120px] flex-col items-center gap-2 rounded-xl border p-4 ${
                  selectedOtherApproval === "unlock"
                    ? "border-primary bg-primary/5"
                    : "bg-card"
                }`}
              >
                <Lock className="size-5 text-orange-600" />
                <span className="text-sm font-medium">开锁审核</span>
                {pendingCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>
          </section>
        </PrototypeAnnotationTarget>

        {selectedOtherApproval === "unlock" ? (
          <PrototypeAnnotationTarget annotationIds={["approval-center-preview-table"]}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>开锁审核</CardTitle>
                <Link className="text-sm text-primary hover:underline" to={LIST_BASE_PATH}>
                  查看更多 &gt;
                </Link>
              </CardHeader>
              <CardContent>
                <UnlockApplyTable
                  items={previewItems}
                  compact
                  onProcess={openApproval}
                />
              </CardContent>
            </Card>
          </PrototypeAnnotationTarget>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>政策资讯审核</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              政策资讯审核预览区（占位，非 08 模块范围）
            </CardContent>
          </Card>
        )}

        <UnlockApplyApprovalDialog
          open={approvalOpen}
          apply={processingApply}
          onOpenChange={setApprovalOpen}
          onApprove={(_apply, _opinion) => showToast("审批通过")}
          onReject={(_apply, _reason) => showToast("已驳回")}
        />

        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
