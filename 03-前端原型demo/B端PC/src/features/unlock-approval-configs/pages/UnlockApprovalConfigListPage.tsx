import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { ConfigConfirmDialog } from "@/features/device-warning-configs/components/ConfigConfirmDialog"
import {
  DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS,
  LIST_BASE_PATH,
  PAGE_SIZE,
} from "../domain/constants"
import {
  DELETE_UNLOCK_APPROVAL_CONFIG_CONFIRM,
  type UnlockApprovalConfigAction,
} from "../domain/actions"
import type { UnlockApprovalConfig, UnlockApprovalConfigFilters } from "../domain/types"
import { DisableConfirmDialog } from "../components/DisableConfirmDialog"
import { UnlockApprovalConfigFiltersPanel } from "../components/UnlockApprovalConfigFilters"
import { UnlockApprovalConfigTable } from "../components/UnlockApprovalConfigTable"
import {
  filterUnlockApprovalConfigs,
  paginateConfigs,
} from "../lib/list-utils"
import { unlockApprovalConfigsMock } from "../mock/unlock-approval-configs.mock"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { unlockApprovalConfigListAnnotations } from "../annotations/unlock-approval-config-list.annotations"
import { unlockApprovalConfigDocuments } from "../documents/unlock-approval-config-documents"

type PendingAction =
  | { action: "disable"; config: UnlockApprovalConfig }
  | { action: "enable"; config: UnlockApprovalConfig }
  | { action: "delete"; config: UnlockApprovalConfig }
  | null

export function UnlockApprovalConfigListPage() {
  const navigate = useNavigate()
  const [draftFilters, setDraftFilters] = useState<UnlockApprovalConfigFilters>(
    DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<UnlockApprovalConfigFilters>(
    DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS
  )
  const [configs, setConfigs] = useState(unlockApprovalConfigsMock)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredConfigs = useMemo(
    () => filterUnlockApprovalConfigs(configs, appliedFilters),
    [configs, appliedFilters]
  )

  const totalPages = Math.max(1, Math.ceil(filteredConfigs.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageConfigs = useMemo(
    () => paginateConfigs(filteredConfigs, currentPage, pageSize),
    [filteredConfigs, currentPage, pageSize]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS)
    setAppliedFilters(DEFAULT_UNLOCK_APPROVAL_CONFIG_FILTERS)
    setPage(1)
  }

  const handleAction = (
    action: UnlockApprovalConfigAction,
    config: UnlockApprovalConfig
  ) => {
    switch (action) {
      case "edit":
        navigate(`${LIST_BASE_PATH}/编辑/${config.configNo}`)
        return
      case "disable":
        setPendingAction({ action: "disable", config })
        return
      case "enable":
        setPendingAction({ action: "enable", config })
        return
      case "delete":
        setPendingAction({ action: "delete", config })
        return
      default:
        return
    }
  }

  const confirmDisable = (_reason: string) => {
    if (!pendingAction || pendingAction.action !== "disable") return

    setConfigs((current) =>
      current.map((item) =>
        item.configNo === pendingAction.config.configNo
          ? { ...item, status: "已停用" }
          : item
      )
    )
    showToast("停用成功")
    setPendingAction(null)
  }

  const confirmEnable = () => {
    if (!pendingAction || pendingAction.action !== "enable") return

    setConfigs((current) =>
      current.map((item) =>
        item.configNo === pendingAction.config.configNo
          ? { ...item, status: "已启用" }
          : item
      )
    )
    showToast("启用成功")
    setPendingAction(null)
  }

  const confirmDelete = () => {
    if (!pendingAction || pendingAction.action !== "delete") return

    setConfigs((current) =>
      current.filter((item) => item.configNo !== pendingAction.config.configNo)
    )
    showToast("删除成功")
    setPendingAction(null)
  }

  return (
    <PrototypeAnnotationProvider
      title="开锁审批配置列表 · 原型批注"
      annotations={unlockApprovalConfigListAnnotations}
      documents={unlockApprovalConfigDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["unlock-approval-config-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">开锁审批</h1>
            <p className="text-sm text-muted-foreground">
              配置哪些门禁设备开锁需审批、由谁审批及超时规则
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["unlock-approval-config-filter"]}>
            <UnlockApprovalConfigFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              onAdd={() => navigate(`${LIST_BASE_PATH}/新增`)}
            />
          </PrototypeAnnotationTarget>
        </form>

        <PrototypeAnnotationTarget
          annotationIds={[
            "unlock-approval-config-table",
            "unlock-approval-config-row-actions",
          ]}
        >
          <UnlockApprovalConfigTable
            configs={pageConfigs}
            page={currentPage}
            pageSize={pageSize}
            onAction={handleAction}
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["unlock-approval-config-pagination"]}>
          <WarningListPagination
            total={filteredConfigs.length}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </PrototypeAnnotationTarget>

        <DisableConfirmDialog
          open={pendingAction?.action === "disable"}
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={confirmDisable}
        />

        <ConfigConfirmDialog
          open={pendingAction?.action === "enable"}
          title="确认启用"
          description="启用后新申请将按本配置匹配，确认启用？"
          confirmLabel="确认启用"
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={confirmEnable}
        />

        <ConfigConfirmDialog
          open={pendingAction?.action === "delete"}
          title={DELETE_UNLOCK_APPROVAL_CONFIG_CONFIRM.title}
          description={DELETE_UNLOCK_APPROVAL_CONFIG_CONFIRM.description}
          confirmLabel={DELETE_UNLOCK_APPROVAL_CONFIG_CONFIRM.confirmLabel}
          destructive
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          onConfirm={confirmDelete}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
