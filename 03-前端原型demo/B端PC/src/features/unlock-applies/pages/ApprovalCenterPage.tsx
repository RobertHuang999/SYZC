import { useMemo, useState } from "react"
import { UnlockApplyApprovalDialog } from "../components/UnlockApplyApprovalDialog"
import { ApprovalCenterNavStrip } from "../components/ApprovalCenterNavStrip"
import { ApprovalCenterPreviewPanel } from "../components/ApprovalCenterPreviewPanel"
import type { UnlockApply } from "../domain/types"
import { countPendingForCurrentUser, filterUnlockApplies } from "../lib/list-utils"
import { useUnlockApplies } from "../lib/unlock-applies-store"
import {
  PREVIEW_ROW_LIMIT,
  approvalCenterCardGroups,
  approvalCenterCards,
} from "../mock/approval-center-hub.mock"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { approvalCenterHubAnnotations } from "../annotations/approval-center-hub.annotations"
import { unlockApplyAuditDocuments } from "../documents/unlock-apply-audit-documents"

export function ApprovalCenterPage() {
  const [selectedCardId, setSelectedCardId] = useState("pending")
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
    [allApplies],
  )

  const unlockPreviewItems = useMemo(
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
        },
      ).slice(0, PREVIEW_ROW_LIMIT),
    [allApplies],
  )

  const cardGroups = useMemo(
    () =>
      approvalCenterCardGroups.map((group) =>
        group.id === "other"
          ? {
              ...group,
              cards: group.cards.map((card) =>
                card.id === "unlock" ? { ...card, badge: pendingCount || undefined } : card,
              ),
            }
          : group,
      ),
    [pendingCount],
  )

  const selectedCard = useMemo(() => {
    return (
      cardGroups.flatMap((group) => group.cards).find((card) => card.id === selectedCardId) ??
      approvalCenterCards[0]
    )
  }, [cardGroups, selectedCardId])

  return (
    <PrototypeAnnotationProvider
      title="审批中心 · 原型交互与 PRD 标注"
      annotations={approvalCenterHubAnnotations}
      documents={unlockApplyAuditDocuments}
    >
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-semibold tracking-tight">审批中心</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-orange-500" />
              待确认合计 44
            </span>
            <span>今日新增 0</span>
          </div>
        </div>

        <PrototypeAnnotationTarget annotationIds={["approval-center-hub-page"]}>
          <div className="shrink-0 rounded-xl border bg-card px-1 py-0 shadow-sm">
            <ApprovalCenterNavStrip
              groups={cardGroups}
              selectedCardId={selectedCardId}
              onSelectCard={setSelectedCardId}
            />
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["approval-center-preview-table"]}>
          <ApprovalCenterPreviewPanel
            card={selectedCard}
            unlockItems={unlockPreviewItems}
            onProcessUnlock={openApproval}
          />
        </PrototypeAnnotationTarget>

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
