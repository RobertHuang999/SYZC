import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { partnerArchiveDocuments } from "../documents/partner-archive-documents"
import { partnerArchiveListAnnotations } from "../annotations/partner-archive-list.annotations"
import { partnerArchivesMock } from "../mock/partner-archives.mock"
import { PartnerArchiveFiltersPanel } from "../components/PartnerArchiveFiltersPanel"
import { PartnerArchiveTable } from "../components/PartnerArchiveTable"
import { PartnerAppendRoleDialog } from "../components/PartnerAppendRoleDialog"
import { PartnerConfirmDialog } from "../components/PartnerConfirmDialog"
import {
  DEFAULT_PARTNER_ARCHIVE_FILTERS,
  PAGE_SIZE,
} from "../domain/constants"
import type {
  PartnerArchivePendingAction,
  PartnerArchiveRowAction,
} from "../domain/actions"
import {
  ROLE_TYPE_LABELS,
  type PartnerArchiveFilters,
  type PartnerSubject,
  type RoleType,
} from "../domain/types"
import { commitPartnerArchive } from "../lib/detail-utils"
import { filterPartnerArchives, paginatePartnerArchives } from "../lib/list-utils"
import { buildAppendedRole } from "../lib/partner-archive-rules"

type PendingDialog = {
  action: PartnerArchivePendingAction
  partner: PartnerSubject
}

export function PartnerArchiveListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [dataList, setDataList] = useState<PartnerSubject[]>(() => [
    ...partnerArchivesMock,
  ])
  const [draftFilters, setDraftFilters] = useState<PartnerArchiveFilters>(
    DEFAULT_PARTNER_ARCHIVE_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<PartnerArchiveFilters>(
    DEFAULT_PARTNER_ARCHIVE_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [pendingDialog, setPendingDialog] = useState<PendingDialog | null>(null)
  const [appendRoleOpen, setAppendRoleOpen] = useState(false)
  const [activePartner, setActivePartner] = useState<PartnerSubject | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const ignoreRowActionsUntilRef = useRef(0)

  useEffect(() => {
    setDataList([...partnerArchivesMock])
  }, [location.pathname, location.key])

  const filteredData = useMemo(
    () => filterPartnerArchives(dataList, appliedFilters),
    [dataList, appliedFilters]
  )

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(
    () => paginatePartnerArchives(filteredData, currentPage, pageSize),
    [filteredData, currentPage, pageSize]
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
    setDraftFilters(DEFAULT_PARTNER_ARCHIVE_FILTERS)
    setAppliedFilters(DEFAULT_PARTNER_ARCHIVE_FILTERS)
    setPage(1)
  }

  const handleRowAction = (action: PartnerArchiveRowAction, item: PartnerSubject) => {
    if (Date.now() < ignoreRowActionsUntilRef.current) {
      return
    }
    switch (action) {
      case "appendRole":
        setActivePartner(item)
        setAppendRoleOpen(true)
        return
      case "freeze":
        setPendingDialog({ action: "freeze", partner: item })
        return
      case "unfreeze":
        setPendingDialog({ action: "unfreeze", partner: item })
        return
      default:
        return
    }
  }

  const confirmPendingDialog = (reason: string) => {
    if (!pendingDialog) {
      return
    }

    const { action, partner } = pendingDialog

    if (action === "freeze") {
      const now = new Date().toISOString().replace("T", " ").substring(0, 19)
      const next: PartnerSubject = {
        ...partner,
        status: "FROZEN",
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: now,
            operator: "当前用户",
            actionType: "FREEZE",
            actionName: "冻结主体",
            detail: `执行主体冻结管控，原因：${reason}`,
          },
          ...partner.auditLogs,
        ],
      }
      commitPartnerArchive(next)
      setDataList((prev) => prev.map((item) => (item.id === partner.id ? next : item)))
      showToast(`主体【${partner.name}】已成功冻结`)
    }

    if (action === "unfreeze") {
      const now = new Date().toISOString().replace("T", " ").substring(0, 19)
      const next: PartnerSubject = {
        ...partner,
        status: "NORMAL",
        auditLogs: [
          {
            id: `log-${Date.now()}`,
            opTime: now,
            operator: "当前用户",
            actionType: "UNFREEZE",
            actionName: "解冻主体",
            detail: reason
              ? `解冻恢复主体正常状态，说明：${reason}`
              : "解冻恢复主体正常状态",
          },
          ...partner.auditLogs,
        ],
      }
      commitPartnerArchive(next)
      setDataList((prev) => prev.map((item) => (item.id === partner.id ? next : item)))
      showToast(`主体【${partner.name}】解冻审批已通过，已恢复正常`)
    }

    ignoreRowActionsUntilRef.current = Date.now() + 300
    setPendingDialog(null)
  }

  const handleAppendRoleConfirm = (roleTypes: RoleType[]) => {
    if (!activePartner || roleTypes.length === 0) {
      return
    }
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    const appended = roleTypes.map((roleType) =>
      buildAppendedRole(activePartner, roleType, now)
    )
    const next: PartnerSubject = {
      ...activePartner,
      roles: [...activePartner.roles, ...appended],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          opTime: now,
          operator: "当前用户",
          actionType: "APPEND_ROLE",
          actionName: "追加业务角色",
          detail: appended
            .map(
              (role) =>
                `追加【${ROLE_TYPE_LABELS[role.roleType]}】，状态为${role.roleStatus === "PENDING_COMPLETION" ? "待补全" : "正常"}`
            )
            .join("；"),
        },
        ...activePartner.auditLogs,
      ],
    }
    commitPartnerArchive(next)
    setDataList((prev) => prev.map((item) => (item.id === activePartner.id ? next : item)))
    showToast(`已成功为【${activePartner.name}】追加业务角色`)
    setActivePartner(null)
  }

  return (
    <PrototypeAnnotationProvider
      annotations={partnerArchiveListAnnotations}
      documents={partnerArchiveDocuments}
      title="合作方档案列表 · 原型批注"
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["partner-archive-page"]}>
          <h1 className="text-2xl font-semibold tracking-tight">合作方档案</h1>
          <p className="text-sm text-muted-foreground">
            维护个人与企业主体身份、证件地址、业务角色及全生命周期状态，作为全平台业务单据主数据
          </p>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["partner-archive-filter"]}>
            <PartnerArchiveFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              onAdd={() => navigate("/用户中心/合作方管理/合作方档案/新增")}
            />
          </PrototypeAnnotationTarget>
        </form>

        <div className="space-y-4">
          <PrototypeAnnotationTarget
            annotationIds={["partner-archive-table", "partner-archive-row-actions"]}
          >
            <PartnerArchiveTable
              data={pageData}
              page={currentPage}
              pageSize={pageSize}
              onAction={handleRowAction}
            />
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["partner-archive-pagination"]}>
            <WarningListPagination
              total={filteredData.length}
              page={currentPage}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          </PrototypeAnnotationTarget>
        </div>

        <PartnerConfirmDialog
          open={pendingDialog?.action === "freeze"}
          title="确认冻结主体"
          description="冻结后该主体名下业务角色将暂停发起新业务单据，历史在库库存进入只读风控锁定。请录入冻结原因。"
          confirmLabel="确认冻结"
          destructive
          reasonRequired
          reasonLabel="冻结原因"
          reasonPlaceholder="请输入冻结理由（1～200 字）"
          onOpenChange={(open) => {
            if (!open) {
              setPendingDialog(null)
            }
          }}
          onConfirm={confirmPendingDialog}
        />

        <PartnerConfirmDialog
          open={pendingDialog?.action === "unfreeze"}
          title="提交解冻主体申请"
          description="解冻须风控审批终审通过后生效。请录入解冻复核依据；原型演示在确认后模拟审批通过并恢复业务发起能力。"
          confirmLabel="提交解冻申请"
          reasonRequired
          reasonLabel="解冻原因"
          reasonPlaceholder="请输入解冻复核依据（1～200 字）"
          onOpenChange={(open) => {
            if (!open) {
              setPendingDialog(null)
            }
          }}
          onConfirm={confirmPendingDialog}
        />

        <PartnerAppendRoleDialog
          partner={activePartner}
          open={appendRoleOpen}
          onOpenChange={(open) => {
            setAppendRoleOpen(open)
            if (!open) {
              setActivePartner(null)
            }
          }}
          onConfirm={handleAppendRoleConfirm}
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
